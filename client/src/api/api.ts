import axios from 'axios'

export const api = axios.create({
    baseURL: `${process.env.PUBLIC_URL}/api/`,
    timeout: 10000,
    timeoutErrorMessage: 'Request timed out',
    withCredentials: true
})