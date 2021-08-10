import { Schema, model } from 'mongoose'

export interface ITask {
    number: number,
    taskname: string,
    side: 'front' | 'back',
    executor: string,
    priority: 'low' | 'normal' | 'high' | 'critical' | 'epic',
    dateOfCreation: Date
}

const taskSchema = new Schema<ITask>({
    number: { type: Number, required: true },
    taskname: { type: String, required: true },
    side: { type: String },
    executor: { type: String },
    priority: { type: String },
    dateOfCreation: { type: Date, default: Date.now }
})

const taskModel = model<ITask>('Task', taskSchema)

export { taskModel }