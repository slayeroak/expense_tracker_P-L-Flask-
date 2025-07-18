import React, { useState, useEffect } from 'react'
import ReactDOM                          from 'react-dom'
import { getSuppliesItems, calculateSupplies } from '../utils/api'

export default function SuppliesCalculatorModal({ isOpen, onClose, onCalculate }) {
  const [items, setItems]   = useState([])
  const [orders, setOrders] = useState({})

  useEffect(() => {
    getSuppliesItems()
      .then(r => setItems(r.data))
      .catch(() => setItems([]))
  }, [])

  if (!isOpen) return null

  const handleQtyChange = (name,val) =>
    setOrders(o => ({ ...o, [name]: +val||0 }))

  const handleCompute = async () => {
    const payload = Object.entries(orders)
      .filter(([,q])=>q>0)
      .map(([item,count])=>({ item, count }))
    try {
      const { data } = await calculateSupplies({ orders: payload })
      onCalculate({ total: data.total_supplies, orders: payload })
      onClose()
    } catch {
      alert('Error calculating supplies cost')
    }
  }

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div onClick={e=>e.stopPropagation()} className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">🧂 Supplies Calculator</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">&times;</button>
        </div>
        <div className="space-y-2 mb-4 max-h-48 overflow-auto">
          {items.map(({ item, amount }) => (
            <div key={item} className="flex justify-between items-center">
              <span>{item} — ${amount}</span>
              <input
                type="number" min="0"
                value={orders[item]||''}
                onChange={e=>handleQtyChange(item,e.target.value)}
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
    </div>,
    document.body
  )
}
