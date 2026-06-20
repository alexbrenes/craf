import { useState } from 'react'
import { useExchangeLoan } from '../../hooks/useExchangeLoan'
import Tooltip from '../Tooltip/Tooltip'
import CrcPaymentChart from '../charts/CrcPaymentChart'
import '../AmortizationCalculator/AmortizationCalculator.css'

const fmtUsd = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })

const fmtCrc = (n: number) =>
  n.toLocaleString('es-CR', { style: 'currency', currency: 'CRC', maximumFractionDigits: 0 })

const fmtRate = (n: number) => `₡${n.toLocaleString('es-CR', { maximumFractionDigits: 2 })}`

const PAGE_SIZE = 24

export default function ExchangeLoanCalculator() {
  const { form, setField, result } = useExchangeLoan()
  const [page, setPage] = useState(1)
  const [view, setView] = useState<'chart' | 'table'>('chart')

  const totalPages = result ? Math.ceil(result.rows.length / PAGE_SIZE) : 1
  const visibleRows = result
    ? result.rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
    : []

  function handleFieldChange(field: Parameters<typeof setField>[0], value: string) {
    setPage(1)
    setField(field, value)
  }

  // How much the monthly payment grows in colones over the loan's life.
  const paymentGrowthPct =
    result && result.startPaymentCrc > 0
      ? ((result.endPaymentCrc - result.startPaymentCrc) / result.startPaymentCrc) * 100
      : 0

  return (
    <div className="calculator">
      <h1>Préstamo en dólares</h1>
      <p className="subtitle">
        Si ganás en colones pero tu crédito está en dólares, mirá cómo sube tu cuota cuando el colón se devalúa
      </p>

      <div className="inputs">
        <label>
          Monto del préstamo ($)
          <div className="input-wrapper">
            <input
              type="number"
              value={form.principalUsd}
              onChange={e => handleFieldChange('principalUsd', e.target.value)}
              min={0}
              step={1000}
            />
            <Tooltip text="El monto que vas a solicitar, expresado en dólares estadounidenses." />
          </div>
        </label>
        <label>
          Tasa de interés anual (%)
          <div className="input-wrapper">
            <input
              type="number"
              value={form.annualRate}
              onChange={e => handleFieldChange('annualRate', e.target.value)}
              min={0}
              step={0.1}
            />
            <Tooltip text="La tasa anual del crédito en dólares. Los préstamos en dólares suelen tener tasas más bajas que en colones." />
          </div>
        </label>
        <label>
          Plazo (meses)
          <div className="input-wrapper">
            <input
              type="number"
              value={form.termMonths}
              onChange={e => handleFieldChange('termMonths', e.target.value)}
              min={1}
            />
            <Tooltip text="La cantidad de meses del crédito. 240 meses equivale a 20 años, 360 meses a 30 años." />
          </div>
        </label>
        <label>
          Tipo de cambio actual (₡/$)
          <div className="input-wrapper">
            <input
              type="number"
              value={form.startRate}
              onChange={e => handleFieldChange('startRate', e.target.value)}
              min={0}
              step={1}
            />
            <Tooltip text="Cuántos colones cuesta un dólar hoy. Podés consultar el tipo de cambio de venta de tu banco o del BCCR." />
          </div>
        </label>
        <label>
          Devaluación anual del colón (%)
          <div className="input-wrapper">
            <input
              type="number"
              value={form.annualDepreciation}
              onChange={e => handleFieldChange('annualDepreciation', e.target.value)}
              step={0.5}
            />
            <Tooltip text="Cuánto suponés que el colón se debilita frente al dólar cada año. Es un supuesto: el tipo de cambio real puede subir o bajar. Usá un valor negativo si esperás que el colón se fortalezca." />
          </div>
        </label>
      </div>

      {result && (
        <>
          <div className="summary">
            <div className="summary-item">
              <span className="label-row">
                Cuota mensual ($)
                <Tooltip text="El pago fijo en dólares. Este monto no cambia durante todo el crédito." />
              </span>
              <strong>{fmtUsd(result.monthlyPaymentUsd)}</strong>
            </div>
            <div className="summary-item">
              <span className="label-row">
                Cuota hoy (₡)
                <Tooltip text="Lo que pagás este mes en colones, al tipo de cambio actual." />
              </span>
              <strong>{fmtCrc(result.startPaymentCrc)}</strong>
            </div>
            <div className="summary-item">
              <span className="label-row">
                Cuota final (₡)
                <Tooltip text="Lo que pagarías en la última cuota, según la devaluación supuesta. La cuota en dólares es la misma, pero cuesta más colones." />
              </span>
              <strong>{fmtCrc(result.endPaymentCrc)}</strong>
            </div>
            <div className="summary-item">
              <span className="label-row">
                Aumento de la cuota
                <Tooltip text="Cuánto más cara es la cuota en colones al final del crédito comparada con la de hoy." />
              </span>
              <strong>+{paymentGrowthPct.toFixed(1)}%</strong>
            </div>
            <div className="summary-item">
              <span className="label-row">
                Tipo de cambio final
                <Tooltip text="El tipo de cambio proyectado en el último mes, según la devaluación supuesta." />
              </span>
              <strong>{fmtRate(result.endRate)}</strong>
            </div>
            <div className="summary-item">
              <span className="label-row">
                Costo por devaluación
                <Tooltip text="Los colones de más que pagás durante todo el crédito solo por la devaluación, comparado con un tipo de cambio fijo." />
              </span>
              <strong>{fmtCrc(result.exchangeCostCrc)}</strong>
            </div>
          </div>

          <div className="view-toggle">
            <button
              className={view === 'chart' ? 'active' : ''}
              onClick={() => setView('chart')}
            >
              Gráfico
            </button>
            <button
              className={view === 'table' ? 'active' : ''}
              onClick={() => setView('table')}
            >
              Tabla
            </button>
          </div>

          {view === 'chart' ? (
            <div className="charts">
              <div className="chart-card">
                <h2>
                  Cuota mensual en colones
                  <Tooltip text="Cómo crece el monto en colones de tu cuota mensual a medida que el colón se devalúa, aunque la cuota en dólares no cambie." />
                </h2>
                <CrcPaymentChart rows={result.rows} fmtCrc={fmtCrc} />
              </div>
            </div>
          ) : (
            <>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Mes</th>
                      <th>Tipo de cambio</th>
                      <th>Cuota ($)</th>
                      <th>Cuota (₡)</th>
                      <th>Saldo ($)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleRows.map(row => (
                      <tr key={row.month}>
                        <td>{row.month}</td>
                        <td>{fmtRate(row.rate)}</td>
                        <td>{fmtUsd(row.paymentUsd)}</td>
                        <td>{fmtCrc(row.paymentCrc)}</td>
                        <td>{fmtUsd(row.balanceUsd)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                    ← Anterior
                  </button>
                  <span>Página {page} de {totalPages}</span>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                    Siguiente →
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}
