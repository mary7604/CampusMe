import { createSlice } from '@reduxjs/toolkit';
import { fetchGradesThunk } from '../thunks/gradesThunk';

const gradesSlice = createSlice({
  name: 'grades',
  initialState: {
    grades: [],
    average: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGradesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGradesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.grades = action.payload.grades;
        state.average = action.payload.average;
      })
      .addCase(fetchGradesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default gradesSlice.reducer;
