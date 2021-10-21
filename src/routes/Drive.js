import * as React from 'react'

import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'

import { Core, PublicID } from '@self.id/core'
import { FileSystem } from '@cbj/ceramic-filesystem'

import Header from '../components/Header'
import CreateFolderButton from '../components/CreateFolderButton'
import UploadFileButton from '../components/UploadFileButton'
import Path from '../components/Path'
import FolderGrid from '../components/FolderGrid'
import FileGrid from '../components/FileGrid'

const parsePath = (fullPath) => {
  // remove leading /
  if(fullPath[fullPath.length-1] === '/')
    fullPath = fullPath.slice(0, -1)

  let folderPath = fullPath
  let fileName = ""
  const fileIndex = fullPath.indexOf('//')
  if(fileIndex !== -1) {
    fileName = fullPath.slice(fileIndex+2)
    folderPath = fullPath.slice(0, fileIndex)
  }

  return [ fullPath, folderPath, fileName ]
}

function Drive({ match, history, user, connect, ipfs }) {
  
  const [ fullPath, folderPath, fileName ] = parsePath(decodeURIComponent(match.params.path))
  // console.log(fullPath, folderPath, fileName)
  const core = new Core({ ceramic: 'local' })
  const coreFS = new FileSystem(core.ceramic)
  const identity = new PublicID({ core, id: match.params.did })
  const owned = identity?.id === user?.id
  // console.log("Identity is owned:", owned)
  
  const [ name, setName ] = React.useState()
  const [ profile, setProfile ] = React.useState()
  const [ folder, setFolder ] = React.useState()
  const [ loading, setLoading ] = React.useState(true)

  React.useEffect(() => {
    (async function Loading() {
      const profile = await identity.get('basicProfile')
      console.log('opening', identity.id, folderPath)
      const folder = await coreFS.open(identity.id, folderPath)
      if(folder) {
        const folders = await folder.folders.getFirstN(100)
        const files = await folder.files.getFirstN(100)
        console.log('folders', folders)
        console.log('files', files)
        
        setFolder({ folder, folders, files })        
      }
      else {
        setFolder(undefined)
      }
      
      setName(profile?.name ? profile?.name : identity.id.toString().slice(0,12)+'...')
      setProfile(profile)
      setLoading(false)
    })()
  }, [match.params.path, match.params.did])

  React.useEffect(() => {
    (async () => {
      if(user) {
        const userFS = new FileSystem(user.client.ceramic)
        const folder = await userFS.open(user.id.toString(), folderPath)
        if(folder) {
          const folders = await folder.folders.getFirstN(100)
          const files = await folder.files.getFirstN(100)
          console.log('folders', folders)
          console.log('files', files)
          
          setFolder({ folder, folders, files })        
        }
      }    
    })()
  }, [user])

  const createFolder = async (newFolderName) => {
    const newFolder = await folder.folder.open(newFolderName, { createIfUndefined: true })
    if(newFolder)
      history.push('/' + identity.id.toString() + '/' + encodeURIComponent(filePath + '/' + newFolder.name))
    else
      console.error(new Error("Failed to create new folder", newFolderName))
  }

  const goto = (newPath) => {
    history.push('/' + identity.id.toString() + '/' + encodeURIComponent(newPath))
  }

  const addFileToDrive = async ([ file ]) => {
    console.log('Adding', file, 'to', user.id.toString())
    const filePath = fullPath + '//' + file.name
    const fs = new FileSystem(user.client.ceramic)
    const validPath = fs.validPath(fullPath)
    if(!validPath) return

    const ipfsFile = await ipfs.add(file, {
      progress: (current) => {
        console.log(`progress: ${Math.round(current/file.size*100)}%`)
      }
    })
    console.log('hash:', ipfsFile.cid.toString())
    await ipfs.pin.add(ipfsFile.cid.toString())

    const fileExists = await fs.check(user.id.toString(), filePath)
    console.log('exists:', fileExists)
    if(fileExists) {
      // prompt to update file
      // currently a bug causes fs.check to always return false
      console.log('update?')
    }
    else {
      const ceramicFile = await fs.open(user.id.toString(), filePath, { createIfUndefined: true })
      console.log('file:', ceramicFile)
      await ceramicFile.history.insert(ipfsFile.cid.toString())
      const [ item ] = await ceramicFile.history.getFirstN(1)
      console.log('created:', file.name, item)
      goto(filePath)
    }
  }
  
  return (
    <Box>
      <Header history={history} user={user} connect={connect} />      
      <Box sx={{ p: 2 }}>
        <Grid container spacing={2}>
          <Grid item>
            <CreateFolderButton disabled={!owned} onSubmit={createFolder} />
          </Grid>
          <Grid item>
            <UploadFileButton disabled={!owned} onSubmit={addFileToDrive} />
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ px: 2, mb: 2, mt: 4 }}>
        <Path pathArray={folderPath.split('/')} goto={goto} name={name} />
      </Box>
      <Divider />
      {
        folder ? <>
          <FolderGrid goto={goto} folder={folder} path={folderPath} />
          <Divider />
          <FileGrid goto={goto}
            owned={owned} core={core} 
            identity={identity} 
            user={user} 
            core={core} 
            folder={folder} 
            path={folderPath}
            selectedFile={fileName} 
            addFileToDrive={addFileToDrive}
          />
        </>
        : <Box sx={{ m: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            { !loading && "This folder does not exist!" }
          </Typography>
        </Box>
      }
    </Box>
  )
}

export default Drive