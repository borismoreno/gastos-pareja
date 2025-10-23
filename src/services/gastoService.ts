import { supabase } from "../config/supabaseClient";
import { obtenerUsuariosHogar } from "./hogarService";
import { crearNotificacion } from "./notificacionService";

// ====================
// 🧩 Tipos
// ====================

export interface Gasto {
    id: string
    hogar_id: string
    usuario_id: string
    descripcion: string
    categoria?: string | null
    monto: number
    fecha: string // formato YYYY-MM-DD
    creado_en?: string
}

export interface ResumenHogar {
    presupuesto: number | null
    gastado: number
    disponible: number
    ultimos_gastos: {
        id: string
        descripcion: string
        monto: number
        categoria: string | null
        fecha: string
    }[]
}

// ====================
// 🕒 Función auxiliar para formato de fechas amigable
// ====================

// 🕒 Helpers con Intl.DateTimeFormat (zona: Bogotá)
const TZ = 'America/Bogota'

// Formatea un Date a 'YYYY-MM-DD' en la zona especificada
function ymdInTZ(date: Date, tz = TZ): string {
    // en-CA produce YYYY-MM-DD
    return new Intl.DateTimeFormat('en-CA', {
        timeZone: tz,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(date) // => '2025-10-16'
}

// Formatea a 'DD MMM' (es-ES), p.ej. '23 oct'
function ddMmmInES(date: Date, tz = TZ): string {
    return new Intl.DateTimeFormat('es-ES', {
        timeZone: tz,
        day: '2-digit',
        month: 'short',
    }).format(date) // => '23 oct'
}

// Convierte un string de fecha DB a Date seguro para formateo
// Soporta 'YYYY-MM-DD' (Postgres date) o ISO completo.
function toDateSafe(fechaInput: string): Date {
    const onlyDate = /^\d{4}-\d{2}-\d{2}$/.test(fechaInput)
    if (onlyDate) {
        const [y, m, d] = fechaInput.split('-').map(Number)
        // Crear Date en UTC para ese día; lo formatearemos con timeZone después.
        return new Date(Date.UTC(y, m - 1, d, 12, 0, 0)) // 12:00 UTC para evitar bordes
    }
    // ISO con tiempo → dejar que el constructor lo interprete
    return new Date(fechaInput)
}

// ✅ Formateador amigable: 'Hoy' | 'Ayer' | 'DD MMM' (siempre en español, horario Bogotá)
function formatearFechaAmigableIntl(fechaInput: string): string {
    const target = toDateSafe(fechaInput)

    const now = new Date()
    const todayYMD = ymdInTZ(now)
    const yesterdayYMD = ymdInTZ(new Date(now.getTime() - 24 * 60 * 60 * 1000))

    const targetYMD = ymdInTZ(target)

    if (targetYMD === todayYMD) return 'Hoy'
    if (targetYMD === yesterdayYMD) return 'Ayer'
    return ddMmmInES(target)
}

// ====================
// 💸 Servicios de gastos
// ====================

/**
 * 🔸 Crear un nuevo gasto
 * Solo miembros del hogar pueden agregarlo (controlado por RLS)
 */
export async function crearGasto(
    hogar_id: string,
    usuario_id: string,
    descripcion: string,
    monto: number,
    fecha: Date,
    categoria?: string
): Promise<Gasto> {
    try {
        // 1️⃣ Crear el gasto
        const { data, error } = await supabase
            .from('gastos')
            .insert([
                {
                    hogar_id,
                    usuario_id,
                    descripcion,
                    monto,
                    categoria,
                    fecha
                },
            ])
            .select()
            .single<Gasto>()

        if (error) throw error
        // 2️⃣ Obtener todos los miembros del hogar
        // const { data: miembros, error: miembrosError } = await supabase
        //     .from('usuario_hogar')
        //     .select('user_id')
        //     .eq('hogar_id', hogar_id)

        // if (miembrosError) throw miembrosError
        const miembros = await obtenerUsuariosHogar(hogar_id);

        // 3️⃣ Crear notificaciones para cada miembro (excepto quien registró el gasto)
        for (const miembro of miembros) {
            if (miembro.user_id !== usuario_id) {
                await crearNotificacion({
                    hogarId: hogar_id,
                    receptorId: miembro.user_id,
                    emisorId: usuario_id,
                    tipo: 'nuevo_gasto',
                    mensaje: `💸 Se registró un nuevo gasto: ${descripcion} por $${monto}`,
                    metadata: { gasto_id: data.id },
                })
            }
        }
        return data
    } catch (error) {
        console.error('Error al crear gasto:', error)
        throw error
    }
}

/**
 * 🔸 Obtener todos los gastos de un hogar
 * Solo miembros del hogar pueden verlos (según RLS)
 */
export async function obtenerGastosPorHogar(hogar_id: string): Promise<Gasto[]> {
    try {
        const { data, error } = await supabase
            .from('gastos')
            .select('*')
            .eq('hogar_id', hogar_id)
            .order('fecha', { ascending: false })

        if (error) throw error
        return data ?? []
    } catch (error) {
        console.error('Error al obtener gastos:', error)
        throw error
    }
}

/**
 * 🔸 Obtener los gastos de un hogar dentro de un rango de fechas
 */
export async function obtenerGastosPorRango(
    hogar_id: string,
    desde: string,
    hasta: string
): Promise<Gasto[]> {
    try {
        const { data, error } = await supabase
            .from('gastos')
            .select('*')
            .eq('hogar_id', hogar_id)
            .gte('fecha', desde)
            .lte('fecha', hasta)
            .order('fecha', { ascending: false })

        if (error) throw error
        return data ?? []
    } catch (error) {
        console.error('Error al obtener gastos por rango:', error)
        throw error
    }
}

/**
 * 🔸 Obtener resumen del hogar por rango de fechas
 */
export async function obtenerResumenHogar(
    hogar_id: string,
    desde: string,
    hasta: string
): Promise<ResumenHogar> {
    try {
        // 1️⃣ Obtener el presupuesto mensual
        const { data: hogarData, error: hogarError } = await supabase
            .from('hogares')
            .select('presupuesto_mensual')
            .eq('id', hogar_id)
            .single()

        if (hogarError) throw hogarError
        const presupuesto = Number(hogarData?.presupuesto_mensual ?? 0)

        // 2️⃣ Calcular total gastado en el rango
        const { data: gastos, error: gastosError } = await supabase
            .from('gastos')
            .select('id, descripcion, monto, categoria, fecha')
            .eq('hogar_id', hogar_id)
            .gte('fecha', desde)
            .lte('fecha', hasta)
            .order('fecha', { ascending: false })

        if (gastosError) throw gastosError

        const gastado = Number((gastos?.reduce((acc, g) => acc + Number(g.monto), 0) ?? 0).toFixed(2))
        const disponible = Number((presupuesto - gastado).toFixed(2))

        // 3️⃣ Tomar los 4 gastos más recientes del rango
        const ultimos_gastos = (gastos ?? [])
            .slice(0, 4)
            .map((g) => ({
                ...g,
                fecha: formatearFechaAmigableIntl(g.fecha),
            }))

        return {
            presupuesto,
            gastado,
            disponible,
            ultimos_gastos,
        }
    } catch (error) {
        console.error('Error al obtener resumen del hogar:', error)
        throw error
    }
}