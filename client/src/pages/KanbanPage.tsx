import React, { useState } from 'react'
import Column from '../components/Column';
import initData from '../legacydata/initData'
import { DragDropContext } from 'react-beautiful-dnd'
import { Grid, Paper } from '@material-ui/core';

const KanbanPage: React.FC = () => {
    //Логика перемещения элементов
    const [state, setState] = useState(initData)
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
        const start = state.columns[source.droppableId]
        const finish = state.columns[destination.droppableId]
        if (start === finish) {
            const newTaskIds = Array.from(start.taskIds)
            newTaskIds.splice(source.index, 1)
            newTaskIds.splice(destination.index, 0, draggableId)
            const newColumn = {
                ...start,
                taskIds: newTaskIds
            }
            const newState = {
                ...state,
                columns: {
                    ...state.columns,
                    [newColumn.id]: newColumn
                }
            }
            setState(newState)
            return
        }
        // Пермещение между колонками
        const startTaskIds = Array.from(start.taskIds)
        startTaskIds.splice(source.index, 1)
        const newStart = {
            ...start,
            taskIds: startTaskIds,
        }
        const finishTaskIds = Array.from(finish.taskIds)
        finishTaskIds.splice(destination.index, 0, draggableId)
        const newFinish = {
            ...finish,
            taskIds: finishTaskIds
        }
        const newState = {
            ...state,
            columns: {
                ...state.columns,
                [newStart.id]: newStart,
                [newFinish.id]: newFinish
            }
        }
        setState(newState)
    }
    return <DragDropContext onDragEnd={onDragEnd}>
        <Paper variant='outlined' style={{padding: '16px', margin: '16px'}}>
            <Grid container spacing={3}>
                {state.columnOrder.map((columnId) => {
                    const column = state.columns[columnId]
                    const users = state.users
                    const tasks = column.taskIds.map(taskId => state.tasks[taskId])
                    return <Grid
                        key={column.id}
                        item
                        xs={12}
                        sm={3}
                    ><Column column={column} tasks={tasks} users={users} /></Grid>
                })}
            </Grid>
        </Paper>
    </DragDropContext>
}

export default KanbanPage
