import * as React from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import LoadingButton from '@mui/lab/LoadingButton'
import Dialog from '@mui/material/Dialog'
import TextField from '@mui/material/TextField'

import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder'

function CreateFolderButton({ onSubmit, disabled }) {
 
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [name, setName] = React.useState("")
  const [creating, setCreating] = React.useState(false)
  const open = Boolean(anchorEl)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(undefined)
    setName("")
    setCreating(false)
  }

  const handleCreate = async () => {
    setCreating(true)
    await onSubmit(name)
    handleClose()
  }

  return <>
    <Button 
      sx={{ px: 2, py: 1 }}
      variant="outlined" 
      color="inherit"
      aria-controls="create-folder-dialog"
      aria-haspopup="true"
      aria-expanded={open ? 'true' : undefined}
      onClick={handleClick}
      startIcon={<CreateNewFolderIcon sx={{ mr: 1 }} />}
      disabled={disabled}
    >
      new folder
    </Button>
    <Dialog onClose={handleClose} open={open}>
      <Box sx={{ p: 3 }}>
        <TextField fullWidth autoFocus placeholder={"Enter a folder name"} value={name} onChange={e => setName(e.target.value)}  disabled={creating} />
        <LoadingButton sx={{mt: 2}} fullWidth loading={creating} disabled={!name || creating} onClick={handleCreate}>create</LoadingButton>
      </Box>
    </Dialog>
  </>
}

export default CreateFolderButton