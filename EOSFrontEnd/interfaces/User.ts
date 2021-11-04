export interface User {
    uid: string,
    email: string,
    name: string,
    phone?: string,
    description?: string,
    joinedDate: string,
    walletAccountName?: string
}