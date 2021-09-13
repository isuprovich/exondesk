import { Schema, model } from 'mongoose'

export interface ITask {
    number: number,
    taskname: string,
    description: string,
    side: string,
    executor: string,
    priority: string,
    status: string,
    dateOfCreation: Date,
    dateOfUpdate: Date,
    isDeleted: boolean
}

const taskSchema = new Schema<ITask>({
    number: { type: Number, required: true },
    taskname: { type: String, required: true },
    description: { type: String },
    side: { type: String },
    executor: { type: String, ref: 'User' },
    priority: { type: String, ref: 'Priority' },
    status: { type: String, ref: 'Status' },
    dateOfCreation: { type: Date, default: Date.now },
    dateOfUpdate: {type: Date, default: null},
    isDeleted: { type: Boolean, default: false }
})

const taskModel = model<ITask>('Task', taskSchema)

export { taskModel }