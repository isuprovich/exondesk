import { Avatar, Button, ButtonGroup, Grid, Paper, Typography, Dialog, DialogTitle, DialogActions, LinearProgress } from '@material-ui/core'
import { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSnackbar } from 'notistack'
import styled from 'styled-components'
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined'
import EditOutlinedIcon from '@material-ui/icons/EditOutlined'
import { CustomChip } from '../components/StyledComponents/CustomChip'
import { tasksAPI } from '../api/tasks.api'
import { Link } from 'react-router-dom'
import { setTasks } from '../redux/selectors/tasks.selector'
import { getTasks } from '../redux/reducers/tasks.reducer'

export type TChipStyleProps = {
    $color?: string
}
const CardPaper = styled(Paper) <TChipStyleProps>`
    border-left: 8px solid ${props => props.$color};
`
const TasksListPage: React.FC = () => {
    const { enqueueSnackbar } = useSnackbar()
    //const [tasks, setTasks] = useState<TTasksArray | null>(null)
    const [isDeleteOpen, setOpenDelete] = useState(false)
    const [taskToDelete, setTaskToDelete] = useState('')

    //Получение задач
    const dispatch = useDispatch()
    const tasks = useSelector(setTasks)
    useEffect(() => {
        dispatch(getTasks())
    }, [dispatch])

    // Удаление задачи
    const handleOpenDelete = (tasknumber: string) => {
        setTaskToDelete(tasknumber)
        setOpenDelete(true)
    }
    const handleCloseDelete = () => {
        setOpenDelete(false)
    }
    const handleDeleteTask = useCallback((taskToDelete: string) => {
        if (taskToDelete) {
            tasksAPI.deleteTask(taskToDelete).then(res => {
                setOpenDelete(false)
                enqueueSnackbar(`Задача MS-${taskToDelete} удалена`, { variant: 'success' })
                setTaskToDelete('')
                dispatch(getTasks())
            }, res => {
                setOpenDelete(false)
                enqueueSnackbar(`Задача MS-${taskToDelete} не удалена`, { variant: 'error' })
                setTaskToDelete('')
            })
        }
    }, [enqueueSnackbar, dispatch])

    //Заглушки действий
    const handleClick = () => {
        console.info('You clicked the Chip.')
    }

    //Рендер
    if (!tasks) return <LinearProgress />
    return <Paper variant='outlined' style={{ padding: '8px 16px', margin: '16px' }}>
        {tasks.length === 0 && <Typography align="center">Задач нет</Typography>}
        {tasks.map((value, i) => {
            return <CardPaper
                key={i}
                variant='outlined'
                style={{ padding: '8px 16px', margin: '8px 0' }}
                $color={tasks[i].priority === null ? 'grey' : tasks[i].priority?.color}
            >
                <Grid container alignItems="stretch">
                    <Grid item container xs={12} sm={12} alignItems="stretch">
                        <Grid item>
                            <Typography
                                style={{ marginRight: '8px' }}
                            >
                                <strong>MS-{tasks[i].number}</strong>
                            </Typography>
                        </Grid>
                        <Grid item style={{ display: 'flex', flexDirection: "row", flexGrow: 1 }}>
                            <Typography>
                                {tasks[i].taskname}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <ButtonGroup size="small">
                                <Button component={Link} to={`/task/${tasks[i].number}`} color="primary"><EditOutlinedIcon /></Button>
                                <Button color="secondary" onClick={() => handleOpenDelete(tasks[i].number)}><DeleteOutlinedIcon /></Button>
                            </ButtonGroup>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12} container>
                        <Grid item xs={8} sm={8}>
                            <CustomChip
                                label={tasks[i].priority?.label ? tasks[i].priority?.label : 'Нет приоритета'}
                                $color={tasks[i].priority?.color ? tasks[i].priority?.color : '#9e9e9e'}
                                onClick={handleClick}
                            />
                            <CustomChip
                                label={tasks[i].status?.label ? tasks[i].status?.label : 'Нет статуса'}
                                $color={tasks[i].status?.color ? tasks[i].status?.color : '#9e9e9e'}
                                onClick={handleClick}
                            />
                            <CustomChip
                                label={tasks[i].side === '' ? 'Нет подсистемы' : tasks[i].side === 'front' ? 'Front' : 'Back'}
                                $color={tasks[i].side === '' ? '#9e9e9e' : tasks[i].side === 'front' ? '#0097a7' : '#ffa000'}
                                onClick={handleClick}
                            />
                            <CustomChip
                                avatar={<Avatar>{tasks[i].executor?.name === undefined ? tasks[i].executor?.email.slice(0, 2) : tasks[i].executor?.name.slice(0, 2)}</Avatar>}
                                label={tasks[i].executor === null ? 'Нет исполнителя' : tasks[i].executor?.name === undefined ? tasks[i].executor?.email : tasks[i].executor?.name}
                                onClick={handleClick}
                                $color={"#9e9e9e"}
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
                            {tasks[i].dateOfUpdate === null ? 'Создана: ' : 'Обновлена: '}
                            {new Date(tasks[i].dateOfUpdate === null ? tasks[i].dateOfCreation : tasks[i].dateOfUpdate).toLocaleTimeString('ru-RU', {
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