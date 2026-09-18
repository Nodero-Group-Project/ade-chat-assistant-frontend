'use client';
import { ChatBox } from '@mui/x-chat';
import Avatar from '@mui/material/Avatar';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import type { ChatPartRendererMap } from '@mui/x-chat/headless';
import { reportAdapter } from '../adapter';
import MuiTable from './MuiTable';

// To display the results as a table from the adapter
const partRenderers: ChatPartRendererMap = {
  'data-sdmx-table': ({ part }) => <MuiTable data={part.data as any} />,
};

const theme = createTheme();
const CONVERSATION_ID = 'quickstart';

// For the initial state
const initialConversations = [{ id: CONVERSATION_ID, title: 'ADE Data Assistant' }];

const assistantAuthor = {
    id: 'assistant',
    displayName: 'ADE Data Assistant'
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
        bgcolor: 'primary.main',
        width: 32,
        height: 32,
        fontSize: 14 }}>
    </Avatar>
  );
}

export default function RenderChat() {
    return (
    <ThemeProvider theme={theme}>
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
                width: '100vw',
                height: '100vh',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
            }}
        />
    </ThemeProvider>
    );
}
