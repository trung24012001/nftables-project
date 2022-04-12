import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, IconButton, Stack, styled, TablePagination } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AddCircleIcon from '@mui/icons-material/AddCircle';



export function ReactTable({
  headers, rows,
  handleActionAdd, handleActionDelete }:
  {
    headers: any,
    rows: any,
    handleActionAdd?: void,
    handleActionDelete?: void
  }): React.ReactElement {

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Stack spacing={2}>
      <Box>
        <IconButton onClick={() => handleActionAdd} >
          <AddCircleIcon />
        </IconButton>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 600 }} >
          <TableHead>
            <TableRow>
              {headers.map((header: any) => (
                <StyledTableCell align="left" key={header}>{header}</StyledTableCell>
              ))}
              <StyledTableCell>
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row: any, idx: number) => {
              const keys = Object.keys(row);
              return (
                <StyledTableRow key={idx} >
                  {keys.map(key => (
                    <TableCell key={key} align="left">{row[key]}</TableCell>
                  ))}
                  <TableCell align="center">
                    <IconButton><MoreHorizIcon /></IconButton>
                  </TableCell>
                </StyledTableRow>
              )
            })}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Stack>

  );
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));