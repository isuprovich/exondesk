import express, { Request, Response } from 'express'
import { ITag, priorityModel, statusModel } from '../models/tags'
const auth = require('../middleware/auth.middleware')

const router = express.Router()

router.post('/newstatus', [], async (req: Request, res: Response) => {
        try {
            const { value, label, color }: ITag = req.body
            const newStatus = new statusModel({ value, label, color })
            await newStatus.save()
            console.log(`Создан новый статус: ${label}`)
            return res.status(201).json({ message: `Статус "${label}" создан`, body: newStatus })
        } catch (e) {
            res.status(500).json({ message: e })
        }
    })
router.post('/newpriority', [], async (req: Request, res: Response) => {
        try {
            const { value, label, color }: ITag = req.body
            const newPriority = new priorityModel({ value, label, color })
            await newPriority.save()
            console.log(`Создан новый приоритет: ${label}`)
            return res.status(201).json({ message: `Приоритет "${label}" создан`, body: newPriority })
        } catch (e) {
            res.status(500).json({ message: e })
        }
    })
router.get('/statuses', [], async (req: Request, res: Response) => {
    try {
        await statusModel
            .find({}, { __v: 0 })
            .exec((error, statuses) => {
                if (error) return res.status(500).json({ message: error })
                return res.json({ statuses: statuses })
            })
    } catch (e) {
        res.status(500).json({ message: e })
    }
})
router.get('/priorities', [], async (req: Request, res: Response) => {
    try {
        await priorityModel
            .find({}, { __v: 0 })
            .exec((error, priorities) => {
                if (error) return res.status(500).json({ message: error })
                return res.json({ priorities: priorities })
            })
    } catch (e) {
        res.status(500).json({ message: e })
    }
})
router.delete('/statuses/:id', [], async (req: Request, res: Response) => {
    try {
        await statusModel
            .deleteOne({value: req.params.id})
            .exec((error, result) => {
                if (error) return res.status(500).json({ message: error })
                return res.json({ result: result })
            })
    } catch (e) {
        res.status(500).json({ message: `Ошибка при удалении задачи: ${e}` })
    }
})
router.delete('/priorities/:id', [], async (req: Request, res: Response) => {
    try {
        await priorityModel
            .deleteOne({value: req.params.id})
            .exec((error, result) => {
                if (error) return res.status(500).json({ message: error })
                return res.json({ result: result })
            })
    } catch (e) {
        res.status(500).json({ message: `Ошибка при удалении задачи: ${e}` })
    }
})

module.exports = router