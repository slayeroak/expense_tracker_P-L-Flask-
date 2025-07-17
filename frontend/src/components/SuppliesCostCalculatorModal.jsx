import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function SuppliesCalculatorModal({ isOpen, onClose, onCalculate }) {
  const [items, setItems] = useState([])
  const [orders, setOrders] = useState({})
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isOpen) return
    axios.get('http://localhost:5001/api/expenses/supplies')
      .then(res => setItems(res.data))
      .catch(() => setError('Failed to load supplies'))
  }, [isOpen])

  const handleCountChange = (item, count) => {
    setOrders(o => ({ ...o, [item]: Number(count) }))
  }

  const handleCalculate = async () => {
    const payload = {
      orders: Object.entries(orders).map(
        ([item, count]) => ({ item, count })
      )
    }
    try {
      const res = await axios.post(
        'http://localhost:5001/api/expenses/calculate/supplies',
        payload
      )
      onCalculate({
        total: res.data.total_supplies,
        orders: payload.orders
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
        <h2 className="text-xl font-semibold mb-4">🧂 Supplies Calculator</h2>
        {error && <p className="text-red-600 mb-2">{error}</p>}
        <div className="mb-4 max-h-48 overflow-y-auto border rounded p-2">
          {items.map(item => (
            <div key={item.item} className="flex justify-between items-center mb-2">
              <span>{item.item} ($ {item.amount})</span>
              <input
                type="number"
                min="0"
                className="w-16 border px-2 py-1 rounded"
                placeholder="0"
                value={orders[item.item] || ''}
                onChange={e => handleCountChange(item.item, e.target.value)}
              />
            </div>
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
