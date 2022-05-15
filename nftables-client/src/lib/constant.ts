type RoutesType = {
  INDEX_ROUTE: string;
  TABLE_ROUTE: string;
  CHAIN_ROUTE: string;
  FIREWALL_ROUTE: string;
  FIREWALL_DETAIL_ROUTE: string;
  NAT_ROUTE: string;
  NAT_DETAIL_ROUTE: string;
  RETURN_ROUTE: string;
  ANALYTICS_ROUTE: string;
  ADD_TABLE_ROUTE: string;
  ADD_CHAIN_ROUTE: string;
  ADD_FIREWALL_ROUTE: string;
  ADD_NAT_ROUTE: string;
};

const routes: RoutesType = {
  INDEX_ROUTE: "/",
  TABLE_ROUTE: "/tables",
  CHAIN_ROUTE: "/chains",
  FIREWALL_ROUTE: "/rules/filter",
  FIREWALL_DETAIL_ROUTE: "/rules/filter/detail",
  NAT_ROUTE: "/rules/nat",
  NAT_DETAIL_ROUTE: "/rules/nat/detail",
  RETURN_ROUTE: "/rules/return",
  ANALYTICS_ROUTE: "/analytics",
  ADD_TABLE_ROUTE: "/tables/add",
  ADD_CHAIN_ROUTE: "/chains/add",
  ADD_FIREWALL_ROUTE: "/rules/filter/add",
  ADD_NAT_ROUTE: "/rules/nat/add",
};

export { routes };
