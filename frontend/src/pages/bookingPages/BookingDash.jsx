// src/pages/bookingPages/BookingDash.jsx
import React from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'

export default function BookingDash() {
  const { pathname } = useLocation()
  const base = '/dashboard/bookings'

  const actions = [
    { to: 'new',   label: 'Create Booking', icon: '➕', bg: 'bg-green-500' },
    { to: 'list',  label: 'View Bookings',  icon: '📋', bg: 'bg-blue-500' },
    { to: 'edit',  label: 'Edit Booking',  icon: '✏️', bg: 'bg-yellow-500' },
    { to: 'delete',label: 'Delete Booking',icon: '🗑️', bg: 'bg-red-500' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">📋 Bookings Dashboard</h1>

      {/* Action Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {actions.map(a => {
          const link = `${base}/${a.to}`
          const isActive = pathname === link
          return (
            <Link key={a.to} to={link}
              className={`
                ${a.bg} text-white p-6 rounded-lg shadow-lg
                flex flex-col items-center justify-center space-y-2
                hover:scale-105 transition ${isActive ? 'ring-4 ring-offset-2 ring-indigo-300' : ''}
              `}
            >
              <span className="text-4xl">{a.icon}</span>
              <span className="text-xl font-semibold">{a.label}</span>
            </Link>
          )
        })}
      </div>

      {/* Render selected subpage */}
      <div className="bg-white p-6 rounded shadow">
        <Outlet />
      </div>
    </div>
  )
}
