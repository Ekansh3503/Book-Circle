import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userId: null,
  userProfile: null,
  clubId: null,
  clubName: null,
  role: null,
  isSessionFetched: false,
};

const clubSessionSlice = createSlice({
  name: 'clubSession',
  initialState,
  reducers: {
    setSessionData: (state, action) => {
      const { userId, userProfile, clubId, clubName, role } = action.payload;
      state.userId = userId;
      state.userProfile = userProfile;
      state.clubId = clubId;
      state.clubName = clubName;
      state.role = role;
      state.isSessionFetched = true;
    },
    clearSession: (state) => {
      state.userId = null;
      state.userProfile = null;
      state.clubId = null;
      state.clubName = null;
      state.role = null;
      state.isSessionFetched = false;
    }
  },
});

export const { setSessionData, clearSession } = clubSessionSlice.actions;
export default clubSessionSlice.reducer;
