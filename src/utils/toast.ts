import { toast } from 'sonner'
import { CheckCircle, AlertCircle, Info, XCircle } from 'lucide-react'
import React from 'react'
type ToastType = 'success' | 'error' | 'info' | 'warning'
interface ToastOptions {
    duration?: number
    position?: 'top-center' | 'top-right' | 'bottom-center' | 'bottom-right'
}
const defaultOptions: ToastOptions = {
    duration: 3000,
    position: 'top-center',
}
const getIcon = (type: ToastType) => {
    switch (type) {
        case 'success':
            return React.createElement(CheckCircle, {
                size: 18,
                className: 'mr-2 text-green-500',
            })
        case 'error':
            return React.createElement(XCircle, {
                size: 18,
                className: 'mr-2 text-red-500',
            })
        case 'warning':
            return React.createElement(AlertCircle, {
                size: 18,
                className: 'mr-2 text-yellow-500',
            })
        case 'info':
            return React.createElement(Info, {
                size: 18,
                className: 'mr-2 text-blue-500',
            })
    }
}
export const showToast = (
    message: string,
    type: ToastType = 'info',
    options: ToastOptions = {},
) => {
    const mergedOptions = { ...defaultOptions, ...options }
    const content = React.createElement(
        'div',
        { className: 'flex items-center' },
        getIcon(type),
        React.createElement('span', null, message),
    )
    switch (type) {
        case 'success':
            return toast.success(content, {
                duration: mergedOptions.duration,
                className: 'bg-white border border-gray-100 shadow-md',
            })
        case 'error':
            return toast.error(content, {
                duration: mergedOptions.duration,
                className: 'bg-white border border-gray-100 shadow-md',
            })
        case 'warning':
            return toast.warning(content, {
                duration: mergedOptions.duration,
                className: 'bg-white border border-gray-100 shadow-md',
            })
        case 'info':
            return toast.info(content, {
                duration: mergedOptions.duration,
                className: 'bg-white border border-gray-100 shadow-md',
            })
    }
}
