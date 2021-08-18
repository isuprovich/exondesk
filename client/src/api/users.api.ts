import { api } from './api'

type TUserUser = {
    user: TUser
}
export type TUser = {
    tasks: never[]
    _id: string
    email: string
    name: string
}
export type TNewUserData = {
    name: string
    email: string
}

export const usersAPI = {
    getUser(userId: string) {
        return api.get<TUserUser>(`users/${userId}`).then(res => res.data)
    },
    updateUser(userId: string, data: TNewUserData | null) {
        return api.put(`users/${userId}`, data)
    }
}