import type { Currency } from '../../hooks/useAmortization'

export const CHART_COLORS = {
  balance: '#2563eb',
  principal: '#16a34a',
  interest: '#dc2626',
} as const

// Shared dark-theme styling for Recharts <Tooltip> popovers.
export const TOOLTIP_STYLE = {
  contentStyle: {
    background: '#161616',
    border: '1px solid #242424',
    borderRadius: 8,
    color: '#f0f0f0',
  },
  labelStyle: { color: '#888' },
} as const

const AXIS_FMT: Record<Currency, { locale: string; currency: string }> = {
  CRC: { locale: 'es-CR', currency: 'CRC' },
  USD: { locale: 'en-US', currency: 'USD' },
}

// Compact axis labels: ₡1.2 M / $1.2K — full precision is reserved for tooltips.
export function makeAxisFmt(currency: Currency) {
  const { locale, currency: code } = AXIS_FMT[currency]
  return (n: number) =>
    n.toLocaleString(locale, {
      style: 'currency',
      currency: code,
      notation: 'compact',
      maximumFractionDigits: 1,
    })
}
