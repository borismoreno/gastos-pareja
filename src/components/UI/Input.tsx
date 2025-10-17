import React from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'

interface InputProps {
    label: string
    type?: string
    placeholder?: string
    required?: boolean
    register: UseFormRegisterReturn
}

export const Input: React.FC<InputProps> = ({
    label,
    type = 'text',
    placeholder,
    required = false,
    register,
}) => {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
                autoComplete='off'
                type={type}
                placeholder={placeholder}
                className="w-full px-4 py-3 bg-gray-100 rounded-xl border-none focus:ring-2 focus:ring-[#E87C73] focus:outline-none"
                required={required}
                {...register}
            />
        </div>
    )
}
