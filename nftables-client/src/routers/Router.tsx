import { Layout } from "components/Layout";
import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import { NotFound } from "screen/notfound";
import { Forbidden } from "screen/forbidden";
import { routes } from "lib";
import { AddTable, NftTable } from "screen/table";
import { ChainTable } from "screen/chain";
import { AddRule, RulesetTable } from "screen/ruleset";
import { AddChain } from "screen/chain/AddChain";

const Router: React.VFC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<NftTable />} />
          <Route path={routes.CHAIN_ROUTE} element={<ChainTable />} />
          <Route path={routes.RULESET_ROUTE} element={<RulesetTable />} />
          <Route path={routes.ADD_TABLE_ROUTE} element={<AddTable />} />
          <Route path={routes.ADD_CHAIN_ROUTE} element={<AddChain />} />
          <Route path={routes.ADD_RULE_ROUTE} element={<AddRule />} />
        </Route>
        <Route path="/forbidden" element={<Forbidden />} />
        {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
      </Routes>
    </BrowserRouter>
  );
};

export { Router };
