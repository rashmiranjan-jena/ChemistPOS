import axios from "axios";

const apiUrl = `${import.meta.env.VITE_API_BASE_URL}api`;

export const postAgentData = async (formData) => {
  try {
    const response = await axios.post(`${apiUrl}/agent_handler/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error during form submission:", error);
    throw error;
  }
};

export const getAgentData = async () => {
  try {
    const response = await axios.get(`${apiUrl}/agent_handler/`);
    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateAgentStatus = async (id, status) => {
  try {
    const response = await axios.put(
      `${apiUrl}/agent_handler/?agent_id=${id}`,
      { status }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating agent status:", error);
    return { success: false };
  }
};

export const deleteAgent = async (agentId) => {
  try {
    const response = await axios.delete(
      `${apiUrl}/agent_handler/?agent_id=${agentId}`
    );

    return response;
  } catch (error) {
    console.error("Error deleting agent:", error);
  }
};

export const getAgentById = async (id) => {
  try {
    const response = await axios.get(`${apiUrl}/agent_handler/?agent_id=${id}`);
    return response;
  } catch (error) {
    console.error("Error fetching agent data:", error);
    throw error;
  }
};

export const updateAgentData = async (id, data) => {
  try {
    const response = await axios.put(
      `${apiUrl}/agent_handler/?agent_id=${id}`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating agent data:", error);
    throw error;
  }
};
