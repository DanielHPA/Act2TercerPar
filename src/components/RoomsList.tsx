import React, { useState } from 'react';
import { ChatRoom, User } from './ChatApp';

interface RoomsListProps {
    rooms: ChatRoom[];
    currentRoom: string;
    currentUserId: string;
    users: User[];
    isDarkMode: boolean;
    onRoomSelect: (roomId: string) => void;
    onCreateRoom: (name: string, participants: string[]) => void;
}

const RoomsList: React.FC<RoomsListProps> = ({
    rooms,
    currentRoom,
    currentUserId,
    users,
    isDarkMode,
    onRoomSelect,
    onCreateRoom
}) => {
    const [isCreatingRoom, setIsCreatingRoom] = useState(false);
    const [newRoomName, setNewRoomName] = useState('');
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

    const handleCreateRoom = (e: React.FormEvent) => {
        e.preventDefault();
        if (newRoomName.trim() && selectedUsers.length > 1) {
            onCreateRoom(
                newRoomName,
                [...selectedUsers, currentUserId]
            );
            setNewRoomName('');
            setSelectedUsers([]);
            setIsCreatingRoom(false);
        }
    };

    const getRoomName = (room: ChatRoom) => {
        if (room.isGroup) return room.name;
        const otherParticipant = room.participants
            .find(id => id !== currentUserId);
        return users.find(u => u.id === otherParticipant)?.username || room.name;
    };

    return (
        <div className="p-6 border-t border-slate-700/50">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 ${isDarkMode ? 'bg-blue-400' : 'bg-blue-500'} rounded-full animate-pulse`}></div>
                    <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        Conversations
                    </h2>
                </div>
                <button
                    onClick={() => setIsCreatingRoom(true)}
                    className={`p-3 rounded-xl transition-all duration-300 hover:scale-105 ${
                        isDarkMode
                            ? 'hover:bg-slate-700/50 text-blue-400'
                            : 'hover:bg-slate-100/50 text-blue-500'
                    }`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                </button>
            </div>

            {isCreatingRoom ? (
                <div className={`p-6 rounded-2xl ${isDarkMode ? 'bg-slate-700/30 border-slate-600/50' : 'bg-slate-100/30 border-slate-300/50'} border backdrop-blur-sm`}>
                    <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        Create Group Chat
                    </h3>
                    <form onSubmit={handleCreateRoom} className="space-y-4">
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>
                                Group Name
                            </label>
                            <input
                                type="text"
                                value={newRoomName}
                                onChange={(e) => setNewRoomName(e.target.value)}
                                className={`w-full px-4 py-3 rounded-xl ${
                                    isDarkMode
                                        ? 'bg-slate-600/50 text-white border-slate-500/50 placeholder-slate-400'
                                        : 'bg-white/50 text-slate-900 border-slate-300/50 placeholder-slate-600'
                                } border focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all backdrop-blur-sm`}
                                placeholder="Enter group name"
                            />
                        </div>

                        <div>
                            <label className={`flex items-center gap-2 text-sm font-medium mb-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Select Participants
                            </label>
                            <div className="space-y-2 max-h-32 overflow-y-auto">
                                {users
                                    .filter(user => user.id !== currentUserId)
                                    .map(user => (
                                        <label
                                            key={user.id}
                                            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                                                isDarkMode
                                                    ? 'hover:bg-slate-600/30'
                                                    : 'hover:bg-white/30'
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedUsers.includes(user.id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedUsers([...selectedUsers, user.id]);
                                                    } else {
                                                        setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                                                    }
                                                }}
                                                className="w-4 h-4 text-blue-500 rounded focus:ring-blue-500/20"
                                            />
                                            <div className={`w-8 h-8 ${isDarkMode ? 'bg-gradient-to-br from-blue-500 to-cyan-500' : 'bg-gradient-to-br from-blue-500 to-indigo-500'} rounded-lg flex items-center justify-center text-white text-sm font-semibold`}>
                                                {user.username.charAt(0).toUpperCase()}
                                            </div>
                                            <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                                {user.username}
                                            </span>
                                        </label>
                                    ))}
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105"
                            >
                                Create Group
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsCreatingRoom(false)}
                                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                                    isDarkMode
                                        ? 'bg-slate-600/50 hover:bg-slate-600/70 text-white'
                                        : 'bg-slate-200/50 hover:bg-slate-200/70 text-slate-900'
                                }`}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="space-y-2">
                    {rooms.map(room => (
                        <button
                            key={room.id}
                            onClick={() => onRoomSelect(room.id)}
                            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 hover:scale-105 ${
                                currentRoom === room.id
                                    ? isDarkMode
                                        ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/50'
                                        : 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border-blue-500/50'
                                    : isDarkMode
                                        ? 'hover:bg-slate-700/50 border-slate-700/50 hover:border-slate-600/50'
                                        : 'hover:bg-slate-100/50 border-slate-200/50 hover:border-slate-300/50'
                            } border backdrop-blur-sm group`}
                        >
                            <div className="relative">
                                {room.isGroup ? (
                                    <div className={`w-12 h-12 ${isDarkMode ? 'bg-gradient-to-br from-emerald-500 to-teal-500' : 'bg-gradient-to-br from-emerald-500 to-green-500'} rounded-xl flex items-center justify-center shadow-lg`}>
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                ) : (
                                    <div className={`w-12 h-12 ${isDarkMode ? 'bg-gradient-to-br from-blue-500 to-cyan-500' : 'bg-gradient-to-br from-blue-500 to-indigo-500'} rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                                        {getRoomName(room).charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white"></div>
                            </div>
                            <div className="flex-grow text-left">
                                <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'} group-hover:text-blue-500 transition-colors`}>
                                    {getRoomName(room)}
                                </div>
                                <div className="text-xs text-emerald-500 font-medium mt-1">
                                    ● Active
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RoomsList;