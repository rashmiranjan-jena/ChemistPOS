import axios from 'axios';
import Swal from 'sweetalert2';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api/coupon-master/`;

// Post data to API
export const postDiscountCode = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}`, data);
    return response.data;
  } catch (error) {
    const backendMessage = error?.response?.data?.message || error?.response?.data?.error;
    const errorMessage = backendMessage || 'Failed to post discount code. Please try again later.';
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: errorMessage,
    });
    throw error;
  }
};

// Function to get the list of coupons
export const getCoupons = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}`);
    return response.data;
  } catch (error) {
    const backendMessage = error?.response?.data?.message || error?.response?.data?.error;
    const errorMessage = backendMessage || 'Failed to fetch coupons. Please check your connection and try again.';
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: errorMessage,
    });
    throw error;
  }
};

// Function to update the coupon status
export const updateCouponStatus = async (couponId, newStatus) => {
  try {
    const response = await axios.put(`${API_BASE_URL}?coupon_id=${couponId}`, {  status: newStatus, });
    return response.data;
  } catch (error) {
    const backendMessage = error?.response?.data?.message || error?.response?.data?.error;
    const errorMessage = backendMessage || 'Failed to update the coupon status. Please try again later.';
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: errorMessage,
    });
    throw error;
  }
};


export const deleteCoupon = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}?coupon_id=${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};


// Function to get discount code by ID
export const getDiscountCodeById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}?coupon_id=${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching discount code by ID:", error);
    throw error;
  }
};


// Function to update an existing discount code
export const updateDiscountCode = async (id, payload) => {
  try {
    const response = await axios.put(`${API_BASE_URL}?coupon_id=${id}`, payload);
    return response.data;
  } catch (error) {
    console.error("Error updating discount code:", error);
    throw error;
  }
};
