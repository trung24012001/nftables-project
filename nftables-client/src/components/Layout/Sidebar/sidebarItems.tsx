import React from "react";
import { routes } from "lib/constant";
import BackupTableIcon from '@mui/icons-material/BackupTable';
import BarChartIcon from '@mui/icons-material/BarChart';
import TableViewIcon from '@mui/icons-material/TableView';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import RouterIcon from '@mui/icons-material/Router';

export type SidebarType = {
  name: string;
  route: string;
  icon?: React.ReactNode;
};

export const sidebarItems: SidebarType[] = [
  {
    name: "Analytics",
    route: routes.INDEX_ROUTE,
    icon: <BarChartIcon />,
  },
  {
    name: "Tables",
    route: routes.TABLE_ROUTE,
    icon: <TableViewIcon />,
  },
  {
    name: "Chains",
    route: routes.CHAIN_ROUTE,
    icon: <BackupTableIcon />,
  },
  {
    name: "Firewall",
    route: routes.FIREWALL_ROUTE,
    icon: <LocalFireDepartmentIcon />,
  },
  {
    name: "Nat",
    route: routes.NAT_ROUTE,
    icon: <RouterIcon />,
  },
];
