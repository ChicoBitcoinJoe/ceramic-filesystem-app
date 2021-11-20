import * as React from 'react'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import FileButton from './FileButton'
import HiddenDragAndDrop from './HiddenDragAndDrop'

function FileGrid({ goto, owned, identity, user, core, folder, path, selectedFile, addFileToDrive }) {
  return (
    <Box sx={{ m: 2 }}>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        { folder.files.length == 0 ? "No Files" : "Files" }
      </Typography>
      <Grid container spacing={{ xs: 2, md: 3 }}>
        { owned && <HiddenDragAndDrop onDrop={addFileToDrive} /> }
        {
          folder.files.length > 0 &&
          folder.files.map((name, index) => {
            return (
              <Grid item key={name + index}>
                <FileButton 
                  selectedFile={selectedFile} 
                  identity={identity} 
                  ceramic={user ? user.client.ceramic : core.ceramic} 
                  path={path} 
                  name={name.value} 
                  goto={goto}
                /> 
              </Grid>
            )
          })
        }
      </Grid>
    </Box>
  )
}

export default FileGrid