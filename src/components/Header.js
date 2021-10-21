import * as React from 'react'

import Typography from '@mui/material/Typography'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import LoadingButton from '@mui/lab/LoadingButton'
import PersonIcon from '@mui/icons-material/Person'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload'

import AvatarButton from './AvatarButton'

function Header({ history, user, connect }){

  const [ connecting, setConnecting ] = React.useState(false)
  const handleConnect = async () => {
    setConnecting(true)
    await connect()
    setConnecting(false)
  }

  const [ username, setUsername ] = React.useState()
  React.useEffect(() => {
    (async () => {
      if(user) {
        const userProfile = await user.get('basicProfile')
        const name = userProfile && userProfile.name ? userProfile.name : ""
        setUsername(name)
      }
      else {
        setUsername(undefined)
      }
    })()
  }, [user])

  const goToProfileEditor = () => {
    history.push('/profile/edit')
  }

  const goToMyDrive = () => {
    history.push('/' + user.id + '/C%3A')
  }

  return (
    <AppBar color="transparent" elevation={0} position="static">
      <Toolbar sx={{ px: '16px !important' }}>
        <IconButton sx={{ mr: 1 }} onClick={() => history.push('/')}>
          <AutoAwesomeIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          C:Drive
        </Typography>
        {
          !user ? 
            <LoadingButton size="large" onClick={handleConnect} loading={connecting}>
              connect
            </LoadingButton> 
          : <>
            <Typography variant="body1">{username}</Typography>
            <AvatarButton>
              <MenuItem onClick={goToMyDrive}>
                <ListItemIcon>
                  <DriveFolderUploadIcon fontSize="small" />
                </ListItemIcon>
                My Drive
              </MenuItem>
              <MenuItem onClick={goToProfileEditor}>
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                edit profile
              </MenuItem>
            </AvatarButton>
          </>
        }
      </Toolbar>
    </AppBar>
  )
}

export default Header