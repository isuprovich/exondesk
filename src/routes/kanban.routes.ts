import express, {Request, Response} from 'express'

const router = express.Router()

router.get('/', [], (req: Request, res: Response) => {
    return res.send('get kanban')
})

router.post('/', [], (req: Request, res: Response) => {
    return res.send('post kanban')
})

module.exports = router