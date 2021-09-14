import { Button, Grid, MenuItem, Paper, TextField, Accordion, AccordionDetails, AccordionSummary, ButtonGroup, LinearProgress, Typography } from '@material-ui/core'
import { useSnackbar } from 'notistack'
import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import ReactMarkdown from 'react-markdown'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { tasksAPI, TNewTask } from '../api/tasks.api'
import { useSelector, useDispatch } from 'react-redux'
import { isLoadingUsers, setUsers } from '../redux/selectors/users.selector'
import { setStatuses, setPriorities, isLoadingPriorities, isLoadingStatuses, setSides } from '../redux/selectors/tags.selector'
import { Link, useHistory, useParams } from 'react-router-dom'
import { isLoadingTask, setTask } from '../redux/selectors/tasks.selector'
import { getTask } from '../redux/reducers/tasks.reducer'

type TControl = {
    description: string
    isReadOnly?: boolean
}
const PreviewComponent: React.FC<TControl> = ({ description, isReadOnly }) => {
    if (isReadOnly) return <>
        <ReactMarkdown>
            {description}
        </ReactMarkdown>
    </>
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
                    {description}
                </ReactMarkdown>
            </AccordionDetails>
        </Accordion>
    </>
}
type TTaskPage = {
    editMode: boolean,
    isReadOnly?: boolean
}
const TaskPage: React.FC<TTaskPage> = ({ editMode, isReadOnly }) => {

    const history = useHistory()
    const { handleSubmit, control, reset, watch, formState } = useForm()
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
    const queryTaskId = urlParams.taskId
    const fetchedTask = useSelector(setTask)
    const isFetchingTask = useSelector(isLoadingTask)
    const [isEdit, setIsEdit] = useState(false)
    const previewDescription = watch('description')
    useEffect(() => {
        if (editMode) {
            setIsEdit(true)
        } else {
            setIsEdit(false)
        }
    }, [editMode])
    useEffect(() => {
        if (editMode) {
            dispatch(getTask(queryTaskId))
        }
    }, [editMode, dispatch, queryTaskId])
    useEffect(() => {
        const defaultValues = isEdit ? {
            taskname: fetchedTask?.taskname,
            description: fetchedTask?.description,
            priority: fetchedTask?.priority?._id,
            status: fetchedTask?.status?._id,
            side: fetchedTask?.side,
            executor: fetchedTask?.executor?._id
        } : {
            taskname: '',
            description: '',
            priority: '',
            status: '',
            side: '',
            executor: ''
        }
        if (defaultValues) {
            reset(defaultValues)
        }
    }, [reset, fetchedTask, isEdit])

    //#endregion GET CURRENT TASK TO EDIT

    //#region NEW TASK
    const createTask = (data: TNewTask) => {
        if(!editMode){
            tasksAPI.newTask(data).then(() => {
                history.goBack()
                enqueueSnackbar('Задача успешно создана', { variant: 'success' })
            }, () => {
                enqueueSnackbar('Ошибка при создании задачи', { variant: 'error' })
            })
        }
        if(editMode){
            tasksAPI.editTask(data, queryTaskId).then(() => {
                history.goBack()
                enqueueSnackbar(`Задача MS-${queryTaskId} успешно обновлена`, { variant: 'success' })
            }, () => {
                enqueueSnackbar('Ошибка при создании задачи', { variant: 'error' })
            })
        }
    }
    //#endregion NEW TASK

    if (isFetchingTask) return <LinearProgress />
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
                            <Typography variant="h5">
                                {isReadOnly ? `MS-${fetchedTask?.number}: ${fetchedTask?.taskname}` : isEdit ? `Редактирование задачи MS-${fetchedTask?.number}` : 'Новая задача'}
                            </Typography>
                        </Grid>
                        <Grid item style={isReadOnly ? {display: 'none'} : {}}>
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
                        <Grid item style={isReadOnly ? {display: 'none'} : {}}>
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
                            <PreviewComponent description={previewDescription} isReadOnly={isReadOnly} />
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
            <Grid item>
                <Paper variant='outlined' style={{ padding: '16px', margin: '16px 16px 16px 8px', width: 'fit-content' }}>
                    <Grid container spacing={2} direction="column" style={{minWidth: '15vw'}}>
                        <Grid item style={isReadOnly ? {display: 'none'} : {}}>
                            <ButtonGroup fullWidth={true}>
                                <Button type="submit" variant="contained" color="primary">
                                    {!isEdit ? 'Создать' : 'Изменить'}
                                </Button>
                                <Button variant="contained" color="secondary" component={Link} to='/tasks'>
                                    Отмена
                                </Button>
                            </ButtonGroup>
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
                                        disabled={isLoadPriorities || isReadOnly}
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
                                        disabled={isLoadStatuses || isReadOnly}
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
                                        disabled={isReadOnly}
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
                                        disabled={isLoadUsers || isReadOnly}
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
                </Paper>
            </Grid>
        </Grid>
    </form>
}

export default TaskPage