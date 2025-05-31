import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;
export const getEmployee = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/employee-handler`);
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ?? "Failed to fetch employee"
    );
  }
};

export const postSalary = async (formData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/salary-handler/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response?.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Failed to submit TCS");
  }
};

export const getSalaries = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/salary-handler/`);
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ?? "Failed to fetch employee"
    );
  }
};

export const deleteSalary = async (id) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/salary-handler/?id=${id}`
    );
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Failed to delete Salary"
    );
  }
};

export const getSalaryById = async (id) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/salary-handler/?id=${id}`
    );
    return response?.data;
  } catch (error) {
    throw error;
  }
};

export const updateSalary = async (id, formData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/salary-handler/?id=${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response?.data;
  } catch (error) {
    throw error;
  }
};

export const getExpenseCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/expenses-category/`);
    return response?.data;
  } catch (error) {
    console.error("Error fetching expense categories:", error);
    throw error;
  }
};

export const createExpenseCategory = async (categoryData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/expenses-category/`,
      categoryData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating expense category:", error);
    throw error;
  }
};

export const postExpenseData = async (expenseData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/expenses-handler/`,
      expenseData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating expense:", error);
    throw error;
  }
};

export const getExpenses = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/expenses-handler/`);
    return response?.data;
  } catch (error) {
    console.error("Error fetching expense categories:", error);
    throw error;
  }
};

export const deleteExpense = async (id) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/expenses-handler/?id=${id}`
    );
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Failed to delete expenses"
    );
  }
};



export const getExpenseById = async (id) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/expenses-handler/?id=${id}`
    );
    return response?.data;
  } catch (error) {
    throw error;
  }
};




export const updateExpense = async (id, formData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/expenses-handler/?id=${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response?.data;
  } catch (error) {
    throw error;
  }
};