// src/pages/bookingPages/CreateBooking.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate }                from 'react-router-dom'
import { 
  getClients, 
  createClient, 
  createBooking 
} from '../../utils/api'

import FoodCalculatorModal      from '../../components/FoodCostCalculatorModal'
import SuppliesCalculatorModal  from '../../components/SuppliesCostCalculatorModal'
import LaborCalculatorModal     from '../../components/LaborCostCalculatorModal'

export default function CreateBooking() {
  const nav = useNavigate()

  // Booking form state
  const [form, setForm] = useState({
    client_id: '',
    event_name: '',
    event_date: '',
    event_deposit: '',
    event_invoice_total: ''
  })

  // New‑client inline form state
  const [newClient, setNewClient] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    past_events: '',
    notes: ''
  })

  // Whether user chose “new client”
  const isNewClient = form.client_id === 'new'
  
  // Calculators
  const [foodCalc,     setFoodCalc    ] = useState({ total:0, headcount:0, menu:[] })
  const [suppliesCalc, setSuppliesCalc] = useState({ total:0, orders:[] })
  const [laborCalc,    setLaborCalc   ] = useState({ total:0, assignments:[] })

  // Modals
  const [openFood,     setOpenFood    ] = useState(false)
  const [openSupplies, setOpenSupplies] = useState(false)
  const [openLabor,    setOpenLabor   ] = useState(false)

  // Load clients
  const [clients, setClients] = useState([])
  const [loadingClients, setLoadingClients] = useState(true)
  useEffect(() => {
    getClients()
      .then(res => setClients(res.data))
      .catch(() => setClients([]))
      .finally(() => setLoadingClients(false))
  }, [])

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleNewClientChange = e => {
    const { name, value } = e.target
    setNewClient(c => ({ ...c, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()

    let clientId = form.client_id

    // 1) If “new client” selected, create it first
    if (clientId === 'new') {
      try {
        const res = await createClient(newClient)
        clientId = res.data.client_id
      } catch (err) {
        return alert('Failed to create client')
      }
    }

    // 2) Build booking payload
    const payload = {
      client_id: clientId,
      event_name: form.event_name,
      event_date: form.event_date,
      event_deposit: parseFloat(form.event_deposit) || 0,
      event_invoice_total: parseFloat(form.event_invoice_total) || 0,
      food:     { headcount: foodCalc.headcount, menu: foodCalc.menu },
      supplies: suppliesCalc.orders,
      labor:    laborCalc.assignments
    }

    // 3) Create booking
    try {
      await createBooking(payload)
      nav('/dashboard/bookings')
    } catch (err) {
      console.error(err)
      alert('Failed to create booking')
    }
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow rounded-lg mt-10 space-y-6">
      <h1 className="text-2xl font-bold">📝 New Tailgate Booking</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Client selector */}
        {loadingClients ? (
          <p>Loading clients…</p>
        ) : (
          <select
            name="client_id"
            value={form.client_id}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          >
            <option value="">Select client…</option>
            {clients.map(c => (
              <option key={c.client_id} value={c.client_id}>
                {c.first_name} {c.last_name}
              </option>
            ))}
            <option value="new">+ Create New Client</option>
          </select>
        )}

        {/* Inline New‑Client form */}
        {isNewClient && (
          <div className="p-4 bg-gray-50 rounded space-y-2">
            <h2 className="font-semibold">New Client Details</h2>
            {['first_name','last_name','email','phone','past_events','notes'].map(field => (
              field !== 'notes' ? (
                <input
                  key={field}
                  name={field}
                  type={field==='email' ? 'email' : 'text'}
                  placeholder={field.replace('_',' ')}
                  value={newClient[field]}
                  onChange={handleNewClientChange}
                  required={['first_name','last_name','email'].includes(field)}
                  className="w-full border p-2 rounded"
                />
              ) : (
                <textarea
                  key={field}
                  name={field}
                  placeholder="notes"
                  value={newClient.notes}
                  onChange={handleNewClientChange}
                  rows={2}
                  className="w-full border p-2 rounded"
                />
              )
            ))}
          </div>
        )}

        {/* Booking fields */}
        <input
          name="event_name"
          value={form.event_name}
          onChange={handleChange}
          placeholder="Event Name"
          required
          className="w-full border p-2 rounded"
        />
        <input
          name="event_date"
          type="date"
          value={form.event_date}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          name="event_deposit"
          type="number"
          step="0.01"
          value={form.event_deposit}
          onChange={handleChange}
          placeholder="Deposit"
          className="w-full border p-2 rounded"
        />
        <input
          name="event_invoice_total"
          type="number"
          step="0.01"
          value={form.event_invoice_total}
          onChange={handleChange}
          placeholder="Invoice Total"
          className="w-full border p-2 rounded"
        />

        {/* Expense calculator buttons */}
        <button
          type="button"
          onClick={()=>setOpenFood(true)}
          className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600"
        >
          🍔 Food (${foodCalc.total})
        </button>
        <button
          type="button"
          onClick={()=>setOpenSupplies(true)}
          className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600"
        >
          🧂 Supplies (${suppliesCalc.total})
        </button>
        <button
          type="button"
          onClick={()=>setOpenLabor(true)}
          className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600"
        >
          👷 Labor (${laborCalc.total})
        </button>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Save Booking
        </button>
      </form>

      {/* Modals */}
      <FoodCalculatorModal
        isOpen={openFood}
        onClose={()=>setOpenFood(false)}
        onCalculate={setFoodCalc}
      />
      <SuppliesCalculatorModal
        isOpen={openSupplies}
        onClose={()=>setOpenSupplies(false)}
        onCalculate={setSuppliesCalc}
      />
      <LaborCalculatorModal
        isOpen={openLabor}
        onClose={()=>setOpenLabor(false)}
        onCalculate={setLaborCalc}
      />
    </div>
  )
}
