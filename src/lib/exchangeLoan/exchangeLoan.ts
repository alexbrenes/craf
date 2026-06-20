import { calculateAmortization } from '../amortization/amortization'

export interface ExchangeLoanParams {
  /** Loan principal, denominated in USD. */
  principalUsd: number
  annualRate: number
  termMonths: number
  /** Current exchange rate: colones per 1 USD. */
  startRate: number
  /** Assumed annual depreciation of the colón vs. USD, in percent. */
  annualDepreciation: number
}

export interface ExchangeLoanRow {
  month: number
  /** Exchange rate (CRC per USD) projected for this month. */
  rate: number
  /** Fixed monthly payment in USD. */
  paymentUsd: number
  /** That same payment converted to colones at this month's rate. */
  paymentCrc: number
  /** Remaining balance in USD. */
  balanceUsd: number
}

export interface ExchangeLoanResult {
  monthlyPaymentUsd: number
  /** First month's payment in colones, at the starting rate. */
  startPaymentCrc: number
  /** Last month's payment in colones, at the projected ending rate. */
  endPaymentCrc: number
  /** Projected exchange rate in the final month. */
  endRate: number
  /** Total of all payments in USD. */
  totalPaymentUsd: number
  /** Total of all payments in colones at projected rates. */
  totalPaymentCrc: number
  /** What the total would have cost in colones if the rate never moved. */
  totalPaymentCrcFlat: number
  /** Extra colones paid purely due to depreciation (>= 0 when colón weakens). */
  exchangeCostCrc: number
  rows: ExchangeLoanRow[]
}

// Convert an annual depreciation rate into a per-month compounding factor.
function monthlyDepreciationFactor(annualDepreciation: number): number {
  return Math.pow(1 + annualDepreciation / 100, 1 / 12)
}

export function calculateExchangeLoan(params: ExchangeLoanParams): ExchangeLoanResult {
  const { principalUsd, annualRate, termMonths, startRate, annualDepreciation } = params

  // The USD side is an ordinary amortization — reuse the existing engine.
  const usd = calculateAmortization({
    principal: principalUsd,
    annualRate,
    termMonths,
  })

  const factor = monthlyDepreciationFactor(annualDepreciation)

  const rows: ExchangeLoanRow[] = []
  let totalPaymentCrc = 0

  for (const r of usd.rows) {
    // Month 1 uses the starting rate; each later month compounds depreciation.
    const rate = startRate * Math.pow(factor, r.month - 1)
    const paymentCrc = r.payment * rate
    totalPaymentCrc += paymentCrc

    rows.push({
      month: r.month,
      rate,
      paymentUsd: r.payment,
      paymentCrc,
      balanceUsd: r.balance,
    })
  }

  const endRate = rows.length ? rows[rows.length - 1].rate : startRate
  const totalPaymentCrcFlat = usd.totalPayment * startRate

  return {
    monthlyPaymentUsd: usd.monthlyPayment,
    startPaymentCrc: rows.length ? rows[0].paymentCrc : 0,
    endPaymentCrc: rows.length ? rows[rows.length - 1].paymentCrc : 0,
    endRate,
    totalPaymentUsd: usd.totalPayment,
    totalPaymentCrc,
    totalPaymentCrcFlat,
    exchangeCostCrc: totalPaymentCrc - totalPaymentCrcFlat,
    rows,
  }
}
