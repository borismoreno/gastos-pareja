import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import {
    Lock as LockIcon,
    CheckCircle as CheckCircleIcon,
    Heart as HeartIcon,
    Eye as EyeIcon,
    EyeOff as EyeOffIcon,
    AlertCircle as AlertCircleIcon,
} from 'lucide-react'
import { Button } from '../components/UI/Button'
import { supabase } from '../config/supabaseClient'
export const ResetPassword: React.FC = () => {
    const navigate = useNavigate()
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [passwordReset, setPasswordReset] = useState(false)
    const [error, setError] = useState('')
    const [sessionActive, setSessionActive] = useState(false)

    useEffect(() => {
        async function checkSession() {
            const { data } = await supabase.auth.getSession()
            setSessionActive(!!data.session)
        }
        checkSession()
    }, [])

    const validatePassword = () => {
        if (password.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres')
            return false
        }
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden')
            return false
        }
        setError('')
        return true
    }
    const handleSubmit = () => {
        if (validatePassword()) {
            setPasswordReset(true)
        }
    }
    // Mobile design
    const mobileLayout = (
        <div className="flex flex-col h-full bg-white p-6 overflow-y-auto lg:hidden">
            {!passwordReset ? (
                <>
                    <div className="flex flex-col items-center mb-8 mt-6">
                        <div className="bg-[#FFF5EB] p-4 rounded-full mb-4">
                            <LockIcon size={32} color="#E87C73" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            Crear nueva contraseña
                        </h2>
                        <p className="text-gray-600 text-center">
                            Ingresa tu nueva contraseña. Asegúrate de que sea segura y fácil
                            de recordar.
                        </p>
                    </div>
                    <div className="flex-1">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nueva contraseña
                                <span className="text-red-500 ml-1">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Mínimo 8 caracteres"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-100 rounded-xl border-none focus:ring-2 focus:ring-[#E87C73] focus:outline-none pr-12"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-500"
                                >
                                    {showPassword ? (
                                        <EyeOffIcon size={20} />
                                    ) : (
                                        <EyeIcon size={20} />
                                    )}
                                </button>
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Confirmar contraseña
                                <span className="text-red-500 ml-1">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="Repite tu contraseña"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-100 rounded-xl border-none focus:ring-2 focus:ring-[#E87C73] focus:outline-none pr-12"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-500"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOffIcon size={20} />
                                    ) : (
                                        <EyeIcon size={20} />
                                    )}
                                </button>
                            </div>
                        </div>
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 rounded-lg">
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        )}
                        <div className="bg-[#FFF5EB] p-4 rounded-xl mb-6">
                            <p className="text-sm font-medium text-gray-700 mb-2">
                                Tu contraseña debe contener:
                            </p>
                            <ul className="text-sm text-gray-600 space-y-1">
                                <li className="flex items-center">
                                    <span
                                        className={`mr-2 ${password.length >= 8 ? 'text-green-500' : 'text-gray-400'}`}
                                    >
                                        {password.length >= 8 ? '✓' : '○'}
                                    </span>
                                    Al menos 8 caracteres
                                </li>
                                <li className="flex items-center">
                                    <span
                                        className={`mr-2 ${password === confirmPassword && password !== '' ? 'text-green-500' : 'text-gray-400'}`}
                                    >
                                        {password === confirmPassword && password !== ''
                                            ? '✓'
                                            : '○'}
                                    </span>
                                    Las contraseñas deben coincidir
                                </li>
                            </ul>
                        </div>
                        <Button onClick={handleSubmit} fullWidth>
                            Restablecer contraseña
                        </Button>
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center flex-1">
                    <div className="bg-[#B7E4C7] p-4 rounded-full mb-6">
                        <CheckCircleIcon size={48} color="#FFFFFF" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-3 text-center">
                        ¡Contraseña restablecida!
                    </h2>
                    <p className="text-gray-600 text-center mb-8 px-4">
                        Tu contraseña ha sido actualizada exitosamente. Ya puedes iniciar
                        sesión con tu nueva contraseña.
                    </p>
                    <Button onClick={() => navigate('/signin')} fullWidth>
                        Ir a iniciar sesión
                    </Button>
                </div>
            )}
        </div>
    )

    // Mobile design - Link inválido
    const mobileInvalidLinkLayout = (
        <div className="flex flex-col items-center justify-center h-full bg-white p-6 overflow-y-auto lg:hidden">
            <div className="bg-red-100 p-6 rounded-full mb-8">
                <AlertCircleIcon size={64} color="#E87C73" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
                Enlace inválido o expirado
            </h2>
            <p className="text-gray-600 text-center mb-8">
                Solicita nuevamente el restablecimiento desde la página principal.
            </p>
            <div className="w-full max-w-md space-y-4">
                <Button onClick={() => navigate('/forgot-password')} fullWidth>
                    Solicitar nuevo enlace
                </Button>
                <Button
                    onClick={() => navigate('/signin')}
                    variant="outline"
                    fullWidth
                >
                    Volver al inicio de sesión
                </Button>
            </div>
        </div>
    )

    // Desktop design - Link inválido
    const desktopInvalidLinkLayout = (
        <div className="hidden lg:flex h-screen w-full bg-[#FFF5EB]">
            {/* Left column - App info */}
            <div className="w-1/2 bg-white p-16 flex flex-col justify-between">
                <div>
                    <div className="flex items-center mb-10">
                        <div className="w-12 h-12 bg-[#E87C73] rounded-full flex items-center justify-center">
                            <HeartIcon size={24} color="#FFFFFF" />
                        </div>
                        <h1 className="ml-4 text-3xl font-bold text-gray-800">
                            CuentasPro
                        </h1>
                    </div>
                    <h2 className="text-4xl font-bold text-gray-800 mb-6">
                        Recupera el acceso a tu cuenta
                    </h2>
                    <p className="text-xl text-gray-600 mb-10">
                        No te preocupes, es normal olvidar contraseñas. Te ayudaremos a
                        recuperar el acceso a tu cuenta en pocos pasos.
                    </p>
                    <div className="bg-[#FFF5EB] p-6 rounded-xl">
                        <h3 className="font-semibold text-gray-800 mb-3">
                            ¿Qué hacer si tu enlace expiró?
                        </h3>
                        <ul className="space-y-3 text-gray-600">
                            <li className="flex items-start">
                                <span className="text-[#E87C73] mr-3">•</span>
                                <span>
                                    Los enlaces de recuperación expiran después de 24 horas por
                                    seguridad
                                </span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-[#E87C73] mr-3">•</span>
                                <span>
                                    Puedes solicitar un nuevo enlace cuando lo necesites
                                </span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-[#E87C73] mr-3">•</span>
                                <span>
                                    Asegúrate de usar el enlace más reciente que recibiste
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="text-sm text-gray-500">
                    © 2023 CuentasPro. Todos los derechos reservados.
                </div>
            </div>
            {/* Right column - Error message */}
            <div className="w-1/2 p-16 flex flex-col justify-center">
                <div className="max-w-md mx-auto w-full">
                    <div className="bg-white p-8 rounded-xl shadow-sm">
                        <div className="flex justify-center mb-8">
                            <div className="bg-red-100 p-6 rounded-full">
                                <AlertCircleIcon size={64} color="#E87C73" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 text-center mb-4">
                            Enlace inválido o expirado
                        </h2>
                        <p className="text-xl text-gray-600 text-center mb-8">
                            No pudimos verificar tu enlace de recuperación.
                        </p>
                        <div className="bg-gray-50 rounded-xl p-6 mb-8">
                            <p className="text-gray-700 mb-4">
                                El enlace que has utilizado no es válido o ha expirado. Esto
                                puede suceder por varias razones:
                            </p>
                            <ul className="list-disc pl-5 mb-4 text-gray-700 space-y-2">
                                <li>El enlace ya fue utilizado anteriormente</li>
                                <li>Han pasado más de 24 horas desde que se envió el correo</li>
                                <li>La URL está incompleta o fue modificada</li>
                            </ul>
                            <p className="text-gray-700">
                                Solicita nuevamente el restablecimiento desde la página
                                principal.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <Button onClick={() => navigate('/forgot-password')} fullWidth>
                                Solicitar nuevo enlace
                            </Button>
                            <Button
                                onClick={() => navigate('/signin')}
                                variant="outline"
                                fullWidth
                            >
                                Volver al inicio de sesión
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
    // Desktop design
    const desktopLayout = (
        <div className="hidden lg:flex h-screen w-full bg-[#FFF5EB]">
            {/* Left column - App info */}
            <div className="w-1/2 bg-white p-16 flex flex-col justify-between">
                <div>
                    <div className="flex items-center mb-10">
                        <div className="w-12 h-12 bg-[#E87C73] rounded-full flex items-center justify-center">
                            <HeartIcon size={24} color="#FFFFFF" />
                        </div>
                        <h1 className="ml-4 text-3xl font-bold text-gray-800">
                            CuentasPro
                        </h1>
                    </div>
                    <h2 className="text-4xl font-bold text-gray-800 mb-6">
                        Casi terminamos
                    </h2>
                    <p className="text-xl text-gray-600 mb-10">
                        Estás a un paso de recuperar el acceso a tu cuenta. Crea una
                        contraseña segura y vuelve a gestionar tus gastos.
                    </p>
                    <div className="bg-[#FFF5EB] p-6 rounded-xl">
                        <h3 className="font-semibold text-gray-800 mb-3">
                            Consejos para una contraseña segura:
                        </h3>
                        <ul className="space-y-3 text-gray-600">
                            <li className="flex items-start">
                                <span className="text-[#E87C73] mr-3">•</span>
                                <span>Usa al menos 8 caracteres</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-[#E87C73] mr-3">•</span>
                                <span>Combina letras mayúsculas y minúsculas</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-[#E87C73] mr-3">•</span>
                                <span>Incluye números y símbolos especiales</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-[#E87C73] mr-3">•</span>
                                <span>Evita usar información personal obvia</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="text-sm text-gray-500">
                    © 2023 CuentasPro. Todos los derechos reservados.
                </div>
            </div>
            {/* Right column - Form */}
            <div className="w-1/2 p-16 flex flex-col justify-center">
                <div className="max-w-md mx-auto w-full">
                    <div className="bg-white p-8 rounded-xl shadow-sm">
                        {!passwordReset ? (
                            <>
                                <div className="flex items-center mb-6">
                                    <div className="bg-[#FFF5EB] p-3 rounded-full">
                                        <LockIcon size={32} color="#E87C73" />
                                    </div>
                                    <div className="ml-4">
                                        <h2 className="text-2xl font-bold text-gray-800">
                                            Nueva contraseña
                                        </h2>
                                        <p className="text-gray-600">Crea una contraseña segura</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nueva contraseña
                                            <span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="Mínimo 8 caracteres"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-100 rounded-xl border-none focus:ring-2 focus:ring-[#E87C73] focus:outline-none pr-12"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-500"
                                            >
                                                {showPassword ? (
                                                    <EyeOffIcon size={20} />
                                                ) : (
                                                    <EyeIcon size={20} />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Confirmar contraseña
                                            <span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                placeholder="Repite tu contraseña"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-100 rounded-xl border-none focus:ring-2 focus:ring-[#E87C73] focus:outline-none pr-12"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowConfirmPassword(!showConfirmPassword)
                                                }
                                                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-500"
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOffIcon size={20} />
                                                ) : (
                                                    <EyeIcon size={20} />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    {error && (
                                        <div className="p-3 bg-red-50 rounded-lg">
                                            <p className="text-sm text-red-600">{error}</p>
                                        </div>
                                    )}
                                    <div className="bg-gray-50 p-4 rounded-xl">
                                        <p className="text-sm font-medium text-gray-700 mb-2">
                                            Requisitos de contraseña:
                                        </p>
                                        <ul className="text-sm text-gray-600 space-y-1">
                                            <li className="flex items-center">
                                                <span
                                                    className={`mr-2 ${password.length >= 8 ? 'text-green-500' : 'text-gray-400'}`}
                                                >
                                                    {password.length >= 8 ? '✓' : '○'}
                                                </span>
                                                Al menos 8 caracteres
                                            </li>
                                            <li className="flex items-center">
                                                <span
                                                    className={`mr-2 ${password === confirmPassword && password !== '' ? 'text-green-500' : 'text-gray-400'}`}
                                                >
                                                    {password === confirmPassword && password !== ''
                                                        ? '✓'
                                                        : '○'}
                                                </span>
                                                Las contraseñas deben coincidir
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="pt-4">
                                        <Button onClick={handleSubmit} fullWidth>
                                            Restablecer contraseña
                                        </Button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center py-6">
                                <div className="bg-[#B7E4C7] p-4 rounded-full mb-6">
                                    <CheckCircleIcon size={48} color="#FFFFFF" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-3 text-center">
                                    ¡Contraseña restablecida!
                                </h2>
                                <p className="text-gray-600 text-center mb-8">
                                    Tu contraseña ha sido actualizada exitosamente. Ya puedes
                                    iniciar sesión con tu nueva contraseña.
                                </p>
                                <Button onClick={() => navigate('/signin')} fullWidth>
                                    Ir a iniciar sesión
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )

    if (!sessionActive)
        return (
            <>
                {mobileInvalidLinkLayout}
                {desktopInvalidLinkLayout}
            </>
        )
    return (
        <>
            {mobileLayout}
            {desktopLayout}
        </>
    )
}
