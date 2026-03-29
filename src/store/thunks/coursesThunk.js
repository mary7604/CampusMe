import { createAsyncThunk } from '@reduxjs/toolkit';
import coursesApi from '../../api/coursesApi';

export const fetchCoursesThunk = createAsyncThunk(
  'courses/fetchWeek',
  async (group, { rejectWithValue }) => {
    try {
      const response = await coursesApi.getWeekCourses(group);
      return response.data;
    } catch (error) {
      return rejectWithValue('Impossible de charger les cours');
    }
  }
);
