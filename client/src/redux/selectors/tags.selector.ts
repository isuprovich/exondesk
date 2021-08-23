import { TAppState } from "../store"

export const setStatuses = (state: TAppState) => {
    return state.tags.statuses
}
export const setPriorities = (state: TAppState) => {
    return state.tags.priorities
}
export const setSides = (state: TAppState) => {
    return state.tags.sides
}
export const isLoadingStatuses = (state: TAppState) => {
    return state.tags.isStatusesLoading
}
export const isLoadingPriorities = (state: TAppState) => {
    return state.tags.isPrioritiesLoading
}