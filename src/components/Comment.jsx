import React, { useState, useEffect } from 'react';
import './Comment.css';
import CommentForm from './input_box';

const ConfirmationDialog = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="confirmation-dialog">
      <div className="confirmation-dialog-content">
        <h2>Delete Comment</h2>
        <p>{message}</p>
        <button onClick={onCancel} className="cancel-button">No, Cancel</button>
        <button onClick={onConfirm} className="confirm-button">Yes, Delete</button>
      </div>
    </div>
  );
};


const Comment = ({ onCommentSubmit, comment, currentUser, onEdit, onEditReply, onDelete, onReply }) => {
  const [editedContent, setEditedContent] = useState({});
  const [showReplyInput, setShowReplyInput] = useState({}); // State for each comment
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [scores, setScores] = useState({}); // State to manage scores
  const [voted, setVoted] = useState({});

  useEffect(() => {
    const initializeScores = (comment) => {
      const newScores = {};
      newScores[comment.id] = comment.score;
      comment.replies?.forEach(reply => {
        newScores[reply.id] = reply.score;
        if (reply.replies) {
          Object.assign(newScores, initializeScores(reply));
        }
      });
      return newScores;
    };

    setScores(initializeScores(comment));
  }, [comment]);


  const isOwner = username => {
    return currentUser.username === username;
  };

  const handleDeleteComment = (commentId) => {
    setShowConfirmation(true);
    setDeleteTarget({ type: 'comment', id: commentId });
  };

  const handleDeleteReply = (parentCommentId, replyId) => {
    setShowConfirmation(true);
    setDeleteTarget({ type: 'reply', parentId: parentCommentId, id: replyId });
  };

  const handleConfirmDelete = () => {
    if (deleteTarget.type === 'comment') {
      onDelete(deleteTarget.id);
    } else if (deleteTarget.type === 'reply') {
      onReply(deleteTarget.parentId, deleteTarget.id);
    }
    setShowConfirmation(false);
    setDeleteTarget(null);
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
    setDeleteTarget(null);
  };

  

 

  const handleEdit = (commentId, content) => {
    setEditedContent(prevState => ({
      ...prevState,
      [commentId]: content
    }));
  };

  const handleCancelEdit = commentId => {
    
    setEditedContent(prevState => ({
      ...prevState,
      [commentId]: undefined
    }));
  };

  const handleUpdate = (id, commentId, content) => {
  
    if (id === commentId) {
      onEdit(commentId, content);
    } else {
      onEditReply(id, commentId, content);
    }
    handleCancelEdit(commentId);
  };

  const handleChange = (event, commentId) => {
    const { value } = event.target;
    setEditedContent(prevState => ({
      ...prevState,
      [commentId]: value
    }));
  };

  const toggleReplyInput = commentId => {
    setShowReplyInput(prevState => ({
      ...prevState,
      [commentId]: !prevState[commentId]
    }));
  };

  const handleVote = (commentId, type) => {
    setScores(prevScores => {
      const newScore = type === 'upvote'
        ? (prevScores[commentId] || 0) + 1
        : (prevScores[commentId] || 0) - 1;

      return {
        ...prevScores,
        [commentId]: newScore
      };
    });

    setVoted(prevVoted => ({
      ...prevVoted,
      [commentId]: type
    }));
  };
  // const handleCommentSubmit= (content, parentId) => {
  //   onCommentSubmit(content, parentId);
  //   toggleReplyInput(parentId)
  // }


  const renderContent = (commentId, content) => {
    if (editedContent[commentId] !== undefined) {
      return (
        <>
          <textarea className="responsive-textarea" value={editedContent[commentId]} onChange={event => handleChange(event, commentId)} />
          <div className='two-btn'>
          <button className='update-bt' onClick={() => handleUpdate(comment.id, commentId, editedContent[commentId])}>Update</button>
          <button className='cancel-bt' onClick={() => handleCancelEdit(commentId)}>Cancel</button>
          </div>
        </>
      );
    } else {
      return <p className="comment-content">{content}</p>;
    }
  };

  const renderReplies = replies => {
    if (!replies || replies.length === 0) return null;

    return (
      <div className="replies">
        {replies.map(reply => (

<div className="comment">
          
          <div key={reply.id} className="replyed container">

<div className="vote-buttons">
        <button 
        onClick={() => handleVote(reply.id, 'upvote')} className="vote-button"  disabled={voted[reply.id] === 'upvote'}>+</button>
        <span>{scores[reply.id]}</span>
        <button onClick={() => handleVote(reply.id, 'downvote')} className="vote-button"  disabled={voted[reply.id] === 'downvote'}>–</button>
       
      </div>

      <div className="comment-header">
            <div className="user-info">
              <img src={reply.user.image.webp} alt="User Avatar" className="user-avatar" width={"25px"} height={"25px"}/>
              <p className="user-name">{reply.user.username}</p>
              {isOwner(reply.user.username) && <p className='owner'>You</p>}
              <p className="comment-time">{reply.createdAt}</p>
            </div>
            <div className='update-cancel-btn'>
            {renderContent(reply.id, reply.content)}
            </div>
            </div>
            <div className="comment-actions replay">    
            {isOwner(reply.user.username) ? (
                <>
                 
                  <button onClick={() => handleDeleteReply(comment.id,reply.id)} className="delete-button"><span><img src="/images/icon-delete.svg" alt="" /></span> Delete</button>
                  <button  onClick={() => handleEdit(reply.id, reply.content)} className="edit-button" ><span><img src="/images/icon-edit.svg" alt="" /></span> Edit</button>
                </>
              ) : (
                <button onClick={() => toggleReplyInput(reply.id)} className="reply-button"><span><img src="/images/icon-reply.svg" alt="" /></span>  Reply</button>
              )}
            </div>
      

          </div>

                   
        {/* Reply input box */}
    {showReplyInput[reply.id] && (
      // <div className="reply-input">
      //   <textarea className="responsive-textarea" placeholder="Write your reply..." />
      //   <button>Submit</button>
      // </div>
      <CommentForm onCommentSubmit={ onCommentSubmit}   currentUser={currentUser} parentId={reply.id} toggleReplyInput={toggleReplyInput} replyInput="Reply"/>
    )}
        {renderReplies(reply.replies)} 

       
          </div>
         
        ))}

      
        
      </div>
    );
  };

  return (
    <>
      {showConfirmation && (
        <>
          <div className="dark-overlay"></div>
          <ConfirmationDialog
            message="Are you sure you want to delete this comment? This will remove the comment and can't be undone."
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
          />
        </>
      )}
    <div className={`comment ${showConfirmation ? 'blur-content' : ''}`}>
      
       <div className='container'>
      <div className="vote-buttons">
        <button 
        onClick={() => handleVote(comment.id, 'upvote')} className="vote-button" disabled={voted[comment.id] === 'upvote'}>+</button>
        <span>{scores[comment.id]}</span>
        <button onClick={() => handleVote(comment.id, 'downvote')} className="vote-button" disabled={voted[comment.id] === 'downvote'}>–</button>
       
      </div>
      <div className="comment-header">
      
        <div className="user-info">
           
          <img src={comment.user.image.webp} alt="User Avatar" className="user-avatar" width={"25px"} height={"25px"}/>
          <p className="user-name">{comment.user.username}</p>
           {isOwner(comment.user.username) && <p className='owner'>You</p> }
          <p className="comment-time">{comment.createdAt}</p>
          

      
        </div>

        <div className='update-cancel-btn'>

        {renderContent(comment.id, comment.content)}
</div>
       
         
        
      </div> 

      <div className='replay'>
              {isOwner(comment.user.username) ? (
                <>
                 
                  <button onClick={() => handleDeleteComment(comment.id)} className="delete-button"><span><img src="/images/icon-delete.svg" alt="" /></span>Delete</button>
                  <button  onClick={() => handleEdit(comment.id, comment.content)} className="edit-button"><span><img src="/images/icon-edit.svg" alt="" /></span> Edit</button>
                </>
              ) : (
                <button  onClick={() => toggleReplyInput(comment.id)} className="reply-button"><span><img src="/images/icon-reply.svg" alt="" /></span>  Reply</button>
              )}
            </div>

        

      
      </div>
      

     

      {/* Reply input box */}
    {showReplyInput[comment.id] && (
      // <div className="reply-input">
      //   <textarea className="responsive-textarea" placeholder="Write your reply..." />
      //   <button>Submit</button>
      // </div>

      <CommentForm onCommentSubmit={ onCommentSubmit}   currentUser={currentUser} parentId={comment.id} toggleReplyInput={toggleReplyInput} replyInput="Reply"/>
     
    )}
      
     
     
      {renderReplies(comment.replies)}

    

     
    </div>

    
    </>
  );
  
};



export default Comment;
