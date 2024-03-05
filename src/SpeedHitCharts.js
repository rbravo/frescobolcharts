import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import SpeedHitsTable from './SpeedHitTable';
import CollapsibleSection from './Collapsible';
import FrescobolFileParser from './FrescobolParser';
import Globals from './Globals';
import TimeChart from './TimeChart';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

let speedRanges = Globals.speedRanges;

function processData(groupedHits) {
    const dataBySpeedRange = {};

    Object.keys(groupedHits).forEach(player => {
        const playerHits = groupedHits[player];
        const counts = new Array(speedRanges.length).fill(0);

        playerHits.forEach(hit => {
            const speedIndex = speedRanges.findIndex(range => {
                // Handle the '100+' case
                if (range.includes('+')) {
                    return hit.speed >= parseInt(range);
                }
                // Parse the range and compare
                const [min, max] = range.split('-').map(Number);
                return hit.speed >= min && hit.speed <= max;
            });
            if (speedIndex !== -1) { // Ensure the hit speed falls within the defined ranges
                counts[speedIndex]++;
            }
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

function SpeedHitCharts({ sequences, groupedHits, fullFileTxt }) {
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
            <h3>SOMATÓRIO DAS SEQUÊNCIAS</h3>
            <Bar data={chartData} options={options} style={{ paddingBottom: 20 }} />
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
                    <Bar data={chartData} options={options} style={{ paddingBottom: 20 }} />
                    <SpeedHitsTable groupedHits={sequence} />
                    <TimeChart txtFile={fullFileTxt} sequenciaTitle={sequence.title} />
                    {/* <CollapsibleSection title={'Ver dados'} content={JSON.stringify(sequence)} /> */}
                </div>
            );
        });
    }

    return null;
}

export default SpeedHitCharts;
