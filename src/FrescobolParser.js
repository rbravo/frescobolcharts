import React, { useState } from 'react';
import SpeedHitsChart from './SpeedHitCharts';
import FileInputComponent from './FileInputComponent';
import GameSummary from './Totais';

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
        let currentSequence = { hits: [], playerHits: {}, title: '' };
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
                    sequences.push(currentSequence);
                }
                currentSequence = { hits: [], playerHits: {}, title: line.trim() };
            }
        });

        if (currentSequence.hits.length > 0) {
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
                    <SpeedHitsChart sequences={result.sequences} />
                    <SpeedHitsChart groupedHits={result.groupedHits} />
                </div>
                : ''}
            {/* <pre>{JSON.stringify(result, null, 2)}</pre> */}
        </div>
    );
}

export default FrescobolFileParser;
