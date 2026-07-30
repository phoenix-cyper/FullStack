import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter, selectFilter } from '../features/posts/postsSlice';

const FilterBar = () => {
  const dispatch = useDispatch();
  const currentFilter = useSelector(selectFilter);

  const platforms = ['All', 'Twitter', 'Facebook', 'Instagram', 'LinkedIn'];

  return (
    <div className="filter-bar">
      <span className="filter-label">Filter by Platform:</span>
      <div className="filter-buttons">
        {platforms.map((platform) => (
          <button
            key={platform}
            className={`filter-btn ${currentFilter === platform ? 'active' : ''}`}
            onClick={() => dispatch(setFilter(platform))}
          >
            {platform}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;