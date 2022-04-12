import { Layout } from 'components/Layout'
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom'
import { NotFound } from 'screen/notfound'
import { Forbidden } from 'screen/forbidden'
import { routes } from 'lib'
import { FilterTable } from 'screen/table'
import { ChainTable } from 'screen/chain'
import { AddRuleset, RulesetTable } from 'screen/ruleset'


const Router: React.VFC = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<FilterTable />} />
          <Route path={routes.CHAIN_ROUTE} element={<ChainTable />} />
          <Route path={routes.RULESET_ROUTE} element={<RulesetTable />} />
          <Route path={routes.ADD_RULE_ROUTE} element={<AddRuleset />} />
        </Route>
        <Route path="/forbidden" element={<Forbidden />} />
        {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
      </Routes>
    </BrowserRouter>
  )
}

export { Router }
