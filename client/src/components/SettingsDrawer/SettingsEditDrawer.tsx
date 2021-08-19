import React from 'react';
import { Divider, Drawer, Grid, Typography, Button } from '@material-ui/core';
import { TagsForm } from './TagsForm';
import { tagsAPI } from '../../api/tags.api';

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
      overflowX: "hidden",
      height: '100%'
    }}>
      <div style={{ display: 'flex', height: '99%', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <Typography variant="h6" align="center" style={{ padding: "10px" }}>
            Редактирование тэгов
          </Typography>
          <Divider />
          <TagsForm getTags={tagsAPI.getPriorities} newTag={tagsAPI.newPriority} deleteTag={tagsAPI.deletePriority} tagsLabel="Приоритеты" />
          <Divider />
          <TagsForm getTags={tagsAPI.getStatuses} newTag={tagsAPI.newStatus} deleteTag={tagsAPI.deleteStatus} tagsLabel="Статусы" />
          
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
