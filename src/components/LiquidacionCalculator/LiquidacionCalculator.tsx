import { useLiquidacion } from '../../hooks/useLiquidacion'
import Tooltip from '../Tooltip/Tooltip'
import '../AmortizationCalculator/AmortizationCalculator.css'

const fmtCrc = (n: number) =>
  n.toLocaleString('es-CR', { style: 'currency', currency: 'CRC', maximumFractionDigits: 0 })

const fmtDays = (n: number) => `${n.toLocaleString('es-CR', { maximumFractionDigits: 2 })} días`

export default function LiquidacionCalculator() {
  const { form, setField, result } = useLiquidacion()

  return (
    <div className="calculator">
      <h1>Calculadora de Liquidación</h1>
      <p className="subtitle">
        Estimá tus prestaciones laborales al terminar una relación de trabajo
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
            <Tooltip text="El promedio de tu salario bruto de los últimos 6 meses. Si tu salario es fijo, es ese monto." />
          </div>
        </label>
        <label>
          Años trabajados
          <div className="input-wrapper">
            <input
              type="number"
              value={form.years}
              onChange={e => setField('years', e.target.value)}
              min={0}
              step={1}
            />
            <Tooltip text="Años completos de trabajo continuo con el mismo patrono." />
          </div>
        </label>
        <label>
          Meses adicionales
          <div className="input-wrapper">
            <input
              type="number"
              value={form.months}
              onChange={e => setField('months', e.target.value)}
              min={0}
              max={11}
              step={1}
            />
            <Tooltip text="Meses completos trabajados además de los años. Por ejemplo, 3 años y 7 meses." />
          </div>
        </label>
        <label>
          Meses desde el último aguinaldo
          <div className="input-wrapper">
            <input
              type="number"
              value={form.monthsSinceAguinaldo}
              onChange={e => setField('monthsSinceAguinaldo', e.target.value)}
              min={0}
              max={12}
              step={1}
            />
            <Tooltip text="Meses trabajados desde el 1 de diciembre (cuando arranca el período del aguinaldo). Se usa para el aguinaldo proporcional." />
          </div>
        </label>
        <label>
          Días de vacaciones acumulados
          <div className="input-wrapper">
            <input
              type="number"
              value={form.vacationDays}
              onChange={e => setField('vacationDays', e.target.value)}
              min={0}
              step={1}
            />
            <Tooltip text="Días de vacaciones que no has disfrutado. Se acumulan a razón de 1 día por mes trabajado (mínimo de ley)." />
          </div>
        </label>
        <label>
          Tipo de terminación
          <div className="input-wrapper">
            <select
              value={form.withEmployerLiability ? 'sin-causa' : 'renuncia'}
              onChange={e => setField('withEmployerLiability', e.target.value === 'sin-causa')}
            >
              <option value="sin-causa">Despido sin justa causa</option>
              <option value="renuncia">Renuncia / despido con causa</option>
            </select>
            <Tooltip text="El preaviso y la cesantía solo los paga el patrono cuando te despide sin justa causa. Si renunciás o te despiden con causa, solo recibís aguinaldo y vacaciones proporcionales." />
          </div>
        </label>
      </div>

      {result && (
        <>
          <div className="summary">
            <div className="summary-item">
              <span className="label-row">
                Total a recibir
                <Tooltip text="La suma de todos los rubros de tu liquidación." />
              </span>
              <strong>{fmtCrc(result.total)}</strong>
            </div>
            <div className="summary-item">
              <span className="label-row">
                Preaviso
                <Tooltip text="Indemnización por falta de aviso previo (art. 28). Solo aplica en despido sin justa causa." />
              </span>
              <strong>{fmtCrc(result.preaviso)}</strong>
            </div>
            <div className="summary-item">
              <span className="label-row">
                Cesantía
                <Tooltip text="Auxilio de cesantía (art. 29), según los años trabajados, con un tope de los últimos 8 años. Solo aplica en despido sin justa causa." />
              </span>
              <strong>{fmtCrc(result.cesantia)}</strong>
            </div>
            <div className="summary-item">
              <span className="label-row">
                Aguinaldo proporcional
                <Tooltip text="La parte del aguinaldo correspondiente a los meses trabajados desde el último diciembre." />
              </span>
              <strong>{fmtCrc(result.aguinaldoProporcional)}</strong>
            </div>
            <div className="summary-item">
              <span className="label-row">
                Vacaciones
                <Tooltip text="El pago de los días de vacaciones acumulados y no disfrutados." />
              </span>
              <strong>{fmtCrc(result.vacaciones)}</strong>
            </div>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Rubro</th>
                  <th>Días</th>
                  <th>Monto</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Preaviso</td>
                  <td>{result.preavisoDays ? fmtDays(result.preavisoDays) : '—'}</td>
                  <td>{fmtCrc(result.preaviso)}</td>
                </tr>
                <tr>
                  <td>Cesantía</td>
                  <td>{result.cesantiaDays ? fmtDays(result.cesantiaDays) : '—'}</td>
                  <td>{fmtCrc(result.cesantia)}</td>
                </tr>
                <tr>
                  <td>Aguinaldo proporcional</td>
                  <td>—</td>
                  <td>{fmtCrc(result.aguinaldoProporcional)}</td>
                </tr>
                <tr>
                  <td>Vacaciones</td>
                  <td>{form.vacationDays ? fmtDays(parseFloat(form.vacationDays)) : '—'}</td>
                  <td>{fmtCrc(result.vacaciones)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="note">
            Estimación basada en el Código de Trabajo (arts. 28 y 29). Es una guía aproximada;
            el monto final puede variar según tu caso particular. El salario diario se calcula
            sobre una base de 30 días.
          </p>
        </>
      )}
    </div>
  )
}
