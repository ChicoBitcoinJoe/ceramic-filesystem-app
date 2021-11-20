import * as React from 'react'

import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import FolderIcon from '@mui/icons-material/Folder';

function FolderButton({ name, onClick }) {
  return (
    <Button fullWidth
      startIcon={<FolderIcon sx={{ fontSize: 32 }} />}
      onClick={() => onClick(name)} 
      sx={{ px: 2, py: 1, justifyContent: "flex-start", textTransform: 'none' }}
      variant="outlined" 
      color="inherit"
      >
        <Typography noWrap>{name}</Typography>
    </Button>
  )
}

export default FolderButton