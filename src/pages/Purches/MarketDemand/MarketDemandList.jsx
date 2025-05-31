import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import {
  FaEdit,
  FaTrash,
  FaFileExcel,
  FaFilePdf,
  FaPlus,
} from "react-icons/fa";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  getMarketDemand,
  deleteMarketDemand,
} from "../../../ApiService/Purchase/MarketDemand";

const MarketDemandList = () => {
  const navigate = useNavigate();
  const [marketDemandData, setMarketDemandData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);

  // Toggle modal and set products
  const toggleModal = (products = []) => {
    setSelectedProducts(products);
    setModalOpen(!modalOpen);
  };

  useEffect(() => {
    const fetchMarketDemandData = async () => {
      try {
        const response = await getMarketDemand();
        setMarketDemandData(response || []);
        setLoading(false);
      } catch (err) {
        setError(err?.message || "An error occurred");
        setLoading(false);
        Swal.fire({
          title: "Error!",
          text: "Failed to load market demand data.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };

    fetchMarketDemandData();
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const handleEdit = (id) => {
    navigate("/market-demand-form", { state: { id } });
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteMarketDemand(id);
          setMarketDemandData((prevData) =>
            prevData.filter((demand) => demand?.id !== id)
          );
          Swal.fire({
            title: "Deleted!",
            text: "The market demand record has been deleted.",
            icon: "success",
            confirmButtonText: "OK",
          });
        } catch (err) {
          console.error("Delete error:", err);
          Swal.fire({
            title: "Error!",
            text: err.message || "Failed to delete market demand record.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

 

  const handlePdfDownload = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("Market Demand List", 14, 20);

      const headers = [
        "Sr.No",
        "Customer Name",
        "Customer Mobile",
        "Products",
        "Estimated Date",
        "Creation Date",
      ];
      const rows = marketDemandData.map((demand, index) => [
        index + 1,
        demand?.customer_name || "N/A",
        demand?.mob_no || "N/A",
        demand?.products
          ?.map((product) => `${product?.product_name} (${product?.quantity})`)
          .join(", ") || "N/A",
        formatDate(demand?.estd_date),
        formatDate(demand?.date),
      ]);

      doc.autoTable({
        head: [headers],
        body: rows,
        startY: 30,
        theme: "striped",
        headStyles: {
          fillColor: [0, 123, 255],
          textColor: [255, 255, 255],
          fontSize: 10,
        },
        bodyStyles: {
          fontSize: 9,
        },
        columnStyles: {
          0: { cellWidth: 15 },
          1: { cellWidth: 35 },
          2: { cellWidth: 25 },
          3: { cellWidth: 50 },
          4: { cellWidth: 25 },
          5: { cellWidth: 25 },
        },
      });

      doc.save("market_demand_list.pdf");
    } catch (err) {
      Swal.fire({
        title: "Error!",
        text: "Failed to download PDF file.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleAddMarketDemand = () => {
    navigate("/market-demand-form");
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Market Demand"
            breadcrumbItem="Market Demand Management"
          />

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
                        background: "linear-gradient(90deg, #007bff, #ff9800)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      Market Demand List
                    </h4>
                    <div className="d-flex flex-wrap gap-2">
                     
                      <Button
                        color="danger"
                        onClick={handlePdfDownload}
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
                        <FaFilePdf style={{ fontSize: "18px" }} />
                        Download
                      </Button>
                      <Button
                        color="primary"
                        onClick={handleAddMarketDemand}
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
                        <FaPlus style={{ fontSize: "18px" }} />
                        Add
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
                      <div>Loading...</div>
                    ) : error ? (
                      <div className="text-danger">{error}</div>
                    ) : marketDemandData.length === 0 ? (
                      <div className="text-center text-muted py-4">
                        No data available
                      </div>
                    ) : (
                      <Table
                        className="table table-striped table-hover align-middle"
                        responsive
                      >
                        <thead
                          style={{
                            background:
                              "linear-gradient(90deg, #007bff, #ff9800)",
                            color: "#fff",
                          }}
                        >
                          <tr>
                            <th>Sr.No</th>
                            <th>Customer Name</th>
                            <th>Customer Mob.</th>
                            <th>Products</th>
                            <th>Estimated Date</th>
                            <th>Creation Date</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {marketDemandData.map((demand, index) => (
                            <tr key={demand?.id || index}>
                              <td>{index + 1}</td>
                              <td>{demand?.customer_name || "N/A"}</td>
                              <td>{demand?.mob_no || "N/A"}</td>
                              <td>
                                <span
                                  style={{
                                    color: "#007bff",
                                    cursor: "pointer",
                                    textDecoration: "underline",
                                  }}
                                  onClick={() =>
                                    toggleModal(demand?.products || [])
                                  }
                                >
                                  Click here
                                </span>
                              </td>
                              <td>{formatDate(demand?.estd_date)}</td>
                              <td>{formatDate(demand?.date)}</td>
                              <td>
                                <div className="d-flex gap-2 justify-content-center">
                                  <FaEdit
                                    style={{
                                      fontSize: "18px",
                                      color: "#007bff",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => handleEdit(demand?.id)}
                                    title="Edit"
                                  />
                                  <FaTrash
                                    style={{
                                      fontSize: "18px",
                                      color: "#dc3545",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => handleDelete(demand?.id)}
                                    title="Delete"
                                  />
                                </div>
                              </td>
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
      </div>

      {/* Modal for Product Details */}
      <Modal isOpen={modalOpen} toggle={() => toggleModal([])} centered>
        <ModalHeader toggle={() => toggleModal([])}>
          Product Details
        </ModalHeader>
        <ModalBody>
          {selectedProducts.length > 0 ? (
            <Table
              className="table table-striped table-hover align-middle"
              responsive
            >
              <thead style={{ background: "#007bff", color: "#fff" }}>
                <tr>
                  <th>Product Name</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {selectedProducts.map((product, index) => (
                  <tr key={index}>
                    <td>{product?.product_name || "N/A"}</td>
                    <td>{product?.quantity || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="text-center text-muted">No products available</div>
          )}
        </ModalBody>
      </Modal>

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
          min-width: 600px;
        }
        .table-striped tbody tr:nth-of-type(odd) {
          background-color: rgba(0, 0, 0, 0.03);
        }
        .table-hover tbody tr:hover {
          background-color: rgba(0, 123, 255, 0.1);
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
    </React.Fragment>
  );
};

export default MarketDemandList;
