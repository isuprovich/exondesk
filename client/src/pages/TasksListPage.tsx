import { Paper } from '@material-ui/core'
import { useState } from 'react'
import initData from '../legacydata/initData'

const TasksListPage: React.FC = () => {
    const [state, setState] = useState(initData)
    return <Paper variant='outlined' style={{ padding: '16px', margin: '16px' }}>
        
    </Paper>
}

export default TasksListPage