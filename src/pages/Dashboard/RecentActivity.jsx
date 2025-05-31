import React, { useState, useEffect } from "react";
import { Card, CardBody, Button, Spinner } from "reactstrap";
import PropTypes from "prop-types";
import {
  FaChevronRight,
  FaIndustry,
  FaShoppingCart,
  FaTruck,
  FaCheckCircle,
  FaCapsules,
  FaExclamationTriangle,
  FaChartLine,
} from "react-icons/fa";
import { getRecentActivity } from "../../ApiService/ChemistDashboard/RecentActivity";

const iconMap = {
  production: <FaIndustry className="text-primary" />,
  sale: <FaShoppingCart className="text-info" />,
  delivery: <FaTruck className="text-success" />,
  quality: <FaCheckCircle className="text-warning" />,
  stock: <FaCapsules className="text-primary" />,
  return: <FaExclamationTriangle className="text-danger" />,
  report: <FaChartLine className="text-success" />,
};

const RecentActivity = () => {
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        const data = await getRecentActivity();
        const mappedData =
          data?.map((item) => ({
            action: item?.action ?? "N/A",
            time: item?.time ?? "N/A",
            icon: iconMap[item?.type] ?? (
              <FaCapsules className="text-primary" />
            ),
          })) ?? [];
        setRecentActivity(mappedData);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch recent activity");
        setLoading(false);
      }
    };

    // Initial fetch
    fetchRecentActivity();

    // Set up interval to refresh data every 15 minutes
    const intervalId = setInterval(fetchRecentActivity, 15 * 60 * 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Card
      className="glass-card mb-3 bottom-card-height"
      style={{ backgroundColor: "rgba(255, 255, 255, 0.85)" }}
    >
      <CardBody className="compact-card">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0" style={{ color: "#2d3748" }}>
            Recent Activity
          </h5>
        </div>
        <div
          className="scrollable-container"
          style={{
            maxHeight: "220px",
            maxWidth: "100%",
            overflow: "auto",
            scrollbarWidth: "thin",
            scrollbarColor: "#6b46c1 #f1f5f9",
          }}
        >
          <div style={{ minWidth: "700px" }}>
            {loading ? (
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ minHeight: "150px" }}
              >
                <Spinner
                  color="primary"
                  style={{ width: "3rem", height: "3rem" }}
                />
              </div>
            ) : error ? (
              <div
                className="text-center text-muted"
                style={{
                  minHeight: "150px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {error}
              </div>
            ) : recentActivity?.length === 0 ? (
              <div
                className="text-center text-muted"
                style={{
                  minHeight: "150px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                No Data Found
              </div>
            ) : (
              <div className="list-group list-group-flush">
                {recentActivity?.map((activity, index) => (
                  <div
                    key={index}
                    className="list-group-item list-group-item-action border-0 px-0 py-2"
                    style={{ backgroundColor: "transparent" }}
                  >
                    <div className="d-flex align-items-center">
                      <div
                        className="p-2 rounded me-3"
                        style={{
                          backgroundColor: "rgba(108, 70, 193, 0.1)",
                        }}
                      >
                        {activity.icon}
                      </div>
                      <div className="flex-grow-1">
                        <h6
                          className="mb-1"
                          style={{ color: "#2d3748", fontSize: "14px" }}
                        >
                          {activity.action}
                        </h6>
                        <small className="text-muted">{activity.time}</small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

RecentActivity.propTypes = {};

export default RecentActivity;
