// src/components/LaborCalculatorModal.jsx
import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function LaborCalculatorModal({ isOpen, onClose, onCalculate }) {
  const [roles, setRoles] = useState({})
  const [assignments, setAssignments] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isOpen) return
    axios.get('http://localhost:5001/api/expenses/labor')
      .then(res => {
        const map = {}
        res.data.forEach(r => {
          map[r.labor_role] = map[r.labor_role] || []
          map[r.labor_role].push({ event_type: r.event_type, cost: r.cost })
        })
        setRoles(map)
      })
      .catch(() => setError('Failed to load labor roles'))
  }, [isOpen])

  const handleAssignChange = (role, field, value) => {
    setAssignments(a => {
      const idx = a.findIndex(x => x.role === role)
      if (idx === -1) {
        const fresh = { role, event_type: '', count: 0 }
        fresh[field] = field === 'count' ? Number(value) : value
        return [...a, fresh]
      }
      const updated = [...a]
      updated[idx] = {
        ...updated[idx],
        [field]: field === 'count' ? Number(value) : value
      }
      return updated
    })
  }

  const handleCalculate = async () => {
    try {
      const res = await axios.post(
        'http://localhost:5001/api/expenses/calculate/labor',
        { assignments }
      )
      onCalculate({
        total: res.data.total_labor,
        assignments
      })
      onClose()
    } catch {
      setError('Calculation failed')
    }
  }

  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">👷 Labor Calculator</h2>
        {error && <p className="text-red-600 mb-2">{error}</p>}
        <div className="space-y-4 max-h-64 overflow-y-auto">
          {Object.entries(roles).map(([role, events]) => (
            <div key={role} className="border p-2 rounded">
              <h3 className="font-medium mb-2">{role}</h3>
              <div className="flex space-x-2 mb-2">
                <select
                  onChange={e => handleAssignChange(role, 'event_type', e.target.value)}
                  className="flex-1 border px-2 py-1 rounded"
                >
                  <option value="">Event type…</option>
                  {events.map(ev => (
                    <option key={ev.event_type} value={ev.event_type}>
                      {ev.event_type} (${ev.cost})
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min="0"
                  placeholder="Count"
                  onChange={e => handleAssignChange(role, 'count', e.target.value)}
                  className="w-20 border px-2 py-1 rounded"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">
            Cancel
          </button>
          <button
            onClick={handleCalculate}
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
          >
            Calculate
          </button>
        </div>
      </div>
    </div>
  )
}
