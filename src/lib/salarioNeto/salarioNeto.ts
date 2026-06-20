export interface TaxBracket {
  /** Lower bound of this bracket (monthly gross, in colones). */
  from: number
  /** Upper bound, or null for the top open-ended bracket. */
  to: number | null
  /** Marginal rate applied within the bracket, as a percent. */
  rate: number
}

/**
 * Monthly income-tax brackets for salaried work (asalariados, jubilados y
 * pensionados — impuesto sobre la renta del trabajo dependiente). These are
 * set by Hacienda and CHANGE EVERY YEAR — verify against the current decreto
 * before relying on the result.
 * Source: Ministerio de Hacienda, tramos del impuesto sobre la renta 2026.
 */
export const DEFAULT_TAX_BRACKETS_2026: TaxBracket[] = [
  { from: 0, to: 918000, rate: 0 },
  { from: 918000, to: 1347000, rate: 10 },
  { from: 1347000, to: 2364000, rate: 15 },
  { from: 2364000, to: 4727000, rate: 20 },
  { from: 4727000, to: null, rate: 25 },
]

/**
 * Total employee CCSS (Caja) contribution rate, in percent. Set by law.
 * 10.83% for 2026 (the IVM aporte obrero rose from 4.17% to 4.33% effective
 * Jan 1, 2026). Verify against the current rate before relying on the result.
 */
export const DEFAULT_CCSS_RATE = 10.83

export interface SalarioNetoParams {
  /** Monthly gross salary, in colones. */
  grossSalary: number
  /** Employee CCSS rate, in percent. */
  ccssRate: number
  brackets?: TaxBracket[]
}

export interface SalarioNetoResult {
  grossSalary: number
  ccss: number
  incomeTax: number
  netSalary: number
  /** Combined deductions as a percent of gross. */
  effectiveDeductionRate: number
}

// Progressive income tax: each bracket's rate applies only to the portion of
// salary that falls within it.
export function calculateIncomeTax(grossSalary: number, brackets: TaxBracket[]): number {
  let tax = 0
  for (const b of brackets) {
    if (grossSalary <= b.from) break
    const upper = b.to ?? grossSalary
    const taxable = Math.min(grossSalary, upper) - b.from
    if (taxable > 0) tax += taxable * (b.rate / 100)
  }
  return tax
}

export function calculateSalarioNeto(params: SalarioNetoParams): SalarioNetoResult {
  const { grossSalary, ccssRate } = params
  const brackets = params.brackets ?? DEFAULT_TAX_BRACKETS_2026

  const ccss = grossSalary * (ccssRate / 100)
  const incomeTax = calculateIncomeTax(grossSalary, brackets)
  const netSalary = grossSalary - ccss - incomeTax

  return {
    grossSalary,
    ccss,
    incomeTax,
    netSalary,
    effectiveDeductionRate:
      grossSalary > 0 ? ((ccss + incomeTax) / grossSalary) * 100 : 0,
  }
}
