import React from 'react';
import { useDispatch } from 'react-redux';
import { likePost, commentPost, sharePost } from '../features/posts/postsSlice';

const PostItem = React.memo(({ post }) => {
  const dispatch = useDispatch();

  console.log(`📝 Post ${post.id} Rendered`);

  const handleLike = () => dispatch(likePost(post.id));
  const handleComment = () => dispatch(commentPost(post.id));
  const handleShare = () => dispatch(sharePost(post.id));

  return (
    <div className="post">
      <div className="post-header">
        <h4>📱 {post.platform}</h4>
        <span className="post-time">{post.timestamp}</span>
      </div>
      <p className="post-content">{post.content}</p>
      <div className="post-actions">
        <button className="action-btn like-btn" onClick={handleLike}>
          ❤️ {post.likes}
        </button>
        <button className="action-btn comment-btn" onClick={handleComment}>
          💬 {post.comments}
        </button>
        <button className="action-btn share-btn" onClick={handleShare}>
          🔗 {post.shares}
        </button>
      </div>
    </div>
  );
});

export default PostItem;