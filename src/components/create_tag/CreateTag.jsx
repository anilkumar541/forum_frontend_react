import axios from 'axios';
import React, { useEffect, useState } from 'react'

const CreateTag = () => {
    const [tag, setTag]= useState("");
    const [tagData, setTagData]= useState([]);
    const [error, setError]= useState("");
    

    const fetchTags= async ()=> {
        try {
            const accessToken= localStorage.getItem("access_token");
            const api_url= import.meta.env.VITE_GET_TAGS_API_URL;
            const response= await axios.get(api_url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            if (response.status === 200) {
                setTagData(response.data);
            }
        } catch (error) {
            console.log(error);
            setError(error);
        }
    }

    useEffect(()=> {
        fetchTags();
    }, [])

    const handleCreateTag= async (e)=> {
        e.preventDefault();
        try {
            const accessToken= localStorage.getItem("access_token");
            const api_url= import.meta.env.VITE_CREATE_TAGS_API_URL;
            const response= await axios.post(api_url, {tag: tag}, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            })

            if (response.status === 201) {
                setTag("");
                fetchTags();
            }
            
        } catch (error) {
            setError(error);
        }
    }
  return (
    <div className="flex flex-col md:flex-row w-full p-4 space-y-4 md:space-y-0 md:space-x-4">
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
    {/* <!-- Tag Creation Section --> */}
    <div className="flex flex-col items-start space-y-4 md:w-1/2 lg:w-2/5 max-w-md mx-auto">
        <h2 className="text-2xl font-semibold">Create a New Tag</h2>
        
        {/* <!-- Tag Input Form --> */}
        <form id="create-tag-form" className="w-full space-y-4" onSubmit={handleCreateTag}>
            <input
                type="text"
                id="tag-name"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter tag name"
                value={tag}
                onChange={(e)=> setTag(e.target.value)}
            />
            <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none"
            >
                Create Tag
            </button>
        </form>
    </div>

    {/* <!-- Tag List Section --> */}
    <div className="flex flex-col w-full md:w-1/2 lg:w-2/5 max-w-sm mx-auto h-96 overflow-y-auto border border-gray-300 rounded-md p-4 space-y-2">
        <h2 className="text-2xl font-semibold">Available Tags</h2>

        {/* <!-- Tag List (this will be dynamically populated) --> */}
        <ul id="tag-list" className="space-y-2">
            {/* <!-- Existing tags will be listed here --> */}
            {
                tagData.map((item)=> (
                    <li className="bg-gray-300 p-1 rounded-md" key={item.id}>{item.tag}</li>
                ))
            }

        </ul>
    </div>
</div>
  )
}

export default CreateTag