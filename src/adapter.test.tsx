import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { reportAdapter } from './adapter';
import reportResponse from './reportResponse.json';
import type { ChatMessage } from '@mui/x-chat/headless';

// Create a Vitest mock function for fetch
const mockFetch = vi.fn();

async function collectStream(stream: ReadableStream) {
    const reader = stream.getReader();
    const events = [];
    while (true) {
        const {done, value} = await reader.read();
        if (done) break;
        events.push(value);
    }
    return events;
}

beforeEach(() => {
    // Changes the value of global variable
    vi.stubGlobal('fetch', mockFetch);
});

// Reset everything after fetching
afterEach(() => {
    vi.unstubAllGlobals();
    mockFetch.mockClear();
});

const fakeMessage = (text: string): ChatMessage => ({
    id: 'msg-1',
    role: 'user',
    parts: [
        {
            type: 'text',
            text: text
        }
    ],
});

const controller = new AbortController();
const message = fakeMessage('how many people have access to basic amenities in 2023?');

describe('reportAdapter.sendMessage', () => {
    // successful backend
    it('emits table data when the backend answers successfully', async() => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: () => Promise.resolve(reportResponse),
        });
       
        const stream = await reportAdapter.sendMessage({
            message,
            messages: [message],
            signal: controller.signal,
        });
        
        const events = await collectStream(stream);

        expect(mockFetch).toHaveBeenCalledTimes(1);
        expect(mockFetch).toHaveBeenCalledWith(
            expect.stringContaining(
                '/report?q=how%20many%20people%20have%20access%20to%20basic%20amenities%20in%202023',
            ),
            expect.objectContaining({ signal: controller.signal }),
        );
        
        const messageId = (events[0] as { messageId: string }).messageId;

        expect(events).toEqual([
            { type: 'start', messageId },
            { type: 'text-start', id: 'text-1'},
            { type: 'text-delta', id: 'text-1', delta: expect.stringContaining('how many people have access to basic amenities in 2023')},
            { type: 'text-end', id: 'text-1'},
            { type: 'data-sdmx-table', id: 'sdmx-1', data: reportResponse},
            { type: 'finish', messageId},
        ]);
    });

    // failure backend
    it('falls back to the default message when the backend could not answer', async() => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: () => Promise.resolve({success: false}),
        });

        const stream = await reportAdapter.sendMessage({
            message,
            messages: [message],
            signal: controller.signal,
        });

        const events = await collectStream(stream);
        const messageId = (events[0] as { messageId: string }).messageId;

        expect(events).toEqual([
            { type: 'start', messageId },
            { type: 'text-start', id: 'text-1'},
            { type: 'text-delta', id: 'text-1', delta: "Sorry, I couldn't answer that question." },
            { type: 'text-end', id: 'text-1'},
            { type: 'finish', messageId}
        ]);
    });

    // network failure
    it('emits an error message when the request fails (not an abort)', async() => {
         mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 500,
            json: () => Promise.resolve({}),
        });

        const stream = await reportAdapter.sendMessage({
            message,
            messages: [message],
            signal: controller.signal,
        });

        const events = await collectStream(stream);
        const messageId = (events[0] as { messageId: string }).messageId;

        expect(events).toEqual([
            { type: 'start', messageId },
            { type: 'text-start', id: 'text-err'},
            { type: 'text-delta', id: 'text-err', delta: 'Something went wrong reaching the report service. Please try again.' },
            { type: 'text-end', id: 'text-err'},
            { type: 'finish', messageId}
        ]);
    });

    // abort signal
    it('emits an abort event when the signal was aborted', async() => {
         mockFetch.mockImplementationOnce(() => {
            controller.abort();
            return Promise.reject(new DOMException('Aborted', 'AbortError'));
        });

        const stream = await reportAdapter.sendMessage({
            message,
            messages: [message],
            signal: controller.signal,
        });

        const events = await collectStream(stream);
        const messageId = (events[0] as { messageId: string }).messageId;

        expect(events).toEqual([
            { type: 'start', messageId },
            { type: 'abort', messageId}
        ]);
    });
});
