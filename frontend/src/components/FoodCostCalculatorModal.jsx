import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function FoodCalculatorModal({ isOpen, onClose, onCalculate }) {
  const [items, setItems]         = useState([])
  const [headcount, setHeadcount] = useState(0)
  const [selected, setSelected]   = useState(new Set())
  const [error, setError]         = useState(null)

  useEffect(() => {
    if (!isOpen) return
    axios.get('http://localhost:5001/api/expenses/food')
      .then(res => setItems(res.data))
      .catch(() => setError('Failed to load menu items'))
  }, [isOpen])

  const toggleItem = item => {
    setSelected(s => {
      const nxt = new Set(s)
      nxt.has(item) ? nxt.delete(item) : nxt.add(item)
      return nxt
    })
  }

  const handleCalculate = async () => {
    try {
      const res = await axios.post(
        'http://localhost:5001/api/expenses/calculate/food',
        { headcount, menu: Array.from(selected) }
      )
      onCalculate({
        total: res.data.total_food,
        headcount,
        menu: Array.from(selected)
      })
      onClose()
    } catch {
      setError('Calculation failed')
    }
  }

  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">🍔 Food Calculator</h2>
        {error && <p className="text-red-600 mb-2">{error}</p>}
        <div className="mb-4">
          <label className="block mb-1">Headcount</label>
          <input
            type="number"
            className="w-full border px-3 py-2 rounded"
            value={headcount}
            onChange={e => setHeadcount(Number(e.target.value))}
          />
        </div>
        <div className="mb-4 max-h-40 overflow-y-auto border rounded p-2">
          {items.map(item => (
            <label key={item.item} className="flex items-center mb-2">
              <input
                type="checkbox"
                className="mr-2"
                checked={selected.has(item.item)}
                onChange={() => toggleItem(item.item)}
              />
              <span>{item.item} (qty: {item.quantity}, $ {item.amount})</span>
            </label>
          ))}
        </div>
        <div className="flex justify-end space-x-2">
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