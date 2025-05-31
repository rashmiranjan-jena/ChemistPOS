import React, { useEffect, useState } from "react";
import { Button, Card, CardBody, Col, Container, Row, Table } from "reactstrap";
import { FaFileExcel } from "react-icons/fa";
import Breadcrumbs from "../../../components/Common/Breadcrumb"; // Adjust path as needed
import { useNavigate } from "react-router-dom";
import { getTaxInput } from "../../../ApiService/AccountingManagement/TaxInput";

const TaxInputList = () => {
  const navigate = useNavigate();
  const [taxRecords, setTaxRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tax input data from API
  useEffect(() => {
    const fetchTaxRecords = async () => {
      try {
        const response = await getTaxInput();
        const data = response || [];
        const mappedData = data.map((item, index) => ({
          id: index + 1,
          poId: item?.PO_ID || "N/A",
          invoiceNo: item?.Invoice_no || "N/A",
          supplierName: item?.supplier_name || "N/A",
          totalGst: item?.total_GST || 0,
          totalPurchaseAmount: item?.total_purchase_amount || 0,
          cgst: item?.total_CGST || 0,
          sgst: item?.total_SGST || 0,
          igst: item?.total_IGST || 0,
        }));
        setTaxRecords(mappedData);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch tax records.");
        setLoading(false);
      }
    };
    fetchTaxRecords();
  }, []);

  // Calculate totals
  const totalGst = taxRecords?.reduce((sum, record) => sum + (record?.totalGst || 0), 0) || 0;
  const totalCgst = taxRecords?.reduce((sum, record) => sum + (record?.cgst || 0), 0) || 0;
  const totalSgst = taxRecords?.reduce((sum, record) => sum + (record?.sgst || 0), 0) || 0;
  const totalIgst = taxRecords?.reduce((sum, record) => sum + (record?.igst || 0), 0) || 0;
  const totalPurchaseAmount =
    taxRecords?.reduce((sum, record) => sum + (record?.totalPurchaseAmount || 0), 0) || 0;

  const handleBack = () => {
    navigate(-1);
  };

  const handleExcelDownload = () => {
    const headers = [
      "Sr.No",
 
      "PO ID",
      "Invoice No.",
      "Supplier Name",
      "Total GST",
      "Total Purchase Amount",
      "CGST",
      "SGST",
      "IGST",
    ];
    const rows = taxRecords?.map((record, index) => [
      index + 1,
   
      record?.poId || "",
      record?.invoiceNo || "",
      record?.supplierName || "",
      (record?.totalGst || 0).toFixed(2),
      (record?.totalPurchaseAmount || 0).toFixed(2),
      (record?.cgst || 0).toFixed(2),
      (record?.sgst || 0).toFixed(2),
      (record?.igst || 0).toFixed(2),
    ]) || [];
    // Add total row to CSV
    const totalRow = [
      "Total",
      
      "",
      "",
      "",
      totalGst.toFixed(2),
      totalPurchaseAmount.toFixed(2),
      totalCgst.toFixed(2),
      totalSgst.toFixed(2),
      totalIgst.toFixed(2),
    ];
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
      totalRow.join(","),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "tax_input_list.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Tax Management" breadcrumbItem="Tax Input List" />

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
                      Tax Input List
                    </h4>
                    <div className="d-flex flex-wrap gap-2">
                      <Button
                        color="success"
                        onClick={handleExcelDownload}
                        disabled={taxRecords?.length === 0}
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
                      <div className="text-center">Loading...</div>
                    ) : error ? (
                      <div className="text-center text-danger">{error}</div>
                    ) : taxRecords?.length === 0 ? (
                      <div className="text-center">No data available</div>
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
                       
                            <th>PO ID</th>
                            <th>Invoice No.</th>
                            <th>Supplier Name</th>
                            <th>Total GST</th>
                            <th>Total Purchase Amount</th>
                            <th>CGST</th>
                            <th>SGST</th>
                            <th>IGST</th>
                          </tr>
                        </thead>
                        <tbody>
                          {taxRecords?.map((record, index) => (
                            <tr key={record?.id || index}>
                              <td>{index + 1}</td>
                           
                              <td>{record?.poId || "N/A"}</td>
                              <td>{record?.invoiceNo || "N/A"}</td>
                              <td>{record?.supplierName || "N/A"}</td>
                              <td>${(record?.totalGst || 0).toFixed(2)}</td>
                              <td>
                                ${(record?.totalPurchaseAmount || 0).toFixed(2)}
                              </td>
                              <td>${(record?.cgst || 0).toFixed(2)}</td>
                              <td>${(record?.sgst || 0).toFixed(2)}</td>
                              <td>${(record?.igst || 0).toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot
                          style={{
                            background:
                              "linear-gradient(90deg, #007bff, #00c4cc)",
                            color: "#fff",
                            fontWeight: "bold",
                          }}
                        >
                          <tr>
                            <td colSpan="4" className="text-right">
                              Total
                            </td>
                            <td>${totalGst.toFixed(2)}</td>
                            <td>${totalPurchaseAmount.toFixed(2)}</td>
                            <td>${totalCgst.toFixed(2)}</td>
                            <td>${totalSgst.toFixed(2)}</td>
                            <td>${totalIgst.toFixed(2)}</td>
                          </tr>
                        </tfoot>
                      </Table>
                    )}
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

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
          background-color: rgba(0, 123, 255, 0.1);
        }
        .text-right {
          text-align: right;
        }
        @media (max-width: 768px) {
          .d-flex.justify-content-between {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }
          .d-flex.gap-2 {
            width: 100%;
            justify-content: flex-end;
          }
        }
      `}</style>
    </React.Fragment>
  );
};

export default TaxInputList;