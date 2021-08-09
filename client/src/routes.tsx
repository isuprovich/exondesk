import { Switch, Route, Redirect } from 'react-router-dom'
import KanbanPage from './pages/KanbanPage'
import LoginPage from './pages/AuthPages'

export const useRoutes = (isAuth: boolean) => {
    if (isAuth) {
        return (
            <Switch>
                <Route path='/kanban'>
                    <KanbanPage />
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