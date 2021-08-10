import { Switch, Route, Redirect } from 'react-router-dom'
import KanbanPage from './pages/KanbanPage'
import LoginPage from './pages/AuthPages'
import TasksListPage from './pages/TasksListPage'
import NewTaskPage from './pages/NewTaskPage'

export const useRoutes = (isAuth: boolean) => {
    if (isAuth) {
        return (
            <Switch>
                <Route path='/kanban'>
                    <KanbanPage />
                </Route>
                <Route path='/tasks'>
                    <TasksListPage />    
                </Route>
                <Route path='/newtask'>
                    <NewTaskPage />
                </Route>
                <Redirect to='/kanban' />
            </Switch>
        )
    }
    return (
        <Switch>
            <Route path='/auth' exact>
                <LoginPage />
            </Route>
            <Redirect to='/auth' />
        </Switch>
    )
}