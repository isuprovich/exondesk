import { Avatar, Button, ButtonGroup, Grid, Paper, Typography, Dialog, DialogTitle, DialogActions, LinearProgress, Accordion, AccordionSummary, AccordionDetails, MenuItem, TextField } from '@material-ui/core'
import { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSnackbar } from 'notistack'
import styled from 'styled-components'
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined'
import EditOutlinedIcon from '@material-ui/icons/EditOutlined'
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined'
import { tasksAPI } from '../api/tasks.api'
import { Link, useHistory } from 'react-router-dom'
import { setTasks } from '../redux/selectors/tasks.selector'
import { getTasks } from '../redux/reducers/tasks.reducer'
import ReactMarkdown from 'react-markdown'
import { stringAcronymize } from '../custom-functions/stringAcronymize'
import { CustomTagButton } from '../components/StyledComponents/CustomTagButton'
import { Controller, useForm } from 'react-hook-form'
import CustomInput from '../components/CustomInput'
import { setStatuses, setPriorities, setSides, isLoadingStatuses, isLoadingPriorities } from '../redux/selectors/tags.selector'
import { setUsers, isLoadingUsers } from '../redux/selectors/users.selector'

export type TChipStyleProps = {
    $color?: string
}
const CardPaper = styled.div <TChipStyleProps>`
    border-left: 8px solid ${props => props.$color};
    padding: 0;
    `
const CustomPaper = styled(Paper)`
    height: fit-content;
    width: 100%;
    margin-top: 8px;
`
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
    return <CustomPaper variant='outlined'>
        <Grid container direction="row">
            <div style={{ margin: "8px" }}>
                <form onSubmit={handleSubmit(handleSearch)}>
                    <Grid container direction="column" spacing={1}>
                        <Grid item>
                            <Button type="submit" variant="contained" color="primary" style={{marginBottom: "8px"}}>Поиск</Button>
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
                                    </TextField>
                                )}
                            />
                        </Grid>

                    </Grid>
                </form>
            </div>
            <Grid item style={{ flexGrow: 1 }}>
                <div style={{ margin: "8px" }}>
                    {tasks.length === 0 && <Typography align="center">Задач нет</Typography>}
                    {tasks.map((value, i) => {
                        return <Accordion key={tasks[i]._id} variant="outlined" TransitionProps={{ unmountOnExit: true }}>
                            <AccordionSummary
                                component={CardPaper}
                                key={i}
                                variant='outlined'
                                $color={tasks[i].priority === null ? '#9e9e9e' : tasks[i].priority?.color}
                            >
                                <Grid container alignItems="stretch">
                                    <Grid item container xs={12} sm={12} alignItems="stretch">
                                        <Grid item style={{ padding: "4px 5px" }}>
                                            <Typography>
                                                <strong>MS-{tasks[i].number}</strong>
                                            </Typography>
                                        </Grid>
                                        <Grid item style={{ display: 'flex', flexDirection: "row", flexGrow: 1, padding: "4px 5px" }}>
                                            <Typography>
                                                {tasks[i].taskname}
                                            </Typography>
                                        </Grid>
                                        <Grid item>
                                            <ButtonGroup size="small" variant="text">
                                                <Button component={Link} to={`/task/${tasks[i].number}`} color="primary"><VisibilityOutlinedIcon /></Button>
                                                <Button component={Link} to={`/edit/${tasks[i].number}`} color="primary"><EditOutlinedIcon /></Button>
                                                <Button color="secondary" onClick={(event) => { handleOpenDelete(tasks[i].number, event) }}><DeleteOutlinedIcon /></Button>
                                            </ButtonGroup>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12} sm={12} container>
                                        <Grid item xs={8} sm={8}>
                                            <ButtonGroup size="small" variant="text">
                                                <CustomTagButton
                                                    onClick={() => { handleClick() }}
                                                    color={tasks[i].priority?.color ? tasks[i].priority?.color : '#9e9e9e'}
                                                    label={tasks[i].priority?.label ? tasks[i].priority?.label : 'Нет приоритета'}
                                                />
                                                <CustomTagButton
                                                    onClick={() => { handleClick() }}
                                                    color={tasks[i].status?.color ? tasks[i].status?.color : '#9e9e9e'}
                                                    label={tasks[i].status?.label ? tasks[i].status?.label : 'Нет статуса'}
                                                />
                                                <CustomTagButton
                                                    label={tasks[i].side === '' ? 'Нет подсистемы' : tasks[i].side === 'front' ? 'Front' : 'Back'}
                                                    color={tasks[i].side === '' ? '#9e9e9e' : tasks[i].side === 'front' ? '#0097a7' : '#ffa000'}
                                                    onClick={() => { handleClick() }}
                                                />
                                                <CustomTagButton
                                                    avatar={<Avatar style={{
                                                        height: '24px',
                                                        width: '24px',
                                                        fontSize: '12px'
                                                    }}>
                                                        {stringAcronymize(tasks[i].executor?.name === undefined ? tasks[i].executor?.email : tasks[i].executor?.name)}
                                                    </Avatar>}
                                                    label={tasks[i].executor === null ? 'Нет исполнителя' : tasks[i].executor?.name === undefined ? tasks[i].executor?.email : tasks[i].executor?.name}
                                                    color={!!tasks[i].executor?.color ? tasks[i].executor?.color : "#9e9e9e"}
                                                    onClick={() => { handleClick() }}
                                                />
                                            </ButtonGroup>
                                        </Grid>
                                        <Grid item xs={4} sm={4} style={{
                                            textAlign: 'end',
                                            display: 'flex',
                                            justifyContent: 'end',
                                            alignContent: 'center',
                                            flexDirection: 'column',
                                            padding: "4px 5px"
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
                            </AccordionSummary>
                            <AccordionDetails style={{ display: "block" }}>
                                <ReactMarkdown>{tasks[i].description}</ReactMarkdown>
                            </AccordionDetails>
                        </Accordion>

                    })}
                </div>
            </Grid>
        </Grid>
        <Dialog
            open={isDeleteOpen}
            onClose={handleCloseDelete}
        >
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
    </CustomPaper >
}

export default TasksListPage