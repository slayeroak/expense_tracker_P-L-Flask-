// src/pages/clientPages/ClientDash.jsx
import React from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'

export default function ClientDash() {
  const { pathname } = useLocation()
  const base = '/dashboard/clients'

  const actions = [
    { to: 'list',   label: 'List Clients', icon: '👥', bg: 'bg-blue-500' },
    { to: 'new',    label: 'New Client',  icon: '➕', bg: 'bg-green-500' },
    { to: 'edit',   label: 'Edit Client', icon: '✏️', bg: 'bg-yellow-500' },
    { to: 'delete', label: 'Delete Client', icon: '🗑️', bg: 'bg-red-500' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">👥 Clients Dashboard</h1>

      {/* Action Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {actions.map(a => {
          const link = `${base}/${a.to}`
          const isActive = pathname === link
          return (
            <Link
              key={a.to}
              to={link}
              className={`
                ${a.bg} text-white p-6 rounded-lg shadow-lg
                flex flex-col items-center justify-center space-y-2
                hover:scale-105 transition
                ${isActive ? 'ring-4 ring-offset-2 ring-indigo-300' : ''}
              `}
            >
              <span className="text-4xl">{a.icon}</span>
              <span className="text-xl font-semibold">{a.label}</span>
            </Link>
          )
        })}
      </div>

      {/* Render the nested client page */}
      <div className="bg-white p-6 rounded shadow">
        <Outlet />
      </div>
    </div>
  )
}
