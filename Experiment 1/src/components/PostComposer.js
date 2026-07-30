import React, { useState } from "react";

const limits = {
  Twitter: { characters: 280, media: 4 },
  LinkedIn: { characters: 3000, media: 9 },
  Facebook: { characters: 63206, media: 10 },
};

function PostComposer() {
  const [platform, setPlatform] = useState("Twitter");
  const [post, setPost] = useState("");
  const [media, setMedia] = useState(0);
  const [drafts, setDrafts] = useState([]);

  const limit = limits[platform].characters;
  const maxMedia = limits[platform].media;

  const valid = post.length <= limit;

  const saveDraft = () => {
    if (post.trim() === "") {
      alert("Please write something first.");
      return;
    }

    setDrafts([...drafts, post]);

    setPost("");
    setMedia(0);
  };

  const publish = () => {
    if (post.trim() === "") {
      alert("Post cannot be empty.");
      return;
    }

    if (!valid) {
      alert("Character limit exceeded.");
      return;
    }

    alert("🎉 Post Published Successfully!");

    setPost("");
    setMedia(0);
  };

  const addMedia = () => {
    if (media < maxMedia) {
      setMedia(media + 1);
    } else {
      alert(`Only ${maxMedia} images allowed on ${platform}`);
    }
  };

  const removeMedia = () => {
    if (media > 0) {
      setMedia(media - 1);
    }
  };

  return (
    <div className="container">

      <div className="left-card">

        <h1>REDUX Post DRAFTS</h1>

        <p className="subtitle">
          Cross-platform validation architecture
        </p>

        <h3>Select Platforms:</h3>

        <div className="platform-buttons">

          {Object.keys(limits).map((item) => (

            <button
              key={item}
              className={platform === item ? "active" : ""}
              onClick={() => setPlatform(item)}
            >
              {item}
            </button>

          ))}

        </div>

        <textarea
          placeholder="Draft your post here..."
          value={post}
          onChange={(e) => setPost(e.target.value)}
        />

        <div className="counter">

          <span className={valid ? "success" : "error"}>

            {valid
              ? "✅ Character count valid"
              : "❌ Character limit exceeded"}

          </span>

          <span>

            {post.length} / {limit}

          </span>

        </div>

        <div className="media-box">

          <h4>

            Media Attached: {media} (Max allowed: {maxMedia})

          </h4>

          <div className="media-buttons">

            <button onClick={addMedia}>

              + Add Image

            </button>

            <button onClick={removeMedia}>

              - Remove Image

            </button>

          </div>

        </div>

        <div className="bottom-buttons">

          <button
            className="draft-btn"
            onClick={saveDraft}
          >
            Save as Draft
          </button>

          <button
            className="publish-btn"
            onClick={publish}
            disabled={!valid}
          >
            Publish Post
          </button>

        </div>

      </div>

      <div className="right-card">

        <h2>Saved Drafts ({drafts.length})</h2>

        <hr />

        {drafts.length === 0 ? (

          <p>No drafts saved yet.</p>

        ) : (

          drafts.map((draft, index) => (

            <div className="draft-item" key={index}>

              <strong>Draft {index + 1}</strong>

              <p>{draft}</p>

            </div>

          ))

        )}

      </div>

    </div>
  );
}

export default PostComposer;