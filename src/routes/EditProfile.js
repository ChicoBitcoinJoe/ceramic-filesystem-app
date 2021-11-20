import * as React from 'react'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import LoadingButton from '@mui/lab/LoadingButton'

import Header from '../components/Header'

function EditProfile({ history, user, connect }) {
  
  const [ username, setUsername ] = React.useState("")
  const [ newName, setNewName ] = React.useState("")

  const [ connecting, setConnecting ] = React.useState(false)
  const handleConnect = async () => {
    setConnecting(true)
    await connect()
    setConnecting(false)
  }

  React.useEffect(() => {
    (async () => {
      if(user) {
        const userProfile = await user.get('basicProfile')
        const name = userProfile && userProfile.name ? userProfile.name : ""
        setUsername(name)
        setNewName(name)
      }
      else {
        setUsername("")
        setNewName("")
      }
    })()
  }, [user])

  const updateProfile = async () => {
    console.log("Updating profile name", newName)
    await user.set('basicProfile', { name: newName })
    console.log("Update complete")
    history.push('/' + user.id + '/' + encodeURIComponent('C:'))
  }  

  const ConnectView = <>
    <Box sx={{ flexGrow: 1,  height: '100vh' }}>
      <Grid direction="column" sx={{ width: '100%', height: '100%' }} container justifyContent="center" alignItems="center">
        <Grid item>
          <Typography variant="h1" sx={{ textAlign: 'center' }}>
            Edit Profile
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="subtitle1" sx={{ textAlign: 'center' }}>
            Connect to your drive to access your profile
          </Typography>
        </Grid>
        <Grid item>
          <LoadingButton sx={{ mt: 8, p: 3 }} size="large" onClick={handleConnect} loading={connecting}>connect</LoadingButton>
        </Grid>
      </Grid>
    </Box>
  </>

  return (
    !user ? ConnectView : <>
      <Header history={history} user={user} connect={connect} />
      <Box sx={{ flexGrow: 1, p: 2 }}>
        <Grid container>
          <TextField fullWidth label="Name" placeholder="Enter your name" value={newName} onChange={e => setNewName(e.target.value)} />
          <TextField sx={{ my: 2 }} label="Image" fullWidth placeholder="Enter an image url" disabled />
          <Button fullWidth size="large" onClick={updateProfile} disabled={!newName || newName === username}>update profile</Button>
        </Grid>
      </Box>
    </>
  )
}

export default EditProfile