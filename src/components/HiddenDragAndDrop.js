import * as React from 'react'

import Box from '@mui/material/Box'

import { FileDrop } from 'react-file-drop'

function HiddenDragAndDrop({ onDrop }) {

  const [ isDragging, setIsDragging ] = React.useState(false) 

  const onFrameDragEnter = (event) => {
    console.log('onFrameDragEnter', event)
    setIsDragging(true)
  }

  const onFrameDragLeave = (event) => {
    console.log('onFrameDragEnter', event)
    setIsDragging(false)
  }

  const onFrameDrop = (event) => {
    console.log('onFrameDragEnter', event)
    setIsDragging(false)
  }

  const dimensions = isDragging ? 
    { width: '100vw', height: '100vh', zIndex: 1000, backgroundColor: 'rgba(0,0,0,0.90)' } 
  :
    { width: 0, height: 0, zIndex: -1000 }

  return (
    <Box sx={{ ...dimensions, position: 'absolute', top: 0, left: 0, p: 12 }}>
      <FileDrop
        onFrameDragEnter={onFrameDragEnter}
        onFrameDragLeave={onFrameDragLeave}
        onFrameDrop={onFrameDrop}
        // onDragOver={(event) => console.log('onDragOver', event)}
        // onDragLeave={(event) => console.log('onDragLeave', event)}
        onDrop={onDrop}
      >
        { isDragging &&  <div className="ignore-cursor">Drop a file here to upload it</div> }
      </FileDrop>
    </Box>
  )
}

export default HiddenDragAndDrop