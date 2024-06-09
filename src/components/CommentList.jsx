// src/components/CommentsList.js
import React from 'react';
import Comment from './Comment';
import './CommentList.css';

const CommentsList = ({ onCommentSubmit, comments, currentUser, onEditComment, onEditReply, onDeleteComment, onDeleteReply }) => {

  if (!comments || comments.length === 0) {
    return <div>No comments yet</div>;
  }
  return (
    <div className="comments-list">
      {comments.map(comment => (
        <Comment
          key={comment.id}
          onCommentSubmit={onCommentSubmit}
          comment={comment}
          currentUser={currentUser}
          onEdit={onEditComment}
          onEditReply={onEditReply}
          onDelete={onDeleteComment}
          onReply={onDeleteReply}
        />
      ))}
    </div>
  );
};

export default CommentsList;
