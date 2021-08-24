import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import tagsReducer from './reducers/tags.reducer'
import tasksReducer from './reducers/tasks.reducer'
import usersReducer from './reducers/users.reducer'

const rootReducer = combineReducers({
    users: usersReducer,
    tags: tagsReducer,
    tasks: tasksReducer
})

type TRootReducer = typeof rootReducer
export type TAppState = ReturnType<TRootReducer>
type PropertiesTypes<T> = T extends { [key: string]: infer U } ? U : never
export type TInferActions<T extends { [key: string]: (...args: any[]) => any }> = ReturnType<PropertiesTypes<T>>

const store = createStore(rootReducer, applyMiddleware(thunkMiddleware))

export default store