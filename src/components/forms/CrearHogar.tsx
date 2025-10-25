import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { Input } from '../UI/Input';
import { useAuth } from '../../context/AuthContext';
import { crearHogar, type Hogar } from '../../services/hogarService';
import { useAppDispatch } from '../../app/hooks';
import { setHogar } from '../../reducers/hogarSlice';
import { Button } from '../UI/Button';

const schema = yup.object({
    nombreHogar: yup.string().required('Nombre de hogar es obligatorio'),
    presupuesto: yup
        .number()
        .typeError('El presupuesto debe ser un número')
        .positive('El presupuesto debe ser mayor a 0')
        .required('El presupuesto es obligatorio'),
}).required();

type FormData = yup.InferType<typeof schema>;


export const CrearHogar = () => {
    const dispatch = useAppDispatch();
    const { session } = useAuth();
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: 'onBlur',
        reValidateMode: 'onChange',
        criteriaMode: 'all',
        shouldFocusError: true,
        defaultValues: {
            nombreHogar: '',
            presupuesto: 0
        }
    })

    const { register: registerMobile, handleSubmit: handleSubmitMobile, formState: { errors: errorsMobile } } = useForm({
        resolver: yupResolver(schema),
        mode: 'onBlur',
        reValidateMode: 'onChange',
        criteriaMode: 'all',
        shouldFocusError: true,
        defaultValues: {
            nombreHogar: '',
            presupuesto: 0
        }
    })

    const handleSetHogar = (hogar: Hogar) => {
        dispatch(setHogar({
            id: hogar.id,
            nombre: hogar.nombre,
            join_code: hogar.join_code,
            presupuesto: hogar.presupuesto_mensual ?? 0
        }));
    }

    const handleCreateHousehold = async (data: FormData) => {
        const result = await crearHogar(data.nombreHogar, undefined, data.presupuesto, session?.user.id!);
        if (result) {
            handleSetHogar(result.hogar);
        }
    }

    const mobileLayout = (
        <div className="block lg:hidden mb-8 space-y-4">
            <form onSubmit={handleSubmitMobile(handleCreateHousehold)}>
                <Input
                    label="Nombre del hogar"
                    placeholder="Ej: Hogar de María y Carlos"
                    register={registerMobile('nombreHogar')}
                />
                {errorsMobile.nombreHogar && <p className="pl-4 text-red-500 text-xs">{errorsMobile.nombreHogar.message}</p>}
                <Input
                    label="Presupuesto mensual"
                    placeholder="Ej: 2000"
                    type="number"
                    register={registerMobile('presupuesto')}
                />
                {errorsMobile.presupuesto && <p className="pl-4 text-red-500 text-xs">{errorsMobile.presupuesto.message}</p>}
                <div className='mt-8'>
                    <Button type='submit' fullWidth>
                        {'Crear mi hogar'}
                    </Button>
                </div>
            </form>
        </div>
    )

    const desktopLayout = (
        <div className="hidden lg:block my-8 space-y-4">
            <form onSubmit={handleSubmit(handleCreateHousehold)}>
                <Input
                    label="Nombre del hogar"
                    placeholder="Ej: Hogar de María y Carlos"
                    register={register('nombreHogar')}
                />
                {errors.nombreHogar && <p className="pl-4 text-red-500 text-xs">{errors.nombreHogar.message}</p>}
                <Input
                    label="Presupuesto mensual"
                    placeholder="Ej: 2000"
                    type="number"
                    register={register('presupuesto')}
                />
                {errors.presupuesto && <p className="pl-4 text-red-500 text-xs">{errors.presupuesto.message}</p>}
                <div className="mt-6">
                    <Button type='submit' fullWidth>
                        {'Crear mi hogar'}
                    </Button>
                </div>
            </form>
        </div>
    )
    return (
        <>
            {mobileLayout}
            {desktopLayout}
        </>
    )
}
