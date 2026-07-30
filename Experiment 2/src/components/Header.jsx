import React from 'react';
import { useSelector } from 'react-redux';
import { selectTotalLikes, selectTotalComments, selectTotalShares } from '../features/posts/postsSlice';

const Header = React.memo(() => {
  const totalLikes = useSelector(selectTotalLikes);
  const totalComments = useSelector(selectTotalComments);
  const totalShares = useSelector(selectTotalShares);

  console.log('🔄 Header Rendered');

  return (
    <div className="header-stats">
      <div className="stat-item">
        <span className="stat-icon">❤️</span>
        <span className="stat-value">{totalLikes}</span>
        <span className="stat-label">Total Likes</span>
      </div>
      <div className="stat-item">
        <span className="stat-icon">💬</span>
        <span className="stat-value">{totalComments}</span>
        <span className="stat-label">Total Comments</span>
      </div>
      <div className="stat-item">
        <span className="stat-icon">🔗</span>
        <span className="stat-value">{totalShares}</span>
        <span className="stat-label">Total Shares</span>
      </div>
    </div>
  );
});

export default Header;