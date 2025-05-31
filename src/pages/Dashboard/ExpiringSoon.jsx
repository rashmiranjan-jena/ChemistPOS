import React, { useState, useEffect } from "react";
import { Card, CardBody, Badge, Spinner } from "reactstrap";
import { FaExclamationTriangle } from "react-icons/fa";
import { getAboutToExpireInventory } from "../../ApiService/InventoryManagement/AboutToExpire";

const ExpiringSoon = () => {
  const [expiringMedicines, setExpiringMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExpiringMedicines = async () => {
      try {
        const data = await getAboutToExpireInventory();
        setExpiringMedicines(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch expiring inventory");
        setLoading(false);
      }
    };

    fetchExpiringMedicines();
  }, []);

  return (
    <Card
      className="glass-card mb-3 bottom-card-height"
      style={{
        backgroundColor: "rgba(254, 252, 191, 0.3)",
        border: "1px solid rgba(254, 235, 200, 0.5)",
      }}
    >
      <CardBody className="compact-card">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0" style={{ color: "#9c4221" }}>
            <FaExclamationTriangle className="me-2" />
            Expiring Soon
          </h5>
          <Badge
            color="warning"
            pill
            style={{ backgroundColor: "#ed8936", color: "white" }}
          >
            {expiringMedicines?.length ?? 0} Items
          </Badge>
        </div>
        <div
          className="scrollable-container"
          style={{
            maxHeight: "220px",
            maxWidth: "100%",
            overflow: "auto",
            scrollbarWidth: "thin",
            scrollbarColor: "#ed8936 #fefcbf",
          }}
        >
          <div style={{ minWidth: "600px" }}>
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
            ) : expiringMedicines?.length === 0 ? (
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
                {expiringMedicines?.map((medicine) => (
                  <div
                    key={medicine?.id}
                    className="list-group-item list-group-item-action border-0 px-0 py-2"
                    style={{ backgroundColor: "transparent" }}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6
                          className="mb-1"
                          style={{ color: "#9c4221", fontSize: "14px" }}
                        >
                          {medicine?.productName} (Batch:{" "}
                          {medicine?.batchNumber})
                        </h6>
                        <small className="text-muted">
                          Expires: {medicine?.expiryDate}
                        </small>
                      </div>
                      <Badge
                        color={
                          medicine?.daysToExpire < 20 ? "danger" : "warning"
                        }
                        style={{
                          backgroundColor:
                            medicine?.daysToExpire < 20 ? "#e53e3e" : "#ed8936",
                          color: "white",
                        }}
                      >
                        {medicine?.daysToExpire} days
                      </Badge>
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

export default ExpiringSoon;
