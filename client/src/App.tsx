import { Switch, Route, Redirect } from 'react-router-dom'
import React, { useEffect } from 'react'
import { useAuth } from './hooks/auth.hook'
import { SnackbarProvider } from 'notistack';
import { AuthContext } from './context/AuthContext'
import { CssBaseline } from '@material-ui/core'
import Navbar from './components/Navbar'
import { getStatuses, getPriorities } from './redux/reducers/tags.reducer'
import { getCurrentUser, getUsers } from './redux/reducers/users.reducer'
import { useDispatch } from 'react-redux'
import LoginPage from './pages/AuthPages'
import KanbanPage from './pages/KanbanPage'
import SettingsPage from './pages/SettingsPage'
import TaskPage from './pages/TaskPage'
import TasksListPage from './pages/TasksListPage'

const App: React.FC = () => {
  const { token, login, logout, userId, ready } = useAuth()
  const isAuth = !!token
  const dispatch = useDispatch()
  useEffect(() => { dispatch(getUsers()) }, [dispatch])
  useEffect(() => { dispatch(getStatuses()) }, [dispatch])
  useEffect(() => { dispatch(getPriorities()) }, [dispatch])
  useEffect(() => { if (userId) dispatch(getCurrentUser(userId)) }, [dispatch, userId])

  if (!ready) {
    return <>
      <CssBaseline />
      LOADING
    </>
  }
  return <>
    <SnackbarProvider>
      <AuthContext.Provider value={{ token, login, logout, userId, isAuth }}>
        <CssBaseline />
        {userId !== "" && <Navbar logout={logout} userId={userId} />}
        {isAuth && <Switch>
          <Route path='/kanban' render={() => <KanbanPage />} />
          <Route path='/tasks' render={() => <TasksListPage />} />
          <Route path='/newtask' render={() => <TaskPage editMode={false} />} />
          <Route path='/task/:taskId?' render={() => <TaskPage editMode={true} isReadOnly={true} />} />
          <Route path='/edit/:taskId?' render={() => <TaskPage editMode={true} />} />
          <Route path='/settings' render={() => <SettingsPage />} />
          <Redirect to='/tasks' />
        </Switch>}
        {!isAuth &&
          <Switch>
            <Route path='/auth' exact render={() => <LoginPage />} />
            <Redirect to='/auth' />
          </Switch>}
      </AuthContext.Provider>
    </SnackbarProvider>
  </>
}

export default App
