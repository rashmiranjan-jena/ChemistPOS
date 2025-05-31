import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

export const fetchSalesData = async (period) => {
  console.log(period);
  try {
    const response = await axios.get(`${API_BASE_URL}/sales-summary/`, {
      params: { filter: period },
    });

    const results = response?.data?.results ?? [];

    return {
      labels: results.map((item) => item?.label ?? ""),
      datasets: [
        {
          label: "Sales",
          data: results.map((item) => Math.round(item?.total ?? 0)),
          backgroundColor: "rgba(108, 70, 193, 0.2)",
          borderColor: "rgba(108, 70, 193, 1)",
          borderWidth: 2,
          pointBackgroundColor: "rgba(108, 70, 193, 1)",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 1,
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: true,
          tension: 0.4,
        },
      ],
    };
  } catch (error) {
    console.error("Error fetching sales data:", error);
    return {
      labels: [],
      datasets: [
        {
          label: "Sales",
          data: [],
          backgroundColor: "rgba(108, 70, 193, 0.2)",
          borderColor: "rgba(108, 70, 193, 1)",
          borderWidth: 2,
          pointBackgroundColor: "rgba(108, 70, 193, 1)",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 1,
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: true,
          tension: 0.4,
        },
      ],
    };
  }
};
