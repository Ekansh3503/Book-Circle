import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { setSessionData } from '../redux/slices/clubSession/clubSessionSlice';

const useInitializeSession = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cookies] = useCookies(['token']);
  const isSessionFetched = useSelector((state) => state.clubSession.isSessionFetched);

  useEffect(() => {
    if (!isSessionFetched) {
      const fetchSessionData = async () => {
        try {
          const token = cookies.token;

          if (!token) {
            navigate('/club-selection', { replace: true });
            return;
          }

          const axiosInstance = axios.create({
            baseURL: 'http://localhost:3000/api/v1',
            withCredentials: true,
          });

          const sessionRes = await axiosInstance.get('/club/check');
          if (sessionRes.data.status === false || !sessionRes.data.clubId) {
            navigate('/club-selection', { replace: true });
            return;
          }

          const { clubId, role } = sessionRes.data;

          const config = {
            headers: { "content-type": "application/json" },
          };

          const [userRes, clubRes] = await Promise.all([
            axiosInstance.post('/user/userdetails', { token }, config),
            axiosInstance.post('/club/clubdetails', { clubId }, config),
          ]);

          dispatch(
            setSessionData({
              userId: userRes.data.user.id,
              userProfile: userRes.data.user.profile_image,
              clubId: clubRes.data.club.id,
              clubName: clubRes.data.club.club_name,
              role,
            })
          );
        } catch (error) {
          console.error('Error fetching session data:', error);
          navigate('/club-selection', { replace: true });
        }
      };

      fetchSessionData();
    }
  }, [isSessionFetched, dispatch, navigate, cookies]);

  // ❌ Don't return loading
  // ✅ Instead, just rely on `isSessionFetched` in components
};
export default useInitializeSession;
