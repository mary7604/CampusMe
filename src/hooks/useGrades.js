import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGradesThunk } from '../store/thunks/gradesThunk';

export default function useGrades() {
  const dispatch = useDispatch();
  const { grades, average, loading, error } = useSelector(s => s.grades);
  const user = useSelector(s => s.auth.user);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchGradesThunk(user.id));
    }
  }, [user?.id]);

  return { grades, average, loading, error };
}
