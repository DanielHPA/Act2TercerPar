import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import UsersList from './UsersList';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import LoginForm from './LoginForm';
import Settings from './Settings';
import RoomsList from './RoomsList';

// Interfaces remain the same
export interface Message {
    id: string;
    user: string;
    userId: string;
    text: string;
    timestamp: string;
}

export interface User {
    id: string;
    username: string;
    description?: string;
}

export interface TypingUser {
    userId: string;
    username: string;
    isTyping: boolean;
    roomId: string;
}

export interface ChatRoom {
    id: string;
    name: string;
    participants: string[];
    isGroup: boolean;
    messages: Message[];
}

const ChatApp: React.FC = () => {
    // State declarations remain the same
    const [socket, setSocket] = useState<Socket | null>(null);
    const [messages, setMessages] = useState<{ [key: string]: Message[] }>(() => {
        const savedMessages = localStorage.getItem('chatMessages');
        return savedMessages ? JSON.parse(savedMessages) : {};
    });
    const [users, setUsers] = useState<User[]>([]);
    const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
    const [username, setUsername] = useState<string>(() => localStorage.getItem('username') || '');
    const [description, setDescription] = useState<string>('');
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => Boolean(localStorage.getItem('username')));
    const [connectionStatus, setConnectionStatus] = useState<string>('disconnected');
    const [isDarkMode, setIsDarkMode] = useState<boolean>(() => localStorage.getItem('theme') === 'dark');
    const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
    const [currentRoom, setCurrentRoom] = useState<string>('');

    // All useEffect hooks and handlers remain the same
    useEffect(() => {
        localStorage.setItem('chatMessages', JSON.stringify(messages));
    }, [messages]);

    useEffect(() => {
        // Get the current host (will work for both localhost and network IP)
        const serverUrl = `${window.location.protocol}//${window.location.hostname}:3000`;
        const newSocket = io(serverUrl);
        setSocket(newSocket);

        newSocket.on('connect', () => {
            setConnectionStatus('connected');
            console.log('Connected to server');

            const savedUsername = localStorage.getItem('username');
            if (savedUsername) {
                newSocket.emit('join', savedUsername);
                setIsLoggedIn(true);
            }
        });

        newSocket.on('disconnect', () => {
            setConnectionStatus('disconnected');
            console.log('Disconnected from server');
        });

        return () => {
            newSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (!socket) return;

        socket.on('message', ({ roomId, message }: { roomId: string, message: Message }) => {
            setMessages(prev => ({
                ...prev,
                [roomId]: [...(prev[roomId] || []), message]
            }));
        });

        socket.on('userJoined', (user: User) => {
            setUsers(prevUsers => {
                if (!prevUsers.some(u => u.id === user.id)) {
                    return [...prevUsers, user];
                }
                return prevUsers;
            });
        });

        socket.on('userLeft', (user: User) => {
            setUsers(prevUsers => prevUsers.filter(u => u.id !== user.id));
            setTypingUsers(prevTyping => prevTyping.filter(u => u.userId !== user.id));
        });

        socket.on('usersList', (usersList: User[]) => {
            setUsers(usersList);
        });

        socket.on('chatRooms', (rooms: ChatRoom[]) => {
            setChatRooms(rooms);
            if (rooms.length > 0 && !currentRoom) {
                setCurrentRoom(rooms[0].id);
            }
        });

        socket.on('roomCreated', (room: ChatRoom) => {
            setChatRooms(prev => {
                if (!prev.some(r => r.id === room.id)) {
                    return [...prev, room];
                }
                return prev;
            });
            setCurrentRoom(room.id);
            if (room.messages) {
                setMessages(prev => ({
                    ...prev,
                    [room.id]: room.messages
                }));
            }
        });

        socket.on('userTyping', (user: TypingUser) => {
            if (user.isTyping) {
                setTypingUsers(prevTyping => {
                    if (!prevTyping.some(u => u.userId === user.userId && u.roomId === user.roomId)) {
                        return [...prevTyping, user];
                    }
                    return prevTyping;
                });
            } else {
                setTypingUsers(prevTyping =>
                    prevTyping.filter(u => !(u.userId === user.userId && u.roomId === user.roomId))
                );
            }
        });

        socket.on('userUpdated', (updatedUser: User) => {
            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user.id === updatedUser.id ? updatedUser : user
                )
            );
        });

        return () => {
            socket.off('message');
            socket.off('userJoined');
            socket.off('userLeft');
            socket.off('usersList');
            socket.off('chatRooms');
            socket.off('roomCreated');
            socket.off('userTyping');
            socket.off('userUpdated');
        };
    }, [socket, currentRoom]);

    const handleLogin = (name: string) => {
        if (socket && name.trim()) {
            setUsername(name);
            localStorage.setItem('username', name);
            socket.emit('join', name);
            setIsLoggedIn(true);
        }
    };

    const handleUserClick = (userId: string) => {
        if (socket) {
            socket.emit('startPrivateChat', userId);
        }
    };

    const sendMessage = (text: string) => {
        if (socket && text.trim() && currentRoom) {
            socket.emit('message', { roomId: currentRoom, text });
        }
    };

    const handleTyping = (isTyping: boolean) => {
        if (socket && currentRoom) {
            socket.emit('typing', { roomId: currentRoom, isTyping });
        }
    };

    const createRoom = (name: string, participants: string[]) => {
        if (socket) {
            socket.emit('createRoom', { name, participants });
        }
    };

    const updateUserSettings = (newUsername: string, newDescription: string) => {
        if (socket && newUsername.trim()) {
            setUsername(newUsername);
            localStorage.setItem('username', newUsername);
            setDescription(newDescription);
            socket.emit('updateUser', {
                username: newUsername,
                description: newDescription
            });
            setIsSettingsOpen(false);
        }
    };

    const toggleTheme = () => {
        const newTheme = !isDarkMode;
        setIsDarkMode(newTheme);
        localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    };

    const getCurrentUser = () => {
        const otherUserId = currentRoom?.split('_')[1];
        return users.find(u => u.id === otherUserId);
    };

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900' : 'bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50'}`}>
            <div className="h-screen flex">
                {!isLoggedIn ? (
                    <div className="flex-grow flex items-center justify-center">
                        <LoginForm onLogin={handleLogin} isDarkMode={isDarkMode} />
                    </div>
                ) : (
                    <>
                        <aside className={`w-80 flex flex-col backdrop-blur-lg ${isDarkMode ? 'bg-slate-800/90 text-white border-slate-700/50' : 'bg-white/90 text-slate-900 border-slate-200/50'} border-r`}>
                            <div className={`p-6 h-20 flex items-center justify-between ${isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'} border-b ${isDarkMode ? 'border-slate-700/50' : 'border-slate-200/50'}`}>
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <img
                                            src="/logo.png"
                                            alt="Chat Logo"
                                            className="w-10 h-10 object-cover rounded-xl shadow-lg"
                                        />
                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white"></div>
                                    </div>
                                    <h1 className={`text-2xl font-bold bg-gradient-to-r ${isDarkMode ? 'from-blue-400 to-cyan-400' : 'from-blue-600 to-indigo-600'} bg-clip-text text-transparent`}>
                                        Chattify
                                    </h1>
                                </div>
                                <button
                                    onClick={() => setIsSettingsOpen(true)}
                                    className={`p-3 rounded-xl transition-all duration-300 ${isDarkMode ? 'hover:bg-slate-700/50 text-slate-300 hover:text-white' : 'hover:bg-slate-100/50 text-slate-700 hover:text-slate-900'} hover:scale-105`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </button>
                            </div>
                            <div className="flex-grow overflow-y-auto">
                                <UsersList
                                    users={users}
                                    currentUserId={socket?.id || ''}
                                    isDarkMode={isDarkMode}
                                    onSettingsClick={() => setIsSettingsOpen(true)}
                                    onUserClick={handleUserClick}
                                />
                                <RoomsList
                                    rooms={chatRooms}
                                    currentRoom={currentRoom}
                                    currentUserId={socket?.id || ''}
                                    users={users}
                                    isDarkMode={isDarkMode}
                                    onRoomSelect={setCurrentRoom}
                                    onCreateRoom={createRoom}
                                />
                            </div>
                        </aside>

                        <main className={`flex-grow flex flex-col ${isDarkMode ? 'bg-slate-800/30' : 'bg-white/30'} backdrop-blur-sm`}>
                            {currentRoom ? (
                                <>
                                    <div className={`p-6 h-20 flex items-center gap-4 backdrop-blur-lg ${isDarkMode ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/50 border-slate-200/50'} border-b`}>
                                        <div className="relative">
                                            <div className={`w-12 h-12 ${isDarkMode ? 'bg-gradient-to-br from-blue-500 to-cyan-500' : 'bg-gradient-to-br from-blue-500 to-indigo-500'} rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                                                {getCurrentUser()?.username.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white"></div>
                                        </div>
                                        <div>
                                            <div className={`font-semibold text-lg ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                                {getCurrentUser()?.username}
                                            </div>
                                            <div className="text-sm text-emerald-500 font-medium">● Online</div>
                                        </div>
                                    </div>
                                    <div className={`flex-grow overflow-y-auto p-6 ${isDarkMode ? 'bg-slate-900/20' : 'bg-white/20'}`}>
                                        <MessageList
                                            messages={messages[currentRoom] || []}
                                            currentUserId={socket?.id || ''}
                                            isDarkMode={isDarkMode}
                                        />
                                    </div>
                                    <div className={`p-6 backdrop-blur-lg ${isDarkMode ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/50 border-slate-200/50'} border-t`}>
                                        <MessageInput
                                            onSendMessage={sendMessage}
                                            onTyping={handleTyping}
                                            typingUsers={typingUsers.filter(u => u.userId !== socket?.id && u.roomId === currentRoom)}
                                            isDarkMode={isDarkMode}
                                        />
                                    </div>
                                </>
                            ) : (
                                <div className="flex-grow flex items-center justify-center">
                                    <div className="text-center">
                                        <div className={`w-24 h-24 ${isDarkMode ? 'bg-gradient-to-br from-blue-500 to-cyan-500' : 'bg-gradient-to-br from-blue-500 to-indigo-500'} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl`}>
                                            <img src="/logo.png"/>
                                        </div>
                                        <h3 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                            Start chatting
                                        </h3>
                                        <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}>
                                            Select a user or create a group
                                        </p>
                                    </div>
                                </div>
                            )}
                        </main>
                    </>
                )}

                {isSettingsOpen && (
                    <Settings
                        username={username}
                        description={description}
                        isDarkMode={isDarkMode}
                        onClose={() => setIsSettingsOpen(false)}
                        onSave={updateUserSettings}
                        onToggleTheme={toggleTheme}
                    />
                )}
            </div>
        </div>
    );
};

export default ChatApp;