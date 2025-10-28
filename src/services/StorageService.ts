import { supabase } from "../config/supabaseClient"

export class StorageService {
    private bucketName: string

    constructor(bucketName = 'fotos') {
        this.bucketName = bucketName
    }

    /**
     * 📤 Sube una imagen al bucket especificado
     * @param file Archivo File (por ejemplo, desde un input)
     * @param folder Carpeta opcional dentro del bucket (por ejemplo 'perfiles/')
     * @returns URL pública de la imagen subida
     */
    async uploadImage(file: File, folder: string = ''): Promise<string | null> {
        try {
            // Validar tipo MIME
            if (!file.type.startsWith('image/')) {
                throw new Error('El archivo debe ser una imagen')
            }

            // Crear un nombre único para evitar colisiones
            const fileExt = file.name.split('.').pop()
            const fileName = `${crypto.randomUUID()}.${fileExt}`
            const filePath = folder ? `${folder}/${fileName}` : fileName

            // Subir al bucket
            const { error: uploadError } = await supabase.storage
                .from(this.bucketName)
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false, // evita sobrescribir archivos con el mismo nombre
                })

            if (uploadError) throw uploadError


            // Obtener URL pública
            const { data } = supabase.storage
                .from(this.bucketName)
                .getPublicUrl(filePath)

            return data.publicUrl
        } catch (error) {
            console.error('Error al subir imagen:', error)
            return null
        }
    }

    /**
     * 📸 Devuelve la URL pública de una imagen almacenada
     */
    getPublicUrl(filePath: string): string | null {
        const { data } = supabase.storage.from(this.bucketName).getPublicUrl(filePath)
        return data.publicUrl ?? null
    }

    /**
     * 🗑️ Elimina una imagen del bucket
     */
    async deleteImage(filePath: string): Promise<boolean> {
        try {
            const { error } = await supabase.storage.from(this.bucketName).remove([filePath])
            if (error) throw error
            return true
        } catch (error) {
            console.error('Error al eliminar imagen:', error)
            return false
        }
    }
}
