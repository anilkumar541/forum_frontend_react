
import React from 'react'
import { Link } from 'react-router-dom';

export const ButtonContainer = ({user, setIsModalOpen, searchTag, setSearchTag}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between mb-4 gap-3">
        <input 
          type="text" 
          value={searchTag} 
          onChange={(e) => setSearchTag(e.target.value)} 
          placeholder='search...' 
          className='border border-slate-600 px-4 py-2 rounded w-full sm:w-auto' 
        />

        <div className='flex flex-col sm:flex-row justify-end gap-3 w-full sm:w-auto'>
          <Link
            to={user ? "/create-question" : "#"}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full sm:w-auto"
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
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full sm:w-auto"
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
