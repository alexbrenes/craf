import { useState, useMemo, useRef } from 'react'
import { calculateLiquidacion, type LiquidacionResult } from '../lib/liquidacion/liquidacion'

export interface LiquidacionForm {
  monthlySalary: string
  years: string
  months: string
  withEmployerLiability: boolean
  monthsSinceAguinaldo: string
  vacationDays: string
}

const DEFAULTS: LiquidacionForm = {
  monthlySalary: '600000',
  years: '3',
  months: '0',
  withEmployerLiability: true,
  monthsSinceAguinaldo: '6',
  vacationDays: '12',
}

const STORAGE_KEY = 'craf:liquidacion'

function loadForm(): LiquidacionForm {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? { ...DEFAULTS, ...JSON.parse(saved) } : DEFAULTS
  } catch {
    return DEFAULTS
  }
}

export function useLiquidacion() {
  const [form, setForm] = useState<LiquidacionForm>(loadForm)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const result = useMemo<LiquidacionResult | null>(() => {
    const monthlySalary = parseFloat(form.monthlySalary)
    const years = parseInt(form.years, 10)
    const months = parseInt(form.months, 10)
    const monthsSinceAguinaldo = parseFloat(form.monthsSinceAguinaldo)
    const vacationDays = parseFloat(form.vacationDays)
    if (
      isNaN(monthlySalary) || monthlySalary <= 0 ||
      isNaN(years) || years < 0 ||
      isNaN(months) || months < 0 || months > 11 ||
      (years === 0 && months === 0) ||
      isNaN(monthsSinceAguinaldo) || monthsSinceAguinaldo < 0 || monthsSinceAguinaldo > 12 ||
      isNaN(vacationDays) || vacationDays < 0
    ) return null

    return calculateLiquidacion({
      monthlySalary,
      years,
      months,
      withEmployerLiability: form.withEmployerLiability,
      monthsSinceAguinaldo,
      vacationDays,
    })
  }, [form])

  function setField<K extends keyof LiquidacionForm>(field: K, value: LiquidacionForm[K]) {
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
