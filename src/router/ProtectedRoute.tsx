import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../context/AuthContext'
import { NotificacionesProvider } from '../context/NotificacionesContext';

export const ProtectedRoute = () => {
    const { session, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#FFF5EB]">
                <div className="text-xl text-gray-700 font-semibold">Cargando...</div>
            </div>
        );
    }

    if (!session) {
        return <Navigate to='/signin' replace />;
    }

    return (
        <NotificacionesProvider usuarioId={session.user.id}>
            <Outlet />
        </NotificacionesProvider>
    )
}
