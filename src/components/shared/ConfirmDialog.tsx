import React from 'react'
import { X as XIcon, AlertTriangle as AlertTriangleIcon } from 'lucide-react'
import { Button } from '../UI/Button'
// import { Button } from './Button'
interface ConfirmDialogProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    variant?: 'danger' | 'warning'
}
export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    variant = 'danger',
}) => {
    if (!isOpen) return null
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                        <div
                            className={`p-2 rounded-full mr-3 ${variant === 'danger' ? 'bg-red-100' : 'bg-yellow-100'}`}
                        >
                            <AlertTriangleIcon
                                size={24}
                                color={variant === 'danger' ? '#EF4444' : '#F59E0B'}
                            />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <XIcon size={24} />
                    </button>
                </div>
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="flex space-x-3">
                    <Button onClick={onClose} variant="secondary" fullWidth>
                        {cancelText}
                    </Button>
                    <Button
                        onClick={onConfirm}
                        className={
                            variant === 'danger' ? 'bg-red-500 hover:bg-red-600' : ''
                        }
                        fullWidth
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>
    )
}
