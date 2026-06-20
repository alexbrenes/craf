import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import type { ExchangeLoanRow } from '../../lib/exchangeLoan/exchangeLoan'
import { makeAxisFmt, TOOLTIP_STYLE } from './amortizationCharts'

interface Props {
  rows: ExchangeLoanRow[]
  /** Formats a colón amount for the tooltip. */
  fmtCrc: (n: number) => string
}

const COLOR = '#d97706'

export default function CrcPaymentChart({ rows, fmtCrc }: Props) {
  const axisFmt = makeAxisFmt('CRC')

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={rows} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
        <defs>
          <linearGradient id="crcPaymentFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={COLOR} stopOpacity={0.35} />
            <stop offset="100%" stopColor={COLOR} stopOpacity={0} />
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
          formatter={(v) => [fmtCrc(Number(v)), 'Cuota en colones']}
          labelFormatter={m => `Mes ${m}`}
          {...TOOLTIP_STYLE}
        />
        <Area
          type="monotone"
          dataKey="paymentCrc"
          stroke={COLOR}
          strokeWidth={2}
          fill="url(#crcPaymentFill)"
          name="Cuota en colones"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
