import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  CardText,
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
  FaPlus,
  FaEdit,
  FaFilter,
} from "react-icons/fa";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  getPurchaseEntryDetails,
  getPurchaseRecipt,
  deletePurchaseRecipt,
  deleteModalPurchaseRecipt,
  getPurchaseReciptWithoutPO,
  deleteWithoutPOEntry,
} from "../../../ApiService/Purchase/PurchaseRecipt";

const PurchesReciptList = () => {
  const navigate = useNavigate();
  const [purchaseEntriesWithPO, setPurchaseEntriesWithPO] = useState([]);
  const [filteredPurchaseEntriesWithPO, setFilteredPurchaseEntriesWithPO] =
    useState([]);
  const [purchaseEntriesWithoutPO, setPurchaseEntriesWithoutPO] = useState([]);
  const [
    filteredPurchaseEntriesWithoutPO,
    setFilteredPurchaseEntriesWithoutPO,
  ] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [filterModal, setFilterModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [modalData, setModalData] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [activeTable, setActiveTable] = useState(null);
  const [drugTallyModal, setDrugTallyModal] = useState(false);
  const [selectedDrugTally, setSelectedDrugTally] = useState([]);
  const [filterForm, setFilterForm] = useState({
    prNo: "",
    poId: "",
    supplier: "",
    date: "",
  });

  useEffect(() => {
    const PurchaseReciptWithoutPO = async () => {
      try {
        const data = await getPurchaseReciptWithoutPO();
        setPurchaseEntriesWithoutPO(data ?? []);
        setFilteredPurchaseEntriesWithoutPO(data ?? []);
      } catch (error) {
        console.error("Error fetching purchase receipt without po:", error);
        Swal.fire({
          title: "Error!",
          text:
            error?.message ?? "Failed to fetch purchase receipt without po.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };

    const fetchPurchaseEntries = async () => {
      try {
        const data = await getPurchaseRecipt();
        setPurchaseEntriesWithPO(data ?? []);
        setFilteredPurchaseEntriesWithPO(data ?? []);
      } catch (error) {
        console.error("Error fetching purchase entries:", error);
        Swal.fire({
          title: "Error!",
          text: error?.message ?? "Failed to fetch purchase entries.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };

    Promise.all([PurchaseReciptWithoutPO(), fetchPurchaseEntries()]).finally(
      () => setLoading(false)
    );
  }, []);

  const handleWithoutPoEdit = (id) => {
    console.log("ID in without po edit", id);
    navigate(`/purchase-without-po-form`, { state: { id } });
  };

  const handleWithoutPoDelete = async (id) => {
    const firstConfirmation = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete this Without PO entry.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, proceed",
      cancelButtonText: "No, cancel",
    });

    if (firstConfirmation?.isConfirmed) {
      const secondConfirmation = await Swal.fire({
        title: "Confirm Deletion",
        text: "This action cannot be undone. Are you absolutely sure?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it",
        cancelButtonText: "No, keep it",
      });

      if (secondConfirmation?.isConfirmed) {
        try {
          await deleteWithoutPOEntry(id);
          setPurchaseEntriesWithoutPO((prevEntries) =>
            prevEntries.filter((entry) => entry.id !== id)
          );
          setFilteredPurchaseEntriesWithoutPO((prevEntries) =>
            prevEntries.filter((entry) => entry.id !== id)
          );
          Swal.fire({
            title: "Deleted!",
            text: "The Without PO entry has been successfully deleted.",
            icon: "success",
            confirmButtonText: "OK",
          });
        } catch (error) {
          console.error("Error deleting Without PO entry:", error);
          Swal.fire({
            title: "Error!",
            text: error?.message ?? "Failed to delete the Without PO entry.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }
    }
  };

  const handleBack = () => {
    if (activeTable) {
      setActiveTable(null);
    } else {
      navigate(-1);
    }
  };

  const handleDelete = async (id) => {
    const firstConfirmation = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete this purchase entry.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, proceed",
      cancelButtonText: "No, cancel",
    });

    if (firstConfirmation?.isConfirmed) {
      const secondConfirmation = await Swal.fire({
        title: "Confirm Deletion",
        text: "This action cannot be undone. Are you absolutely sure?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it",
        cancelButtonText: "No, keep it",
      });

      if (secondConfirmation?.isConfirmed) {
        try {
          await deletePurchaseRecipt(id);
          setPurchaseEntriesWithPO(
            purchaseEntriesWithPO.filter((entry) => entry?.id !== id)
          );
          setFilteredPurchaseEntriesWithPO(
            filteredPurchaseEntriesWithPO.filter((entry) => entry?.id !== id)
          );
          Swal.fire({
            title: "Deleted!",
            text: "The purchase entry has been successfully deleted.",
            icon: "success",
            confirmButtonText: "OK",
          });
        } catch (error) {
          console.error("Error deleting purchase entry:", error);
          Swal.fire({
            title: "Error!",
            text: error?.message ?? "Failed to delete the purchase entry.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }
    }
  };

  const fetchEntryDetails = async (id) => {
    setModalLoading(true);
    try {
      const response = await getPurchaseEntryDetails(id);
      setModalData(response ?? []);
      setModalLoading(false);
    } catch (error) {
      console.error("Error fetching entry details:", error);
      Swal.fire({
        title: "Error!",
        text: error?.message ?? "Failed to fetch entry details.",
        icon: "error",
        confirmButtonText: "OK",
      });
      setModalLoading(false);
    }
  };

  const toggleModal = (entryId = null) => {
    if (entryId) {
      setSelectedEntry(entryId);
      fetchEntryDetails(entryId);
    } else {
      setSelectedEntry(null);
      setModalData([]);
    }
    setModal(!modal);
  };

  const toggleFilterModal = () => {
    setFilterModal(!filterModal);
  };

  const toggleDrugTallyModal = (drugTally = []) => {
    setSelectedDrugTally(drugTally);
    setDrugTallyModal(!drugTallyModal);
  };

  const handleModalEdit = (id) => {
    console.log("Modal Edit Call", id);
    navigate(`/purchase-receipt-form`, { state: { id } });
  };

  const handleModalDelete = async (id) => {
    const firstConfirmation = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete this purchase receipt.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, proceed",
      cancelButtonText: "No, cancel",
    });

    if (firstConfirmation?.isConfirmed) {
      const secondConfirmation = await Swal.fire({
        title: "Confirm Deletion",
        text: "This action cannot be undone. Are you absolutely sure?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it",
        cancelButtonText: "No, keep it",
      });

      if (secondConfirmation?.isConfirmed) {
        try {
          await deleteModalPurchaseRecipt(id);
          setModalData(modalData?.filter((entry) => entry?.id !== id));
          setPurchaseEntriesWithoutPO(
            purchaseEntriesWithoutPO.filter((entry) => entry?.id !== id)
          );
          setFilteredPurchaseEntriesWithoutPO(
            filteredPurchaseEntriesWithoutPO.filter((entry) => entry?.id !== id)
          );
          Swal.fire({
            title: "Deleted!",
            text: "The purchase receipt has been successfully deleted.",
            icon: "success",
            confirmButtonText: "OK",
          });
          if (modalData?.length === 1) {
            toggleModal();
          }
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: error?.message || "Failed to delete the purchase receipt.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }
    }
  };

  const formatDateToIST = (utcDateString) => {
    const date = new Date(utcDateString);
    return date?.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  };

  const handlePurchaseWithoutPo = () => {
    navigate("/purchase-without-po-form");
  };

  const handleFilterChange = (e) => {
    const { name, value } = e?.target || {};
    setFilterForm({ ...filterForm, [name]: value });
  };

  const applyFilters = () => {
    // Filter With PO entries
    const filteredWithPO = purchaseEntriesWithPO.filter((entry) => {
      const matchesPrNo = filterForm.prNo
        ? entry.pr_no_name
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
        ? entry.supplier_name
            ?.toLowerCase()
            .includes(filterForm.supplier.toLowerCase())
        : true;
      const matchesDate = filterForm.date
        ? new Date(entry.created_at).toISOString().split("T")[0] ===
          filterForm.date
        : true;
      return matchesPrNo && matchesPoId && matchesSupplier && matchesDate;
    });

    // Filter Without PO entries
    const filteredWithoutPO = purchaseEntriesWithoutPO.filter((entry) => {
      const matchesPrNo = filterForm.prNo
        ? entry.reciept_no
            ?.toLowerCase()
            .includes(filterForm.prNo.toLowerCase())
        : true;
      const matchesPoId = true; // No PO ID for Without PO entries
      const matchesSupplier = filterForm.supplier
        ? entry.supplier_name
            ?.toLowerCase()
            .includes(filterForm.supplier.toLowerCase())
        : true;
      const matchesDate = filterForm.date
        ? new Date(entry.date).toISOString().split("T")[0] === filterForm.date
        : true;
      return matchesPrNo && matchesPoId && matchesSupplier && matchesDate;
    });

    setFilteredPurchaseEntriesWithPO(filteredWithPO);
    setFilteredPurchaseEntriesWithoutPO(filteredWithoutPO);
    toggleFilterModal();
  };

  const resetFilters = () => {
    setFilterForm({ prNo: "", poId: "", supplier: "", date: "" });
    setFilteredPurchaseEntriesWithPO(purchaseEntriesWithPO);
    setFilteredPurchaseEntriesWithoutPO(purchaseEntriesWithoutPO);
    toggleFilterModal();
  };

  const renderWithPOTable = (data) => (
    <div className="table-container">
      <Table
        className="table table-striped table-hover align-middle"
        responsive
      >
        <thead
          style={{
            background: "linear-gradient(90deg, #007bff, #00c4cc)",
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="8" className="text-center">
                Loading...
              </td>
            </tr>
          ) : data?.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center">
                No purchase entries found.
              </td>
            </tr>
          ) : (
            data?.map((entry, index) => (
              <tr key={entry?.id}>
                <td>{index + 1}</td>
                <td>{entry?.id}</td>
                <td>{entry?.pr_no_name || "N/A"}</td>
                <td>{entry?.po_id || "N/A"}</td>
                <td>{entry?.supplier_name || "N/A"}</td>
                <td className="border p-2">
                  {formatDateToIST(entry?.created_at)}
                </td>
                <td>
                  {entry?.file ? (
                    <a
                      href={`${import.meta.env?.VITE_API_BASE_URL}${
                        entry?.file
                      }`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary"
                      style={{ textDecoration: "underline" }}
                    >
                      <FaFilePdf style={{ marginRight: "5px" }} />
                      {entry?.file?.split("/")?.pop()}
                    </a>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td>
                  <div className="d-flex gap-2">
                    <FaEye
                      style={{
                        fontSize: "18px",
                        color: "#007bff",
                        cursor: "pointer",
                      }}
                      onClick={() => toggleModal(entry?.id)}
                      title="View"
                    />
                    <FaPlus
                      style={{
                        fontSize: "18px",
                        color: "#4caf50",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        navigate(`/purchase-receipt-form`, {
                          state: { po_id: entry?.id },
                        })
                      }
                      title="Add"
                    />
                    <FaTrash
                      style={{
                        fontSize: "18px",
                        color: "#f44336",
                        cursor: "pointer",
                      }}
                      onClick={() => handleDelete(entry?.id)}
                      title="Delete"
                    />
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );

  const renderWithoutPOTable = (data) => (
    <div className="table-container">
      <Table
        className="table table-striped table-hover align-middle"
        responsive
      >
        <thead
          style={{
            background: "linear-gradient(90deg, #007bff, #00c4cc)",
            color: "#fff",
          }}
        >
          <tr>
            <th>Sr.No</th>
            <th>ID</th>
            <th>Receipt No.</th>
            <th>Supplier</th>
            <th>Date</th>
            <th>Invoice PDF</th>
            <th>Drug Tally</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="8" className="text-center">
                Loading...
              </td>
            </tr>
          ) : data?.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center">
                Note: No purchase entries found.
              </td>
            </tr>
          ) : (
            data?.map((entry, index) => (
              <tr key={entry?.id}>
                <td>{index + 1}</td>
                <td>{entry?.id}</td>
                <td>{entry?.reciept_no || "N/A"}</td>
                <td>{entry?.supplier_name || "N/A"}</td>
                <td className="border p-2">{formatDateToIST(entry?.date)}</td>
                <td>
                  {entry?.purchase_invoice_file ? (
                    <a
                      href={`${import.meta.env?.VITE_API_BASE_URL}${
                        entry?.purchase_invoice_file
                      }`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary"
                      style={{ textDecoration: "underline" }}
                    >
                      <FaFilePdf style={{ marginRight: "5px" }} />
                      {entry?.purchase_invoice_file?.split("/")?.pop()}
                    </a>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td>
                  {entry?.drug_tally?.length > 0 ? (
                    <Button
                      color="link"
                      onClick={() => toggleDrugTallyModal(entry?.drug_tally)}
                      style={{ padding: 0, textDecoration: "underline" }}
                    >
                      Click here to show details
                    </Button>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td>
                  <div className="d-flex gap-2">
                    <FaEdit
                      style={{
                        fontSize: "18px",
                        color: "#4caf50",
                        cursor: "pointer",
                      }}
                      onClick={() => handleWithoutPoEdit(entry?.id)}
                      title="Edit"
                    />
                    <FaTrash
                      style={{
                        fontSize: "18px",
                        color: "#f44336",
                        cursor: "pointer",
                      }}
                      onClick={() => handleWithoutPoDelete(entry?.id)}
                      title="Delete"
                    />
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );

  const renderDrugTallyTable = () => (
    <Table className="table-modern" responsive>
      <thead className="bg-gradient-primary text-white">
        <tr>
          <th>Sr.No</th>
          <th>Drug ID</th>
          <th>Drug Name</th>
          <th>Brand</th>
          <th>Pack</th>
          <th>Quantity</th>
          <th>Free</th>
          <th>HSN</th>
          <th>Batch</th>
          <th>Expire Date</th>
          <th>MRP</th>
          <th>Rate</th>
          <th>Discount</th>
          <th>GST</th>
          <th>Amount</th>
          <th>Purchase Amount</th>
        </tr>
      </thead>
      <tbody>
        {selectedDrugTally.length === 0 ? (
          <tr>
            <td colSpan="16" className="text-center">
              No drug tally data available
            </td>
          </tr>
        ) : (
          selectedDrugTally.map((drug, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{drug?.drug_id}</td>
              <td>{drug?.drugName}</td>
              <td>{drug?.brand}</td>
              <td>{drug?.pack_type}</td>
              <td>{drug?.quantity}</td>
              <td>{drug?.free_drug}</td>
              <td>{drug?.hsn}</td>
              <td>{drug?.batch}</td>
              <td>{drug?.expireDate}</td>
              <td>{drug?.mrp}</td>
              <td>{drug?.rate}</td>
              <td>{drug?.discount}</td>
              <td>{drug?.gst}</td>
              <td>{drug?.amount}</td>
              <td>{drug?.purchaseAmount}</td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Purchases"
            breadcrumbItem="Purchase Receipt List"
          />
          <Row>
            <Col xs="12">
              <Card
                className="shadow-lg"
                style={{
                  borderRadius: "20px",
                  overflow: "hidden",
                  background:
                    "linear-gradient(135deg, #f5f7fa 0%, #e4e9f0 100%)",
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
                      Purchase Receipt List
                    </h4>
                    <div className="d-flex flex-wrap gap-2">
                      <Button
                        color="primary"
                        onClick={handlePurchaseWithoutPo}
                        style={{
                          height: "40px",
                          padding: "8px 12px",
                          borderRadius: "10px",
                          background:
                            "linear-gradient(45deg, #007bff, #00c4cc)",
                          border: "none",
                          boxShadow: "0 ঌ0 4px 12px rgba(0, 123, 255, 0.3)",
                          transition: "transform 0.3s ease",
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                        className="hover-scale"
                      >
                        <FaPlus style={{ fontSize: "16px" }} />
                        Purchase Without PO
                      </Button>
                      <Button
                        color="info"
                        onClick={toggleFilterModal}
                        style={{
                          height: "40px",
                          padding: "8px 12px",
                          borderRadius: "10px",
                          background:
                            "linear-gradient(45deg, #17a2b8, #00c4cc)",
                          border: "none",
                          boxShadow: "0 4px 12px rgba(0, 123, 255, 0.3)",
                          transition: "transform 0.3s ease",
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                        className="hover-scale"
                      >
                        <FaFilter style={{ fontSize: "16px" }} />
                        Filter
                      </Button>
                      <Button
                        color="primary"
                        onClick={handleBack}
                        style={{
                          height: "40px",
                          width: "40px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "50%",
                          background:
                            "linear-gradient(45deg, #007bff, #00c4cc)",
                          border: "none",
                          boxShadow: "0 4px 12px rgba(0, 123, 255, 0.3)",
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

                  {!activeTable ? (
                    <Row>
                      <Col md="6" className="mb-4">
                        <Card
                          className="shadow-sm"
                          style={{
                            borderRadius: "15px",
                            border: "none",
                            background: "#fff",
                            overflow: "hidden",
                            transition:
                              "transform 0.3s ease, box-shadow 0.3s ease",
                            cursor: "pointer",
                          }}
                          onClick={() => setActiveTable("withPO")}
                        >
                          <div
                            style={{
                              height: "5px",
                              background:
                                "linear-gradient(90deg, #28a745, #20c997)",
                            }}
                          ></div>
                          <CardBody className="p-4">
                            <div className="d-flex align-items-center mb-3">
                              <div
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  borderRadius: "50%",
                                  background:
                                    "linear-gradient(45deg, #28a745, #20c997)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: "#fff",
                                  fontSize: "20px",
                                  fontWeight: "600",
                                  marginRight: "15px",
                                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                                }}
                              >
                                PO
                              </div>
                              <CardTitle
                                tag="h5"
                                className="mb-0"
                                style={{
                                  fontWeight: "600",
                                  color: "#2c3e50",
                                  letterSpacing: "0.5px",
                                }}
                              >
                                Purchase Receipts With PO
                              </CardTitle>
                            </div>
                            <CardText
                              style={{ color: "#6c757d", fontSize: "14px" }}
                            >
                              <div className="mb-2">
                                <i className="bx bx-list-ul me-2"></i>
                                {loading
                                  ? "Loading..."
                                  : `${filteredPurchaseEntriesWithPO.length} entries`}
                              </div>
                            </CardText>
                            <div className="d-flex justify-content-end mt-4">
                              <Button
                                color="primary"
                                size="sm"
                                style={{
                                  borderRadius: "10px",
                                  background:
                                    "linear-gradient(45deg, #007bff, #00c4cc)",
                                  border: "none",
                                  padding: "8px 12px",
                                  boxShadow: "0 2px 8px rgba(0, 123, 255, 0.3)",
                                  transition: "all 0.3s ease",
                                }}
                                onClick={() => setActiveTable("withPO")}
                              >
                                <FaEye style={{ fontSize: "16px" }} /> View
                              </Button>
                            </div>
                          </CardBody>
                        </Card>
                      </Col>
                      <Col md="6" className="mb-4">
                        <Card
                          className="shadow-sm"
                          style={{
                            borderRadius: "15px",
                            border: "none",
                            background: "#fff",
                            overflow: "hidden",
                            transition:
                              "transform 0.3s ease, box-shadow 0.3s ease",
                            cursor: "pointer",
                          }}
                          onClick={() => setActiveTable("withoutPO")}
                        >
                          <div
                            style={{
                              height: "5px",
                              background:
                                "linear-gradient(90deg, #28a745, #20c997)",
                            }}
                          ></div>
                          <CardBody className="p-4">
                            <div className="d-flex align-items-center mb-3">
                              <div
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  borderRadius: "50%",
                                  background:
                                    "linear-gradient(45deg, #28a745, #20c997)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: "#fff",
                                  fontSize: "20px",
                                  fontWeight: "600",
                                  marginRight: "15px",
                                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                                }}
                              >
                                WPO
                              </div>
                              <CardTitle
                                tag="h5"
                                className="mb-0"
                                style={{
                                  fontWeight: "600",
                                  color: "#2c3e50",
                                  letterSpacing: "0.5px",
                                }}
                              >
                                Purchase Receipts Without PO
                              </CardTitle>
                            </div>
                            <CardText
                              style={{ color: "#6c757d", fontSize: "14px" }}
                            >
                              <div className="mb-2">
                                <i className="bx bx-list-ul me-2"></i>
                                {loading
                                  ? "Loading..."
                                  : `${filteredPurchaseEntriesWithoutPO.length} entries`}
                              </div>
                            </CardText>
                            <div className="d-flex justify-content-end mt-4">
                              <Button
                                color="primary"
                                size="sm"
                                style={{
                                  borderRadius: "10px",
                                  background:
                                    "linear-gradient(45deg, #007bff, #00c4cc)",
                                  border: "none",
                                  padding: "8px 12px",
                                  boxShadow: "0 2px 8px rgba(0, 123, 255, 0.3)",
                                  transition: "all 0.3s ease",
                                }}
                                onClick={() => setActiveTable("withoutPO")}
                              >
                                <FaEye style={{ fontSize: "16px" }} /> View
                              </Button>
                            </div>
                          </CardBody>
                        </Card>
                      </Col>
                    </Row>
                  ) : activeTable === "withPO" ? (
                    renderWithPOTable(filteredPurchaseEntriesWithPO)
                  ) : (
                    renderWithoutPOTable(filteredPurchaseEntriesWithoutPO)
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <Modal
        isOpen={modal}
        toggle={() => toggleModal()}
        size="xl"
        className="modal-modern"
      >
        <ModalHeader toggle={() => toggleModal()}>
          Purchase Receipt Details
        </ModalHeader>
        <ModalBody>
          <div className="modal-table-container">
            <Table className="table-modern" responsive>
              <thead className="bg-gradient-primary text-white">
                <tr>
                  <th>Sr.No</th>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Delivery Boy Name</th>
                  <th>Phone No.</th>
                  <th>Email ID</th>
                  <th>Mode of Delivery</th>
                  <th>Vehicle No.</th>
                  <th>Driver No.</th>
                  <th>Delivery Type</th>
                  <th>Invoice No.</th>
                  <th>Invoice File</th>
                  <th>Total GST</th>
                  <th>Total Amount</th>
                  <th>PO ID</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {modalLoading ? (
                  <tr>
                    <td colSpan="20" className="text-center">
                      Loading...
                    </td>
                  </tr>
                ) : modalData?.length === 0 ? (
                  <tr>
                    <td colSpan="20" className="text-center">
                      No details available
                    </td>
                  </tr>
                ) : (
                  modalData?.map((receipt, index) => (
                    <tr key={receipt?.id}>
                      <td>{index + 1}</td>
                      <td>{receipt?.id}</td>
                      <td>{formatDateToIST(receipt?.date)}</td>
                      <td>{receipt?.time || "N/A"}</td>
                      <td>{receipt?.delivery_boy_name || "N/A"}</td>
                      <td>{receipt?.phone_no || "N/A"}</td>
                      <td>{receipt?.email || "N/A"}</td>
                      <td>{receipt?.mode_of_delivery || "N/A"}</td>
                      <td>{receipt?.vehicle_no || "N/A"}</td>
                      <td>{receipt?.driver_no || "N/A"}</td>
                      <td>{receipt?.delivery_Type || "N/A"}</td>
                      <td>{receipt?.purchase_Invoice_No || "N/A"}</td>
                      <td>
                        {receipt?.purchase_invoice_file ? (
                          <a
                            href={`${import.meta.env?.VITE_API_BASE_URL}${
                              receipt?.purchase_invoice_file
                            }`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary"
                          >
                            <FaFilePdf />{" "}
                            {receipt?.purchase_invoice_file?.split("/")?.pop()}
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td>{receipt?.total_GST || "N/A"}</td>
                      <td>{receipt?.total_purchase_amount || "N/A"}</td>
                      <td>{receipt?.po_id || "N/A"}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <FaTrash
                            style={{
                              fontSize: "18px",
                              color: "#f44336",
                              cursor: "pointer",
                            }}
                            onClick={() => handleModalDelete(receipt?.id)}
                            title="Delete"
                          />
                          <FaEdit
                            style={{
                              fontSize: "18px",
                              color: "#4caf50",
                              cursor: "pointer",
                            }}
                            onClick={() => handleModalEdit(receipt?.id)}
                            title="Edit"
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </ModalBody>
      </Modal>

      <Modal
        isOpen={drugTallyModal}
        toggle={() => toggleDrugTallyModal()}
        size="xl"
        className="modal-modern"
      >
        <ModalHeader toggle={() => toggleDrugTallyModal()}>
          Drug Tally Details
        </ModalHeader>
        <ModalBody>
          <div className="modal-table-container">{renderDrugTallyTable()}</div>
        </ModalBody>
      </Modal>

      <Modal
        isOpen={filterModal}
        toggle={toggleFilterModal}
        centered
        className="modal-modern"
      >
        <ModalHeader toggle={toggleFilterModal}>
          Filter Purchase Receipts
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="prNo">PR No. / Receipt No.</Label>
              <Input
                type="text"
                name="prNo"
                id="prNo"
                placeholder="Enter PR No. or Receipt No."
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
        .card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15) !important;
        }
        .btn {
          transition: all 0.3s ease;
        }
        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) !important;
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

export default PurchesReciptList;
