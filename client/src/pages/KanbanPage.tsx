import React, { useEffect, useState } from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import { Grid, Paper } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux'
import { setStatuses } from '../redux/selectors/tags.selector'
import KanbanColumn from '../components/KanbanColumn';
import { setTasks } from '../redux/selectors/tasks.selector';
import { getTasks } from '../redux/reducers/tasks.reducer';

const KanbanPage: React.FC = () => {
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
        // // Пермещение между колонками
        // const startTaskIds = Array.from(start.taskIds)
        // startTaskIds.splice(source.index, 1)
        // const newStart = {
        //     ...start,
        //     taskIds: startTaskIds,
        // }
        // const finishTaskIds = Array.from(finish.taskIds)
        // finishTaskIds.splice(destination.index, 0, draggableId)
        // const newFinish = {
        //     ...finish,
        //     taskIds: finishTaskIds
        // }
        // const newState = {
        //     ...state,
        //     columns: {
        //         ...state.columns,
        //         [newStart.id]: newStart,
        //         [newFinish.id]: newFinish
        //     }
        // }
        // setState(newState)
    }

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
    if (!tasks) return <div>LOADING...</div>
    return <DragDropContext onDragEnd={onDragEnd}>
        <Paper variant='outlined' style={{ padding: '8px', margin: '8px', overflow: 'auto', height: '100%' }}>
            <Grid container spacing={1} direction="row" style={{width: 'max-content'}}>
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
