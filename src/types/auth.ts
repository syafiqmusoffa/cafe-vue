export interface User {
    id: number
    name: string
    username: string
    role: "admin" | "cashier"
}

export interface LoginResponse {
    token: string
    user: User
    role: "admin" | "cashier"
}