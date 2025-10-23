import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { supabase } from '../config/supabaseClient'

export interface Notificacion {
    id: string
    hogar_id: string
    usuario_id: string
    emisor_id: string | null
    tipo: 'nuevo_gasto' | 'presupuesto_actualizado' | 'nuevo_miembro'
    mensaje: string
    leida: boolean
    metadata?: Record<string, any>
    creada_en: string
}

interface NotificacionesContextProps {
    notificaciones: Notificacion[]
    noLeidas: number
    nuevaAnimacion: boolean
    marcarComoLeida: (id: string) => Promise<void>
}

const NotificacionesContext = createContext<NotificacionesContextProps | undefined>(undefined)

export function NotificacionesProvider({
    usuarioId,
    children,
}: {
    usuarioId?: string
    children: ReactNode
}) {
    const [notificaciones, setNotificaciones] = useState<Notificacion[]>([])
    const [noLeidas, setNoLeidas] = useState<number>(0)
    const [nuevaAnimacion, setNuevaAnimacion] = useState<boolean>(false)

    useEffect(() => {
        if (!usuarioId) return
        let isMounted = true

        const cargarNotificaciones = async () => {
            const { data, error } = await supabase
                .from('notificaciones')
                .select('*')
                .eq('usuario_id', usuarioId)
                .order('creada_en', { ascending: false })

            if (error) {
                console.error('Error cargando notificaciones:', error)
                return
            }

            if (isMounted && data) {
                setNotificaciones(data as Notificacion[])
                setNoLeidas(data.filter(n => !n.leida).length)
            }
        }

        cargarNotificaciones()

        const canal = supabase
            .channel(`notificaciones:${usuarioId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notificaciones',
                    filter: `usuario_id=eq.${usuarioId}`,
                },
                payload => {
                    const nueva = payload.new as Notificacion
                    setNotificaciones(prev => [nueva, ...prev])
                    setNoLeidas(prev => prev + 1)
                    setNuevaAnimacion(true)
                    setTimeout(() => setNuevaAnimacion(false), 1500)
                }
            )
            .subscribe(status => console.log('📡 Canal de notificaciones:', status))

        return () => {
            isMounted = false
            supabase.removeChannel(canal)
        }
    }, [usuarioId])

    const marcarComoLeida = async (id: string) => {
        const { error } = await supabase.from('notificaciones').update({ leida: true }).eq('id', id)
        if (error) {
            console.error('Error al marcar notificación como leída:', error)
            return
        }
        setNotificaciones(prev => prev.map(n => (n.id === id ? { ...n, leida: true } : n)))
        setNoLeidas(prev => (prev > 0 ? prev - 1 : 0))
    }

    return (
        <NotificacionesContext.Provider
            value={{ notificaciones, noLeidas, nuevaAnimacion, marcarComoLeida }}
        >
            {children}
        </NotificacionesContext.Provider>
    )
}

export function useNotificaciones() {
    const context = useContext(NotificacionesContext)
    if (!context)
        throw new Error('useNotificaciones debe ser usado dentro de un NotificacionesProvider')
    return context
}
