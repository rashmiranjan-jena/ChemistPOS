// src/store/businessSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isEdit: false,
  page1: {
    storeName: "",
    alias: "",
    address1: "",
    address2: "",
    city: "",
    district: "",
    state: "",
    country: "",
    pinCode: "",
  },
  page2: {
    name: "",
    phone_no: "",
    email_id: "",
    city: "",
    district: "",
    state: "",
    country: "",
    pin_code: "",
    address_1: "",
    address_2: "",
    landmark: "",
    phone_no_2: "",
    website: "",
  },
  page3: {
    licence_issued_by: "",
    type_of_licence: "",
    licence_no: "",
  },
  page4: {
    businessType: "",
    gstNo: "",
    fssaiLicenceNo: "",
    shopActRegNo: "",
  },
};

const businessSlice = createSlice({
  name: "business",
  initialState,
  reducers: {
    updatePage1Data: (state, action) => {
      state.page1 = { ...state.page1, ...action.payload };
    },
    updatePage2Data: (state, action) => {
      state.page2 = { ...state.page2, ...action.payload };
    },
    updatePage3Data: (state, action) => {
      state.page3 = { ...state.page3, ...action.payload };
    },
    updatePage4Data: (state, action) => {
      state.page4 = { ...state.page4, ...action.payload };
    },
    setIsEdit: (state, action) => {
        state.isEdit = action.payload; // Reducer to toggle isEdit
      },
    resetBusinessData: () => initialState, // Optional: reset data after submission
  },
});

export const {
  updatePage1Data,
  updatePage2Data,
  updatePage3Data,
  updatePage4Data,
  resetBusinessData,
  setIsEdit,
} = businessSlice.actions;

export default businessSlice.reducer;