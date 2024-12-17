import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Answer from "../answer/Answer";
import { useAuth } from "../context/auth/AuthContext";
import Modal from "../modal/Modal";


const QuestionDetail = () => {
  const {user}= useAuth();
  const { questionId } = useParams();
  const [question, setQuestion] = useState([]);
  const [answerInput, setAnswerInput]= useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen]= useState(false);

  const tags = question?.tags;
  const answers = question?.answers;

  // Fetch question detail and refresh on comment submission
  const fetchQuestionDetail = async () => {
    const apiUrl = import.meta.env.VITE_QUESTION_DETAIL_API_URL;
    try {
      const response = await axios.get(`${apiUrl}${questionId}/`);
      setQuestion(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestionDetail();
  }, [questionId]);


  const handleAnswer= async (e, questionId)=> {
    e.preventDefault();
    if (!user) {
      setIsModalOpen(true);
      return;
    }

    try {
      const accessToken= localStorage.getItem("access_token");
      const api_url= import.meta.env.VITE_QUESTION_ANSWER_API_URL;
      const body= {"body": answerInput}
      const response= await axios.post(`${api_url}${questionId}/`, body, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

    } catch (error) {
      console.log(error);
      setError(error);
      
    } finally{
      setAnswerInput("");
      fetchQuestionDetail();
    }

  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      {loading && <p className="text-gray-500 mb-4 text-center">Loading...</p>}
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-gray-900 mb-4">
          {question.title}
        </h2>
        <p className="text-lg text-gray-700 mb-4">{question.body}</p>
        <div className="flex space-x-2 mb-4">
          {tags?.length > 0 &&
            tags.map(({ id, tag }) => (
              <span
                key={id}
                className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
        </div>
      </div>

      {/* Answer input */}
      <div className="mb-4 bg-gray-50 p-2 rounded-lg shadow-md">
        <form className="space-y-4" onSubmit={(e)=> handleAnswer(e, question.id)}>
          <div>
            <textarea
              id="answer"
              name="answer"
              rows="3"
              className="block w-full px-4 py-2 text-gray-900 bg-white border rounded-lg shadow-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Write your answer here..."
              value={answerInput}
              onChange={(e) => setAnswerInput(e.target.value)}
            ></textarea>
          </div>
          <button
            type="submit"
            className="inline-flex justify-end items-end px-2 py-1 text-white bg-blue-600 border border-transparent rounded-md shadow-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Submit Answer
          </button>
        </form>
      </div>


      {/* Answers Section */}
      <div className="space-y-6">
        {answers?.length > 0 &&
          answers.map(
            ({ id, body, author: { username }, upvotes, downvotes, created_at }) => (
              <Answer key={id} id={id} body={body} username={username} upvotes={upvotes} downvotes={downvotes} created_at={created_at} />
            )
          )}
      </div>


      {/* Modal   */}
      {isModalOpen && <Modal message={"Login required"} onClose={()=> setIsModalOpen(false)} />}
    </div>
  );
};

export default QuestionDetail;
