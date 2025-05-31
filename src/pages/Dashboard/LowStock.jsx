import React, { useState, useEffect } from "react";
import { Card, CardBody, Button, Badge, Spinner } from "reactstrap";
import { FaExclamationTriangle } from "react-icons/fa";
import { getlowStockInventory } from "../../ApiService/InventoryManagement/LowStockInventory";
import { useNavigate } from "react-router-dom";

const LowStock = () => {
  const [shortMedicines, setShortMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLowStockInventory = async () => {
      try {
        const data = await getlowStockInventory();
        const mappedData =
          data?.low_stock_drugs?.map((item) => ({
            id: item?.drug_id ?? null,
            name: item?.drug_name ?? "N/A",
            quantity: item?.current_stock ?? 0,
            threshold: item?.reorder_level ?? 0,
            supplier: item?.suppliers ?? "N/A",
          })) ?? [];
        setShortMedicines(mappedData);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch low stock inventory");
        setLoading(false);
      }
    };

    fetchLowStockInventory();
  }, []);

  return (
    <Card
      className="glass-card mb-3 bottom-card-height"
      style={{
        backgroundColor: "rgba(254, 215, 215, 0.3)",
        border: "1px solid rgba(254, 215, 215, 0.5)",
      }}
    >
      <CardBody className="compact-card">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0" style={{ color: "#9b2c2c" }}>
            <FaExclamationTriangle className="me-2" />
            Low Stock
          </h5>
          <Badge
            color="danger"
            pill
            style={{ backgroundColor: "#e53e3e", color: "white" }}
          >
            {shortMedicines?.length ?? 0} Items
          </Badge>
        </div>
        <div
          className="scrollable-container"
          style={{
            maxHeight: "220px",
            maxWidth: "100%",
            overflow: "auto",
            scrollbarWidth: "thin",
            scrollbarColor: "#e53e3e #fed7d7",
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
            ) : shortMedicines?.length === 0 ? (
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
                {shortMedicines?.map((medicine) => (
                  <div
                    key={medicine?.id}
                    className="list-group-item list-group-item-action border-0 px-0 py-2"
                    style={{ backgroundColor: "transparent" }}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6
                          className="mb-1"
                          style={{ color: "#9b2c2c", fontSize: "14px" }}
                        >
                          {medicine?.name}
                        </h6>
                        <small className="text-muted">
                          Current: {medicine?.quantity} (Reorder:{" "}
                          {medicine?.threshold})
                        </small>
                      </div>
                      <Button
                        color="primary"
                        size="sm"
                        className="gradient-btn"
                        data-bs-toggle="tooltip"
                        title="View Details"
                        onClick={() => {navigate(`/low-stock-inventory`)}}
                      >
                        View
                      </Button>
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

export default LowStock;
