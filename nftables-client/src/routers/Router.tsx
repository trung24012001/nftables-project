import { Layout } from 'components/Layout'
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom'
import { AddRuleset, TableRuleset } from 'screen/ruleset'
import { NotFound } from 'screen/notfound'
import { Forbidden } from 'screen/forbidden'


const Router: React.VFC = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<TableRuleset />} />
          <Route path='/rules/add' element={<AddRuleset />} />
        </Route>
        <Route path="/forbidden" element={<Forbidden />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export { Router }
