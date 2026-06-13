import { useState } from 'react'
import './Tooltip.css'

interface TooltipProps {
  text: string
}

export default function Tooltip({ text }: TooltipProps) {
  const [visible, setVisible] = useState(false)

  return (
    <span className="tooltip-wrapper">
      <button
        className="tooltip-trigger"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        type="button"
        aria-label="Más información"
      >
        ?
      </button>
      {visible && <span className="tooltip-box" role="tooltip">{text}</span>}
    </span>
  )
}
