type RoutesType = {
  OVERVIEW_ROUTE: string;
  TABLE_ROUTE: string;
  CHAIN_ROUTE: string;
  FIREWALL_ROUTE: string;
  NAT_ROUTE: string;
  ADD_TABLE_ROUTE: string;
  ADD_CHAIN_ROUTE: string;
  ADD_FIREWALL_ROUTE: string;
  ADD_NAT_ROUTE: string;
};

const routes: RoutesType = {
  OVERVIEW_ROUTE: "/",
  TABLE_ROUTE: "/tables",
  CHAIN_ROUTE: "/chains",
  FIREWALL_ROUTE: "/rules/firewall",
  NAT_ROUTE: "/rules/nat",
  ADD_TABLE_ROUTE: "/tables/add",
  ADD_CHAIN_ROUTE: "/chains/add",
  ADD_FIREWALL_ROUTE: "/rules/firewall/add",
  ADD_NAT_ROUTE: "/rules/nat/add",
};

export { routes };
