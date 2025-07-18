import React, { useState, useEffect } from 'react'
import { calculateSupplies, getSuppliesItems } from '../utils/api'

export default function SuppliesCalculatorModal({ isOpen, onClose, onCalculate }) {
  const [items, setItems]   = useState([])
  const [orders, setOrders] = useState({})

  useEffect(() => {
    getSuppliesItems()
      .then(res => setItems(res.data))
      .catch(err => {
        console.error('Failed to load supplies', err)
        setItems([])
      })
  }, [])

  if (!isOpen) return null

  const handleQtyChange = (name, val) => {
    setOrders(o => ({ ...o, [name]: +val || 0 }))
  }

  const handleCompute = async () => {
    const payloadOrders = Object.entries(orders)
      .filter(([_, qty]) => qty > 0)
      .map(([item, count]) => ({ item, count }))

    try {
      const { data } = await calculateSupplies({ orders: payloadOrders })
      onCalculate({ total: data.total_supplies, orders: payloadOrders })
      onClose()
    } catch (err) {
      console.error(err)
      alert('Error calculating supplies cost')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">🧂 Supplies Calculator</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">&times;</button>
        </div>

        <div className="space-y-2 mb-4 max-h-48 overflow-auto">
          {items.map(({ item, amount }) => (
            <div key={item} className="flex justify-between items-center">
              <span>{item} — ${amount}</span>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={orders[item] || ''} 
                onChange={e => handleQtyChange(item, e.target.value)}
                className="w-16 border p-1 rounded text-right"
              />
            </div>
          ))}
        </div>

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
