import { useEffect, useState } from 'react';
import { X, Trophy, Star, CheckCircle, Palette, GripVertical, Clock, Plus, Lock } from 'lucide-react';
import api from '../lib/api';
import { motion, AnimatePresence } from 'framer-motion';

interface Achievement {
    id: number;
    name: string;
    description: string;
    iconKey: string;
    isEarned: boolean;
    earnedAt: string | null;
}

interface AchievementModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const IconMap: Record<string, any> = {
    Plus,
    GripVertical,
    CheckCircle,
    Clock,
    Palette
};

export default function AchievementModal({ isOpen, onClose }: AchievementModalProps) {
    const [achievements, setAchievements] = useState<Achievement[]>([]);

    useEffect(() => {
        if (isOpen) {
            fetchAchievements();
        }
    }, [isOpen]);

    const fetchAchievements = async () => {
        try {
            const response = await api.get('/achievements');
            setAchievements(response.data);
        } catch (error) {
            console.error("Failed to fetch achievements", error);
        }
    };

    const earnedCount = achievements.filter(a => a.isEarned).length;
    const totalCount = achievements.length;
    const progress = totalCount > 0 ? (earnedCount / totalCount) * 100 : 0;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-gray-950/60 backdrop-blur-xl"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 40 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="bg-white dark:bg-gray-950 w-full max-w-2xl rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden border border-white/10 relative z-10 max-h-[90vh] flex flex-col"
                    >
                        <div className="p-10 flex justify-between items-center border-b border-gray-100 dark:border-gray-800">
                            <div className="flex flex-col gap-1">
                                <h2 className="text-4xl font-black dark:text-white flex items-center gap-4">
                                    <Trophy className="text-yellow-500" size={36} />
                                    Trophy Cabinet
                                </h2>
                                <p className="text-gray-400 font-bold ml-12">You have unlocked {earnedCount} of {totalCount} badges</p>
                            </div>
                            <motion.button
                                whileHover={{ rotate: 90, scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={onClose}
                                className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-3xl transition-colors dark:text-gray-400"
                            >
                                <X size={28} />
                            </motion.button>
                        </div>

                        <div className="flex-grow p-10 overflow-y-auto custom-scrollbar">
                            {/* Progress Bar */}
                            <div className="mb-12 bg-gray-100 dark:bg-gray-900 rounded-full h-4 overflow-hidden relative">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 shadow-[0_0_20px_rgba(245,158,11,0.5)]"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {achievements.map((achievement) => {
                                    const Icon = IconMap[achievement.iconKey] || Star;
                                    return (
                                        <motion.div
                                            key={achievement.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`p-6 rounded-[2rem] border-2 transition-all relative overflow-hidden group ${achievement.isEarned ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 border-yellow-200 dark:border-yellow-900/30' : 'bg-gray-50/50 dark:bg-gray-900/50 border-gray-100 dark:border-gray-800 opacity-60 grayscale'}`}
                                        >
                                            {achievement.isEarned && (
                                                <div className="absolute top-0 right-0 p-3">
                                                    <Star className="text-yellow-500 fill-yellow-500" size={16} />
                                                </div>
                                            )}

                                            <div className="flex items-center gap-6">
                                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-6 ${achievement.isEarned ? 'bg-white dark:bg-gray-800 text-yellow-600' : 'bg-gray-200 dark:bg-gray-800 text-gray-400'}`}>
                                                    {achievement.isEarned ? <Icon size={32} /> : <Lock size={28} />}
                                                </div>
                                                <div className="flex flex-col">
                                                    <h3 className={`text-xl font-black ${achievement.isEarned ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                                                        {achievement.name}
                                                    </h3>
                                                    <p className="text-sm font-bold text-gray-500 line-clamp-2">
                                                        {achievement.description}
                                                    </p>
                                                    {achievement.isEarned && achievement.earnedAt && (
                                                        <span className="text-[10px] uppercase tracking-widest font-black text-yellow-600 mt-2">
                                                            Earned {new Date(achievement.earnedAt).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
