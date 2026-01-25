import React, { useEffect, useState } from 'react';
import api from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../components/ThemeProvider';
import { Trash2, Moon, Sun, Plus, GripVertical, Play, Pause, Clock, Search, X, Trophy, History as HistoryIcon, Archive } from 'lucide-react';
import UserMenu from '../components/UserMenu';
import AccountModal from '../components/AccountModal';
import AchievementModal from '../components/AchievementModal';
import HistoryDrawer from '../components/HistoryDrawer';
import { motion, AnimatePresence } from 'framer-motion';

// dnd-kit imports
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Task {
    id: number;
    title: string;
    description: string;
    status: number;
    color: string;
    order: number;
    timeSpentSeconds: number;
    trackingStartedAt: string | null;
}

function getContrastColor(hexColor: string) {
    if (!hexColor || hexColor === 'white' || hexColor === '#ffffff') return 'inherit';
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#ffffff';
}

function formatDuration(seconds: number) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const parts = [];
    if (hrs > 0) parts.push(`${hrs}h`);
    if (mins > 0 || hrs > 0) parts.push(`${mins}m`);
    parts.push(`${secs}s`);

    return parts.join(' ');
}

const PLACEHOLDERS = [
    "What's your next mission?",
    "Define your destiny...",
    "Capture a flash of genius!",
    "One step closer to greatness.",
    "Write it down, make it happen.",
    "What will you conquer today?",
    "Unleash your potential.",
    "Build your legacy.",
    "Begin your journey.",
    "Step into action."
];

// --- COOL COMPONENTS ---

const ParticleBurst = ({ color }: { color: string }) => {
    return (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {[...Array(12)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                    animate={{
                        scale: [0, 1.5, 0],
                        x: (Math.random() - 0.5) * 150,
                        y: (Math.random() - 0.5) * 150,
                        rotate: Math.random() * 360,
                        opacity: [1, 1, 0]
                    }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="absolute w-2 h-2 rounded-full shadow-lg"
                    style={{ backgroundColor: color }}
                />
            ))}
        </div>
    );
};

const DeleteExplosion = ({ color }: { color: string }) => {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-visible">
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                    animate={{
                        opacity: 0,
                        scale: 0,
                        x: (Math.random() - 0.5) * 400,
                        y: (Math.random() - 0.5) * 400,
                        rotate: Math.random() * 720
                    }}
                    transition={{ duration: 0.6, ease: "circOut" }}
                    className="absolute w-4 h-4 rounded-sm border"
                    style={{ backgroundColor: color, borderColor: 'white' }}
                />
            ))}
        </div>
    );
};

const AnimatedCheckmark = ({ isDone, onClick, color }: { isDone: boolean, onClick: (e: any) => void, color: string }) => {
    return (
        <motion.div
            className="relative cursor-pointer"
            onClick={onClick}
            whileHover={{ scale: 1.15, rotate: isDone ? -10 : 10 }}
            whileTap={{ scale: 0.85 }}
        >
            <AnimatePresence>
                {isDone && <ParticleBurst color={color === 'inherit' ? '#22c55e' : color} />}
            </AnimatePresence>

            <svg width="44" height="44" viewBox="0 0 40 40">
                <motion.circle
                    cx="20"
                    cy="20"
                    r="18"
                    stroke={isDone ? "#22c55e" : "#cbd5e1"}
                    strokeWidth="3"
                    fill="transparent"
                    animate={{
                        stroke: isDone ? "#22c55e" : "#cbd5e1",
                        scale: isDone ? [1, 1.1, 1] : 1
                    }}
                    transition={{ duration: 0.3 }}
                />
                <AnimatePresence>
                    {isDone && (
                        <motion.path
                            d="M11 20L17 26L30 13"
                            fill="transparent"
                            strokeWidth="5"
                            stroke="#22c55e"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            exit={{ pathLength: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: "backOut" }}
                        />
                    )}
                </AnimatePresence>
            </svg>
        </motion.div>
    );
};

