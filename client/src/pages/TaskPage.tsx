import { Button, Grid, MenuItem, Paper, TextField, Accordion, AccordionDetails, AccordionSummary, ButtonGroup } from '@material-ui/core'
import { useSnackbar } from 'notistack'
import React, { useEffect } from 'react'
import { useForm, Controller, useWatch, Control, FieldValues } from 'react-hook-form'
import ReactMarkdown from 'react-markdown'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { tasksAPI, TNewTask } from '../api/tasks.api'
import { useSelector, useDispatch } from 'react-redux'
import { isLoadingUsers, setUsers } from '../redux/selectors/users.selector'
import { setStatuses, setPriorities, isLoadingPriorities, isLoadingStatuses, setSides } from '../redux/selectors/tags.selector'
import { getUsers } from '../redux/reducers/users.reducer'
import { getPriorities, getStatuses } from '../redux/reducers/tags.reducer'

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

const TaskPage: React.FC = () => {
    const { handleSubmit, control } = useForm()
    const { enqueueSnackbar } = useSnackbar()
    const dispatch = useDispatch()

    //GETTING DATA FOR SELECTORS

    const users = useSelector(setUsers)
    const isLoadUsers = useSelector(isLoadingUsers)
    useEffect(() => { dispatch(getUsers()) }, [dispatch])

    const statuses = useSelector(setStatuses)
    const isLoadStatuses = useSelector(isLoadingStatuses)
    useEffect(() => { dispatch(getStatuses()) }, [dispatch])

    const priorities = useSelector(setPriorities)
    const isLoadPriorities = useSelector(isLoadingPriorities)
    useEffect(() => { dispatch(getPriorities()) }, [dispatch])

    const sides = useSelector(setSides)

    //New task
    const createTask = (data: TNewTask) => {
        tasksAPI.newTask(data).then(res => {
            enqueueSnackbar('Задача успешно создана', { variant: 'success' })
        }, res => {
            enqueueSnackbar('Ошибка при создании задачи', { variant: 'error' })
        })
    }

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