import { useEffect, useState } from "react";
import { UserAuth } from "../../context/AuthContext"
import { obtenerHogarPorUsuario, type Hogar } from "../../services/hogarService";
import { useNavigate } from "react-router";
import {
    Home as HomeIcon,
    Users as UsersIcon,
    UserPlus as UserPlusIcon,
    ArrowRight as ArrowRightIcon,
} from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setHogar } from "../../reducers/hogarSlice";
import { CrearHogar } from '../forms/CrearHogar';
import { UnirAHogar } from '../forms/UnirAHogar';


export const UnirHogar = () => {
    const navigate = useNavigate();
    const { session } = UserAuth();
    const [selectedOption, setSelectedOption] = useState<
        'create' | 'join' | null
    >(null)
    const [loading, setLoading] = useState(true); // Nuevo estado
    const { hasHogar } = useAppSelector(state => state.hogar);
    const dispatch = useAppDispatch();

    const handleSetHogar = (hogar: Hogar) => {
        dispatch(setHogar({
            id: hogar.id,
            nombre: hogar.nombre,
            join_code: hogar.join_code,
            presupuesto: hogar.presupuesto_mensual ?? 0
        }));
    }

    useEffect(() => {
        async function verificarHogar() {
            setLoading(true);
            const result = await obtenerHogarPorUsuario(session?.user.id!);
            if (result) {
                handleSetHogar(result);
            }
            setLoading(false);
        }

        if (session) {
            if (hasHogar) {
                navigate('/home');
            } else {
                verificarHogar();
            }
        } else {
            setLoading(false);
        }
    }, [session, hasHogar, navigate, dispatch]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#FFF5EB]">
                <div className="text-xl text-gray-700 font-semibold">Cargando...</div>
            </div>
        );
    }

    //Mobile layou
    const mobileLayout = (
        <div className="flex flex-col h-full bg-white p-6 pt-10 overflow-y-auto lg:hidden">
            <div className="flex flex-col items-center mb-8">
                <div className="bg-[#FFF5EB] p-4 rounded-full mb-4">
                    <HomeIcon size={32} color="#E87C73" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
                    Configura tu hogar
                </h2>
                <p className="text-gray-600 text-center">
                    Elige si quieres crear un nuevo hogar o unirte a uno existente.
                </p>
            </div>
            <div className="space-y-4 mb-8">
                <button
                    onClick={() => setSelectedOption('create')}
                    className={`w-full p-4 rounded-xl border-2 flex items-center ${selectedOption === 'create' ? 'border-[#E87C73] bg-[#FFF5EB]' : 'border-gray-200'}`}
                >
                    <div
                        className={`p-3 rounded-full mr-3 ${selectedOption === 'create' ? 'bg-[#E87C73]' : 'bg-gray-100'}`}
                    >
                        <UsersIcon
                            size={24}
                            color={selectedOption === 'create' ? '#FFFFFF' : '#666666'}
                        />
                    </div>
                    <div className="flex-1 text-left">
                        <h3 className="font-semibold text-gray-800">Crear nuevo hogar</h3>
                        <p className="text-sm text-gray-600">
                            Crea un hogar y obtén un código para invitar a tu pareja.
                        </p>
                    </div>
                </button>
                <button
                    onClick={() => setSelectedOption('join')}
                    className={`w-full p-4 rounded-xl border-2 flex items-center ${selectedOption === 'join' ? 'border-[#E87C73] bg-[#FFF5EB]' : 'border-gray-200'}`}
                >
                    <div
                        className={`p-3 rounded-full mr-3 ${selectedOption === 'join' ? 'bg-[#E87C73]' : 'bg-gray-100'}`}
                    >
                        <UserPlusIcon
                            size={24}
                            color={selectedOption === 'join' ? '#FFFFFF' : '#666666'}
                        />
                    </div>
                    <div className="flex-1 text-left">
                        <h3 className="font-semibold text-gray-800">Unirme a un hogar</h3>
                        <p className="text-sm text-gray-600">
                            Únete a un hogar existente con el código de tu pareja.
                        </p>
                    </div>
                </button>
            </div>
            {selectedOption === 'create' && (
                <CrearHogar />
            )}
            {selectedOption === 'join' && (
                <UnirAHogar />
            )}
        </div>
    )

    const desktopLayout = (
        <div className="hidden lg:flex h-screen w-full bg-[#FFF5EB]">
            {/* Left column - App info */}
            <div className="w-1/2 bg-white p-16 flex flex-col justify-between">
                <div>
                    <div className="flex items-center mb-10">
                        <div className="w-12 h-12 bg-[#E87C73] rounded-full flex items-center justify-center">
                            <HomeIcon size={24} color="#FFFFFF" />
                        </div>
                        <h1 className="ml-4 text-3xl font-bold text-gray-800">
                            CuentasPro
                        </h1>
                    </div>
                    <h2 className="text-4xl font-bold text-gray-800 mb-6">
                        Un paso más para gestionar tus gastos en pareja
                    </h2>
                    <p className="text-xl text-gray-600 mb-10">
                        Configura tu hogar para comenzar a organizar tus finanzas
                        compartidas.
                    </p>
                    <div className="bg-[#FFF5EB] p-8 rounded-xl mb-10">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">
                            ¿Cómo funciona?
                        </h3>
                        <div className="space-y-6">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 w-8 h-8 bg-[#E87C73] text-white rounded-full flex items-center justify-center mr-3">
                                    1
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-800 mb-1">
                                        Crea un hogar
                                    </h4>
                                    <p className="text-gray-600">
                                        Crea un nuevo hogar y recibe un código único para compartir.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="flex-shrink-0 w-8 h-8 bg-[#E87C73] text-white rounded-full flex items-center justify-center mr-3">
                                    2
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-800 mb-1">
                                        Invita a tu pareja
                                    </h4>
                                    <p className="text-gray-600">
                                        Comparte el código con tu pareja para que se una al hogar.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="flex-shrink-0 w-8 h-8 bg-[#E87C73] text-white rounded-full flex items-center justify-center mr-3">
                                    3
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-800 mb-1">
                                        Gestiona juntos
                                    </h4>
                                    <p className="text-gray-600">
                                        Registren gastos, visualicen estadísticas y mantengan sus
                                        finanzas organizadas.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="text-sm text-gray-500">
                    © 2023 CuentasPro. Todos los derechos reservados.
                </div>
            </div>
            {/* Right column - Household Setup */}
            <div className="w-1/2 p-16 flex flex-col justify-center">
                <div className="max-w-md mx-auto">
                    <div className="flex items-center mb-8">
                        <div className="bg-[#FFF5EB] p-4 rounded-full mr-4">
                            <HomeIcon size={32} color="#E87C73" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800">
                                Configura tu hogar
                            </h2>
                            <p className="text-gray-600">
                                Elige cómo quieres comenzar con CuentasPro
                            </p>
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-xl shadow-sm mb-8">
                        <div className="space-y-6">
                            <button
                                onClick={() => setSelectedOption('create')}
                                className={`w-full p-6 rounded-xl border-2 flex items-center transition-all ${selectedOption === 'create' ? 'border-[#E87C73] bg-[#FFF5EB]' : 'border-gray-200 hover:border-gray-300'}`}
                            >
                                <div
                                    className={`p-4 rounded-full mr-4 ${selectedOption === 'create' ? 'bg-[#E87C73]' : 'bg-gray-100'}`}
                                >
                                    <UsersIcon
                                        size={28}
                                        color={selectedOption === 'create' ? '#FFFFFF' : '#666666'}
                                    />
                                </div>
                                <div className="flex-1 text-left">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-1">
                                        Crear nuevo hogar
                                    </h3>
                                    <p className="text-gray-600">
                                        Crea un hogar y obtén un código para invitar a tu pareja.
                                    </p>
                                </div>
                                {selectedOption === 'create' && (
                                    <ArrowRightIcon size={24} color="#E87C73" className="ml-4" />
                                )}
                            </button>
                            <div className="text-center text-gray-500 text-sm">o</div>
                            <button
                                onClick={() => setSelectedOption('join')}
                                className={`w-full p-6 rounded-xl border-2 flex items-center transition-all ${selectedOption === 'join' ? 'border-[#E87C73] bg-[#FFF5EB]' : 'border-gray-200 hover:border-gray-300'}`}
                            >
                                <div
                                    className={`p-4 rounded-full mr-4 ${selectedOption === 'join' ? 'bg-[#E87C73]' : 'bg-gray-100'}`}
                                >
                                    <UserPlusIcon
                                        size={28}
                                        color={selectedOption === 'join' ? '#FFFFFF' : '#666666'}
                                    />
                                </div>
                                <div className="flex-1 text-left">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-1">
                                        Unirme a un hogar
                                    </h3>
                                    <p className="text-gray-600">
                                        Únete a un hogar existente con el código de tu pareja.
                                    </p>
                                </div>
                                {selectedOption === 'join' && (
                                    <ArrowRightIcon size={24} color="#E87C73" className="ml-4" />
                                )}
                            </button>
                        </div>
                        {selectedOption === 'create' && (
                            <CrearHogar />
                        )}
                        {selectedOption === 'join' && (
                            <UnirAHogar />
                        )}
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
