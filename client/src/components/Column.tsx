import { Button, Container, Typography } from "@material-ui/core"
import { Droppable } from "react-beautiful-dnd"
import styled from "styled-components"
import { TTask, TColumn, IUsers } from "../legacydata/initData"
import Task from "./Task"

type TColumnProps = {
    column: TColumn,
    tasks: Array<TTask>,
    users: IUsers
}

type TIsDraggingOver = {
    $isDraggingOver: boolean
}

const ColumnContainer = styled(Container) <TIsDraggingOver>`
    transition: background-color 0.2s ease;
    background-color: ${props => props.$isDraggingOver ? '#e3f2fd' : 'white'};
    height: calc(100% - 36px);
`

const Column: React.FC<TColumnProps> = ({ column, tasks, users }) => {
    return (
        <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <Container>
                <Typography variant="h6" component="h6" align="center">{column.title}</Typography>
            </Container>
            <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                    <ColumnContainer
                        {...provided.droppableProps}
                        innerRef={provided.innerRef}
                        $isDraggingOver={snapshot.isDraggingOver}
                        style={{ padding: '5px', borderRadius: '2px' }}
                    >
                        {tasks.map((task, index) => {
                            const executor = users[task.taskExecutor]
                            return (
                                <Task key={task.id} task={task} index={index} executor={executor} />
                            )
                        })}
                        {provided.placeholder}
                        <Button variant='outlined' style={{ display: 'block', margin: '0 auto' }}>+</Button>
                    </ColumnContainer>
                )}
            </Droppable>
        </div>
    )
}

export default Column