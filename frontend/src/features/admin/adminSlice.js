import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import adminApiService from '../../api/adminApi';

const initialState = {
  stats: { users: 0, files: 0 },
  users: [],
  files: [],
  isLoading: false,
  error: null,
};

// Async thunk to fetch all admin data
export const fetchAdminData = createAsyncThunk(
  'admin/fetchAll',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      // Fetch all data in parallel for efficiency
      const [statsRes, usersRes, filesRes] = await Promise.all([
        adminApiService.getStats(token),
        adminApiService.getAllUsers(token),
        adminApiService.getAllFiles(token),
      ]);
      return {
        stats: statsRes.data,
        users: usersRes.data,
        files: filesRes.data,
      };
    } catch (error) {
      const message =
        (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload.stats;
        state.users = action.payload.users;
        state.files = action.payload.files;
      })
      .addCase(fetchAdminData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default adminSlice.reducer;