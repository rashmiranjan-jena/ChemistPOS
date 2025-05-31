import axios from "axios";

// Function to submit policy content
export const submitPolicyContent = async (policyContent) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}api/company-policies/`, {
      company_policy_data: policyContent,
    });
    return response.data;
  } catch (error) {
    console.error("Error submitting policy content:", error);
    throw error; 
  }
};
