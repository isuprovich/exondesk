import { useSnackbar } from "notistack"
import { useState, useCallback, useEffect } from "react"
import { useApi } from "./api.hook"

export const useUsers = () => {
    const { enqueueSnackbar } = useSnackbar()
    const { loading, request } = useApi()
    const loadingUsers = loading
    const [users, setUsers] = useState([{ "tasks": [], "_id": "", "email": "", "name": "" }])
    const getUsers = useCallback(async () => {
        try {
            const reqData = await request('/api/users/get', 'GET')
            setUsers(reqData.users)
        } catch (e) {
            enqueueSnackbar(e.message, { variant: 'error' })
        }
    }, [request, enqueueSnackbar])
    useEffect(() => {
        getUsers()
    }, [getUsers])
    return {loadingUsers, users}
}
export const useUser = (userId: string) => {
    const { enqueueSnackbar } = useSnackbar()
    const { loading, request } = useApi()
    const loadingUser = loading
    const [user, setUser] = useState({ "tasks": [], "_id": "", "email": "", "name": "" })
    const getUser = useCallback(async () => {
        try {
            const reqData = await request(`/api/users/${userId}`, 'GET')
            setUser(reqData.user)
        } catch (e) {
            enqueueSnackbar("Случился прекол", { variant: 'error' })
        }
    }, [request, enqueueSnackbar, userId])
    useEffect(() => {
        getUser()
    }, [getUser])
    return {loadingUser, user}
}