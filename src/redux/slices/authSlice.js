import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loginField: '',
  membershipNumber: '',
  isLoggedIn: false,
  user: null,      // ✅ renamed from userData → user
  token: null,     // ✅ added token field
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoginField: (state, action) => {
      state.loginField = action.payload;
    },
    setMembershipNumber: (state, action) => {
      state.membershipNumber = action.payload;
    },
    setUserData: (state, action) => {
      state.user = action.payload.user;   // expecting object like { user, token }
      state.token = action.payload.token; // store token separately
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.loginField = '';
      state.membershipNumber = '';
      state.isLoggedIn = false;
      state.user = null;
      state.token = null;
    },
    clearUser: (state) => {
      state.membershipNumber = '';
      state.loginField = '';
    },
  },
});

export const { setLoginField, setMembershipNumber, setUserData, logout, clearUser } = authSlice.actions;

export default authSlice.reducer;
