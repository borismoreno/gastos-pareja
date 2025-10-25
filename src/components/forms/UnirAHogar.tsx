import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useAppDispatch } from '../../app/hooks';
import { useAuth } from '../../context/AuthContext';
import { unirseAHogar, type Hogar } from '../../services/hogarService';
import { setHogar } from '../../reducers/hogarSlice';
import { Input } from '../UI/Input';
import { Button } from '../UI/Button';

const schema = yup.object({
    codigoPareja: yup.string().required('Código de pareja es obligatorio')
}).required();

type FormData = yup.InferType<typeof schema>;


export const UnirAHogar = () => {
    const dispatch = useAppDispatch();
    const { session } = useAuth();
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: 'onBlur',
        reValidateMode: 'onChange',
        criteriaMode: 'all',
        shouldFocusError: true,
        defaultValues: {
            codigoPareja: ''
        }
    })

    const { register: registerMobile, handleSubmit: handleSubmitMobile, formState: { errors: errorsMobile } } = useForm({
        resolver: yupResolver(schema),
        mode: 'onBlur',
        reValidateMode: 'onChange',
        criteriaMode: 'all',
        shouldFocusError: true,
        defaultValues: {
            codigoPareja: ''
        }
    })

    const handleJoinHousehold = async (data: FormData) => {
        const result = await unirseAHogar(data.codigoPareja, session?.user.id!)
        if (result) {
            handleSetHogar(result);
        }
    }

    const handleSetHogar = (hogar: Hogar) => {
        dispatch(setHogar({
            id: hogar.id,
            nombre: hogar.nombre,
            join_code: hogar.join_code,
            presupuesto: hogar.presupuesto_mensual ?? 0
        }));
    }

    const mobileLayout = (
        <div className='block lg:hidden mb-8 space-y-4'>
            <form onSubmit={handleSubmitMobile(handleJoinHousehold)}>
                <Input
                    label="Código de pareja"
                    placeholder="Ej: ABC123"
                    register={registerMobile('codigoPareja')}
                />
                {errorsMobile.codigoPareja && <p className="pl-4 text-red-500 text-xs">{errorsMobile.codigoPareja.message}</p>}
                <div className='mt-8'>
                    <Button type='submit' fullWidth>
                        {'Unirme al hogar'}
                    </Button>
                </div>
            </form>
        </div>
    )

    const desktopLayout = (
        <div className="hidden lg:block my-8 space-y-4">
            <form onSubmit={handleSubmit(handleJoinHousehold)}>
                <Input
                    label="Código de pareja"
                    placeholder="Ej: ABC123"
                    register={register('codigoPareja')}
                />
                {errors.codigoPareja && <p className="pl-4 text-red-500 text-xs">{errors.codigoPareja.message}</p>}
                <div className='mt-6'>
                    <Button type='submit' fullWidth>
                        {'Unirme al hogar'}
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
