import * as React from 'react'

import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import IconButton from '@mui/material/IconButton'
import LinkIcon from '@mui/icons-material/Link'

function CopyPathButton({ text }) {

  const [open, setOpen] = React.useState(false)

  const copyToClipBoard = () => {
    navigator.clipboard.writeText(text)
    setOpen(true)
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return <>
    <IconButton onClick={copyToClipBoard} size="small">
      <LinkIcon />
    </IconButton>
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
      <Alert severity="info">Copied Url To Clipboard</Alert>
    </Snackbar>
  </>
}

export default CopyPathButton