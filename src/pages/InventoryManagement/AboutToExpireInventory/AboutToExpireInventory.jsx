import React, { useState, useEffect } from "react";
import { Button, Card, CardBody, Col, Container, Row, Table } from "reactstrap";
import { FaFileExcel, FaExclamationTriangle } from "react-icons/fa";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";
import { getAboutToExpireInventory } from "../../../ApiService/InventoryManagement/AboutToExpire";

const AboutToExpireInventory = () => {
  const navigate = useNavigate();
  const [aboutToExpireDrugs, setAboutToExpireDrugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAboutToExpireInventory();
        console.log('Transformed Data:', data);
        setAboutToExpireDrugs(data ?? []);
        setLoading(false);
      } catch (err) {
        console.error('Fetch Error:', err?.message);
        setError(err?.message ?? 'Failed to load inventory data');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const handleExcelDownload = () => {
    const headers = [
      "Sr.No",
      "ID",
      "Product Name",
      "Product ID",
      "Batch Number",
      "Expiry Date",
      "Days To Expire",
      "Quantity",
      "Supplier",
      "Status",
    ];
    const rows = aboutToExpireDrugs.map((drug, index) => [
      index + 1,
      drug?.id ?? 'N/A',
      drug?.productName ?? 'N/A',
      drug?.productId ?? 'N/A',
      drug?.batchNumber ?? 'N/A',
      drug?.expiryDate ?? 'N/A',
      drug?.daysToExpire ?? 0,
     
      drug?.quantity ?? 0,
      drug?.supplier ?? 'N/A',
      drug?.daysToExpire <= 15 ? "Urgent" : "Warning",
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "about_to_expire_inventory.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="Inventory" breadcrumbItem="About to Expire Drugs" />

        <Row>
          <Col xs="12">
            <Card
              className="shadow-lg"
              style={{
                borderRadius: "20px",
                overflow: "hidden",
                background: "#f8f9fa",
              }}
            >
              <CardBody className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
                  <h4
                    className="text-primary"
                    style={{
                      fontWeight: "700",
                      letterSpacing: "1px",
                      background: "linear-gradient(90deg, #ff9800, #f44336)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    <FaExclamationTriangle className="me-2" />
                    About to Expire Inventory
                  </h4>
                  <div className="d-flex flex-wrap gap-2">
                    <Button
                      color="warning"
                      onClick={() => navigate("/product-return")}
                      style={{
                        height: "35px",
                        padding: "3px 10px 3px 10px",
                        borderRadius: "10px",
                        fontSize: "14px",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                        transition: "transform 0.3s ease",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                      className="hover-scale"
                    >
                      <i
                        className="bx bx-transfer"
                        style={{ fontSize: "18px" }}
                      ></i>{" "}
                      Initiate Returns
                    </Button>
                    
                    <Button
                      color="success"
                      onClick={handleExcelDownload}
                      style={{
                        height: "35px",
                        padding: "3px 10px",
                        borderRadius: "10px",
                        fontSize: "14px",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                        transition: "transform 0.3s ease",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                      className="hover-scale"
                    >
                      <FaFileExcel style={{ fontSize: "18px" }} />
                      Download Excel
                    </Button>
                    <Button
                      color="secondary"
                      onClick={handleBack}
                      style={{
                        height: "35px",
                        width: "35px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                        transition: "transform 0.3s ease",
                      }}
                      className="hover-scale"
                      title="Back"
                    >
                      <i
                        className="bx bx-undo"
                        style={{ fontSize: "18px" }}
                      ></i>
                    </Button>
                  </div>
                </div>

                <div className="table-container">
                  {loading ? (
                    <p>Loading...</p>
                  ) : error ? (
                    <p className="text-danger">{error}</p>
                  ) : aboutToExpireDrugs?.length === 0 ? (
                    <p>No data available</p>
                  ) : (
                    <Table
                      className="table table-striped table-hover align-middle"
                      responsive
                    >
                      <thead
                        style={{
                          background: "linear-gradient(90deg, #ff9800, #f44336)",
                          color: "#fff",
                        }}
                      >
                        <tr>
                          <th>Sr.No</th>
                          <th>Product Name</th>
                          <th>Product ID</th>
                          <th>Batch Number</th>
                          <th>Expiry Date</th>
                          <th>Days To Expire</th>
                         
                          <th>Quantity</th>
                          <th>Supplier</th>
                        </tr>
                      </thead>
                      <tbody>
                        {aboutToExpireDrugs.map((drug, index) => (
                          <tr key={drug?.id ?? index}>
                            <td>{index + 1}</td>
                            <td>{drug?.productName ?? 'N/A'}</td>
                            <td>{drug?.productId ?? 'N/A'}</td>
                            <td>{drug?.batchNumber ?? 'N/A'}</td>
                            <td style={{ color: "#ff9800", fontWeight: "bold" }}>
                              {drug?.expiryDate ?? 'N/A'}
                            </td>
                            <td>{drug?.daysToExpire ?? 0}</td>
                           
                            <td>{drug?.quantity ?? 0}</td>
                            <td>{drug?.supplier ?? 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      <style jsx>{`
        .hover-scale:hover {
          transform: scale(1.1) !important;
        }
        .table-container {
          max-height: 400px;
          overflow-y: auto;
          overflow-x: auto;
          border-radius: 10px;
          background: #fff;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        .table {
          margin-bottom: 0;
          min-width: 1000px;
        }
        .table-striped tbody tr:nth-of-type(odd) {
          background-color: rgba(0, 0, 0, 0.03);
        }
        .table-hover tbody tr:hover {
          background-color: rgba(255, 152, 0, 0.1);
        }
        .badge {
          padding: 5px 10px;
          font-size: 12px;
        }
        @media (max-width: 768px) {
          .d-flex.justify-content-between {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }
          .d-flex.gap-2 {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}</style>
    </div>
  );
};

export default AboutToExpireInventory;