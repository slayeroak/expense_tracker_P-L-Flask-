import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'

export default function ClientEdit() {
  const { clientId } = useParams()
  const nav = useNavigate()
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    past_events: '',
    notes: '',
  })
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    async function fetchClient() {
      try {
        const res = await axios.get('http://localhost:5001/api/clients/')
        const client = res.data.find(c => c.client_id === clientId)
        if (!client) throw new Error('Not found')
        setForm({
          first_name:  client.first_name  || '',
          last_name:   client.last_name   || '',
          email:       client.email       || '',
          phone:       client.phone       || '',
          past_events: client.past_events || '',
          notes:       client.notes       || '',
        })
      } catch (err) {
        setError('Failed to load client')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchClient()
  }, [clientId])

  const handleChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      await axios.put(
        `http://localhost:5001/api/clients/${clientId}`,
        form
      )
      nav('/clients')
    } catch (err) {
      setError('Failed to update client')
      console.error(err)
    }
  }

  if (loading) return <p className="p-4">Loading client…</p>
  if (error)   return <p className="p-4 text-red-600">{error}</p>

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded-lg mt-10">
      <h1 className="text-2xl font-bold mb-4">✏️ Edit Client</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="first_name"
          value={form.first_name}
          onChange={handleChange}
          placeholder="First name"
          required
          className="w-full border p-2 rounded"
        />
        <input
          name="last_name"
          value={form.last_name}
          onChange={handleChange}
          placeholder="Last name"
          required
          className="w-full border p-2 rounded"
        />
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="w-full border p-2 rounded"
        />
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="w-full border p-2 rounded"
        />
        <input
          name="past_events"
          value={form.past_events}
          onChange={handleChange}
          placeholder="Past events (comma-separated)"
          className="w-full border p-2 rounded"
        />
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          placeholder="Notes"
          className="w-full border p-2 rounded"
          rows={3}
        />
        <div className="flex space-x-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Update
          </button>
          <button
            type="button"
            onClick={() => nav('/clients')}
            className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
