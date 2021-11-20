import * as React from 'react'

import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Breadcrumbs from '@mui/material/Breadcrumbs'

import CopyPathButton from './CopyPathButton'

function Path({ pathArray, goto, name }){
  return (
    <Grid container>
      <Typography sx={{ mr: 3}} variant="h6" noWrap>{name}</Typography>
      <Breadcrumbs color="inherit" separator={<b style={{ fontSize: '20px', pointerEvents: 'default'}}>/</b>} maxItems={3} itemsAfterCollapse={2}>
        {
          pathArray.map((crumb, index) => {
            let newPath = ""
            for(let i = 0; i <= index; i++) {
              newPath += pathArray[i] + '/'
            } 
            return (
              index !== pathArray.length-1 ?
                <Typography key={index} sx={{ cursor: 'pointer' }} variant="h6" noWrap onClick={() => goto(newPath)}>{crumb}</Typography>
              :
                <Typography key={index} variant="h6" noWrap>{crumb}</Typography>
            )
          })
        }
      </Breadcrumbs>
      <Grid item xs></Grid>
      <CopyPathButton text={window.location.href} />
    </Grid>
  )
}

export default Path