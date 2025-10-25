import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useState } from 'react'
import { Button } from '../UI/Button'
import { Input } from '../UI/Input'
import {
    Users as UsersIcon,
    User as UserIcon,
    Heart as HeartIcon,
    PieChart as PieChartIcon,
    Coins as CoinsIcon,
} from 'lucide-react'
import { useNavigate } from 'react-router'
import { useAuth } from '../../context/AuthContext'

const schema = yup.object({
    email: yup.string().email('Correo electrónico no válido').required('Correo electrónico es obligatorio'),
    password: yup.string().min(8, 'La contraseña debe tener mínimo 8 caracteres').required('Contraseña es obligatoria'),
}).required();

type FormData = yup.InferType<typeof schema>;

export const SignIn = () => {
    const { signIn } = useAuth();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: 'onBlur',
        reValidateMode: 'onChange',
        criteriaMode: 'all',
        shouldFocusError: true,
        defaultValues: {
            email: '',
            password: ''
        }
    })
    const { register: registerMobile, handleSubmit: handleSubmitMobile, formState: { errors: errorsMobile } } = useForm({
        resolver: yupResolver(schema),
        mode: 'onBlur',
        reValidateMode: 'onChange',
        criteriaMode: 'all',
        shouldFocusError: true,
        defaultValues: {
            email: '',
            password: ''
        }
    })
    const onSubmit = async (data: FormData) => {
        try {
            const result = await signIn(data.email, data.password)
            if (result?.success) {
                navigate('/home');
            } else {
                setErrorMessage(result?.error)
                setTimeout(() => {
                    setErrorMessage('');
                }, 3000);
            }
        } catch (error) {

        }
    }
    // Mobile design
    const mobileLayout = (
        <div className="flex flex-col h-full bg-white p-6 overflow-y-auto lg:hidden">
            <div className="flex flex-col items-center mb-8">
                <div className="bg-[#FFF5EB] p-4 rounded-full mb-4">
                    {<UserIcon size={32} color="#E87C73" />}
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {'Inicia Sesión'}
                </h2>
                <p className="text-gray-600 text-center">{'Accede a tu cuenta para gestionar tus gastos.'}</p>
            </div>
            <div className="flex-1">
                <form onSubmit={handleSubmitMobile(onSubmit)}>
                    <Input
                        label="Correo electrónico"
                        type="email"
                        placeholder="correo@ejemplo.com"
                        register={registerMobile('email')}
                    />
                    {errorsMobile.email && <p className="pl-4 text-red-500 text-xs">{errorsMobile.email.message}</p>}
                    <Input
                        label="Contraseña"
                        type="password"
                        placeholder={
                            'Tu contraseña'
                        }
                        register={registerMobile('password')}
                    />
                    {errorsMobile.password && <p className="pl-4 text-red-500 text-xs">{errorsMobile.password.message}</p>}
                    {errorMessage && (
                        <div className="bg-red-50 text-red-700 rounded-xl p-4 mb-8">
                            {errorMessage}
                        </div>
                    )}
                    <div className="pt-4">
                        <Button type='submit' fullWidth>
                            {'Iniciar sesión'}
                        </Button>
                    </div>
                </form>
                <div className="text-center mt-6">
                    <button className="text-[#E87C73] font-medium">
                        ¿Olvidaste tu contraseña?
                    </button>
                </div>
                <div className="text-center mt-8">
                    <p className="text-sm text-gray-600">
                        ¿No tienes una cuenta?{' '}
                        <button
                            onClick={() => navigate('/signup')}
                            className="text-[#E87C73] font-medium"
                        >
                            Regístrate
                        </button>
                    </p>
                </div>
            </div>
        </div>
    )

    // Desktop design with two columns
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
                        Bienvenido a tu gestor de gastos en pareja
                    </h2>
                    <p className="text-xl text-gray-600 mb-10">
                        Simplifica la gestión de tus finanzas compartidas y mantén el
                        equilibrio en tu relación.
                    </p>
                    <div className="space-y-6 mb-10">
                        <div className="flex items-start">
                            <div className="w-10 h-10 bg-[#FFF5EB] rounded-full flex items-center justify-center mr-4 mt-1">
                                <PieChartIcon size={20} color="#E87C73" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-1">
                                    Estadísticas claras
                                </h3>
                                <p className="text-gray-600">
                                    Visualiza fácilmente los gastos compartidos y mantén el
                                    control de tu presupuesto.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className="w-10 h-10 bg-[#FFF5EB] rounded-full flex items-center justify-center mr-4 mt-1">
                                <CoinsIcon size={20} color="#E87C73" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-1">
                                    División equitativa
                                </h3>
                                <p className="text-gray-600">
                                    Divide los gastos de forma personalizada según las necesidades
                                    de cada uno.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className="w-10 h-10 bg-[#FFF5EB] rounded-full flex items-center justify-center mr-4 mt-1">
                                <UsersIcon size={20} color="#E87C73" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-1">
                                    Colaboración en tiempo real
                                </h3>
                                <p className="text-gray-600">
                                    Añade gastos y visualiza los cambios al instante para mantener
                                    la transparencia.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="text-sm text-gray-500">
                    © 2023 CuentasPro. Todos los derechos reservados.
                </div>
            </div>
            {/* Right column - Form */}
            <div className="w-1/2 p-16 flex flex-col justify-center">
                <div className="max-w-md mx-auto">
                    <div className="bg-white p-8 rounded-xl shadow-sm">
                        <div className="flex items-center mb-6">
                            <div className="bg-[#FFF5EB] p-3 rounded-full">
                                {<UserIcon size={32} color="#E87C73" />}
                            </div>
                            <div className="ml-4">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {'Inicia sesión'}
                                </h2>
                                <p className="text-gray-600">{'Accede a tu cuenta para gestionar tus gastos.'}</p>
                            </div>
                        </div>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="space-y-4">
                                <Input
                                    label="Correo electrónico"
                                    type="email"
                                    placeholder="correo@ejemplo.com"
                                    register={register('email')}
                                />
                                {errors.email && <p className="pl-4 text-red-500 text-xs">{errors.email.message}</p>}
                                <Input
                                    label="Contraseña"
                                    type="password"
                                    placeholder={
                                        'Tu contraseña'
                                    }
                                    register={register('password')}
                                />
                                {errors.password && <p className="pl-4 text-red-500 text-xs">{errors.password.message}</p>}
                                {errorMessage && (
                                    <div className="bg-red-50 text-red-700 rounded-xl p-4 mb-8">
                                        {errorMessage}
                                    </div>
                                )}
                                <div className="pt-4">
                                    <Button type='submit' fullWidth>
                                        {'Iniciar sesión'}
                                    </Button>
                                </div>
                            </div>
                        </form>
                        <div className="text-center mt-6">
                            <button className="text-[#E87C73] font-medium cursor-pointer">
                                ¿Olvidaste tu contraseña?
                            </button>
                        </div>
                        <div className="text-center mt-8">
                            <p className="text-sm text-gray-600">
                                ¿No tienes una cuenta?{' '}
                                <button
                                    onClick={() => navigate('/signup')}
                                    className="text-[#E87C73] font-medium cursor-pointer"
                                >
                                    Regístrate
                                </button>
                            </p>
                        </div>

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
