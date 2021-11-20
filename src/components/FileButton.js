import * as React from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported'

import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import OpenInBrowserIcon from '@mui/icons-material/OpenInBrowser'
import FileDownloadIcon from '@mui/icons-material/FileDownload'

import { FileSystem } from '@cbj/ceramic-filesystem'

function FileButton({ selectedFile, identity, ceramic, path, name, goto }) {
  
  const [ url, setUrl ] = React.useState()
  const [ image, setImage ] = React.useState()

  const isImage = () => {
    const validImageTypes = ['.apng','.avif','.gif','.jpeg','.jpg','.jfif','.pjpeg','.pjp','.png','.svg','.webp']
    let returnValue = false
    for(let i = 0; i < validImageTypes.length; i++) {
      const type = validImageTypes[i]
      if(name.includes(type)) {
        returnValue = true
        break
      }
    }
    return returnValue
  }

  const isText = () => {
    const validImageTypes = ['.txt','.json']
    let returnValue = false
    for(let i = 0; i < validImageTypes.length; i++) {
      const type = validImageTypes[i]
      if(name.includes(type)) {
        returnValue = true
        break
      }
    }
    return returnValue
  }

  const selectFile = () => {
    const filePath = path + "//" + name
    goto(filePath)
  }
  
  const openFile = () => {
    if(image)
      window.open(image, '_blank')
    else if(url)
      window.open(url, '_blank')
    handleClose()
  }

  const downloadFile = () => {
    console.log('download file')
    handleClose()
  }

  React.useEffect(() => {
    (async function(){
      if(!identity) return
      
      const fs = new FileSystem(ceramic)
      const filePath = path+'//'+name
      let file = await fs.open(identity.id, filePath)
      console.log(file)
      if(file) {
        const cid = (await file.history.getLastN(1))[0].value
  
        if(isImage()) setImage(`https://ipfs.io/ipfs/${cid}`)
        else if(isText()) setUrl(`https://ipfs.io/ipfs/${cid}`)
      }
      else {
        // file DNE or is still uploading
      }
    })()
  }, [])

  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleRightClick = (event) => {
    event.preventDefault()
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return <>
    <Button color="inherit" onContextMenu={handleRightClick} onClick={selectFile} sx={{ p: 0, width: 128, zIndex: 10 , height: 128, borderRadius: 3, border: selectedFile == name && '3px solid white' }}>
      { 
        isImage() ? 
          <ImageIcon name={name} image={image} /> :
        isText() ? 
          <TextIcon name={name} /> 
        :
          <DefaultIcon name={name} />
      }
    </Button>
    <Menu
      id="customized-menu"
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleClose}
      elevation={1}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'center',
        horizontal: 'center',
      }}
    >
      <MenuItem onClick={openFile}>
        <ListItemIcon>
          <OpenInBrowserIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Open" />
      </MenuItem>
      <MenuItem onClick={downloadFile} disabled>
        <ListItemIcon>
          <FileDownloadIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Download" />
      </MenuItem>
    </Menu>
  </>
}

function DefaultIcon({ name }) {
  return (
    <Box>
      <InsertDriveFileOutlinedIcon sx={{ fontSize: 84, color: '#DDD !important' }} />
      <Typography noWrap variant="subtitle2" align="center" sx={{ width: 128, px: 1, mt: 0, textAlign: 'center', textTransform: 'none' }}>
        {name}
      </Typography>
    </Box>
  )
}

function TextIcon({ name }) {
  return (
    <Box>
      <DescriptionOutlinedIcon sx={{ fontSize: 84, color: '#DDD !important' }} /> 
      <Typography noWrap variant="subtitle2" align="center" sx={{ width: 128, px: 1, mt: 0, textAlign: 'center', textTransform: 'none' }}>
        {name}
      </Typography>
    </Box>
  )
}

function ImageIcon({ name, image }) {
  return (
    <Box>
      {
        image ?
          <CardMedia sx={{ width: 122, borderRadius: 3, m: '3px' }}
            component="img"
            height="88"
            image={image}
            alt={!image ? "missing image" : "icon"}
          />
        :
          <ImageNotSupportedIcon sx={{ width: 84, height: 84 }} />
      }
      <Typography noWrap variant="subtitle2" align="center" sx={{ width: 122, px: 1, mt: 1, mb: '8px', textAlign: 'center', textTransform: 'none' }}>
        {name}
      </Typography>
    </Box>
  )
}

export default FileButton