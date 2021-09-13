import { tasksAPI, TTask } from './../../api/tasks.api';
import { ThunkAction } from "redux-thunk"
import { TAppState, TInferActions } from "../store"

const initialState = {
    allTasks: null as unknown as TTask[],
    currentTask: null as TTask | null,
    isCurrentTaskLoad: false as boolean
}
export type TTasksState = typeof initialState

//USERS REDUCER
const tasksReducer = (state = initialState, action: TTasksActions): TTasksState => {
    switch (action.type) {
        case 'SET_TASK':
            return {
                ...state,
                currentTask: action.payload
            }
        case 'SET_LOAD_TASK':
            return {
                ...state,
                isCurrentTaskLoad: action.payload
            }
        case 'SET_TASKS':
            return {
                ...state,
                allTasks: action.payload
            }
        default:
            return state
    }
}

//ACTION CREATORS
type TTasksActions = TInferActions<typeof tasksActions>
export const tasksActions = {
    setTasks: (tasks: TTask[]) => ({type: 'SET_TASKS', payload: tasks} as const),
    setLoadTasks: (isTasksLoad: boolean) => ({type: 'SET_LOAD_TASKS', payload: isTasksLoad} as const),
    setTask: (task: TTask) => ({ type: 'SET_TASK', payload: task } as const),
    setLoadTask: (isTaskLoad: boolean) => ({ type: 'SET_LOAD_TASK', payload: isTaskLoad } as const),
}

//THUNKS
type ThunkType = ThunkAction<Promise<void>, TAppState, unknown, TTasksActions>

export const getTask = (taskId: string): ThunkType => async (dispatch) => {
    dispatch(tasksActions.setLoadTask(true))
    await tasksAPI.getTask(taskId).then(task => {
        dispatch(tasksActions.setTask(task))
        dispatch(tasksActions.setLoadTask(false))
    }, error => {
        console.log(error)
        dispatch(tasksActions.setLoadTask(false))
    })
}
export const getTasks = (): ThunkType => async (dispatch) => {
    await tasksAPI.getAllTasks().then(tasks => {
        const reverseTasks = tasks.reverse()
        dispatch(tasksActions.setTasks(reverseTasks))
    }, error => {
        console.log(error)
    })
}

export default tasksReducer