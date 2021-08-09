import { Chip, Grid, Paper, Typography } from '@material-ui/core'
import { Draggable } from "react-beautiful-dnd"
import styled from "styled-components"
import { TTask, TUser } from "../legacydata/initData"
// import DragIndicatorIcon from '@material-ui/icons/DragIndicator'
import FaceIcon from '@material-ui/icons/Face'

type TaskPropsType = {
    task: TTask,
    index: number,
    executor: TUser
}
type TTaskCardStyleProps = {
    $isDragging: boolean,
    $priority: 'low' | 'normal' | 'high' | 'critical' | 'epic' 
}

// const DragButton = styled(DragIndicatorIcon)`
//     display: block
// `

const TaskCard = styled(Paper) <TTaskCardStyleProps>`
    display: flex;
    align-items: center;
    padding: 10px;
    margin-bottom: 8px;
    border-left: 8px solid ${props =>
        props.$priority === 'normal' ? '#8bc34a' :
        props.$priority === 'high' ? '#ffc107' :
        props.$priority === 'critical' ? '#f44336' :
        props.$priority === 'epic' ? '#e91e63' : '#9e9e9e'};
    background-color: ${props => props.$isDragging ? '#bbdefb' : 'white'};
`
const handleDelete = () => {
    console.info('You clicked the delete icon.');
};

const handleClick = () => {
    console.info('You clicked the Chip.');
};

const Task: React.FC<TaskPropsType> = ({ task, index, executor }) => {
    return (
        <Draggable draggableId={task.id} index={index}>
            {(provided, snapshot) => (
                <TaskCard
                    variant="outlined"
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    innerRef={provided.innerRef}
                    $isDragging={snapshot.isDragging}
                    $priority={task.priority}
                >
                    <Grid container spacing={1} alignItems='center'>
                        <Grid item>
                            <Typography gutterBottom variant='body2'><strong>{task.taskNumber}</strong> {task.taskName}</Typography>
                        </Grid>
                        <Grid item container spacing={1}>
                            <Grid item>
                                <Chip
                                    icon={<FaceIcon />}
                                    size="small"
                                    label={executor.name}
                                    onClick={handleClick}
                                    onDelete={handleDelete}
                                />
                            </Grid>
                            <Grid item>
                                <Chip
                                    //icon={<FaceIcon />}
                                    size="small"
                                    label={task.taskSide}
                                    onClick={handleClick}
                                    onDelete={handleDelete}
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                </TaskCard>
            )}
        </Draggable>
    )
}

export default Task