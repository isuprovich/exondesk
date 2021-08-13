import { Schema, model } from 'mongoose'

export interface ITask {
    number: number,
    taskname: string,
    description: string,
    side: 'front' | 'back',
    executor: Schema.Types.ObjectId,
    priority: 'low' | 'normal' | 'high' | 'critical' | 'epic' | 'hotfix',
    status: 'new' | 'analytics' | 'indev' | 'dev' | 'review' | 'test' | 'intest' | 'backtodev' | 'closed',
    dateOfCreation: Date
}

const taskSchema = new Schema<ITask>({
    number: { type: Number, required: true },
    taskname: { type: String, required: true },
    description: { type: String },
    side: { type: String },
    executor: { type: Schema.Types.ObjectId, ref: 'User' },
    priority: { type: String },
    status: { type: String },
    dateOfCreation: { type: Date, default: Date.now }
})

const taskModel = model<ITask>('Task', taskSchema)

export { taskModel }