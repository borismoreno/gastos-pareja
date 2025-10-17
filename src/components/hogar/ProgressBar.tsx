interface ProgressBarProps {
    current: number
    total: number
}
export const ProgressBar = ({ current, total }: ProgressBarProps) => {
    const percentage = Math.min((current / total) * 100, 100)
    return (
        <div className="w-full">
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className="h-full bg-[#E87C73] transition-all duration-300"
                    style={{
                        width: `${percentage}%`,
                    }}
                />
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600">
                <span>${current}</span>
                <span>${total}</span>
            </div>
        </div>
    )
}
