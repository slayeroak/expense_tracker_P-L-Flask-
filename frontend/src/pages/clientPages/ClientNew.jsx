// src/pages/clientPages/ClientNew.jsx
import React, { useState } from 'react'
import { useNavigate }      from 'react-router-dom'
import { API }              from '../../utils/api'   // ← your axios instance

export default function ClientNew() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    first_name:   '',
    last_name:    '',
    email:        '',
    phone:        '',
    past_events:  '',
    notes:        '',
  })
  const [error, setError] = useState(null)

  const handleChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      await API.post('/clients/', form)
      // Redirect back into the nested clients dashboard
      navigate('/dashboard/clients')
    } catch (err) {
      console.error(err)
      setError('Failed to create client')
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded-lg mt-10">
      <h1 className="text-2xl font-bold mb-4">➕ New Client</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { name: 'first_name', placeholder: 'First name', type: 'text', required:true },
          { name: 'last_name',  placeholder: 'Last name',  type: 'text', required:true },
          { name: 'email',      placeholder: 'Email',      type: 'email',required:true },
          { name: 'phone',      placeholder: 'Phone',      type: 'text', required:false },
          { name: 'past_events',placeholder: 'Past events (comma‑separated)', type:'text', required:false },
        ].map(field => (
          <input
            key={field.name}
            name={field.name}
            type={field.type}
            required={field.required}
            value={form[field.name]}
            onChange={handleChange}
            placeholder={field.placeholder}
            className="w-full border p-2 rounded"
          />
        ))}

        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          placeholder="Notes"
          className="w-full border p-2 rounded"
          rows={3}
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Save Client
        </button>
      </form>
    </div>
  )
}
