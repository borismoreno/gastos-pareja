import {
    Home as HomeIcon,
    PieChart as PieChartIcon,
    Receipt as ReceiptIcon,
    Settings as SettingsIcon,
} from 'lucide-react'
import { NavLink } from 'react-router'

export const BottomNav = () => {
    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-[0_-2px_5px_rgba(0,0,0,0.1)] pb-2 z-10">
            <div className="flex justify-around items-center pt-2 px-4">
                <NavLink
                    to="/home"
                    className={({ isActive }) =>
                        `flex flex-col items-center justify-center p-2 cursor-pointer ${isActive ? 'text-[#E87C73]' : 'text-gray-500'}`
                    }
                >
                    {({ isActive }) => (
                        <>
                            <HomeIcon size={24} color={isActive ? '#E87C73' : '#9e9e9e'} />
                            <span className="text-xs mt-1">Inicio</span>
                        </>
                    )}
                </NavLink>
                <NavLink
                    to="/expenses"
                    className={({ isActive }) =>
                        `flex flex-col items-center justify-center p-2 cursor-pointer ${isActive ? 'text-[#E87C73]' : 'text-gray-500'}`
                    }
                >
                    {({ isActive }) => (
                        <>
                            <ReceiptIcon size={24} color={isActive ? '#E87C73' : '#9e9e9e'} />
                            <span className="text-xs mt-1">Gastos</span>
                        </>
                    )}
                </NavLink>
                <NavLink
                    to="/statistics"
                    className={({ isActive }) =>
                        `flex flex-col items-center justify-center p-2 cursor-pointer ${isActive ? 'text-[#E87C73]' : 'text-gray-500'}`
                    }
                >
                    {({ isActive }) => (
                        <>
                            <PieChartIcon
                                size={24}
                                color={isActive ? '#E87C73' : '#9e9e9e'}
                            />
                            <span className="text-xs mt-1">Estadísticas</span>
                        </>
                    )}
                </NavLink>
                <NavLink
                    to="/settings"
                    className={({ isActive }) =>
                        `flex flex-col items-center justify-center p-2 cursor-pointer ${isActive ? 'text-[#E87C73]' : 'text-gray-500'}`
                    }
                >
                    {({ isActive }) => (
                        <>
                            <SettingsIcon
                                size={24}
                                color={isActive ? '#E87C73' : '#9e9e9e'}
                            />
                            <span className="text-xs mt-1">Ajustes</span>
                        </>
                    )}
                </NavLink>
            </div>
        </div>
    )
}
