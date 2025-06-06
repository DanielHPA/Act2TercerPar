import React, { useState } from 'react';

interface LoginFormProps {
    onLogin: (username: string) => void;
    isDarkMode: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, isDarkMode }) => {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (username.trim().length < 3) {
            setError('Username must be at least 3 characters');
            return;
        }

        onLogin(username);
    };

    return (
        <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 rounded-3xl blur-xl opacity-20 animate-pulse"></div>
            
            <div className={`relative ${isDarkMode ? 'bg-slate-800/90' : 'bg-white/90'} backdrop-blur-xl p-10 rounded-3xl shadow-2xl max-w-md w-full border ${isDarkMode ? 'border-slate-700/50' : 'border-slate-200/50'}`}>
                <div className="flex flex-col items-center mb-8">
                    <div className="relative mb-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-indigo-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl">
                            <img src="/logo.png"/>
                        </div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white animate-bounce"></div>
                    </div>
                    <h1 className={`text-3xl font-bold bg-gradient-to-r ${isDarkMode ? 'from-blue-400 to-cyan-400' : 'from-blue-600 to-indigo-600'} bg-clip-text text-transparent mb-2`}>
                        LogIn Chattify
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="username" className={`block text-sm font-semibold mb-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>
                            Username:
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                id="username"
                                className={`w-full px-4 py-4 rounded-2xl ${isDarkMode
                                    ? 'bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400'
                                    : 'bg-slate-50/50 border-slate-300/50 text-slate-900 placeholder-slate-600'
                                } border-2 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 backdrop-blur-sm`}
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                autoFocus
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

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 hover:from-blue-600 hover:via-indigo-600 hover:to-cyan-600 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                    >
                        <span className="flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                            </svg>
                            Enter
                        </span>
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;