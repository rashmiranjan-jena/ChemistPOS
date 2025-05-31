import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
// import { fetchStockData } from "../../ApiService/Stockinventory/Stockinventory";
import axios from "axios";
const LowStockAlert = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}api/stock-inventory/`)
        setOrders(response.data);
        checkLowStock(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    const checkLowStock = (data) => {
      const lowStockItems = data.filter((order) => order.quantity < 3);
      if (lowStockItems.length > 0) {
        Swal.fire({
          icon: "warning",
          title: "Low Stock Alert",
          html: `<p>Some items have quantities less than 3!</p>
                 <ul>
                   ${lowStockItems.map(item => `<li>${item.product_name} (Quantity ${item.quantity})</li>`).join('')}
                 </ul>`,
          timer: 30000,
          showConfirmButton: true,
          confirmButtonText: "OK",
        });
      }
    };

    const intervalId = setInterval(() => {
      fetchOrders();
    }, 900000); 

    fetchOrders();

    return () => clearInterval(intervalId);
  }, []);

  return null;
};

export default LowStockAlert;
