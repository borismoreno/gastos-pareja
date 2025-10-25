import React from 'react'
import {
    Home as HomeIcon,
    PieChart as PieChartIcon,
    Settings as SettingsIcon,
    LogOut as LogOutIcon,
    Users as UsersIcon,
} from 'lucide-react'
import { useAppSelector } from '../../app/hooks';
import { useAuth } from '../../context/AuthContext';
import { removeHogar } from '../../reducers/hogarSlice';
import { useAppDispatch } from '../../app/hooks';
import { NavLink } from 'react-router';

export const SideNav: React.FC = () => {
    const dispatch = useAppDispatch();
    const { signOut } = useAuth();
    const hogar = useAppSelector(state => state.hogar.hogar);
    const handleSignOut = async () => {
        await signOut();
        dispatch(removeHogar());
    }
    const navItems = [
        {
            path: '/home',
            label: 'Inicio',
            icon: HomeIcon,
        },
        {
            path: '/statistics',
            label: 'Estadísticas',
            icon: PieChartIcon,
        },
        {
            path: '/settings',
            label: 'Configuración',
            icon: SettingsIcon,
        },
    ]
    return (
        <div className="hidden lg:flex flex-col w-64 bg-white h-screen border-r border-gray-200">
            {/* Logo and app name */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center">
                    <div className="w-10 h-10 bg-[#E87C73] rounded-full flex items-center justify-center">
                        <UsersIcon size={20} color="#FFFFFF" />
                    </div>
                    <div className="ml-3">
                        <h1 className="text-xl font-bold text-gray-800">CuentasPro</h1>
                        <p className="text-sm text-gray-500">Gestión de gastos</p>
                    </div>
                </div>
            </div>
            {/* Navigation items */}
            <div className="flex-1 py-6">
                <div className="px-4 mb-6">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 px-2">
                        Navegación
                    </p>
                    <nav className="space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon
                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `w-full flex items-center px-2 py-3 text-sm font-medium rounded-lg transition-colors ${isActive ? 'bg-[#FFF5EB] text-[#E87C73]' : 'text-gray-600 hover:bg-gray-100'}`
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            <Icon
                                                size={20}
                                                color={isActive ? '#E87C73' : '#666666'}
                                                className="mr-3"
                                            />
                                            {item.label}
                                        </>
                                    )}
                                </NavLink>
                            )
                        })}
                    </nav>
                </div>
            </div>
            {/* User profile */}
            <div className="p-4 border-t border-gray-200">
                <div className="flex items-center p-2">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <UsersIcon size={20} color="#666666" />
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-medium text-gray-800">{hogar?.nombre}</p>
                        <p className="text-xs text-gray-500">Código: {hogar?.join_code}</p>
                    </div>
                </div>
                <button
                    onClick={handleSignOut}
                    className="mt-4 w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                >
                    <LogOutIcon size={16} className="mr-2" />
                    Cerrar sesión
                </button>
            </div>
        </div>
    )
}
