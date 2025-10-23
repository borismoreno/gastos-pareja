export type NotificationEvent =
    | 'nuevo_gasto'
    | 'presupuesto_actualizado'
    | 'nuevo_miembro'

export interface NotificationPayload {
    event: NotificationEvent
    message: string
    data?: Record<string, any>
}
