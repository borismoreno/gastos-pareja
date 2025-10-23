// src/services/notificacionService.ts
import { supabase } from '../config/supabaseClient'

export async function crearNotificacion({
    hogarId,
    receptorId,
    emisorId,
    tipo,
    mensaje,
    metadata = {},
}: {
    hogarId: string
    receptorId: string
    emisorId: string
    tipo: 'nuevo_gasto' | 'presupuesto_actualizado' | 'nuevo_miembro'
    mensaje: string
    metadata?: Record<string, any>
}) {
    const { data, error } = await supabase.rpc('crear_notificacion', {
        hogar: hogarId,
        receptor: receptorId,
        emisor: emisorId,
        tipo,
        mensaje,
        metadata,
    })

    if (error) {
        console.error('Error creando notificación:', error)
        throw error
    }

    return data
}
