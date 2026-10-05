'use client';
import { ChatBox } from '@mui/x-chat';
import Avatar from '@mui/material/Avatar';
import { ThemeProvider, createTheme, alpha } from '@mui/material/styles';
import type { ChatPartRendererMap } from '@mui/x-chat/headless';
import { reportAdapter } from '../adapter';
import MuiTable from './MuiTable';
import Box from '@mui/material/Box';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PersonIcon from '@mui/icons-material/Person';
import CssBaseline from '@mui/material/CssBaseline';

// To display the results as a table from the adapter
const partRenderers: ChatPartRendererMap = {
  'data-sdmx-table': ({ part }) => (
    <Box sx = {{ my: 1, padding: 2, borderRadius: 2, overflow: 'hidden', border: 1, borderColor: 'divider'}}>
        <MuiTable data={part.data as any} />
    </Box>
  ),    
};

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: { main: '#0e9aa7', contrastText: '#fff'},
        background: { default: '#fbfdff', paper: '#ffffff'},
        divider: alpha('#0f172a', 0.08),
    },
    shape: { borderRadius: 10 },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        body1: { fontSize: 15, lineHeight: 1.6},
    },
    components: {
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: 24,
                    backgroundColor: '#fff',
                },
            },
        },
        MuiButtonBase: { defaultProps: {disableRipple: false }},
    },
});

const CONVERSATION_ID = 'quickstart';

// For the initial state
const initialConversations = [{ id: CONVERSATION_ID, title: 'ADE Data Assistant' }];

const assistantAuthor = {
    id: 'assistant',
    displayName: 'ADE Data Assistant',
    role: 'assistant' as const,
};

const initialMessages = [
 {
    id: 'welcome',
    conversationId: CONVERSATION_ID,
    role: 'assistant' as const,
    author: assistantAuthor,
    status: 'sent' as const,
    parts: [
        { type: 'text' as const, 
          text: 'Hello! I am ADE Data Assistant. Please ask a question.' 
        },
    ],
  },
];

function CustomAvatar() {
    return (
    <Avatar sx={{ 
        width: 34,
        height: 34,
        boxShadow: '0 2px 8px rgba(99, 102, 241, 0.35)',
        background: 'linear-gradient(135deg, #6366f1 0%, #2fc4d2 100%)',
        '& .icon-user': { display: 'none' },
        '[data-role="user"] &': {
            background: 'linear-gradient(135deg, #6366f1 0%, #2fc4d2 100%)',
            '& .icon-user': {display: 'block'},
            '& .icon-assistant': { display: 'none' },
        },
    }}>
        <AutoAwesomeIcon className="icon-assistant" sx={{fontSize: 18}}></AutoAwesomeIcon>
        <PersonIcon className="icon-user" sx={{fontSize: 18}}></PersonIcon>
    </Avatar>
  );
}

export default function RenderChat() {
    return (
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                p: { xs: 0, sm: 0},
                background: 'linear-gradient(180deg, #eef2ff 0%, #f5f7fb 100%)',
            }}
        >
            <ChatBox 
            adapter={reportAdapter} // for backend connection
            localeText={{composerInputPlaceholder: 'Ask anything...'}} // to change the placeholder name of the input
            partRenderers={partRenderers} // to render the results in a table
            initialActiveConversationId={CONVERSATION_ID}
            initialConversations={initialConversations} // to display the initial state
            initialMessages={initialMessages}
            features={{attachments: false}} // to disable the attachment feature
            slots={{messageAvatar: CustomAvatar}} // to render primitive avatar layout
            // ChatBox fills its container 
            sx = {{
                width: '100%',
                maxWidth: 1300,
                height: { xs: '100vh', sm: '88vh'},
                bgcolor: 'background.paper',
                border: 1,
                borderColor: 'divider',
                borderRadius: { xs: 0, sm: 4},
                boxShadow: '0 20px 50px rgba(15, 23, 42, 0.08)',
                overflow: 'hidden',
            }}
            slotProps={{
                composerRoot: {
                    sx: {
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 1,
                        minHeight: 56,
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        bgcolor: 'background.paper',
                        boxShadow: '0 4px 16px rgba(15, 23, 42, 0.06)',
                        transition: 'box-shadow .2s, border-color .2s',
                        '&:focus-within': {
                            borderColor: 'primary.main',
                            boxShadow: (t) => `0 0 0 3px ${alpha(t.palette.primary.main, 0.15)}`,
                        },
                    },
                },
                composerInput: {
                    sx: {
                        lineHeight: '24px',
                        fontSize: 15,
                    },
                },
                composerSendButton: {
                    sx: {
                        color: 'background.paper',
                    }
                },
            }}
            />
        </Box>
    </ThemeProvider>
    );
}
