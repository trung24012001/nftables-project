import { Layout } from "components/Layout";
import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import { NotFound } from "screen/notfound";
import { Forbidden } from "screen/forbidden";
import { routes } from "lib";
import { AddTable, NftTable } from "screen/table";
import { ChainTable } from "screen/chain";
import {
  AddFirewallRule,
  AddNatRule,
  FilterRuleDetail,
  FirewallTable,
  NatRuleDetail,
  NatTable,
  ReturnRuleTable,
} from "screen/ruleset";
import { AddChain } from "screen/chain/AddChain";
import { AnalyticDetail, Analytics } from "screen/analytics";

const Router: React.VFC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Analytics />} />
          <Route path={routes.ANALYTICS_ROUTE} element={<AnalyticDetail />} />
          <Route path={routes.TABLE_ROUTE} element={<NftTable />} />
          <Route path={routes.CHAIN_ROUTE} element={<ChainTable />} />
          <Route path={routes.FIREWALL_ROUTE} element={<FirewallTable />} />
          <Route path={routes.NAT_DETAIL_ROUTE} element={<NatRuleDetail />} />
          <Route path={routes.FIREWALL_DETAIL_ROUTE} element={<FilterRuleDetail />} />
          <Route path={routes.NAT_ROUTE} element={<NatTable />} />
          <Route path={routes.RETURN_ROUTE} element={<ReturnRuleTable />} />
          <Route path={routes.ADD_TABLE_ROUTE} element={<AddTable />} />
          <Route path={routes.ADD_CHAIN_ROUTE} element={<AddChain />} />
          <Route
            path={routes.ADD_FIREWALL_ROUTE}
            element={<AddFirewallRule />}
          />
          <Route path={routes.ADD_NAT_ROUTE} element={<AddNatRule />} />
        </Route>
        <Route path="/forbidden" element={<Forbidden />} />
        {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
      </Routes>
    </BrowserRouter>
  );
};

export { Router };
