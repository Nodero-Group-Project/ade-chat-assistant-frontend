import React, { useState, useEffect } from 'react';

interface SdmxTableProps {
    data: any;
}

const SdmxTable = ({ data: sdmxData }: SdmxTableProps) => {
    
    // If there is no sdmxData returned return no data available
    if (!sdmxData) return <p>No data available</p>;

    const dataset = sdmxData.data.data.dataSets[0]; // to use the observations from the dataset
    const structure = sdmxData.data.data.structures[0]; // to use the dimensions from the structure
    const dimensions = structure.dimensions.observation; // array of dimension info
    const observations = dataset.observations; // the actual values, keyed by weird strings

    // build headers - one per 'row' dimension, then one per income bracket
    const headers = [];
    for (let i = 0; i < dimensions.length; i++) {
            headers.push(dimensions[i].name);
    }
    headers.push('Value');

    // group observations into rows
    const rows = [];
    for (const key in observations) {
        // key looks like "0:0:1:0:0" - split into ["0", "0", "1", "0", "0"]
        // then convert each piece to a number: [0, 0, 1, 0, 0]
        // each number is a position in that dimension's values array - not an id
        const indices = key.split(':').map(Number); 

        // for each position, look up the matching dimension and pull out
        // the readable name at that index
        const rowCells = [];
        for (let i = 0; i < indices.length; i++) {
                const dimension = dimensions[i]; // e.g. "Tenure of household"
                const valueIndex = indices[i]; // e.g. 1
                const matchedValue = dimension.values[valueIndex];
                rowCells.push(matchedValue.name);
        }

        const observationValue = observations[key][0];
        rows.push({cells: rowCells, value: observationValue});
    }

    return (
        <div>
            <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '20px'}}>
                <thead>
                    <tr>
                        {headers.map((header, i) => (
                            <th key={i} style={{ backgroundColor: '#005c75', padding: '4px 8px', border: 'inherit', color: '#fff', textAlign: 'center', verticalAlign: 'top', borderRight: 'thin solid #9e9e9e', borderBottom: 'thin solid #9e9e9e'}}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, i) => (
                        <tr key={i} style={{borderBottom: 'thin solid #9e9e9e'}}>
                            {row.cells.map((cell, j) => (
                                <td key={j} style={{padding: '4px 8px', border: 'inherit', color: '#182026', verticalAlign: 'baseline', borderRight: 'thin solid #9e9e9e', borderBottom: 'thin solid #9e9e9e', whiteSpace: 'pre-wrap'}}>{cell}</td>
                            ))}
                            <td>{row.value.toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default SdmxTable;