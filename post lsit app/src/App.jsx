import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPost } from "./features/posts/postsSlice";

export default function App() {
  const posts = useSelector((state) => state.posts.items);
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");

  const handleAdd = () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    dispatch(addPost(trimmed));
    setTitle("");
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Post List</h1>
        <p className="subtitle">
          Built with Redux Toolkit — add a post and watch the count update.
        </p>
      </header>

      <div className="count-card">
        <span className="count-label">Total Posts</span>
        <span className="count-value" data-testid="post-count">
          {posts.length}
        </span>
      </div>

      <div className="input-row">
        <input
          data-testid="post-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAdd();
          }}
          placeholder="Write a post..."
        />
        <button data-testid="add-button" onClick={handleAdd}>
          Add
        </button>
      </div>

      <ul className="post-list" data-testid="post-list">
        {posts.length === 0 ? (
          <li className="empty-state">
            No posts yet. Add your first one above.
          </li>
        ) : (
          posts.map((post, index) => (
            <li key={post.id} className="post-item">
              <span className="post-number">#{posts.length - index}</span>
              <span className="post-title">{post.title}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
