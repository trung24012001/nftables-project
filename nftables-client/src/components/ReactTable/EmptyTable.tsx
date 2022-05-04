import { Paper, styled, Typography } from '@mui/material'

const Empty = styled(Paper)(({ theme }) => ({
  height: '300px',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 10
}))

const EmptyTable: React.VFC = () => {
  return (
    <Empty elevation={2}>
      <Typography variant="h5" color="grey.400">
        No data
      </Typography>
    </Empty>
  )
}

export default EmptyTable
