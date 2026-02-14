import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  suggestedUsers: [],
  userProfile: null,
  selectedUser: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthUser: (state, action) => {
      const user = action.payload;
      
      if (user) {
        user.following = user.following || [];
      }

      state.user = user;
    },

    setSuggestUser: (state, action) => {
      state.suggestedUsers = action.payload;
    },

    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
    },

    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },

    setFollow: (state, action) => {
      const userId = action.payload;

      if (!state.user) return;

      state.user.following ??= [];

      if (!state.user.following.includes(userId)) {
        state.user.following.push(userId);
      }
    },

    setUnfollow: (state, action) => {
      const userId = action.payload;

      if (!state.user?.following) return;

      state.user.following = state.user.following.filter(
        (id) => id !== userId
      );
    },

    setUserInfo: (state, action) => {
      const user = action.payload;

      if (user) {
        user.following = user.following || [];
      }

      state.user = user;
    },
  },
});

export const {
  setAuthUser,
  setSuggestUser,
  setUserProfile,
  setSelectedUser,
  setFollow,
  setUnfollow,
  setUserInfo,
} = authSlice.actions;

export default authSlice.reducer;
