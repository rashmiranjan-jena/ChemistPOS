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
  Form,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
import {
  FaEye,
  FaTrash,
  FaFileExcel,
  FaFilePdf,
  FaFilter,
} from "react-icons/fa";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  getPurchaseEntries,
  deletePurchaseEntry,
} from "../../../ApiService/Purchase/PurchaseEntry";

const PurchaseEntryList = () => {
  const navigate = useNavigate();
  const [purchaseEntries, setPurchaseEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [filterModal, setFilterModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [filterForm, setFilterForm] = useState({
    prNo: "",
    poId: "",
    supplier: "",
    date: "",
  });

  useEffect(() => {
    const fetchPurchaseEntries = async () => {
      try {
        const data = await getPurchaseEntries();
        console.log(data);
        setPurchaseEntries(data ?? []);
        // Filter entries to only show those with delivery_Type "Complete"
        const completeEntries = data.filter(
          (entry) => entry.delivery_Type === "Complete"
        );
        setFilteredEntries(completeEntries);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching purchase entries:", error);
        Swal.fire({
          title: "Error!",
          text: error?.message ?? "Failed to fetch purchase entries.",
          icon: "error",
          confirmButtonText: "OK",
        });
        setLoading(false);
      }
    };

    fetchPurchaseEntries();
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  // const handleDelete = async (id) => {
  //   const firstConfirmation = await Swal.fire({
  //     title: "Are you sure?",
  //     text: "You are about to delete this purchase entry.",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#3085d6",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: "Yes, proceed",
  //     cancelButtonText: "No, cancel",
  //   });

  //   if (firstConfirmation?.isConfirmed) {
  //     const secondConfirmation = await Swal.fire({
  //       title: "Confirm Deletion",
  //       text: "This action cannot be undone. Are you absolutely sure?",
  //       icon: "warning",
  //       showCancelButton: true,
  //       confirmButtonColor: "#3085d6",
  //       cancelButtonColor: "#d33",
  //       confirmButtonText: "Yes, delete it",
  //       cancelButtonText: "No, keep it",
  //     });

  //     if (secondConfirmation?.isConfirmed) {
  //       try {
  //         await deletePurchaseEntry(id);
  //         // Update both the main and filtered lists
  //         setPurchaseEntries(
  //           purchaseEntries.filter((entry) => entry.id !== id)
  //         );
  //         setFilteredEntries(
  //           filteredEntries.filter((entry) => entry.id !== id)
  //         );
  //         Swal.fire({
  //           title: "Deleted!",
  //           text: "The purchase entry has been successfully deleted.",
  //           icon: "success",
  //           confirmButtonText: "OK",
  //         });
  //       } catch (error) {
  //         console.error("Error deleting purchase entry:", error);
  //         Swal.fire({
  //           title: "Error!",
  //           text: error?.message ?? "Failed to delete the purchase entry.",
  //           icon: "error",
  //           confirmButtonText: "OK",
  //         });
  //       }
  //     }
  //   }
  // };

  const handleExcelUpload = (event, entryId) => {
    const file = event.target.files[0];
    if (file) {
      console.log(`Excel file selected for entry ${entryId}:`, file.name);
      // Optionally, implement an API call to upload the Excel file here
    }
  };

  const toggleModal = () => setModal(!modal);

  const toggleFilterModal = () => setFilterModal(!filterModal);

  const handleFilterChange = (e) => {
    const { name, value } = e?.target || {};
    setFilterForm({ ...filterForm, [name]: value });
  };

  const applyFilters = () => {
    const filtered = purchaseEntries.filter((entry) => {
      // Only include entries with delivery_Type "Complete"
      if (entry.delivery_Type !== "Complete") return false;

      const matchesPrNo = filterForm.prNo
        ? entry.reciept_no
            ?.toLowerCase()
            .includes(filterForm.prNo.toLowerCase())
        : true;
      const matchesPoId = filterForm.poId
        ? entry.po_id
            ?.toString()
            .toLowerCase()
            .includes(filterForm.poId.toLowerCase())
        : true;
      const matchesSupplier = filterForm.supplier
        ? (entry.supplier_name || entry.po_supplier_name)
            ?.toLowerCase()
            .includes(filterForm.supplier.toLowerCase())
        : true;
      const matchesDate = filterForm.date
        ? new Date(entry.date).toISOString().split("T")[0] === filterForm.date
        : true;

      return matchesPrNo && matchesPoId && matchesSupplier && matchesDate;
    });

    setFilteredEntries(filtered);
    toggleFilterModal();
  };

  const resetFilters = () => {
    setFilterForm({ prNo: "", poId: "", supplier: "", date: "" });
    // Reset to only show entries with delivery_Type "Complete"
    setFilteredEntries(
      purchaseEntries.filter((entry) => entry.delivery_Type === "Complete")
    );
    toggleFilterModal();
  };

  // Format date using optional chaining
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString)?.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  const formatDateToIST = (utcDateString) => {
    const date = new Date(utcDateString);
    return date.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Purchases"
            breadcrumbItem="Purchase Entry List (Complete Deliveries)"
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
                      Complete Purchase Entries
                    </h4>
                    <div className="d-flex gap-2">
                      <Button
                        color="info"
                        onClick={toggleFilterModal}
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
                        <FaFilter style={{ fontSize: "18px" }} /> Filter
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
                          <th>ID</th>
                          <th>PR No.</th>
                          <th>PO ID</th>
                          <th>Supplier</th>
                          <th>Date</th>
                          <th>Invoice PDF</th>
                          {/* <th>Actions</th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr>
                            <td colSpan="8" className="text-center">
                              Loading...
                            </td>
                          </tr>
                        ) : filteredEntries.length === 0 ? (
                          <tr>
                            <td colSpan="8" className="text-center">
                              No complete purchase entries found.
                            </td>
                          </tr>
                        ) : (
                          filteredEntries.map((entry, index) => (
                            <tr key={entry.id}>
                              <td>{index + 1}</td>
                              <td>{entry.id}</td>
                              <td>{entry.reciept_no || "N/A"}</td>
                              <td>{entry.po_id || "N/A"}</td>
                              <td>
                                {entry.supplier_name ||
                                  entry.po_supplier_name ||
                                  "N/A"}
                              </td>
                              <td className="border p-2">
                                {formatDateToIST(entry.date)}
                              </td>
                              <td>
                                {entry?.purchase_invoice_file ? (
                                  <a
                                    href={`${
                                      import.meta.env.VITE_API_BASE_URL
                                    }${entry.purchase_invoice_file}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary"
                                    style={{ textDecoration: "underline" }}
                                  >
                                    <FaFilePdf style={{ marginRight: "5px" }} />
                                    {entry.purchase_invoice_file
                                      .split("/")
                                      .pop()}
                                  </a>
                                ) : (
                                  "N/A"
                                )}
                              </td>
                              {/* <td>
                                <div className="d-flex gap-1">
                                  <FaTrash
                                    style={{
                                      fontSize: "18px",
                                      color: "#f44336",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => handleDelete(entry.id)}
                                    title="Delete"
                                  />
                                </div>
                              </td> */}
                            </tr>
                          ))
                        )}
                      </tbody>
                    </Table>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <Modal
        isOpen={filterModal}
        toggle={toggleFilterModal}
        centered
        className="modal-modern"
      >
        <ModalHeader toggle={toggleFilterModal}>
          Filter Purchase Entries
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="prNo">PR No.</Label>
              <Input
                type="text"
                name="prNo"
                id="prNo"
                placeholder="Enter PR No."
                value={filterForm.prNo}
                onChange={handleFilterChange}
                className="input-modern"
              />
            </FormGroup>
            <FormGroup>
              <Label for="poId">PO ID</Label>
              <Input
                type="text"
                name="poId"
                id="poId"
                placeholder="Enter PO ID"
                value={filterForm.poId}
                onChange={handleFilterChange}
                className="input-modern"
              />
            </FormGroup>
            <FormGroup>
              <Label for="supplier">Supplier</Label>
              <Input
                type="text"
                name="supplier"
                id="supplier"
                placeholder="Enter Supplier Name"
                value={filterForm.supplier}
                onChange={handleFilterChange}
                className="input-modern"
              />
            </FormGroup>
            <FormGroup>
              <Label for="date">Date</Label>
              <Input
                type="date"
                name="date"
                id="date"
                value={filterForm.date}
                onChange={handleFilterChange}
                className="input-modern"
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            onClick={resetFilters}
            className="btn-modern"
          >
            Reset
          </Button>
          <Button color="primary" onClick={applyFilters} className="btn-modern">
            Apply Filters
          </Button>
        </ModalFooter>
      </Modal>

      <style jsx>{`
        .hover-scale:hover {
          transform: scale(1.1) !important;
        }
        .table-container {
          max-height: 500px;
          overflow-y: auto;
          overflow-x: auto;
          border-radius: 10px;
          background: #fff;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        .modal-table-container {
          max-height: 400px;
          overflow-y: auto;
          overflow-x: auto;
          border-radius: 10px;
          background: #fff;
        }
        .table {
          margin-bottom: 0;
          min-width: 1000px;
        }
        .modal-modern .modal-content {
          border: none;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        .table-modern {
          border-collapse: separate !important;
          border-spacing: 0;
        }
        .table-modern th {
          padding: 12px 15px;
          vertical-align: middle;
          border: none !important;
          background: linear-gradient(135deg, #007bff, #00c4cc) !important;
        }
        .table-modern td {
          padding: 10px 15px;
          vertical-align: middle;
          border-color: #dee2e6 !important;
        }
        .table-modern tr:hover {
          background-color: rgba(0, 123, 255, 0.05);
          transform: scale(1.01);
          transition: all 0.2s ease;
        }
        .bg-gradient-primary {
          background: linear-gradient(135deg, #007bff, #00c4cc) !important;
        }
        .input-modern {
          border: none;
          border-radius: 8px;
          padding: 10px;
          background: #fff;
          box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.1),
            inset -2px -2px 5px rgba(255, 255, 255, 0.7);
          transition: all 0.3s ease;
        }
        .input-modern:focus {
          box-shadow: inset 1px 1px 3px rgba(0, 0, 0, 0.2),
            inset -1px -1px 3px rgba(255, 255, 255, 0.9);
          outline: none;
        }
        .btn-modern {
          border: none;
          border-radius: 8px;
          padding: 8px 20px;
          box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.2),
            -3px -3px 6px rgba(255, 255, 255, 0.7);
          transition: all 0.2s ease;
        }
        .btn-modern:hover {
          box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25),
            -2px -2px 4px rgba(255, 255, 255, 0.8);
          transform: translateY(1px);
        }
        .btn-modern:active {
          box-shadow: inset 2px 2px 4px rgba(0, 0, 0, 0.2),
            inset -2px -2px 4px rgba(255, 255, 255, 0.7);
          transform: translateY(2px);
        }
      `}</style>
    </React.Fragment>
  );
};

export default PurchaseEntryList;
