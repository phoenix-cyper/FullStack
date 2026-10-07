import { createSlice } from "@reduxjs/toolkit";

let nextId = 1;

const postsSlice = createSlice({
  name: "posts",
  initialState: {
    items: [],
  },
  reducers: {
    addPost: (state, action) => {
      state.items.push({
        id: nextId++,
        title: action.payload,
      });
    },
  },
});

export const { addPost } = postsSlice.actions;
export default postsSlice.reducer;
