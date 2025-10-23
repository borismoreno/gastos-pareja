import { motion, AnimatePresence } from 'framer-motion'

interface Props {
    count: number
    animar: boolean
}

export function NotificationBadge({ count, animar }: Props) {
    if (count === 0) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="relative flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full"
            >
                {count}
                {animar && (
                    <motion.span
                        className="absolute inset-0 rounded-full bg-red-400 opacity-50"
                        initial={{ scale: 1, opacity: 0.8 }}
                        animate={{ scale: 2, opacity: 0 }}
                        transition={{ duration: 1.2, repeat: 1 }}
                    />
                )}
            </motion.div>
        </AnimatePresence>
    )
}
