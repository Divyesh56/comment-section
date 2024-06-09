import React, { useState } from 'react';
import "./Input.css";

const CommentForm = ({ onCommentSubmit, currentUser, parentId, toggleReplyInput, replyInput}) => {
  
  const [comment, setComment] = useState('');

 

  const handleSubmit = e => {
    e.preventDefault();
    if (comment.trim() === '') return;
    const newComment = {
      id: Date.now(), // Generate unique ID for the comment
      content: comment,
      score: 0,
      user: {
        username: currentUser.username,
        image: {
          webp: currentUser.image.png
        }, // Use the image associated with the current user
       
      },
      createdAt:  moment(Date().now).fromNow()
    };
    onCommentSubmit(newComment, parentId);
    setComment('');
    if (toggleReplyInput) {
      toggleReplyInput(parentId)
    }
    
  };

  return (
    
    <form onSubmit={handleSubmit} className="comment-form">
      <div className="user-icon">
        <img src={currentUser.image.webp} alt="User Icon" />
      </div>
      <textarea
        value={comment}
        onChange={e => setComment(e.target.value)}
        placeholder="Write a comment..."
        className="comment-input"
        required
      />
      <button type="submit" className="send-button">{replyInput}</button>
    </form>
  
  );
};

export default CommentForm;
