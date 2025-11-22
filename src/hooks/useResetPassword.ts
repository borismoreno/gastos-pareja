import { useState } from 'react'
import { supabase } from '../config/supabaseClient'

export function useResetPassword() {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<string | null>(null)

    const requestReset = async (email: string) => {
        setLoading(true)
        setMessage(null)

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        })

        setLoading(false)
        setMessage(
            error
                ? 'No se pudo enviar el correo. Verifica tu email.'
                : 'Te hemos enviado un correo con instrucciones para restablecer tu contraseña.'
        )
    }

    const updatePassword = async (newPassword: string) => {
        setLoading(true)
        setMessage(null)

        const { error } = await supabase.auth.updateUser({ password: newPassword })

        setLoading(false)
        setMessage(
            error
                ? 'No se pudo actualizar la contraseña.'
                : 'Tu contraseña se ha actualizado correctamente.'
        )
    }

    return { requestReset, updatePassword, loading, message }
}
