import { useNavigate } from "react-router"
import { useEffect, useState } from "react"
import { useAuth } from "../../context/AuthContext"
import {
    CheckCircle as CheckCircleIcon,
    UserCheck as UserCheckIcon,
} from 'lucide-react'
import { Button } from "../UI/Button"

export const Verificado = () => {
    const navigate = useNavigate();
    const { session, exchangeCodeForSession } = useAuth();
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        async function handleVerification() {
            if (session) return
            const result = await exchangeCodeForSession(window.location.href);
            if (result?.success) {
                setSuccess(true);
                navigate('/unir-hogar')
            } else {
                navigate('/signIn')
            }
        }
        handleVerification();
    }, [])

    const desktopLayout = (
        <div className="hidden lg:flex h-screen w-full bg-[#FFF5EB]">
            {/* Left column - App info */}
            <div className="w-1/2 bg-white p-16 flex flex-col justify-between">
                <div>
                    <div className="flex items-center mb-10">
                        <div className="w-12 h-12 bg-[#E87C73] rounded-full flex items-center justify-center">
                            <UserCheckIcon size={24} color="#FFFFFF" />
                        </div>
                        <h1 className="ml-4 text-3xl font-bold text-gray-800">
                            CuentasPro
                        </h1>
                    </div>
                    <h2 className="text-4xl font-bold text-gray-800 mb-6">
                        Gestiona tus gastos en pareja, sin complicaciones
                    </h2>
                    <p className="text-xl text-gray-600 mb-8">
                        La aplicación que te ayuda a llevar las cuentas claras con tu pareja
                        y mantener el equilibrio financiero en tu hogar.
                    </p>
                    <div className="bg-[#FFF5EB] p-8 rounded-xl mb-10">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">
                            ¿Qué puedes hacer con CuentasPro?
                        </h3>
                        <ul className="space-y-4">
                            <li className="flex items-start">
                                <CheckCircleIcon
                                    size={20}
                                    className="text-[#E87C73] mr-3 mt-0.5"
                                />
                                <p className="text-gray-700">
                                    Registrar gastos compartidos fácilmente
                                </p>
                            </li>
                            <li className="flex items-start">
                                <CheckCircleIcon
                                    size={20}
                                    className="text-[#E87C73] mr-3 mt-0.5"
                                />
                                <p className="text-gray-700">
                                    Visualizar estadísticas de tus gastos mensuales
                                </p>
                            </li>
                            <li className="flex items-start">
                                <CheckCircleIcon
                                    size={20}
                                    className="text-[#E87C73] mr-3 mt-0.5"
                                />
                                <p className="text-gray-700">
                                    Dividir gastos de forma equitativa o personalizada
                                </p>
                            </li>
                            <li className="flex items-start">
                                <CheckCircleIcon
                                    size={20}
                                    className="text-[#E87C73] mr-3 mt-0.5"
                                />
                                <p className="text-gray-700">
                                    Mantener la transparencia en tus finanzas compartidas
                                </p>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="text-sm text-gray-500">
                    © 2023 CuentasPro. Todos los derechos reservados.
                </div>
            </div>
            {/* Right column - Activation info */}
            <div className="w-1/2 p-16 flex flex-col justify-center">
                <div className="max-w-md mx-auto">
                    {success ? (
                        <>
                            <div className="flex justify-center mb-8">
                                <div className="bg-[#FFF5EB] p-8 rounded-full">
                                    <CheckCircleIcon size={80} color="#E87C73" />
                                </div>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-800 text-center mb-4">
                                ¡Cuenta activada con éxito!
                            </h2>
                            <p className="text-xl text-gray-600 text-center mb-8">
                                Tu cuenta ha sido verificada correctamente.
                            </p>
                            <div className="bg-white rounded-xl p-6 shadow-sm mb-12">
                                <p className="text-gray-700 mb-4">
                                    Ya puedes comenzar a utilizar CuentasPro y todas sus
                                    funcionalidades para gestionar tus gastos compartidos con tu
                                    pareja.
                                </p>
                                <p className="text-gray-700">
                                    Haz clic en el botón de abajo para acceder a tu cuenta y
                                    empezar a usar la aplicación.
                                </p>
                            </div>
                            <Button
                                onClick={() => navigate('/home')}
                                fullWidth
                                className="py-4 text-lg"
                            >
                                Comenzar a usar CuentasPro
                            </Button>
                        </>
                    ) : (
                        <>
                            <div className="flex justify-center mb-8">
                                <div className="bg-red-100 p-8 rounded-full">
                                    <UserCheckIcon size={80} color="#E87C73" />
                                </div>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-800 text-center mb-4">
                                Enlace no válido o expirado
                            </h2>
                            <p className="text-xl text-gray-600 text-center mb-8">
                                No pudimos verificar tu cuenta.
                            </p>
                            <div className="bg-white rounded-xl p-6 shadow-sm mb-12">
                                <p className="text-gray-700 mb-4">
                                    El enlace que has utilizado no es válido o ha expirado. Esto
                                    puede suceder por varias razones:
                                </p>
                                <ul className="list-disc pl-5 mb-4 text-gray-700 space-y-2">
                                    <li>El enlace ya fue utilizado anteriormente</li>
                                    <li>
                                        Han pasado más de 24 horas desde que se envió el correo
                                    </li>
                                    <li>La URL está incompleta o fue modificada</li>
                                </ul>
                                <p className="text-gray-700">
                                    Por favor, solicita un nuevo enlace de activación o contacta
                                    con soporte si el problema persiste.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <Button
                                    onClick={() => navigate('emailConfirmation')}
                                    fullWidth
                                >
                                    Solicitar nuevo enlace
                                </Button>
                                <Button
                                    onClick={() => navigate('register')}
                                    variant="outline"
                                    fullWidth
                                >
                                    Volver al inicio de sesión
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
    return (
        <>
            {desktopLayout}
        </>
    )
}
