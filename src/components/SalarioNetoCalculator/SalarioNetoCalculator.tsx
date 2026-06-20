import { useSalarioNeto } from '../../hooks/useSalarioNeto'
import { DEFAULT_TAX_BRACKETS_2026, DEFAULT_CCSS_RATE } from '../../lib/salarioNeto/salarioNeto'
import Tooltip from '../Tooltip/Tooltip'
import '../AmortizationCalculator/AmortizationCalculator.css'

const fmtCrc = (n: number) =>
  n.toLocaleString('es-CR', { style: 'currency', currency: 'CRC', maximumFractionDigits: 0 })

const fmtPct = (n: number) => `${n.toFixed(2)}%`

const fmtBracket = (from: number, to: number | null) =>
  to === null
    ? `Más de ${fmtCrc(from)}`
    : `${fmtCrc(from)} – ${fmtCrc(to)}`

export default function SalarioNetoCalculator() {
  const { form, setField, result } = useSalarioNeto()

  return (
    <div className="calculator">
      <h1>Calculadora de Salario Neto</h1>
      <p className="subtitle">
        Estimá tu salario neto después de las deducciones de la CCSS y el impuesto sobre la renta
      </p>

      <div className="inputs">
        <label>
          Salario bruto mensual (₡)
          <div className="input-wrapper">
            <input
              type="number"
              value={form.grossSalary}
              onChange={e => setField('grossSalary', e.target.value)}
              min={0}
              step={50000}
            />
            <Tooltip text="Tu salario mensual antes de cualquier deducción." />
          </div>
        </label>
        <label>
          Deducción CCSS (%)
          <div className="input-wrapper">
            <input type="number" value={DEFAULT_CCSS_RATE} readOnly disabled />
            <Tooltip text="El porcentaje que te rebaja la Caja (CCSS) del salario. Lo fija la ley para el trabajador, por eso no se puede editar." />
          </div>
        </label>
      </div>

      {result && (
        <>
          <div className="summary">
            <div className="summary-item">
              <span className="label-row">
                Salario neto
                <Tooltip text="Lo que recibís después de restar la CCSS y el impuesto sobre la renta." />
              </span>
              <strong>{fmtCrc(result.netSalary)}</strong>
            </div>
            <div className="summary-item">
              <span className="label-row">
                Deducción CCSS
                <Tooltip text="El monto que se va a la Caja por tu seguro social y pensión." />
              </span>
              <strong>{fmtCrc(result.ccss)}</strong>
            </div>
            <div className="summary-item">
              <span className="label-row">
                Impuesto sobre la renta
                <Tooltip text="El impuesto sobre el salario, calculado por tramos progresivos. Solo la parte del salario dentro de cada tramo paga la tasa de ese tramo." />
              </span>
              <strong>{fmtCrc(result.incomeTax)}</strong>
            </div>
            <div className="summary-item">
              <span className="label-row">
                Deducción total
                <Tooltip text="Qué porcentaje de tu salario bruto se va en deducciones." />
              </span>
              <strong>{fmtPct(result.effectiveDeductionRate)}</strong>
            </div>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Tramo (salario bruto)</th>
                  <th>Tasa</th>
                </tr>
              </thead>
              <tbody>
                {DEFAULT_TAX_BRACKETS_2026.map(b => {
                  // The bracket the salary's top colón lands in — the marginal rate.
                  const isActive =
                    result.grossSalary > b.from &&
                    (b.to === null || result.grossSalary <= b.to)
                  return (
                    <tr key={b.from} className={isActive ? 'bracket-active' : ''}>
                      <td style={{ textAlign: 'left' }}>{fmtBracket(b.from, b.to)}</td>
                      <td>{b.rate}%</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <p className="note">
            Los tramos del impuesto sobre la renta y el porcentaje de la CCSS los fija el Gobierno
            y <strong>cambian cada año</strong>. Los tramos mostrados corresponden al período
            fiscal 2026 (Ministerio de Hacienda). Esta es una
            estimación aproximada que no incluye créditos fiscales (por cónyuge o hijos) ni otras
            deducciones particulares.
          </p>
        </>
      )}
    </div>
  )
}
