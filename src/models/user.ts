import { Schema, model } from 'mongoose'

interface IUser {
    email: string
    password: string
    name: string
    color: string
    position: string
    tasks: Array<Schema.Types.ObjectId>
    dateOfRegistration: Date
    theme: boolean
}

const userSchema = new Schema<IUser>({
    email: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String },
    position: { type: String },
    color: { type: String, default: '#9e9e9e' },
    tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
    dateOfRegistration: { type: Date, default: Date.now },
    theme: {type: Boolean, default: true}
})

const userModel = model<IUser>('User', userSchema)

export { userModel }