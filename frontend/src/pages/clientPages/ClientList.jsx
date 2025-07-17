// src/pages/ClientList.jsx
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

export default function ClientList() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    axios.get('http://localhost:5001/api/clients/')
      .then(res => setClients(res.data))
      .catch(err => setError('Failed to load clients'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="p-4">Loading clients…</p>
  if (error)   return <p className="p-4 text-red-600">{error}</p>

  return (
    <div className="max-w-5xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">👥 Clients</h1>

      <Link
        to="/clients/new"
        className="inline-block mb-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        + Add New Client
      </Link>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(client => (
              <tr
                key={client.client_id}
                className="border-t hover:bg-gray-50"
              >
                <td className="px-4 py-3">
                  {client.first_name} {client.last_name}
                </td>
                <td className="px-4 py-3">{client.email}</td>
                <td className="px-4 py-3">{client.phone}</td>
                <td className="px-4 py-3 space-x-2">
                  <Link
                    to={`/clients/${client.client_id}/edit`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={async () => {
                      if (!window.confirm('Delete this client?')) return
                      await axios.delete(
                        `http://localhost:5001/api/clients/${client.client_id}`
                      )
                      setClients(cs =>
                        cs.filter(c => c.client_id !== client.client_id)
                      )
                    }}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {clients.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="px-4 py-6 text-center text-gray-500"
                >
                  No clients found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}