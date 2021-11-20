import * as React from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import LoadingButton from '@mui/lab/LoadingButton'
import Dialog from '@mui/material/Dialog'
import TextField from '@mui/material/TextField'

import FileUploadIcon from '@mui/icons-material/FileUpload'

function UploadFileButton({ onSubmit, disabled }) {
 
  const fileInput = React.useRef(null)

  const handleClick = (event) => {
    fileInput.current.click()
  }

  const handleFileChange = (event) => {
    onSubmit(event.target.files)
  }

  return <>
    <input style={{ display: 'none' }} type="file" onChange={handleFileChange} ref={fileInput} />
    <Button 
      sx={{ px: 2, py: 1 }}
      variant="outlined" 
      color="inherit"
      aria-controls="upload-file"
      aria-haspopup="true"
      onClick={handleClick}
      startIcon={<FileUploadIcon sx={{ mr: 1 }} />}
      disabled={disabled}
    >
      upload file
    </Button>
  </>
}

export default UploadFileButton