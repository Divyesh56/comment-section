import { useState, useEffect } from "react";
import data from "../../data.json";
import CommentsList from "./CommentList";
import './Comment_section.css';
import CommentForm from "./input_box";


const CommentSection  = () => {

  // const [comment, setComments] = useState(JSON.parse(localStorage.getItem('comment')) || []);

   // State to hold comments from localStorage
  //  const [localComments, setLocalComments] = useState([]);

   // State to hold comments from data.json
   

   
    const initialComments = data.comments;
    const [comments, setComments] = useState(initialComments);
  
    useEffect(() => {
      console.log('Initial comments from localStorage or data.json:', initialComments);
      localStorage.setItem('comments', JSON.stringify(comments));
    }, []);
  
    useEffect(() => {
      console.log('Comments state updated:', comments);
      localStorage.setItem('comments', JSON.stringify(comments));
    }, [comments]);
  
 
   const handleCommentSubmit = (newComment, parentId) => {
     // Update local state with the new comment or reply
     const addReply = (commentsArr, parentId) => {
       return commentsArr.map(comment => {
         if (comment.id === parentId) {
           // If the parent comment matches, add the new reply to its replies array
           return {
             ...comment,
             replies: [...(comment.replies || []), newComment]
           };
         } else if (comment.replies) {
           // If the parent comment has replies, recursively search for the parent reply
           return {
             ...comment,
             replies: addReply(comment.replies, parentId)
           };
         }
         return comment;
       });
     };
 
     // Determine if the new comment is a reply to another comment or a nested reply
     if (parentId) {
       // Add the new reply to the appropriate parent comment or nested reply
       const updatedComments = addReply(comments, parentId);
       setComments(updatedComments);
       localStorage.setItem('comments', JSON.stringify(updatedComments));
     } else {
       // Add the new top-level comment
       setComments(prevComments => [...prevComments, newComment]);
       localStorage.setItem('comments', JSON.stringify([...comments, newComment]));
     }
   };

    const currentUser = data.currentUser;
    
  
    const handleEdit = commentId => {
      // Handle edit action
    };

    const handleEditComment = (commentId, newContent) => {
      // Update the state to reflect the edited comment
   
      setComments(comments => comments.map(comment => {
         
        if (comment.id === commentId) {
          return {
            ...comment,
            content: newContent
          };
        }
         
        return comment;
      }));

    
    };


    // ParentComponent.js

const handleEditReply = (parentCommentId, replyId, newContent) => {
  // Recursive function to find and edit the reply
  const editReply = (replies) => {
    return replies.map(reply => {
      if (reply.id === replyId) {
        // If the reply to edit is found
        return {
          ...reply,
          content: newContent
        };
      }
      // Recursively check replies of replies
      if (reply.replies && reply.replies.length > 0) {
        reply.replies = editReply(reply.replies);
      }
      return reply;
    });
  };

  // Find the parent comment
  const updatedComments = comments.map(comment => {
    if (comment.id === parentCommentId) {
      // If the parent comment is found, update its replies
      return {
        ...comment,
        replies: editReply(comment.replies)
      };
    }
    return comment;
  });

  // Update the state with the modified comments
  setComments(updatedComments);
};

  
    const handleDeleteComment = (commentId) => {
       setComments(comments => comments.filter(comment => comment.id !== commentId));
    };
  
// ParentComponent.js

const handleDeleteReply = (parentCommentId, replyId) => {
  // Recursive function to find and delete the reply
  const deleteReply = (replies) => {
    return replies.map(reply => {
      if (reply.id === replyId) {
        // If the reply to delete is found
        return null;
      }
      // Recursively check replies of replies
      if (reply.replies && reply.replies.length > 0) {
        reply.replies = deleteReply(reply.replies);
      }
      return reply;
    }).filter(Boolean); // Remove null elements (deleted replies)
  };

  // Find the parent comment
  const updatedComments = comments.map(comment => {
    if (comment.id === parentCommentId) {
      // If the parent comment is found, update its replies
      return {
        ...comment,
        replies: deleteReply(comment.replies)
      };
    }
    return comment;
  });

  // Update the state with the modified comments
  setComments(updatedComments);
};

 return (
    <>
    <div className="app">
      
      <CommentsList
       onCommentSubmit={handleCommentSubmit}
       comments={comments} 
        currentUser={currentUser}
        onEditComment={handleEditComment} // Pass edit comment handler
        onEditReply={handleEditReply} 
        onDeleteComment={handleDeleteComment}
        onDeleteReply={handleDeleteReply}
        
      />
         <CommentForm onCommentSubmit={handleCommentSubmit}   currentUser={currentUser} replyInput={"send"}/>
    </div>
    
 

    </>
 )
};

export default CommentSection;