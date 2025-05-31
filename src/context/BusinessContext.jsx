import { createContext, useContext, useReducer } from 'react';

// Initial state (same as before)
const initialState = {
    isEdit: false,
    // page1: {
    //     storeName: "",
    //     alias: "",
    //     address1: "",
    //     address2: "",
    //     city: "",
    //     district: "",
    //     state: "",
    //     country: "",
    //     pinCode: "",
    // },
    // page2: {
    //     name: "",
    //     phone_no: "",
    //     email_id: "",
    //     city: "",
    //     district: "",
    //     state: "",
    //     country: "",
    //     pin_code: "",
    //     address_1: "",
    //     address_2: "",
    //     landmark: "",
    //     phone_no_2: "",
    //     website: "",
    // },
    // page3: {
    //     licence_issued_by: "",
    //     type_of_licence: "",
    //     licence_no: "",
    // },
    // page4: {
    //     businessType: "",
    //     gstNo: "",
    //     fssaiLicenceNo: "",
    //     shopActRegNo: "",
    // },
};

// Reducer function
const businessReducer = (state, action) => {
    switch (action.type) {
        case 'UPDATE_PAGE1':
            return {
                ...state,
                page1: { ...state.page1, ...action.payload }
            };
        case 'UPDATE_PAGE2':
            return {
                ...state,
                page2: { ...state.page2, ...action.payload }
            };
        case 'UPDATE_PAGE3':
            return {
                ...state,
                page3: { ...state.page3, ...action.payload }
            };
        case 'UPDATE_PAGE4':
            return {
                ...state,
                page4: { ...state.page4, ...action.payload }
            };
        case 'SET_IS_EDIT':
            return {
                ...state,
                isEdit: action.payload
            };
        case 'RESET':
            return initialState;
        default:
            return state;
    }
};

// Create context
const BusinessContext = createContext();

// Provider component
export const BusinessProvider = ({ children }) => {
    const [state, dispatch] = useReducer(businessReducer, initialState);

    // Action creators
    const updatePage1Data = (data) => {
        dispatch({ type: 'UPDATE_PAGE1', payload: data });
    };

    const updatePage2Data = (data) => {
        dispatch({ type: 'UPDATE_PAGE2', payload: data });
    };

    const updatePage3Data = (data) => {
        dispatch({ type: 'UPDATE_PAGE3', payload: data });
    };

    const updatePage4Data = (data) => {
        dispatch({ type: 'UPDATE_PAGE4', payload: data });
    };

    const setIsEdit = (value) => {
        dispatch({ type: 'SET_IS_EDIT', payload: value });
    };

    const resetBusinessData = () => {
        dispatch({ type: 'RESET' });
    };

    const value = {
        state,
        updatePage1Data,
        updatePage2Data,
        updatePage3Data,
        updatePage4Data,
        setIsEdit,
        resetBusinessData
    };

    return (
        <BusinessContext.Provider value={value}>
            {children}
        </BusinessContext.Provider>
    );
};

// Custom hook to use the context
export const useBusiness = () => {
    const context = useContext(BusinessContext);
    if (!context) {
        throw new Error('useBusiness must be used within a BusinessProvider');
    }
    return context;
};