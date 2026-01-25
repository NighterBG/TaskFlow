import { useEffect, useState } from 'react';
import { X, RotateCcw, Trash2, History, PackageOpen } from 'lucide-react';
import api from '../lib/api';
import { motion, AnimatePresence } from 'framer-motion';

interface Task {
    id: number;
    title: string;
    description: string;
    status: number;
    color: string;
    archivedAt: string | null;
}

interface HistoryDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onRestore: (task: Task) => void;
}

export default function HistoryDrawer({ isOpen, onClose, onRestore }: HistoryDrawerProps) {
    const [archivedTasks, setArchivedTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchArchivedTasks();
        }
    }, [isOpen]);

    const fetchArchivedTasks = async () => {
        setLoading(true);
        try {
            const response = await api.get('/tasks/archived');
            setArchivedTasks(response.data);
        } catch (error) {
            console.error("Failed to fetch archived tasks", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePermanent = async (id: number) => {
        try {
            await api.delete(`/tasks/${id}`);
            setArchivedTasks(prev => prev.filter(t => t.id !== id));
        } catch (error) {
            console.error("Failed to delete task permanently", error);
        }
    };

    const handleRestoreInternal = async (task: Task) => {
        try {
            await api.post(`/tasks/${task.id}/restore`);
            setArchivedTasks(prev => prev.filter(t => t.id !== task.id));
            onRestore(task);
        } catch (error) {
            console.error("Failed to restore task", error);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[120] bg-gray-950/40 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed top-0 right-0 h-full w-full max-w-xl bg-white dark:bg-gray-950 shadow-[-50px_0_100px_rgba(0,0,0,0.3)] z-[130] flex flex-col border-l border-gray-100 dark:border-gray-800"
                    >
                        <div className="p-8 flex justify-between items-center border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/20">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                                    <History size={24} />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black dark:text-white tracking-tighter">History</h2>
                                    <p className="text-sm font-bold text-gray-400">Archived treasures & past victories</p>
                                </div>
                            </div>
                            <motion.button
                                whileHover={{ rotate: 90, scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={onClose}
                                className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-colors dark:text-gray-400"
                            >
                                <X size={24} />
                            </motion.button>
                        </div>

                        <div className="flex-grow p-8 overflow-y-auto custom-scrollbar">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-400">
                                    <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                                    <span className="font-bold">Retrieving records...</span>
                                </div>
                            ) : archivedTasks.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full gap-6 opacity-40">
                                    <PackageOpen size={80} className="text-gray-300 dark:text-gray-700" />
                                    <div className="text-center">
                                        <h3 className="text-2xl font-black dark:text-white">Nothing Archived</h3>
                                        <p className="text-gray-500 font-bold max-w-xs mx-auto">Your history is as clean as a whistle! Archive some tasks to see them here.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {archivedTasks.map((task) => (
                                        <motion.div
                                            key={task.id}
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="group relative bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800 p-6 rounded-3xl hover:shadow-xl transition-all"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-grow pr-12">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <div
                                                            className="w-3 h-3 rounded-full"
                                                            style={{ backgroundColor: task.color || '#3b82f6' }}
                                                        />
                                                        <h4 className="text-lg font-black dark:text-white line-clamp-1 group-hover:line-clamp-none transition-all">
                                                            {task.title}
                                                        </h4>
                                                    </div>
                                                    <p className="text-sm font-bold text-gray-500 line-clamp-2">
                                                        {task.description || "No description provided."}
                                                    </p>
                                                    {task.archivedAt && (
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-4">
                                                            Archived on {new Date(task.archivedAt).toLocaleDateString()}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => handleRestoreInternal(task)}
                                                        className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl hover:bg-blue-100 transition-colors"
                                                        title="Restore Task"
                                                    >
                                                        <RotateCcw size={18} />
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => handleDeletePermanent(task.id)}
                                                        className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl hover:bg-red-100 transition-colors"
                                                        title="Delete Permanently"
                                                    >
                                                        <Trash2 size={18} />
                                                    </motion.button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
