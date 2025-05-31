import axios from "axios";
import Swal from "sweetalert2";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/team-member/`;

// Function to post the testimonial data
export const addTeamMember = async (teamMemberData) => {
  try {
    const response = await axios.post(`${API_URL}`, teamMemberData, {
      headers: {
        "Content-Type": "multipart/form-data", 
      },
    });
    return response.data; 
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.response?.data?.message || "Error posting Team Meamber",
    });
    throw new Error(error.response?.data?.message || "Error posting Team Meamber");
  }
};


export const fetchTeamMembers = async () => {
  try {
    const response = await axios.get(`${API_URL}`);
    return response.data;
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to load team members",
    });
    throw error;
  }
};

// Update team member status (PUT request)
export const updateMemberStatus = async (id, status) => {
  try {
    const response = await axios.put(`${API_URL}?member_id=${id}`, { status });
    return response.data;
  } catch (error) {
    console.error("Error updating member status:", error);
    throw error;
  }
};


// Delete team member (DELETE request)
export const deleteTeamMember = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}?member_id=${id}`);
    return response.data;  
  } catch (error) {
    throw new Error("Failed to delete testimonial");
  }
};

export const getTeamMemberByID = async (id) => {
  try {
    const response = await axios.get(`${API_URL}?member_id=${id}`);
    return response.data;
  } catch (error) {
    console.error("Error getting team member by ID:", error);
    throw error;
  }
}



export const editTeamMemberbyID = async (id, formData) => {
  try {
    const response = await axios.put(`${API_URL}?member_id=${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error editing team member by ID:", error);
    throw error;
  }
};
