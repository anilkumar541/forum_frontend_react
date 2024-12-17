import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/auth/AuthContext";
import timeAgo from "../../utility/timestamp";
import Modal from "../modal/Modal";

const Home = () => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewQuestionButton, setIsNewQuestionButton]= useState(false);
  const [newQuestions, setNewQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log(questions);

  

  const getQuestions = async () => {
    try {
      const apiUrl = import.meta.env.VITE_GET_OR_CREATE_QUESTION_API_URL;
      const response = await axios.get(apiUrl);
      setQuestions(response.data);
    } catch (error) {
      console.log(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getQuestions();

  }, []);


  useEffect(() => {
    let socket;
    let retries = 0;
  
    const connect = () => {
      socket = new WebSocket("ws://127.0.0.1:8000/ws/questions/");
  
      socket.onopen = () => {
        console.log("WebSocket connected.");
        retries = 0; // Reset retries on successful connection
      };
  
      socket.onmessage = (event) => {
        const newQuestion = JSON.parse(event.data);
        if (newQuestion.message){
          setIsNewQuestionButton(true);
          setNewQuestions((prev) => [newQuestion.message, ...prev]);
        }
      };
  
      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
  
      socket.onclose = (event) => {
        console.log("WebSocket closed:");
        
      };
    };
  
    connect();
  
    return () => {
      if (socket) socket.close();
    };
  }, []);

  const handleNewQuestions= ()=> {
    setQuestions((prev)=> [...newQuestions, ...prev]);
    setNewQuestions([]);
    setIsNewQuestionButton(false);
  }
    

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">All Questions</h1>

      {/* New Button */}
      {isNewQuestionButton && (
        <div className="text-center mb-4">
          <button
            onClick={handleNewQuestions}
            className="px-4 py-2 rounded border border-blue-600"
          >
            New post
          </button>
        </div>
      )}

      {/* Button Container */}
      <div className="flex justify-end mb-4 gap-3">
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

      <ul className="space-y-4">
        {questions.map((question) => (
          <li
            key={question.id}
            className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-200"
          >
            <Link
              to={`/question/${question.id}`}
              className="text-xl font-semibold text-blue-600 hover:underline"
            >
              {question.title}
            </Link>
            <p className="text-gray-600 mt-2">{question.body}</p>
            <p className="text-sm text-gray-500 mt-1">
              Posted by: {question.author.username}
            </p>{" "}
            {/* Show Author Name */}
            {question?.tags?.length > 0 && (
              <div className="mt-2">
                <span className="text-sm text-gray-500">Tags: </span>
                {question.tags.map((tag, index) => (
                  <span key={tag.id} className="text-sm text-blue-500 mr-1">
                    {tag.tag}
                    {index < question.tags.length - 1 && ","}
                  </span>
                ))}
              </div>
            )}
            <p className="text-sm text-gray-500 mt-1">
              Posted : {timeAgo(question.created_at)}
            </p>
            <Link
              to={`/question/${question.id}/`}
              className="text-blue-600 mt-2 inline-block hover:underline"
            >
              See Answers
            </Link>
          </li>
        ))}
      </ul>

      {/* Modal  */}
      {isModalOpen && (
        <Modal
          message={"Login required"}
          onClose={() => setIsModalOpen(false)}
        />
      )}


      {loading && (
        <div className="flex justify-center items-center h-32">
          <p className="text-gray-500 mb-4">Loading...</p>
        </div>
      )}
    </div>
  );
};

export default Home;
