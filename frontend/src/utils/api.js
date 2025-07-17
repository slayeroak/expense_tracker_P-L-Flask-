// src/utils/api.js
import axios from 'axios'

// Base Axios instance, reads from VITE_API_URL or falls back to localhost
export const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

/** Bookings CRUD **/
export const getBookings    = ()                 => API.get('/bookings/')
export const getBooking     = id                 => API.get(`/bookings/${id}`)
export const createBooking  = bookingData        => API.post('/bookings/', bookingData)
export const updateBooking  = (id, updateData)  => API.put(`/bookings/${id}`, updateData)
export const deleteBooking  = id                 => API.delete(`/bookings/${id}`)

/** Clients CRUD **/
export const getClients     = ()                 => API.get('/clients/')
export const getClient      = id                 => API.get(`/clients/${id}`)
export const createClient   = clientData         => API.post('/clients/', clientData)
export const updateClient   = (id, clientData)  => API.put(`/clients/${id}`, clientData)
export const deleteClient   = id                 => API.delete(`/clients/${id}`)

/** Expense Calculators **/
export const calculateFood      = payload => API.post('/expenses/calculate/food', payload)
export const calculateSupplies  = payload => API.post('/expenses/calculate/supplies', payload)
export const calculateLabor     = payload => API.post('/expenses/calculate/labor', payload)
