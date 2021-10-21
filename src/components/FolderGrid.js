import * as React from 'react'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import FolderButton from './FolderButton'

function FolderGrid({ goto, path, folder }) {

  return (
    <Box sx={{ p: 2, minHeight: '176px' }}>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        { folder.folders.length == 0 ? "No Folders" : "Folders" }
      </Typography>
      {
        folder.folders.length > 0 &&
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 6, sm: 8, md: 12, lg: 12, xl: 12 }}>
          { 
            folder.folders.map((folder, index) => {
              return (
                <Grid item xs={6} sm={4} md={4} lg={3} xl={2} key={index}>
                  <FolderButton name={folder.value} onClick={() => goto(path + '/' + folder.value)} />
                </Grid>
              )
            })
          }
        </Grid>
      }
    </Box>
  )
}

export default FolderGrid