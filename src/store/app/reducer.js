import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  inventoryData: [],
  categoryList: [],
  warehouseId: '',
  aboutList: [],
  faqData: [],
  fetched: false,
  lastOrderObj: {},
  notificationCount: 0,
  socketConnection: {},
  termsARR: [],
  companyDetails: {}
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setCategoryList(state, action) {
      state.categoryList = action.payload;
    },
    setInventoryData(state, action) {
      state.inventoryData = action.payload;
    },
    setWarehouseId(state, action) {
      state.warehouseId = action.payload;
    },
    setAboutList(state, action) {
      state.aboutList = action.payload;
    },
    faqDataSuccess: (state, action) => {
      state.faqData = action.payload;
    },
    updateLastOrderObj: (state, action) => {
      state.lastOrderObj = action.payload;
    },
    socketSuccess: (state, action) => {
      state.socketConnection = action.payload;
    },
    updateNotificationCount(state, action) {
      state.notificationCount = action.payload;
    },
    ugradeNotificationGrade(state, action) {
      state.notificationCount += action.payload;
    },
    setTermsData(state, action) {
      state.termsARR = action.payload;
    },
    setCompanyDetails(state, action) {
      state.companyDetails = action.payload;
    }
  }
});

export const {
  setCategoryList,
  setInventoryData,
  setWarehouseId,
  setAboutList,
  faqDataSuccess,
  updateLastOrderObj,
  updateNotificationCount,
  socketSuccess,
  ugradeNotificationGrade,
  setTermsData,
  setCompanyDetails
} = appSlice.actions;
