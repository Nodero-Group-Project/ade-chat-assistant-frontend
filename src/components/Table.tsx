// For dummy purposes
import React from 'react'

export function Table() {
    const dummyData = {
        name: "Access to basic amenities, total household income, and tenure of household for households in occupied private dwellings, (RC, TALB, SA2, Health), 2018 and 2023 Censuses",
        year: "2023",
        area: "Total - New Zealand by regional council",
        income: {
            name: "Total household income",
            columns: [
                "Total - total household income",
                "$70,001-$100,000", 
                "$100,001-$150,000", 
                "$150,001-$200,000"
            ]
        },
        tenure: {
            name: "Tenure of household",
            values: ["Dwelling owned or partly owned", "Total - tenure of household"]
        },
        amenities: {
            name: "Access to basic amenities",
            rows: [
                { label: "Total - access to basic amenities", values: [978105, 127350, 207222, 145668] },
                { label: "Kitchen sink", values: [914826, 121293, 199788, 141612] },
                { label: "Toilet", values: [915000, 121332, 199842, 141666] }

            ]
        }
    }

    return (
        <div>
            <h4>{dummyData.name}</h4>
            <ul>
                <li>Census year: {dummyData.year}</li>
                <li>Area: {dummyData.area}</li>
                <li>{dummyData.tenure.name}: {dummyData.tenure.values[0]}</li>
            </ul>
            <table style={{width: '100%', borderCollapse: 'collapse', marginTop: '10px'}}>
                <thead>
                    <tr>
                        <th style={{backgroundColor: '#005c75', padding: '4px 8px', border: 'inherit', color: '#fff', textAlign: 'center', verticalAlign: 'top', borderRight: 'thin solid #9e9e9e', borderBottom: 'thin solid #9e9e9e'}}>{dummyData.income.name}</th>
                        {dummyData.income.columns.map((col) => (
                            <th key = {col} style={{backgroundColor: '#005c75', padding: '4px 8px', border: 'inherit', color: '#fff', textAlign: 'center', verticalAlign: 'top', borderRight: 'thin solid #9e9e9e', borderBottom: 'thin solid #9e9e9e', fontWeight: '500'}}>{col}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    <tr style={{borderBottom: 'thin solid #9e9e9e'}}>
                        <td style={{backgroundColor: '#e2f2fb', padding: '4px 8px', border: 'inherit', color: '#182026', verticalAlign: 'middle', borderRight: 'thin solid #9e9e9e', borderBottom: 'thin solid #9e9e9e'}}>{dummyData.amenities.name}</td>
                    </tr>
                    {dummyData.amenities.rows.map((row) => (
                        <tr key={row.label}>
                            <td style={{backgroundColor: '#e2f2fb', padding: '4px 8px', border: 'inherit', color: '#182026', verticalAlign: 'middle', borderRight: 'thin solid #9e9e9e', borderBottom: 'thin solid #9e9e9e', borderTop: 'thin solid #9e9e9e'}}>{row.label}</td>
                            {row.values.map((val, i) => (
                                <td key={i} style={{padding: '4px 8px', border: 'inherit', color: '#182026', verticalAlign: 'baseline', borderRight: 'thin solid #9e9e9e', borderBottom: 'thin solid #9e9e9e', whiteSpace: 'pre-wrap'}}>{val.toLocaleString()}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Table