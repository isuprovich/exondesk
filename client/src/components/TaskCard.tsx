import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Paper, Grid, ButtonGroup, Button, Collapse, Avatar, Typography } from '@material-ui/core'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import ReactMarkdown from 'react-markdown'
import { TTask } from '../api/tasks.api'
import { stringAcronymize } from '../custom-functions/stringAcronymize'
import { CustomTagButton } from './StyledComponents/CustomTagButton'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined'
import EditOutlinedIcon from '@material-ui/icons/EditOutlined'
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        expand: {
            transform: 'rotate(0deg)',
            transition: theme.transitions.create('transform', {
                duration: theme.transitions.duration.shortest
            }),
        },
        expandOpen: {
            transform: 'rotate(180deg)',
        }
    })
)

interface ITaskCard {
    task: TTask
    handleOpenDelete?: any
    handleClick?: any
    kanban?: boolean
}
const TaskCard: React.FC<ITaskCard> = ({ task, handleOpenDelete, handleClick, kanban }) => {
    const classes = useStyles();
    const [expanded, setExpanded] = useState(false)
    return <Paper variant="outlined" style={{ width: "100%" }}>
        <Grid container alignItems="stretch">
            <Grid item container alignItems="stretch" wrap="nowrap">
                <Grid item zeroMinWidth style={{ display: 'flex', flexDirection: "row", flexGrow: 1, padding: "4px 5px" }}>
                    <Typography noWrap component="span">
                        <strong>MS-{task.number}</strong> {task.taskname}
                    </Typography>
                </Grid>
                <Grid item>
                    <ButtonGroup size="small" variant="text">
                        <Button component={Link} to={`/task/${task.number}`} color="primary"><VisibilityOutlinedIcon /></Button>
                        {!kanban && <Button color="secondary" onClick={(event) => { handleOpenDelete(task.number, event) }}><DeleteOutlinedIcon /></Button>}
                        <Button component={Link} to={`/edit/${task.number}`} color="primary"><EditOutlinedIcon /></Button>
                        <Button disabled={!task.description} onClick={() => setExpanded(!expanded)} color="primary">
                            <ExpandMoreIcon
                                className={clsx(classes.expand, { [classes.expandOpen]: expanded })}
                            />
                        </Button>
                    </ButtonGroup>
                </Grid>
            </Grid>
            <Grid item xs={12} sm={12} container>
                <Grid item xs={8} sm={8}>
                    <ButtonGroup size="small" variant="text">
                        <CustomTagButton
                            onClick={() => { handleClick() }}
                            color={task.priority?.color ? task.priority?.color : '#9e9e9e'}
                            label={task.priority?.label ? task.priority?.label : 'Нет приоритета'}
                        />
                        {!kanban && <CustomTagButton
                            onClick={() => { handleClick() }}
                            color={task.status?.color ? task.status?.color : '#9e9e9e'}
                            label={task.status?.label ? task.status?.label : 'Нет статуса'}
                        />}
                        <CustomTagButton
                            label={task.side === '' ? 'Нет подсистемы' : task.side === 'front' ? 'Front' : 'Back'}
                            color={task.side === '' ? '#9e9e9e' : task.side === 'front' ? '#0097a7' : '#ffa000'}
                            onClick={() => { handleClick() }}
                        />
                        <CustomTagButton
                            avatar={<Avatar style={{
                                height: '24px',
                                width: '24px',
                                fontSize: '12px'
                            }}>
                                {stringAcronymize(task.executor?.name === undefined ? task.executor?.email : task.executor?.name)}
                            </Avatar>}
                            label={task.executor === null ? 'Нет исполнителя' : task.executor?.name === undefined ? task.executor?.email : task.executor?.name}
                            color={!!task.executor?.color ? task.executor?.color : "#9e9e9e"}
                            onClick={() => { handleClick() }}
                        />
                    </ButtonGroup>
                </Grid>
                {!kanban && <Grid item xs={4} sm={4} style={{
                    textAlign: 'end',
                    display: 'flex',
                    justifyContent: 'end',
                    alignContent: 'center',
                    flexDirection: 'column',
                    padding: "4px 5px",
                    whiteSpace: "nowrap"
                }}
                >
                    {task.dateOfUpdate === null ? 'Создана: ' : 'Обновлена: '}
                    {new Date(task.dateOfUpdate === null ? task.dateOfCreation : task.dateOfUpdate).toLocaleTimeString('ru-RU', {
                        day: "numeric",
                        month: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "numeric"
                    })}
                </Grid>}
            </Grid>
        </Grid>
        <Collapse in={expanded} unmountOnExit>
            <Paper variant="outlined" style={{ margin: '8px', padding: '8px' }}><ReactMarkdown>{task.description}</ReactMarkdown></Paper>
        </Collapse>
    </Paper>
}

export default TaskCard