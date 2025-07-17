// src/pages/bookingPages/ListBookings.jsx
import React, { useState, useEffect } from 'react'
import { API } from '../../utils/api'

export default function ListBookings() {
  const [bookings, setBookings] = useState([])
  useEffect(() => {
    API.get('/bookings/').then(r => setBookings(r.data))
  }, [])

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">All Bookings</h2>
      <table className="w-full table-auto">
        <thead><tr>
          {['Event','Date','Invoice','Total','Profit'].map(h=>(
            <th key={h} className="px-4 py-2 text-left">{h}</th>
          ))}
        </tr></thead>
        <tbody>
          {bookings.map(b=>(
            <tr key={b.booking_id} className="border-t">
              <td className="px-4 py-2">{b.event_name}</td>
              <td className="px-4 py-2">{b.event_date}</td>
              <td className="px-4 py-2">${b.event_invoice_total.toFixed(2)}</td>
              <td className="px-4 py-2">${b.total_expense.toFixed(2)}</td>
              <td className="px-4 py-2">${b.gross_profit.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
