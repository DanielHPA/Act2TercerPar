import React, { useEffect, useRef } from 'react';
import { Message } from './ChatApp';

interface MessageListProps {
    messages: Message[];
    currentUserId: string;
    isDarkMode: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, currentUserId, isDarkMode }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="space-y-4">
            {messages.length === 0 ? (
                <div className="text-center py-16">
                    <div className={`w-20 h-20 ${isDarkMode ? 'bg-gradient-to-br from-blue-500 to-cyan-500' : 'bg-gradient-to-br from-blue-500 to-indigo-500'} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl`}>
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        No messages yet
                    </h3>
                    <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}>
                        Start the conversation with a friendly hello!
                    </p>
                </div>
            ) : (
                messages.map((msg, index) => {
                    const isOwn = msg.userId === currentUserId;
                    const showAvatar = index === 0 || messages[index - 1].userId !== msg.userId;
                    
                    return (
                        <div
                            key={msg.id}
                            className={`flex items-end gap-3 ${isOwn ? 'flex-row-reverse' : 'flex-row'} animate-fadeIn`}
                        >
                            {!isOwn && (
                                <div className={`w-8 h-8 ${showAvatar ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
                                    {showAvatar && (
                                        <div className={`w-8 h-8 ${isDarkMode ? 'bg-gradient-to-br from-blue-500 to-cyan-500' : 'bg-gradient-to-br from-blue-500 to-indigo-500'} rounded-xl flex items-center justify-center text-white text-sm font-semibold shadow-lg`}>
                                            {msg.user.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                            )}
                            
                            <div className={`max-w-xs lg:max-w-md ${isOwn ? 'ml-auto' : 'mr-auto'}`}>
                                {!isOwn && showAvatar && (
                                    <div className={`text-xs font-medium mb-1 px-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}>
                                        {msg.user}
                                    </div>
                                )}
                                
                                <div className="relative group">
                                    <div className={`px-4 py-3 rounded-2xl shadow-lg backdrop-blur-sm ${
                                        isOwn
                                            ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                                            : isDarkMode
                                                ? 'bg-slate-700/80 text-white border border-slate-600/50'
                                                : 'bg-white/80 text-slate-900 border border-slate-200/50'
                                    } ${isOwn ? 'rounded-br-md' : 'rounded-bl-md'}`}>
                                        <div className="break-words">{msg.text}</div>
                                    </div>
                                    
                                    <div className={`text-xs mt-1 px-1 ${
                                        isOwn 
                                            ? 'text-right text-blue-300' 
                                            : isDarkMode 
                                                ? 'text-slate-500' 
                                                : 'text-slate-600'
                                    } opacity-0 group-hover:opacity-100 transition-opacity`}>
                                        {formatTime(msg.timestamp)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })
            )}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default MessageList;