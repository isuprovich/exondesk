import React, { useEffect, useState } from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import { Collapse, Grid, LinearProgress, Paper, Typography } from '@material-ui/core'
import { useSelector, useDispatch } from 'react-redux'
import { setStatuses } from '../redux/selectors/tags.selector'
import KanbanColumn from '../components/KanbanColumn'
import { setTasks } from '../redux/selectors/tasks.selector'
import { getTasks } from '../redux/reducers/tasks.reducer'
import { tasksAPI } from '../api/tasks.api'
import { setUsers } from '../redux/selectors/users.selector'
import { TTask } from '../api/tasks.api'

const KanbanPage: React.FC = () => {

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getTasks())
    }, [dispatch])

    const tasks = useSelector(setTasks)
    let nonUserTasks = [] as TTask[]
    if (tasks) {
        Object.entries(tasks).map((task, j) => {
            if (!task[1].executor) {
                nonUserTasks.push(task[1])
            }
            return null
        })
    }
    const users = useSelector(setUsers)
    const statuses = useSelector(setStatuses)
    const emptyColumn = {
        label: "Не назначена",
        _id: "1",
        value: "null",
        color: "gray"
    }

    const [isUpdating, setIsUpdating] = useState(false)

    //Логика перемещения элементов
    const onDragEnd = (result: any) => {
        const { destination, source, draggableId } = result
        // Отмена перемещения
        if (!destination) {
            return
        }
        // Перемещение в изначальную позицию
        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return
        }
        //#region Перемещение в пределах колонки
        // const start = state.columns[source.droppableId]
        // const finish = state.columns[destination.droppableId]
        // if (start === finish) {
        //     const newTaskIds = Array.from(start.taskIds)
        //     newTaskIds.splice(source.index, 1)
        //     newTaskIds.splice(destination.index, 0, draggableId)
        //     const newColumn = {
        //         ...start,
        //         taskIds: newTaskIds
        //     }
        //     const newState = {
        //         ...state,
        //         columns: {
        //             ...state.columns,
        //             [newColumn.id]: newColumn
        //         }
        //     }
        //     setState(newState)
        //     return
        // }
        //#endregion

        // Пермещение между колонками
        if (destination.droppableId !== source.droppableId) {
            setIsUpdating(true)
            if (destination.droppableId.length === 48) {
                tasksAPI.editTask({
                    status: destination.droppableId.slice(0, 24),
                    executor: destination.droppableId.slice(24, 48)
                }, draggableId).then(() => {
                    dispatch(getTasks())
                    setIsUpdating(false)
                })
            }
            if (destination.droppableId.length === 24) {
                tasksAPI.editTask({
                    status: destination.droppableId,
                    executor: ''
                }, draggableId).then(() => {
                    dispatch(getTasks())
                    setIsUpdating(false)
                })
            }
            if (destination.droppableId.length === 25) {
                tasksAPI.editTask({
                    status: '',
                    executor: destination.droppableId.slice(1)
                }, draggableId).then(() => {
                    dispatch(getTasks())
                    setIsUpdating(false)
                })
            }
            if (destination.droppableId.length === 1) {
                tasksAPI.editTask({
                    status: '',
                    executor: ''
                }, draggableId).then(() => {
                    dispatch(getTasks())
                    setIsUpdating(false)
                })
            }
        }
    }

    if (!tasks) return <LinearProgress style={{ position: "absolute" }} />
    return <DragDropContext onDragEnd={onDragEnd}>
        {isUpdating && <LinearProgress />}
        <div style={{ padding: '8px', height: '100%' }}>
            <Paper variant='outlined' style={{ overflow: 'auto', height: '100%', padding: '8px' }}>
                <div>
                    <Typography variant="h6" style={{ padding: '8px' }}>Нет исполнителя</Typography>
                    <Collapse in={true} unmountOnExit>
                        <Grid container direction="row" style={{ width: 'max-content' }} spacing={1}>
                            <Grid key={"noStatus"} item>
                                <KanbanColumn column={emptyColumn} tasks={nonUserTasks} />
                            </Grid>
                            {statuses.map((value, i) => {
                                return <Grid key={value._id} item>
                                    <KanbanColumn column={value} tasks={nonUserTasks} />
                                </Grid>
                            })}
                        </Grid>
                    </Collapse>
                </div>
                {users.map((user, i) => {
                    let userTasks = [] as TTask[]
                    Object.entries(tasks).map((task, j) => {
                        if (task[1].executor?._id === user._id) {
                            userTasks.push(task[1])
                        }
                        return null
                    })
                    return <div key={user._id}>
                        <Typography variant="h6" style={{ padding: '8px' }}>{user.name}</Typography>
                        <Grid container direction="row" style={{ width: 'max-content' }} spacing={1}>
                            <Grid key={"noStatus"} item>
                                <KanbanColumn column={emptyColumn} tasks={userTasks} userId={user._id} />
                            </Grid>
                            {statuses.map((value, i) => {
                                return <Grid key={value._id} item>
                                    <KanbanColumn column={value} tasks={userTasks} userId={user._id} />
                                </Grid>
                            })}
                        </Grid>
                    </div>
                })}
            </Paper>
        </div>
    </DragDropContext>
}

export default KanbanPage
