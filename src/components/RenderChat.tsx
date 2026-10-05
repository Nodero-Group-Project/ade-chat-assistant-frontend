'use client';
import { ChatBox } from '@mui/x-chat';
import Avatar from '@mui/material/Avatar';
import { ThemeProvider, createTheme, alpha } from '@mui/material/styles';
import type { ChatPartRendererMap } from '@mui/x-chat/headless';
import { reportAdapter } from '../adapter';
import MuiTable from './MuiTable';
import TokenUsage  from './TokenUsage';
import Box from '@mui/material/Box';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PersonIcon from '@mui/icons-material/Person';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';

// To display the results as a table from the adapter
const partRenderers: ChatPartRendererMap = {
  'data-sdmx-table': ({ part }) => (
    <Box sx = {{ my: 1, padding: 2, borderRadius: 2, overflow: 'hidden', border: 1, borderColor: 'divider'}}>
        <MuiTable data={part.data as any} />
    </Box>
  ),    
  'data-token-usage': ({ part }) => (
    <TokenUsage tokens={part.data as any} />
  ),
};

// Global styling for chat interface
const theme = createTheme({
    palette: {
        mode: 'light',
        primary: { main: '#0e9aa7', contrastText: '#fff'},
        secondary: { main: '#6366f1'},
        text: { primary: '#0f172a', secondary: '#64748b'},
        background: { default: '#f6f8fc', paper: '#ffffff'},
        divider: alpha('#0f172a', 0.08),
    },
    shape: { borderRadius: 10 },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        body1: { fontSize: 15, lineHeight: 1.65},
        body2: { fontSize: 13.5 },
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
        MuiIconButton: {
            styleOverrides: {
                root: {
                    transition: 'transform .15s, background-color .15s'
                }
            }
        }
    },
});

const CONVERSATION_ID = 'quickstart';

// For the initial state
const initialConversations = [
    { 
      id: CONVERSATION_ID, 
      title: 'ADE Data Assistant',
    }
];

const assistantAuthor = {
    id: 'assistant',
    displayName: 'Assistant',
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

// For the avatar for assistant and user
function CustomAvatar() {
    return (
    <Avatar sx={{ 
        width: 34,
        height: 34,
        boxShadow: '0 2px 8px rgba(99, 102, 241, 0.35)',
        background: 'linear-gradient(135deg, #6366f1 0%, #2fc4d2 100%)',
        '& .icon-user': { display: 'none' },
        '[data-role="user"] &': {
            background: 'linear-gradient(135deg, #475569 0%, #94a3b8 100%)',
            boxShadow: '0 2px 8px rgba(71, 85, 105, 0.3)',
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
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                p: { xs: 0, sm: 3},
                background: `
                        radial-gradient(900px 400px at 15% -10%, ${alpha('#6366f1', 0.14)}, transparent 60%),
                        radial-gradient(700px 400px at 90% 0%, ${alpha('#0e9aa7', 0.14)}, transparent 60%),
                        #f6f8fc`,
            }}
        >
            <Box sx={{display: {xs: 'none', sm: 'block'}, textAlign: 'center'}}>
                <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: -0.3 }}>
                    ADE Data Assistant
                </Typography>
                <Typography variant='body2' color="text.secondary">
                    Ask questions about your data in plain language
                </Typography>
            </Box>
            <ChatBox 
            adapter={reportAdapter} // for backend connection
            suggestions={[
                'How many people smoke in 2023?',
                'How many Auckland students held a bachelor degree in 2018?',
                'How many Pacific boys in Gisborne under 18 have internet access?'
            ]}
            suggestionsAutoSubmit
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
                height: { xs: '100vh', sm: '84vh'},
                bgcolor: 'background.paper',
                border: 1,
                borderColor: 'divider',
                borderRadius: { xs: 0, sm: 5},
                boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04), 0 24px 60px rgba(15,23,42,.10)',
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
                        color: 'primary.contrastText',
                        bgcolor: 'primary.main'
                    }
                },
            }}
            />
        </Box>
    </ThemeProvider>
    );
}
