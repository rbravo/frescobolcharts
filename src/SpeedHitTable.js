import React from 'react';
import Globals from './Globals';

let speedRanges = Globals.speedRanges;

function SpeedHitsTable({ sequences, groupedHits }) {
    // Function to process data for the table, similar to chart data processing
    const processDataForTable = (hits) => {
        
        const dataBySpeedRange = {};
    
        var _hits = hits && hits.playerHits ? hits.playerHits : hits;
        Object.keys(_hits).forEach((player) => {
            const playerHits = _hits[player];
            const counts = new Array(speedRanges.length).fill(0);
    
            playerHits.forEach((hit) => {
                // Determine the correct index for the speed range
                const speedIndex = speedRanges.findIndex(range => {
                    if (range.includes('+')) {
                        return hit.speed >= parseInt(range);
                    } else {
                        const [min, max] = range.split('-').map(Number);
                        return hit.speed >= min && hit.speed <= max;
                    }
                });
    
                if (speedIndex !== -1) {
                    counts[speedIndex]++;
                }
            });
    
            dataBySpeedRange[player] = counts;
        });
    
        return dataBySpeedRange;
    };
    
    // Choose the data processing function based on the props received
    const data = groupedHits ? processDataForTable(groupedHits) : null;

    // Rendering the table
    return (
        <div>
            {groupedHits && (
                <table className="table table-bordered table-hover">
                    <thead className="thead-dark">
                        <tr>
                            <th>Player</th>
                            {/* <th>35-39</th>
                            <th>40-49</th> */}
                            <th>50-59</th>
                            <th>60-69</th>
                            <th>70-79</th>
                            <th>80-89</th>
                            <th>90-99</th>
                            <th>100+</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(data).map((player, index) => (
                            <tr key={index}>
                                <td>{player}</td>
                                {data[player].map((count, index) => (
                                    <td key={index}>{count}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {sequences &&
                sequences.map((sequence, sequenceIndex) => (
                    <div key={sequenceIndex}>
                        <h3>{sequence.title}</h3>
                        <table className="table table-striped">
                            <thead className="thead-light">
                                <tr>
                                    <th>Player</th>
                                    {/* <th>35-39</th>
                                    <th>40-49</th> */}
                                    <th>50-59</th>
                                    <th>60-69</th>
                                    <th>70-79</th>
                                    <th>80-89</th>
                                    <th>90-99</th>
                                    <th>100+</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.keys(processDataForTable(sequence.hits)).map((player, index) => (
                                    <tr key={index}>
                                        <td>{player}</td>
                                        {processDataForTable(sequence.hits)[player].map((count, index) => (
                                            <td key={index}>{count}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}
        </div>
    );
}

export default SpeedHitsTable;
