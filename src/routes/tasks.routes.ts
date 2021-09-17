import express, { Request, Response } from 'express'
import { ITask, taskModel } from '../models/task'
const auth = require('../middleware/auth.middleware')

const router = express.Router()

// /api/tasks/newtask - создать задачу

router.post('/newtask', [],
    async (req: Request, res: Response) => {
        try {
            await taskModel.countDocuments({}, async (e, count) => {
                const newTaskNumber = count + 1
                const { taskname, side, executor, priority, status, description }: ITask = req.body
                const task = new taskModel({ number: newTaskNumber, taskname, side, executor, priority, status, description })
                await task.save()
                console.log(`Создана новая задача: MS-${count + 1}`)
                return res.status(201).json({ message: `Задача MS-${count + 1} создана`, body: task })
            })
        } catch (e) {
            res.status(500).json({ message: e })
        }
    })

// /api/tasks/:id - редактировать задачу

router.post('/:id', [],
    async (req: Request, res: Response) => {
        const tasknumber = Number(req.params.id)
        await taskModel
            .updateOne({ number: tasknumber }, {
                ...req.body, dateOfUpdate: Date.now()
            })
            .exec((error, task) => {
                if (error) return res.status(500).json({ message: error })
                return res.json(task)
            })
    })

// /api/tasks/gettasks - получить весь список задач

router.get('/gettasks', [], async (req: Request, res: Response) => {

    const searchQuery = {}
    Object.entries(req.query).map(([key, value]) => {
        const searchObj = {
            [key]: {
                "$regex": value,
                "$options": "i"
            }
        }
        Object.assign(searchQuery, searchObj)
    })
    console.log(searchQuery)

    try {
        await taskModel
            .find(searchQuery !== undefined ? searchQuery : { isDeleted: false }, { __v: 0 }, {})
            .populate('executor', ['email', 'name', 'color'], undefined, { _id: { $exists: true } })
            .populate('status', ['value', 'label', 'name', 'color'], undefined, { _id: { $exists: true } })
            .populate('priority', ['value', 'label', 'name', 'color'], undefined, { _id: { $exists: true } })
            .exec((error, tasks) => {
                if (error) return res.status(500).json({ message: error })
                return res.json({ tasks: tasks })
            })
    } catch (e) {
        res.status(500).json({ message: e })
    }
})

// /api/tasks/:id - получить задачу по ее номеру

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const tasknumber = Number(req.params.id)
        await taskModel
            .findOne({ number: tasknumber })
            .populate('executor', ['email', 'name', 'color'], undefined, { _id: { $exists: true } })
            .populate('status', ['value', 'label', 'name', 'color'], undefined, { _id: { $exists: true } })
            .populate('priority', ['value', 'label', 'name', 'color'], undefined, { _id: { $exists: true } })
            .exec((error, task) => {
                if (error) return res.status(500).json({ message: error })
                return res.json({ task: task })
            })
    } catch (e) {
        res.status(500).json({ message: `Ошибка при получении задачи: ${e}` })
    }
})
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const tasknumber = Number(req.params.id)
        await taskModel
            .findOne({ number: tasknumber })
            .updateOne({ isDeleted: false }, {
                $set: { isDeleted: true },
                $currentDate: { dateOfUpdate: true }
            })
            .exec((error, result) => {
                if (error) return res.status(500).json({ message: error })
                return res.json({ result: result })
            })
    } catch (e) {
        res.status(500).json({ message: `Ошибка при удалении задачи: ${e}` })
    }
})

module.exports = router