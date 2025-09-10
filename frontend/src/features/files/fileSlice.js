import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fileApiService from '../../api/fileApi';

// --- NEW: Thunk for fetching file history ---
export const fetchFilesHistory = createAsyncThunk(
  'files/fetchHistory',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const response = await fileApiService.getHistory(token);
      return response.data;
    } catch (error) {
      const message =
        (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Thunk for file upload
export const uploadFile = createAsyncThunk(
  'files/upload',
  async (formData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const response = await fileApiService.uploadFile(formData, token);
      return response.data;
    } catch (error) {
      const message =
        (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Thunk for file deletion
export const deleteFile = createAsyncThunk(
  'files/delete',
  async (fileId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      await fileApiService.deleteFile(fileId, token);
      return fileId; 
    } catch (error) {
      const message =
        (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const initialState = {
  allFiles: [],
  currentFile: null,
  loading: false,
  error: null,
};

export const fileSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    setCurrentFile: (state, action) => {
      state.currentFile = action.payload;
    },
    clearCurrentFile: (state) => {
      state.currentFile = null;
    },
    // This reducer is kept in case it's needed for synchronous updates, 
    // but the thunk is the primary way to fetch history.
    setFilesHistory: (state, action) => {
      state.allFiles = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch History cases
      .addCase(fetchFilesHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFilesHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.allFiles = action.payload;
      })
      .addCase(fetchFilesHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Upload cases
      .addCase(uploadFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.loading = false;
        state.currentFile = action.payload;
        state.allFiles.unshift(action.payload); // Ensures newest is first
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete cases
      .addCase(deleteFile.pending, (state) => {
        state.loading = true; 
      })
      .addCase(deleteFile.fulfilled, (state, action) => {
        state.loading = false;
        state.allFiles = state.allFiles.filter(file => file.fileInfo._id !== action.payload);
      })
      .addCase(deleteFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; 
      });
  },
});

export const { setCurrentFile, clearCurrentFile, setFilesHistory } = fileSlice.actions;
export default fileSlice.reducer;