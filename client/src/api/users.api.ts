import { api } from './api'

type TUserUser = {
    user: TUser
}
export type TUser = {
    tasks: never[]
    _id: string
    email: string
    name: string
    color: string
}
export type TUserArray = [TUser]
export type TUsers = {users: TUserArray}
export type TNewUserData = {
    name: string
    email: string
    color: string
}

export const usersAPI = {
    getAllUsers() {
        return api.get<TUsers>('users/get')
        .then(res => res.data).then(res => {return res.users})
    },
    getUser(userId: string) {
        return api.get<TUserUser>(`users/${userId}`).then(res => res.data.user)
    },
    updateUser(userId: string, data: TNewUserData | null) {
        return api.put(`users/${userId}`, data)
    }
}