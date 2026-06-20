import { useAguinaldo } from '../../hooks/useAguinaldo'
import Tooltip from '../Tooltip/Tooltip'
import '../AmortizationCalculator/AmortizationCalculator.css'

const fmtCrc = (n: number) =>
  n.toLocaleString('es-CR', { style: 'currency', currency: 'CRC', maximumFractionDigits: 0 })

export default function AguinaldoCalculator() {
  const { form, setField, result } = useAguinaldo()

  return (
    <div className="calculator">
      <h1>Calculadora de Aguinaldo</h1>
      <p className="subtitle">
        Estimá tu aguinaldo (decimotercer mes), que se paga durante los primeros 20 días de diciembre
      </p>

      <div className="inputs">
        <label>
          Salario bruto mensual (₡)
          <div className="input-wrapper">
            <input
              type="number"
              value={form.monthlySalary}
              onChange={e => setField('monthlySalary', e.target.value)}
              min={0}
              step={10000}
            />
            <Tooltip text="Tu salario bruto mensual (antes de deducciones). Si tu salario varió durante el año, usá el promedio." />
          </div>
        </label>
        <label>
          Meses trabajados
          <div className="input-wrapper">
            <input
              type="number"
              value={form.monthsWorked}
              onChange={e => setField('monthsWorked', e.target.value)}
              min={1}
              max={12}
              step={1}
            />
            <Tooltip text="Cuántos meses trabajaste en el período del aguinaldo (del 1 de diciembre al 30 de noviembre). Si trabajaste todo el año, son 12." />
          </div>
        </label>
      </div>

      {result && (
        <>
          <div className="summary">
            <div className="summary-item">
              <span className="label-row">
                Aguinaldo
                <Tooltip text="El monto que te corresponde recibir. Es la suma de tus salarios del período dividida entre 12." />
              </span>
              <strong>{fmtCrc(result.aguinaldo)}</strong>
            </div>
            <div className="summary-item">
              <span className="label-row">
                Total devengado
                <Tooltip text="La suma de todos los salarios brutos que ganaste durante el período del aguinaldo." />
              </span>
              <strong>{fmtCrc(result.totalEarned)}</strong>
            </div>
            <div className="summary-item">
              <span className="label-row">
                Meses incluidos
                <Tooltip text="Los meses que se tomaron en cuenta para el cálculo." />
              </span>
              <strong>{result.monthsWorked}</strong>
            </div>
          </div>

          <p className="note">
            El aguinaldo no paga cargas sociales ni impuesto sobre la renta, así que recibís el monto completo.
            {result.monthsWorked < 12 &&
              ' Como trabajaste menos de 12 meses, el monto es proporcional al tiempo laborado.'}
          </p>
        </>
      )}
    </div>
  )
}
