import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import SpeedHitsTable from './SpeedHitTable';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const speedRanges = ['35-39', '40-49', '50-59', '60-69', '70-79', '80-89', '90-99', '100+'];

function processData(groupedHits) {
    const dataBySpeedRange = {};

    Object.keys(groupedHits).forEach(player => {
        const playerHits = groupedHits[player];
        const counts = new Array(speedRanges.length).fill(0);

        playerHits.forEach(hit => {
            const speedIndex = Math.min(Math.floor((hit.speed - 35) / 10), speedRanges.length - 1);
            counts[speedIndex]++;
        });

        dataBySpeedRange[player] = counts;
    });

    return dataBySpeedRange;
}

function generateChartData(dataBySpeedRange) {
    return {
        labels: speedRanges,
        datasets: Object.keys(dataBySpeedRange).map((player, index) => ({
            label: player,
            data: dataBySpeedRange[player],
            backgroundColor: index % 2 === 0 ? 'rgba(255, 99, 132, 0.5)' : 'rgba(54, 162, 235, 0.5)',
        })),
    };
}

function SpeedHitCharts({ sequences, groupedHits }) {
    if (!groupedHits && !sequences) {
        return <p>Loading data or data not available...</p>;
    }

    const options = {
        plugins: {
            title: {
                display: true,
                text: 'Número de golpes por faixa de velocidade (em Km/h)',
                //text: 'Number of Hits by Speed Range',
            },
        },
        scales: {
            x: {
                stacked: false,
            },
            y: {
                stacked: false,
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Number of Hits',
                },
            },
        },
    };

    // Handling aggregated chart with groupedHits
    if (groupedHits) {
        const processedData = processData(groupedHits);
        const chartData = generateChartData(processedData);
        return <div>
            <h3>Somatório das sequências</h3>
            <Bar data={chartData} options={options} />
            <SpeedHitsTable groupedHits={groupedHits} />
        </div>

    }

    // Handling individual sequence charts
    if (sequences) {
        return sequences.map((sequence, index) => {
            if (!sequence.hits || sequence.title === undefined) {
                console.error('Sequence data is missing hits or title');
                return null;
            }

            // Process each sequence's hits individually
            const sequenceGroupedHits = sequence.hits.reduce((acc, hit) => {
                if (!acc[hit.playerName]) acc[hit.playerName] = [];
                acc[hit.playerName].push({ speed: hit.speed });
                return acc;
            }, {});

            const processedData = processData(sequenceGroupedHits);
            const chartData = generateChartData(processedData);

            return (
                <div key={index}>
                    <h3>{sequence.title}</h3>
                    <Bar data={chartData} options={options} />
                    <SpeedHitsTable groupedHits={sequence} />
                </div>
            );
        });
    }

    return null;
}

export default SpeedHitCharts;
