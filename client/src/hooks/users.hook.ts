import { useSnackbar } from "notistack"
import { useState, useCallback, useEffect } from "react"
import { useApi } from "./api.hook"

export const useUsers = () => {
    const { enqueueSnackbar } = useSnackbar()
    const { loading, request } = useApi()
    const loadingUsers = loading
    const [users, setUsers] = useState([{ "tasks": [], "_id": "Не выбран", "email": "Не выбран" }])
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