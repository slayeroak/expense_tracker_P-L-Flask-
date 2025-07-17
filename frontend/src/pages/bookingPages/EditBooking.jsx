// src/pages/bookingPages/EditBooking.jsx
import React, { useState } from 'react'
import { API } from '../../utils/api'

export default function EditBooking() {
  const [bookingId, setBookingId] = useState('')
  const [fields, setFields]       = useState({})
  const [message, setMessage]     = useState('')

  const handleUpdate = async () => {
    try {
      await API.put(`/bookings/${bookingId}`, fields)
      setMessage('Booking updated!')
    } catch {
      setMessage('Update failed.')
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Edit Booking</h2>
      <input
        placeholder="Booking ID"
        value={bookingId}
        onChange={e=>setBookingId(e.target.value)}
        className="border p-2 rounded mb-2"
      />
      {/* Add inputs for fields you want to update */}
      <input
        placeholder="New Event Name"
        onChange={e=>setFields(f=>({...f, event_name: e.target.value}))}
        className="border p-2 rounded mb-2"
      />
      <button onClick={handleUpdate}
        className="bg-yellow-500 text-white px-4 py-2 rounded"
      >
        Save Changes
      </button>
      {message && <p className="mt-2">{message}</p>}
    </div>
  )
}
