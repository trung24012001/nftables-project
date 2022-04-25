type RoutesType = {
  OVERVIEW_ROUTE: string;
  TABLE_ROUTE: string;
  CHAIN_ROUTE: string;
  RULESET_ROUTE: string;
  ADD_TABLE_ROUTE: string;
  ADD_CHAIN_ROUTE: string;
  ADD_RULE_ROUTE: string;
};

const routes: RoutesType = {
  OVERVIEW_ROUTE: "/",
  TABLE_ROUTE: "/tables",
  CHAIN_ROUTE: "/chains",
  RULESET_ROUTE: "/rules",
  ADD_TABLE_ROUTE: "/tables/add",
  ADD_CHAIN_ROUTE: "/chains/add",
  ADD_RULE_ROUTE: "/rules/add",
};

export { routes };
