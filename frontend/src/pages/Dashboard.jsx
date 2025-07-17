import React from 'react'
import { Link, Outlet } from 'react-router-dom'

export default function Dashboard() {
  const cards = [
    { to: 'bookings', label: 'Bookings',     icon: '📋', color: 'from-blue-400 to-blue-600' },
    { to: 'clients',  label: 'Clients',      icon: '👥', color: 'from-purple-400 to-purple-600' },
    { to: 'expenses', label: 'Expenses',     icon: '💰', color: 'from-yellow-400 to-yellow-600' },
    { to: 'reports',  label: 'Reports',      icon: '📈', color: 'from-green-400 to-green-600' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">📊 Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {cards.map(c => (
          <Link
            key={c.to}
            to={c.to}
            className={`
              bg-gradient-to-br ${c.color}
              text-white p-6 rounded-lg shadow-lg
              flex flex-col items-center justify-center
              hover:scale-105 transition-transform
            `}
          >
            <span className="text-4xl mb-2">{c.icon}</span>
            <span className="text-xl font-semibold">{c.label}</span>
          </Link>
        ))}
      </div>

      {/* Renders the selected sub‑dashboard */}
      <div className="mt-12">
        <Outlet />
      </div>
    </div>
  )
}
