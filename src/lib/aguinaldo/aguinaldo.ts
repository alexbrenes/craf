export interface AguinaldoParams {
  /**
   * Gross salary earned in each month of the reference period
   * (Dec 1 – Nov 30). Length is however many months were actually worked,
   * so partial years are handled by passing fewer entries.
   */
  monthlySalaries: number[]
}

export interface AguinaldoResult {
  /** Total gross salary across the reference period. */
  totalEarned: number
  /** Number of months included. */
  monthsWorked: number
  /** The aguinaldo: total earned divided by 12. */
  aguinaldo: number
}

// Aguinaldo (Ley No. 2412): the sum of gross salary earned from Dec 1 to
// Nov 30 is divided by 12 — always 12, even for a partial year, which is
// what makes a partial year proportionally smaller.
export function calculateAguinaldo(params: AguinaldoParams): AguinaldoResult {
  const months = params.monthlySalaries
  const totalEarned = months.reduce((sum, s) => sum + s, 0)

  return {
    totalEarned,
    monthsWorked: months.length,
    aguinaldo: totalEarned / 12,
  }
}
