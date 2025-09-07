// services/getSession.js (or any new file)
import { checkSession } from './SessionService';

// This is now a regular async function, not a hook
export const getSession = async (navigate) => {
  const sessionData = await checkSession();

  if (sessionData.status === false) {
    navigate('/club-selection', { replace: true });
    return null;
  }

  return sessionData;
};
