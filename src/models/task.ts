import mongoose, { Types } from 'mongoose'

const taskSchema = new mongoose.Schema({
    taskNumber: { type: Number, required: true },
    taskName: { type: String, required: true },
})

