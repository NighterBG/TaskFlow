import React, { useState } from 'react';
import api from '../lib/api';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await api.post('/auth/register', { username, password });
            // After register, auto-login or redirect to login
            const response = await api.post('/auth/login', { username, password });
            localStorage.setItem('token', response.data.token);
            navigate('/');
        } catch (err: any) {
            console.error("Full Registration Error:", err);
            const data = err.response?.data;
            const status = err.response?.status;

            if (Array.isArray(data)) {
                setError(data[0]);
            } else if (err.message === "Network Error") {
                setError("Network Error: Could not reach the server. Check VERCEL > Settings > Environment Variables > VITE_API_URL.");
            } else {
                setError(`Error ${status || ''}: ${err.response?.data?.message || 'The server returned an error. This is usually due to an incorrect Supabase connection string in Railway.'}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="w-full max-w-lg bg-white dark:bg-gray-900 p-10 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] dark:shadow-none border border-gray-100 dark:border-gray-800 relative z-10"
            >
                <div className="text-center mb-12">
                    <motion.div
                        whileHover={{ rotate: -15, scale: 1.1 }}
                        className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl text-white font-black text-3xl mx-auto mb-6"
                    >
                        T
                    </motion.div>
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">Start New</h1>
                    <p className="text-gray-400 mt-2 font-medium">Create your TaskFlow account today</p>
                </div>

                {error && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl border border-red-100 dark:border-red-900/50 text-sm font-bold flex items-center gap-2"
                    >
                        <ShieldCheck size={18} />
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleRegister} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                            <input
                                type="email"
                                className="w-full bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 rounded-3xl py-5 pl-14 pr-6 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all dark:text-white font-bold"
                                placeholder="name@example.com"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">Create Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                            <input
                                type="password"
                                className="w-full bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 rounded-3xl py-5 pl-14 pr-6 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all dark:text-white font-bold"
                                placeholder="Minimum 6 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                        className={`w-full py-6 rounded-3xl font-black text-xl text-white shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-purple-700 shadow-indigo-500/20'}`}
                    >
                        {loading ? 'Creating...' : 'Get Started'}
                        {!loading && <ArrowRight size={20} />}
                    </motion.button>
                </form>

                <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-800 text-center">
                    <p className="text-gray-400 font-medium">
                        Already have an account?{' '}
                        <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline inline-flex items-center gap-1">
                            Sign In <LogIn size={16} />
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
