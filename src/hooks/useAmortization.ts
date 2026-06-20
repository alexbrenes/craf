import { useState, useMemo, useRef } from 'react'
import { calculateAmortization, type AmortizationParams, type AmortizationSchedule } from '../lib/amortization/amortization'

export type Currency = 'CRC' | 'USD'

export interface FormState {
  principal: string
  annualRate: string
  termMonths: string
  currency: Currency
}

const DEFAULTS: FormState = {
  principal: '50000000',
  annualRate: '12',
  termMonths: '240',
  currency: 'CRC',
}

const STORAGE_KEY = 'craf:amortization'

function loadForm(): FormState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? { ...DEFAULTS, ...JSON.parse(saved) } : DEFAULTS
  } catch {
    return DEFAULTS
  }
}

export function useAmortization() {
  const [form, setForm] = useState<FormState>(loadForm)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const schedule = useMemo<AmortizationSchedule | null>(() => {
    const params: AmortizationParams = {
      principal: parseFloat(form.principal),
      annualRate: parseFloat(form.annualRate),
      termMonths: parseInt(form.termMonths, 10),
    }
    if (
      isNaN(params.principal) || params.principal <= 0 ||
      isNaN(params.annualRate) || params.annualRate < 0 ||
      isNaN(params.termMonths) || params.termMonths <= 0
    ) return null

    return calculateAmortization(params)
  }, [form])

  function setField(field: keyof FormState, value: string) {
    setForm(prev => {
      const next = { ...prev, [field]: value }
      if (saveTimer.current) clearTimeout(saveTimer.current)
      saveTimer.current = setTimeout(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      }, 500)
      return next
    })
  }

  return { form, setField, schedule }
}
