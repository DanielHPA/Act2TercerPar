import React, { useState, useEffect, useRef } from 'react';
import { TypingUser } from './ChatApp';

interface MessageInputProps {
    onSendMessage: (text: string) => void;
    onTyping: (isTyping: boolean) => void;
    typingUsers: TypingUser[];
    isDarkMode: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
    onSendMessage,
    onTyping,
    typingUsers,
    isDarkMode
}) => {
    const [message, setMessage] = useState('');
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [dots, setDots] = useState('');

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (typingUsers.length > 0) {
            interval = setInterval(() => {
                setDots(prev => {
                    if (prev.length >= 3) return '';
                    return prev + '.';
                });
            }, 500);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [typingUsers.length]);

    useEffect(() => {
        if (message) {
            onTyping(true);
            
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }

            typingTimeoutRef.current = setTimeout(() => {
                onTyping(false);
                typingTimeoutRef.current = null;
            }, 3000);
        } else {
            onTyping(false);
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
                typingTimeoutRef.current = null;
            }
        }

        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
                typingTimeoutRef.current = null;
            }
        };
    }, [message, onTyping]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (message.trim()) {
            onSendMessage(message);
            setMessage('');

            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
                typingTimeoutRef.current = null;
                onTyping(false);
            }
        }
    };

    return (
        <div>
            {typingUsers.length > 0 && (
                <div className="mb-4 h-6">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-100/50'} backdrop-blur-sm`}>
                        <div className="flex gap-1">
                            <div className={`w-2 h-2 ${isDarkMode ? 'bg-blue-400' : 'bg-blue-500'} rounded-full animate-bounce`}></div>
                            <div className={`w-2 h-2 ${isDarkMode ? 'bg-blue-400' : 'bg-blue-500'} rounded-full animate-bounce`} style={{ animationDelay: '0.1s' }}></div>
                            <div className={`w-2 h-2 ${isDarkMode ? 'bg-blue-400' : 'bg-blue-500'} rounded-full animate-bounce`} style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            {typingUsers.length === 1
                                ? `${typingUsers[0].username} is typing`
                                : `${typingUsers.length} people are typing`}
                        </span>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex gap-4 items-end">
                <div className="flex-grow relative">
                    <input
                        type="text"
                        className={`w-full px-6 py-4 rounded-3xl ${
                            isDarkMode
                                ? 'bg-slate-700/50 text-white border-slate-600/50 placeholder-slate-400'
                                : 'bg-slate-100/50 text-slate-900 border-slate-300/50 placeholder-slate-600'
                        } border-2 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 backdrop-blur-sm`}
                        placeholder="Type your message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex gap-2">
                        <button
                            type="button"
                            className={`p-2 rounded-full transition-all duration-300 ${isDarkMode ? 'hover:bg-slate-600/50' : 'hover:bg-slate-200/50'}`}
                        >
                            <svg className={`w-5 h-5 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                        </button>
                    </div>
                </div>
                <button
                    type="submit"
                    className={`p-4 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                        message.trim()
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg hover:shadow-xl'
                            : isDarkMode
                                ? 'bg-slate-700/50 text-slate-500'
                                : 'bg-slate-200/50 text-slate-500'
                    }`}
                    disabled={!message.trim()}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                </button>
            </form>
        </div>
    );
};

export default MessageInput;