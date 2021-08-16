import { Avatar, Button, ButtonGroup, Chip, Grid, Paper, Typography, Dialog, DialogTitle, DialogActions, LinearProgress } from '@material-ui/core'
import { useState, useCallback, useEffect } from 'react'
import { useSnackbar } from 'notistack'
import { useApi } from '../hooks/api.hook'
import styled from 'styled-components'
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined'
import EditOutlinedIcon from '@material-ui/icons/EditOutlined'

type TCardPaperProps = {
    $priority: string
}
const CardPaper = styled(Paper) <TCardPaperProps>`
border-left: 8px solid ${props =>
        props.$priority === 'normal' ? '#8bc34a' :
            props.$priority === 'high' ? '#ffc107' :
                props.$priority === 'critical' ? '#f44336' :
                    props.$priority === 'hotfix' ? '#880e4f' :
                        props.$priority === 'epic' ? '#e91e63' : '#9e9e9e'};
`
const CustomChip = styled(Chip)`
        margin-right: 8px
`

const TasksListPage: React.FC = () => {
    const { enqueueSnackbar } = useSnackbar()
    const { loading, request } = useApi()
    
    // Получение списка задач
    const [tasks, setTasks] = useState([
        { "_id": "", "number": "", "taskname": "", "side": "", "executor": { "email": "", "name": "" }, "priority": "", "status": "", "description": "", "dateOfCreation": "", "dateOfUpdate": "" }
    ])
    const getTasks = useCallback(async () => {
        try {
            const reqData = await request('/api/tasks/gettasks', 'GET')
            setTasks(reqData.tasks)
        } catch (e) {
            enqueueSnackbar(e.message, { variant: 'error' })
        }
    }, [request, enqueueSnackbar])
    useEffect(() => { getTasks() }, [getTasks])

    // Удаление задачи
    const [isDeleteOpen, setOpenDelete] = useState(false)
    const [taskToDelete, setTaskToDelete] = useState("")
    const handleOpenDelete = (tasknumber: string) => {
        setTaskToDelete(tasknumber)
        setOpenDelete(true)
    }
    const handleCloseDelete = () => {
        setOpenDelete(false)
    }
    const handleDeleteTask = useCallback(async (tasknumber: string) => {
        try {
            await request(`/api/tasks/${tasknumber}`, 'DELETE')
            setOpenDelete(false)
            enqueueSnackbar(`Задача MS-${tasknumber} удалена`, { variant: 'success' })
            getTasks()
        } catch (e) {
            setOpenDelete(false)
            enqueueSnackbar(e.message, { variant: 'error' })
        }
    }, [request, enqueueSnackbar, getTasks])
    
    //Заглушки действий
    const handleEditTask = () => {
        console.info('Redirect task edit')
    }
    const handleClick = () => {
        console.info('You clicked the Chip.')
    }

    //Рендер
    if (loading) return <LinearProgress />
    return <Paper variant='outlined' style={{ padding: '16px', margin: '16px' }}>
        {Object.keys(tasks).slice(0).reverse().map(i => {
            const j = Number(i)
            return <CardPaper
                key={i}
                variant='outlined'
                style={{ padding: '8px 16px', margin: '8px' }}
                $priority={tasks[j].priority}
            >
                <Grid container alignItems="stretch">
                    <Grid item container xs={12} sm={12} alignItems="stretch">
                        <Grid item>
                            <Typography style={{ marginRight: '8px' }}>
                                <strong>MS-{tasks[j].number}</strong>
                            </Typography>
                        </Grid>
                        <Grid item style={{ display: 'flex', flexDirection: "row", flexGrow: 1 }}>
                            <Typography>
                                {tasks[j].taskname}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <ButtonGroup size="small">
                                <Button color="primary" onClick={handleEditTask}><EditOutlinedIcon /></Button>
                                <Button color="secondary" onClick={() => handleOpenDelete(tasks[j].number)}><DeleteOutlinedIcon /></Button>
                            </ButtonGroup>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12} container>
                        <Grid item xs={8} sm={8}>
                            <CustomChip
                                label={tasks[j].priority}
                                
                                onClick={handleClick}
                            />
                            <CustomChip
                                label={tasks[j].status}
                                onClick={handleClick}
                            />
                            <CustomChip
                                label={tasks[j].side === 'front' ? 'Front' : 'Back'}
                                onClick={handleClick}
                            />
                            <CustomChip
                                avatar={<Avatar>{tasks[j].executor.name === undefined ? tasks[j].executor.email.slice(0, 2) : tasks[j].executor.name.slice(0, 2)}</Avatar>}
                                label={tasks[j].executor.name === undefined ? tasks[j].executor.email : tasks[j].executor.name}
                                onClick={handleClick}
                            />
                        </Grid>
                        <Grid item xs={4} sm={4} style={{
                            textAlign: 'end',
                            display: 'flex',
                            justifyContent: 'center',
                            alignContent: 'center',
                            flexDirection: 'column'
                        }}
                        >
                            {tasks[j].dateOfUpdate === null ? 'Создана: ' : 'Обновлена: '}
                            {new Date(tasks[j].dateOfUpdate === null ? tasks[j].dateOfCreation : tasks[j].dateOfUpdate).toLocaleTimeString('ru-RU', {
                                day: "numeric",
                                month: "numeric",
                                year: "numeric",
                                hour: "numeric",
                                minute: "numeric"
                            })}
                        </Grid>
                    </Grid>
                </Grid>
            </CardPaper>
        })}
        <Dialog
            open={isDeleteOpen}
            onClose={handleCloseDelete}
        >
            <DialogTitle>{`Удалить задачу MS-${taskToDelete}`}</DialogTitle>
            <DialogActions>
                <Button onClick={handleCloseDelete} color="primary">
                    Отмена
                </Button>
                <Button onClick={() => handleDeleteTask(taskToDelete)} color="secondary" autoFocus>
                    Удалить
                </Button>
            </DialogActions>
        </Dialog>
    </Paper >
}

export default TasksListPage