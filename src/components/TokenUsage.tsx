import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import BoltIcon from '@mui/icons-material/Bolt';
import * as React from 'react';
import {useState} from 'react';
import Collapse from '@mui/material/Collapse';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';

type Counts = { input: number; cached: number; output: number; reasoning: number };
type Usage = Counts & { steps?: Record<string, Counts> };

export default function TokenUsage({ tokens }: { tokens: Usage }) {
    const [open, setOpen] = useState(false);
    const total = tokens.input + tokens.output;
    const rows = [['Total', tokens] as const, ...Object.entries(tokens.steps ?? {})];

    return (
        <Box sx={{ mt: 1 }}>
            <Chip
                size="small"
                variant="outlined"
                icon={<BoltIcon />}
                label={`${total.toLocaleString()} tokens`}
                onClick={() => setOpen((o) => !o)}
                sx={{color: 'text.secondary'}}
            />
            <Collapse in={open}>
                <Table size="small" sx={{ mt: 1, '& td, & th': { fontSize: 12, py: 0.5}}}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Steps</TableCell>
                            <TableCell align='right'>Input</TableCell>
                            <TableCell align='right'>Output</TableCell>
                            <TableCell align='right'>Reasoning</TableCell>
                            <TableCell align='right'>Cached</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map(([name, c]) => (
                            <TableRow key={name}>
                                <TableCell>{name.replace(/_/g, '')}</TableCell>
                                <TableCell align='right'>{c.input.toLocaleString()}</TableCell>
                                <TableCell align='right'>{c.output.toLocaleString()}</TableCell>
                                <TableCell align='right'>{c.reasoning.toLocaleString()}</TableCell>
                                <TableCell align='right'>{c.cached.toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Collapse>
        </Box>
    )
};