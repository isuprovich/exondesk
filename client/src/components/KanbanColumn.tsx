import { Button, Typography, Grid } from "@material-ui/core"
import { Droppable } from "react-beautiful-dnd"
import styled from "styled-components"
import { TTagInner } from "../api/tags.api"
import KanbanTask from "./KanbanTask"
import { TTask } from "../api/tasks.api"
import { Link } from "react-router-dom"

type TColumnProps = {
    column: TTagInner,
    tasks: TTask[]
}

type TIsDraggingOver = {
    $isDraggingOver: boolean
}

const ColumnContainer = styled.div <TIsDraggingOver>`
    transition: background-color 0.2s ease;
    background-color: ${props => props.$isDraggingOver ? '#e3f2fd86' : ''};
    height: calc(100% - 36px);
    padding: 0;
    width: 100%;
`

const KanbanColumn: React.FC<TColumnProps> = ({ column, tasks }) => {

    if (!column) return <div>NOTHING TO SHOW</div>
    return (
        <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            maxWidth: '450px',
        }}>
            <Droppable droppableId={column._id}>
                {(provided, snapshot) => (
                    <ColumnContainer
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        $isDraggingOver={snapshot.isDraggingOver}
                        style={{padding: '8px'}}
                    >
                        <Grid container spacing={1}>
                            <Grid item>
                                <Typography variant="h6" align="center">{column.label}</Typography>
                            </Grid>
                            {tasks?.map((task, index) => {
                                if (task.status?._id === column._id) {
                                    return (
                                        <Grid item style={{width: '100%'}}><KanbanTask key={task._id} task={task} index={index} /></Grid>
                                    )
                                }
                                if (task.status === null && column._id === "1") {
                                    return (
                                        <Grid item style={{width: '100%'}}><KanbanTask key={task._id} task={task} index={index} /></Grid>
                                    )
                                }
                            })}
                            <Grid item>{provided.placeholder}</Grid>
                            <Grid item container justifyContent="center">
                                <Button component={Link} to={`/newtask/?id=${column._id}`} variant='outlined'>Создать задачу</Button>
                            </Grid>
                        </Grid>
                    </ColumnContainer>
                )}
            </Droppable>
        </div>
    )
}

export default KanbanColumn