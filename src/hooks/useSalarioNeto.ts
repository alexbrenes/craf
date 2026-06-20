import { useState, useMemo, useRef } from 'react'
import {
  calculateSalarioNeto,
  DEFAULT_CCSS_RATE,
  type SalarioNetoResult,
} from '../lib/salarioNeto/salarioNeto'

export interface SalarioNetoForm {
  grossSalary: string
}

const DEFAULTS: SalarioNetoForm = {
  grossSalary: '1000000',
}

const STORAGE_KEY = 'craf:salarioNeto'

function loadForm(): SalarioNetoForm {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? { ...DEFAULTS, ...JSON.parse(saved) } : DEFAULTS
  } catch {
    return DEFAULTS
  }
}

export function useSalarioNeto() {
  const [form, setForm] = useState<SalarioNetoForm>(loadForm)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const result = useMemo<SalarioNetoResult | null>(() => {
    const grossSalary = parseFloat(form.grossSalary)
    if (isNaN(grossSalary) || grossSalary <= 0) return null

    // The employee CCSS rate is fixed by law, not user-editable.
    return calculateSalarioNeto({ grossSalary, ccssRate: DEFAULT_CCSS_RATE })
  }, [form])

  function setField(field: keyof SalarioNetoForm, value: string) {
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
