import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loginField: '',
  membershipNumber: '',
  isLoggedIn: false,
  userData: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLoginField: (state, action) => {
      state.loginField = action.payload;
    },
    setMembershipNumber: (state, action) => {
      state.membershipNumber = action.payload;
    },
    setUserData: (state, action) => {
      state.userData = action.payload;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.loginField = '';
      state.membershipNumber = '';
      state.isLoggedIn = false;
      state.userData = null;
    },
     clearUser: (state) => {
      state.membershipNumber = '';
      state.loginField = '';
    },
  },
});

export const { setLoginField, setMembershipNumber, setUserData, logout } = userSlice.actions;

export default userSlice.reducer;
