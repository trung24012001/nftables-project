import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, IconButton, Stack, styled, TablePagination, Theme } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import MenuTable from "./MenuTable";
import { TableSkeleton } from "./TableSkeleton";
import EmptyTable from "./EmptyTable";

export type HeaderType = {
  name: string;
  access: string;
};

export function ReactTable({
  headers,
  rows,
  loading,
  onActionAdd,
  onActionDelete,
  onActionRow

}: {
  headers: HeaderType[];
  rows: any[] | undefined;
  loading?: boolean;
  onActionAdd?: () => void;
  onActionDelete?: (row: any) => void;
  onActionRow?: () => void
}): React.ReactElement {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rowSelected, setRowSelected] = React.useState<any>(null);
  const [anchorMenu, setAnchorMenu] = React.useState<null | HTMLElement>(null);
  const handleOpenMenu =
    (row: any) => (event: React.MouseEvent<HTMLElement>) => {
      setAnchorMenu(event.currentTarget);
      setRowSelected(row);
    };
  const handleCloseMenu = () => {
    setAnchorMenu(null);
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = () => {
    setAnchorMenu(null);
    onActionDelete && onActionDelete(rowSelected);
  };

  const LoadingTable = () => {
    if (loading) {
      return <TableSkeleton />
    }

    return <EmptyTable />
  }

  return (
    <Stack spacing={2}>
      <Box>
        {onActionAdd && <IconButton onClick={onActionAdd}>
          <AddCircleIcon />
        </IconButton>
        }
      </Box>
      {rows?.length ?
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 600 }}>
            <TableHead>
              <TableRow>
                {headers.map((header: HeaderType) => (
                  <StyledTableCell align="left" key={header.name}>
                    {header.name}
                  </StyledTableCell>
                ))}
                <StyledTableCell></StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows?.map((row: any, idx: number) => {
                return (
                  <StyledTableRow hover key={idx} onClick={onActionRow}>
                    {headers.map((header: HeaderType) => (
                      <TableCell key={header.access} align="left">
                        {row[header.access]}
                      </TableCell>
                    ))}
                    <TableCell align="center">
                      <IconButton onClick={handleOpenMenu(row)}>
                        <MoreHorizIcon />
                      </IconButton>
                    </TableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
            component="div"
            count={rows?.length || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
          <MenuTable
            anchorEl={anchorMenu}
            handleDelete={handleDelete}
            handleClose={handleCloseMenu}
          />
        </TableContainer>
        :
        <LoadingTable />
      }

    </Stack>
  );
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.secondary.main,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.grey[50],
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
  cursor: 'pointer'
}));
