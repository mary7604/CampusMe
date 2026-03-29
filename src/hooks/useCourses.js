import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCoursesThunk } from '../store/thunks/coursesThunk';

// Hook useCourses — récupère les cours depuis Redux/API
export default function useCourses() {
  const dispatch = useDispatch();
  const { weekCourses, todayCourses, loading, error } = useSelector(s => s.courses);
  const user = useSelector(s => s.auth.user);

  useEffect(() => {
    if (user?.group) {
      dispatch(fetchCoursesThunk(user.group));
    }
  }, [user?.group]);

  return { weekCourses, todayCourses, loading, error };
}
