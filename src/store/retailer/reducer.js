import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  wholesalesProductList: [],
  outlet: {},
  cartItem: [],
  posMessage: false
};

export const retailerSlice = createSlice({
  name: 'retailer',
  initialState,
  reducers: {
    setWholesalesProductList(state, action) {
      state.wholesalesProductList = action.payload;
    },
    addWholesalesProductList(state, action) {
      state.wholesalesProductList = [
        ...state.wholesalesProductList,
        ...action.payload
      ];
    },
    updateWishlist(state, action) {
      const index = action.payload.index;
      state.wholesalesProductList[index].isInWishlist =
        !state.wholesalesProductList[index].isInWishlist;
    },
    defaultAddress(state, action) {
      state.outlet = action.payload;
    },
    updateCartItem(state, action) {
      state.cartItem = action.payload;
    },
    posSuccess: (state, action) => {
      state.posMessage = action.payload;
    }
    // removeWishlist(state, action) {
    //   state.wholesalesProductList = action.payload;
    // }
  }
});

export const {
  setWholesalesProductList,
  addWholesalesProductList,
  updateWishlist,
  defaultAddress,
  updateCartItem,
  posSuccess
  // removeWishlist
} = retailerSlice.actions;
