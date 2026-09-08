'use client';
import { ChatBox, createEchoAdapter } from '@mui/x-chat';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import type { ChatPartRendererMap } from '@mui/x-chat/headless';
import { reportAdapter } from '../adapter';
import SdmxTable from './SdmxTable';

// To display the results as a table from thge adapter 
const partRenderers : ChatPartRendererMap = {
  'data-sdmx-table': ({ part }) => <SdmxTable data = {part.data} />
}

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
            adapter={reportAdapter}
            localeText={{composerInputPlaceholder: 'Ask anything...'}}
            partRenderers={partRenderers}
            features={{dateDivider: true, unreadMarker: true, attachments: false}}
            initialConversations={initialConversations}
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
