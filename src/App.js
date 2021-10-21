import * as React from 'react'
import { BrowserRouter as HashRouter, Route, Switch, Redirect } from "react-router-dom"

import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'

import { EthereumAuthProvider, SelfID } from '@self.id/web'
import * as IPFS from 'ipfs-core'    
// import { IpfsDaemon } from "@ceramicnetwork/ipfs-daemon"

import theme from './theme'
import Home from './routes/Home'
import Drive from './routes/Drive'
import EditProfile from './routes/EditProfile'

const timer = ms => new Promise(res => setTimeout(res, ms))

function App() {

  const [ ipfs, setIpfs ] = React.useState()
  const [ user, setUser ] = React.useState()
  const connect = async () => {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' })      
      const self = await SelfID.authenticate({
        authProvider: new EthereumAuthProvider(window.ethereum, accounts[0]),
        ceramic: 'local',
        connectNetwork: 'testnet-clay',
      })
      
      setUser(self)
      return self
    }
    catch(err) {
      console.error(err)
    }
  }

  React.useEffect(() => {
    (async function(){
      const ipfs = await IPFS.create()
      console.log(ipfs)
      setIpfs(ipfs)
    })()
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HashRouter basename={'/ceramic-filesystem-app/#'}>
        <Switch>
          <Route exact path="/"             render={props => <Home        {...props} user={user} connect={connect} />} />
          <Route exact path="/profile/edit" render={props => <EditProfile {...props} user={user} connect={connect} />} />
          <Route       path="/:did/:path"   render={props => (ipfs && <Drive  {...props} user={user} connect={connect} ipfs={ipfs} />)} />
          <Route><Redirect to={{ pathname: "/" }} /></Route>
        </Switch>
      </HashRouter>
    </ThemeProvider>
  )
}

export default App