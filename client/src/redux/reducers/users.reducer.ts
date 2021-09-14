import { ThunkAction } from "redux-thunk"
import { TUser, TUserArray, usersAPI } from "../../api/users.api"
import { TAppState, TInferActions } from "../store"

const initialState = {
    users: [] as unknown as TUserArray,
    isLoading: false as boolean,
    currentUser: {} as TUser
}
export type TUsersState = typeof initialState

//USERS REDUCER
const usersReducer = (state = initialState, action: TUsersActions): TUsersState => {
    switch (action.type) {
        case 'SET_USERS':
            return {
                ...state,
                users: action.payload
            }
        case 'SET_LOADING_STATUS':
            return {
                ...state,
                isLoading: action.payload
            }
        case 'SET_CURRENT_USER':
            return {
                ...state,
                currentUser: action.payload
            }
        default:
            return state
    }
}

//ACTION CREATORS
type TUsersActions = TInferActions<typeof usersActions>
export const usersActions = {
    setUsers: (users: TUserArray) => ({ type: 'SET_USERS', payload: users } as const),
    setLoadStatus: (isLoading: boolean) => ({type: 'SET_LOADING_STATUS', payload: isLoading} as const),
    setCurrentUser: (currentUser: TUser) => ({type: 'SET_CURRENT_USER', payload: currentUser} as const)
}

//THUNKS
type ThunkType = ThunkAction<Promise<void>, TAppState, unknown, TUsersActions>

export const getUsers = (): ThunkType => async (dispatch) => {
    dispatch(usersActions.setLoadStatus(true))
    await usersAPI.getAllUsers().then(users => {
        dispatch(usersActions.setUsers(users))
        dispatch(usersActions.setLoadStatus(false))
    }, error => {
        console.log(error)
        dispatch(usersActions.setLoadStatus(false))
    })
}
export const getCurrentUser = (userId: string): ThunkType => async (dispatch) => {
    dispatch(usersActions.setLoadStatus(true))
    await usersAPI.getUser(userId).then(user => {
        dispatch(usersActions.setCurrentUser(user))
        dispatch(usersActions.setLoadStatus(false))
    }, error => {
        console.log(error)
        dispatch(usersActions.setLoadStatus(false))
    })
}

export default usersReducer