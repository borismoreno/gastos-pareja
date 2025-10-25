import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import {
    ArrowLeft as ArrowLeftIcon,
    DollarSign as DollarSignIcon,
    ShoppingBag as ShoppingBagIcon,
    Home as HomeIcon,
    Heart as HeartIcon,
    Coffee as CoffeeIcon,
    Truck as TruckIcon,
    Calendar as CalendarIcon,
} from 'lucide-react'
import { useNavigate } from "react-router"
import { Input } from '../components/UI/Input'
import { Button } from '../components/UI/Button';
import { crearGasto } from '../services/gastoService';
import { useAuth } from '../context/AuthContext';
import { useAppSelector } from '../app/hooks';
import { useState } from 'react';
import { showToast } from '../utils/toast';

const schema = yup.object({
    descripcion: yup.string().required('Descripción es obligatoria'),
    category: yup.string().required('Categoría es requerida'),
    date: yup.string().required('La fecha es requerida'),
    monto: yup
        .number()
        .typeError('El monto debe ser un número')
        .positive('El monto debe ser mayor a 0')
        .required('El monto es obligatorio'),
}).required();

type FormData = yup.InferType<typeof schema>;

export const AddExpense = () => {
    const { session } = useAuth();
    const { hogar } = useAppSelector(state => state.hogar);
    const [isSaving, setIsSaving] = useState(false)
    const navigate = useNavigate()
    const getBogotaDateISO = () => {
        const parts = new Intl.DateTimeFormat('en', {
            timeZone: 'America/Bogota',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).formatToParts(new Date());

        const y = parts.find(p => p.type === 'year')?.value ?? '0000';
        const m = parts.find(p => p.type === 'month')?.value ?? '01';
        const d = parts.find(p => p.type === 'day')?.value ?? '01';

        return `${y}-${m}-${d}`;
    }

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: 'onBlur',
        reValidateMode: 'onChange',
        criteriaMode: 'all',
        shouldFocusError: true,
        defaultValues: {
            descripcion: '',
            category: 'Alimentación',
            date: getBogotaDateISO(), // fecha en formato YYYY-MM-DD según Bogotá
            monto: 0
        }
    });

    const category = watch('category');

    const categories = [
        'Alimentación',
        'Hogar',
        'Ocio',
        'Transporte',
        'Servicios',
        'Restaurantes',
        'Salud',
        'Otros',
    ]
    const getCategoryIcon = (category: string) => {
        switch (category.toLowerCase()) {
            case 'alimentación':
                return <ShoppingBagIcon size={20} color="#E87C73" />
            case 'hogar':
                return <HomeIcon size={20} color="#B7E4C7" />
            case 'ocio':
                return <HeartIcon size={20} color="#A78BFA" />
            case 'restaurantes':
                return <CoffeeIcon size={20} color="#F59E0B" />
            default:
                return <TruckIcon size={20} color="#60A5FA" />
        }
    }
    const handleChange = (value: string) => {
        setValue('category', value)
    }

    const onSubmit = async (data: FormData) => {
        try {
            setIsSaving(true)
            const result = await crearGasto(hogar?.id!, session?.user.id!, data.descripcion, data.monto, new Date(data.date), data.category);
            if (result) {
                // Simular guardado y mostrar notificación de éxito usando nuestra utilidad global
                showToast('¡Gasto guardado correctamente!', 'success', {
                    duration: 1500,
                })
                // Redirigir después de un breve retraso para que el usuario vea la notificación
                setTimeout(() => {
                    navigate('/home')
                }, 1600)
            } else {

            }
        } catch (error) {

        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="flex flex-col h-full bg-white p-4">
            <div className="flex items-center mb-4">
                <button
                    className="p-2 rounded-full hover:bg-gray-100 mr-2"
                    onClick={() => navigate('/home')}
                >
                    <ArrowLeftIcon size={20} color="#666666" />
                </button>
                <h1 className="text-xl font-bold">Agregar gasto</h1>
            </div>
            <div className="bg-[#FFF5EB] p-3 rounded-xl mb-4 flex items-center">
                <div className="bg-white p-2 rounded-full mr-2">
                    <DollarSignIcon size={20} color="#E87C73" />
                </div>
                <p className="font-medium">¿En qué gastaste hoy?</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
                <div className="space-y-4 mb-4">
                    <Input
                        label="Descripción"
                        placeholder="Ej: Compra semanal"
                        register={register('descripcion')}
                    />
                    {errors.descripcion && <p className="pl-4 text-red-500 text-xs">{errors.descripcion.message}</p>}
                    <Input
                        label="Monto"
                        // type="number"
                        placeholder="0.00"
                        register={register('monto')}
                    />
                    {errors.monto && <p className="pl-4 text-red-500 text-xs">{errors.monto.message}</p>}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Fecha
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <CalendarIcon size={18} className="text-gray-500" />
                            </div>
                            <input
                                type="date"
                                className="w-full pl-10 px-4 py-3 bg-gray-100 rounded-xl border-none focus:ring-2 focus:ring-[#E87C73] focus:outline-none"
                                {...register('date')}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Categoría
                        </label>
                        <div className="grid grid-cols-2 gap-2 mb-2">
                            {categories.slice(0, 4).map((cat) => (
                                <button
                                    key={cat}
                                    type="button"
                                    className={`flex items-center p-3 rounded-xl transition-all ${category === cat ? 'bg-[#E87C73] text-white' : 'bg-gray-100 text-gray-600'}`}
                                    onClick={() => handleChange(cat)}
                                >
                                    <span className="mr-2">{getCategoryIcon(cat)}</span>
                                    <span className="text-sm">{cat}</span>
                                </button>
                            ))}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {categories.slice(4).map((cat) => (
                                <button
                                    key={cat}
                                    type="button"
                                    className={`flex items-center p-3 rounded-xl transition-all ${category === cat ? 'bg-[#E87C73] text-white' : 'bg-gray-100 text-gray-600'}`}
                                    onClick={() => handleChange(cat)}
                                >
                                    <span className="mr-2">{getCategoryIcon(cat)}</span>
                                    <span className="text-sm">{cat}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="mt-auto pb-4 text-center">
                    <Button
                        type='submit'
                        fullWidth
                        className={`lg:w-64 lg:mx-auto ${isSaving ? 'opacity-70' : ''}`}
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <div className="flex items-center justify-center">
                                <span className="animate-pulse">Guardando...</span>
                            </div>
                        ) : (
                            'Guardar gasto'
                        )}
                    </Button>
                </div>
            </form>
        </div>
    )
}