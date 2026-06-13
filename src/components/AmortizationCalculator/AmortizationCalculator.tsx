import { useState } from 'react'
import { useAmortization } from '../../hooks/useAmortization'
import Tooltip from '../Tooltip/Tooltip'
import './AmortizationCalculator.css'

const fmtCRC = (n: number) =>
  n.toLocaleString('es-CR', { style: 'currency', currency: 'CRC', maximumFractionDigits: 0 })

const fmtPct = (n: number) => `${n.toFixed(2)}%`

const PAGE_SIZE = 24

export default function AmortizationCalculator() {
  const { form, setField, schedule } = useAmortization()
  const [page, setPage] = useState(1)

  const totalPages = schedule ? Math.ceil(schedule.rows.length / PAGE_SIZE) : 1
  const visibleRows = schedule
    ? schedule.rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
    : []

  function handleFieldChange(field: Parameters<typeof setField>[0], value: string) {
    setPage(1)
    setField(field, value)
  }

  return (
    <div className="calculator">
      <h1>Calculadora de Amortización</h1>
      <p className="subtitle">Simulá tu crédito en colones costarricenses</p>

      <div className="inputs">
        <label>
          Monto del préstamo (₡)
          <div className="input-wrapper">
            <input
              type="number"
              value={form.principal}
              onChange={e => handleFieldChange('principal', e.target.value)}
              min={0}
              step={100000}
            />
            <Tooltip text="El monto total que vas a solicitar al banco. Por ejemplo, el precio de la casa menos la prima que vas a dar." />
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
            <Tooltip text="El porcentaje que cobra el banco por prestarte el dinero, expresado al año. En Costa Rica suele estar entre el 10% y el 15% en colones." />
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
            <Tooltip text="La cantidad de meses en los que vas a pagar el crédito. 240 meses equivale a 20 años, 360 meses a 30 años." />
          </div>
        </label>
      </div>

      {schedule && (
        <>
          <div className="summary">
            <div className="summary-item">
              <span className="label-row">
                Cuota mensual
                <Tooltip text="El pago fijo que hacés cada mes durante todo el plazo del crédito. Incluye capital e intereses." />
              </span>
              <strong>{fmtCRC(schedule.monthlyPayment)}</strong>
            </div>
            <div className="summary-item">
              <span className="label-row">
                Total a pagar
                <Tooltip text="La suma de todas las cuotas al final del crédito. Incluye el monto original más todos los intereses." />
              </span>
              <strong>{fmtCRC(schedule.totalPayment)}</strong>
            </div>
            <div className="summary-item">
              <span className="label-row">
                Total intereses
                <Tooltip text="Lo que le pagás al banco por encima del monto que pediste prestado. Es la diferencia entre el total a pagar y el monto original." />
              </span>
              <strong>{fmtCRC(schedule.totalInterest)}</strong>
            </div>
            <div className="summary-item">
              <span className="label-row">
                Costo financiero
                <Tooltip text="Qué porcentaje del total pagado corresponde a intereses. Entre más bajo, mejor condición tiene el crédito." />
              </span>
              <strong>{fmtPct((schedule.totalInterest / schedule.totalPayment) * 100)}</strong>
            </div>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Mes</th>
                  <th>Cuota</th>
                  <th>Capital</th>
                  <th>Intereses</th>
                  <th>Saldo</th>
                </tr>
              </thead>
              <tbody>
                {visibleRows.map(row => (
                  <tr key={row.month}>
                    <td>{row.month}</td>
                    <td>{fmtCRC(row.payment)}</td>
                    <td>{fmtCRC(row.principal)}</td>
                    <td>{fmtCRC(row.interest)}</td>
                    <td>{fmtCRC(row.balance)}</td>
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
    </div>
  )
}
