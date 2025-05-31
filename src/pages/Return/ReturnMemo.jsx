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
  ModalFooter,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
import {
  FaFilePdf,
  FaEye,
  FaFileExcel,
  FaFilter,
  FaPlus,
} from "react-icons/fa";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Swal from "sweetalert2";
import { getReturnMemos } from "../../ApiService/ReturnDrug/ReturnProduct";

// Fisher-Yates shuffle algorithm
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const ReturnMemo = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [selectedMemo, setSelectedMemo] = useState(null);
  const [filters, setFilters] = useState({
    supplier: "All",
    status: "All",
    date: "",
  });
  const [filteredMemos, setFilteredMemos] = useState([]);
  const [memos, setMemos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMemos = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getReturnMemos();
        console.log(response);
        const formattedMemos = response.map((memo) => ({
          id: memo?.id,
          memoNumber: memo?.memo_number,
          supplier: memo?.supplier_name || "N/A",
          supplierEmail: memo?.supplier_email || "N/A",
          date: memo?.date?.split("T")[0],
          status: memo?.status || "Pending",
          products:
            memo?.drug_details?.map((drug) => ({
              id: drug?.drug_id,
              productName: drug?.drug_name,
              batchNo: drug?.batch_no,
              expiryDate: drug?.expiry_date,
              quantity: drug?.quantity,
              status: drug?.type,
            })) || [],
          totalProducts: memo?.total_products,
          totalQuantity:
            memo?.total_quantity ||
            memo?.drug_details?.reduce(
              (sum, drug) => sum + (drug?.quantity || 0),
              0
            ),
          supplierId: memo?.supplier,
          total_purchase_value: memo?.total_purchase_value || 0,
        }));
        setMemos(shuffleArray(formattedMemos));
        setFilteredMemos(shuffleArray(formattedMemos));
        setLoading(false);
      } catch (err) {
        console.error("Error fetching return memos:", err);
        setError("Failed to load return memos. Please try again.");
        setLoading(false);
        Swal.fire({
          title: "Error!",
          text: err.message || "Failed to load return memos. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };

    fetchMemos();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...memos];

    if (filters.supplier !== "All") {
      result = result.filter((m) => m.supplier === filters.supplier);
    }

    if (filters.status !== "All") {
      result = result.filter((m) => m.status === filters.status);
    }

    if (filters.date.trim()) {
      result = result.filter((m) => m.date.includes(filters.date));
    }

    setFilteredMemos(shuffleArray(result));
  }, [filters, memos]);

  // Get unique suppliers and statuses for filter dropdowns
  const uniqueSuppliers = ["All", ...new Set(memos.map((m) => m.supplier))];
  const uniqueStatuses = ["All", ...new Set(memos.map((m) => m.status))];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const toggleModal = () => setModalOpen(!modalOpen);
  const toggleFilterModal = () => setFilterModalOpen(!filterModalOpen);

  const handleViewDetails = (memo) => {
    setSelectedMemo(memo);
    toggleModal();
  };

  const generatePDF = (memo) => {
    const doc = new jsPDF();
    const memoDate = memo.date;

    // Header
    doc.setFillColor(0, 123, 255);
    doc.rect(0, 0, 210, 30, "F");
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("Pharmacy Management System", 105, 15, { align: "center" });
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Your Trusted Healthcare Partner", 105, 22, { align: "center" });

    // Title
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text("Return Memo", 105, 40, { align: "center" });

    // Border
    doc.setLineWidth(0.5);
    doc.setDrawColor(0, 123, 255);
    doc.rect(10, 35, 190, 250);

    // Memo Information
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Memo Number: ${memo.memoNumber}`, 14, 50);
    doc.text(`Date: ${memoDate}`, 14, 58);
    doc.text(`Supplier: ${memo.supplier}`, 14, 66);
    doc.text(`Email: ${memo.supplierEmail}`, 14, 74);
    doc.text(`Status: ${memo.status}`, 14, 82);

    // Divider
    doc.setLineWidth(0.2);
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 88, 196, 88);

    // Product Details
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 123, 255);
    doc.text("Product Details", 14, 96);

    const tableColumn = ["ID", "Product", "Batch", "Expiry", "Qty", "Status"];
    const tableRows = memo.products.map((product) => [
      product.id,
      product.productName,
      product.batchNo,
      product.expiryDate,
      product.quantity,
      product.status,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 102,
      styles: {
        fontSize: 10,
        cellPadding: 3,
        textColor: [0, 0, 0],
        fillColor: [255, 255, 255],
      },
      headStyles: {
        fillColor: [0, 123, 255],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 14, right: 14 },
      columnStyles: {
        5: { cellWidth: 30 },
      },
    });

    // Instructions
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Return Instructions:", 14, doc.lastAutoTable.finalY + 10);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(
      "The status of each product (e.g., About to Expire or Expired) is listed in the table above.",
      14,
      doc.lastAutoTable.finalY + 18
    );
    doc.text(
      "Please arrange pickup or replacement within 15 days. Contact us for coordination.",
      14,
      doc.lastAutoTable.finalY + 26
    );

    // Footer
    doc.setFillColor(0, 123, 255);
    doc.rect(0, 287, 210, 10, "F");
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text("Contact: support@pharmacymgmt.com | +1-800-555-1234", 105, 292, {
      align: "center",
    });

    doc.save(`Return_Memo_${memo.memoNumber}.pdf`);
  };

  const handleExcelDownload = () => {
    const headers = [
      "Sr.No",
      "Memo Number",
      "Supplier",
      "Date",
      "Total Products",
      "Total Quantity",
      "Status",
    ];
    const rows = filteredMemos.map((memo, index) => [
      index + 1,
      memo.memoNumber,
      memo.supplier,
      memo.date,
      memo.totalProducts,
      memo.totalQuantity,
      memo.status,
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "return_memos.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBack = () => {
    navigate(-1);
  };

 
  const handleAddReturnBillForMemo = (memo) => {
    console.log("Memo data:", memo);
    navigate("/return-bill-form", {
      state: {
         memoid: memo?.id,
        memoNumber: memo?.memoNumber,
        supplierEmail: memo?.supplierEmail,
        supplier: memo?.supplier,
        products: memo?.products,
        totalProducts: memo?.totalProducts,
        totalQuantity: memo?.totalQuantity,
      },
    });
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Inventory"
            breadcrumbItem="Return Memo Management"
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
                        background: "linear-gradient(90deg, #007bff, #00c4cc)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      Return Memo Management
                    </h4>
                    <div className="d-flex flex-wrap gap-2">
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
                        Export Excel
                      </Button>
                      <Button
                        color="primary"
                        onClick={toggleFilterModal}
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
                        title="Filter"
                      >
                        <FaFilter style={{ fontSize: "18px" }} />
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
                      <div className="text-center">Loading return memos...</div>
                    ) : (
                      <Table
                        className="table table-striped table-hover align-middle"
                        responsive
                      >
                        <thead
                          style={{
                            background:
                              "linear-gradient(90deg, #007bff, #00c4cc)",
                            color: "#fff",
                          }}
                        >
                          <tr>
                            <th>Sr.No</th>
                            <th>Memo Number</th>
                            <th>Supplier</th>
                            <th>Date</th>
                            <th>Total Products</th>
                            <th>Total Quantity</th>
                            <th>Total Purchase Value</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredMemos.length === 0 ? (
                            <tr>
                              <td colSpan="8" className="text-center">
                                No return memos found matching the filters.
                              </td>
                            </tr>
                          ) : (
                            filteredMemos.map((memo, index) => (
                              <tr key={memo.id}>
                                <td>{index + 1}</td>
                                <td>{memo.memoNumber}</td>
                                <td>{memo.supplier}</td>
                                <td>{memo.date}</td>
                                <td>{memo.totalProducts}</td>
                                <td>{memo.totalQuantity}</td>
                                <td>{memo.total_purchase_value}</td>
                                <td>
                                  <div className="d-flex gap-1">
                                    <FaEye
                                      style={{
                                        fontSize: "18px",
                                        color: "#007bff",
                                        cursor: "pointer",
                                      }}
                                      onClick={() => handleViewDetails(memo)}
                                      title="View"
                                    />
                                    <FaFilePdf
                                      style={{
                                        fontSize: "18px",
                                        color: "red",
                                        cursor: "pointer",
                                        transition: "transform 0.2s",
                                      }}
                                      onClick={() => generatePDF(memo)}
                                      onMouseEnter={(e) =>
                                        (e.currentTarget.style.transform =
                                          "scale(1.2)")
                                      }
                                      onMouseLeave={(e) =>
                                        (e.currentTarget.style.transform =
                                          "scale(1)")
                                      }
                                      title="Generate PDF"
                                    />
                                    <FaPlus
                                      style={{
                                        fontSize: "18px",
                                        color: "green",
                                        cursor: "pointer",
                                      }}
                                      onClick={() =>
                                        handleAddReturnBillForMemo(memo)
                                      }
                                      title="Add Return Bill"
                                    />
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
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

      {/* Details Modal */}
      <Modal isOpen={modalOpen} toggle={toggleModal} centered size="lg">
        <div className="modal-3d">
          <ModalHeader toggle={toggleModal} className="modal-header-3d">
            Return Memo Details - {selectedMemo?.memoNumber}
          </ModalHeader>
          <ModalBody className="modal-body-3d">
            {selectedMemo && (
              <>
                <div className="mb-3">
                  <h5>Memo Information</h5>
                  <p>
                    <strong>Memo Number:</strong> {selectedMemo.memoNumber}
                  </p>
                  <p>
                    <strong>Supplier:</strong> {selectedMemo.supplier}
                  </p>
                  <p>
                    <strong>Date:</strong> {selectedMemo.date}
                  </p>
                </div>
                <h5>Products</h5>
                <div className="table-responsive">
                  <Table className="table table-striped table-hover">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Product Name</th>
                        <th>Batch No</th>
                        <th>Expiry Date</th>
                        <th>Quantity</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedMemo.products.map((product) => (
                        <tr key={product.id}>
                          <td>{product.id}</td>
                          <td>{product.productName}</td>
                          <td>{product.batchNo}</td>
                          <td>{product.expiryDate}</td>
                          <td>{product.quantity}</td>
                          <td>{product.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </>
            )}
          </ModalBody>
          <ModalFooter className="modal-footer-3d">
            <Button color="secondary" onClick={toggleModal} className="btn-3d">
              Close
            </Button>
          </ModalFooter>
        </div>
      </Modal>

      {/* Filter Modal */}
      <Modal isOpen={filterModalOpen} toggle={toggleFilterModal} centered>
        <div className="modal-3d">
          <ModalHeader toggle={toggleFilterModal} className="modal-header-3d">
            Filter Options
          </ModalHeader>
          <ModalBody className="modal-body-3d">
            <Row>
              <Col md="12">
                <FormGroup>
                  <Label for="supplier">Supplier</Label>
                  <Input
                    type="select"
                    name="supplier"
                    id="supplier"
                    value={filters.supplier}
                    onChange={handleFilterChange}
                    className="input-3d"
                    disabled={loading}
                  >
                    {uniqueSuppliers.map((supplier) => (
                      <option key={supplier} value={supplier}>
                        {supplier}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
              <Col md="12">
                <FormGroup>
                  <Label for="status">Status</Label>
                  <Input
                    type="select"
                    name="status"
                    id="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="input-3d"
                    disabled={loading}
                  >
                    {uniqueStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
              <Col md="12">
                <FormGroup>
                  <Label for="date">Date</Label>
                  <Input
                    type="date"
                    name="date"
                    id="date"
                    value={filters.date}
                    onChange={handleFilterChange}
                    className="input-3d"
                    disabled={loading}
                  />
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter className="modal-footer-3d">
            <Button
              color="primary"
              onClick={toggleFilterModal}
              className="btn-3d"
            >
              Apply Filters
            </Button>
            <Button
              color="secondary"
              onClick={toggleFilterModal}
              className="btn-3d"
            >
              Cancel
            </Button>
          </ModalFooter>
        </div>
      </Modal>

      <style jsx>{`
        .modal-3d {
          transform-style: preserve-3d;
          perspective: 1000px;
          background: #fff;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          transform: rotateX(5deg) rotateY(5deg);
          transition: transform 0.3s ease;
        }
        .modal-3d:hover {
          transform: rotateX(0deg) rotateY(0deg);
        }
        .modal-header-3d {
          background: linear-gradient(45deg, #007bff, #00c4cc);
          color: white;
          border-radius: 15px 15px 0 0;
          border-bottom: none;
          padding: 15px 20px;
        }
        .modal-body-3d {
          padding: 20px;
          background: #f8f9fa;
        }
        .modal-footer-3d {
          border-top: none;
          padding: 15px 20px;
          background: #f8f9fa;
          border-radius: 0 0 15px 15px;
        }
        .input-3d {
          border: none;
          border-radius: 8px;
          padding: 10px;
          background: #fff;
          box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.1),
            inset -2px -2px 5px rgba(255, 255, 255, 0.7);
          transition: all 0.3s ease;
        }
        .input-3d:focus {
          box-shadow: inset 1px 1px 3px rgba(0, 0, 0, 0.2),
            inset -1px -1px 3px rgba(255, 255, 255, 0.9);
          outline: none;
        }
        .btn-3d {
          border: none;
          border-radius: 8px;
          padding: 8px 20px;
          box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.2),
            -3px -3px 6px rgba(255, 255, 255, 0.7);
          transition: all 0.2s ease;
        }
        .btn-3d:hover {
          box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25),
            -2px -2px 4px rgba(255, 255, 255, 0.8);
          transform: translateY(1px);
        }
        .btn-3d:active {
          box-shadow: inset 2px 2px 4px rgba(0, 0, 0, 0.2),
            inset -2px -2px 4px rgba(255, 255, 255, 0.7);
          transform: translateY(2px);
        }
        .hover-scale:hover {
          transform: scale(1.1) !important;
        }
        .table-container {
          max-height: 600px;
          overflow-y: auto;
          overflow-x: auto;
          border-radius: 10px;
          background: #fff;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        .table {
          margin-bottom: 0;
          min-width: 800px;
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

export default ReturnMemo;
