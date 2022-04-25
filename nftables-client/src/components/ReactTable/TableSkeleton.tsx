import { Paper, Skeleton, Table, TableBody, TableContainer, TableHead } from '@mui/material'
import {
  styled,
  TableCell,
  tableCellClasses,
  TableRow,
  tableRowClasses,
} from '@mui/material'


export type TableSkeletonType = {
  row_number?: number
  col_number?: number
}

const TableSkeleton: React.VFC<TableSkeletonType> = ({ col_number = 4, row_number = 3 }) => {
  return (
    <TableContainer component={Paper} variant="outlined" sx={{ mb: 10 }}>
      <Table size="small">
        <TableHead>
          <Row>
            {new Array(col_number).fill(0).map((el, idx) => (
              <Cell key={idx} size="medium">
                <Skeleton variant="text" />
              </Cell>
            ))}
          </Row>
        </TableHead>

        <TableBody>
          {new Array(row_number).fill(0).map((el, idx) => (
            <Row key={idx}>
              <Cell colSpan={col_number} size="medium">
                <Skeleton variant="text" />
              </Cell>
            </Row>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

const Cell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.grey[300],
    fontWeight: 'bold'
  },
  [`&.${tableCellClasses.body}`]: {
    borderColor: theme.palette.grey[200]
  }
}))

const Row = styled(TableRow, {
  shouldForwardProp: (prop) => prop !== 'hasRowClick'
})<{ hasRowClick?: boolean }>(({ theme, hasRowClick }) => ({
  [`&.${tableRowClasses.hover}`]: {
    cursor: hasRowClick ? 'pointer' : 'auto',
    '&$hover:hover': {
      backgroundColor: theme.palette.grey[100],
      '& td': {
        backgroundColor: theme.palette.grey[100]
      }
    }
  }
}))


export { TableSkeleton }
