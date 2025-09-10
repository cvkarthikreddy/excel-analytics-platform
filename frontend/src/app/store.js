import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import fileReducer from '../features/files/fileSlice';
import adminReducer from '../features/admin/adminSlice'; // <-- 1. Import admin reducer

export const store = configureStore({
  reducer: {
    auth: authReducer,
    files: fileReducer,
    admin: adminReducer, // <-- 2. Add it to the store
  },
});