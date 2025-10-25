import {
    ShoppingBag as ShoppingBagIcon,
    Home as HomeIcon,
    Heart as HeartIcon,
    Coffee as CoffeeIcon,
    Truck as TruckIcon,
} from 'lucide-react'
interface ExpenseCardProps {
    expense: {
        id: string
        descripcion: string
        monto: number
        categoria: string | null
        fecha: string
        usuario_nombre: string | null
    }
    onClick: () => void
}

export const ExpenseCard = ({ expense, onClick }: ExpenseCardProps) => {
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
    return (
        <div
            className="bg-white p-4 rounded-lg mb-3 flex items-center shadow-sm cursor-pointer"
            onClick={onClick}
        >
            <div className="bg-gray-100 p-2 rounded-full mr-3">
                {getCategoryIcon(expense.categoria ?? '')}
            </div>
            <div className="flex-1">
                <div className="font-medium text-gray-800">{expense.descripcion}</div>
                <div className="text-xs text-gray-500">
                    {expense.usuario_nombre} &middot; {expense.fecha}
                </div>
            </div>
            <div className="text-right">
                <div className="font-semibold text-gray-800">${expense.monto}</div>
            </div>
        </div>
    )
}
