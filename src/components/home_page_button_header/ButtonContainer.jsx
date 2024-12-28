import React from 'react'
import { Link } from 'react-router-dom';

export const ButtonContainer = ({user, setIsModalOpen, searchTag, setSearchTag}) => {
  return (
    <div className="flex justify-between mb-4 gap-3">
        <input type="text" value={searchTag} onChange={(e)=> setSearchTag(e.target.value)} placeholder='search...' className='border border-slate-600 px-4 py-2 rounded'/>

        <div className='flex justify-end gap-3'>
        <Link
          to={user ? "/create-question" : "#"}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => {
            if (!user) {
              setIsModalOpen(true);
              return;
            }
          }}
        >
          Create Question
        </Link>
        <Link
          to={user ? "/create-tag" : "#"}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={() => {
            if (!user) {
              setIsModalOpen(true);
              return;
            }
          }}
        >
          Add New Tag
        </Link>
        </div>
      </div>
  )
}
