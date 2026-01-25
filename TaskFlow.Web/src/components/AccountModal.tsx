import React, { useState } from 'react';
import { X, Shield, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../lib/api';
import { motion, AnimatePresence } from 'framer-motion';

interface AccountModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AccountModal({ isOpen, onClose }: AccountModalProps) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await api.post('/auth/change-password', { currentPassword, newPassword });
            setSuccess('Password changed successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            const data = err.response?.data;
            if (Array.isArray(data)) {
                setError(data[0]);
            } else {
                setError('Failed to change password. check current password.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-gray-900/40 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="bg-white dark:bg-gray-950 w-full max-w-md rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.3)] overflow-hidden border border-white/10 relative z-10"
                    >
                        <div className="p-8 flex justify-between items-center border-b border-gray-100 dark:border-gray-800">
                            <h2 className="text-2xl font-black dark:text-white flex items-center gap-3">
                                <Shield className="text-blue-500" size={28} />
                                Security
                            </h2>
                            <motion.button
                                whileHover={{ rotate: 90, scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-colors dark:text-gray-400"
                            >
                                <X size={24} />
                            </motion.button>
                        </div>

                        <div className="p-10">
                            <AnimatePresence mode="wait">
                                {error && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="mb-8 bg-red-50 dark:bg-red-900/20 p-5 rounded-3xl flex items-center gap-4 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/50 overflow-hidden"
                                    >
                                        <AlertCircle size={24} />
                                        <span className="text-sm font-bold">{error}</span>
                                    </motion.div>
                                )}

                                {success && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="mb-8 bg-green-50 dark:bg-green-900/20 p-5 rounded-3xl flex items-center gap-4 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-900/50 overflow-hidden"
                                    >
                                        <CheckCircle2 size={24} />
                                        <span className="text-sm font-bold">{success}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest px-2">Current Password</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                                        <input
                                            type="password"
                                            className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-3xl py-5 pl-14 pr-6 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all dark:text-white font-bold"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest px-2">New Password</label>
                                    <input
                                        type="password"
                                        className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-3xl py-5 px-6 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all dark:text-white font-bold"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        minLength={6}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest px-2">Confirm New Password</label>
                                    <input
                                        type="password"
                                        className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-3xl py-5 px-6 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all dark:text-white font-bold"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        minLength={6}
                                    />
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full py-5 rounded-3xl font-black text-lg text-white shadow-2xl transition-all duration-300 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-blue-500/40 shadow-blue-500/20'}`}
                                >
                                    {loading ? 'Processing...' : 'Update Password'}
                                </motion.button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
