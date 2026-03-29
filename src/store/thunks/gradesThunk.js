import { createAsyncThunk } from '@reduxjs/toolkit';
import gradesApi from '../../api/gradesApi';

export const fetchGradesThunk = createAsyncThunk(
  'grades/fetch',
  async (studentId, { rejectWithValue }) => {
    try {
      const response = await gradesApi.getGrades(studentId);
      return response.data;
    } catch (error) {
      return rejectWithValue('Impossible de charger les notes');
    }
  }
);
