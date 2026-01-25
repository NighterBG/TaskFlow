import { useState, useRef, useEffect } from 'react';
import { MoreVertical, LogOut, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UserMenuProps {
    onLogout: () => void;
    onOpenSettings: () => void;
}

export default function UserMenu({ onLogout, onOpenSettings }: UserMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400 focus:outline-none"
                title="Account Settings"
            >
                <MoreVertical size={20} />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-900 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] dark:shadow-none border border-gray-100 dark:border-gray-800 py-2 z-50 overflow-hidden"
                    >
                        <motion.button
                            whileHover={{ x: 5, backgroundColor: "rgba(0,0,0,0.02)" }}
                            onClick={() => { setIsOpen(false); onOpenSettings(); }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                            <Settings size={18} className="text-gray-400" />
                            Account Settings
                        </motion.button>
                        <div className="h-px bg-gray-100 dark:bg-gray-800 mx-4 my-1"></div>
                        <motion.button
                            whileHover={{ x: 5, backgroundColor: "rgba(239, 68, 68, 0.05)" }}
                            onClick={() => { setIsOpen(false); onLogout(); }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                            <LogOut size={18} />
                            Logout
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
