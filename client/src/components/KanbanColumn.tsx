import { Button, Container, Typography } from "@material-ui/core"
import { Droppable } from "react-beautiful-dnd"
import styled from "styled-components"
import { TTagInner } from "../api/tags.api"
import { setTasks } from "../redux/selectors/tasks.selector"
import { useSelector } from "react-redux"
import KanbanTask from "./KanbanTask"
import { TTask } from "../api/tasks.api"

type TColumnProps = {
    column: TTagInner,
    tasks: TTask[]
}

type TIsDraggingOver = {
    $isDraggingOver: boolean
}

const ColumnContainer = styled(Container) <TIsDraggingOver>`
    transition: background-color 0.2s ease;
    background-color: ${props => props.$isDraggingOver ? '#e3f2fd' : 'white'};
    height: calc(100% - 36px);
`

const KanbanColumn: React.FC<TColumnProps> = ({ column, tasks }) => {

    if (!column) return <div>NOTHING TO SHOW</div>
    return (
        <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            maxWidth: '500px'
        }}>
            <Container>
                <Typography variant="h6" component="h6" align="center">{column.label}</Typography>
            </Container>
            <Droppable droppableId={column._id}>
                {(provided, snapshot) => (
                    <ColumnContainer
                        {...provided.droppableProps}
                        innerRef={provided.innerRef}
                        $isDraggingOver={snapshot.isDraggingOver}
                        style={{ padding: '5px', borderRadius: '2px' }}
                    >
                        {tasks?.map((task, index) => {
                            if (task.status?._id === column._id) {
                                return (
                                    <KanbanTask key={task._id} task={task} index={index} />
                                )
                            }
                            if (task.status === null && column._id === "1") {
                                return (
                                    <KanbanTask key={task._id} task={task} index={index} />
                                )
                            }
                        })}
                        {provided.placeholder}
                        <Button variant='outlined' style={{ display: 'block', margin: '0 auto' }}>+</Button>
                    </ColumnContainer>
                )}
            </Droppable>
        </div>
    )
}

export default KanbanColumn