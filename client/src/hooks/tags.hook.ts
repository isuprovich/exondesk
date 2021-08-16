import { useSnackbar } from "notistack"
import { useState, useCallback, useEffect } from "react"
import { useApi } from "./api.hook"

export const useStatuses = () => {
    const { enqueueSnackbar } = useSnackbar()
    const { loading, request } = useApi()
    const loadingStatuses = loading
    const [statuses, setStatuses] = useState([{"value": "", "label": "", "color": "", "_id": ""}])
    const getStatuses = useCallback(async () => {
        try {
            const reqData = await request('/api/tags/statuses', 'GET')
            setStatuses(reqData.statuses)
        } catch (e) {
            enqueueSnackbar(e.message, { variant: 'error' })
        }
    }, [request, enqueueSnackbar])
    useEffect(() => {
        getStatuses()
    }, [getStatuses])
    return {loadingStatuses, statuses}
}
export const usePriorities = () => {
    const { enqueueSnackbar } = useSnackbar()
    const { loading, request } = useApi()
    const loadingPriorities = loading
    const [priorities, setPriorities] = useState([{"value": "", "label": "", "color": "", "_id": ""}])
    const getPriorities = useCallback(async () => {
        try {
            const reqData = await request('/api/tags/priorities', 'GET')
            setPriorities(reqData.priorities)
        } catch (e) {
            enqueueSnackbar(e.message, { variant: 'error' })
        }
    }, [request, enqueueSnackbar])
    useEffect(() => {
        getPriorities()
    }, [getPriorities])
    return {loadingPriorities, priorities}
}