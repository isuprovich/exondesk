import { TAppState } from "../store"

export const setTask = (state: TAppState) => {
    return state.tasks.currentTask
}
export const isLoadingTask = (state: TAppState) => {
    return state.tasks.isCurrentTaskLoad
}
export const setTasks = (state: TAppState) => {
    return state.tasks.allTasks
}