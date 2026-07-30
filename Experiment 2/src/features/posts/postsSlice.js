import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
  posts: [],
  totalLikes: 0,
  totalComments: 0,
  totalShares: 0,
  filter: 'All', // New state for filtering
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    addPost: (state, action) => {
      const { content, platform } = action.payload;
      const newPost = {
        id: nanoid(),
        content,
        platform,
        likes: 0,
        comments: 0,
        shares: 0,
        timestamp: new Date().toLocaleString(),
      };
      state.posts.unshift(newPost);
    },
    likePost: (state, action) => {
      const postId = action.payload;
      const post = state.posts.find((p) => p.id === postId);
      if (post) {
        post.likes += 1;
        state.totalLikes += 1;
      }
    },
    commentPost: (state, action) => {
      const postId = action.payload;
      const post = state.posts.find((p) => p.id === postId);
      if (post) {
        post.comments += 1;
        state.totalComments += 1;
      }
    },
    sharePost: (state, action) => {
      const postId = action.payload;
      const post = state.posts.find((p) => p.id === postId);
      if (post) {
        post.shares += 1;
        state.totalShares += 1;
      }
    },
    // NEW: Reducer to update the filter
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
  },
});

export const { addPost, likePost, commentPost, sharePost, setFilter } = postsSlice.actions;

// Selectors
export const selectAllPosts = (state) => state.posts.posts;
export const selectFilter = (state) => state.posts.filter; // New selector
export const selectTotalLikes = (state) => state.posts.totalLikes;
export const selectTotalComments = (state) => state.posts.totalComments;
export const selectTotalShares = (state) => state.posts.totalShares;

export default postsSlice.reducer;