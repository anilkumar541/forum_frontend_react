import React, { useState } from "react";
import timeAgo from "../../utility/timestamp";
import Modal from "../modal/Modal";
import { useAuth } from "../context/auth/AuthContext";
import api from "../../utility/api";

const Answer = ({id, body, username, upvotes: initialUpvotes, downvotes: initialdDownVotes, created_at}) => {
    const {user}= useAuth();
    const [upvotes, setUpvotes]= useState(initialUpvotes);
    const [downvotes, setDownVotes]= useState(initialdDownVotes);
    const [currentVote, setCurrentVote]= useState(null);
    const [isModalOpen, setIsModalOpen]= useState(false);

    
    const handleVote= async (e, answer_id, voteType)=> {
        e.preventDefault();
        
        if(!user){
          setIsModalOpen(true);
          return;
        }

        if ((voteType === "True" && currentVote === "upvote") || 
          (voteType === "False" && currentVote === "downvote")) {
          // Reset vote if clicked again
          setCurrentVote(null);
          setUpvotes(upvotes - (currentVote === "upvote" ? 1 : 0));
          setDownVotes(downvotes - (currentVote === "downvote" ? 1 : 0));
          return;
        }

        try {
            const accessToken= localStorage.getItem("access_token");
            const body= {
                "is_upvote": voteType
            }
            const response= await api.post(`/forum/answer/vote/${answer_id}/`, body, {
              headers: {
                Authorization: `Bearer ${accessToken}`
              }
            })

            if (response.status === 200) {
              setUpvotes(response.data.upvotes);
              setDownVotes(response.data.downvotes);

              if(voteType === "True"){
                setCurrentVote("upvote");
              }else{
                setCurrentVote("downvote");
              }
            }
            

        } catch (error) {
            console.log(error);
            
        }
    }
  return (
    <div
      key={id}
      className="bg-gray-50 p-5 rounded-lg shadow-md border border-gray-200"
    >
      <p className="text-lg text-gray-800">{body}</p>
      <div className="flex items-center justify-between mt-3">
        <span className="text-xs text-gray-500">
          Answered by <strong>{username}</strong>
        </span>
        <span className="text-xs text-gray-400">{timeAgo(created_at)}</span>
      </div>

      {/* Upvote and Downvote buttons */}
      <div className="flex space-x-2 mt-3">
        <button
          className="bg-green-500 text-sm text-white px-1 py-1 rounded-md hover:bg-green-600 transition"
          onClick={(e) => handleVote(e, id, "True")

          }
        >
          👍 Upvote {upvotes}
        </button>
        <button
          className="bg-red-500 text-sm text-white px-1 py-1 rounded-md hover:bg-red-600 transition"
          onClick={(e) => handleVote(e, id, "False")}
        >
          👎 Downvote {downvotes}
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <Modal
          message="Login required..."
          onClose={() => setIsModalOpen(false)}
        />
      )}

    </div>
  );
};

export default Answer;
