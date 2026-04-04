import { User } from "@/db/user.model"

export interface AuthResponse {
    user: User
    token: string
}