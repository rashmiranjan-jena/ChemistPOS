// src/store/businessReducer.js
export const initialState = {
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

// Action Types
export const UPDATE_PAGE1_DATA = 'UPDATE_PAGE1_DATA';
export const UPDATE_PAGE2_DATA = 'UPDATE_PAGE2_DATA';
export const UPDATE_PAGE3_DATA = 'UPDATE_PAGE3_DATA';
export const UPDATE_PAGE4_DATA = 'UPDATE_PAGE4_DATA';
export const SET_IS_EDIT = 'SET_IS_EDIT';
export const RESET_BUSINESS_DATA = 'RESET_BUSINESS_DATA';

// Action Creators
export const updatePage1Data = (payload) => ({ type: UPDATE_PAGE1_DATA, payload });
export const updatePage2Data = (payload) => ({ type: UPDATE_PAGE2_DATA, payload });
export const updatePage3Data = (payload) => ({ type: UPDATE_PAGE3_DATA, payload });
export const updatePage4Data = (payload) => ({ type: UPDATE_PAGE4_DATA, payload });
export const setIsEdit = (payload) => ({ type: SET_IS_EDIT, payload });
export const resetBusinessData = () => ({ type: RESET_BUSINESS_DATA });

// Reducer
const businessReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_PAGE1_DATA:
            return {
                ...state,
                page1: { ...state.page1, ...action.payload }
            };
        case UPDATE_PAGE2_DATA:
            return {
                ...state,
                page2: { ...state.page2, ...action.payload }
            };
        case UPDATE_PAGE3_DATA:
            return {
                ...state,
                page3: { ...state.page3, ...action.payload }
            };
        case UPDATE_PAGE4_DATA:
            return {
                ...state,
                page4: { ...state.page4, ...action.payload }
            };
        case SET_IS_EDIT:
            return {
                ...state,
                isEdit: action.payload
            };
        case RESET_BUSINESS_DATA:
            return initialState;
        default:
            return state;
    }
};

export default businessReducer;