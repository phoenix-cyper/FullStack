import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectAllPosts, selectFilter } from '../features/posts/postsSlice';
import PostItem from './PostItem';

const PostList = React.memo(() => {
  const posts = useSelector(selectAllPosts);
  const filter = useSelector(selectFilter);

  console.log('📋 Post List Rendered');

  // Memoized filtering - only recomputes when posts or filter change
  const filteredPosts = useMemo(() => {
    if (filter === 'All') return posts;
    return posts.filter((post) => post.platform === filter);
  }, [posts, filter]);

  if (filteredPosts.length === 0) {
    return <div className="empty">No {filter !== 'All' ? filter : ''} posts found.</div>;
  }

  return (
    <div className="post-list">
      <h2>📰 Feed {filter !== 'All' && `(${filter})`}</h2>
      {filteredPosts.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </div>
  );
});

export default PostList;