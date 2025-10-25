import React from 'react'
import {
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
} from 'lucide-react'
interface CalendarProps {
    selectedMonth: number
    selectedYear: number
    onPreviousMonth: () => void
    onNextMonth: () => void
    expensesByDay: {
        [key: number]: number
    }
}
export const Calendar: React.FC<CalendarProps> = ({
    selectedMonth,
    selectedYear,
    onPreviousMonth,
    onNextMonth,
    expensesByDay,
}) => {
    const months = [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre',
    ]
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate()
    const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay()
    const days = []
    for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i)
    }
    const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
    return (
        <div className="bg-white rounded-xl p-4 lg:p-3 shadow-sm lg:max-w-2xl lg:mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 lg:mb-3">
                <button
                    onClick={onPreviousMonth}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Mes anterior"
                >
                    <ChevronLeftIcon size={20} color="#666666" />
                </button>
                <h2 className="text-lg lg:text-base font-semibold">
                    {months[selectedMonth]} {selectedYear}
                </h2>
                <button
                    onClick={onNextMonth}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Mes siguiente"
                >
                    <ChevronRightIcon size={20} color="#666666" />
                </button>
            </div>
            {/* Week days */}
            <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map((day) => (
                    <div
                        key={day}
                        className="text-center text-xs font-medium text-gray-500 py-2 lg:py-1"
                    >
                        {day}
                    </div>
                ))}
            </div>
            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => {
                    if (day === null) {
                        return <div key={`empty-${index}`} className="aspect-square" />
                    }
                    const hasExpenses = expensesByDay[day] && expensesByDay[day] > 0
                    const isToday =
                        day === new Date().getDate() &&
                        selectedMonth === new Date().getMonth() &&
                        selectedYear === new Date().getFullYear()
                    return (
                        <div
                            key={day}
                            className={`aspect-square rounded-lg flex flex-col items-center justify-center ${isToday ? 'bg-[#FFF5EB] border-2 border-[#E87C73]' : hasExpenses ? 'bg-gray-100' : ''}`}
                        >
                            <span className="text-sm lg:text-xs font-medium text-gray-800">
                                {day}
                            </span>
                            {hasExpenses && (
                                <span className="text-xs lg:text-[10px] mt-1 text-[#E87C73] font-semibold">
                                    ${expensesByDay[day].toFixed(0)}
                                </span>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
