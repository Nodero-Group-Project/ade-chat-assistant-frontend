import type { ChatAdapter } from "@mui/x-chat/headless";

export const reportAdapter : ChatAdapter = {
    async sendMessage({message, signal}) {
        const text = message.parts[0]?.type === 'text' ? message.parts[0].text : '';

        return new ReadableStream({
            async start(controller) {
                const messageId = `msg-${Date.now()}`;
                controller.enqueue({ type: 'start', messageId});

                try {
                    const res = await fetch(
                        `${import.meta.env.VITE_API_URL}/report?q=${encodeURIComponent(text)}`,
                        { signal }
                    );
                    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
                    const data = await res.json();

                    // Backend says the question could not be answered
                    if (!data.success) {
                        controller.enqueue({
                            type: 'text-start',
                            id: 'text-1',
                        });

                        controller.enqueue({
                            type: 'text-delta',
                            id: 'text-1',
                            delta: data.message || "Sorry, I couldn't answer that question.",
                        });

                        controller.enqueue({
                            type: 'text-end',
                            id: 'text-1',
                        });

                        controller.enqueue({
                            type: 'finish',
                            messageId,
                        });

                        return;
                    }
                
                    // Backend successfuly retrieved data
                    controller.enqueue({ type: 'text-start', id: 'text-1' });
                    controller.enqueue({
                        type: 'text-delta',
                        id: 'text-1',
                        delta: `Here's what I found for "${text}":`,
                    });
                    controller.enqueue({ type: 'text-end', id: 'text-1'});

                    controller.enqueue({
                        type: 'data-sdmx-table',
                        id: 'sdmx-1',
                        data, // the raw SDMX JSON from my FastAPI response
                    });

                    controller.enqueue({ type: 'finish', messageId});
                } catch (err) {
                    if (signal.aborted) {
                        // User clicked stop
                        controller.enqueue({type: 'abort', messageId});
                    } else {
                        // A real failure
                        controller.enqueue({ type: 'text-start', id: 'text-err'});
                        controller.enqueue({
                            type: 'text-delta',
                            id: 'text-err',
                            delta: 'Something went wrong reaching the report service. Please try again.',
                        });
                        controller.enqueue({type: 'text-end', id: 'text-err'});
                        controller.enqueue({type: 'finish', messageId});
                    }
                    
                } finally {
                    controller.close();
                }
            },
        });
    },
};