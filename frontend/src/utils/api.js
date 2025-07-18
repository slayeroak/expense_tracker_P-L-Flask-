import axios from 'axios'

export const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api'
})

// Bookings
export const getBookings   = () => API.get('/bookings/')
export const createBooking = b  => API.post('/bookings/', b)

// Clients
export const getClients    = () => API.get('/clients/')
export const createClient  = c  => API.post('/clients/', c)
export const updateClient  = (id,c)=> API.put(`/clients/${id}`, c)
export const deleteClient  = id  => API.delete(`/clients/${id}`)

// Food
export const getFoodItems     = ()      => API.get('/expenses/food')
export const addFoodItem      = f       => API.post('/expenses/food', f)
export const updateFoodItem   = (item,f)=> API.put(`/expenses/food/${item}`, f)
export const deleteFoodItem   = item    => API.delete(`/expenses/food/${item}`)

// Supplies
export const getSuppliesItems   = ()        => API.get('/expenses/supplies')
export const addSupplyItem      = s         => API.post('/expenses/supplies', s)
export const updateSupplyItem   = (item,s)  => API.put(`/expenses/supplies/${item}`, s)
export const deleteSupplyItem   = item      => API.delete(`/expenses/supplies/${item}`)

// Labor
export const getLaborItems     = ()            => API.get('/expenses/labor')
export const addLaborItem      = l             => API.post('/expenses/labor', l)
export const updateLaborItem   = (r,e,l)       => API.put(`/expenses/labor/${r}/${e}`, l)
export const deleteLaborItem   = (r,e)         => API.delete(`/expenses/labor/${r}/${e}`)

// Calculators
export const calculateFood     = payload => API.post('/expenses/calculate/food', payload)
export const calculateSupplies = payload => API.post('/expenses/calculate/supplies', payload)
export const calculateLabor    = payload => API.post('/expenses/calculate/labor', payload)
