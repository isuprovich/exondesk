import { Schema, model } from 'mongoose'

interface IUser {
    email: string
    password: string
    name: string
    tasks?: Array<number>
}

const userSchema = new Schema<IUser>({
    email: { type: String, required: true },
    password: {type: String, required: true},
    name: { type: String},
    tasks: [{ type: Number, ref: 'Task' }]
})

const userModel = model<IUser>('User', userSchema)

export { userModel }