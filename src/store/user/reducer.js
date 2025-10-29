import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  userDetail: {},
  userDraftData: {},
  userLoginInfo: {
    email: '',
    password: '',
    remember: false
  },
  historyList: [],
  agreeTerms: false,
  versionStatus: null
};

export const authSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserDetail(state, action) {
      state.userDetail = action.payload;
    },
    setUserLoginInfo(state, action) {
      state.userLoginInfo = action.payload;
    },
    toggleDefaultAddress(state, action) {
      const { id } = action.payload;
      state.userDetail?.addresses?.forEach((address) => {
        if (address?.id === id) {
          address.is_default = 1; // Set selected address to default
        } else {
          address.is_default = 0; // Reset others to non-default
        }
      });
    },
    deleteWarehouseAddress(state, action) {
      const { id } = action.payload;
      state.userDetail.addresses = state.userDetail.addresses.filter(
        (address) => address.id !== id
      );
    },
    storeNewDraftData(state, action) {
      state.userDraftData = { ...action.payload };
    },
    updateDraftData(state, action) {
      state.userDraftData = { ...state.userDraftData, ...action.payload };
    },
    deleteDraftData(state) {
      state.userDraftData = {};
    },
    updateHistoryList(state, action) {
      if (state.historyList && state.historyList.length >= 3) {
        state.historyList = [action.payload, ...state.historyList.slice(0, -1)];
      } else {
        state.historyList = state.historyList
          ? [action.payload, ...state.historyList]
          : [action.payload];
      }
    },
    setHistoryList(state, action) {
      state.historyList = action.payload;
    },
    setAgreeTerms(state, action) {
      state.agreeTerms = action.payload;
    },
    setVersionStatus(state, action) {
      state.versionStatus = action.payload;
    },
    updateUserDetailOrderCount(state, action) {
      state.userDetail = {
        ...state.userDetail,
        orderCount: state.userDetail.orderCount + action.payload
      };
    }
  }
});

export const {
  setUserDetail,
  toggleDefaultAddress,
  deleteWarehouseAddress,
  updateDraftData,
  deleteDraftData,
  storeNewDraftData,
  setUserLoginInfo,
  updateHistoryList,
  setHistoryList,
  setAgreeTerms,
  setVersionStatus,
  updateUserDetailOrderCount
} = authSlice.actions;
