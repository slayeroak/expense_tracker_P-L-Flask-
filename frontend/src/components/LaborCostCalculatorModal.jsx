import React, { useState, useEffect } from 'react'
import ReactDOM                         from 'react-dom'
import { getLaborItems, calculateLabor } from '../utils/api'

export default function LaborCalculatorModal({ isOpen, onClose, onCalculate }) {
  const [data, setData]          = useState({})
  const [assignments, setAssign] = useState([])

  useEffect(() => {
    getLaborItems()
      .then(r => {
        const map = {}
        r.data.forEach(({ labor_role, event_type, cost }) => {
          if (!map[labor_role]) map[labor_role]={}
          map[labor_role][event_type]=+cost
        })
        setData(map)
      })
      .catch(()=>setData({}))
  }, [])

  if (!isOpen) return null

  const addRole = () =>
    setAssign(a=>[...a,{ role:'', eventType:'', count:0 }])

  const update = (i,key,val) =>
    setAssign(a=>{
      const copy=[...a]
      copy[i][key]= key==='count'? +val||0 : val
      return copy
    })

  const handleCompute = async () => {
    try {
      const { data:res } = await calculateLabor({ assignments })
      onCalculate({ total: res.total_labor, assignments })
      onClose()
    } catch {
      alert('Error calculating labor cost')
    }
  }

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div onClick={e=>e.stopPropagation()} className="bg-white rounded-lg w-full max-w-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">👷 Labor Calculator</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">&times;</button>
        </div>
        <div className="space-y-4 mb-4 max-h-60 overflow-auto">
          {assignments.map((asgn,i)=>(
            <div key={i} className="grid grid-cols-3 gap-2 items-center">
              <select
                value={asgn.role}
                onChange={e=>update(i,'role',e.target.value)}
                className="border p-2 rounded"
              >
                <option value="">Select Role</option>
                {Object.keys(data).map(r=>(
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <select
                value={asgn.eventType}
                onChange={e=>update(i,'eventType',e.target.value)}
                className="border p-2 rounded"
                disabled={!asgn.role}
              >
                <option value="">Select Event</option>
                {asgn.role && Object.keys(data[asgn.role]).map(ev=>(
                  <option key={ev} value={ev}>{ev}</option>
                ))}
              </select>
              <input
                type="number" min="0"
                value={asgn.count}
                onChange={e=>update(i,'count',e.target.value)}
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
    </div>,
    document.body
  )
}
