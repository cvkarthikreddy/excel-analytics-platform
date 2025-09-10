import { createSlice } from '@reduxjs/toolkit';

// Get user from localStorage
const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
  user: user ? user : null,
  token: user ? user.token : null,
  isAuthenticated: user ? true : false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('user');
    },
  },
});

// Export actions
export const { loginSuccess, logout } = authSlice.actions;

// Export reducer as default
export default authSlice.reducer;

