import React, { useEffect, useState } from "react";
import { Button, Card, CardBody, Col, Container, Row, Table } from "reactstrap";
import { FaFileExcel } from "react-icons/fa";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getFinancialYearSetups } from "../../../ApiService/FinancialYearSetup/FinancialYearSetup";

const FinancialYearSetupList = () => {
  const navigate = useNavigate();
  const [financialYears, setFinancialYears] = useState([]);

  useEffect(() => {
    const fetchFinancialYears = async () => {
      try {
        const response = await getFinancialYearSetups();
        const formattedData = response.map((item, index) => ({
          id: item.id,
          financialYearName: item.fy_name,
          startDate: item.start_date,
          endDate: item.end_date,
          openingStockPrevYear: item.fy_data?.opening_stock_count ?? 0, 
          closingStockPrevYear: item.fy_data?.closing_stock_count ?? 0,
          openingCashPrevYear: item.fy_data?.open_balance ?? 0, 
          closingCashPrevYear: item.fy_data?.closing_balance ?? 0,
          lockPrevYear: item.lock ? "Yes" : "No",
          createdAt: item.created_at,
        }));
        setFinancialYears(formattedData);
      } catch (error) {
        console.error("Error fetching financial year setups:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to fetch financial year setups.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };

    fetchFinancialYears();
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const handleExcelDownload = () => {
    const headers = [
      "Sr.No",
      "ID",
      "Financial Year Name",
      "Start Date",
      "End Date",
      "Opening Stock (Prev. Year)",
      "Closing Stock (Prev. Year)",
      "Opening Cash (Prev. Year)",
      "Closing Cash (Prev. Year)",
      "Lock Prev. Year",
      "Created At",
    ];
    const rows = financialYears.map((year, index) => [
      index + 1,
      year.id,
      year.financialYearName,
      year.startDate,
      year.endDate,
      year.openingStockPrevYear,
      year.closingStockPrevYear,
      year.openingCashPrevYear,
      year.closingCashPrevYear,
      year.lockPrevYear,
      year.createdAt,
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "financial_year_setup.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Financial Management"
            breadcrumbItem="Financial Year Setup List"
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
                      Financial Year Setup List
                    </h4>
                    <div className="d-flex flex-wrap gap-2">
                      <Button
                        color="primary"
                        onClick={() => navigate("/financial-year-setup-form")}
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
                          className="bx bx-plus"
                          style={{ fontSize: "18px" }}
                        ></i>{" "}
                        Add
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
                          <th>Financial Year Name</th>
                          <th>Start Date</th>
                          <th>End Date</th>
                          <th>Opening Stock (Prev. Year)</th>
                          <th>Closing Stock (Prev. Year)</th>
                          <th>Opening Cash (Prev. Year)</th>
                          <th>Closing Cash (Prev. Year)</th>
                          <th>Lock Prev. Year</th>
                        </tr>
                      </thead>
                      <tbody>
                        {financialYears.map((year, index) => (
                          <tr key={year.id}>
                            <td>{index + 1}</td>
                            <td>{year.id}</td>
                            <td>{year.financialYearName}</td>
                            <td>{year.startDate}</td>
                            <td>{year.endDate}</td>
                            <td>{year.openingStockPrevYear}</td>
                            <td>{year.closingStockPrevYear}</td>
                            <td>{year.openingCashPrevYear}</td>
                            <td>{year.closingCashPrevYear}</td>
                            <td>{year.lockPrevYear}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
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

export default FinancialYearSetupList;
