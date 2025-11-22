import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { obtenerHogarPorUsuario } from '../services/hogarService';
import { setHogar } from '../reducers/hogarSlice';
import { useAppDispatch, useAppSelector } from '../app/hooks';

export const PublicRoute = () => {
    const location = useLocation();
    const currentPath = location.pathname;
    const [loading, setLoading] = useState<boolean>(true);
    const { session } = useAuth();
    const { hasHogar } = useAppSelector(state => state.hogar);
    const dispatch = useAppDispatch();

    useEffect(() => {
        async function verificarHogar() {
            setLoading(true);
            if (session) {
                const result = await obtenerHogarPorUsuario(session.user.id!);
                if (result) {
                    dispatch(setHogar({
                        id: result.id,
                        nombre: result.nombre,
                        join_code: result.join_code,
                        presupuesto: result.presupuesto_mensual ?? 0
                    }))
                }
                // setHasHogar(!!result);
            }
            setLoading(false);
        }
        if (session) {
            if (!hasHogar)
                verificarHogar();
        } else {
            setLoading(false);
        }
    }, [session, hasHogar]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#FFF5EB]">
                <div className="text-xl text-gray-700 font-semibold">Cargando...</div>
            </div>
        );
    }

    console.log(currentPath !== '/reset-password');

    if (session && hasHogar && !currentPath.includes('/reset-password')) {
        return <Navigate to='/home' replace />;
    } else if (session && !hasHogar && !currentPath.includes('/reset-password')) {
        return <Navigate to='/unir-hogar' replace />;
    }
    return <Outlet />;
}
