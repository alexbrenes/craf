import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import type { AmortizationRow } from '../../lib/amortization/amortization'
import type { Currency } from '../../hooks/useAmortization'
import { CHART_COLORS, makeAxisFmt, TOOLTIP_STYLE } from './amortizationCharts'

interface Props {
  rows: AmortizationRow[]
  currency: Currency
  fmt: (n: number) => string
}

export default function PaymentSplitChart({ rows, currency, fmt }: Props) {
  const axisFmt = makeAxisFmt(currency)

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={rows} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
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
          formatter={(v, name) => [fmt(Number(v)), name]}
          labelFormatter={m => `Mes ${m}`}
          {...TOOLTIP_STYLE}
        />
        <Legend />
        <Area
          type="monotone"
          dataKey="principal"
          stackId="1"
          stroke={CHART_COLORS.principal}
          fill={CHART_COLORS.principal}
          fillOpacity={0.7}
          name="Capital"
        />
        <Area
          type="monotone"
          dataKey="interest"
          stackId="1"
          stroke={CHART_COLORS.interest}
          fill={CHART_COLORS.interest}
          fillOpacity={0.7}
          name="Intereses"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
