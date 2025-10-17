export const SkeletonSettings = () => {
    return (
        <div className="flex flex-col h-full bg-[#FFF5EB] lg:bg-white animate-pulse">
            <div className="flex-1 overflow-y-auto pb-20 lg:pb-6">
                {/* Header */}
                <div className="bg-white p-4 lg:p-6 lg:pb-0 rounded-b-3xl lg:rounded-none shadow-sm lg:shadow-none">
                    <div className="h-7 bg-gray-200 rounded w-1/3 mb-6"></div>
                    {/* Couple Code Skeleton */}
                    <div className="bg-gray-100 p-4 lg:p-6 rounded-xl mb-6">
                        <div className="flex items-center mb-2">
                            <div className="h-5 w-5 bg-gray-200 rounded-full mr-2"></div>
                            <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                        </div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                        <div className="bg-white p-3 lg:p-4 rounded-lg border-2 border-dashed border-gray-200 flex justify-between items-center">
                            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                            <div className="h-4 bg-gray-200 rounded w-16"></div>
                        </div>
                    </div>
                </div>
                {/* Settings groups */}
                <div className="p-4 lg:p-6 lg:grid lg:grid-cols-2 lg:gap-6">
                    {/* Members section */}
                    <div className="mb-6 lg:mb-0">
                        <div className="h-5 bg-gray-200 rounded w-1/4 mb-3"></div>
                        <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                            {[1, 2].map((_, index) => (
                                <div
                                    key={index}
                                    className={`p-4 flex justify-between items-center ${index !== 1 ? 'border-b border-gray-100' : ''}`}
                                >
                                    <div className="flex items-center">
                                        <div className="bg-gray-200 h-10 w-10 rounded-full mr-3"></div>
                                        <div>
                                            <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                                            <div className="h-3 bg-gray-200 rounded w-16"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Configuration section */}
                    <div className="mb-6 lg:mb-0">
                        <div className="h-5 bg-gray-200 rounded w-1/4 mb-3"></div>
                        <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                            {[1, 2].map((_, index) => (
                                <div
                                    key={index}
                                    className={`p-4 flex justify-between items-center ${index !== 1 ? 'border-b border-gray-100' : ''}`}
                                >
                                    <div className="flex items-center">
                                        <div className="bg-gray-200 h-10 w-10 rounded-full mr-3"></div>
                                        <div>
                                            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                                        </div>
                                    </div>
                                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Logout button skeleton - Mobile */}
                    <div className="mt-6 lg:hidden">
                        <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
                    </div>
                    {/* Logout button skeleton - Desktop */}
                    <div className="hidden lg:flex mt-8 justify-center col-span-2">
                        <div className="h-9 bg-gray-200 rounded-lg w-32"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
