import express, {Request, Response} from 'express'
import bcrypt from 'bcryptjs'
import config from 'config'
import jwt from 'jsonwebtoken'
import { check, validationResult } from 'express-validator'
import { userModel } from '../models/user'

const router = express.Router()

type TLoginPayload = {
    email: string,
    password: string
}

// /api/auth/register
router.post(
    '/register',
    [
        check('email', 'Некорректный E-Mail').isEmail(),
        check('password', 'Минимальная длина пароля 6 символов').isLength({ min: 6 })
    ],
    async (req: Request, res: Response) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array(), message: 'Некорректные регистрационные данные' })
            }
            const { email, password }:TLoginPayload = req.body
            const candidate = await userModel.findOne({ email })
            if (candidate) {
                return res.status(400).json({ message: 'Такой пользователь уже существует' })
            }
            const hashedPassword = await bcrypt.hash(password, 12)
            const lowerMail = email.toLowerCase()
            const user = new userModel({ email: lowerMail, password: hashedPassword })
            await user.save()
            res.status(201).json({ message: 'Пользователь успешно зарегистрирован' })
        } catch (e) {
            console.log(e)
            res.status(500).json({ message: e })
        }
    })

// /api/auth/login
router.post(
    '/login',
    [
        check('email', 'Введите корректный E-Mail').normalizeEmail().isEmail(),
        check('password', 'Введите пароль').exists()
    ],
    async (req: Request, res: Response) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(), message: 'Некорректные авторизационные данные'
                })
            }
            const { email, password } = req.body
            const user = await userModel.findOne({ email })
            if (!user) {
                return res.status(400).json({ message: 'Такой пользователь не существует' })
            }
            //@ts-ignore
            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                return res.status(400).json({ message: 'Неверный пароль, попробуйте снова' })
            }
            const token = jwt.sign(
                { userId: user.id },
                config.get('jwtSecret'),
                { expiresIn: '1h' }
            )
            res.json({ token, userId: user.id })
        } catch (e) {
            res.status(500).json({ message: e.message })
        }
    })

module.exports = router