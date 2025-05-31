import React, { useState, useEffect } from "react";
import { Card, CardBody, Badge, Spinner } from "reactstrap";
import { FaCapsules } from "react-icons/fa";
import { getTopSellingMedicines } from "../../ApiService/ChemistDashboard/TopSellingMedicine";

const TopSellingMedicines = () => {
  const [topSales, setTopSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopSales = async () => {
      try {
        const data = await getTopSellingMedicines();
        const mappedData =
          data?.top_selling_drugs?.map((item) => ({
            name: item?.name ?? "N/A",
            unitsSold: item?.total_quantity ?? 0,
          })) ?? [];
        setTopSales(mappedData);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch top selling medicines");
        setLoading(false);
      }
    };

    fetchTopSales();
  }, []);

  return (
    <Card
      className="glass-card mb-3 bottom-card-height"
      style={{ backgroundColor: "rgba(255, 255, 255, 0.85)" }}
    >
      <CardBody className="compact-card">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0" style={{ color: "#2d3748" }}>
            Top Selling Medicines
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
          <div style={{ minWidth: "900px" }}>
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
            ) : topSales?.length === 0 ? (
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
              <table className="table table-borderless mb-0">
                <thead>
                  <tr>
                    <th style={{ color: "#718096", fontSize: "14px" }}>Rank</th>
                    <th style={{ color: "#718096", fontSize: "14px" }}>
                      Medicine
                    </th>
                    <th style={{ color: "#718096", fontSize: "14px" }}>
                      Units Sold
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topSales.map((sale, index) => (
                    <tr key={index}>
                      <td>
                        <Badge
                          color={
                            index === 0
                              ? "success"
                              : index === 1
                              ? "warning"
                              : index === 2
                              ? "danger"
                              : "info"
                          }
                          pill
                        >
                          #{index + 1}
                        </Badge>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div
                            className="p-2 rounded me-2"
                            style={{
                              backgroundColor: "rgba(108, 70, 193, 0.1)",
                            }}
                          >
                            <FaCapsules className="text-primary" />
                          </div>
                          <span style={{ color: "#4a5568" }}>{sale.name}</span>
                        </div>
                      </td>
                      <td>
                        <Badge color="primary" pill>
                          {sale.unitsSold} Units
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default TopSellingMedicines;
