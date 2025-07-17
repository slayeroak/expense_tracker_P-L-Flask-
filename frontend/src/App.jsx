// src/App.jsx
import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Dashboard       from './pages/Dashboard'

// Booking pages
import BookingDash     from './pages/bookingPages/BookingDash'
import CreateBooking   from './pages/bookingPages/CreateBooking'
import ListBookings    from './pages/bookingPages/ListBookings'
import EditBooking     from './pages/bookingPages/EditBooking'
import DeleteBooking   from './pages/bookingPages/DeleteBooking'

// Client pages
import ClientDash      from './pages/clientPages/ClientDash'
import ClientList      from './pages/clientPages/ClientList'
import ClientNew       from './pages/clientPages/ClientNew'
import ClientEdit      from './pages/clientPages/ClientEdit'

// Other dashboards
import ExpenseDash     from './pages/expensePages/ExpenseDash'
import ReportDash      from './pages/reportPages/ReportDash'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root → bookings dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Dashboard with nested sections */}
        <Route path="/dashboard" element={<Dashboard />}>

          {/* Bookings Section */}
          <Route path="bookings" element={<BookingDash />}>
            <Route index element={<ListBookings />} />
            <Route path="new"    element={<CreateBooking />} />
            <Route path="edit"   element={<EditBooking />} />
            <Route path="delete" element={<DeleteBooking />} />
          </Route>

          {/* Clients Section */}
          <Route path="clients" element={<ClientDash />}>
            <Route index element={<ClientList />} />
            <Route path="new" element={<ClientNew />} />
            <Route path=":clientId/edit" element={<ClientEdit />} />
          </Route>

          {/* Expenses Section */}
          <Route path="expenses" element={<ExpenseDash />} />

          {/* Reports Section */}
          <Route path="reports" element={<ReportDash />} />

        </Route>

        {/* Shortcut to create a booking outside of Dashboard layout */}
        <Route path="/bookings/new" element={<CreateBooking />} />
      </Routes>
    </BrowserRouter>
  )
}
