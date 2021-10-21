import * as React from 'react'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import LoadingButton from '@mui/lab/LoadingButton'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

function Home({ history, user, connect }) {

  const [ profileId, setProfileId ] = React.useState("")

  const [ connecting, setConnecting ] = React.useState(false)
  const handleConnect = async () => {
    console.log("Logging in.")
    setConnecting(true)
    const user = await connect()
    setConnecting(false)
    if(!user) {
      console.log("Log in failed.")
      return
    }
    else {
      console.log("Logged in.")
      history.push('/' + user.id + '/' + encodeURIComponent('C:'))
    }
  }

  const goToMyDrive = () => {
    history.push('/' + user.id + '/' + encodeURIComponent('C:'))
  }

  const search = ()  => {
    history.push('/' + profileId + '/' + encodeURIComponent('C:'))
  }

  return (
    <Box sx={{ flexGrow: 1,  height: '100vh' }}>
      <Grid direction="column" sx={{ width: '100%', height: '100%' }} container justifyContent="center" alignItems="center">
        <Grid item>
          <Typography variant="h1" sx={{ textAlign: 'center' }}>
            C:Drive
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="subtitle1" sx={{ textAlign: 'center' }}>
            Upload and share public files with others
          </Typography>
        </Grid>
        <Grid container item sx={{ mt: 3 }} justifyContent="center" alignItems="center">
          <Grid item>
            { 
              !user ? 
                <LoadingButton sx={{ p: 2 }} size="large" variant="outlined" onClick={handleConnect} loading={connecting}>Connect</LoadingButton> 
              :
                <Button sx={{ p: 2 }} size="large" variant="outlined" onClick={goToMyDrive}>My Drive</Button>
            }
          </Grid>
          <Grid sx={{ mx: 1 }} item>
            - or -
          </Grid>
          <Grid item>
            <TextField placeholder={"did:3:kjzl6cwe1jw1..."} value={profileId} onChange={(e) => setProfileId(e.target.value)} />
          </Grid>
          <Grid item>
            <Button sx={{ ml: 2, p: 2 }} variant="outlined" onClick={search}>search</Button>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Home