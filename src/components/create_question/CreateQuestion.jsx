import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utility/api';

const CreateQuestion = () => {
  // const {questions, setQuestions}= useContext(questionContext);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const tagContainerRef = useRef(null); // Reference for the scrollable tag container
  const navigate = useNavigate();
  const aceesToken= localStorage.getItem("access_token");
  
  
  const fetchTags = async () => {
    try {
      const response = await api.get("/forum/tags/", {
        headers: {
          Authorization: `Bearer ${aceesToken}` 
        }
      });
      setTags(response.data);
    } catch (error) {
      console.log("Error fetching tags:", error);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleTagSelect = (tag) => {
    if (selectedTags.includes(tag.id)) {
      setSelectedTags(selectedTags.filter((id) => id !== tag.id));
    } else if (selectedTags.length < 5) {
      setSelectedTags([...selectedTags, tag.id]);
    }
  };

  const handleScroll = (direction) => {
    const scrollAmount = 150; // Amount to scroll in pixels
    if (tagContainerRef.current) {
      tagContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const data= {
        title,
        body,
        tags: selectedTags,
      }

    try {
      const response = await api.post("/forum/create-question/", data, {
        headers: {
            Authorization: `Bearer ${aceesToken}`,
        }
      });
      if (response.status === 201) {
        navigate('/'); // Redirect to homepage after creation
      }
    } catch (error) {
      setError(error.message || "Failed to create question.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h1 className="text-2xl font-bold text-center mb-6">Create a New Question</h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter question title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Body</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows="4"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter question details"
            required
          ></textarea>
        </div>

        {/* Horizontal Scrollable Tags Section */}
        <div>
        <label className="block text-sm font-medium text-gray-700">Select Tags (Max 5)</label>
        <div className="relative mt-2">
            {/* Tags Container with Arrows Overlapping */}
            <div
            className="flex gap-2 overflow-x-auto p-2 border border-gray-300 rounded-md hide-scrollbar"
            ref={tagContainerRef}
            style={{ scrollBehavior: 'smooth' }}
            >
            {tags.map((tag) => (
                <button
                key={tag.id}
                type="button"
                onClick={() => handleTagSelect(tag)}
                className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer 
                    ${selectedTags.includes(tag.id) ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}
                    hover:bg-blue-500 hover:text-white transition-colors`}
                >
                {tag.tag}
                </button>
            ))}
            </div>

            {/* Left Arrow */}
            <button
              type="button"
              onClick={() => handleScroll('left')}
              className="absolute top-1/2 left-1 transform -translate-y-1/2 z-10 bg-gray-400 rounded-full shadow-lg text-gray-500 hover:text-blue-500 hover:scale-110 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Right Arrow */}
            <button
              type="button"
              onClick={() => handleScroll('right')}
              className="absolute top-1/2 right-1 transform -translate-y-1/2 z-10 bg-gray-400 rounded-full shadow-lg text-gray-500 hover:text-blue-500 hover:scale-110 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
        </div>
        <p className="text-sm text-gray-500 mt-1">
            Selected Tags: {selectedTags.length}/5
        </p>
        </div>


        
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {loading ? "Creating..." : "Create Question"}
        </button>
      </form>
    </div>
  );
};

export default CreateQuestion;
