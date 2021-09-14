import { TAppState } from "../store"

export const setUsers = (state: TAppState) => {
    return state.users.users
}
export const isLoadingUsers = (state: TAppState) => {
    return state.users.isLoading
}
export const setCurrentUser = (state: TAppState) => {
    return state.users.currentUser
}