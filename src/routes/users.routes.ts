import express, {Request, Response} from 'express'
import { userModel } from '../models/user'

const router = express.Router()

// /api/users/get

router.get('/get', [], async (req: Request, res: Response) => {
    const users = await userModel.find({}, {password: 0, __v: 0})
    return res.status(200).json({users})
})

module.exports = router