import express, {Request, Response} from 'express'
import mongoose from 'mongoose'
import config from 'config'
import path from 'path'

const app = express()
const PORT: number = config.get('port')
const mongoUrl: string = config.get('mongoUrl')

//@ts-ignore
app.use(express.json({extended: true}))
app.use('/api/auth', require('./src/routes/auth.routes'))
app.use('/api/users', require('./src/routes/users.routes'))
app.use('/api/tasks', require('./src/routes/tasks.routes'))
app.use('/api/kanban', require('./src/routes/kanban.routes'))
app.use('/api/tags', require('./src/routes/tags.routes'))

if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, 'client', 'build')))
    app.get('*', (req: Request, res: Response) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build','index.html'))
    })
}

const runServer = async () => {
    try {
        await mongoose.connect(mongoUrl, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        mongoose.set('debug', true)
        mongoose.connection.once('open', () => {console.log(`Connected to ${mongoUrl}`)})
        mongoose.connection.on('error', error => {console.log('Cannot connect to MongoDB')})
        app.listen(process.env.PORT || PORT, () => console.log(`Server is listening port ${PORT}`))
    } catch (error) {
        console.log(`Server error: ${error.message}`)
        process.exit(1)
    }
}

runServer()