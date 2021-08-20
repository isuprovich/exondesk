import { api } from './api'

export type TTask = {
    _id: string
    number: string
    taskname: string
    side: string
    executor: {email: string, name: string}
    priority: {_id: string, value: string, label: string, color: string}
    status: {_id: string, value: string, label: string, color: string}
    description: string
    dateOfCreation: Date
    dateOfUpdate: Date
}
export type TTasksArray = [TTask]
export type TTasks = {
    tasks: TTasksArray
}
export type TNewTask = {
    taskname: string,
    status: string,
    priority: string,
    side: string,
    executor: string,
    description: string
}

export const tasksAPI = {
    getAllTasks() {
        return api.get<TTasks>('/tasks/gettasks')
        .then(res => res.data).then(res => {return res.tasks})
    },
    newTask(data: TNewTask) {
        return api.post('/tasks/newtask', data)
    },
    deleteTask(task: string) {
        return api.delete(`/tasks/${task}`)
    }
}