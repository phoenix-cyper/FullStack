import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { addPost } from '../features/posts/postsSlice';

const PostComposer = () => {
  const [content, setContent] = useState('');
  const [platform, setPlatform] = useState('Twitter');
  const dispatch = useDispatch();

  const handleSubmit = useCallback(() => {
    if (content.trim() === '') return;
    dispatch(addPost({ content, platform }));
    setContent('');
  }, [content, platform, dispatch]);

  return (
    <div className="composer">
      <h2>✍️ Create a Post</h2>
      <textarea
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
        <option>Twitter</option>
        <option>Facebook</option>
        <option>Instagram</option>
        <option>LinkedIn</option>
      </select>
      <button onClick={handleSubmit}>🚀 Publish Post</button>
    </div>
  );
};

export default PostComposer;