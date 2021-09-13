import { api } from './api'

export type TTask = {
    _id: string
    number: string
    taskname: string
    side: string
    executor: {_id: string, email: string, name: string} | null
    priority: {_id: string, value: string, label: string, color: string} | null
    status: {_id: string, value: string, label: string, color: string} | null
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
    getTask(task: string) {
        return api.get<{task: TTask}>(`/tasks/${task}`)
        .then(res => res.data).then(res => {return res.task})
    },
    newTask(data: TNewTask) {
        return api.post('/tasks/newtask', data)
    },
    deleteTask(task: string) {
        return api.delete(`/tasks/${task}`)
    },
    editTask(data: TNewTask, taskNumber: string) {
        return api.post(`/tasks/${taskNumber}`, data)
    }
}