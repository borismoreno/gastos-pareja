import { BottomNav } from "../components/shared/BottomNav"
import { FloatingActionButton } from "../components/shared/FloatingActionButton"

export const Statistics = () => {
    return (
        <div className="flex flex-col h-full bg-white">
            <div className="flex-1 overflow-y-auto pb-20 lg:pb-6 p-6">
                <h1 className="text-2xl font-bold mb-6">Estadísticas</h1>
                {/* Contenido de estadísticas aquí */}
                <div className="bg-gray-100 p-8 rounded-xl flex items-center justify-center h-64">
                    <p className="text-gray-500 text-center">
                        Aquí se mostrarán tus estadísticas de gastos
                    </p>
                </div>
            </div>
            {/* Floating Action Button */}
            <FloatingActionButton />
            {/* Bottom Navigation - Only visible on mobile */}
            <BottomNav />
        </div>
    )
}
