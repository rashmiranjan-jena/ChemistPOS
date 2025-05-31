import React, { useState, useEffect } from "react";
import { Card, CardBody, Button, Badge, Spinner } from "reactstrap";
import { getPayable } from "../../ApiService/AccountingManagement/Payable";
import { useNavigate } from "react-router-dom";

const getSupplierStatus = async () => {
  try {
    const response = await getPayable();
    return (
      response?.map((item) => ({
        id: item?.invoice_id ?? null,
        name: item?.supplier_name ?? "N/A",
        invoiceNumber: item?.invoice_number ?? "N/A",
        deliveryDate: item?.invoice_date ?? "N/A",
        remaining_amount: item?.remaining_amount ?? 0,
        status: item?.status ?? "N/A",
      })) ?? []
    );
  } catch (error) {
    console.error(
      "Error fetching supplier status:",
      error?.response?.data?.message || error?.message
    );
    throw error;
  }
};

const SupplierStatus = () => {
  const navigate = useNavigate();
  const [supplierStatus, setSupplierStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSupplierStatus = async () => {
      try {
        const data = await getSupplierStatus();
        setSupplierStatus(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch supplier status");
        setLoading(false);
      }
    };

    fetchSupplierStatus();
  }, []);

  return (
    <Card
      className="glass-card mb-3 bottom-card-height"
      style={{ backgroundColor: "rgba(255, 255, 255, 0.85)" }}
    >
      <CardBody className="compact-card">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0" style={{ color: "#2d3748" }}>
            Supplier Pending Payment Status
          </h5>
          <Button
            color="link"
            size="sm"
            style={{ color: "#6b46c1" }}
            onClick={() => navigate("/payables-list")}
          >
            View All
          </Button>
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
            ) : supplierStatus?.length === 0 ? (
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
                {supplierStatus?.map((supplier) => (
                  <div
                    key={supplier?.id}
                    className="list-group-item list-group-item-action border-0 px-0 py-2"
                    style={{ backgroundColor: "transparent" }}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6
                          className="mb-1"
                          style={{ color: "#2d3748", fontSize: "14px" }}
                        >
                          {supplier?.name} - {supplier?.invoiceNumber}
                        </h6>
                        <small className="text-muted">
                          Remaining Amount: {supplier?.remaining_amount}
                        </small>
                      </div>
                      <Badge
                        color={
                          supplier?.status === "On Time"
                            ? "success"
                            : supplier?.status === "Delayed"
                            ? "danger"
                            : "warning"
                        }
                        style={{
                          backgroundColor:
                            supplier?.status === "On Time"
                              ? "#38b2ac"
                              : supplier?.status === "Delayed"
                              ? "#e53e3e"
                              : "#ed8936",
                          color: "white",
                        }}
                      >
                        {supplier?.status}
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

export default SupplierStatus;
