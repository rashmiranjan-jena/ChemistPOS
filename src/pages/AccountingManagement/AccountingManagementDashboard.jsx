import React from "react";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Row,
} from "reactstrap";
import { FaFileAlt, FaMoneyBillWave, FaChartLine, FaCalculator, FaUserShield, FaReceipt, FaEye, FaShoppingCart, FaBoxOpen, FaChartBar, FaFileInvoiceDollar, FaUsers, FaTruck, FaUserMd, FaBriefcase, FaBalanceScale } from "react-icons/fa";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";

const AccountingManagementDashboard = () => {
  const navigate = useNavigate();

  const dashboardData = [
  { title: "Financial Transactions", route: "/financial-transactions-list", icon: <FaFileAlt />, color: "#007bff" },
  // { title: "Received Amount (Cash Inflow)", route: "/received-amount-list", icon: <FaMoneyBillWave />, color: "#00c4cc" },
  { title: "Paid Amount (Cash Outflow)", route: "/paid-amount-list", icon: <FaMoneyBillWave />, color: "#f44336" },
  { title: "Receivable (Pending Amount from Customers)", route: "/receivables-list", icon: <FaReceipt />, color: "#28a745" },
  { title: "Payable (Pending Amount to Suppliers)", route: "/payables-list", icon: <FaReceipt />, color: "#ffc107" },
  { title: "Salary & Expenses Management", route: "/salary-and-expenses-cart", icon: <FaUserShield />, color: "#20c997" },
  { title: "Tax Input (GST Paid on Purchases)", route: "/tax-input-list", icon: <FaReceipt />, color: "#6f42c1" },
  { title: "Tax Output (GST Collected on Sales)", route: "/tax-output-list", icon: <FaReceipt />, color: "#e83e8c" },
  { title: "Tax Difference & GST Payable Alert", route: "/tax-difference-list", icon: <FaChartLine />, color: "#343a40" },
  { title: "TDS (Tax Deducted at Source)", route: "/tds-list", icon: <FaReceipt />, color: "#007bff" },
  { title: "TCS (Tax Collected at Source)", route: "/tcs-list", icon: <FaReceipt />, color: "#28a745" },
  { title: "Sales Report", route: "/sales-report", icon: <FaChartBar />, color: "#007bff" },
  { title: "Purchase Report", route: "/purchase-report", icon: <FaShoppingCart />, color: "#00c4cc" },
  { title: "Stock/Inventory Report", route: "/stock-inventory-report", icon: <FaBoxOpen />, color: "#f44336" },
  { title: "Expiry Management Report", route: "/expire-management-report", icon: <FaFileAlt />, color: "#28a745" },
  { title: "Customer Ledger (B2B/B2C/Corporate)", route: "/customer-ledger", icon: <FaUsers />, color: "#ffc107" },
  { title: "Supplier Ledger", route: "/supplier-ledger", icon: <FaTruck />, color: "#17a2b8" },
  { title: "Doctor-wise Sales & Commission Report", route: "/doctor-sales-commission", icon: <FaUserMd />, color: "#6610f2" },
  { title: "MR-wise Sales & Commission Receivable Report", route: "/mr-sales-commission", icon: <FaBriefcase />, color: "#dc3545" },
  { title: "Gross Profit Report", route: "/gross-profit-report", icon: <FaChartLine />, color: "#20c997" },
  { title: "Profit & Loss Report", route: "/profit-loss-report", icon: <FaFileInvoiceDollar />, color: "#fd7e14" },
  { title: "Balance Sheet", route: "/balance-sheet", icon: <FaBalanceScale />, color: "#6f42c1" },
  { title: "Daily Collection Report", route: "/daily-collection-report", icon: <FaMoneyBillWave />, color: "#e83e8c" },
];

  const handleBack = () => {
    navigate(-1);
  };

  const handleCardClick = (route) => {
    navigate(route);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Accounting" breadcrumbItem="Management Dashboard" />

          <Row>
            <Col xs="12">
              <Card className="shadow-lg" style={{ borderRadius: "20px", overflow: "hidden", background: "#f8f9fa" }}>
                <CardBody className="p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4
                      className="text-primary"
                      style={{
                        fontWeight: "700",
                        letterSpacing: "1px",
                        background: "linear-gradient(90deg, #007bff, #f44336)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      Accounting Management Dashboard
                    </h4>
                    <Button
                      color="secondary"
                      onClick={handleBack}
                      style={{
                        height: "40px",
                        width: "40px",
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

                  <Row className="g-4">
                    {dashboardData.map((item, index) => (
                      <Col xs="12" sm="6" lg="4" xl="3" key={index}>
                        <Card
                          className="shadow-sm border-0 h-100"
                          style={{
                            background: `linear-gradient(135deg, ${item.color}10, #ffffff)`,
                            borderRadius: "15px",
                            transition: "transform 0.3s ease, box-shadow 0.3s ease",
                            overflow: "hidden",
                            position: "relative",
                            cursor: "pointer",
                          }}
                          onClick={() => handleCardClick(item.route)}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-10px) scale(1.02)";
                            e.currentTarget.style.boxShadow = `0 12px 25px ${item.color}40`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0) scale(1)";
                            e.currentTarget.style.boxShadow = "0 6px 15px rgba(0, 0, 0, 0.1)";
                          }}
                        >
                          <CardBody className="p-3 text-center">
                            <div
                              style={{
                                fontSize: "40px",
                                color: item.color,
                                marginBottom: "15px",
                              }}
                            >
                              {item.icon}
                            </div>
                            <CardTitle
                              tag="h5"
                              className="mb-2"
                              style={{
                                fontWeight: "600",
                                color: "#333",
                                textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
                                whiteSpace: "normal",
                                wordBreak: "break-word",
                              }}
                            >
                              {item.title}
                            </CardTitle>
                            <h3
                              style={{
                                fontWeight: "700",
                                color: item.color,
                                marginBottom: "10px",
                                whiteSpace: "normal",
                                wordBreak: "break-word",
                              }}
                            >
                              {item.count}
                            </h3>
                            <FaEye
                              style={{
                                fontSize: "24px",
                                color: item.color,
                                cursor: "pointer",
                                transition: "transform 0.3s ease",
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCardClick(item.route);
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.2)"}
                              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                            />
                            <div
                              style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "4px",
                                background: `linear-gradient(90deg, ${item.color}, ${item.color}80)`,
                              }}
                            ></div>
                          </CardBody>
                        </Card>
                      </Col>
                    ))}
                  </Row>
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

        @media (max-width: 768px) {
          .card-body {
            padding: 10px;
          }

          .card-title {
            font-size: 0.9rem;
          }

          h3 {
            font-size: 1.1rem;
          }

          .fa-eye {
            font-size: 20px;
          }
        }

        @media (max-width: 576px) {
          .row.g-4 {
            gap: 1rem;
          }

          .card {
            margin-bottom: 1rem;
          }

          .card-title {
            font-size: 0.8rem;
          }

          h3 {
            font-size: 1rem;
          }

          .fa-eye {
            font-size: 18px;
          }
        }
      `}</style>
    </React.Fragment>
  );
};

export default AccountingManagementDashboard;