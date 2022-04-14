type RoutesType = {
  TABLE_ROUTE: string;
  CHAIN_ROUTE: string;
  RULESET_ROUTE: string;
  ADD_TABLE_ROUTE: string;
  ADD_CHAIN_ROUTE: string;
  ADD_RULE_ROUTE: string;
};

const routes: RoutesType = {
  TABLE_ROUTE: "/",
  CHAIN_ROUTE: "/chains",
  RULESET_ROUTE: "/rules",
  ADD_TABLE_ROUTE: "/tables/add",
  ADD_CHAIN_ROUTE: "/chains/add",
  ADD_RULE_ROUTE: "/rules/add",
};

type SidebarType = {
  name: string;
  route: string;
};

const sidebarItems: SidebarType[] = [
  {
    name: "Tables",
    route: routes.TABLE_ROUTE,
  },
  {
    name: "Chains",
    route: routes.CHAIN_ROUTE,
  },
  {
    name: "Ruleset",
    route: routes.RULESET_ROUTE,
  },
];

export { sidebarItems, routes };
