import {createContext} from 'react'

function noop() {}

type TAuthContext = {
    token: string | null
    userId: string | null
    login: (token: string, userId: string) => void
    logout: () => void
    isAuth: boolean
}

export const AuthContext = createContext<TAuthContext>({
    token: null,
    userId: null,
    login: noop,
    logout: noop,
    isAuth: false
})