import { ThunkAction } from "redux-thunk"
import { tagsAPI, TTag } from "../../api/tags.api"
import { TAppState, TInferActions } from "../store"

const initialState = {
    statuses: [] as unknown as TTag,
    priorities: [] as unknown as TTag,
    sides: [
        {
            _id: 'front',
            value: 'front',
            label: 'Front',
            color: '#0097a7'
        },
        {
            _id: 'back',
            value: 'back',
            label: 'Back',
            color: '#ffa000'
        }
    ] as unknown as TTag,
    isStatusesLoading: false as boolean,
    isPrioritiesLoading: false as boolean
}
export type TUsersState = typeof initialState

//USERS REDUCER
const tagsReducer = (state = initialState, action: TTagsActions): TUsersState => {
    switch (action.type) {
        case 'SET_STATUSES':
            return {
                ...state,
                statuses: action.payload
            }
        case 'SET_PRIORITIES':
            return {
                ...state,
                priorities: action.payload
            }
        case 'SET_LOAD_STATUSES':
            return {
                ...state,
                isStatusesLoading: action.payload
            }
        case 'SET_LOAD_PRIORITIES':
            return {
                ...state,
                isPrioritiesLoading: action.payload
            }
        default:
            return state
    }
}

//ACTION CREATORS
type TTagsActions = TInferActions<typeof tagsActions>
export const tagsActions = {
    setStatuses: (statuses: TTag) => ({type: 'SET_STATUSES', payload: statuses} as const),
    setPriorities: (priorities: TTag) => ({type: 'SET_PRIORITIES', payload: priorities} as const),
    setLoadStatuses: (isLoading: boolean) => ({ type: 'SET_LOAD_STATUSES', payload: isLoading } as const),
    setLoadPriorities: (isLoading: boolean) => ({ type: 'SET_LOAD_PRIORITIES', payload: isLoading } as const)
}

//THUNKS
type ThunkType = ThunkAction<Promise<void>, TAppState, unknown, TTagsActions>

export const getStatuses = (): ThunkType => async (dispatch) => {
    dispatch(tagsActions.setLoadStatuses(true))
    await tagsAPI.getStatuses().then(statuses => {
        dispatch(tagsActions.setStatuses(statuses))
        dispatch(tagsActions.setLoadStatuses(false))
    }, error => {
        console.log(error)
        dispatch(tagsActions.setLoadStatuses(false))
    })
}
export const getPriorities = (): ThunkType => async (dispatch) => {
    dispatch(tagsActions.setLoadPriorities(true))
    await tagsAPI.getPriorities().then(priorities => {
        dispatch(tagsActions.setPriorities(priorities))
        dispatch(tagsActions.setLoadPriorities(false))
    }, error => {
        console.log(error)
        dispatch(tagsActions.setLoadPriorities(false))
    })
}

export default tagsReducer