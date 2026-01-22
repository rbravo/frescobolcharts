import React, { useState } from 'react';
import SpeedHitsChart from './SpeedHitCharts';
import FileInputComponent from './FileInputComponent';
import GameSummary from './Totais';
import TimeChart from './TimeChart';


const getSpeedMultiplier = (speed) => {
    if (speed < 50) return 0;
    if (speed >= 100) return 2.0;
    if (speed >= 95) return 1.9;
    if (speed >= 90) return 1.8;
    if (speed >= 85) return 1.7;
    if (speed >= 80) return 1.6;
    if (speed >= 75) return 1.5;
    if (speed >= 70) return 1.4;
    if (speed >= 65) return 1.3;
    if (speed >= 60) return 1.2;
    if (speed >= 55) return 1.1;
    return 1.0; // 50-54 km/h
};

const calculatePoints = (speed) => {
    //return speed < 50 ? 0 : speed*speed/50;
    const multiplier = getSpeedMultiplier(speed);
    var ret = speed * multiplier;
    console.log(`Speed: ${speed}, Multiplier: ${multiplier}, Points: ${ret}`);
    var roundedPoints = Math.round(ret);
    console.log(`Rounded Points: ${roundedPoints}`);
    return roundedPoints;
    //return ret;
};

function FrescobolFileParser() {
    const [result, setResult] = useState(null);
    const [txtFile, setTxtFile] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            setTxtFile(content);
            const jsonResult = parseFrescobolFile(content);
            setResult(jsonResult);
        };
        reader.readAsText(file);
    };

    const parseFrescobolFile = (content) => {
        const lines = content.split('\n');
        const sequences = [];
        let currentSequence = { hits: [], playerHits: {}, title: '', totalPoints: 0 };
        let players = {};

        lines.forEach(line => {
            if (line.includes('jogador 1 >')) {
                players['player1'] = line.split('>')[1].trim();
            } else if (line.includes('jogador 2 <')) {
                players['player2'] = line.split('<')[1].trim();
            } else if (line.startsWith('TEMPO')) {
                currentSequence.hits = [];
                currentSequence.playerHits = {};
            } else if (line.match(/^\d/)) { // Starts with a digit
                const [time, direction, speed] = line.split(/\s+/);
                const playerName = direction === '->' ? players.player1 : players.player2;
                var hit = {
                    playerName,
                    direction,
                    speed: parseFloat(speed),
                };
                currentSequence.hits.push(hit);
                if (!currentSequence.playerHits[playerName]) {
                    currentSequence.playerHits[playerName] = [];
                }
                currentSequence.playerHits[playerName].push(hit);
            } else if (line.includes('SEQUÊNCIA')) {
                if (currentSequence.hits.length > 0) {
                    currentSequence.totalPoints = currentSequence.hits
                        .filter(hit => hit.speed >= 50)
                        .reduce((sum, hit) => sum + calculatePoints(hit.speed), 0);
                    currentSequence.totalPoints = parseFloat(currentSequence.totalPoints.toFixed(2));
                    sequences.push(currentSequence);
                }
                currentSequence = { hits: [], playerHits: {}, title: line.trim(), totalPoints: 0 };
            }
        });

        if (currentSequence.hits.length > 0) {
            currentSequence.totalPoints = currentSequence.hits
                .filter(hit => hit.speed >= 50)
                .reduce((sum, hit) => sum + calculatePoints(hit.speed), 0);
            currentSequence.totalPoints = parseFloat(currentSequence.totalPoints.toFixed(2));

            sequences.push(currentSequence);
        }

        // Group hits across all sequences for the overall summary
        const groupedHits = {};
        sequences.forEach(sequence => {
            sequence.hits.forEach(hit => {
                if (!groupedHits[hit.playerName]) {
                    groupedHits[hit.playerName] = [];
                }
                groupedHits[hit.playerName].push({
                    direction: hit.direction,
                    speed: hit.speed,
                });
            });
        });

        return {
            sequences, // Each sequence with its own hits, grouped by player
            groupedHits // All hits grouped by player across sequences
        };
    };



    return (
        <div>
            <FileInputComponent handleFileChange={handleFileChange} />
            {result ?
                <div>
                    <GameSummary fileContent={txtFile} />
                    <SpeedHitsChart sequences={result.sequences} fullFileTxt={txtFile} />
                    <SpeedHitsChart groupedHits={result.groupedHits} sequences={result.sequences} />
                </div>
                : ''}
            {/* <pre>{JSON.stringify(result, null, 2)}</pre> */}
        </div>
    );
}

export { calculatePoints };
export default FrescobolFileParser;
