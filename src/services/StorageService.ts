import { supabase } from "../config/supabaseClient"
import imageCompression from 'browser-image-compression'

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

            // 🔹 Comprimir imagen antes de subir
            const compressedFile = await imageCompression(file, {
                maxSizeMB: 1, // tamaño máximo aprox. (1 MB)
                maxWidthOrHeight: 1280, // redimensionar si excede
                useWebWorker: true,
            })

            // Crear un nombre único para evitar colisiones
            const fileExt = compressedFile.name.split('.').pop()
            const fileName = `${crypto.randomUUID()}.${fileExt}`
            const filePath = folder ? `${folder}/${fileName}` : fileName

            // Subir al bucket
            const { error: uploadError } = await supabase.storage
                .from(this.bucketName)
                .upload(filePath, compressedFile, {
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
