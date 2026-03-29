import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import coursesReducer from './slices/coursesSlice';
import gradesReducer from './slices/gradesSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,       // state.auth
    courses: coursesReducer, // state.courses
    grades: gradesReducer,   // state.grades
  },
});

export default store;
