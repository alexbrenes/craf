export interface AmortizationParams {
  principal: number
  annualRate: number
  termMonths: number
}

export interface AmortizationRow {
  month: number
  payment: number
  principal: number
  interest: number
  balance: number
  extra: number
}

export interface AmortizationSchedule {
  monthlyPayment: number
  totalPayment: number
  totalInterest: number
  rows: AmortizationRow[]
}

export function calculateAmortization(params: AmortizationParams): AmortizationSchedule {
  const { principal, annualRate, termMonths } = params
  const monthlyRate = annualRate / 100 / 12

  const monthlyPayment =
    monthlyRate === 0
      ? principal / termMonths
      : (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
        (Math.pow(1 + monthlyRate, termMonths) - 1)

  const rows: AmortizationRow[] = []
  let balance = principal
  let totalPayment = 0

  for (let month = 1; month <= termMonths; month++) {
    const interest = balance * monthlyRate
    // Last payment may be smaller if rounding left a tiny balance
    const payment = month === termMonths ? balance + interest : monthlyPayment
    const principalPaid = payment - interest
    balance = Math.max(0, balance - principalPaid)
    totalPayment += payment

    rows.push({
      month,
      payment,
      principal: principalPaid,
      interest,
      balance,
      extra: 0,
    })
  }

  return {
    monthlyPayment,
    totalPayment,
    totalInterest: totalPayment - principal,
    rows,
  }
}