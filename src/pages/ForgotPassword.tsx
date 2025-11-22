import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import {
    ArrowLeft as ArrowLeftIcon,
    Mail as MailIcon,
    CheckCircle as CheckCircleIcon,
    Heart as HeartIcon,
} from 'lucide-react'
import { Input } from '../components/UI/Input'
import { Button } from '../components/UI/Button'
import { useResetPassword } from '../hooks/useResetPassword';
import { Spinner } from '../components/shared/Spinner';

const schema = yup.object({
    email: yup.string().email('Correo electrónico no válido').required('Correo electrónico es obligatorio'),
}).required();

type FormData = yup.InferType<typeof schema>;

export const ForgotPassword: React.FC = () => {
    const navigate = useNavigate()
    const [emailSent, setEmailSent] = useState(false)
    const { requestReset, loading } = useResetPassword()

    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: 'onBlur',
        reValidateMode: 'onChange',
        criteriaMode: 'all',
        shouldFocusError: true,
        defaultValues: {
            email: ''
        }
    })

    const { register: registerMobile, handleSubmit: handleSubmitMobile, watch: watchMobile, formState: { errors: errorsMobile } } = useForm({
        resolver: yupResolver(schema),
        mode: 'onBlur',
        reValidateMode: 'onChange',
        criteriaMode: 'all',
        shouldFocusError: true,
        defaultValues: {
            email: ''
        }
    })

    const emailMobile = watchMobile('email')
    const email = watch('email')

    const onSubmit = async (data: FormData) => {
        await requestReset(data.email)
        setEmailSent(true)
    }
    // Mobile design
    const mobileLayout = (
        <div className="flex flex-col h-full bg-white p-6 overflow-y-auto lg:hidden">
            <button
                className="p-2 rounded-full hover:bg-gray-100 self-start mb-6"
                onClick={() => navigate('/signin')}
            >
                <ArrowLeftIcon size={20} color="#666666" />
            </button>
            {!emailSent ? (
                <>
                    <form onSubmit={handleSubmitMobile(onSubmit)}>
                        <div className="flex flex-col items-center mb-8">
                            <div className="bg-[#FFF5EB] p-4 rounded-full mb-4">
                                <MailIcon size={32} color="#E87C73" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                ¿Olvidaste tu contraseña?
                            </h2>
                            <p className="text-gray-600 text-center">
                                Ingresa tu correo electrónico y te enviaremos un enlace para
                                restablecer tu contraseña.
                            </p>
                        </div>
                        <div className="flex-1">
                            <Input
                                label="Correo electrónico"
                                type="email"
                                placeholder="correo@ejemplo.com"
                                register={registerMobile('email')}
                            />
                            {errorsMobile.email && <p className="pl-4 text-red-500 text-xs">{errorsMobile.email.message}</p>}
                            <div className="mt-6">
                                <Button type='submit' fullWidth>
                                    Enviar enlace de recuperación
                                </Button>
                            </div>
                        </div>
                        <div className="text-center mt-8">
                            <p className="text-sm text-gray-600">
                                ¿Recordaste tu contraseña?{' '}
                                <button
                                    onClick={() => navigate('/signin')}
                                    className="text-[#E87C73] font-medium"
                                >
                                    Inicia sesión
                                </button>
                            </p>
                        </div>
                    </form>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center flex-1">
                    <div className="bg-[#B7E4C7] p-4 rounded-full mb-6">
                        <CheckCircleIcon size={48} color="#FFFFFF" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-3 text-center">
                        ¡Correo enviado!
                    </h2>
                    <p className="text-gray-600 text-center mb-8 px-4">
                        Hemos enviado un enlace de recuperación a{' '}
                        <span className="font-medium">{emailMobile}</span>. Revisa tu bandeja de
                        entrada y sigue las instrucciones.
                    </p>
                    <Button onClick={() => navigate('/signin')} fullWidth>
                        Volver al inicio de sesión
                    </Button>
                    <button
                        onClick={() => setEmailSent(false)}
                        className="mt-6 text-[#E87C73] font-medium"
                    >
                        ¿No recibiste el correo? Reenviar
                    </button>
                </div>
            )}
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
                        Recupera el acceso a tu cuenta
                    </h2>
                    <p className="text-xl text-gray-600 mb-10">
                        No te preocupes, es normal olvidar contraseñas. Te ayudaremos a
                        recuperar el acceso a tu cuenta en pocos pasos.
                    </p>
                    <div className="bg-[#FFF5EB] p-6 rounded-xl">
                        <h3 className="font-semibold text-gray-800 mb-3">
                            ¿Cómo funciona?
                        </h3>
                        <ol className="space-y-3 text-gray-600">
                            <li className="flex items-start">
                                <span className="font-bold text-[#E87C73] mr-3">1.</span>
                                <span>Ingresa tu correo electrónico</span>
                            </li>
                            <li className="flex items-start">
                                <span className="font-bold text-[#E87C73] mr-3">2.</span>
                                <span>Recibirás un enlace de recuperación</span>
                            </li>
                            <li className="flex items-start">
                                <span className="font-bold text-[#E87C73] mr-3">3.</span>
                                <span>Crea tu nueva contraseña</span>
                            </li>
                            <li className="flex items-start">
                                <span className="font-bold text-[#E87C73] mr-3">4.</span>
                                <span>¡Listo! Ya puedes acceder a tu cuenta</span>
                            </li>
                        </ol>
                    </div>
                </div>
                <div className="text-sm text-gray-500">
                    © 2023 CuentasPro. Todos los derechos reservados.
                </div>
            </div>
            {/* Right column - Form */}
            <div className="w-1/2 p-16 flex flex-col justify-center">
                <div className="max-w-md mx-auto w-full">
                    <button
                        className="p-2 rounded-full hover:bg-white mb-6 inline-flex items-center text-gray-600"
                        onClick={() => navigate('/signin')}
                    >
                        <ArrowLeftIcon size={18} className="mr-2" />
                        <span>Volver</span>
                    </button>
                    <div className="bg-white p-8 rounded-xl shadow-sm">
                        {!emailSent ? (
                            <>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="flex items-center mb-6">
                                        <div className="bg-[#FFF5EB] p-3 rounded-full">
                                            <MailIcon size={32} color="#E87C73" />
                                        </div>
                                        <div className="ml-4">
                                            <h2 className="text-2xl font-bold text-gray-800">
                                                Recuperar contraseña
                                            </h2>
                                            <p className="text-gray-600">
                                                Te enviaremos un enlace de recuperación
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <Input
                                            label="Correo electrónico"
                                            type="email"
                                            placeholder="correo@ejemplo.com"
                                            register={register('email')}
                                        />
                                        {errors.email && <p className="pl-4 text-red-500 text-xs">{errors.email.message}</p>}
                                        <div className="pt-4">
                                            <Button type='submit' fullWidth>
                                                Enviar enlace de recuperación
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="text-center mt-6">
                                        <p className="text-sm text-gray-600">
                                            ¿Recordaste tu contraseña?{' '}
                                            <button
                                                onClick={() => navigate('/signin')}
                                                className="text-[#E87C73] font-medium"
                                            >
                                                Inicia sesión
                                            </button>
                                        </p>
                                    </div>
                                </form>
                            </>
                        ) : (
                            <div className="flex flex-col items-center py-6">
                                <div className="bg-[#B7E4C7] p-4 rounded-full mb-6">
                                    <CheckCircleIcon size={48} color="#FFFFFF" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-3 text-center">
                                    ¡Correo enviado!
                                </h2>
                                <p className="text-gray-600 text-center mb-8">
                                    Hemos enviado un enlace de recuperación a{' '}
                                    <span className="font-medium">{email}</span>. Revisa tu
                                    bandeja de entrada.
                                </p>
                                <Button onClick={() => navigate('/signin')} fullWidth>
                                    Volver al inicio de sesión
                                </Button>
                                <button
                                    onClick={() => setEmailSent(false)}
                                    className="mt-6 text-[#E87C73] font-medium"
                                >
                                    ¿No recibiste el correo? Reenviar
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
    return (
        <>
            {loading && (
                <Spinner size='large' fullScreen text='Enviando correo' />
            )}
            {mobileLayout}
            {desktopLayout}
        </>
    )
}
