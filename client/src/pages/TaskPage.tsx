import { Button, Grid, MenuItem, Paper, TextField, Accordion, AccordionDetails, AccordionSummary, ButtonGroup } from '@material-ui/core'
import { useSnackbar } from 'notistack'
import React, { useState, useEffect } from 'react'
import { useForm, Controller, useWatch, Control, FieldValues } from 'react-hook-form'
import { useApi } from '../hooks/api.hook'
import ReactMarkdown from 'react-markdown'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { TUserArray, usersAPI } from '../api/users.api'
import { tagsAPI, TTag } from '../api/tags.api'
import { tasksAPI, TNewTask } from '../api/tasks.api'

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
    const { loading, request } = useApi()

    //Getting data for selectors
    const [users, setUsers] = useState<TUserArray | null>(null)
    const [statuses, setStatuses] = useState<TTag | null>(null)
    const [priorities, setPriorities] = useState<TTag | null>(null)
    useEffect(() => {
        usersAPI.getAllUsers().then(res => {
            setUsers(res)
        })
    }, [])
    useEffect(() => {
        tagsAPI.getPriorities().then(res => {
            setPriorities(res)
        })
    }, [])
    useEffect(() => {
        tagsAPI.getStatuses().then(res => {
            setStatuses(res)
        })
    }, [])

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
                                <Button type="submit" variant="contained" color="primary" disabled={loading}>
                                    Создать
                                </Button>
                                <Button variant="contained" color="secondary" disabled={loading}>
                                    Отмена
                                </Button>
                            </ButtonGroup>
                        </Grid>
                        {!!priorities && <Grid item>
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
                                    >
                                        {priorities.map((value, i) => {
                                            return (
                                                <MenuItem key={i} value={priorities[i]._id}>{priorities[i].label}</MenuItem>
                                            )
                                        })}
                                    </TextField>
                                )}
                            />
                        </Grid>}
                        {!!statuses && <Grid item>
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
                                    >
                                        {statuses.map((value, i) => {
                                            return (
                                                <MenuItem key={i} value={statuses[i]._id}>{statuses[i].label}</MenuItem>
                                            )
                                        })}
                                    </TextField>
                                )}
                            />
                        </Grid>}
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
                                        <MenuItem value="front">Front</MenuItem>
                                        <MenuItem value="back">Back</MenuItem>
                                    </TextField>
                                )}
                            />
                        </Grid>
                        {!!users && <Grid item>
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
                        </Grid>}
                    </Grid>
                </Paper>
            </Grid>
        </Grid>
    </form>
}

export default TaskPage