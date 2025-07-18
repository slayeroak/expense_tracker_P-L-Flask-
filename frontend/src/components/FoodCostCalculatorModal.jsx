import React, { useState, useEffect } from 'react'
import ReactDOM                        from 'react-dom'
import { getFoodItems, calculateFood } from '../utils/api'

export default function FoodCalculatorModal({ isOpen, onClose, onCalculate }) {
  const [headcount, setHeadcount] = useState(0)
  const [items, setItems]         = useState([])
  const [menu, setMenu]           = useState({})

  useEffect(() => {
    getFoodItems()
      .then(r => setItems(r.data))
      .catch(() => setItems([]))
  }, [])

  if (!isOpen) return null

  const toggleItem = name => setMenu(m => ({ ...m, [name]: !m[name] }))

  const handleCompute = async () => {
    const selected = Object.keys(menu).filter(i => menu[i])
    try {
      const { data } = await calculateFood({ headcount, menu: selected })
      onCalculate({ total: data.total_food, headcount, menu: selected })
      onClose()
    } catch {
      alert('Error calculating food cost')
    }
  }

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg w-full max-w-md p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">🍔 Food Calculator</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>

        <label className="block mb-2">
          Headcount:
          <input
            type="number"
            value={headcount}
            onChange={e => setHeadcount(+e.target.value||0)}
            className="w-full border p-2 rounded mt-1"
          />
        </label>

        <div className="space-y-2 mb-4 max-h-40 overflow-auto">
          {items.map(({ item, amount, quantity }) => (
            <label key={item} className="flex items-center">
              <input
                type="checkbox"
                checked={!!menu[item]}
                onChange={() => toggleItem(item)}
                className="mr-2"
              />
              <span>{item} — ${amount} per {quantity}</span>
            </label>
          ))}
        </div>

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
