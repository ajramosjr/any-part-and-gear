'use client'

import { useState } from 'react'

export default function SellPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ title, description })
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-xl mb-4">Sell a Part</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
        <input
          type="text"
          placeholder="Part title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-white text-black p-3 rounded"
        />

        {/* 👇 THIS IS THE MISSING PIECE */}
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="bg-white text-black p-3 rounded"
        />

        <button type="submit" className="border p-3 rounded">
          Submit
        </button>
      </form>
    </div>
  )
}
