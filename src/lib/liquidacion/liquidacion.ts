export interface LiquidacionParams {
  /** Average gross monthly salary (last 6 months), in colones. */
  monthlySalary: number
  /** Completed years of continuous employment. */
  years: number
  /** Additional completed months beyond the full years (0–11). */
  months: number
  /** Whether the employer owes preaviso + cesantía (despido sin justa causa). */
  withEmployerLiability: boolean
  /** Months of salary earned since the last aguinaldo (Dec 1), for the proportional aguinaldo. */
  monthsSinceAguinaldo: number
  /** Accrued, unused vacation days. */
  vacationDays: number
}

export interface LiquidacionResult {
  dailySalary: number
  /** Total completed months of service. */
  totalMonths: number
  preavisoDays: number
  preaviso: number
  cesantiaDays: number
  cesantia: number
  aguinaldoProporcional: number
  vacaciones: number
  total: number
}

const DAYS_PER_MONTH = 30

// Preaviso (Código de Trabajo art. 28): notice — or its cash equivalent — owed
// by length of service.
function preavisoDays(totalMonths: number): number {
  if (totalMonths < 3) return 0
  if (totalMonths < 6) return 7 // 1 semana
  if (totalMonths < 12) return 15
  return 30 // 1 mes
}

// Cesantía table (Código de Trabajo art. 29): days of salary owed *per year*,
// keyed by completed years of service. Years 7–9 peak at 22; the rate then
// tapers, which is the table's deliberate design.
function cesantiaDaysPerYear(years: number): number {
  switch (years) {
    case 1: return 19.5
    case 2: return 20
    case 3: return 20.5
    case 4: return 21
    case 5: return 21.24
    case 6: return 21.5
    case 7:
    case 8:
    case 9: return 22
    case 10: return 21.5
    case 11: return 21
    case 12: return 20.5
    default: return 20 // 13 años y siguientes
  }
}

// Total cesantía days. Under a year: a flat 7 (3–6 mo) or 14 (6–12 mo) days.
// From a year on: the per-year rate times the years of service, with both the
// full years and the leftover months capped at the last 8 years (art. 29.d).
function cesantiaDays(years: number, months: number): number {
  const totalMonths = years * 12 + months
  if (totalMonths < 3) return 0
  if (totalMonths < 6) return 7
  if (totalMonths < 12) return 14

  const rate = cesantiaDaysPerYear(years)
  const cappedYears = Math.min(years, 8)
  // Only credit the leftover months while still under the 8-year cap.
  const cappedMonths = years < 8 ? months : 0
  return rate * cappedYears + (rate / 12) * cappedMonths
}

export function calculateLiquidacion(params: LiquidacionParams): LiquidacionResult {
  const {
    monthlySalary,
    years,
    months,
    withEmployerLiability,
    monthsSinceAguinaldo,
    vacationDays,
  } = params

  const dailySalary = monthlySalary / DAYS_PER_MONTH
  const totalMonths = years * 12 + months

  // Preaviso and cesantía are only owed when the employer terminates without
  // just cause; the proportional aguinaldo and vacation are always owed.
  const pDays = withEmployerLiability ? preavisoDays(totalMonths) : 0
  const cDays = withEmployerLiability ? cesantiaDays(years, months) : 0

  const preaviso = pDays * dailySalary
  const cesantia = cDays * dailySalary
  const aguinaldoProporcional = (monthlySalary * monthsSinceAguinaldo) / 12
  const vacaciones = vacationDays * dailySalary

  return {
    dailySalary,
    totalMonths,
    preavisoDays: pDays,
    preaviso,
    cesantiaDays: cDays,
    cesantia,
    aguinaldoProporcional,
    vacaciones,
    total: preaviso + cesantia + aguinaldoProporcional + vacaciones,
  }
}
