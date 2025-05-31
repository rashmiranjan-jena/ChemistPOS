import React, { useState, useEffect } from "react";
import { Card, CardBody, Spinner } from "reactstrap";
import PropTypes from "prop-types";
import { Pie } from "react-chartjs-2";
import { getMedicineDistribution } from "../../ApiService/ChemistDashboard/MedicineDistribution";

const MedicineDistribution = ({ refreshKey }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getMedicineDistribution();
        const data = response;
      
        console.log("Medicine Distribution Data:", data);

        const labels = data?.map((item) => item?.unit_type) || [];
        const quantities = data?.map((item) => item?.unit_total_quantity) || [];
        const backgroundColors = [
          "#6b46c1",
          "#4299e1",
          "#ed8936",
          "#38b2ac",
          "#f56565",
          "#805ad5",
        ].slice(0, labels.length);

        setChartData({
          labels,
          datasets: [
            {
              data: quantities.map((v) =>
                Math.round(v * (1 + refreshKey * 0.03))
              ),
              backgroundColor: backgroundColors,
              borderColor: "transparent",
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching medicine distribution data:", error);
      }
    };

    fetchData();
  }, [refreshKey]);

  if (!chartData) {
    return (
      <Card className="glass-card mb-3 uniform-height">
        <CardBody className="compact-card">
          <h5 className="mb-3" style={{ color: "#2d3748" }}>
            Medicine Distribution
          </h5>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "250px",
            }}
          >
            <Spinner
              color="primary"
              style={{ width: "3rem", height: "3rem" }}
            />
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="glass-card mb-3 uniform-height">
      <CardBody className="compact-card">
        <h5 className="mb-3" style={{ color: "#2d3748" }}>
          Medicine Distribution
        </h5>
        <div style={{ height: "250px" }}>
          <Pie
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
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
        </div>
      </CardBody>
    </Card>
  );
};

MedicineDistribution.propTypes = {
  refreshKey: PropTypes.number.isRequired,
};

export default MedicineDistribution;
