import React, { useState, useEffect } from 'react'
import { calculateLabor, getLaborItems }   from '../utils/api'

export default function LaborCalculatorModal({ isOpen, onClose, onCalculate }) {
  const [data, setData]          = useState({})
  const [assignments, setAssign] = useState([])

  useEffect(() => {
    getLaborItems()
      .then(res => {
        // res.data is an array of { labor_role, event_type, cost }
        const map = {}
        res.data.forEach(r => {
          if (!map[r.labor_role]) map[r.labor_role] = {}
          map[r.labor_role][r.event_type] = parseFloat(r.cost)
        })
        setData(map)
      })
      .catch(err => {
        console.error('Failed to load labor roles', err)
        setData({})
      })
  }, [])

  if (!isOpen) return null

  const addRole = () => setAssign(a => [...a, { role:'', eventType:'', count:0 }])
  const update  = (idx, key, val) => {
    setAssign(a => {
      const copy = [...a]
      copy[idx][key] = key === 'count' ? +val || 0 : val
      return copy
    })
  }

  const handleCompute = async () => {
    try {
      const { data: res } = await calculateLabor({ assignments })
      onCalculate({ total: res.total_labor, assignments })
      onClose()
    } catch (err) {
      console.error(err)
      alert('Error calculating labor cost')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">👷 Labor Calculator</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">&times;</button>
        </div>

        <div className="space-y-4 mb-4 max-h-60 overflow-auto">
          {assignments.map((asgn, i) => (
            <div key={i} className="grid grid-cols-3 gap-2 items-center">
              <select
                value={asgn.role}
                onChange={e => update(i, 'role', e.target.value)}
                className="border p-2 rounded"
              >
                <option value="">Select Role</option>
                {Object.keys(data).map(r => <option key={r}>{r}</option>)}
              </select>

              <select
                value={asgn.eventType}
                onChange={e => update(i, 'eventType', e.target.value)}
                className="border p-2 rounded"
                disabled={!asgn.role}
              >
                <option value="">Select Event</option>
                {asgn.role && Object.keys(data[asgn.role]).map(ev => (
                  <option key={ev}>{ev}</option>
                ))}
              </select>

              <input
                type="number"
                min="0"
                placeholder="Count"
                value={asgn.count}
                onChange={e => update(i, 'count', e.target.value)}
                className="border p-2 rounded text-right"
              />
            </div>
          ))}
        </div>

        <button onClick={addRole} className="mb-4 text-blue-600 hover:underline">
          + Add Role
        </button>

        <button
          onClick={handleCompute}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Calculate & Save
        </button>
      </div>
    </div>
  )
}
