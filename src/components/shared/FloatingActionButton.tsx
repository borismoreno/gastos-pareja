import React from 'react'
import { PlusCircle as PlusCircleIcon } from 'lucide-react'
import { useNavigate } from 'react-router'
export const FloatingActionButton: React.FC = () => {
    const navigate = useNavigate()
    return (
        <button
            onClick={() => navigate('/add-expense')}
            className="fixed bottom-20 right-4 lg:bottom-10 lg:right-10 bg-[#E87C73] text-white w-14 h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center shadow-lg hover:bg-[#d86b62] transition-colors z-20"
            aria-label="Añadir gasto"
        >
            <PlusCircleIcon size={32} />
        </button>
    )
}