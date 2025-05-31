import React, { useRef } from "react";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Row,
} from "reactstrap";
import { FaFileAlt, FaMoneyBillWave, FaTrophy } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import Breadcrumbs from "../../components/Common/Breadcrumb"; 

const DailySalesReport = () => {
  const navigate = useNavigate();
  const mtdRef = useRef();
  const todayRef = useRef();

  const mtdData = {
    salePrice: 406695.15,
    target: 233333.33,
    deficit: 93304.85,
    deficitPercentage: 18.66,
    walkins: 50,
    bills: 3,
    qty: 114,
    storeTarget: 500000,
    storeAch: 81.34,
    storeAupt: 2.28,
    storeAvpt: 8133.9,
  };

  const todayData = {
    walkins: 0,
    bills: 0,
    qty: 0,
    dayTarget: 0,
    dayAchieved: 0,
    dayAchPercentage: 0,
  };

  const bestPerformers = [
    { name: "John Doe", sales: 8500 },
    { name: "Jane Smith", sales: 7200 },
    { name: "Mike Johnson", sales: 6800 },
  ];

  const downloadMTDPDF = async () => {
    const input = mtdRef.current;
    const canvas = await html2canvas(input, { scale: 2 }); // Increased scale for better resolution
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save("mtd-sales-report.pdf");
  };

  const downloadTodayPDF = async () => {
    const input = todayRef.current;
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save("today-sales-report.pdf");
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Reports" breadcrumbItem="Daily Sales Report" />

          <Row>
            <Col xs="12">
              <Card className="shadow-lg" style={{ borderRadius: "20px", overflow: "hidden", background: "#f8f9fa" }}>
                <CardBody className="p-3 p-md-4">
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-3 mb-md-4">
                    <h4
                      className="text-primary mb-2 mb-md-0"
                      style={{
                        fontWeight: "700",
                        letterSpacing: "1px",
                        background: "linear-gradient(90deg, #007bff, #f44336)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        fontSize: "clamp(1.5rem, 4vw, 2rem)",
                      }}
                    >
                      Daily Sales Report
                    </h4>
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
                        fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
                      }}
                      className="hover-scale"
                      title="Back"
                    >
                      <i className="bx bx-undo"></i>
                    </Button>
                  </div>

                  <Row className="g-2 g-md-4">
                    {/* MTD Data Card */}
                    <Col xs="12" md="6" lg="4">
                      <Card
                        className="shadow-sm border-0 h-100 position-relative"
                        style={{
                          background: `linear-gradient(135deg, #007bff10, #ffffff)`,
                          borderRadius: "15px",
                          transition: "transform 0.3s ease, box-shadow 0.3s ease",
                          overflow: "hidden", // Ensure content stays within card
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-10px) scale(1.02)";
                          e.currentTarget.style.boxShadow = "0 12px 25px #007bff40";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0) scale(1)";
                          e.currentTarget.style.boxShadow = "0 6px 15px rgba(0, 0, 0, 0.1)";
                        }}
                      >
                        <CardBody className="p-2 p-md-3">
                          <div
                            ref={mtdRef}
                            style={{
                              padding: "15px",
                              maxHeight: "100%", // Prevent overflow
                              overflowY: "auto", // Add scroll if content overflows
                            }}
                          >
                            <div style={{ textAlign: "center", marginBottom: "15px" }}>
                              <h3 style={{ color: "#007bff", fontSize: "clamp(1.2rem, 3vw, 1.5rem)" }}>
                                DSR Report - {new Date().toISOString().split("T")[0]}
                              </h3>
                            </div>
                            <h4 style={{ color: "#007bff", fontSize: "clamp(1rem, 2.5vw, 1.2rem)" }}>
                              Month-to-Date (MTD) Data
                            </h4>
                            <table
                              style={{
                                width: "100%",
                                borderCollapse: "collapse",
                                fontSize: "clamp(0.8rem, 2vw, 1rem)",
                                tableLayout: "fixed", // Prevent table from expanding beyond card
                              }}
                            >
                              <tbody>
                                <tr>
                                  <td style={{ padding: "5px", background: "#e6f0fa", wordBreak: "break-word" }}>MTD Sale Price:</td>
                                  <td style={{ padding: "5px", wordBreak: "break-word" }}>₹{mtdData.salePrice.toLocaleString()}</td>
                                  <td style={{ padding: "5px", background: "#e6f0fa", wordBreak: "break-word" }}>Till Date Target:</td>
                                  <td style={{ padding: "5px", wordBreak: "break-word" }}>₹{mtdData.target.toLocaleString()}</td>
                                </tr>
                                <tr>
                                  <td style={{ padding: "5px", background: "#e6f0fa", wordBreak: "break-word" }}>Deficit:</td>
                                  <td style={{ padding: "5px", wordBreak: "break-word" }}>₹{mtdData.deficit.toLocaleString()} ({mtdData.deficitPercentage}%)</td>
                                  <td style={{ padding: "5px", background: "#e6f0fa", wordBreak: "break-word" }}>ASPD Price:</td>
                                  <td style={{ padding: "5px", wordBreak: "break-word" }}>₹0</td>
                                </tr>
                                <tr>
                                  <td style={{ padding: "5px", background: "#e6f0fa", wordBreak: "break-word" }}>Walkins:</td>
                                  <td style={{ padding: "5px", wordBreak: "break-word" }}>{mtdData.walkins}</td>
                                  <td style={{ padding: "5px", background: "#e6f0fa", wordBreak: "break-word" }}>Bills:</td>
                                  <td style={{ padding: "5px", wordBreak: "break-word" }}>{mtdData.bills}</td>
                                </tr>
                                <tr>
                                  <td style={{ padding: "5px", background: "#e6f0fa", wordBreak: "break-word" }}>Qty:</td>
                                  <td style={{ padding: "5px", wordBreak: "break-word" }}>{mtdData.qty}</td>
                                  <td style={{ padding: "5px", background: "#e6f0fa", wordBreak: "break-word" }}>Store Target:</td>
                                  <td style={{ padding: "5px", wordBreak: "break-word" }}>₹{mtdData.storeTarget.toLocaleString()}</td>
                                </tr>
                                <tr>
                                  <td style={{ padding: "5px", background: "#e6f0fa", wordBreak: "break-word" }}>Store ACH%:</td>
                                  <td style={{ padding: "5px", wordBreak: "break-word" }}>{mtdData.storeAch}%</td>
                                  <td style={{ padding: "5px", background: "#e6f0fa", wordBreak: "break-word" }}>Store AUPT:</td>
                                  <td style={{ padding: "5px", wordBreak: "break-word" }}>{mtdData.storeAupt}</td>
                                </tr>
                                <tr>
                                  <td style={{ padding: "5px", background: "#e6f0fa", wordBreak: "break-word" }}>Store AVPT:</td>
                                  <td style={{ padding: "5px", wordBreak: "break-word" }}>₹{mtdData.storeAvpt.toLocaleString()}</td>
                                  <td style={{ padding: "5px", background: "#e6f0fa", wordBreak: "break-word" }}></td>
                                  <td style={{ padding: "5px", wordBreak: "break-word" }}></td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <Button
                            color="primary"
                            onClick={downloadMTDPDF}
                            style={{ width: "100", borderRadius: "8px", fontSize: "clamp(0.9rem, 2vw, 1rem)" }}
                          >
                            Download PDF
                          </Button>
                          <div
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "4px",
                              background: "linear-gradient(90deg, #007bff, #007bff80)",
                            }}
                          ></div>
                        </CardBody>
                      </Card>
                    </Col>

                    {/* Today's Data Card */}
                    <Col xs="12" md="6" lg="4">
                      <Card
                        className="shadow-sm border-0 h-100 position-relative"
                        style={{
                          background: `linear-gradient(135deg, #28a74510, #ffffff)`,
                          borderRadius: "15px",
                          transition: "transform 0.3s ease, box-shadow 0.3s ease",
                          overflow: "hidden",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-10px) scale(1.02)";
                          e.currentTarget.style.boxShadow = "0 12px 25px #28a74540";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0) scale(1)";
                          e.currentTarget.style.boxShadow = "0 6px 15px rgba(0, 0, 0, 0.1)";
                        }}
                      >
                        <CardBody className="p-2 p-md-3">
                          <div
                            ref={todayRef}
                            style={{
                              padding: "15px",
                              maxHeight: "100%",
                              overflowY: "auto",
                            }}
                          >
                            <div style={{ textAlign: "center", marginBottom: "15px" }}>
                              <h3 style={{ color: "#28a745", fontSize: "clamp(1.2rem, 3vw, 1.5rem)" }}>
                                DSR Report - {new Date().toISOString().split("T")[0]}
                              </h3>
                            </div>
                            <h4 style={{ color: "#28a745", fontSize: "clamp(1rem, 2.5vw, 1.2rem)" }}>
                              Today's Data
                            </h4>
                            <table
                              style={{
                                width: "100%",
                                borderCollapse: "collapse",
                                fontSize: "clamp(0.8rem, 2vw, 1rem)",
                                tableLayout: "fixed",
                              }}
                            >
                              <tbody>
                                <tr>
                                  <td style={{ padding: "5px", background: "#e6f0fa", wordBreak: "break-word" }}>Walkins:</td>
                                  <td style={{ padding: "5px", wordBreak: "break-word" }}>{todayData.walkins}</td>
                                  <td style={{ padding: "5px", background: "#e6f0fa", wordBreak: "break-word" }}>Bills:</td>
                                  <td style={{ padding: "5px", wordBreak: "break-word" }}>{todayData.bills}</td>
                                </tr>
                                <tr>
                                  <td style={{ padding: "5px", background: "#e6f0fa", wordBreak: "break-word" }}>Qty:</td>
                                  <td style={{ padding: "5px", wordBreak: "break-word" }}>{todayData.qty}</td>
                                  <td style={{ padding: "5px", background: "#e6f0fa", wordBreak: "break-word" }}>Day Target:</td>
                                  <td style={{ padding: "5px", wordBreak: "break-word" }}>₹{todayData.dayTarget.toLocaleString()}</td>
                                </tr>
                                <tr>
                                  <td style={{ padding: "5px", background: "#e6f0fa", wordBreak: "break-word" }}>Day Achieved:</td>
                                  <td style={{ padding: "5px", wordBreak: "break-word" }}>₹{todayData.dayAchieved.toLocaleString()}</td>
                                  <td style={{ padding: "5px", background: "#e6f0fa", wordBreak: "break-word" }}>Day ACH%:</td>
                                  <td style={{ padding: "5px", wordBreak: "break-word" }}>{todayData.dayAchPercentage}%</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <Button
                            color="success"
                            onClick={downloadTodayPDF}
                            style={{ width: "100", borderRadius: "8px", fontSize: "clamp(0.9rem, 2vw, 1rem)" }}
                          >
                            Download PDF
                          </Button>
                          <div
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "4px",
                              background: "linear-gradient(90deg, #28a745, #28a74580)",
                            }}
                          ></div>
                        </CardBody>
                      </Card>
                    </Col>

                    {/* Best Performers Card */}
                    <Col xs="12" md="6" lg="4">
                      <Card
                        className="shadow-sm border-0 h-100 position-relative"
                        style={{
                          background: `linear-gradient(135deg, #ffc10710, #ffffff)`,
                          borderRadius: "15px",
                          transition: "transform 0.3s ease, box-shadow 0.3s ease",
                          overflow: "hidden",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-10px) scale(1.02)";
                          e.currentTarget.style.boxShadow = "0 12px 25px #ffc10740";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0) scale(1)";
                          e.currentTarget.style.boxShadow = "0 6px 15px rgba(0, 0, 0, 0.1)";
                        }}
                      >
                        <CardBody className="p-2 p-md-3">
                          <div style={{ fontSize: "clamp(1.5rem, 5vw, 2.5rem)", color: "#ffc107", marginBottom: "15px", textAlign: "center" }}>
                            <FaTrophy />
                          </div>
                          <CardTitle tag="h5" className="mb-2 text-center" style={{ fontWeight: "600", color: "#333", fontSize: "clamp(1rem, 2.5vw, 1.2rem)" }}>
                            🏆 Best Performers
                          </CardTitle>
                          <div className="mb-3" style={{ fontSize: "clamp(0.9rem, 2vw, 1rem)", maxHeight: "200px", overflowY: "auto" }}>
                            {bestPerformers.map((performer, index) => (
                              <p key={index} style={{ color: "#666", margin: "5px 0", textAlign: "left", wordBreak: "break-word" }}>
                                {index + 1}. {performer.name}: ₹{performer.sales.toLocaleString()}
                              </p>
                            ))}
                          </div>
                          <div
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "4px",
                              background: "linear-gradient(90deg, #ffc107, #ffc10780)",
                            }}
                          ></div>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <style jsx>{`
        .page-content {
          padding: 10px;
        }

        .hover-scale:hover {
          transform: scale(1.1) !important;
        }

        .position-relative {
          position: relative;
        }

        @media (max-width: 768px) {
          .d-flex.flex-column.flex-md-row {
            flex-direction: column;
            align-items: flex-start;
          }

          .card-body {
            padding: 10px;
          }

          table {
            font-size: 0.8rem;
          }

          .btn {
            font-size: 0.9rem;
            padding: 5px 10px;
          }
        }

        @media (max-width: 576px) {
          .row.g-2.g-md-4 {
            gap: 1rem;
          }

          .card {
            margin-bottom: 1rem;
          }

          h4 {
            font-size: 1.2rem;
          }

          table td {
            padding: 3px;
            font-size: 0.7rem;
          }

          .btn {
            font-size: 0.8rem;
            padding: 4px 8px;
          }
        }
      `}</style>
    </React.Fragment>
  );
};

export default DailySalesReport;