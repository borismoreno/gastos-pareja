import React from 'react'

interface ButtonProps {
    onClick?: () => void
    children: React.ReactNode
    variant?: 'primary' | 'secondary' | 'outline'
    fullWidth?: boolean
    className?: string
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
}

export const Button: React.FC<ButtonProps> = ({
    onClick,
    children,
    variant = 'primary',
    fullWidth = false,
    className = '',
    disabled = false,
    type = 'button',
}) => {
    const baseStyles = 'py-3 px-6 rounded-full font-medium transition-colors'
    const variantStyles =
        variant === 'primary'
            ? 'bg-[#E87C73] text-white hover:bg-[#d66b61]'
            : variant === 'secondary'
                ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                : 'bg-transparent border border-gray-300 text-gray-800 hover:bg-gray-100'
    const widthStyles = fullWidth ? 'w-full' : ''
    const disabledStyles = disabled
        ? 'opacity-50 cursor-not-allowed'
        : 'cursor-pointer'
    return (
        <button
            type={type}
            onClick={onClick}
            className={`${baseStyles} ${variantStyles} ${widthStyles} ${disabledStyles} ${className}`}
            disabled={disabled}
        >
            {children}
        </button>
    )
}
