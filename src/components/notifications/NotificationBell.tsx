import { useState, useRef, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNotificaciones } from '../../context/NotificacionesContext'
import { NotificationBadge } from './NotificationBadge'

export function NotificationBell() {
    const { notificaciones, noLeidas, nuevaAnimacion, marcarComoLeida } = useNotificaciones()
    const [abierto, setAbierto] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // 🔹 Cerrar el dropdown al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setAbierto(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // 🔹 Limitar a las 5 notificaciones más recientes
    const ultimas = notificaciones.slice(0, 5)

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                className="relative p-2 rounded-full hover:bg-gray-100 transition"
                onClick={() => setAbierto(!abierto)}
            >
                <Bell className="w-6 h-6 text-gray-700" />
                <div className="absolute -top-1 -right-1">
                    <NotificationBadge count={noLeidas} animar={nuevaAnimacion} />
                </div>
            </button>

            <AnimatePresence>
                {abierto && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden"
                    >
                        <div className="px-4 py-2 border-b bg-gray-50 font-medium text-gray-700 flex justify-between items-center">
                            <span>Notificaciones</span>
                            {noLeidas > 0 && (
                                <span className="text-xs text-blue-600 font-semibold">
                                    {noLeidas} sin leer
                                </span>
                            )}
                        </div>

                        <div className="max-h-80 overflow-y-auto">
                            {ultimas.length === 0 ? (
                                <p className="text-sm text-gray-500 p-4 text-center">
                                    No tienes notificaciones aún
                                </p>
                            ) : (
                                ultimas.map((n) => (
                                    <motion.div
                                        key={n.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        whileHover={{ backgroundColor: '#f8fafc' }}
                                        className={`px-4 py-3 text-sm cursor-pointer ${n.leida ? 'bg-white' : 'bg-blue-50'
                                            }`}
                                        onClick={() => marcarComoLeida(n.id)}
                                    >
                                        <p className="text-gray-800">{n.mensaje}</p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {new Date(n.creada_en).toLocaleString('es-EC', {
                                                dateStyle: 'short',
                                                timeStyle: 'short',
                                            })}
                                        </p>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        <div className="border-t bg-gray-50 text-center text-sm py-2 hover:bg-gray-100 cursor-pointer">
                            Ver todas las notificaciones →
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
