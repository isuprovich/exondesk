import React, { useEffect, useState } from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import { Backdrop, CircularProgress, Grid, LinearProgress, Paper } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux'
import { setStatuses } from '../redux/selectors/tags.selector'
import KanbanColumn from '../components/KanbanColumn';
import { setTasks } from '../redux/selectors/tasks.selector';
import { getTasks } from '../redux/reducers/tasks.reducer';
import { tasksAPI } from '../api/tasks.api';
import zIndex from '@material-ui/core/styles/zIndex';

const KanbanPage: React.FC = () => {

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getTasks())
    }, [dispatch])

    const tasks = useSelector(setTasks)
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
        console.log('card id:', draggableId)
        console.log('from where:', source.droppableId)
        console.log('where to save:', destination.droppableId)
        // Отмена перемещения
        if (!destination) {
            return
        }
        // Перемещение в изначальную позицию
        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return
        }
        // Перемещение в пределах колонки
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
        // Пермещение между колонками
        if (destination.droppableId !== source.droppableId) {
            setIsUpdating(true)
            if (destination.droppableId === 1) {
                tasksAPI.editTask({ status: "" }, draggableId).then(() => {
                    dispatch(getTasks())
                    setIsUpdating(false)
                })
            }
            tasksAPI.editTask({ status: destination.droppableId }, draggableId).then(() => {
                dispatch(getTasks())
                setIsUpdating(false)
            })
        }
    }

    if (!tasks) return <LinearProgress />
    return <DragDropContext onDragEnd={onDragEnd}>
        {isUpdating && <LinearProgress />}
        <Paper variant='outlined' style={{ margin: '8px', overflow: 'auto', height: '100%' }}>
            <Grid container direction="row" style={{ width: 'max-content' }}>
                <Grid key={"noStatus"} item>
                    <KanbanColumn column={emptyColumn} tasks={tasks} />
                </Grid>
                {statuses.map((value, i) => {
                    return <Grid key={value._id} item>
                        <KanbanColumn column={value} tasks={tasks} />
                    </Grid>
                })}
            </Grid>
        </Paper>
    </DragDropContext>
}

export default KanbanPage
