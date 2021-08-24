import { Switch, Route, Redirect } from 'react-router-dom'
import KanbanPage from './pages/KanbanPage'
import LoginPage from './pages/AuthPages'
import TasksListPage from './pages/TasksListPage'
import TaskPage from './pages/TaskPage'
import SettingsPage from './pages/SettingsPage'

export const useRoutes = (isAuth: boolean) => {

    if (isAuth) {
        return (
            <Switch>
                <Route path='/kanban' render={() => <KanbanPage />} />
                <Route path='/tasks' render={() => <TasksListPage />} />
                <Route path='/newtask' render={() => <TaskPage mode={'new'} />} />
                <Route path='/task/:taskId?' render={() => <TaskPage mode={'edit'} />} />
                <Route path='/settings' render={() => <SettingsPage />} />
                <Redirect to='/tasks' />
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