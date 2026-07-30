import { useState } from "react";
import "./App.css";

function App() {
  const [platform, setPlatform] = useState("Twitter");
  const [post, setPost] = useState("");

  const platformLimits = {
    Twitter: 280,
    Instagram: 2200,
    Facebook: 63206,
    LinkedIn: 3000,
  };

  const limit = platformLimits[platform];
  const characterCount = post.length;
  const isLimitExceeded = characterCount > limit;

  const handlePlatformChange = (event) => {
    setPlatform(event.target.value);
  };

  const handlePostChange = (event) => {
    setPost(event.target.value);
  };

  const handlePost = () => {
    if (post.trim() === "") {
      alert("Please write some content!");
      return;
    }

    if (isLimitExceeded) {
      alert("Character limit exceeded!");
      return;
    }

    alert(`Post is ready for ${platform}!`);
  };

  return (
    <div className="app">
      <div className="composer">
        <h1>Dynamic Post Composer</h1>

        <p className="subtitle">
          Create and validate posts for multiple social media platforms.
        </p>

        <div className="form-group">
          <label>Select Platform</label>

          <select value={platform} onChange={handlePlatformChange}>
            <option value="Twitter">Twitter</option>
            <option value="Instagram">Instagram</option>
            <option value="Facebook">Facebook</option>
            <option value="LinkedIn">LinkedIn</option>
          </select>
        </div>

        <div className="form-group">
          <label>Post Content</label>

          <textarea
            value={post}
            onChange={handlePostChange}
            placeholder={`Write your ${platform} post here...`}
          ></textarea>

          <div
            className={`character-count ${
              isLimitExceeded ? "error-text" : ""
            }`}
          >
            {characterCount} / {limit} characters
          </div>
        </div>

        {isLimitExceeded && (
          <div className="error-message">
            Character limit exceeded for {platform}!
          </div>
        )}

        {post.length > 0 && !isLimitExceeded && (
          <div className="success-message">
            Your post follows {platform} character limit.
          </div>
        )}

        <button
          onClick={handlePost}
          disabled={isLimitExceeded || post.trim() === ""}
        >
          Create Post
        </button>
      </div>
    </div>
  );
}

export default App;