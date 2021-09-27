import { Container } from '@material-ui/core'
import { Draggable } from "react-beautiful-dnd"
import styled from "styled-components"
import { TTask } from '../api/tasks.api'
import TaskCard from './TaskCard'

type TaskPropsType = {
    task: TTask,
    index: number,
}
type TTaskCardStyleProps = {
    $isDragging: boolean
}

const TaskCardDroppable = styled(Container)<TTaskCardStyleProps>`
    display: flex;
    align-items: center;
    padding: 0;
    background-color: ${props => props.$isDragging ? '#bbdefb' : ''};
`

const handleClick = () => {
    console.info('You clicked the Chip.');
};

const Task: React.FC<TaskPropsType> = ({ task, index }) => {
    return (
        <Draggable draggableId={task.number.toString()} index={index}>
            {(provided, snapshot) => (
                <TaskCardDroppable
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    innerRef={provided.innerRef}
                    $isDragging={snapshot.isDragging}
                >
                    <TaskCard task={task} kanban={true} />
                </TaskCardDroppable>
            )}
        </Draggable>
    )
}

export default Task