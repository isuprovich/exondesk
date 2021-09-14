import express, { Request, Response } from 'express'
import { userModel } from '../models/user'

const router = express.Router()

// /api/users/get

router.get('/get', [], async (req: Request, res: Response) => {
    const users = await userModel.find({}, { password: 0, __v: 0 })
    return res.status(200).json({ users })
})

// /api/users/:id

router.get('/:id', async (req: Request, res: Response) => {
    try {
        await userModel
            .findOne({ _id: req.params.id }, { password: 0, __v: 0 })
            .exec((error, user) => {
                if (error) return res.status(500).json({ message: error })
                return res.json({ user: user })
            })
    } catch (e) {
        res.status(500).json({ message: e })
    }
})

router.put('/:id', async (req: Request, res: Response) => {
    try {
        await userModel
            .updateOne({ _id: req.params.id }, {'email': req.body.email, 'name': req.body.name, 'color': req.body.color})
            .exec((error, user) => {
                if (error) return res.status(500).json({ message: error })
                return res.json({ user: user })
            })
    } catch (e) {
        res.status(500).json({ message: e })
    }
})

module.exports = router