import { useNavigate } from "react-router"
import { ProgressBar } from "../components/hogar/ProgressBar"
import { FloatingActionButton } from "../components/shared/FloatingActionButton"
import { User as UserIcon, Bell as BellIcon } from 'lucide-react'
import { ExpenseCard } from "../components/hogar/ExpenseCard"
import { BottomNav } from "../components/shared/BottomNav"
import { useEffect, useState } from "react"
import { obtenerResumenHogar, type ResumenHogar } from "../services/gastoService"
import { useAppSelector } from "../app/hooks"
import { SkeletonSummary } from '../components/shared/SkeletonSummary';
import { SkeletonCard } from "../components/shared/SkeletonCard"

export const Home = () => {
    const navigate = useNavigate();
    const { hogar } = useAppSelector(state => state.hogar);
    const [data, setData] = useState<ResumenHogar | undefined>(undefined);


    useEffect(() => {
        const getData = async () => {
            const timezone = 'America/Bogota';
            const now = new Date();
            const dtf = new Intl.DateTimeFormat('en', { timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit' });
            const parts = dtf.formatToParts(now).reduce<Record<string, string>>((acc, p) => {
                if (p.type && p.type !== 'literal') acc[p.type] = p.value;
                return acc;
            }, {});
            const todayStr = `${parts.year}-${parts.month}-${parts.day}`;
            const firstDayOfMonthStr = `${parts.year}-${parts.month}-01`;
            const result = await obtenerResumenHogar(hogar?.id!, firstDayOfMonthStr, todayStr);
            setData(result);
        }
        getData();
    }, []);

    return (
        <div className="flex flex-col h-full bg-[#FFF5EB] lg:bg-white">
            <div className="flex-1 overflow-y-auto pb-20 lg:pb-6">
                {/* Header - Mobile version */}
                <div className="bg-white p-4 rounded-b-3xl shadow-sm lg:hidden">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-[#E87C73] rounded-full flex items-center justify-center mr-3">
                                <UserIcon size={20} color="#FFFFFF" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Hola,</p>
                                <p className="font-semibold text-gray-800">{hogar?.nombre}</p>
                            </div>
                        </div>
                        <button className="p-2 bg-gray-100 rounded-full">
                            <BellIcon size={20} color="#666666" />
                        </button>
                    </div>
                    {/* Monthly Summary - Mobile */}
                    {data ? (
                        <div className="bg-gray-100 p-4 rounded-xl">
                            <h3 className="font-semibold mb-3">
                                Resumen de{" "}
                                {new Intl.DateTimeFormat('es-CO', { month: 'long', timeZone: 'America/Bogota' })
                                    .format(new Date())
                                    .replace(/^./, c => c.toUpperCase())
                                }
                            </h3>
                            <ProgressBar
                                current={data?.gastado ?? 0}
                                total={data?.presupuesto ?? 0}
                            />
                            <div className="flex justify-between mt-2">
                                <div>
                                    <p className="text-sm text-gray-600">Gastado</p>
                                    <p className="font-semibold">${data?.gastado}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-gray-600">Presupuesto</p>
                                    <p className="font-semibold">${data?.presupuesto}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-600">Disponible</p>
                                    <p className="font-semibold text-[#B7E4C7]">
                                        ${data?.disponible}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )
                        : (
                            <SkeletonSummary />
                        )
                    }
                </div>
                {/* Desktop Header */}
                <div className="hidden lg:block p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">Resumen de Gastos</h1>
                        <div className="flex items-center space-x-4">
                            <button className="p-2 bg-gray-100 rounded-full">
                                <BellIcon size={20} color="#666666" />
                            </button>
                        </div>
                    </div>
                    {/* Monthly Summary - Desktop */}
                    {data ? (

                        <div className="bg-[#FFF5EB] p-6 rounded-xl mb-6 shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold">Resumen de{" "}
                                    {new Intl.DateTimeFormat('es-CO', { month: 'long', timeZone: 'America/Bogota' })
                                        .format(new Date())
                                        .replace(/^./, c => c.toUpperCase())
                                    }</h3>
                                <div className="text-sm font-medium text-[#E87C73]">
                                    <span className="text-gray-600">Disponible: </span>$
                                    {data?.disponible}
                                </div>
                            </div>
                            <ProgressBar
                                current={data?.gastado ?? 0}
                                total={data?.presupuesto ?? 0}
                            />
                            <div className="flex justify-between mt-4 text-center">
                                <div className="bg-white p-4 rounded-lg shadow-sm w-1/3 mx-1">
                                    <p className="text-sm text-gray-600">Gastado</p>
                                    <p className="text-xl font-bold">${data?.gastado}</p>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-sm w-1/3 mx-1">
                                    <p className="text-sm text-gray-600">Presupuesto</p>
                                    <p className="text-xl font-bold">${data?.presupuesto}</p>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-sm w-1/3 mx-1">
                                    <p className="text-sm text-gray-600">Disponible</p>
                                    <p className="text-xl font-bold text-[#B7E4C7]">
                                        ${data?.disponible}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-[#FFF5EB] p-6 rounded-xl mb-6 shadow-sm animate-pulse">
                            <div className="flex justify-between items-center mb-4">
                                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/5"></div>
                            </div>
                            <div className="h-6 bg-gray-200 rounded-full w-full mb-4"></div>
                            <div className="flex justify-between mt-4 text-center">
                                <div className="bg-gray-200 p-4 rounded-lg w-1/3 mx-1 h-24"></div>
                                <div className="bg-gray-200 p-4 rounded-lg w-1/3 mx-1 h-24"></div>
                                <div className="bg-gray-200 p-4 rounded-lg w-1/3 mx-1 h-24"></div>
                            </div>
                        </div>
                    )}
                </div>
                {/* Recent Expenses */}
                <div className="p-4 lg:p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg lg:text-xl font-semibold">
                            Gastos recientes
                        </h3>
                        <button
                            onClick={() => navigate('/statistics')}
                            className="text-sm text-[#E87C73] font-medium"
                        >
                            Ver todos
                        </button>
                    </div>
                    {/* Desktop grid layout for expenses */}
                    <div className="hidden lg:grid grid-cols-2 gap-4">
                        {data ? (
                            data?.ultimos_gastos && data.ultimos_gastos.map((expense) => (
                                <ExpenseCard
                                    key={expense.id}
                                    expense={expense}
                                    onClick={() => console.log(expense)}
                                />
                            ))
                        ) : (
                            <>
                                <SkeletonCard />
                                <SkeletonCard />
                                <SkeletonCard />
                                <SkeletonCard />
                            </>
                        )}
                    </div>
                    {/* Mobile list layout for expenses */}
                    <div className="lg:hidden">
                        {data ? (
                            data?.ultimos_gastos && data.ultimos_gastos.map((expense) => (
                                <ExpenseCard
                                    key={expense.id}
                                    expense={expense}
                                    onClick={() => console.log(expense)}
                                />
                            ))
                        ) : (
                            <>
                                <SkeletonCard />
                                <SkeletonCard />
                                <SkeletonCard />
                                <SkeletonCard />
                            </>
                        )}
                    </div>
                </div>
            </div>
            <FloatingActionButton />
            <BottomNav />
        </div>
    )
}
