import React from 'react';
import { User } from './ChatApp';

interface UsersListProps {
    users: User[];
    currentUserId: string;
    isDarkMode: boolean;
    onSettingsClick: () => void;
    onUserClick: (userId: string) => void;
}

const UsersList: React.FC<UsersListProps> = ({
    users,
    currentUserId,
    isDarkMode,
    onUserClick
}) => {
    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 ${isDarkMode ? 'bg-emerald-400' : 'bg-emerald-500'} rounded-full animate-pulse`}></div>
                    <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        Online ({users.filter(u => u.id !== currentUserId).length})
                    </h2>
                </div>
            </div>

            {users.filter(user => user.id !== currentUserId).length === 0 ? (
                <div className="text-center py-8">
                    <div className={`w-16 h-16 ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-200/50'} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                        <svg className={`w-8 h-8 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}>
                        No other users online
                    </p>
                </div>
            ) : (
                <div className="space-y-2">
                    {users
                        .filter(user => user.id !== currentUserId)
                        .map((user) => (
                            <button
                                key={user.id}
                                onClick={() => onUserClick(user.id)}
                                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 hover:scale-105 ${
                                    isDarkMode
                                        ? 'hover:bg-slate-700/50 border border-slate-700/50 hover:border-slate-600/50'
                                        : 'hover:bg-slate-100/50 border border-slate-200/50 hover:border-slate-300/50'
                                } backdrop-blur-sm group`}
                            >
                                <div className="relative">
                                    <div className={`w-12 h-12 ${isDarkMode ? 'bg-gradient-to-br from-blue-500 to-cyan-500' : 'bg-gradient-to-br from-blue-500 to-indigo-500'} rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:shadow-xl transition-shadow`}>
                                        {user.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white animate-pulse"></div>
                                </div>
                                <div className="flex-grow text-left">
                                    <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'} group-hover:text-blue-500 transition-colors`}>
                                        {user.username}
                                    </div>
                                    {user.description && (
                                        <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-700'} truncate mt-1`}>
                                            {user.description}
                                        </div>
                                    )}
                                    <div className="text-xs text-emerald-500 font-medium mt-1">
                                        ● Active now
                                    </div>
                                </div>
                                <div className={`opacity-0 group-hover:opacity-100 transition-opacity ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </button>
                        ))}
                </div>
            )}
        </div>
    );
};

export default UsersList;