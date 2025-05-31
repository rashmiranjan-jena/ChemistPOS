import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Col,
  Container,
  Row,
  Card,
  CardBody,
  CardTitle,
  Table,
  Badge,
  Button,
} from "reactstrap";
import Breadcrumbs from "/src/components/Common/Breadcrumb";
import { MdAccountCircle, MdPhone, MdEmail } from "react-icons/md";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { FaIdCard, FaDownload, FaArrowLeft } from "react-icons/fa";
import { GiDiamondHard, GiGoldBar, GiSilverBullet } from "react-icons/gi";
import { format } from "date-fns";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { getCustomerDetails } from "../../../ApiService/SalesCustomer/CustomerDetails";

const CustomerAllDetails = () => {
  document.title = "Pharmacy Customer Details";
  const { id } = useParams();
  console.log("Customer ID:", id);

  const navigate = useNavigate();
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const response = await getCustomerDetails(id);
        setCustomerData(response);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch customer data");
        setLoading(false);
      }
    };
    fetchCustomerData();
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "Data not available";
    try {
      return format(new Date(dateString), "dd MMM yyyy, hh:mm a");
    } catch (error) {
      return "Invalid Date";
    }
  };

  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case "diamond":
        return { icon: <GiDiamondHard size={20} />, color: "primary" };
      case "gold":
        return { icon: <GiGoldBar size={20} />, color: "warning" };
      case "silver":
        return { icon: <GiSilverBullet size={20} />, color: "secondary" };
      default:
        return { icon: <FaIdCard size={20} />, color: "info" };
    }
  };

  const generatePDF = (order, businessDetails, termsAndConditions) => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      const margin = 10;
      const textMargin = 15; // Increased margin for text to avoid border overlap
      const contentWidth = pageWidth - 2 * margin;

      // Helper function to format date as DD/MM/YYYY
      const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, "0")}/${(
          date.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}/${date.getFullYear()}`;
      };

      // Helper function to convert amount to words
      const amountToWords = (amount) => {
        const units = [
          "",
          "One",
          "Two",
          "Three",
          "Four",
          "Five",
          "Six",
          "Seven",
          "Eight",
          "Nine",
        ];
        const teens = [
          "Ten",
          "Eleven",
          "Twelve",
          "Thirteen",
          "Fourteen",
          "Fifteen",
          "Sixteen",
          "Seventeen",
          "Eighteen",
          "Nineteen",
        ];
        const tens = [
          "",
          "",
          "Twenty",
          "Thirty",
          "Forty",
          "Fifty",
          "Sixty",
          "Seventy",
          "Eighty",
          "Ninety",
        ];

        const num = parseFloat(amount);
        if (isNaN(num) || num < 0) return "Invalid Amount";

        const rupees = Math.floor(num);
        const paise = Math.round((num - rupees) * 100);

        let words = "";
        if (rupees === 0) {
          words = "Zero";
        } else if (rupees < 10) {
          words = units[rupees];
        } else if (rupees < 20) {
          words = teens[rupees - 10];
        } else if (rupees < 100) {
          words = tens[Math.floor(rupees / 10)];
          if (rupees % 10 !== 0) words += ` ${units[rupees % 10]}`;
        } else if (rupees < 1000) {
          words = `${units[Math.floor(rupees / 100)]} Hundred`;
          const remainder = rupees % 100;
          if (remainder > 0) {
            if (remainder < 10) {
              words += ` and ${units[remainder]}`;
            } else if (remainder < 20) {
              words += ` and ${teens[remainder - 10]}`;
            } else {
              words += ` and ${tens[Math.floor(remainder / 10)]}`;
              if (remainder % 10 !== 0) words += ` ${units[remainder % 10]}`;
            }
          }
        } else if (rupees < 10000) {
          words = `${units[Math.floor(rupees / 1000)]} Thousand`;
          const remainder = rupees % 1000;
          if (remainder >= 100) {
            words += ` ${units[Math.floor(remainder / 100)]} Hundred`;
            const subRemainder = remainder % 100;
            if (subRemainder > 0) {
              if (subRemainder < 10) {
                words += ` and ${units[subRemainder]}`;
              } else if (subRemainder < 20) {
                words += ` and ${teens[subRemainder - 10]}`;
              } else {
                words += ` and ${tens[Math.floor(subRemainder / 10)]}`;
                if (subRemainder % 10 !== 0)
                  words += ` ${units[subRemainder % 10]}`;
              }
            }
          } else if (remainder > 0) {
            if (remainder < 10) {
              words += ` and ${units[remainder]}`;
            } else if (remainder < 20) {
              words += ` and ${teens[remainder - 10]}`;
            } else {
              words += ` and ${tens[Math.floor(remainder / 10)]}`;
              if (remainder % 10 !== 0) words += ` ${units[remainder % 10]}`;
            }
          }
        } else {
          words = "Amount too large"; // Simplified; expand for larger numbers if needed
        }

        words += " and ";
        if (paise === 0) {
          words += "Zero Paise";
        } else if (paise < 10) {
          words += `${units[paise]} Paise`;
        } else if (paise < 20) {
          words += `${teens[paise - 10]} Paise`;
        } else {
          words += `${tens[Math.floor(paise / 10)]}`;
          if (paise % 10 !== 0) words += ` ${units[paise % 10]}`;
          words += " Paise";
        }

        return `${words} Only`;
      };

      // Outer Double-Line Border with rounded corners
      doc.setLineWidth(0.5);
      doc.setDrawColor(0, 0, 0); // Black border
      doc.roundedRect(
        margin,
        margin,
        contentWidth,
        pageHeight - 2 * margin,
        5,
        5
      ); // Outer border
      doc.roundedRect(
        margin + 1,
        margin + 1,
        contentWidth - 2,
        pageHeight - 2 * margin - 2,
        4,
        4
      ); // Inner border of the double line

      // Header: Pharmacy Details (Updated using business_details)
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0); // Black text
      doc.text(
        businessDetails?.business_name || "N/A",
        textMargin,
        15
      );
      doc.setFontSize(10);
      const addressLine1 =
        businessDetails?.business_info?.contact_details?.contact_details?.address1?.trim() ||
        "";
      const addressLine2 =
        businessDetails?.business_info?.contact_details?.contact_details
          ?.landmark || "";
      const city =
        businessDetails?.business_info?.contact_details?.contact_details
          ?.city || "N/A";  
      const state =
        businessDetails?.business_info?.contact_details?.contact_details
          ?.state || "N/A";
      const pinCode =
        businessDetails?.business_info?.contact_details?.contact_details
          ?.pinCode || "N/A";
      const country =
        businessDetails?.business_info?.contact_details?.contact_details
          ?.country || "N/A";
      // Split address into multiple lines
      doc.text(`${addressLine1.toUpperCase()}`, textMargin, 22);
      doc.text(`${addressLine2.toUpperCase()}`, textMargin, 29);
      doc.text(
        `${city.toUpperCase()}, ${state.toUpperCase()} ${pinCode}, ${country.toUpperCase()}`,
        textMargin,
        36
      );
      doc.text(
        `PHONE: ${businessDetails?.contact_number || "N/A"}`,
        textMargin,
        43
      );
      doc.text(
        `DL NO: ${
          businessDetails?.business_info?.licence_no ||
          "N/A"
        }`,
        textMargin,
        50
      );
      doc.text(
        `E-Mail: ${businessDetails?.email || "sukantapanda020@gmail.com"}`,
        textMargin,
        57
      );
      doc.text(
        `GSTIN: ${
          businessDetails?.business_info?.gst_tax_number || "N/A"
        }`,
        textMargin,
        64
      );

      // Invoice Title
      doc.setFontSize(12);
      doc.text("INVOICE", pageWidth / 2, 15, { align: "center" });

      // Customer and Invoice Details (Right Side)
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      let rightX = pageWidth - margin - 60;
      let customerY = 15;

      // Split customer details into two lines if too long
      const customerName = order?.customer_id?.customer_name || "N/A";
      const splitText = doc.splitTextToSize(customerName, 50); // Adjust width as needed
      doc.text(splitText, rightX, customerY);
      customerY += splitText.length * 5; // Adjust Y position based on number of lines

      doc.text(
        `Ph.No.: ${order?.customer_id?.contact_number || "N/A"}`,
        rightX,
        customerY
      );
      customerY += 7;
      const emailText = `Email: ${order?.customer_id?.email || "-"}`;
      const splitEmail = doc.splitTextToSize(emailText, 50);
      doc.text(splitEmail, rightX, customerY);
      customerY += splitEmail.length * 5;

      doc.text(`GSTIN: ${order?.customer_id?.gstin || "-"}`, rightX, customerY);
      customerY += 7;
      doc.text(
        `ABHA ID: ${order?.customer_id?.abha_id || "-"}`,
        rightX,
        customerY
      );
      customerY += 7;
      doc.text(
        `Customer Type: ${order?.customer_id?.customer_type_name || "N/A"}`,
        rightX,
        customerY
      );
      customerY += 7;
      doc.text(
        `Category: ${order?.customer_id?.customer_category || "N/A"}`,
        rightX,
        customerY
      );
      customerY += 7;
      doc.text(`Doctor: ${order?.prescription_no || "-"}`, rightX, customerY);
      customerY += 7;
      doc.text(`Invoice No.: ${order?.order_id || "N/A"}`, rightX, customerY);
      customerY += 7;
      // Use current date (May 23, 2025, 02:49 PM IST) for "Date"
      const currentDate = new Date("2025-05-23T14:49:00+05:30"); // Today's date and time
      doc.text(`Date: ${formatDate(currentDate)}`, rightX, customerY);
      customerY += 7;
      // Due Date uses the order creation date
      doc.text(`Due Date: ${formatDate(order?.created_at)}`, rightX, customerY);

      // Itemized Table
      const tableRows =
        order?.product_details?.map((item, index) => [
          (index + 1).toString(),
          item?.name || "N/A",
          item?.mfg || "N/A",
          item?.batch_number || "N/A",
          item?.hsn || "N/A",
          item?.expiry_date ? formatDate(item.expiry_date).slice(3, 8) : "N/A", // Format as MM/YY
          item?.quantity?.toString() || "0",
          item?.mrp?.toFixed(2) || "0.00",
          item?.totalMrp?.toFixed(2) || "0.00",
        ]) || [];

      const tableStartY = 110; // Increased from 90 to accommodate the expanded header
      let tableEndY = 0;
      doc.autoTable({
        startY: tableStartY,
        head: [
          [
            "Sn.",
            "Product Name",
            "Mfg.",
            "Batch",
            "Hsn",
            "Exp.",
            "Qty.",
            "MRP",
            "Total",
          ],
        ],
        body: tableRows,
        theme: "striped",
        headStyles: {
          fillColor: [200, 200, 200], // Light gray header
          textColor: [0, 0, 0], // Black text
          fontSize: 9,
          fontStyle: "bold",
          halign: "center",
        },
        bodyStyles: {
          fontSize: 9,
          textColor: [0, 0, 0],
          halign: "center",
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245], // Light gray for alternate rows
        },
        styles: {
          cellPadding: 2,
          lineWidth: 0.1,
          lineColor: [200, 200, 200],
        },
        columnStyles: {
          0: { cellWidth: 10, halign: "center" }, // Sn.
          1: { cellWidth: 50, halign: "left" }, // Product Name
          2: { cellWidth: 20, halign: "center" }, // Mfg.
          3: { cellWidth: 20, halign: "center" }, // Batch
          4: { cellWidth: 20, halign: "center" }, // Hsn
          5: { cellWidth: 15, halign: "center" }, // Exp.
          6: { cellWidth: 10, halign: "center" }, // Qty.
          7: { cellWidth: 15, halign: "center" }, // MRP
          8: { cellWidth: 20, halign: "center" }, // Total
        },
        margin: { left: margin, right: margin },
        didDrawPage: (data) => {
          // Calculate the table height using startY and finalY
          tableEndY = data.cursor.y;
          // No border around the itemized table as per your request
        },
      });

      // GST Table Section (Aligned to the Left)
      let yPosition = tableEndY + 10;
      const cgstAmount = order?.total_cgst || "0.00";
      const sgstAmount = order?.total_sgst || "0.00";
      const totalGst = order?.total_tax || "0.00";
      const taxableAmount = order?.tax_details?.[0]?.taxableAmount || "0.00";

      doc.autoTable({
        startY: yPosition,
        head: [["CGST", "SGST", "Total"]],
        body: [
          [`6% ${cgstAmount}`, `6% ${sgstAmount}`, taxableAmount.toString()],
          [`Total ${cgstAmount}`, `Total ${sgstAmount}`, totalGst.toString()],
        ],
        theme: "striped",
        headStyles: {
          fillColor: [200, 200, 200], // Light gray header
          textColor: [0, 0, 0], // Black text
          fontSize: 9,
          fontStyle: "bold",
          halign: "center",
        },
        bodyStyles: {
          fontSize: 9,
          textColor: [0, 0, 0],
          halign: "center",
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245], // Light gray for alternate rows
        },
        styles: {
          cellPadding: 2,
          lineWidth: 0.1,
          lineColor: [200, 200, 200],
        },
        columnStyles: {
          0: { cellWidth: 40, halign: "center" }, // CGST
          1: { cellWidth: 40, halign: "center" }, // SGST
          2: { cellWidth: 40, halign: "center" }, // Total
        },
        margin: { left: margin, right: pageWidth - margin - 120 }, // Align to the left
      });

      // Subtotal, Discount, and Total Payable (Aligned to the Right)
      let rightYPosition = yPosition; // Align with the top of the GST table
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text("SUB TOTAL", pageWidth - margin - 40, rightYPosition);
      doc.text(
        order?.subtotal || "0.00",
        pageWidth - margin - 10,
        rightYPosition
      );
      rightYPosition += 5;
      doc.text("Discount", pageWidth - margin - 40, rightYPosition);
      doc.text(
        order?.discount || "0.00",
        pageWidth - margin - 10,
        rightYPosition
      );
      rightYPosition += 5;
      doc.text("TOTAL PAYABLE", pageWidth - margin - 40, rightYPosition);
      doc.text(
        order?.total_bill_amount || "0.00",
        pageWidth - margin - 10,
        rightYPosition
      );

      // Determine the Y position for the next section
      yPosition = Math.max(doc.autoTable.previous.finalY, rightYPosition) + 10;

      // Amount in Words
      doc.setFont("helvetica", "normal");
      const amountInWords = amountToWords(order?.total_bill_amount || "0.00");
      doc.text(`Amount in Words: ${amountInWords}`, textMargin, yPosition);

      // Terms & Conditions (Updated using terms_and_conditions)
      yPosition += 10;
      doc.setFontSize(8);
      doc.text("TERMS & CONDITIONS:", textMargin, yPosition);
      yPosition += 5;
      termsAndConditions.forEach((term, index) => {
        doc.text(term, textMargin, yPosition + index * 5);
      });

      // Adjust yPosition based on the number of terms
      yPosition += termsAndConditions.length * 5;

      // Receiver's Signature
      yPosition += 10;
      doc.text("Receiver's Signature:", textMargin, yPosition);

      // Authorized Signatory
      doc.setFont("helvetica", "bold");
      doc.text(
        `For: ${businessDetails?.business_name || "N/A"}`,
        pageWidth - margin - 60,
        yPosition - 10
      );
      doc.setFont("helvetica", "normal");
      doc.text("AUTHORISED SIGNATORY", pageWidth - margin - 60, yPosition);

      // Save PDF
      doc.save(`Order_${order?.order_id || 0}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!customerData) return <div>No customer data available</div>;

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Breadcrumbs title="Pharmacy" breadcrumbItem="Customer Details" />
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
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                transition: "transform 0.3s ease",
              }}
              className="hover-scale"
              title="Back"
            >
              <i className="bx bx-undo" style={{ fontSize: "30px" }}></i>
            </Button>
          </div>

          <Row>
            {/* Customer Basic Details */}
            <Col lg="8">
              <Card className="modern-card">
                <CardBody className="p-4">
                  <div className="d-flex align-items-center mb-4">
                    <div className="me-3">
                      <div className="avatar-circle">
                        <MdAccountCircle size={60} className="text-white" />
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <h3 className="text-dark mb-2 modern-title">
                        {customerData?.customer?.customer_name}
                      </h3>
                      <p className="mb-1">
                        <Badge color="success" className="modern-badge me-2">
                          {customerData?.customer?.customer_category}
                        </Badge>
                        <Badge color="warning" className="modern-badge">
                          {customerData?.customer?.customer_type_name}
                        </Badge>
                      </p>
                      <p className="text-dark mb-1">
                        <MdEmail className="me-1" />{" "}
                        {customerData?.customer?.email || "N/A"}
                      </p>
                      <p className="text-dark mb-1">
                        <MdPhone className="me-1" />{" "}
                        {customerData?.customer?.contact_number}
                      </p>
                    </div>
                  </div>

                  <Row>
                    <Col md="4" className="mb-3">
                      <h6 className="text-dark">
                        <MdAccountCircle className="me-1" /> Status
                      </h6>
                      <Badge color="success" className="modern-badge">
                        Active
                      </Badge>
                    </Col>
                    <Col md="4" className="mb-3">
                      <h6 className="text-dark">
                        <FaIdCard className="me-1" /> Customer ID
                      </h6>
                      <p className="text-dark">
                        {customerData?.customer?.customer_id}
                      </p>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>

            {/* Communication Details */}
            <Col lg="4">
              <Card className="modern-card">
                <CardBody className="p-4">
                  <CardTitle className="mb-4 modern-title">
                    Communication Details
                  </CardTitle>
                  <Table className="table align-middle table-nowrap modern-table">
                    <tbody>
                      <tr>
                        <td>
                          <MdEmail className="text-primary" size={24} />
                        </td>
                        <td>
                          <strong>Email</strong>
                        </td>
                        <td>{customerData?.customer?.email || "N/A"}</td>
                      </tr>
                      <tr>
                        <td>
                          <MdPhone className="text-primary" size={24} />
                        </td>
                        <td>
                          <strong>Phone</strong>
                        </td>
                        <td>{customerData?.customer?.contact_number}</td>
                      </tr>
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* Sales Orders */}
          <Row className="mt-4">
            <Col lg="12">
              <Card className="modern-card">
                <CardBody className="p-4 scrollable-card">
                  <CardTitle className="mb-4 modern-title">
                    <AiOutlineShoppingCart className="me-2" /> Sales Orders
                  </CardTitle>
                  {customerData?.sales_orders?.length > 0 ? (
                    <Table className="table-nowrap align-middle table-hover mb-0 modern-table">
                      <tbody>
                        {customerData.sales_orders.map((order, i) => (
                          <tr key={i} className="table-row-hover">
                            <td>
                              <h5 className="font-size-14 mb-1">
                                {order?.order_id}
                              </h5>
                              <small>Order No: {order?.norder || "N/A"}</small>
                              <br />
                              <small>
                                Abha No: {order?.customer_id?.abha_id || "N/A"}
                              </small>
                              <br />
                              <small>{formatDateTime(order?.created_at)}</small>
                              <p className="text-muted mb-0">
                                {order?.product_details
                                  ?.map((item) => item.name)
                                  .join(", ")}
                              </p>
                            </td>
                            <td>
                              <strong>Total:</strong> {order?.total_bill_amount}
                              <br />
                              <strong>Payment:</strong> {order?.payment_mode}
                              <br />
                              <strong>Status:</strong>{" "}
                              <Badge
                                color={
                                  order?.credit_status === "Paid"
                                    ? "success"
                                    : "warning"
                                }
                                className="modern-badge"
                              >
                                {order?.credit_status}
                              </Badge>
                            </td>
                            <td>
                              <Button
                                size="sm"
                                color="primary"
                                className="modern-button"
                                onClick={() =>
                                  generatePDF(
                                    order,
                                    customerData.business_details,
                                    customerData.terms_and_conditions
                                  )
                                }
                              >
                                <FaDownload className="me-1" /> Download
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <p className="text-muted text-center">No sales orders</p>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <style jsx>{`
        .modern-card {
          border: none;
          border-radius: 12px;
          background: #ffffff;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          overflow: hidden;
        }
        .modern-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }
        .modern-title {
          color: #1f2937;
          font-weight: 600;
          font-size: 1.25rem;
        }
        .avatar-circle {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #3b82f6;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }
        .modern-badge {
          font-size: 12px;
          padding: 6px 12px;
          border-radius: 20px;
          background: #10b981;
          color: #fff;
          transition: transform 0.2s ease;
        }
        .modern-badge:hover {
          transform: scale(1.05);
        }
        .modern-table {
          background: transparent;
          border-collapse: separate;
          border-spacing: 0 8px;
        }
        .modern-table td {
          background: #f9fafb;
          border-radius: 6px;
          padding: 10px;
          color: #1f2937;
        }
        .table-row-hover:hover {
          background: #f1f5f9;
          transition: background 0.2s ease;
        }
        .modern-button {
          border-radius: 8px;
          padding: 6px 12px;
          background: #3b82f6;
          color: #fff;
          border: none;
          transition: all 0.2s ease;
        }
        .modern-button:hover {
          background: #2563eb;
          transform: scale(1.05);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }
        .scrollable-card {
          max-height: 300px;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: #3b82f6 #f3f4f6;
        }
        .scrollable-card::-webkit-scrollbar {
          width: 6px;
        }
        .scrollable-card::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 10px;
        }
        .scrollable-card::-webkit-scrollbar-thumb {
          background: #3b82f6;
          border-radius: 10px;
        }
        @media (max-width: 768px) {
          .modern-card {
            margin-bottom: 16px;
          }
          .modern-title {
            font-size: 1.1rem;
          }
          .avatar-circle {
            width: 50px;
            height: 50px;
          }
          .avatar-circle svg {
            font-size: 40px;
          }
        }
      `}</style>
    </React.Fragment>
  );
};

export default CustomerAllDetails;
