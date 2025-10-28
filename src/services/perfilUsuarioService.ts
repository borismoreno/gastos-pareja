import { supabase } from '../config/supabaseClient'

export interface PerfilUsuario {
    id: string
    nombre: string
    foto_url?: string | null
    creado_en?: string
    actualizado_en?: string
}

/**
 * 🔹 Crear un nuevo perfil de usuario
 */
export async function crearPerfilUsuario(perfil: {
    id: string
    nombre: string
    foto_url?: string
}): Promise<PerfilUsuario | null> {
    try {
        console.log('perfil', perfil);
        const { data, error } = await supabase
            .from('perfil_usuario')
            .insert([
                {
                    id: perfil.id,
                    nombre: perfil.nombre,
                    foto_url: perfil.foto_url ?? null,
                },
            ])
            .select()
            .single()

        if (error) throw error
        return data
    } catch (err) {
        console.error('Error al crear perfil_usuario:', err)
        throw err
    }
}

/**
 * 🔹 Obtener el perfil de un usuario por su ID
 */
export async function obtenerPerfilUsuario(id: string): Promise<PerfilUsuario | null> {
    try {
        const { data, error } = await supabase
            .from('perfil_usuario')
            .select('*')
            .eq('id', id)
            .maybeSingle()

        if (error) throw error
        console.log('data', data);
        return data
    } catch (err) {
        console.error('Error al obtener perfil_usuario:', err)
        return null
    }
}

/**
 * 🔹 Actualizar nombre o foto del usuario
 */
export async function actualizarPerfilUsuario(
    id: string,
    campos: Partial<Omit<PerfilUsuario, 'id'>>
): Promise<PerfilUsuario | null> {
    try {
        const { data, error } = await supabase
            .from('perfil_usuario')
            .update({
                ...campos,
                actualizado_en: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return data
    } catch (err) {
        console.error('Error al actualizar perfil_usuario:', err)
        throw err
    }
}

/**
 * 🔹 Eliminar perfil (rara vez necesario, ya que se elimina en cascada con auth.users)
 */
export async function eliminarPerfilUsuario(id: string): Promise<boolean> {
    try {
        const { error } = await supabase.from('perfil_usuario').delete().eq('id', id)
        if (error) throw error
        return true
    } catch (err) {
        console.error('Error al eliminar perfil_usuario:', err)
        return false
    }
}
