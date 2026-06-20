import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import type { AmortizationRow } from '../../lib/amortization/amortization'
import type { Currency } from '../../hooks/useAmortization'
import { CHART_COLORS, makeAxisFmt, TOOLTIP_STYLE } from './amortizationCharts'

interface Props {
  rows: AmortizationRow[]
  currency: Currency
  fmt: (n: number) => string
}

export default function BalanceChart({ rows, currency, fmt }: Props) {
  const axisFmt = makeAxisFmt(currency)

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={rows} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
        <defs>
          <linearGradient id="balanceFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CHART_COLORS.balance} stopOpacity={0.35} />
            <stop offset="100%" stopColor={CHART_COLORS.balance} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#242424" vertical={false} />
        <XAxis
          dataKey="month"
          tickFormatter={m => `${m}`}
          minTickGap={32}
          tick={{ fontSize: 12, fill: '#888' }}
          stroke="#333"
        />
        <YAxis
          tickFormatter={axisFmt}
          width={72}
          tick={{ fontSize: 12, fill: '#888' }}
          stroke="#333"
        />
        <Tooltip
          formatter={(v) => [fmt(Number(v)), 'Saldo']}
          labelFormatter={m => `Mes ${m}`}
          {...TOOLTIP_STYLE}
        />
        <Area
          type="monotone"
          dataKey="balance"
          stroke={CHART_COLORS.balance}
          strokeWidth={2}
          fill="url(#balanceFill)"
          name="Saldo"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
