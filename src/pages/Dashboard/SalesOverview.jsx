import React, { useState, useEffect } from "react";
import { Card, CardBody, Button, Spinner } from "reactstrap";
import PropTypes from "prop-types";
import { Line } from "react-chartjs-2";
import { fetchSalesData } from "../../ApiService/ChemistDashboard/SalesOverView";

const SalesOverview = ({ refreshKey }) => {
  const [period, setPeriod] = useState("day");
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{ label: "Sales", data: [] }],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true); // Set loading to true before fetching
      try {
        const data = await fetchSalesData(period);
        setChartData(data);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      } finally {
        setIsLoading(false); // Set loading to false after fetch completes
      }
    };
    loadData();
  }, [period, refreshKey]);

  return (
    <Card className="glass-card mb-3 uniform-height">
      <CardBody className="compact-card">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0" style={{ color: "#2d3748" }}>
            Sales Overview
          </h5>
          <div>
            <Button
              color="link"
              size="sm"
              style={{ color: "#6b46c1" }}
              onClick={() => setPeriod("day")}
            >
              Day
            </Button>
            <Button
              color="link"
              size="sm"
              style={{ color: "#6b46c1" }}
              onClick={() => setPeriod("weekly")}
            >
              Week
            </Button>
            <Button
              color="link"
              size="sm"
              style={{ color: "#6b46c1" }}
              onClick={() => setPeriod("monthly")}
            >
              Month
            </Button>
            <Button
              color="link"
              size="sm"
              style={{ color: "#6b46c1" }}
              onClick={() => setPeriod("yearly")}
            >
              Year
            </Button>
          </div>
        </div>
        <div
          style={{
            height: "250px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isLoading ? (
            <Spinner
              color="primary"
              style={{ width: "3rem", height: "3rem" }}
            />
          ) : (
            <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "top",
                    labels: { font: { size: 12 } },
                  },
                  tooltip: {
                    backgroundColor: "#2d3748",
                    titleFont: { size: 14, weight: "bold" },
                    bodyFont: { size: 12 },
                    padding: 12,
                    cornerRadius: 8,
                  },
                },
                scales: {
                  x: {
                    grid: { display: false },
                    ticks: { color: "#718096" },
                  },
                  y: {
                    grid: { color: "rgba(226, 232, 240, 0.3)" },
                    ticks: { color: "#718096" },
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

SalesOverview.propTypes = {
  refreshKey: PropTypes.number.isRequired,
};

export default SalesOverview;
