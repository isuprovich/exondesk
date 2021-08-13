import { Grid, Paper, Typography } from '@material-ui/core'
import { useState, useCallback, useEffect } from 'react'
import { useSnackbar } from 'notistack'
import { useApi } from '../hooks/api.hook'

const TasksListPage: React.FC = () => {

    const [tasks, setTasks] = useState([
        { "_id": "", "number": "", "taskname": "", "side": "", "executor": { "email": "", "name": "" }, "priority": "", "status": "", "description": "", "dateOfCreation": "" }
    ])
    const { enqueueSnackbar } = useSnackbar()
    const { loading, request } = useApi()

    const getTasks = useCallback(async () => {
        try {
            const reqData = await request('/api/tasks/gettasks', 'GET')
            setTasks(reqData.tasks)
        } catch (e) {
            enqueueSnackbar(e.message, { variant: 'error' })
        }
    }, [request, enqueueSnackbar])
    useEffect(() => { getTasks() }, [getTasks])

    if (loading) return <div>LOADING</div>
    return <Paper variant='outlined' style={{ padding: '16px', margin: '16px' }}>
        {Object.keys(tasks).map(i => {
            const j = Number(i)
            return <Paper key={i} variant='outlined' style={{ padding: '8px', margin: '8px' }}>
                <Grid container spacing={2} alignItems="stretch">
                    <Grid item container xs={12} sm={12} alignItems="stretch">
                        <Grid item xs={12} sm={1}>
                            <Typography
                                variant="subtitle2"
                            >
                                MS-{tasks[j].number}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={11}>
                            {tasks[j].taskname}
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12} container>
                        <Grid item xs={12} sm={1}>
                            {tasks[j].priority}
                        </Grid>
                        <Grid item xs={12} sm={1}>
                            {tasks[j].status}
                        </Grid>
                        <Grid item xs={12} sm={1}>
                            {tasks[j].side}
                        </Grid>
                        <Grid item xs={12} sm={7}>
                            {tasks[j].executor.name}
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            {new Date(tasks[j].dateOfCreation).toLocaleTimeString('ru-RU', {
                                day: "numeric",
                                month: "numeric",
                                year: "numeric",
                                hour: "numeric",
                                minute: "numeric"
                            })}
                        </Grid>
                    </Grid>
                </Grid>

            </Paper>
        })}
    </Paper>
}

export default TasksListPage