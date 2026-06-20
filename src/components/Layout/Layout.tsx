import { NavLink, Outlet } from 'react-router-dom'
import './Layout.css'

const NAV = [
  { to: '/', label: 'Amortización', end: true },
  { to: '/tipo-cambio', label: 'Préstamo en dólares', end: false },
  { to: '/aguinaldo', label: 'Aguinaldo', end: false },
  { to: '/liquidacion', label: 'Liquidación', end: false },
  { to: '/salario-neto', label: 'Salario neto', end: false },
]

export default function Layout() {
  return (
    <div className="layout">
      <header className="nav">
        <span className="brand">craf</span>
        <nav>
          {NAV.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
