import { createSlice } from '@reduxjs/toolkit';
import { fetchCoursesThunk } from '../thunks/coursesThunk';

const coursesSlice = createSlice({
  name: 'courses',
  initialState: {
    weekCourses: {},   // { 0: [...lundi], 1: [...mardi] }
    todayCourses: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoursesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoursesThunk.fulfilled, (state, action) => {
        state.loading = false;
        // Grouper par jour
        const grouped = action.payload.reduce((acc, course) => {
          if (!acc[course.day]) acc[course.day] = [];
          acc[course.day].push(course);
          return acc;
        }, {});
        state.weekCourses = grouped;
        const today = new Date().getDay();
        state.todayCourses = grouped[today] || [];
      })
      .addCase(fetchCoursesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default coursesSlice.reducer;
