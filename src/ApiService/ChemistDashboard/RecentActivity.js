import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

export const getRecentActivity = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/recent-activity/`);
    const { expiring_stocks, pending_demands } = response.data;
    const stockActivities = expiring_stocks.map((stock) => ({
      action: `Stock expiring: Batch ${stock.batch_no} (${stock.quantity} units)`,
      time: `${stock.days_to_expiry} days to expiry on ${stock.expire_date}`,
      type: "stock",
    }));

    const demandActivities = pending_demands.map((demand) => ({
      action: `Pending demand from ${demand.customer_name} (Mob: ${demand.mob_no})`,
      time: `${demand.days_since_request} days since request on ${demand.estd_date}`,
      type: "sale",
    }));

    return [...stockActivities, ...demandActivities];
  } catch (error) {
    console.log(error);
    throw error;
  }
};
