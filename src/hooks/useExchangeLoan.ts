import { useState, useMemo, useRef } from 'react'
import {
  calculateExchangeLoan,
  type ExchangeLoanParams,
  type ExchangeLoanResult,
} from '../lib/exchangeLoan/exchangeLoan'

export interface ExchangeLoanForm {
  principalUsd: string
  annualRate: string
  termMonths: string
  startRate: string
  annualDepreciation: string
}

const DEFAULTS: ExchangeLoanForm = {
  principalUsd: '100000',
  annualRate: '8',
  termMonths: '240',
  startRate: '520',
  annualDepreciation: '4',
}

const STORAGE_KEY = 'craf:exchangeLoan'

function loadForm(): ExchangeLoanForm {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? { ...DEFAULTS, ...JSON.parse(saved) } : DEFAULTS
  } catch {
    return DEFAULTS
  }
}

export function useExchangeLoan() {
  const [form, setForm] = useState<ExchangeLoanForm>(loadForm)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const result = useMemo<ExchangeLoanResult | null>(() => {
    const params: ExchangeLoanParams = {
      principalUsd: parseFloat(form.principalUsd),
      annualRate: parseFloat(form.annualRate),
      termMonths: parseInt(form.termMonths, 10),
      startRate: parseFloat(form.startRate),
      annualDepreciation: parseFloat(form.annualDepreciation),
    }
    if (
      isNaN(params.principalUsd) || params.principalUsd <= 0 ||
      isNaN(params.annualRate) || params.annualRate < 0 ||
      isNaN(params.termMonths) || params.termMonths <= 0 ||
      isNaN(params.startRate) || params.startRate <= 0 ||
      isNaN(params.annualDepreciation)
    ) return null

    return calculateExchangeLoan(params)
  }, [form])

  function setField(field: keyof ExchangeLoanForm, value: string) {
    setForm(prev => {
      const next = { ...prev, [field]: value }
      if (saveTimer.current) clearTimeout(saveTimer.current)
      saveTimer.current = setTimeout(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      }, 500)
      return next
    })
  }

  return { form, setField, result }
}
