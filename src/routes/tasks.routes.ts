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
                const { taskname, side, executor, priority }: ITask = req.body
                const task = new taskModel({ number: newTaskNumber, taskname, side, executor, priority })
                await task.save()
                console.log(`Создана новая задача: MS-${count + 1}`)
                return res.status(201).json({ message: `Задача MS-${count + 1} создана`, body: task})
            })
        } catch (e) {
            res.status(500).json({ message: e })
        }
    })

// /api/tasks/gettasks - получить весь список задач

router.get('/gettasks', [], async (req: Request, res: Response) => {
    try {
        await taskModel.find({}, {__v: 0}, {}, async (e, resBody) => {
            return res.json({tasks: resBody})
        })
    } catch (e) {
        res.status(500).json({ message: e })
    }
})

// /api/tasks/:id - получить задачу по ее номеру

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const tasknumber = Number(req.params.id)
        await taskModel.findOne({number: tasknumber}, {}, {}, async (e, resBody) => {
            return res.json({task: resBody})
        })
    } catch (e) {
        res.status(500).json({ message: e })
    }
})

module.exports = router