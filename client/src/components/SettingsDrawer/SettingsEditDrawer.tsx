import React from 'react';
import { Divider, Drawer, Grid, Typography, Button } from '@material-ui/core';
import { PrioritiesForm } from './PrioritiesForm';
import { StatusesForm } from './StatusesForm';

type TSettingsEditDrawer = {
  isSettingsEdit: boolean
  setSettingsEdit: (isSettingsEdit: boolean) => void
}
export const SettingsEditDrawer: React.FC<TSettingsEditDrawer> = ({ isSettingsEdit, setSettingsEdit }) => {
  return <Drawer
    anchor="right"
    open={isSettingsEdit}
    onClose={() => setSettingsEdit(false)}
  >
    <div style={{
      overflow: "hidden",
      height: '100%'
    }}>
      <div style={{ display: 'flex', height: '100%', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <Typography variant="h6" align="center" style={{ padding: "10px" }}>
            Редактирование тэгов
          </Typography>
          <Divider />
          <PrioritiesForm />
          <Divider />
          <StatusesForm />
        </div>
        <div>
          <Divider />
          <Grid container spacing={2} style={{ padding: '16px' }}>
            <Grid item container justifyContent="center">
              <Button variant="contained" color="secondary" onClick={() => setSettingsEdit(false)}>
                Закрыть
              </Button>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  </Drawer>
}
