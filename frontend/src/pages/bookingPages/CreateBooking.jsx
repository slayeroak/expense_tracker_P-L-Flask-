import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

import FoodCalculatorModal     from '../../components/FoodCostCalculatorModal'
import SuppliesCalculatorModal from '../../components/SuppliesCostCalculatorModal'
import LaborCalculatorModal    from '../../components/LaborCostCalculatorModal'

export default function CreateBooking() {
  const nav = useNavigate()

  // Basic booking fields
  const [form, setForm] = useState({
    client_id: '',
    event_name: '',
    event_date: '',
    event_deposit: '',
    event_invoice_total: ''
  })

  // Now store full objects for each calculator
  const [foodCalc,     setFoodCalc    ] = useState({ total:0, headcount:0,  menu:[]        })
  const [suppliesCalc, setSuppliesCalc] = useState({ total:0, orders:[]                    })
  const [laborCalc,    setLaborCalc   ] = useState({ total:0, assignments:[]             })

  // Modal open flags
  const [openFood,     setOpenFood    ] = useState(false)
  const [openSupplies, setOpenSupplies] = useState(false)
  const [openLabor,    setOpenLabor   ] = useState(false)

  // Load clients
  const [clients, setClients] = useState([])
  useEffect(() => {
    axios.get('http://localhost:5001/api/clients/')
      .then(r => setClients(r.data))
  }, [])

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    // Build full payload
    const payload = {
      ...form,
      food:     { headcount: foodCalc.headcount, menu: foodCalc.menu },
      supplies: suppliesCalc.orders,
      labor:    laborCalc.assignments,
      // optional: send costs too
      total_event_food_costs:     foodCalc.total,
      total_event_supplies_costs: suppliesCalc.total,
      total_event_labor_costs:    laborCalc.total
    }

    await axios.post('http://localhost:5001/api/bookings/', payload)
    nav('/')
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow rounded-lg mt-10 space-y-4">
      <h1 className="text-2xl font-bold">📝 New Tailgate Booking</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Client select, event_name, event_date, deposit, invoice inputs */}
        <select name="client_id" onChange={handleChange} required className="w-full border p-2 rounded">
          <option value="">Select client…</option>
          {clients.map(c => (
            <option key={c.client_id} value={c.client_id}>
              {c.first_name} {c.last_name}
            </option>
          ))}
        </select>
        <input name="event_name" onChange={handleChange} required placeholder="Event Name" className="w-full border p-2 rounded" />
        <input name="event_date" type="date" onChange={handleChange} required className="w-full border p-2 rounded" />
        <input name="event_deposit" type="number" step="0.01" onChange={handleChange} placeholder="Deposit" className="w-full border p-2 rounded" />
        <input name="event_invoice_total" type="number" step="0.01" onChange={handleChange} placeholder="Invoice Total" className="w-full border p-2 rounded" />

        {/* Calculator buttons */}
        <button type="button" onClick={()=>setOpenFood(true)}
          className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600">
          🍔 Food (${foodCalc.total})
        </button>
        <button type="button" onClick={()=>setOpenSupplies(true)}
          className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600">
          🧂 Supplies (${suppliesCalc.total})
        </button>
        <button type="button" onClick={()=>setOpenLabor(true)}
          className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600">
          👷 Labor (${laborCalc.total})
        </button>

        <button type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
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
