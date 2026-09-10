'use client';
import * as React from 'react';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box'; 

interface SdmxDimension {
    id: string;
    name: string;
    keyPosition: number;
    values: Array<{id: string; name: string}>;
}

interface SdmxTableProps {
    data: {
        success: boolean;
        selected_dataset?: { name: string };
        data: {
            data: {
                dataSets: Array<{ observations: Record<string, Array<number | string | null>>}>;
                structures: Array<{
                    dimensions: { observation: SdmxDimension[] };
                }>;
            };
        };
    };
}

function parseSdmx(data : SdmxTableProps['data']) {
    const structure = data.data.data.structures?.[0];
    const dataSet = data.data.data.dataSets?.[0];
    if (!structure || !dataSet) return null;
    
    const dims = [...structure.dimensions.observation].sort(
        (a, b) => a.keyPosition - b.keyPosition,
    );

    const rows = Object.entries(dataSet.observations).map(([key, valueArray], index) => {
        const indices = key.split(':').map(Number);
        const row: Record<string, unknown> = { id: index };

        dims.forEach((dim, i) => {
            row[dim.id] = dim.values[indices[i]]?.name ?? indices[i];
        });

        row.value = valueArray[0];
        return row;
    });

    return { dims, rows };
}

export default function MuiTable({data}: SdmxTableProps) {
    const parsed = React.useMemo(() => parseSdmx(data), [data]);

    if (!parsed || parsed.rows.length === 0) {
        return <Typography color="text.secondary">No data to display.</Typography>;
    }

    const { dims, rows } = parsed;

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
        <Box sx={{ height: 400, width: '100%'}}>
            <DataGrid
                rows={rows}
                columns={columns}
                slots={{toolbar: GridToolbar}}
                slotProps={{ toolbar: { showQuickFilter: true}}}
                initialState={{
                    pagination: {paginationModel: {pageSize: 10} },
                }}
                pageSizeOptions={[10, 25, 50]}
            />
        </Box>
        <Typography variant="caption" color="text.secondary">
            Total across {rows.length} row{rows.length === 1 ? '' : 's'}: {total.toLocaleString()}
        </Typography>
        </Box>
    );
}