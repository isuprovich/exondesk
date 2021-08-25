import { Button, Grid, MenuItem, Paper, TextField, Accordion, AccordionDetails, AccordionSummary, ButtonGroup, LinearProgress } from '@material-ui/core'
import { useSnackbar } from 'notistack'
import React, { useEffect } from 'react'
import { useForm, Controller, useWatch, Control, FieldValues } from 'react-hook-form'
import ReactMarkdown from 'react-markdown'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { tasksAPI, TNewTask } from '../api/tasks.api'
import { useSelector, useDispatch } from 'react-redux'
import { isLoadingUsers, setUsers } from '../redux/selectors/users.selector'
import { setStatuses, setPriorities, isLoadingPriorities, isLoadingStatuses, setSides } from '../redux/selectors/tags.selector'
import { useParams } from 'react-router-dom'
import { isLoadingTask, setTask } from '../redux/selectors/tasks.selector'
import { getTask } from '../redux/reducers/tasks.reducer'

type TControl = {
    control: Control<FieldValues>
}
const PreviewComponent: React.FC<TControl> = ({ control }) => {
    const descriptionPreview = useWatch({
        control,
        name: "description",
        defaultValue: ""
    }).split('\n').join('  \n')
    return <>
        <Accordion
            variant="outlined"
            defaultExpanded={true}
        >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>Предпросмотр</AccordionSummary>
            <AccordionDetails
                style={{ display: 'block', padding: '0 16px' }}
            >
                <ReactMarkdown>
                    {descriptionPreview}
                </ReactMarkdown>
            </AccordionDetails>
        </Accordion>
    </>
}

type TTaskPage = {
    mode: string
}
const TaskPage: React.FC<TTaskPage> = ({ mode }) => {

    const { handleSubmit, control } = useForm()
    const { enqueueSnackbar } = useSnackbar()
    const dispatch = useDispatch()

    //#region GETTING DATA FOR SELECTORS

    const users = useSelector(setUsers)
    const statuses = useSelector(setStatuses)
    const priorities = useSelector(setPriorities)
    const sides = useSelector(setSides)
    const isLoadUsers = useSelector(isLoadingUsers)
    const isLoadStatuses = useSelector(isLoadingStatuses)
    const isLoadPriorities = useSelector(isLoadingPriorities)

    //#endregion GETTING DATA FOR SELECTORS

    //#region GET CURRENT TASK TO EDIT

    const urlParams = useParams<{ taskId: string }>()
    const currentTaskId = urlParams.taskId
    const currentTask = useSelector(setTask)
    const isCurrentTaskLoading = useSelector(isLoadingTask)
    useEffect(() => {
        mode === 'edit' && dispatch(getTask(currentTaskId))
    }, [mode, dispatch, currentTaskId])

    //#endregion GET CURRENT TASK TO EDIT

    //#region NEW TASK
    const createTask = (data: TNewTask) => {
        tasksAPI.newTask(data).then(res => {
            enqueueSnackbar('Задача успешно создана', { variant: 'success' })
        }, res => {
            enqueueSnackbar('Ошибка при создании задачи', { variant: 'error' })
        })
    }
    //#endregion NEW TASK

    if (isCurrentTaskLoading) return <LinearProgress />
    return <form onSubmit={handleSubmit(createTask)}>
        <Grid container>
            <Grid item style={{ flexGrow: 1 }}>
                <Paper
                    variant='outlined'
                    style={{
                        padding: '16px',
                        margin: '16px 8px 16px 16px', overflow: "auto"
                    }}
                >
                    <Grid container spacing={2} direction="column">
                        <Grid item>
                            <Controller
                                name="taskname"
                                control={control}
                                defaultValue=""
                                render={({ field: { onChange, value }, fieldState: { error } }) => (
                                    <TextField
                                        label="Наименование задачи"
                                        variant="outlined"
                                        value={value}
                                        onChange={onChange}
                                        error={!!error}
                                        helperText={error ? error.message : null}
                                        fullWidth={true}
                                        size="small"
                                    />
                                )}
                                rules={{ required: "Введите наименование задачи" }}
                            />
                        </Grid>
                        <Grid item>
                            <Controller
                                name="description"
                                control={control}
                                defaultValue=""
                                render={({ field: { onChange, value }, fieldState: { error } }) => (
                                    <TextField
                                        label="Описание задачи"
                                        variant="outlined"
                                        value={value}
                                        onChange={onChange}
                                        error={!!error}
                                        helperText={error ? error.message : null}
                                        fullWidth={true}
                                        size="small"
                                        multiline
                                        minRows={10}
                                        maxRows={20}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item>
                            <PreviewComponent control={control} />
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
            <Grid item>
                <Paper variant='outlined' style={{ padding: '16px', margin: '16px 16px 16px 8px', width: 'fit-content' }}>
                    <Grid container spacing={2} direction="column">
                        <Grid item>
                            <ButtonGroup>
                                <Button type="submit" variant="contained" color="primary">
                                    Создать
                                </Button>
                                <Button variant="contained" color="secondary">
                                    Отмена
                                </Button>
                            </ButtonGroup>
                        </Grid>
                        <Grid item>
                            <Controller
                                name="priority"
                                control={control}
                                defaultValue={''}
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
                </Paper>
            </Grid>
        </Grid>
    </form>
}

export default TaskPage