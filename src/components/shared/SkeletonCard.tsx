export const SkeletonCard = () => {
    return (
        <div className="bg-white p-4 rounded-lg mb-3 flex items-center shadow-sm animate-pulse">
            <div className="bg-gray-200 p-2 h-10 w-10 rounded-full mr-3"></div>
            <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="text-right">
                <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-12"></div>
            </div>
        </div>
    )
}
