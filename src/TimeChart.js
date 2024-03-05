import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const TimeChart = ({ txtFile, sequenciaTitle }) => {

    const parseFrescobolData = (fileText) => {
        // Split the text by lines and filter out empty lines
        const lines = fileText.split('\n').filter(line => line.trim() !== '');

        // Find player names and directions
        const playerDirectionRegex = /jogador \d+ (>|<)\s+(.+)/;
        const players = {};
        lines.forEach(line => {
            const match = line.match(playerDirectionRegex);
            if (match) {
                const direction = match[1] === '>' ? '->' : '<-'; // Convert direction to match hit log symbols
                const name = match[2].trim();
                players[direction] = name;
            }
        });

        // Initialize an array to hold sequencias
        const sequencias = [];
        let currentSequencia = null;

        lines.forEach(line => {
            // Check for a new Sequência
            if (line.startsWith("SEQUÊNCIA")) {
                // If there's a currentSequencia being populated, push it to sequencias
                if (currentSequencia) {
                    sequencias.push(currentSequencia);
                }
                // Start a new sequencia
                currentSequencia = { name: line.trim(), data: [] };
            } else if (currentSequencia && line.match(/^\d/)) { // Line starts with a timestamp
                const parts = line.split(/\s+/);
                const timeStamp = parts[0];
                const direction = parts[1];
                const speed = parseInt(parts[2], 10);
                currentSequencia.data.push({
                    timeStamp,
                    direction,
                    speed,
                    player: players[direction] // Use corrected direction to get player name
                });
            }
        });

        // Push the last sequencia if exists
        if (currentSequencia) {
            sequencias.push(currentSequencia);
        }

        return sequencias;
    }


    const getChartData = (sequencia) => {
        const timestamps = sequencia.data.map(hit => hit.timeStamp);
        const players = Array.from(new Set(sequencia.data.map(hit => hit.player)));

        // Prepare datasets for each player
        const datasets = players.map(player => ({
            label: player,
            data: sequencia.data.map(hit => {
                return {
                    x: hit.timeStamp,
                    y: hit.player === player ? hit.speed : null, // Only include speed for the correct player
                };
            }),
            fill: false,
            borderColor: player === players[1] ? 'rgb(53, 162, 235)' : 'rgb(255, 99, 132)', // Differentiate colors
            backgroundColor: player === players[1] ? 'rgba(53, 162, 235, 0.5)' : 'rgba(255, 99, 132, 0.5)',
            showLine: true, // Ensure line is shown
            pointRadius: (context) => {
                // Show point only if there is a speed value
                const value = context.dataset.data[context.dataIndex];
                return value.y != null ? 5 : 0;
            },
        }));

        datasets.map(x => {
            x.data = x.data.filter(x => x.y != null);
        });

        console.log('datasets', datasets, timestamps);

        return {
            labels: timestamps,
            datasets,
        };
    };


    return (
        sequenciaTitle
            ?
            <div>
                {parseFrescobolData(txtFile).filter(x => x.name == sequenciaTitle).map((sequencia, index) => (
                    <div key={index}>
                        <h2>{sequencia.name}</h2>
                        <Line data={getChartData(sequencia)} options={{ responsive: true }} />
                    </div>
                ))}
            </div>
            :
            <div>
                {parseFrescobolData(txtFile).map((sequencia, index) => (
                    <div key={index}>
                        <h2>{sequencia.name}</h2>
                        <Line data={getChartData(sequencia)} options={{ responsive: true }} />
                    </div>
                ))}
            </div>
    );
};

export default TimeChart;
