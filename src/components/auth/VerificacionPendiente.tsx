import {
    MailCheck as MailCheckIcon,
    RefreshCw as RefreshIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router"
import { Button } from "../UI/Button";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";

export const VerificacionPendiente = () => {
    const { signUp } = useAuth();
    const location = useLocation();
    const email = location.state?.email || '';
    const navigate = useNavigate();

    const [isResending, setIsResending] = useState(false)
    const [resendSuccess, setResendSuccess] = useState(false)

    const [countdown, setCountdown] = useState(60)
    const [isCountdownActive, setIsCountdownActive] = useState(true) // Iniciar activo por defecto

    useEffect(() => {
        let timer: number | null = null
        if (isCountdownActive && countdown > 0) {
            timer = setTimeout(() => {
                setCountdown(countdown - 1)
            }, 1000)
        } else if (countdown === 0) {
            setIsCountdownActive(false)
            setCountdown(60)
        }
        return () => {
            if (timer) clearTimeout(timer)
        }
    }, [countdown, isCountdownActive])

    const handleResendEmail = async () => {
        try {
            setIsResending(true)
            const result = await signUp(email, 'dummypassword', '')
            if (result.success) {
                // setIsResending(false)
                setResendSuccess(true)
                setIsCountdownActive(true)
                setCountdown(60) // Reiniciar el contador a 60 segundos
                // Ocultar el mensaje de éxito después de 3 segundos
                setTimeout(() => {
                    setResendSuccess(false)
                }, 3000)
            } else {
                alert(result.error);
            }

        } catch (error) {
            console.error(error);
        } finally {
            setIsResending(false);
        }
    }

    const isResendDisabled = isResending || isCountdownActive
    const renderResendButtonText = () => {
        if (isResending) {
            return (
                <>
                    <RefreshIcon size={20} className="animate-spin mr-2" />
                    Reenviando...
                </>
            )
        } else if (isCountdownActive) {
            return `Reenviar correo en ${countdown}s`
        } else {
            return 'Reenviar correo de confirmación'
        }
    }

    const mobileLayout = (
        <div className="flex flex-col items-center h-full bg-white p-6 pt-12 overflow-y-auto lg:hidden">
            <div className="bg-[#FFF5EB] p-6 rounded-full mb-8">
                <MailCheckIcon size={64} color="#E87C73" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
                ¡Cuenta creada con éxito!
            </h2>
            <p className="text-gray-600 text-center mb-8">
                Hemos enviado un correo de confirmación a{' '}
                <span className="font-semibold">{email}</span>. Por favor, revisa tu
                bandeja de entrada y haz clic en el enlace para activar tu cuenta.
            </p>
            <div className="w-full max-w-md bg-[#FFF5EB] rounded-xl p-4 mb-8">
                <p className="text-sm text-gray-700">
                    <span className="font-semibold">Nota:</span> Si no encuentras el
                    correo en tu bandeja de entrada, revisa la carpeta de spam o correo no
                    deseado.
                </p>
            </div>
            {resendSuccess && (
                <div className="w-full max-w-md bg-green-50 text-green-700 rounded-xl p-4 mb-8">
                    Hemos reenviado el correo de confirmación.
                </div>
            )}
            <div className="w-full max-w-md space-y-4">
                <Button
                    onClick={handleResendEmail}
                    variant="secondary"
                    fullWidth
                    disabled={isResendDisabled}
                >
                    {renderResendButtonText()}
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

    // Desktop design
    const desktopLayout = (
        <div className="hidden lg:flex h-screen w-full bg-[#FFF5EB]">
            {/* Left column - App info */}
            <div className="w-1/2 bg-white p-16 flex flex-col justify-between">
                <div>
                    <div className="flex items-center mb-10">
                        <div className="w-12 h-12 bg-[#E87C73] rounded-full flex items-center justify-center">
                            <MailCheckIcon size={24} color="#FFFFFF" />
                        </div>
                        <h1 className="ml-4 text-3xl font-bold text-gray-800">
                            CuentasPro
                        </h1>
                    </div>
                    <h2 className="text-4xl font-bold text-gray-800 mb-6">
                        ¡Ya casi estamos listos!
                    </h2>
                    <p className="text-xl text-gray-600 mb-10">
                        Sólo falta un pequeño paso para que puedas comenzar a gestionar tus
                        gastos en pareja.
                    </p>
                    <div className="bg-[#FFF5EB] p-8 rounded-xl mb-10">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">
                            Siguientes pasos:
                        </h3>
                        <ol className="space-y-4">
                            <li className="flex items-start">
                                <span className="flex-shrink-0 w-6 h-6 bg-[#E87C73] text-white rounded-full flex items-center justify-center mr-3 mt-0.5">
                                    1
                                </span>
                                <p className="text-gray-700">
                                    Revisa tu bandeja de entrada en{' '}
                                    <span className="font-semibold">{email}</span>
                                </p>
                            </li>
                            <li className="flex items-start">
                                <span className="flex-shrink-0 w-6 h-6 bg-[#E87C73] text-white rounded-full flex items-center justify-center mr-3 mt-0.5">
                                    2
                                </span>
                                <p className="text-gray-700">
                                    Haz clic en el enlace de confirmación que te hemos enviado
                                </p>
                            </li>
                            <li className="flex items-start">
                                <span className="flex-shrink-0 w-6 h-6 bg-[#E87C73] text-white rounded-full flex items-center justify-center mr-3 mt-0.5">
                                    3
                                </span>
                                <p className="text-gray-700">
                                    ¡Comienza a usar CuentasPro con tu pareja!
                                </p>
                            </li>
                        </ol>
                    </div>
                </div>
                <div className="text-sm text-gray-500">
                    © 2023 CuentasPro. Todos los derechos reservados.
                </div>
            </div>
            {/* Right column - Confirmation info */}
            <div className="w-1/2 p-16 flex flex-col justify-center">
                <div className="max-w-md mx-auto">
                    <div className="flex justify-center mb-8">
                        <div className="bg-[#FFF5EB] p-8 rounded-full">
                            <MailCheckIcon size={80} color="#E87C73" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 text-center mb-4">
                        ¡Cuenta creada con éxito!
                    </h2>
                    <p className="text-xl text-gray-600 text-center mb-8">
                        Hemos enviado un correo de confirmación a tu dirección de email.
                    </p>
                    <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
                        <p className="text-gray-700 mb-4">
                            Por favor, revisa tu bandeja de entrada en{' '}
                            <span className="font-semibold">{email}</span> y haz clic en el
                            enlace para activar tu cuenta y comenzar a utilizar CuentasPro.
                        </p>
                        <p className="text-sm text-gray-600">
                            <span className="font-semibold">Nota:</span> Si no encuentras el
                            correo en tu bandeja de entrada, revisa la carpeta de spam o
                            correo no deseado.
                        </p>
                    </div>
                    {resendSuccess && (
                        <div className="bg-green-50 text-green-700 rounded-xl p-4 mb-8">
                            Hemos reenviado el correo de confirmación a tu dirección de email.
                        </div>
                    )}
                    <div className="space-y-4">
                        <Button
                            onClick={handleResendEmail}
                            variant="secondary"
                            fullWidth
                            disabled={isResendDisabled}
                        >
                            {renderResendButtonText()}
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
    )
    return (
        <>
            {mobileLayout}
            {desktopLayout}
        </>
    )
}
