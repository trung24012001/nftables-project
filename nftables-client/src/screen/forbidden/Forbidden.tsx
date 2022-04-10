import { Stack, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

const Forbidden: React.VFC = () => {
  return (
    <Stack>
      <Typography>Forbidden</Typography>
      <Link to="/">Back to Home</Link>
    </Stack>
  )
}

export { Forbidden }
