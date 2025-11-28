import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loginField: '',
  
  // Keep BOTH camelCase & snake_case synced
  membershipNumber: '',
  membership_number: '',
  
  isLoggedIn: false,
  user: null,
  token: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {

    // Store user login input (phone or email)
    setLoginField: (state, action) => {
      state.loginField = action.payload;
    },

    // Save membership number in both formats
    setMembershipNumber: (state, action) => {
      state.membershipNumber = action.payload;
      state.membership_number = action.payload;   // 🔥 required for API
    },

    // Save user & token after login
    setUserData: (state, action) => {
      state.user = action.payload.user || null;
      state.token = action.payload.token || null;
      state.isLoggedIn = true;

      // If backend sends membership number inside user object
      if (action.payload?.user?.membership_number) {
        state.membershipNumber = action.payload.user.membership_number;
        state.membership_number = action.payload.user.membership_number;
      }
    },

    // Clear ALL user data
    logout: (state) => {
      state.loginField = '';
      state.membershipNumber = '';
      state.membership_number = '';
      state.isLoggedIn = false;
      state.user = null;
      state.token = null;
    },

    // Clear membership only
    clearUser: (state) => {
      state.membershipNumber = '';
      state.membership_number = '';
      state.loginField = '';
    },
  },
});

export const {
  setLoginField,
  setMembershipNumber,
  setUserData,
  logout,
  clearUser,
} = authSlice.actions;

export default authSlice.reducer;
