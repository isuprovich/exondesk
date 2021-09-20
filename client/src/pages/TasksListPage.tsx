import { Button, Grid, Paper, Typography, Dialog, DialogTitle, DialogActions, LinearProgress, MenuItem, TextField } from '@material-ui/core'
import { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSnackbar } from 'notistack'
import { tasksAPI } from '../api/tasks.api'
import { useHistory } from 'react-router-dom'
import { setTasks } from '../redux/selectors/tasks.selector'
import { getTasks } from '../redux/reducers/tasks.reducer'
import { Controller, useForm } from 'react-hook-form'
import CustomInput from '../components/CustomInput'
import { setStatuses, setPriorities, setSides, isLoadingStatuses, isLoadingPriorities } from '../redux/selectors/tags.selector'
import { setUsers, isLoadingUsers } from '../redux/selectors/users.selector'
import TaskCard from '../components/TaskCard'

export type TChipStyleProps = {
    $color?: string
}

const TasksListPage: React.FC = () => {
    const history = useHistory()
    const { handleSubmit, control } = useForm()
    const { enqueueSnackbar } = useSnackbar()
    const [isDeleteOpen, setOpenDelete] = useState(false)
    const [taskToDelete, setTaskToDelete] = useState('')

    //Получение задач
    const dispatch = useDispatch()
    const tasks = useSelector(setTasks)
    useEffect(() => {
        dispatch(getTasks(history.location.search ? history.location.search : undefined))
    }, [dispatch, history.location.search])

    //#region DELETE TASK
    const handleOpenDelete = (tasknumber: string, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation()
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
    //#endregion DELETE TASK

    //#region Заглушки действий
    const handleClick = () => {
        console.info('You clicked the Chip.')
    }
    //#endregion

    //#region SEARCH TASKS

    const users = useSelector(setUsers)
    const statuses = useSelector(setStatuses)
    const priorities = useSelector(setPriorities)
    const sides = useSelector(setSides)
    const isLoadUsers = useSelector(isLoadingUsers)
    const isLoadStatuses = useSelector(isLoadingStatuses)
    const isLoadPriorities = useSelector(isLoadingPriorities)

    const handleSearch = (data: any) => {
        let searchString: string = ""
        for (const [key, value] of Object.entries(data)) {
            if (value) { searchString = searchString + `${key}=${value}&` }
        }
        if (searchString !== "") { searchString = "?" + searchString.substring(0, searchString.length - 1) }
        history.push(searchString)
        if (searchString !== "") { dispatch(getTasks(searchString)) }
    }
    //#endregion

    //Рендер
    if (!tasks) return <LinearProgress />
    return <div>
        <Grid container direction="row" spacing={1}>
            <Grid item>
                <Paper variant="outlined" style={{ height: 'fit-content', padding: '8px' }}>
                    <form onSubmit={handleSubmit(handleSearch)}>
                        <Grid container direction="column" spacing={1}>
                            <Grid item>
                                <Button type="submit" variant="contained" color="primary" fullWidth={true}>Поиск</Button>
                            </Grid>
                            <Grid item>
                                <CustomInput
                                    name={"taskname"}
                                    label={"Название"}
                                    control={control}
                                />
                            </Grid>
                            <Grid item>
                                <Controller
                                    name="priority"
                                    control={control}
                                    defaultValue=""
                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                        <TextField
                                            label="Приоритет"
                                            variant="outlined"
                                            value={value}
                                            onChange={onChange}
                                            error={!!error}
                                            helperText={error ? error.message : null}
                                            fullWidth={true}
                                            size="small"
                                            select
                                            disabled={isLoadPriorities}
                                        >
                                            <MenuItem value={""}>Не выбран</MenuItem>
                                            {priorities.map((value, i) => {
                                                return (
                                                    <MenuItem key={i} value={priorities[i]._id}>{priorities[i].label}</MenuItem>
                                                )
                                            })}
                                        </TextField>
                                    )}
                                />
                            </Grid>
                            <Grid item>
                                <Controller
                                    name="status"
                                    control={control}
                                    defaultValue={''}
                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                        <TextField
                                            label="Статус"
                                            variant="outlined"
                                            value={value}
                                            onChange={onChange}
                                            error={!!error}
                                            helperText={error ? error.message : null}
                                            fullWidth={true}
                                            size="small"
                                            select
                                            disabled={isLoadStatuses}
                                        >
                                            <MenuItem value={""}>Не выбран</MenuItem>
                                            {statuses.map((value, i) => {
                                                return (
                                                    <MenuItem key={i} value={statuses[i]._id}>{statuses[i].label}</MenuItem>
                                                )
                                            })}
                                        </TextField>
                                    )}
                                />
                            </Grid>
                            <Grid item>
                                <Controller
                                    name="side"
                                    control={control}
                                    defaultValue={''}
                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                        <TextField
                                            label="Подсистема"
                                            variant="outlined"
                                            value={value}
                                            onChange={onChange}
                                            error={!!error}
                                            helperText={error ? error.message : null}
                                            fullWidth={true}
                                            size="small"
                                            select
                                        >
                                            <MenuItem value={""}>Не выбран</MenuItem>
                                            {sides.map((value, i) => {
                                                return (
                                                    <MenuItem key={i} value={sides[i]._id}>{sides[i].label}</MenuItem>
                                                )
                                            })}
                                        </TextField>
                                    )}
                                />
                            </Grid>
                            <Grid item>
                                <Controller
                                    name="executor"
                                    control={control}
                                    defaultValue={''}
                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                        <TextField
                                            label="Исполнитель"
                                            variant="outlined"
                                            value={value}
                                            onChange={onChange}
                                            error={!!error}
                                            helperText={error ? error.message : null}
                                            fullWidth={true}
                                            disabled={isLoadUsers}
                                            select
                                            size="small"
                                        >
                                            <MenuItem value={""}>Не выбран</MenuItem>
                                            {users.map((value, i) => {
                                                return (
                                                    <MenuItem key={i} value={users[i]._id}>{users[i].name === undefined ? users[i].email : users[i].name}</MenuItem>
                                                )
                                            })}
                                        </TextField>)} />
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Grid>
            <Grid item style={{ flexGrow: 1 }}>
                <Paper variant="outlined" style={{ height: '800px', padding: '8px', overflow: 'auto' }}>
                    {tasks.length === 0 && <Typography align="center">Задач нет</Typography>}
                    {tasks.map(task => {
                        return <TaskCard task={task} handleOpenDelete={handleOpenDelete} handleClick={handleClick} />
                    })}
                </Paper>
            </Grid>
        </Grid>

        <Dialog open={isDeleteOpen} onClose={handleCloseDelete}>
            <DialogTitle>{`Удалить задачу MS-${taskToDelete}`}</DialogTitle>
            <DialogActions>
                <Button onClick={handleCloseDelete} color="primary">
                    Отмена
                </Button>
                <Button onClick={() => { handleDeleteTask(taskToDelete) }} color="secondary" autoFocus>
                    Удалить
                </Button>
            </DialogActions>
        </Dialog>
    </div>
}

export default TasksListPage