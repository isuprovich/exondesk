import { Schema, model } from 'mongoose'

interface IUser {
    email: string
    password: string
    name: string
    position: string
    tasks: Array<Schema.Types.ObjectId>
    dateOfRegistration: Date
}

const userSchema = new Schema<IUser>({
    email: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String },
    position: { type: String },
    tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
    dateOfRegistration: { type: Date, default: Date.now }
})

const userModel = model<IUser>('User', userSchema)

export { userModel }