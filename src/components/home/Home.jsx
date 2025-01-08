import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/auth/AuthContext";
import timeAgo from "../../utility/timestamp";
import Modal from "../modal/Modal";
import api from "../../utility/api";
import { ButtonContainer } from "../home_page_button_header/ButtonContainer";

const Home = () => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewQuestionButton, setIsNewQuestionButton] = useState(false);
  const [newQuestions, setNewQuestions] = useState([]);
  const [searchTag, setSearchTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pageOffset, setPageOffset] = useState(0); // Offset for pagination
  const [hasMore, setHasMore] = useState(true);

  const pageLimit = import.meta.env.VITE_API_PAGE_LIMIT;
  const getQuestions = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const searchParam = searchTag.trim() === "" ? "" : searchTag;
      const response = await api.get(`/forum/questions/`, {
        params: {
          search: searchParam,
          page_limit: pageLimit,
          page_offset: pageOffset,
        },
      });

      if (response.status) {
        const newQuestions = response.data.results;
        // Append only unique questions
        setQuestions((prevQuestions) => {
          if (pageOffset === 0) {
            // Replace questions if it's a new search
            return newQuestions;
          } else {
            // Append only unique questions
            const existingIds = new Set(prevQuestions.map((q) => q.id));
            const uniqueQuestions = newQuestions.filter(
              (q) => !existingIds.has(q.id)
            );
            return [...prevQuestions, ...uniqueQuestions];
          }
        });
        // setQuestions(newQuestions)
        setHasMore(newQuestions.length > 0);
      } else {
        console.log("Something went wrong");
      }
    } catch (error) {
      console.log(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  const getQuestionsDebounced = debounce(getQuestions, 700);

  useEffect(() => {
    // Reset questions and offset when searchTag changes
    setQuestions([]); // Clear the questions array
    setPageOffset(0); // Start pagination from the beginning
    setHasMore(true); // Allow fetching new data
    getQuestionsDebounced();
  }, [searchTag]);

  useEffect(() => {
    if (pageOffset > 0) {
      getQuestionsDebounced();
    }
  }, [pageOffset]);

  useEffect(() => {
    let socket;
    let retries = 0;

    const connect = () => {
      socket = new WebSocket("wss://forum-apis.onrender.com/ws/questions/");

      socket.onopen = () => {
        console.log("WebSocket connected.");
        retries = 0; // Reset retries on successful connection
      };

      socket.onmessage = (event) => {
        const newQuestion = JSON.parse(event.data);
        if (newQuestion.message) {
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

  const handleNewQuestions = () => {
    setQuestions((prev) => [...newQuestions, ...prev]);
    setNewQuestions([]);
    setIsNewQuestionButton(false);
  };

  // Handle Scroll Event
  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    // Trigger when user scrolls to the bottom
    if (scrollTop + clientHeight >= scrollHeight - 5 && !loading) {
      setPageOffset(
        (prevOffset) => parseInt(prevOffset, 10) + parseInt(pageLimit, 10)
      );
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll); // Clean up
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">All Questions</h1>

      {/* Button Container */}
      <ButtonContainer
        user={user}
        setIsModalOpen={setIsModalOpen}
        searchTag={searchTag}
        setSearchTag={setSearchTag}
      />

      {/* New Post Button */}
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

      <ul className="space-y-4">
        {questions &&
          questions.map((question) => (
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

      {loading && <p className="text-center text-gray-500 mt-4">Loading..</p>}

      {!hasMore && !loading && (
        <p className="text-center text-gray-500 mt-4">No posts available..</p>
      )}
    </div>
  );
};

export default Home;