interface SortableItemProps {
    task: Task;
    onToggle: (task: Task) => void;
    onDelete: (id: number) => void;
    onToggleTimer: (id: number) => void;
    onArchive: (id: number) => void;
}

function SortableTaskItem({ task, onToggle, onDelete, onToggleTimer, onArchive }: SortableItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id });

    const [isExploding, setIsExploding] = useState(false);
    const [currentTime, setCurrentTime] = useState(task.timeSpentSeconds);
    const isDone = task.status === 2;
    const isRunning = !!task.trackingStartedAt;
    const contrastColor = getContrastColor(task.color);
    const isWhite = !task.color || task.color === 'white' || task.color === '#ffffff';

    useEffect(() => {
        let interval: any;
        if (isRunning && task.trackingStartedAt) {
            const start = new Date(task.trackingStartedAt).getTime();
            interval = setInterval(() => {
                const now = new Date().getTime();
                const elapsedSinceStart = Math.floor((now - start) / 1000);
                setCurrentTime(task.timeSpentSeconds + elapsedSinceStart);
            }, 1000);
        } else {
            setCurrentTime(task.timeSpentSeconds);
        }
        return () => clearInterval(interval);
    }, [isRunning, task.timeSpentSeconds, task.trackingStartedAt]);

    const dndStyle = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 100 : 1,
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsExploding(true);
        setTimeout(() => onDelete(task.id), 500);
    };

    return (
        <motion.div
            layout
            ref={setNodeRef}
            style={dndStyle}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{
                opacity: 0,
                scale: 1.5,
                filter: "brightness(2) blur(20px)",
                transition: { duration: 0.4 }
            }}
            className="group relative"
        >
            {isExploding && <DeleteExplosion color={isWhite ? '#3b82f6' : task.color} />}

            <motion.div
                {...attributes}
                {...listeners}
                animate={{
                    x: isExploding ? [0, -10, 10, -5, 5, 0] : 0,
                    scale: isExploding ? 0 : 1,
                    boxShadow: isRunning ? "0 20px 40px -10px rgba(59,130,246,0.3)" : "none"
                }}
                whileHover={{ y: -5, scale: 1.01, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)" }}
                className={`p-6 rounded-[2.5rem] border transition-colors duration-500 flex items-center gap-5 cursor-grab active:cursor-grabbing shadow-sm ${isWhite ? 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800' : 'border-transparent shadow-2xl'} ${isDone ? 'opacity-80' : ''} ${isRunning ? 'border-blue-500 dark:border-blue-500 ring-2 ring-blue-500/20' : ''}`}
                style={{
                    backgroundColor: isWhite ? undefined : task.color,
                    color: isWhite ? undefined : contrastColor
                }}
            >
                <div className="flex-grow flex items-center gap-5">
                    <div className={`p-2 rounded-2xl ${isWhite ? 'text-gray-200 dark:text-gray-700' : 'text-inherit opacity-30'}`}>
                        <GripVertical size={24} />
                    </div>

                    <div className="flex flex-col gap-1">
                        <motion.h3
                            animate={{
                                opacity: isDone ? 0.4 : 1,
                                filter: isDone ? "blur(0.5px)" : "blur(0px)"
                            }}
                            className={`font-black text-3xl tracking-tighter transition-all ${isDone ? 'line-through decoration-[6px] decoration-green-500/50' : 'text-gray-900 dark:text-white'}`}
                            style={{ color: isWhite ? undefined : contrastColor }}
                        >
                            {task.title}
                        </motion.h3>

                        {(currentTime > 0 || isRunning) && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`flex items-center gap-2 text-sm font-black uppercase tracking-widest ${isRunning ? 'text-blue-500 animate-pulse' : 'opacity-40'}`}
                            >
                                <Clock size={14} />
                                {formatDuration(currentTime)}
                                {isRunning && <span className="text-[10px] ml-1">Live</span>}
                            </motion.div>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-4 relative z-10">
                    {!isDone && (
                        <motion.button
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.8 }}
                            onClick={(e) => { e.stopPropagation(); onToggleTimer(task.id); }}
                            className={`p-3 rounded-2xl transition-all ${isRunning ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/40' : (isWhite ? 'bg-gray-100 text-gray-400 hover:bg-blue-50 hover:text-blue-600' : 'bg-black/10 text-inherit hover:bg-black/20')}`}
                        >
                            {isRunning ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                        </motion.button>
                    )}

                    <motion.button
                        whileHover={{ scale: 1.3, rotate: [0, -10, 10, 0], color: "#ef4444" }}
                        whileTap={{ scale: 0.7 }}
                        onClick={handleDelete}
                        className={`p-3 rounded-2xl lg:opacity-0 lg:group-hover:opacity-100 transition-all ${isWhite ? 'text-gray-300 hover:bg-red-50' : 'text-inherit opacity-40 hover:bg-black/10'}`}
                        title="Delete Task"
                    >
                        <Trash2 size={28} />
                    </motion.button>

                    {isDone && (
                        <motion.button
                            whileHover={{ scale: 1.3, rotate: 15, color: "#3b82f6" }}
                            whileTap={{ scale: 0.8 }}
                            onClick={(e) => { e.stopPropagation(); onArchive(task.id); }}
                            className={`p-3 rounded-2xl lg:opacity-0 lg:group-hover:opacity-100 transition-all ${isWhite ? 'text-gray-300 hover:bg-blue-50' : 'text-inherit opacity-40 hover:bg-black/10'}`}
                            title="Archive Task"
                        >
                            <Archive size={28} />
                        </motion.button>
                    )}

                    <AnimatedCheckmark
                        isDone={isDone}
                        onClick={(e) => { e.stopPropagation(); onToggle(task); }}
                        color={isWhite ? '#22c55e' : contrastColor}
                    />
                </div>
            </motion.div>
        </motion.div>
    );
}

