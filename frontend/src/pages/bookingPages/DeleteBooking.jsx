// src/pages/bookingPages/DeleteBooking.jsx
import React, { useState } from 'react'
import { API } from '../../utils/api'

function DeleteBooking() {
  const [bookingId, setBookingId] = useState('')
  const [message, setMessage]     = useState('')

  const handleDelete = async () => {
    try {
      await API.delete(`/bookings/${bookingId}`)
      setMessage('Booking deleted!')
    } catch {
      setMessage('Delete failed.')
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Delete Booking</h2>
      <input
        placeholder="Booking ID"
        value={bookingId}
        onChange={e => setBookingId(e.target.value)}
        className="border p-2 rounded mb-2"
      />
      <button
        onClick={handleDelete}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Delete
      </button>
      {message && <p className="mt-2">{message}</p>}
    </div>
  )
}

export default DeleteBooking
