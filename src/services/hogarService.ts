import { supabase } from "../config/supabaseClient";

export interface Hogar {
    id: string
    nombre: string
    moneda: string
    presupuesto_mensual?: number | null
    join_code: string
    creado_en?: string
}

export interface UsuarioHogar {
    id?: string
    user_id: string
    hogar_id: string
    rol: 'admin' | 'miembro'
    creado_en?: string
}

export interface UsuarioHogar {
    user_id: string
    email: string
    display_name: string
    rol: 'admin' | 'miembro'
}

function generateJoinCode(length = 6): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    for (let i = 0; i < length; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
}

// =========================================
// 🏠 Servicios de Hogar
// =========================================

/**
 * 🔸 Crear un nuevo hogar
 * - El código de unión se genera en frontend y se envía al backend (cumple tu script)
 */
export async function crearHogar(
    nombre: string,
    moneda: string = 'USD',
    presupuesto_mensual: number | null,
    user_id: string
): Promise<{ hogar: Hogar }> {
    try {
        const join_code = generateJoinCode()


        // Inserta hogar
        const { data: hogar, error: hogarError } = await supabase
            .from('hogares')
            .insert([
                {
                    nombre,
                    moneda,
                    presupuesto_mensual,
                    join_code,
                },
            ])
            .select()
            .single<Hogar>()

        if (hogarError) throw hogarError

        // Inserta relación usuario_hogar (como admin)
        const { error: miembroError } = await supabase
            .from('usuario_hogar')
            .insert([
                {
                    user_id,
                    hogar_id: hogar.id,
                    rol: 'admin',
                },
            ])

        if (miembroError) throw miembroError

        return { hogar }
    } catch (error) {
        console.error('Error al crear hogar:', error)
        throw error
    }
}

/**
 * 🔸 Unirse a un hogar existente mediante código
 */
export async function unirseAHogar(
    codigo: string,
    user_id: string
): Promise<Hogar> {
    try {
        const { data: hogar, error: hogarError } = await supabase
            .from('hogares')
            .select('id, nombre, join_code')
            .eq('join_code', codigo)
            .single<Hogar>()

        if (hogarError || !hogar) {
            throw new Error('Código inválido o hogar no encontrado')
        }

        // Validar si el usuario ya pertenece a un hogar (1:1)
        const { data: existe } = await supabase
            .from('usuario_hogar')
            .select('*')
            .eq('user_id', user_id)
            .maybeSingle<UsuarioHogar>()

        if (existe) {
            throw new Error('Ya perteneces a un hogar')
        }

        // Insertar la nueva relación
        const { error: insertError } = await supabase
            .from('usuario_hogar')
            .insert([{ hogar_id: hogar.id, user_id, rol: 'miembro' }])

        if (insertError) throw insertError

        return hogar
    } catch (error) {
        console.error('Error al unirse al hogar:', error)
        throw error
    }
}

/**
 * 🔸 Obtener el hogar actual del usuario
 */
export async function obtenerHogarPorUsuario(
    user_id: string
): Promise<Hogar | null> {
    try {
        const { data, error } = await supabase
            .from('usuario_hogar')
            .select('hogares(*)')
            .eq('user_id', user_id)
            .maybeSingle<{ hogares: Hogar }>()

        if (error) throw error
        return data?.hogares ?? null
    } catch (error) {
        console.error('Error al obtener hogar del usuario:', error)
        throw error
    }
}

/**
 * 🔸 Salir del hogar (elimina la relación 1:1)
 */
export async function salirDeHogar(user_id: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('usuario_hogar')
            .delete()
            .eq('user_id', user_id)
        if (error) throw error
        return true
    } catch (error) {
        console.error('Error al salir del hogar:', error)
        throw error
    }
}

/**
 * 🔸 Regenerar código de unión (solo admin)
 */
export async function regenerarCodigoInvitacion(
    hogar_id: string
): Promise<string> {
    try {
        const nuevoCodigo = generateJoinCode()
        const { error } = await supabase
            .from('hogares')
            .update({ join_code: nuevoCodigo })
            .eq('id', hogar_id)
        if (error) throw error
        return nuevoCodigo
    } catch (error) {
        console.error('Error al regenerar código:', error)
        throw error
    }
}

/**
 * 🔸 Actualiza el presupuesto mensual de un hogar.
 * Solo el admin del hogar puede hacerlo (según política RLS).
 */
export async function actualizarPresupuestoHogar(
    hogar_id: string,
    nuevoPresupuesto: number
): Promise<Hogar | null> {
    try {
        const { data, error } = await supabase
            .from('hogares')
            .update({ presupuesto_mensual: nuevoPresupuesto })
            .eq('id', hogar_id)
            .select()
            .maybeSingle<Hogar>() // ✅ evita PGRST116

        if (error) throw error

        if (!data) {
            console.warn('⚠️ No se encontró el hogar o no tienes permisos para actualizarlo.')
            return null
        }

        return data
    } catch (error) {
        console.error('Error al actualizar el presupuesto del hogar:', error)
        throw error
    }
}

/**
 * 🔸 Obtiene los usuarios de un hogar (email, display name y rol)
 */
export async function obtenerUsuariosHogar(hogar: string): Promise<UsuarioHogar[]> {
    try {
        const { data, error } = await supabase.rpc('obtener_usuarios_hogar', { hogar })

        if (error) throw error
        return data as UsuarioHogar[]
    } catch (error) {
        console.error('Error al obtener usuarios del hogar:', error)
        throw error
    }
}