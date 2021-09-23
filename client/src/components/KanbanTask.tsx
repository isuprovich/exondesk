import { Container, Paper } from '@material-ui/core'
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

const TaskCardd = styled(Container)<TTaskCardStyleProps>`
    display: flex;
    align-items: center;
    padding: 10px;
    margin-bottom: 8px;
    background-color: ${props => props.$isDragging ? '#bbdefb' : 'white'};
`
const handleDelete = () => {
    console.info('You clicked the delete icon.');
};

const handleClick = () => {
    console.info('You clicked the Chip.');
};

const Task: React.FC<TaskPropsType> = ({ task, index }) => {
    return (
        <Draggable draggableId={task._id} index={index}>
            {(provided, snapshot) => (
                <TaskCardd
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    innerRef={provided.innerRef}
                    $isDragging={snapshot.isDragging}
                >
                    <TaskCard task={task} />
                </TaskCardd>
            )}
        </Draggable>
    )
}

export default Task