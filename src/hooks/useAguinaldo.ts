import { useState, useMemo, useRef } from 'react'
import { calculateAguinaldo, type AguinaldoResult } from '../lib/aguinaldo/aguinaldo'

export interface AguinaldoForm {
  monthlySalary: string
  monthsWorked: string
}

const DEFAULTS: AguinaldoForm = {
  monthlySalary: '600000',
  monthsWorked: '12',
}

const STORAGE_KEY = 'craf:aguinaldo'

function loadForm(): AguinaldoForm {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? { ...DEFAULTS, ...JSON.parse(saved) } : DEFAULTS
  } catch {
    return DEFAULTS
  }
}

export function useAguinaldo() {
  const [form, setForm] = useState<AguinaldoForm>(loadForm)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const result = useMemo<AguinaldoResult | null>(() => {
    const monthlySalary = parseFloat(form.monthlySalary)
    const monthsWorked = parseInt(form.monthsWorked, 10)
    if (
      isNaN(monthlySalary) || monthlySalary <= 0 ||
      isNaN(monthsWorked) || monthsWorked <= 0 || monthsWorked > 12
    ) return null

    // Constant salary across the worked months — the common case.
    const monthlySalaries = Array(monthsWorked).fill(monthlySalary)
    return calculateAguinaldo({ monthlySalaries })
  }, [form])

  function setField(field: keyof AguinaldoForm, value: string) {
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
