import React, { useState } from 'react';

interface SettingsProps {
    username: string;
    description: string;
    isDarkMode: boolean;
    onClose: () => void;
    onSave: (username: string, description: string) => void;
    onToggleTheme: () => void;
}

const Settings: React.FC<SettingsProps> = ({
    username,
    description,
    isDarkMode,
    onClose,
    onSave,
    onToggleTheme
}) => {
    const [newUsername, setNewUsername] = useState(username);
    const [newDescription, setNewDescription] = useState(description);
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (newUsername.trim().length < 3) {
            setError('Username must be at least 3 characters');
            return;
        }

        onSave(newUsername, newDescription);
    };

    const handleLogout = () => {
        localStorage.removeItem('username');
        localStorage.removeItem('chatMessages');
        window.location.reload();
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="relative">
                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 rounded-3xl blur-xl opacity-20 animate-pulse"></div>
                
                <div className={`relative ${isDarkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-xl rounded-3xl shadow-2xl max-w-md w-full p-8 border ${isDarkMode ? 'border-slate-700/50' : 'border-slate-200/50'}`}>
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 ${isDarkMode ? 'bg-gradient-to-br from-blue-500 to-cyan-500' : 'bg-gradient-to-br from-blue-500 to-indigo-500'} rounded-xl flex items-center justify-center shadow-lg`}>
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Settings</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className={`p-2 rounded-xl transition-all duration-300 hover:scale-105 ${isDarkMode ? 'hover:bg-slate-700/50 text-slate-400 hover:text-white' : 'hover:bg-slate-100/50 text-slate-700 hover:text-slate-900'}`}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className={`block text-sm font-semibold mb-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>
                                Username
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={newUsername}
                                    onChange={(e) => setNewUsername(e.target.value)}
                                    className={`w-full px-4 py-4 rounded-2xl ${isDarkMode
                                        ? 'bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400'
                                        : 'bg-slate-50/50 border-slate-300/50 text-slate-900 placeholder-slate-600'
                                    } border-2 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 backdrop-blur-sm`}
                                />
                                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                    <svg className={`w-5 h-5 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                            </div>
                            {error && (
                                <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                                    <p className="text-sm text-red-400 flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {error}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className={`block text-sm font-semibold mb-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>
                                Bio
                            </label>
                            <div className="relative">
                                <textarea
                                    value={newDescription}
                                    onChange={(e) => setNewDescription(e.target.value)}
                                    rows={3}
                                    className={`w-full px-4 py-4 rounded-2xl ${isDarkMode
                                        ? 'bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400'
                                        : 'bg-slate-50/50 border-slate-300/50 text-slate-900 placeholder-slate-600'
                                    } border-2 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 backdrop-blur-sm resize-none`}
                                    placeholder="Tell us about yourself..."
                                />
                                <div className="absolute right-4 top-4">
                                    <svg className={`w-5 h-5 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className={`flex items-center justify-between p-4 rounded-2xl ${isDarkMode ? 'bg-slate-700/30' : 'bg-slate-100/30'} backdrop-blur-sm`}>
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 ${isDarkMode ? 'bg-slate-600/50' : 'bg-slate-200/50'} rounded-xl flex items-center justify-center`}>
                                    {isDarkMode ? (
                                        <svg className="w-5 h-5 text-yellow-400\" fill="none\" stroke="currentColor\" viewBox="0 0 24 24">
                                            <path strokeLinecap="round\" strokeLinejoin="round\" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                        </svg>
                                    )}
                                </div>
                                <div>
                                    <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        Theme
                                    </div>
                                    <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}>
                                        {isDarkMode ? 'Dark mode' : 'Light mode'}
                                    </div>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={onToggleTheme}
                                className={`relative w-14 h-8 rounded-full transition-all duration-300 ${
                                    isDarkMode ? 'bg-blue-500' : 'bg-slate-300'
                                }`}
                            >
                                <div className={`absolute w-6 h-6 bg-white rounded-full top-1 transition-all duration-300 ${
                                    isDarkMode ? 'left-7' : 'left-1'
                                }`}></div>
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Sign Out
                        </button>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className={`flex-1 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                                    isDarkMode
                                        ? 'bg-slate-700/50 hover:bg-slate-700/70 text-white'
                                        : 'bg-slate-200/50 hover:bg-slate-200/70 text-slate-900'
                                }`}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Settings;