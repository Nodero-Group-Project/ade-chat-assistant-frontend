'use client';
import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box'; 

// Describing the shape of the dimension from SDMX JSON
interface SdmxDimension {
    id: string;
    name: string;
    keyPosition: number;
    values: Array<{id: string; name: string}>;
}

interface SdmxTableProps {
    data: {
        success: boolean; // To see if the success is true or false
        selected_dataset?: { name: string }; // If there is a selected dataset, get the name of it
        data: {
            data: {
                // "observations": {
                   // "0:0:0:0:0": [
                   // 1780527,
                   // null
                  // ]
                dataSets: Array<{ observations: Record<string, Array<number | string | null>> }>;
                structures: Array<{
                    dimensions: { observation: SdmxDimension[] };
                }>;
            };
        };
    };
}


// The translation logic that turns the keyed strings "0:0:0:0:0" from observations into an array 
// of plain row objects DataGrid can render
function parseSdmx(sdmxData : SdmxTableProps['data']) {

    const structure = sdmxData.data.data.structures?.[0]; // which describes what each dimension means
    const dataSet = sdmxData.data.data.dataSets?.[0]; // which has the actual observations lookup table

    // if either is missing, return null for defensive check reasons
    if (!structure || !dataSet) return null;
    
    // Makes a brand new copy of that array so that we do not rearrange the original array
    // So copy first then sort the copy, only local dims variable is reordered
    // Sorting by key position guarantees dims[0] really is that dimension
    const dims = [...structure.dimensions.observation].sort(
        (a, b) => a.keyPosition - b.keyPosition, // If the function returns a negative number, a comes
                                                // before b, if it returns positive, b comes before a
    );

    // Object.entries turns { "0:0:0:0:0": [1780527, null] } into an array of [key, valueArray] pairs
    const rows = Object.entries(dataSet.observations).map(([key, valueArray], index) => {
        // Splits "0:0:0:0:0" into ["0", "0", "0", "0", "0"] then converts each to a number
        const indices = key.split(':').map(Number);
        const row: Record<string, unknown> = { id: index };

        // if dims[0] is "Census year" and indices[0] is 0, this fetches dims[0].values[0].name -> "2023",
        // and stores it as row["CEN23_YEAR_001"] = "2023" 
        // if that lookup somehow fails, show the raw index number instead of crashing
        dims.forEach((dim, i) => {
            row[dim.id] = dim.values[indices[i]]?.name ?? indices[i];
        });

        row.value = valueArray[0];
        return row;
    });

    return { dims, rows };
}

export default function MuiTable({data}: SdmxTableProps) {
    // only re-runs when data actually changes, not on every re-render
    const parsed = React.useMemo(() => parseSdmx(data), [data]);

    if (!parsed || parsed.rows.length === 0) {
        return <Typography color="text.secondary">No data to display.</Typography>;
    }

    const { dims, rows } = parsed;

     // Building columns
    const columns: GridColDef[] = [
        ...dims.map((dim) => ({
            field: dim.id,
            headerName: dim.name,
            flex: 1,
            minWidth: 140,
        })),
        {
            field: 'value',
            headerName: 'Value',
            type: 'number' as const,
            flex: 1,
            minWidth: 120,
            valueFormatter: (value: number) => value?.toLocaleString(),
        },
    ];

    // .reduce() walks every row, accumulating a running sum
    const total = rows.reduce(
        (sum, row) => sum + (typeof row.value === 'number' ? row.value : 0), 
        0,
    );

    return (
        <Box sx={{ my: 1}}>
            {data.selected_dataset && (
                <Typography variant="subtitle2" sx={{ mb: 0.5}}>
                    {data.selected_dataset.name}
                </Typography>
            )}
        <Box sx={{ height: 500, width: '100%'}}>
            <DataGrid
                rows={rows}
                columns={columns}
                showToolbar // for filtering
                initialState={{
                    pagination: {paginationModel: {pageSize: 5} }, // 5 rows per page
                }}
                pageSizeOptions={[5, 15, 30]} // with a dropdown to switch to 15 rows or 30 rows
            />
        </Box>
        <Typography variant="caption" color="text.secondary">
            Total across {rows.length} row{rows.length === 1 ? '' : 's'}: {total.toLocaleString()}
        </Typography>
        </Box>
    );
}