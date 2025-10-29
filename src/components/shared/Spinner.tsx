import React from 'react'
interface SpinnerProps {
    size?: 'small' | 'medium' | 'large'
    color?: 'primary' | 'secondary' | 'white'
    text?: string
    fullScreen?: boolean
    className?: string
}
export const Spinner: React.FC<SpinnerProps> = ({
    size = 'medium',
    color = 'primary',
    text,
    fullScreen = false,
    className = '',
}) => {
    const sizeClasses = {
        small: 'w-4 h-4 border-2',
        medium: 'w-8 h-8 border-3',
        large: 'w-12 h-12 border-4',
    }
    const colorClasses = {
        primary: 'border-[#E87C73] border-t-transparent',
        secondary: 'border-[#B7E4C7] border-t-transparent',
        white: 'border-white border-t-transparent',
    }
    const spinnerElement = (
        <div className="flex flex-col items-center justify-center">
            <div
                className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-spin ${className}`}
            />
            {text && <p className="mt-3 text-sm text-gray-600 font-medium">{text}</p>}
        </div>
    )
    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                    {spinnerElement}
                </div>
            </div>
        )
    }
    return spinnerElement
}
