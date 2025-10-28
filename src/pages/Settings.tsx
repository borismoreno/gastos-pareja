import {
    User as UserIcon,
    Users as UsersIcon,
    DollarSign as DollarSignIcon,
    LogOut as LogOutIcon,
    ChevronRight as ChevronRightIcon,
    Pencil as PencilIcon,
    Check as CheckIcon,
    X as XIcon,
    Camera as CameraIcon,
    Mail as MailIcon,
    UserMinus as UserMinusIcon,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '../components/UI/Button'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { useAuth } from '../context/AuthContext'
import { removeHogar, setHogar } from '../reducers/hogarSlice'
import { BottomNav } from '../components/shared/BottomNav'
import { actualizarPresupuestoHogar, obtenerUsuariosHogar } from '../services/hogarService'
import { showToast } from '../utils/toast'
import { SkeletonSettings } from '../components/skeletons/SkeletonSettings'
import { ConfirmDialog } from '../components/shared/ConfirmDialog'
import { actualizarPerfilUsuario } from '../services/perfilUsuarioService'
import { StorageService } from '../services/StorageService'

const storage = new StorageService('fotos')

// Define interfaces for the different item types
interface MemberItem {
    type: 'member'
    icon: React.ReactNode
    label: string
    info: string
}
interface EditableItem {
    type: 'editable'
    id: string
    icon: React.ReactNode
    label: string
    info: string
    editable: boolean
}
interface ActionItem {
    type: 'action'
    icon: React.ReactNode
    label: string
    action: boolean
}
// Union type for all possible item types
type SettingItem = MemberItem | EditableItem | ActionItem
// Interface for the settings group
interface SettingGroup {
    title: string
    items: SettingItem[]
}

export const Settings = () => {
    const { hogar } = useAppSelector(state => state.hogar);
    const [monthlyLimit, setMonthlyLimit] = useState(`${hogar?.presupuesto}`)
    const [showLeaveDialog, setShowLeaveDialog] = useState(false)
    // const [usuarios, setUsuarios] = useState<UsuarioHogar[]>([]);
    const [settingsGroups, setSettingsGroups] = useState<SettingGroup[]>()
    // Estado para controlar qué campo está siendo editado
    const [editing, setEditing] = useState<string | null>(null)
    // Estado temporal mientras se edita
    const [tempValue, setTempValue] = useState('')
    const dispatch = useAppDispatch();
    const { signOut, session, rol, perfilUsuario, user, updatePerfilUsuario } = useAuth();

    const handleSignOut = async () => {
        await signOut();
        dispatch(removeHogar());
    }

    const startEditing = (field: string, currentValue: string) => {
        setEditing(field)
        setTempValue(currentValue.replace(/,/g, ''))
    }
    const cancelEditing = () => {
        setEditing(null)
        setTempValue('')
    }

    useEffect(() => {
        const getData = async () => {
            const result = await obtenerUsuariosHogar(hogar?.id!)
            if (result) {
                const memberItems: MemberItem[] = result.map((u) => ({
                    type: 'member',
                    icon: <UserIcon size={20} color="#666666" />,
                    // usa los campos más probables y cae en un fallback si no existen
                    label: (u as any).display_name ?? (u as any).email ?? 'Usuario',
                    info: (u as any).rol === 'admin' ? 'Cuenta principal' : 'Miembro',
                }))

                setSettingsGroups([
                    {
                        title: 'Miembros del hogar',
                        items: memberItems,
                    },
                    {
                        title: 'Configuración',
                        items: [
                            {
                                type: 'editable',
                                id: 'monthlyLimit',
                                icon: <DollarSignIcon size={20} color="#666666" />,
                                label: 'Límite mensual',
                                info: `$${monthlyLimit}`,
                                editable: true,
                            },
                        ],
                    },
                ])
            }
        }
        getData()
    }, [monthlyLimit])

    const saveChanges = async (field: string) => {
        if (field === 'monthlyLimit') {
            const formattedValue = Number(tempValue).toLocaleString()
            setMonthlyLimit(formattedValue)
            const result = await actualizarPresupuestoHogar(hogar?.id!, Number(tempValue), session?.user.id!)
            if (result) {
                showToast('¡Presupuesto actualizado correctamente!', 'success', {
                    duration: 1500,
                })
                dispatch(setHogar({
                    id: result.id,
                    nombre: result.nombre,
                    join_code: result.join_code,
                    presupuesto: result.presupuesto_mensual!
                }))
            }
        } else if (field === 'userName') {
            const result = await actualizarPerfilUsuario(user?.id!, { nombre: tempValue })
            if (result) {
                showToast('¡Nombre actualizado correctamente!', 'success', {
                    duration: 1500
                })
            }
            await updatePerfilUsuario();
        }

        setEditing(null)
        setTempValue('')
    }

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return
        const publicUrl = await storage.uploadImage(file, 'perfiles')
        if (publicUrl) {
            const result = await actualizarPerfilUsuario(user?.id!, { nombre: perfilUsuario?.nombre, foto_url: publicUrl })
            if (result) {
                showToast('¡Foto de perfil actualizada correctamente!', 'success', {
                    duration: 1500
                })
            }
            await updatePerfilUsuario();
        } else {
            showToast('Error al actualizar la foto de perfil', 'error', {
                duration: 1500
            })
        }
        // if (file) {
        //     const reader = new FileReader()
        //     reader.onloadend = () => {
        //         console.log(reader.result as string)
        //     }
        //     reader.readAsDataURL(file)
        // }
    }

    const handleLeaveHousehold = () => {
        setShowLeaveDialog(false)
        // Aquí iría la lógica para abandonar el hogar
        // navigate('/household-setup')
    }

    return (
        <>
            {settingsGroups ? (
                <div className="flex flex-col h-full bg-[#FFF5EB] lg:bg-white">
                    <div className="flex-1 overflow-y-auto pb-20 lg:pb-6">
                        {/* Header */}
                        <div className="bg-white p-4 lg:p-6 lg:pb-0 rounded-b-3xl lg:rounded-none shadow-sm lg:shadow-none">
                            <h1 className="text-xl lg:text-2xl font-bold mb-6">Configuración</h1>
                            {/* My Profile Section */}
                            <div className="mb-6">
                                <h2 className="font-semibold mb-3">Mi perfil</h2>
                                <div className="bg-gray-100 p-4 lg:p-6 rounded-xl">
                                    {/* Profile Image */}
                                    <div className="flex items-start mb-4">
                                        <div className="relative flex-shrink-0">
                                            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                                                {perfilUsuario?.foto_url ? (
                                                    <img
                                                        src={perfilUsuario.foto_url}
                                                        alt="Profile"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <UserIcon size={32} color="#666666" />
                                                )}
                                            </div>
                                            <label className="absolute bottom-0 right-0 bg-[#E87C73] p-1.5 rounded-full cursor-pointer hover:bg-[#d86b63] transition-colors">
                                                <CameraIcon size={14} color="#FFFFFF" />
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="hidden"
                                                />
                                            </label>
                                        </div>
                                        <div className="ml-3 flex-1 min-w-0">
                                            {editing === 'userName' ? (
                                                <div className="flex items-center gap-1">
                                                    <input
                                                        value={tempValue}
                                                        onChange={(e) => setTempValue(e.target.value)}
                                                        className="flex-1 min-w-0 px-2 py-1.5 text-sm bg-white border border-[#E87C73] rounded-lg outline-none"
                                                        autoFocus
                                                    />
                                                    <button
                                                        onClick={() => saveChanges('userName')}
                                                        className="bg-[#B7E4C7] p-1.5 rounded-full flex-shrink-0"
                                                    >
                                                        <CheckIcon size={14} color="#444444" />
                                                    </button>
                                                    <button
                                                        onClick={cancelEditing}
                                                        className="bg-gray-200 p-1.5 rounded-full flex-shrink-0"
                                                    >
                                                        <XIcon size={14} color="#444444" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-between gap-2">
                                                    <div className="min-w-0 flex-1">
                                                        <p className="font-semibold text-lg truncate">
                                                            {perfilUsuario?.nombre}
                                                        </p>
                                                        <div className="flex items-center text-sm text-gray-600 mt-1">
                                                            <MailIcon size={14} className="mr-1 flex-shrink-0" />
                                                            <span className="truncate">{user?.email}</span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => startEditing('userName', perfilUsuario?.nombre!)}
                                                        className="bg-white p-2 rounded-full hover:bg-gray-50 transition-colors flex-shrink-0"
                                                    >
                                                        <PencilIcon size={16} color="#666666" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {/* Leave Household Button */}
                                    <button
                                        onClick={() => setShowLeaveDialog(true)}
                                        className="w-full mt-4 p-3 bg-white rounded-lg flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors"
                                    >
                                        <UserMinusIcon size={18} className="mr-2" />
                                        <span className="font-medium">Abandonar hogar</span>
                                    </button>
                                </div>
                            </div>
                            {/* Couple Code */}
                            <div className="bg-gray-100 p-4 lg:p-6 rounded-xl mb-6">
                                <div className="flex items-center mb-2">
                                    <UsersIcon size={20} color="#E87C73" className="mr-2" />
                                    <span className="font-semibold">Código de pareja</span>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">
                                    Comparte este código para que tu pareja se una a tu hogar
                                </p>
                                <div className="bg-white p-3 lg:p-4 rounded-lg border-2 border-dashed border-[#E87C73] flex justify-between items-center">
                                    <span className="font-bold text-lg tracking-wider">
                                        {hogar?.join_code}
                                    </span>
                                    <button className="text-[#E87C73] font-medium text-sm">
                                        Copiar
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* Settings groups */}
                        <div className="p-4 lg:p-6 lg:grid lg:grid-cols-2 lg:gap-6">
                            {settingsGroups.map((group, groupIndex) => (
                                <div key={groupIndex} className="mb-6 lg:mb-0">
                                    <h2 className="font-semibold mb-3">{group.title}</h2>
                                    <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                                        {group.items.map((item, itemIndex) => (
                                            <div
                                                key={itemIndex}
                                                className={`p-4 flex justify-between items-center ${itemIndex !== group.items.length - 1 ? 'border-b border-gray-100' : ''}`}
                                            >
                                                <div className="flex items-center">
                                                    <div className="bg-gray-100 p-2 rounded-full mr-3">
                                                        {item.icon}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{item.label}</p>
                                                        {item.type === 'member' && item.info && (
                                                            <p className="text-xs text-gray-500">{item.info}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                {item.type === 'action' && (
                                                    <button className="bg-gray-100 p-2 rounded-full">
                                                        <ChevronRightIcon size={20} color="#E87C73" />
                                                    </button>
                                                )}
                                                {item.type === 'editable' &&
                                                    (editing === item.id ? (
                                                        <div className="flex items-center">
                                                            {item.id === 'currency' ? (
                                                                <input
                                                                    value={tempValue}
                                                                    onChange={(e) => setTempValue(e.target.value)}
                                                                    className="bg-white border border-[#E87C73] rounded px-2 py-1 w-20 mr-2"
                                                                    autoFocus
                                                                />
                                                            ) : (
                                                                <div className="flex items-center bg-white border border-[#E87C73] rounded px-2 py-1 mr-2">
                                                                    <span className="text-gray-500 mr-1">$</span>
                                                                    <input
                                                                        value={tempValue}
                                                                        onChange={(e) => setTempValue(e.target.value)}
                                                                        className="w-16 outline-none"
                                                                        type="number"
                                                                        autoFocus
                                                                    />
                                                                </div>
                                                            )}
                                                            <button
                                                                onClick={() => saveChanges(item.id)}
                                                                className="bg-[#B7E4C7] p-1 rounded-full mr-1"
                                                            >
                                                                <CheckIcon size={16} color="#444444" />
                                                            </button>
                                                            <button
                                                                onClick={cancelEditing}
                                                                className="bg-gray-200 p-1 rounded-full"
                                                            >
                                                                <XIcon size={16} color="#444444" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center">
                                                            <span className="text-sm text-gray-500 mr-2">
                                                                {item.info}
                                                            </span>
                                                            {rol === 'admin' && <button
                                                                onClick={() =>
                                                                    startEditing(
                                                                        item.id,
                                                                        monthlyLimit,
                                                                    )
                                                                }
                                                                className="bg-gray-100 p-1 rounded-full"
                                                            >
                                                                <PencilIcon size={14} color="#666666" />
                                                            </button>}
                                                        </div>
                                                    ))}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            {/* Logout button - Mobile version */}
                            <div className="mt-6 lg:hidden">
                                <Button
                                    onClick={handleSignOut}
                                    className="bg-red-500 hover:bg-red-600"
                                    fullWidth
                                >
                                    <div className="flex items-center justify-center">
                                        <LogOutIcon size={18} color="#FFFFFF" />
                                        <span className="ml-2 font-medium">Cerrar sesión</span>
                                    </div>
                                </Button>
                            </div>
                            {/* Logout button - Desktop version */}
                            <div className="hidden lg:flex mt-8 justify-center col-span-2">
                                <Button
                                    onClick={handleSignOut}
                                    variant="outline"
                                    className="border-red-400 text-red-500 hover:bg-red-50"
                                >
                                    <div className="flex items-center justify-center px-2">
                                        <LogOutIcon size={16} color="currentColor" />
                                        <span className="ml-2">Cerrar sesión</span>
                                    </div>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <SkeletonSettings />
            )}
            {/* Confirmation Dialog */}
            <ConfirmDialog
                isOpen={showLeaveDialog}
                onClose={() => setShowLeaveDialog(false)}
                onConfirm={handleLeaveHousehold}
                title="¿Abandonar el hogar?"
                message="Si abandonas el hogar, perderás acceso a todos los gastos compartidos. Esta acción no se puede deshacer."
                confirmText="Abandonar hogar"
                cancelText="Cancelar"
                variant="danger"
            />
            <BottomNav />
        </>
    )
}
