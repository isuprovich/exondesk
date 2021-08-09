import express, {Request, Response} from 'express'

const router = express.Router()

router.get('/api/kanban', [], (req: Request, res: Response) => {
    return res.send('get kanban')
})

router.post('/api/kanban', [], (req: Request, res: Response) => {
    return res.send('post kanban')
})

export {router as kanbanRouter}