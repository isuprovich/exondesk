import { Schema, model } from 'mongoose'

export interface ITag {
    value: string,
    label: string,
    color: string
}
const prioritySchema = new Schema<ITag>({
    value: {type: String, required: true},
    label: {type: String, required: true},
    color: {type: String}
})
const statusSchema = new Schema<ITag>({
    value: {type: String, required: true},
    label: {type: String, required: true},
    color: {type: String}
})

const priorityModel = model<ITag>('Priority', prioritySchema)
const statusModel = model<ITag>('Status', statusSchema)

export {priorityModel, statusModel}