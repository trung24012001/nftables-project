import React from "react";
import { routes } from "lib/constant";
import InboxIcon from "@mui/icons-material/MoveToInbox";

export type SidebarType = {
  name: string;
  route: string;
  icon?: React.ReactNode;
};

export const sidebarItems: SidebarType[] = [
  {
    name: "Overview",
    route: routes.OVERVIEW_ROUTE,
    icon: <InboxIcon />,
  },
  {
    name: "Tables",
    route: routes.TABLE_ROUTE,
    icon: <InboxIcon />,
  },
  {
    name: "Chains",
    route: routes.CHAIN_ROUTE,
    icon: <InboxIcon />
  },
  {
    name: "Ruleset",
    route: routes.RULESET_ROUTE,
    icon: <InboxIcon />
  }
];
