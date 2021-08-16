import { Button, Grid, MenuItem, Paper, TextField, Accordion, AccordionDetails, AccordionSummary } from '@material-ui/core'
import { useSnackbar } from 'notistack'
import React from 'react'
import { useForm, Controller, useWatch, Control, FieldValues } from 'react-hook-form'
import { useApi } from '../hooks/api.hook'
import ReactMarkdown from 'react-markdown'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useUsers } from '../hooks/users.hook'
import { usePriorities, useStatuses } from '../hooks/tags.hook'

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
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
            >Предпросмотр</AccordionSummary>
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
    const { loadingUsers, users } = useUsers()
    const { loadingStatuses, statuses } = useStatuses()
    const { loadingPriorities, priorities } = usePriorities()
    const createTask = async (data: any) => {
        try {
            const reqData = await request('/api/tasks/newtask', 'POST', data)
            enqueueSnackbar(reqData.message, { variant: 'success' })
        } catch (e) {
            enqueueSnackbar(e.message, { variant: 'error' })
        }
    }
    return <Paper variant='outlined' style={{ padding: '16px', margin: '16px' }}>
        <form onSubmit={handleSubmit(createTask)}>
            <Grid container spacing={2} alignItems="stretch">
                <Grid item xs={12} sm={12}>
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
                            />
                        )}
                        rules={{ required: "Введите наименование задачи" }}
                    />
                </Grid>
                <Grid item xs={12} sm={2}>
                    <Controller
                        name="side"
                        control={control}
                        defaultValue="front"
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <TextField
                                label="Подсистема"
                                variant="outlined"
                                value={value}
                                onChange={onChange}
                                error={!!error}
                                helperText={error ? error.message : null}
                                fullWidth={true}
                                select
                            >
                                <MenuItem value="front">Front</MenuItem>
                                <MenuItem value="back">Back</MenuItem>
                            </TextField>
                        )}
                    />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Controller
                        name="executor"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <TextField
                                label="Исполнитель"
                                variant="outlined"
                                value={value}
                                onChange={onChange}
                                error={!!error}
                                helperText={error ? error.message : null}
                                fullWidth={true}
                                disabled={loadingUsers}
                                select
                                required={true}
                            >
                                {Object.keys(users).map(i => {
                                    const j = Number(i)
                                    return (
                                        <MenuItem key={i} value={users[j]._id}>{users[j].name === undefined ? users[j].email : users[j].name}</MenuItem>
                                    )
                                })}
                            </TextField>
                        )}
                    />
                </Grid>
                <Grid item xs={12} sm={2}>
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
                                disabled={loadingPriorities}
                                select
                            >
                                {Object.keys(priorities).map(i => {
                                    const j = Number(i)
                                    return (
                                        <MenuItem key={i} value={priorities[j]._id}>{priorities[j].label}</MenuItem>
                                    )
                                })}
                            </TextField>
                        )}
                    />
                </Grid>
                <Grid item xs={12} sm={2}>
                    <Controller
                        name="status"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <TextField
                                label="Статус"
                                variant="outlined"
                                value={value}
                                onChange={onChange}
                                error={!!error}
                                helperText={error ? error.message : null}
                                fullWidth={true}
                                disabled={loadingStatuses}
                                select
                            >
                                {Object.keys(statuses).map(i => {
                                    const j = Number(i)
                                    return (
                                        <MenuItem key={i} value={statuses[j]._id}>{statuses[j].label}</MenuItem>
                                    )
                                })}
                            </TextField>
                        )}
                    />
                </Grid>
                <Grid container item xs={12} sm={3} spacing={2} alignContent="center" justifyContent="center">
                    <Grid item>
                        <Button type="submit" variant="contained" color="primary" disabled={loading}>
                            Создать задачу
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="secondary" disabled={loading}>
                            Отмена
                        </Button>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12}>
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
                                multiline
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} sm={12}>
                    <PreviewComponent control={control} />
                </Grid>
            </Grid>
        </form>
    </Paper>
}

export default TaskPage