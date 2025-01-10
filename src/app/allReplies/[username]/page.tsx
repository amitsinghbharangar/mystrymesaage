'use client'
import { useParams } from 'next/navigation';
import React from 'react'

const page = () => {
  const params = useParams();
  const username = params.username;
  return (
    <div className='sm:max-w-2xl  md:max-w-6xl p-6 space-y-6 bg-white rounded-lg shadow-lg'>
      <h1 className="text-lg font-semibold text-gray-800">
        Replies made by <span className="text-blue-500">@{username}</span>
      </h1>
    </div>
  )
}

export default page
