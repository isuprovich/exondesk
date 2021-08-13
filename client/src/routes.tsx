import { Switch, Route, Redirect } from 'react-router-dom'
import KanbanPage from './pages/KanbanPage'
import LoginPage from './pages/AuthPages'
import TasksListPage from './pages/TasksListPage'
import NewTaskPage from './pages/NewTaskPage'

export const useRoutes = (isAuth: boolean) => {
    if (isAuth) {
        return (
            <Switch>
                <Route path='/kanban' render={() => <KanbanPage />} />
                <Route path='/tasks' render={() => <TasksListPage />} />
                <Route path='/newtask' render={() => <NewTaskPage />} />
                <Redirect to='/kanban' />
            </Switch>
        )
    }
    return (
        <Switch>
            <Route path='/auth' exact render={() => <LoginPage />} />
            <Redirect to='/auth' />
        </Switch>
    )
}