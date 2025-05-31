import React, { useState, useEffect } from "react";
import { Card, CardBody, Button, Spinner } from "reactstrap";
import PropTypes from "prop-types";
import { Doughnut } from "react-chartjs-2";
import { getInventoryData } from "../../ApiService/ChemistDashboard/InentoryStatus";

const InventoryStatus = ({ refreshKey }) => {
  const [activeView, setActiveView] = useState("medical");
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInventoryData = async (type) => {
  try {
    setLoading(true);
    const data = await getInventoryData(type);
    setChartData({
      labels: [
        "Available Stock",
        "Low Stock",
        "Out of Stock",
        "Expired Stock",
      ],
      datasets: [
        {
          data: [
            data?.available_stock?.total_quantity ?? 0,
            data?.low_stock?.total_quantity ?? 0,
            data?.out_of_stock?.total_quantity ?? 0,
            data?.expired_stock?.total_quantity ?? 0,
          ],
          backgroundColor: ["#38b2ac", "#6b46c1", "#ed8936", "#e53e3e"],
          borderColor: "transparent",
        },
      ],
    });
    setError(null);
  } catch (err) {
    setError(err?.message ?? "Failed to fetch inventory data");
    setChartData(null);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchInventoryData(activeView === "medical" ? "medical" : "nonmedical");
  }, [activeView, refreshKey]);

  const handleViewChange = (view) => {
    setActiveView(view);
  };

  return (
    <Card className="glass-card mb-3 uniform-height">
      <CardBody className="compact-card">
        <h5 style={{ color: "#2d3748" }} className="mb-3">
          {activeView === "medical" ? "Medical" : "Non-Medical"} Inventory
          Status
        </h5>
        <div className="d-flex flex-row mb-3">
          <Button
            color={activeView === "medical" ? "primary" : "secondary"}
            size="sm"
            onClick={() => handleViewChange("medical")}
            className="me-2"
            style={{ minWidth: "100px" }}
          >
            Medical
          </Button>
          <Button
            color={activeView === "non-medical" ? "primary" : "secondary"}
            size="sm"
            onClick={() => handleViewChange("non-medical")}
            style={{ minWidth: "100px" }}
          >
            Non-Medical
          </Button>
        </div>
        <div style={{ height: "250px" }}>
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
          ) : !chartData?.datasets?.[0]?.data?.some((val) => val > 0) ? (
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
            <Doughnut
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                cutout: "70%",
                plugins: {
                  legend: {
                    position: "bottom",
                    labels: {
                      padding: 15,
                      usePointStyle: true,
                      pointStyle: "circle",
                      font: { family: "'Inter', sans-serif", size: 12 },
                    },
                  },
                  tooltip: {
                    backgroundColor: "#2d3748",
                    padding: 12,
                    cornerRadius: 8,
                  },
                },
              }}
            />
          )}
        </div>
      </CardBody>
    </Card>
  );
};

InventoryStatus.propTypes = {
  refreshKey: PropTypes.number.isRequired,
};

export default InventoryStatus;
