import { create } from 'zustand';

import { JOIN } from '../constants/messageType';


interface WebSocketStore {
    socket: WebSocket | null;
    isConnected: boolean;
    connect: (url: string, handler: (e: MessageEvent) => void, name: string) => void;
    disconnect: () => void;
    send: (message: any) => void;
    setOnMessage: (handler: (e: MessageEvent) => void) => void;
}

export const useWebSocketStore = create<WebSocketStore>((set, get) => ({
    socket: null,
    isConnected: false,

    connect: (url, handler, name) => {
        const socket = new WebSocket(url);

        socket.onopen = () => {
            console.log('✅ WebSocket for signaling is connected');
            set({ socket, isConnected: true });

            const joinMessage = {
                type: JOIN,
                sender: name,
            };

            get().send(joinMessage);
        };

        socket.onmessage = handler;

        socket.onclose = () => {
            console.log('🔌 WebSocket disconnected');
            set({ socket: null, isConnected: false });
        };

        socket.onerror = (error) => {
            console.error('❌ WebSocket error:', error);
        };
    },

    disconnect: () => {
        const socket = get().socket;
        if (socket) {
            socket.close();
        }
        set({ socket: null, isConnected: false });
    },

    send: (message) => {
        const socket = get().socket;
        if (socket && socket.readyState === WebSocket.OPEN) {
            console.log('📨 Sent:', message);
            socket.send(JSON.stringify(message));
        } else {
            console.warn('❗ WebSocket not connected');
        }
    },

    setOnMessage: (handler) => {
        const socket = get().socket;
        if (socket) {
            socket.onmessage = handler;
        }
    }
}));