export default function Tasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [title, setTitle] = useState('');
    const [selectedColor, setSelectedColor] = useState('#ffffff');
    const [loading, setLoading] = useState(true);
    const [activeId, setActiveId] = useState<number | null>(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [placeholder, setPlaceholder] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const [earnedAchievement, setEarnedAchievement] = useState<any>(null);
    const [showAchievementToast, setShowAchievementToast] = useState(false);

    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchTasks(searchTerm);
        }, 400);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        setPlaceholder(PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)]);
    }, [navigate]);

    const fetchTasks = async (search?: string) => {
        setLoading(true);
        try {
            const url = search ? `/tasks?search=${encodeURIComponent(search)}` : '/tasks';
            const response = await api.get(url);
            setTasks(response.data);
        } catch (err: any) {
            console.error("Fetch tasks error:", err);
            if (err.response && err.response.status === 401) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAchievements = (response: any) => {
        const newAchievements = response.data.newAchievements || response.data.NewAchievements;
        if (newAchievements && newAchievements.length > 0) {
            setEarnedAchievement(newAchievements[0]);
            setShowAchievementToast(true);
            setTimeout(() => setShowAchievementToast(false), 5000);
        }
    };

    const createTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        try {
            const response = await api.post('/tasks', {
                title,
                priority: 1,
                description: '',
                color: selectedColor
            });
            setTitle('');
            setSelectedColor('#ffffff');
            fetchTasks(searchTerm);
            setPlaceholder(PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)]);
            handleAchievements(response);
        } catch (error) {
            console.error("Failed to create task", error);
        }
    };

    const toggleTask = async (task: Task) => {
        try {
            const newStatus = task.status === 2 ? 0 : 2;
            const updatedTasks = tasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t);
            setTasks(updatedTasks);
            const response = await api.put(`/tasks/${task.id}/status`, { isCompleted: newStatus === 2 });
            handleAchievements(response);
        } catch (error) {
            console.error("Failed to update task", error);
            fetchTasks(searchTerm);
        }
    };

    const archiveTask = async (id: number) => {
        try {
            const updatedTasks = tasks.filter(t => t.id !== id);
            setTasks(updatedTasks);
            const response = await api.post(`/tasks/${id}/archive`);
            handleAchievements(response);
        } catch (error) {
            console.error("Failed to archive task", error);
            fetchTasks(searchTerm);
        }
    };

    const deleteTask = async (id: number) => {
        try {
            const updatedTasks = tasks.filter(t => t.id !== id);
            setTasks(updatedTasks);
            await api.delete(`/tasks/${id}`);
        } catch (error) {
            console.error("Failed to delete task", error);
            fetchTasks(searchTerm);
        }
    };

    const toggleTimer = async (id: number) => {
        try {
            const response = await api.post(`/tasks/${id}/toggle-timer`);
            const { totalSeconds, isRunning } = response.data;
            handleAchievements(response);

            setTasks(prev => prev.map(t => {
                if (t.id === id) {
                    return {
                        ...t,
                        timeSpentSeconds: totalSeconds,
                        trackingStartedAt: isRunning ? new Date().toISOString() : null
                    };
                }
                if (isRunning && t.id !== id && t.trackingStartedAt) {
                    return { ...t, trackingStartedAt: null };
                }
                return t;
            }));
        } catch (error) {
            console.error("Failed to toggle timer", error);
        }
    };

    const handleDragStart = (event: any) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = async (event: any) => {
        const { active, over } = event;
        setActiveId(null);

        if (active.id !== over?.id) {
            const oldIndex = tasks.findIndex((i) => i.id === active.id);
            const newIndex = tasks.findIndex((i) => i.id === over.id);
            const newArray = arrayMove(tasks, oldIndex, newIndex);

            setTasks(newArray);

            const taskOrders = newArray.map((task, index) => ({
                id: task.id,
                order: index
            }));

            api.post('/tasks/reorder', { tasks: taskOrders }).catch(err => {
                console.error("Failed to sync order", err);
                fetchTasks();
            });
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const activeTask = activeId ? tasks.find(t => t.id === activeId) : null;

    if (loading && tasks.length === 0) {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
                <motion.div
                    animate={{
                        scale: [1, 2, 1],
                        rotate: [0, 360],
                        borderRadius: ["20%", "50%", "20%"]
                    }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    className="w-12 h-12 bg-blue-600 shadow-[0_0_50px_rgba(59,130,246,0.6)]"
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-[1.5s] font-sans selection:bg-blue-300 dark:selection:bg-blue-900/40">
            <div className="max-w-4xl mx-auto p-4 sm:p-12">
                {/* Header */}
                <motion.header
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100 }}
                    className="flex flex-col sm:flex-row justify-between items-center mb-20 gap-4"
                >
                    <div className="flex items-center gap-6">
                        <motion.div
                            whileHover={{ rotate: 15, scale: 1.2, filter: "hue-rotate(90deg)" }}
                            className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-800 rounded-3xl flex items-center justify-center shadow-2xl text-white font-black text-4xl cursor-pointer"
                        >
                            T
                        </motion.div>
                        <h1 className="text-6xl font-black text-gray-900 dark:text-white tracking-tighter">TaskFlow</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Search Bar */}
                        <motion.div
                            initial={{ width: 60 }}
                            animate={{ width: searchTerm ? 300 : 250 }}
                            className="relative group hidden md:block"
                        >
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                className="w-full bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border border-white/20 dark:border-gray-800 rounded-[1.5rem] py-3 pl-12 pr-10 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all font-bold text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </motion.div>

                        <div className="flex items-center gap-2 bg-white/50 dark:bg-gray-900/50 backdrop-blur-3xl p-3 rounded-[2rem] shadow-2xl border border-white/20 dark:border-gray-800">
                            <motion.button
                                whileHover={{ scale: 1.1, backgroundColor: "rgba(234, 179, 8, 0.1)" }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setIsAchievementsOpen(true)}
                                className="p-3 rounded-2xl transition-colors text-yellow-600 dark:text-yellow-500"
                                title="Achievement Cabinet"
                            >
                                <Trophy size={24} />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.1, backgroundColor: "rgba(59, 130, 246, 0.1)" }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setIsHistoryOpen(true)}
                                className="p-3 rounded-2xl transition-colors text-blue-600 dark:text-blue-400"
                                title="Task History"
                            >
                                <HistoryIcon size={24} />
                            </motion.button>
                            <div className="w-px h-10 bg-gray-200 dark:bg-gray-800 mx-1"></div>
                            <motion.button
                                whileHover={{ rotate: -180, scale: 1.2 }}
                                whileTap={{ scale: 0.8 }}
                                onClick={toggleTheme}
                                className="p-3 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
                            >
                                {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
                            </motion.button>
                            <div className="w-px h-10 bg-gray-200 dark:bg-gray-800 mx-3"></div>
                            <UserMenu onLogout={logout} onOpenSettings={() => setIsSettingsOpen(true)} />
                        </div>
                    </div>
                </motion.header>

                <AccountModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
                <AchievementModal isOpen={isAchievementsOpen} onClose={() => setIsAchievementsOpen(false)} />
                <HistoryDrawer
                    isOpen={isHistoryOpen}
                    onClose={() => setIsHistoryOpen(false)}
                    onRestore={() => fetchTasks(searchTerm)}
                />

                {/* Achievement Toast */}
                <AnimatePresence>
                    {showAchievementToast && earnedAchievement && (
                        <motion.div
                            initial={{ opacity: 0, y: 100, x: '-50%' }}
                            animate={{ opacity: 1, y: 0, x: '-50%' }}
                            exit={{ opacity: 0, scale: 0.5, x: '-50%' }}
                            className="fixed bottom-12 left-1/2 z-[200] bg-gray-900 dark:bg-gray-900 text-white px-10 py-6 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.5)] border border-white/20 flex items-center gap-6"
                        >
                            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg animate-bounce">
                                <Trophy size={32} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-black uppercase tracking-[0.3em] text-yellow-500">Achievement Unlocked</span>
                                <h4 className="text-2xl font-black tracking-tight">{earnedAchievement.name}</h4>
                                <p className="text-gray-400 font-bold">{earnedAchievement.description}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Create Task Section */}
                <motion.section
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-white dark:bg-gray-900 p-12 rounded-[4rem] shadow-[0_80px_150px_-30px_rgba(0,0,0,0.1)] dark:shadow-none border border-gray-100 dark:border-gray-800 mb-20 relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

                    <form onSubmit={createTask} className="flex flex-col gap-12 relative z-10">
                        <div className="flex flex-col sm:flex-row gap-6">
                            <div className="flex-grow flex items-center gap-6 bg-gray-50 dark:bg-gray-800/60 px-8 py-4 rounded-[2.5rem] border-2 border-transparent focus-within:border-blue-500 focus-within:bg-white dark:focus-within:bg-gray-800 focus-within:shadow-2xl transition-all group">
                                <Plus size={32} className="text-gray-400 group-focus-within:rotate-180 group-focus-within:text-blue-500 transition-all duration-500" />
                                <input
                                    type="text"
                                    placeholder={placeholder}
                                    className="w-full bg-transparent py-6 text-2xl focus:outline-none dark:text-white placeholder-gray-300 font-extrabold tracking-tight"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
                                whileTap={{ scale: 0.95 }}
                                type="submit"
                                disabled={!title.trim()}
                                className={`px-14 py-7 rounded-[2.5rem] font-black text-2xl text-white shadow-2xl transition-all duration-300 ${!title.trim() ? 'bg-gray-200 dark:bg-gray-800 opacity-40' : 'bg-gradient-to-br from-blue-600 to-indigo-700 shadow-blue-500/30'}`}
                            >
                                Build Task
                            </motion.button>
                        </div>

                        <div className="flex flex-wrap items-center gap-12 border-t border-gray-100 dark:border-gray-800 pt-10">
                            <div className="flex items-center gap-6">
                                <span className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Style guide</span>
                                <div className="flex items-center gap-5 bg-gray-100 dark:bg-gray-800 p-4 rounded-3xl">
                                    <input
                                        type="color"
                                        value={selectedColor}
                                        onChange={(e) => setSelectedColor(e.target.value)}
                                        className="w-14 h-14 bg-transparent rounded-2xl cursor-pointer border-0 p-0"
                                    />
                                    <span className="text-lg font-black font-mono text-gray-500 tracking-tighter">{selectedColor.toUpperCase()}</span>
                                </div>
                            </div>

                            <div className="flex gap-5">
                                {['#ffffff', '#fee2e2', '#dcfce7', '#dbeafe', '#fef9c3', '#f3e8ff'].map(c => (
                                    <motion.button
                                        key={c}
                                        whileHover={{ y: -10, rotate: [0, -5, 5, 0] }}
                                        whileTap={{ scale: 0.8 }}
                                        type="button"
                                        onClick={() => setSelectedColor(c)}
                                        className={`w-14 h-14 rounded-3xl border-4 transition-all ${selectedColor === c ? 'border-blue-500 scale-110 shadow-2xl' : 'border-white dark:border-gray-800 shadow-sm'}`}
                                        style={{ backgroundColor: c }}
                                    />
                                ))}
                            </div>
                        </div>
                    </form>
                </motion.section>

                {/* Task List Section with DND */}
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={tasks.map(t => t.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <motion.div layout className="grid gap-10">
                            <AnimatePresence mode="popLayout" initial={false}>
                                {tasks.map((task) => (
                                    <SortableTaskItem
                                        key={task.id}
                                        task={task}
                                        onToggle={toggleTask}
                                        onDelete={deleteTask}
                                        onToggleTimer={toggleTimer}
                                        onArchive={archiveTask}
                                    />
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    </SortableContext>

                    <DragOverlay dropAnimation={{
                        sideEffects: defaultDropAnimationSideEffects({
                            styles: {
                                active: { opacity: '0.3', filter: 'blur(5px)' },
                            },
                        }),
                    }}>
                        {activeTask ? (
                            <div
                                style={{
                                    backgroundColor: (!activeTask.color || activeTask.color === 'white' || activeTask.color === '#ffffff') ? undefined : activeTask.color,
                                    color: (!activeTask.color || activeTask.color === 'white' || activeTask.color === '#ffffff') ? undefined : getContrastColor(activeTask.color)
                                }}
                                className={`p-10 rounded-[3rem] border flex items-center gap-8 shadow-[0_100px_200px_rgba(0,0,0,0.5)] scale-110 cursor-grabbing bg-white dark:bg-gray-900 border-transparent`}
                            >
                                <GripVertical size={32} className="text-inherit opacity-50" />
                                <div className="flex-grow">
                                    <h3 className="font-black text-4xl tracking-tighter">{activeTask.title}</h3>
                                </div>
                            </div>
                        ) : null}
                    </DragOverlay>
                </DndContext>

                {tasks.length === 0 && !loading && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-60 rounded-[5rem] bg-gray-200/10 dark:bg-gray-900/30 border-8 border-dotted border-gray-200 dark:border-gray-800"
                    >
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ repeat: Infinity, duration: 4 }}
                            className="text-gray-200 dark:text-gray-800 font-black text-5xl tracking-[0.1em] uppercase opacity-20"
                        >
                            Void
                        </motion.div>
                    </motion.div>
                )}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                input[type="color"]::-webkit-color-swatch-wrapper { padding: 0; }
                input[type="color"]::-webkit-color-swatch { border: none; border-radius: 12px; }
            `}} />
        </div>
    );
}
