import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import AmortizationCalculator from './components/AmortizationCalculator/AmortizationCalculator'
import ExchangeLoanCalculator from './components/ExchangeLoanCalculator/ExchangeLoanCalculator'
import AguinaldoCalculator from './components/AguinaldoCalculator/AguinaldoCalculator'
import LiquidacionCalculator from './components/LiquidacionCalculator/LiquidacionCalculator'
import SalarioNetoCalculator from './components/SalarioNetoCalculator/SalarioNetoCalculator'

// Matches Vite's `base` so routing works under the GitHub Pages /craf/ path.
const BASENAME = import.meta.env.BASE_URL

export default function App() {
  return (
    <BrowserRouter basename={BASENAME}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<AmortizationCalculator />} />
          <Route path="tipo-cambio" element={<ExchangeLoanCalculator />} />
          <Route path="aguinaldo" element={<AguinaldoCalculator />} />
          <Route path="liquidacion" element={<LiquidacionCalculator />} />
          <Route path="salario-neto" element={<SalarioNetoCalculator />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
