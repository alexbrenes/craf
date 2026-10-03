import { lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'

// Each calculator loads as its own chunk on first navigation. This keeps the
// heavy recharts dependency (only used by Amortization) out of the main bundle.
const AmortizationCalculator = lazy(() => import('./components/AmortizationCalculator/AmortizationCalculator'))
const ExchangeLoanCalculator = lazy(() => import('./components/ExchangeLoanCalculator/ExchangeLoanCalculator'))
const AguinaldoCalculator = lazy(() => import('./components/AguinaldoCalculator/AguinaldoCalculator'))
const LiquidacionCalculator = lazy(() => import('./components/LiquidacionCalculator/LiquidacionCalculator'))
const SalarioNetoCalculator = lazy(() => import('./components/SalarioNetoCalculator/SalarioNetoCalculator'))

// Matches Vite's `base` (now `/` for the custom domain alexbrenes.com).
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
