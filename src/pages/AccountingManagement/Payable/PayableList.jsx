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
  Label,
  Input,
} from "reactstrap";
import {
  FaFileExcel,
  FaMoneyBillWave,
  FaFilter,
  FaFilePdf,
} from "react-icons/fa";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  getPayable,
  getSupplierTotalPaid,
} from "../../../ApiService/AccountingManagement/Payable";
import {
  postPayment,
  postsupplierPayment,
} from "../../../ApiService/AccountingManagement/Payable";

const PayableList = () => {
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const [previewModal, setPreviewModal] = useState(false);
  const [filterModal, setFilterModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [supplierPaymentModal, setSupplierPaymentModal] = useState(false);
  const [selectedPayable, setSelectedPayable] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [transactionMode, setTransactionMode] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [pdfUrl, setPdfUrl] = useState(null);
  const [payables, setPayables] = useState([]);
  const [filteredPayables, setFilteredPayables] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState("");
  const [supplierTotalPaid, setSupplierTotalPaid] = useState(0);
  const [newPaymentAmount, setNewPaymentAmount] = useState("");
  const [newTransactionMode, setNewTransactionMode] = useState("");
  const [newTransactionId, setNewTransactionId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to map payables data with optional chaining
  const mapPayables = (data) => {
    return (
      data?.map((item, index) => ({
        id: index + 1,
        supplierId: item?.supplier_id ?? "N/A",
        supplierName: item?.supplier_name ?? "N/A",
        invoiceId: item?.invoice_id ?? "N/A",
        invoiceNo: item?.invoice_number ?? "N/A",
        invoiceDate: item?.invoice_date ?? "N/A",
        originalAmount: item?.invoice_amount ?? 0.0,
        previousDue: item?.remaining_amount ?? 0.0,
        paidAmount: item?.total_paid ?? 0.0,
        amountPayable: item?.remaining_amount ?? 0.0,
        paymentStatus: item?.status ?? "Pending",
        po_id: item?.po_id,
        paymentSlipNo: item?.slip_no,
        paymentMode: item?.payment_mode ?? "N/A",
        txnId: item?.txn_id ?? "N/A",
        business_info: item?.business_info,
      })) ?? []
    );
  };

  // Calculate totals
  const calculateTotals = () => {
    return filteredPayables.reduce(
      (totals, payable) => ({
        totalInvoiceAmount:
          totals.totalInvoiceAmount + (payable?.originalAmount ?? 0),
        totalPaymentMade: totals.totalPaymentMade + (payable?.paidAmount ?? 0),
        totalBalanceDue: totals.totalBalanceDue + (payable?.amountPayable ?? 0),
      }),
      { totalInvoiceAmount: 0, totalPaymentMade: 0, totalBalanceDue: 0 }
    );
  };

  // Initial fetch of all payables and extract unique suppliers
  useEffect(() => {
    const loadPayables = async () => {
      try {
        const payablesData = await getPayable();
        const mappedPayables = mapPayables(payablesData);
        setPayables(mappedPayables);
        setFilteredPayables(mappedPayables);

        // Extract unique suppliers and sort by name
        const uniqueSuppliers = Array.from(
          new Map(
            mappedPayables?.map((item) => [
              item?.supplierId,
              { id: item?.supplierId, name: item?.supplierName },
            ]) ?? []
          ).values()
        ).sort((a, b) => a?.name?.localeCompare(b?.name));
        setSuppliers(uniqueSuppliers);

        setLoading(false);
      } catch (err) {
        setError(err?.message);
        setLoading(false);
      }
    };

    loadPayables();
  }, []);

  const toggleModal = () => setModal(!modal);
  const togglePreviewModal = () => {
    setPreviewModal(!previewModal);
    if (previewModal) setPdfUrl(null);
  };
  const toggleFilterModal = () => setFilterModal(!filterModal);
  const toggleConfirmModal = () => setConfirmModal(!confirmModal);
  const toggleSupplierPaymentModal = () => {
    setSupplierPaymentModal(!supplierPaymentModal);
    setSelectedSupplierId("");
    setSupplierTotalPaid(0);
    setNewPaymentAmount("");
    setNewTransactionMode("");
    setNewTransactionId("");
    setError(null);
  };

  const handlePay = (payable) => {
    setSelectedPayable(payable);
    setPaymentAmount("");
    setTransactionMode("");
    setTransactionId("");
    toggleModal();
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleExcelDownload = () => {
    const headers = [
      "Sr.No",
      "ID",
      "Supplier Name",
      "Invoice No.",
      "Invoice Date",
      "Invoice Amount",
      "Payment Made",
      "Balance Due",
      "Payment Status",
    ];
    const rows =
      filteredPayables?.map((payable, index) => [
        index + 1,
        payable?.id,
        payable?.supplierName,
        payable?.invoiceNo,
        payable?.invoiceDate,
        payable?.originalAmount,
        payable?.paidAmount,
        payable?.amountPayable,
        payable?.paymentStatus,
      ]) ?? [];
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "payables_list.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFilterApply = async () => {
    try {
      const filteredData = await getPayable(selectedSupplierId);
      const mappedFilteredData = mapPayables(filteredData);
      setFilteredPayables(mappedFilteredData);
      toggleFilterModal();
    } catch (err) {
      setError(err?.message);
    }
  };

  const handleFilterReset = async () => {
    try {
      const allPayables = await getPayable();
      const mappedAllPayables = mapPayables(allPayables);
      setSelectedSupplierId("");
      setFilteredPayables(mappedAllPayables);
      toggleFilterModal();
    } catch (err) {
      setError(err?.message);
    }
  };

  const handleSupplierSelect = async (supplierId) => {
    setSelectedSupplierId(supplierId);
    if (supplierId) {
      try {
        const totalPaid = await getSupplierTotalPaid(supplierId);
        setSupplierTotalPaid(totalPaid?.total_pending_amount ?? 0);
      } catch (err) {
        setError(err?.message);
      }
    } else {
      setSupplierTotalPaid(0);
    }
  };

  const handleSupplierPaymentSubmit = async () => {
    setError(null);
    setIsSubmitting(true);

    if (!selectedSupplierId || !newPaymentAmount || !newTransactionMode) {
      setError(
        "Please fill all required fields: Supplier, Payment Amount, and Transaction Mode"
      );
      setIsSubmitting(false);
      return;
    }

    const payment = parseFloat(newPaymentAmount);
    if (isNaN(payment) || payment <= 0) {
      setError("Please enter a valid payment amount");
      setIsSubmitting(false);
      return;
    }

    if (payment > supplierTotalPaid) {
      setError(
        `Payment amount (₹${payment.toFixed(
          2
        )}) exceeds the total pending amount (₹${supplierTotalPaid.toFixed(2)})`
      );
      setIsSubmitting(false);
      return;
    }

    const paymentData = {
      supplier_id: selectedSupplierId,
      amount_to_pay: payment,
      payment_mode: newTransactionMode,
      txn_id: newTransactionId || "Not provided",
    };

    try {
      await postsupplierPayment(paymentData);
      const payablesData = await getPayable();
      const mappedPayables = mapPayables(payablesData);
      setPayables(mappedPayables);
      setFilteredPayables(mappedPayables);
      toggleSupplierPaymentModal();
      console.log("Payment processed successfully:", paymentData);
    } catch (err) {
      setError(err?.message || "Failed to process payment. Please try again.");
      console.error("Payment error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generatePaymentReceiptPDF = (
    payable,
    paymentData = null,
    showSlipNumber = false
  ) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    const maxWidth = pageWidth - 2 * margin - 60; // Reserve space for right-aligned text
    let y = margin;

    // Add Logo
    const logoWidth = 30;
    const logoHeight = 30;

    try {
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text(
        "Supplier Payment Slip",
        margin + logoWidth + 10,
        y + logoHeight / 2,
        { align: "left" }
      );
    } catch (error) {
      console.error("Error loading logo:", error);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Supplier Payment Slip", pageWidth / 2, y, { align: "center" });
    }

    y += logoHeight + 10;

    // Header with Business Info
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    // Extract business info from payable
    const businessInfo = payable?.business_info || {};
    const contactDetails = businessInfo?.contact_details?.contact_details || {};

    // Store Name
    doc.text(
      `Store Name: ${
        businessInfo?.buisness_name || "[Your Chemist Store Name]"
      }`,
      margin,
      y
    );
    doc.text(
      `Date: ${new Date().toLocaleDateString()}`,
      pageWidth - margin,
      y,
      { align: "right" }
    );
    y += 5;

    // Store Address (Line by Line)
    const addressComponents = [
      contactDetails?.address1,
      contactDetails?.address2,
      contactDetails?.landmark,
      `${contactDetails?.city || ""}${
        contactDetails?.city && contactDetails?.state ? ", " : ""
      }${contactDetails?.state || ""}${
        contactDetails?.state && contactDetails?.pinCode ? " " : ""
      }${contactDetails?.pinCode || ""}`,
    ].filter(Boolean); // Remove null/undefined values

    addressComponents.forEach((component) => {
      const lines = doc.splitTextToSize(
        `Store Address: ${component}`,
        maxWidth
      );
      lines.forEach((line) => {
        doc.text(line, margin, y);
        y += 5;
      });
    });

    // Position Payment Slip No. at the top-right of the address block
    // const paymentSlipY = y - addressComponents.length * 5; // Align with the first address line
    // doc.text(
    //   `Payment Slip No.: ${
    //     showSlipNumber ? payable?.paymentSlipNo ?? "N/A" : 0
    //   }`,
    //   pageWidth - margin,
    //   paymentSlipY,
    //   { align: "right" }
    // );

    // Contact Number
    doc.text(
      `Contact No.: ${contactDetails?.phoneNo || "[Phone Number]"}`,
      margin,
      y
    );
    y += 5;

    // GSTIN
    doc.text(
      `GSTIN (if any): ${businessInfo?.gst_tax_number || "[Your GST Number]"}`,
      margin,
      y
    );
    y += 10;

    // Supplier Details
    doc.setFont("helvetica", "bold");
    doc.text("Supplier Details:", margin, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.text(`Supplier Name: ${payable?.supplierName ?? "N/A"}`, margin, y);
    y += 5;
    doc.text(`Supplier Address: "N/A`, margin, y);
    y += 5;
    doc.text(`GSTIN: "N/A`, margin, y);
    y += 5;
    doc.text(`Contact No.: "N/A"`, margin, y);
    y += 10;

    // Invoice Table
    const tableColumns = [
      { header: "Invoice No.", dataKey: "invoiceNo" },
      { header: "Invoice Date", dataKey: "invoiceDate" },
      { header: "Invoice Amount", dataKey: "amount" },
      { header: "Payment Made", dataKey: "paymentMade" },
      { header: "Balance Due", dataKey: "balanceDue" },
    ];

    const tableData = [
      {
        invoiceNo: payable?.invoiceNo ?? "N/A",
        invoiceDate: payable?.invoiceDate ?? "N/A",
        amount: payable?.originalAmount?.toFixed(2) ?? "0.00",
        paymentMade: paymentData
          ? parseFloat(paymentData.amount)?.toFixed(2)
          : payable?.paidAmount?.toFixed(2) ?? "0.00",
        balanceDue: paymentData
          ? (payable?.amountPayable - parseFloat(paymentData.amount))?.toFixed(
              2
            )
          : payable?.amountPayable?.toFixed(2) ?? "0.00",
      },
      {
        invoiceNo: "Total",
        invoiceDate: "",
        amount: payable?.originalAmount?.toFixed(2) ?? "0.00",
        paymentMade: paymentData
          ? parseFloat(paymentData.amount)?.toFixed(2)
          : payable?.paidAmount?.toFixed(2) ?? "0.00",
        balanceDue: paymentData
          ? (payable?.amountPayable - parseFloat(paymentData.amount))?.toFixed(
              2
            )
          : payable?.amountPayable?.toFixed(2) ?? "0.00",
      },
    ];

    autoTable(doc, {
      startY: y,
      head: [tableColumns.map((col) => col.header)],
      body: tableData.map((row) => tableColumns.map((col) => row[col.dataKey])),
      theme: "grid",
      headStyles: {
        fillColor: [22, 160, 133],
        textColor: 255,
        fontSize: 10,
        cellPadding: 3,
      },
      bodyStyles: {
        fontSize: 9,
        cellPadding: 3,
      },
      margin: { left: margin, right: margin },
      styles: {
        halign: "center",
        valign: "middle",
      },
      columnStyles: {
        0: { halign: "left" },
        1: { halign: "left" },
      },
      didDrawCell: (data) => {
        if (data.row.index === 1) {
          doc.setFont("helvetica", "bold");
        }
      },
    });
    y = doc.lastAutoTable.finalY + 10;

    // Payment Mode
    doc.setFont("helvetica", "bold");
    doc.text("Payment Mode:", margin, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.text(
      paymentData ? paymentData.mode : payable?.paymentMode ?? "N/A",
      margin,
      y
    );
    y += 10;

    // Transaction ID
    doc.text(
      `Transaction ID / Cheque No. (if any): ${
        paymentData
          ? paymentData.transactionId || "[Enter Details]"
          : payable?.txnId ?? "N/A"
      }`,
      margin,
      y
    );
    y += 10;

    // Remarks
    doc.setFont("helvetica", "bold");
    doc.text("Remarks (if any):", margin, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.text(
      paymentData
        ? `"Paid partial amount for ${
            payable?.invoiceDate ?? "N/A"
          } invoice. Remaining to be cleared next month."`
        : `"Current status for ${payable?.invoiceDate ?? "N/A"} invoice."`,
      margin,
      y
    );
    y += 15;

    // Signatures
    doc.setFont("helvetica", "bold");
    doc.text("Receiver's Signature: ________________________", margin, y);
    doc.text(
      "Authorized Signatory (Store): ________________________",
      pageWidth - margin,
      y,
      { align: "right" }
    );

    return doc;
  };

  const handlePaymentSubmit = () => {
    const isValid =
      paymentAmount &&
      transactionMode &&
      (transactionMode === "Cash" || transactionId);

    if (selectedPayable && isValid) {
      const payment = parseFloat(paymentAmount);
      if (payment > selectedPayable?.amountPayable) {
        toggleConfirmModal();
        return;
      }
      processPayment();
    }
  };

  const processPayment = () => {
    const doc = generatePaymentReceiptPDF(
      selectedPayable,
      {
        amount: paymentAmount,
        mode: transactionMode,
        transactionId: transactionId,
      },
      false
    );
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    setPdfUrl(pdfUrl);
    toggleModal();
    togglePreviewModal();
  };

  const confirmPayment = async () => {
    const payment = parseFloat(paymentAmount);
    const paymentData = {
      supplier_name: selectedPayable?.supplierName ?? "N/A",
      supplier_id: selectedPayable?.supplierId ?? "N/A",
      invoice_no: selectedPayable?.invoiceId ?? "N/A",
      amount_paid: payment,
      payment_mode: transactionMode,
      txn_id: transactionId || "Not provided",
    };

    try {
      await postPayment(paymentData);
      const payablesData = await getPayable();
      const mappedPayables = mapPayables(payablesData);
      setPayables(mappedPayables);
      setFilteredPayables(mappedPayables);
      togglePreviewModal();
      console.log("Payment data sent:", paymentData);
    } catch (err) {
      setError(err?.message ?? "Failed to process payment");
    }
  };

  const handleDownloadPDF = (payable) => {
    const doc = generatePaymentReceiptPDF(payable, null, true);
    doc.save(
      `Payable_Receipt_${payable?.supplierName ?? "Unknown"}_${
        new Date().toISOString().split("T")[0]
      }.pdf`
    );
  };

  const handlePrint = () => {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.body.appendChild(iframe);
    iframe.src = pdfUrl;
    iframe.onload = () => {
      iframe.contentWindow.print();
      setTimeout(() => document.body.removeChild(iframe), 1000);
    };
  };

  const totals = calculateTotals();

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Finance" breadcrumbItem="Payables List" />

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
                      Payables List
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
                        Download
                      </Button>
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
                        <FaFilter style={{ fontSize: "18px" }} />
                        Filter
                      </Button>
                      <Button
                        color="primary"
                        onClick={toggleSupplierPaymentModal}
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
                        <FaMoneyBillWave style={{ fontSize: "18px" }} />
                        Supplier Wise Payment
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

                  {loading ? (
                    <div>Loading...</div>
                  ) : error ? (
                    <div className="text-danger">{error}</div>
                  ) : (
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
                            <th>Supplier Name</th>
                            <th>Invoice No.</th>
                            <th>Invoice Date</th>
                            <th>Invoice Amount</th>
                            <th>Payment Made</th>
                            <th>Balance Due</th>
                            <th>Payment Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredPayables?.map((payable, index) => (
                            <tr key={payable?.id}>
                              <td>{index + 1}</td>
                              <td>{payable?.id}</td>
                              <td>{payable?.supplierName}</td>
                              <td>{payable?.invoiceNo}</td>
                              <td>{payable?.invoiceDate}</td>
                              <td>₹{payable?.originalAmount?.toFixed(2)}</td>
                              <td>₹{payable?.paidAmount?.toFixed(2)}</td>
                              <td>₹{payable?.amountPayable?.toFixed(2)}</td>
                              <td>
                                <span
                                  className={`badge ${
                                    payable?.paymentStatus === "Paid"
                                      ? "bg-success"
                                      : payable?.paymentStatus === "Partial"
                                      ? "bg-warning"
                                      : "bg-danger"
                                  }`}
                                >
                                  {payable?.paymentStatus}
                                </span>
                              </td>
                              <td>
                                <div className="d-flex gap-2 justify-content-center">
                                  {payable?.paymentStatus !== "Paid" && (
                                    <FaMoneyBillWave
                                      style={{
                                        fontSize: "18px",
                                        color: "#28a745",
                                        cursor: "pointer",
                                      }}
                                      onClick={() => handlePay(payable)}
                                      title="Pay"
                                    />
                                  )}
                                  {payable?.paymentSlipNo &&
                                    typeof payable?.paymentSlipNo ===
                                      "string" && (
                                      <FaFilePdf
                                        style={{
                                          fontSize: "18px",
                                          color: "#dc3545",
                                          cursor: "pointer",
                                        }}
                                        onClick={() =>
                                          handleDownloadPDF(payable)
                                        }
                                        title="Download PDF"
                                      />
                                    )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr style={{ fontWeight: "bold" }}>
                            <td colSpan="5" className="text-right">
                              Total
                            </td>
                            <td>₹{totals.totalInvoiceAmount.toFixed(2)}</td>
                            <td>₹{totals.totalPaymentMade.toFixed(2)}</td>
                            <td>₹{totals.totalBalanceDue.toFixed(2)}</td>
                            <td></td>
                            <td></td>
                          </tr>
                        </tfoot>
                      </Table>
                    </div>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* Payment Modal */}
          <Modal
            isOpen={modal}
            toggle={toggleModal}
            centered
            className="modal-flat"
          >
            <ModalHeader toggle={toggleModal} className="modal-header-flat">
              Process Payment
            </ModalHeader>
            <ModalBody className="modal-body-flat">
              {selectedPayable && (
                <>
                  <FormGroup className="form-group-flat">
                    <Label>Supplier Name</Label>
                    <Input
                      type="text"
                      value={selectedPayable?.supplierName ?? "N/A"}
                      disabled
                      className="input-flat disabled-input"
                    />
                  </FormGroup>
                  <FormGroup className="form-group-flat">
                    <Label>Invoice Amount</Label>
                    <Input
                      type="text"
                      value={`₹${
                        selectedPayable?.originalAmount?.toFixed(2) ?? "0.00"
                      }`}
                      disabled
                      className="input-flat disabled-input"
                    />
                  </FormGroup>
                  <FormGroup className="form-group-flat">
                    <Label>Balance Due</Label>
                    <Input
                      type="text"
                      value={`₹${
                        selectedPayable?.amountPayable?.toFixed(2) ?? "0.00"
                      }`}
                      disabled
                      className="input-flat disabled-input"
                    />
                  </FormGroup>
                  <FormGroup className="form-group-flat">
                    <Label>Payment Amount</Label>
                    <Input
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      placeholder="Enter amount to pay"
                      min="0"
                      className="input-flat"
                    />
                  </FormGroup>
                  <FormGroup className="form-group-flat">
                    <Label>Transaction Mode</Label>
                    <Input
                      type="select"
                      value={transactionMode}
                      onChange={(e) => setTransactionMode(e.target.value)}
                      className="input-flat"
                    >
                      <option value="">Select Payment Method</option>
                      <option value="Cash">Cash</option>
                      <option value="Cheque">Cheque</option>
                      <option value="UPI">UPI</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Others">Others</option>
                    </Input>
                  </FormGroup>
                  <FormGroup className="form-group-flat">
                    <Label>Transaction ID / Cheque No.</Label>
                    <Input
                      type="text"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder="Enter transaction ID or cheque no."
                      className="input-flat"
                    />
                  </FormGroup>
                </>
              )}
            </ModalBody>
            <ModalFooter className="modal-footer-flat">
              <Button
                color="primary"
                onClick={handlePaymentSubmit}
                disabled={
                  !paymentAmount ||
                  !transactionMode ||
                  (transactionMode !== "Cash" && !transactionId)
                }
                className="btn-flat btn-primary-flat"
              >
                Process Payment
              </Button>
              <Button
                color="secondary"
                onClick={toggleModal}
                className="btn-flat btn-secondary-flat"
              >
                Cancel
              </Button>
            </ModalFooter>
          </Modal>

          {/* Confirmation Modal for Excess Payment */}
          <Modal
            isOpen={confirmModal}
            toggle={toggleConfirmModal}
            centered
            className="modal-flat"
          >
            <ModalHeader
              toggle={toggleConfirmModal}
              className="modal-header-flat"
            >
              Confirm Excess Payment
            </ModalHeader>
            <ModalBody className="modal-body-flat">
              <p>
                The payment amount (₹{parseFloat(paymentAmount)?.toFixed(2)})
                exceeds the balance due (₹
                {selectedPayable?.amountPayable?.toFixed(2) ?? "0.00"}). Do you
                want to proceed with this payment?
              </p>
            </ModalBody>
            <ModalFooter className="modal-footer-flat">
              <Button
                color="primary"
                onClick={() => {
                  processPayment();
                  toggleConfirmModal();
                }}
                className="btn-flat btn-primary-flat"
              >
                Yes, Proceed
              </Button>
              <Button
                color="secondary"
                onClick={toggleConfirmModal}
                className="btn-flat btn-secondary-flat"
              >
                Cancel
              </Button>
            </ModalFooter>
          </Modal>

          {/* Filter Modal */}
          <Modal
            isOpen={filterModal}
            toggle={toggleFilterModal}
            centered
            className="modal-flat"
          >
            <ModalHeader
              toggle={toggleFilterModal}
              className="modal-header-flat"
            >
              Filter Payables
            </ModalHeader>
            <ModalBody className="modal-body-flat">
              <FormGroup className="form-group-flat">
                <Label>Supplier</Label>
                <Input
                  type="select"
                  value={selectedSupplierId}
                  onChange={(e) => setSelectedSupplierId(e.target.value)}
                  className="input-flat"
                >
                  <option value="">All Suppliers</option>
                  {suppliers?.length > 0 ? (
                    suppliers.map((supplier) => (
                      <option key={supplier?.id} value={supplier?.id}>
                        {supplier?.name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No suppliers available
                    </option>
                  )}
                </Input>
              </FormGroup>
            </ModalBody>
            <ModalFooter className="modal-footer-flat">
              <Button
                color="primary"
                onClick={handleFilterApply}
                className="btn-flat btn-primary-flat"
              >
                Apply Filter
              </Button>
              <Button
                color="warning"
                onClick={handleFilterReset}
                className="btn-flat btn-warning-flat"
              >
                Reset
              </Button>
              <Button
                color="secondary"
                onClick={toggleFilterModal}
                className="btn-flat btn-secondary-flat"
              >
                Cancel
              </Button>
            </ModalFooter>
          </Modal>

          {/* Supplier Wise Payment Modal */}
          <Modal
            isOpen={supplierPaymentModal}
            toggle={toggleSupplierPaymentModal}
            centered
            className="modal-flat"
          >
            <ModalHeader
              toggle={toggleSupplierPaymentModal}
              className="modal-header-flat"
            >
              Supplier Wise Payment
            </ModalHeader>
            <ModalBody className="modal-body-flat">
              <FormGroup className="form-group-flat">
                <Label>Supplier</Label>
                <Input
                  type="select"
                  value={selectedSupplierId}
                  onChange={(e) => handleSupplierSelect(e.target.value)}
                  className="input-flat"
                >
                  <option value="">Select Supplier</option>
                  {suppliers?.length > 0 ? (
                    suppliers.map((supplier) => (
                      <option key={supplier?.id} value={supplier?.id}>
                        {supplier?.name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No suppliers available
                    </option>
                  )}
                </Input>
              </FormGroup>
              {selectedSupplierId && (
                <>
                  <FormGroup className="form-group-flat">
                    <Label>Total Pending Amount</Label>
                    <Input
                      type="text"
                      value={`₹${supplierTotalPaid.toFixed(2)}`}
                      disabled
                      className="input-flat disabled-input"
                    />
                  </FormGroup>
                  <FormGroup className="form-group-flat">
                    <Label>Payment Amount</Label>
                    <Input
                      type="number"
                      value={newPaymentAmount}
                      onChange={(e) => setNewPaymentAmount(e.target.value)}
                      placeholder="Enter amount to pay"
                      min="0"
                      className="input-flat"
                    />
                  </FormGroup>
                  <FormGroup className="form-group-flat">
                    <Label>Transaction Mode</Label>
                    <Input
                      type="select"
                      value={newTransactionMode}
                      onChange={(e) => setNewTransactionMode(e.target.value)}
                      className="input-flat"
                    >
                      <option value="">Select Payment Method</option>
                      <option value="Cash">Cash</option>
                      <option value="Cheque">Cheque</option>
                      <option value="UPI">UPI</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Others">Others</option>
                    </Input>
                  </FormGroup>
                  <FormGroup className="form-group-flat">
                    <Label>Transaction ID / Cheque No.</Label>
                    <Input
                      type="text"
                      value={newTransactionId}
                      onChange={(e) => setNewTransactionId(e.target.value)}
                      placeholder="Enter transaction ID or cheque no."
                      className="input-flat"
                    />
                  </FormGroup>
                </>
              )}
              {error && <div className="text-danger">{error}</div>}
            </ModalBody>
            <ModalFooter className="modal-footer-flat">
              <Button
                color="primary"
                onClick={handleSupplierPaymentSubmit}
                disabled={
                  isSubmitting ||
                  !selectedSupplierId ||
                  !newPaymentAmount ||
                  !newTransactionMode ||
                  (newTransactionMode !== "Cash" && !newTransactionId)
                }
                className="btn-flat btn-primary-flat"
              >
                {isSubmitting ? "Processing..." : "Process Payment"}
              </Button>
              <Button
                color="secondary"
                onClick={toggleSupplierPaymentModal}
                className="btn-flat btn-secondary-flat"
              >
                Cancel
              </Button>
            </ModalFooter>
          </Modal>

          {/* PDF Preview Modal */}
          <Modal
            isOpen={previewModal}
            toggle={togglePreviewModal}
            size="lg"
            centered
            className="modal-flat"
          >
            <ModalHeader
              toggle={togglePreviewModal}
              className="modal-header-flat"
            >
              Payment Receipt Preview
            </ModalHeader>
            <ModalBody className="modal-body-flat" style={{ padding: "0" }}>
              {pdfUrl && (
                <iframe
                  src={pdfUrl}
                  style={{ width: "100%", height: "500px", border: "none" }}
                  title="PDF Preview"
                />
              )}
            </ModalBody>
            <ModalFooter className="modal-footer-flat">
              <Button
                color="primary"
                onClick={confirmPayment}
                className="btn-flat btn-primary-flat"
              >
                Confirm Payment
              </Button>
              <Button
                color="info"
                onClick={handlePrint}
                className="btn-flat btn-info-flat"
              >
                Print
              </Button>
              <Button
                color="secondary"
                onClick={togglePreviewModal}
                className="btn-flat btn-secondary-flat"
              >
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
        </Container>
      </div>

      <style jsx>{`
        .modal-flat {
          max-width: 480px;
        }

        .modal-flat[size="lg"] {
          max-width: 800px;
        }

        .modal-content {
          border: none;
          border-radius: 12px;
          background: #ffffff;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          overflow: hidden;
        }

        .modal-header-flat {
          background: linear-gradient(90deg, #007bff, #00c4cc);
          color: white;
          padding: 1.25rem 1.5rem;
          border-bottom: none;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .modal-body-flat {
          padding: 1.5rem;
        }

        .form-group-flat {
          margin-bottom: 1.25rem;
        }

        .input-flat {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 0.75rem;
          transition: all 0.2s ease;
          background: #ffffff;
        }

        .input-flat:focus {
          border-color: #007bff;
          box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
          outline: none;
        }

        .disabled-input {
          background: #f5f5f5;
          color: #888;
          border-color: #e8e8e8;
        }

        .modal-footer-flat {
          border-top: none;
          padding: 1rem 1.5rem;
          display: flex;
          justify-content: space-between;
          background: #fafafa;
        }

        .btn-flat {
          border-radius: 8px;
          padding: 0.65rem 1.5rem;
          font-weight: 500;
          transition: all 0.2s ease;
          border: none;
        }

        .btn-primary-flat {
          background: linear-gradient(90deg, #007bff, #00c4cc);
          color: white;
        }

        .btn-primary-flat:hover {
          background: linear-gradient(90deg, #0062cc, #009faf);
          color: white;
        }

        .btn-primary-flat:disabled {
          background: #b0b0b0;
          cursor: not-allowed;
        }

        .btn-info-flat {
          background: #17a2b8;
          color: white;
        }

        .btn-info-flat:hover {
          background: #138496;
          color: white;
        }

        .btn-warning-flat {
          background: #ffc107;
          color: #212529;
        }

        .btn-warning-flat:hover {
          background: #e0a800;
          color: #212529;
        }

        .btn-secondary-flat {
          background: #e9ecef;
          color: #495057;
        }

        .btn-secondary-flat:hover {
          background: #dee2e6;
          color: #343a40;
        }

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
          min-width: 1200px;
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

export default PayableList;
