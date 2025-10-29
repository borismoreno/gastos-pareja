import { useEffect, useState } from "react"
import { type GastoView, obtenerGastosPorRango } from "../services/gastoService"
import { useAppSelector } from "../app/hooks"
import { ExpenseCard } from "../components/hogar/ExpenseCard";
import { FloatingActionButton } from "../components/shared/FloatingActionButton";
import { BottomNav } from "../components/shared/BottomNav";
import { Calendar } from "../components/UI/Calendar";

export const Expenses = () => {
    const [allExpenses, setAllExpenses] = useState<GastoView[]>([]);
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    const [selectedMonth, setSelectedMonth] = useState(currentMonth)
    const [selectedYear, setSelectedYear] = useState(currentYear)
    const { hogar } = useAppSelector(state => state.hogar);

    const obtenerGastos = async () => {
        const startDate = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-01`
        const lastDay = new Date(selectedYear, selectedMonth + 1, 0).getDate()
        const endDate = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`
        const result = await obtenerGastosPorRango(hogar?.id!, startDate, endDate)
        setAllExpenses(result);
    }
    useEffect(() => {
        obtenerGastos()
    }, [selectedMonth, selectedYear])

    const handlePreviousMonth = () => {
        if (selectedMonth === 0) {
            setSelectedMonth(11)
            setSelectedYear(selectedYear - 1)
        } else {
            setSelectedMonth(selectedMonth - 1)
        }
    }
    const handleNextMonth = () => {
        if (selectedMonth === 11) {
            setSelectedMonth(0)
            setSelectedYear(selectedYear + 1)
        } else {
            setSelectedMonth(selectedMonth + 1)
        }
    }
    // Calcular gastos por día
    const expensesByDay: {
        [key: number]: number
    } = {}
    allExpenses.forEach((expense) => {
        if (!expensesByDay[expense.dia!]) {
            expensesByDay[expense.dia!] = 0
        }
        expensesByDay[expense.dia!] += expense.monto
    })

    const totalExpenses = allExpenses.reduce(
        (sum, expense) => sum + expense.monto,
        0,
    )

    return (
        <div className="flex flex-col h-full bg-[#FFF5EB] lg:bg-white">
            <div className="flex-1 overflow-y-auto pb-20 lg:pb-0">
                {/* Mobile Layout */}
                <div className="lg:hidden">
                    {/* Header */}
                    <div className="bg-white p-4 rounded-b-3xl shadow-sm">
                        <h1 className="text-2xl font-bold mb-4">Gastos del mes</h1>
                        {/* Total Summary */}
                        <div className="mb-4 bg-[#FFF5EB] p-4 rounded-xl flex justify-between items-center">
                            <span className="text-gray-600">Total del mes</span>
                            <span className="text-xl font-bold text-[#E87C73]">
                                ${totalExpenses.toFixed(2)}
                            </span>
                        </div>
                    </div>
                    {/* Calendar */}
                    <div className="p-4">
                        <Calendar
                            selectedMonth={selectedMonth}
                            selectedYear={selectedYear}
                            onPreviousMonth={handlePreviousMonth}
                            onNextMonth={handleNextMonth}
                            expensesByDay={expensesByDay}
                        />
                        {/* All Month Expenses */}
                        <div className="mt-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold">Gastos del mes</h2>
                                {allExpenses.length > 0 && (
                                    <span className="text-sm font-medium text-[#E87C73]">
                                        {allExpenses.length}{' '}
                                        {allExpenses.length === 1 ? 'gasto' : 'gastos'}
                                    </span>
                                )}
                            </div>
                            {allExpenses.length === 0 ? (
                                <div className="bg-white p-8 rounded-xl text-center shadow-sm">
                                    <p className="text-gray-500">
                                        No hay gastos registrados para este mes
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {allExpenses.map((expense) => (
                                        <ExpenseCard
                                            key={expense.id}
                                            expense={expense}
                                            onClick={() => console.log(expense)}
                                        // showRegisteredBy
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {/* Desktop Layout - Two Columns */}
                <div className="hidden lg:block h-full">
                    <div className="p-6 h-full">
                        <h1 className="text-2xl font-bold mb-6">Gastos del mes</h1>
                        <div className="flex gap-6 h-[calc(100%-4rem)]">
                            {/* Left Column - Calendar */}
                            <div className="w-[400px] flex-shrink-0">
                                <div className="sticky top-0">
                                    {/* Total Summary */}
                                    <div className="mb-4 bg-[#FFF5EB] p-4 rounded-xl flex justify-between items-center">
                                        <span className="text-gray-600 font-medium">
                                            Total del mes
                                        </span>
                                        <span className="text-xl font-bold text-[#E87C73]">
                                            ${totalExpenses.toFixed(2)}
                                        </span>
                                    </div>
                                    <Calendar
                                        selectedMonth={selectedMonth}
                                        selectedYear={selectedYear}
                                        onPreviousMonth={handlePreviousMonth}
                                        onNextMonth={handleNextMonth}
                                        expensesByDay={expensesByDay}
                                    />
                                </div>
                            </div>
                            {/* Right Column - Expenses List */}
                            <div className="flex-1 overflow-y-auto">
                                <div className="flex justify-between items-center mb-4 sticky top-0 bg-white py-2 z-10">
                                    <h2 className="text-lg font-semibold">Gastos del mes</h2>
                                    {allExpenses.length > 0 && (
                                        <span className="text-sm font-medium text-[#E87C73]">
                                            {allExpenses.length}{' '}
                                            {allExpenses.length === 1 ? 'gasto' : 'gastos'}
                                        </span>
                                    )}
                                </div>
                                {allExpenses.length === 0 ? (
                                    <div className="bg-[#FFF5EB] p-8 rounded-xl text-center">
                                        <p className="text-gray-500">
                                            No hay gastos registrados para este mes
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3 pb-6">
                                        {allExpenses.map((expense) => (
                                            <ExpenseCard
                                                key={expense.id}
                                                expense={expense}
                                                onClick={() => console.log(expense)}
                                            // showRegisteredBy
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Floating Action Button */}
            <FloatingActionButton />
            {/* Bottom Navigation - Only visible on mobile */}
            <BottomNav />
        </div>
    )
}
