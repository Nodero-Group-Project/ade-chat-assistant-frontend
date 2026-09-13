'use client';
import { ChatBox } from '@mui/x-chat';
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

const initialMessages = [
 {
    id: 'welcome',
    conversationId: CONVERSATION_ID,
    role: 'assistant' as const,
    status: 'sent' as const,
    parts: [
        { type: 'text' as const, 
          text: 'Hello! I am ADE Data Assistant. Please ask a question.' 
        },
    ],
  },
];

export default function RenderChat() {
    return (
    <ThemeProvider theme={theme}>
        <ChatBox 
            adapter={reportAdapter} // for backend connection
            localeText={{composerInputPlaceholder: 'Ask anything...'}} // to change the placeholder name of the input
            partRenderers={partRenderers} // to render the results in a table
            features={{attachments: false}} // to disable the attachment feature
            initialConversations={initialConversations} // to display the initial state
            initialActiveConversationId={CONVERSATION_ID}
            initialMessages={initialMessages}
            // ChatBox fills its container 
            sx = {{
                height: 500,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
            }}
        />
    </ThemeProvider>
    );
}
