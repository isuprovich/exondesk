import express, {Request, Response} from 'express'
import mongoose from 'mongoose'
import config from 'config'
import path from 'path'
// import { json } from 'body-parser'
import { kanbanRouter } from './src/routes/kanban'

const app = express()
const PORT: number = config.get('port')
const mongoUrl: string = config.get('mongoUrl')

//@ts-ignore
app.use(express.json({extended: true}))
app.use('/api/auth', require('./src/routes/auth.routes'))
app.use(kanbanRouter)

if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, 'client', 'build')))
    app.get('*', (req: Request, res: Response) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

const runServer = async () => {
    try {
        await mongoose.connect(mongoUrl, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, () => { console.log(`Connected to ${mongoUrl}`) })
        app.listen(process.env.PORT || PORT, () => console.log(`Server is listening port ${PORT}`))
    } catch (error) {
        console.log(`Server error: ${error.message}`)
        process.exit(1)
    }
}

runServer()