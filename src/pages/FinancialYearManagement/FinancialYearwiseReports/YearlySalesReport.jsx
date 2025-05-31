import React, { useRef } from "react";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Table,
} from "reactstrap";
import { FaEye, FaEdit, FaTrash, FaFileExcel } from "react-icons/fa"; 
import Breadcrumbs from "../../../components/Common/Breadcrumb"; 
import { useNavigate } from "react-router-dom";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { jsPDF } from "jspdf"; 
import "jspdf-autotable"; 
import * as XLSX from "xlsx"; 

// Validation schema using Yup
const validationSchema = Yup.object({
  financialYear: Yup.string().required("Financial Year is required"),
  customerType: Yup.string()
    .required("Customer Type is required")
    .oneOf(["B2B", "B2C", "Corporate"], "Invalid Customer Type"),
  paymentMode: Yup.string().required("Payment Mode is required"),
  startDate: Yup.date()
    .required("Start Date is required")
    .max(Yup.ref("endDate"), "Start Date must be before End Date"),
  endDate: Yup.date()
    .required("End Date is required")
    .min(Yup.ref("startDate"), "End Date must be after Start Date"),
  brand: Yup.string(), 
  doctor: Yup.string(), 
  employee: Yup.string(),
});

const YearlySalesReport = () => {
  const navigate = useNavigate();
  const reportRef = useRef(null); 

  const initialValues = {
    financialYear: "",
    customerType: "",
    paymentMode: "",
    startDate: "",
    endDate: "",
    brand: "",
    doctor: "",
    employee: "",
  };

  const salesDataList = [
    {
      id: 1,
      financialYear: "2024-2025",
      customerType: "B2B",
      paymentMode: "Cash",
      date: "2024-01-15",
      brand: "Brand A",
      doctor: "Dr. Smith",
      employee: "John Doe",
      totalGrossSales: "200000",
      totalNetSales: "180000",
      totalGstCollected: "36000",
      salesReturns: "20000",
    },
    {
      id: 2,
      financialYear: "2024-2025",
      customerType: "B2C",
      paymentMode: "Credit",
      date: "2024-02-10",
      brand: "Brand B",
      doctor: "Dr. Jones",
      employee: "Jane Roe",
      totalGrossSales: "150000",
      totalNetSales: "135000",
      totalGstCollected: "27000",
      salesReturns: "15000",
    },
    {
      id: 3,
      financialYear: "2024-2025",
      customerType: "Corporate",
      paymentMode: "Bank Transfer",
      date: "2024-03-05",
      brand: "Brand C",
      doctor: "Dr. Brown",
      employee: "Sam Lee",
      totalGrossSales: "150000",
      totalNetSales: "135000",
      totalGstCollected: "27000",
      salesReturns: "15000",
    },
  ];

  const filterOptions = {
    brands: ["Brand A", "Brand B", "Brand C"],
    doctors: ["Dr. Smith", "Dr. Jones", "Dr. Brown"],
    employees: ["John Doe", "Jane Roe", "Sam Lee"],
  };

  const handleSubmit = (values, { setSubmitting }) => {
    console.log("Filter Values:", values);
  
    const filteredData = salesDataList.filter((sale) => {
      const saleDate = new Date(sale.date);
      const startDate = new Date(values.startDate);
      const endDate = new Date(values.endDate);
      return (
        (!values.financialYear || sale.financialYear === values.financialYear) &&
        (!values.customerType || sale.customerType === values.customerType) &&
        (!values.paymentMode || sale.paymentMode === values.paymentMode) &&
        (!values.brand || sale.brand === values.brand) &&
        (!values.doctor || sale.doctor === values.doctor) &&
        (!values.employee || sale.employee === values.employee) &&
        saleDate >= startDate &&
        saleDate <= endDate
      );
    });
    console.log("Filtered Data:", filteredData);
    setTimeout(() => {
      setSubmitting(false);
    }, 1000);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleView = (id) => {
    navigate(`/sales-details/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/edit-sales/${id}`);
  };

  const handleDelete = (id) => {
    console.log(`Delete sale with ID: ${id}`);

  };

  // PDF Download Handler using jsPDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Yearly Sales Report", 14, 20);

    const headers = [
      "Sr.No",
      "ID",
      "Financial Year",
      "Customer Type",
      "Payment Mode",
      "Date",
      "Brand",
      "Doctor",
      "Employee",
      "Total Gross Sales",
      "Total Net Sales",
      "Total GST Collected",
      "Sales Returns",
    ];

    const data = salesDataList.map((sale, index) => [
      index + 1,
      sale.id,
      sale.financialYear,
      sale.customerType,
      sale.paymentMode,
      sale.date,
      sale.brand,
      sale.doctor,
      sale.employee,
      `${sale.totalGrossSales}`,
      `${sale.totalNetSales}`,
      `${sale.totalGstCollected}`,
      `${sale.salesReturns}`,
    ]);

    // Add table to PDF using autotable
    doc.autoTable({
      head: [headers],
      body: data,
      startY: 30,
      theme: "striped",
      headStyles: { fillColor: [0, 123, 255] }, 
      styles: { fontSize: 8, cellPadding: 2 }, 
      columnStyles: {
        0: { cellWidth: 10 }, 
        1: { cellWidth: 10 },
        2: { cellWidth: 20 },
        3: { cellWidth: 20 }, 
        4: { cellWidth: 20 },
        5: { cellWidth: 20 },
        6: { cellWidth: 20 },
        7: { cellWidth: 20 },
        8: { cellWidth: 20 },
        9: { cellWidth: 20 },
        10: { cellWidth: 20 }, 
        11: { cellWidth: 20 },
        12: { cellWidth: 20 },
      },
    });

    // Save the PDF
    doc.save(`Yearly_Sales_Report_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  // Excel Download Handler
  const handleDownloadExcel = () => {
    const headers = [
      "Sr.No",
      "ID",
      "Financial Year",
      "Customer Type",
      "Payment Mode",
      "Date",
      "Brand",
      "Doctor",
      "Employee",
      "Total Gross Sales",
      "Total Net Sales",
      "Total GST Collected",
      "Sales Returns",
    ];
    const rows = salesDataList.map((sale, index) => [
      index + 1,
      sale.id,
      sale.financialYear,
      sale.customerType,
      sale.paymentMode,
      sale.date,
      sale.brand,
      sale.doctor,
      sale.employee,
      `${sale.totalGrossSales}`,
      `${sale.totalNetSales}`,
      `${sale.totalGstCollected}`,
      `${sale.salesReturns}`,
    ]);
    const data = [headers, ...rows];
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sales Report");
    XLSX.writeFile(wb, `Yearly_Sales_Report_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Financial Management" breadcrumbItem="Yearly Sales Report" />

          <Row>
            <Col xs="12">
              <Card className="shadow-lg" style={{ borderRadius: "20px", overflow: "hidden", background: "#f8f9fa" }}>
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
                      Yearly Sales Report
                    </h4>
                    <div className="d-flex flex-wrap gap-2">
                      <Button
                        color="success"
                        onClick={handleDownloadExcel}
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
                        Download Excel
                      </Button>
                      <Button
                        color="danger"
                        onClick={handleDownloadPDF}
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
                        <i className="bx bx-printer" style={{ fontSize: "18px" }}></i>
                        Download PDF
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
                        <i className="bx bx-undo" style={{ fontSize: "18px" }}></i>
                      </Button>
                    </div>
                  </div>

                  {/* Filters */}
                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ values, isSubmitting }) => (
                      <Form className="no-print">
                        <Row className="g-4 mb-4">
                          <Col md="4">
                            <FormGroup>
                              <Label for="financialYear" className="fw-bold text-dark">
                                Financial Year
                              </Label>
                              <Field
                                as={Input}
                                type="select"
                                name="financialYear"
                                id="financialYear"
                                className="form-control"
                                style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                              >
                                <option value="">Select Financial Year</option>
                                <option value="2024-2025">2024-2025</option>
                                <option value="2023-2024">2023-2024</option>
                                <option value="2022-2023">2022-2023</option>
                              </Field>
                              <ErrorMessage name="financialYear" component="div" className="invalid-feedback" />
                            </FormGroup>
                          </Col>
                          <Col md="4">
                            <FormGroup>
                              <Label for="customerType" className="fw-bold text-dark">
                                Customer Type
                              </Label>
                              <Field
                                as={Input}
                                type="select"
                                name="customerType"
                                id="customerType"
                                className="form-control"
                                style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                              >
                                <option value="">Select Customer Type</option>
                                <option value="B2B">B2B</option>
                                <option value="B2C">B2C</option>
                                <option value="Corporate">Corporate</option>
                              </Field>
                              <ErrorMessage name="customerType" component="div" className="invalid-feedback" />
                            </FormGroup>
                          </Col>
                          <Col md="4">
                            <FormGroup>
                              <Label for="paymentMode" className="fw-bold text-dark">
                                Payment Mode
                              </Label>
                              <Field
                                as={Input}
                                type="select"
                                name="paymentMode"
                                id="paymentMode"
                                className="form-control"
                                style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                              >
                                <option value="">All Payment Modes</option>
                                <option value="Cash">Cash</option>
                                <option value="Credit">Credit</option>
                                <option value="Bank Transfer">Bank Transfer</option>
                              </Field>
                              <ErrorMessage name="paymentMode" component="div" className="invalid-feedback" />
                            </FormGroup>
                          </Col>
                          <Col md="4">
                            <FormGroup>
                              <Label for="startDate" className="fw-bold text-dark">
                                Start Date
                              </Label>
                              <Field
                                as={Input}
                                type="date"
                                name="startDate"
                                id="startDate"
                                className="form-control"
                                style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                              />
                              <ErrorMessage name="startDate" component="div" className="invalid-feedback" />
                            </FormGroup>
                          </Col>
                          <Col md="4">
                            <FormGroup>
                              <Label for="endDate" className="fw-bold text-dark">
                                End Date
                              </Label>
                              <Field
                                as={Input}
                                type="date"
                                name="endDate"
                                id="endDate"
                                className="form-control"
                                style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                              />
                              <ErrorMessage name="endDate" component="div" className="invalid-feedback" />
                            </FormGroup>
                          </Col>
                          <Col md="4">
                            <FormGroup>
                              <Label for="brand" className="fw-bold text-dark">
                                Brand
                              </Label>
                              <Field
                                as={Input}
                                type="select"
                                name="brand"
                                id="brand"
                                className="form-control"
                                style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                              >
                                <option value="">All Brands</option>
                                {filterOptions.brands.map((brand, index) => (
                                  <option key={index} value={brand}>{brand}</option>
                                ))}
                              </Field>
                            </FormGroup>
                          </Col>
                          <Col md="4">
                            <FormGroup>
                              <Label for="doctor" className="fw-bold text-dark">
                                Doctor
                              </Label>
                              <Field
                                as={Input}
                                type="select"
                                name="doctor"
                                id="doctor"
                                className="form-control"
                                style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                              >
                                <option value="">All Doctors</option>
                                {filterOptions.doctors.map((doctor, index) => (
                                  <option key={index} value={doctor}>{doctor}</option>
                                ))}
                              </Field>
                            </FormGroup>
                          </Col>
                          <Col md="4">
                            <FormGroup>
                              <Label for="employee" className="fw-bold text-dark">
                                Employee
                              </Label>
                              <Field
                                as={Input}
                                type="select"
                                name="employee"
                                id="employee"
                                className="form-control"
                                style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                              >
                                <option value="">All Employees</option>
                                {filterOptions.employees.map((employee, index) => (
                                  <option key={index} value={employee}>{employee}</option>
                                ))}
                              </Field>
                            </FormGroup>
                          </Col>
                          <Col md="12" className="text-end">
                            <Button
                              type="submit"
                              color="primary"
                              disabled={isSubmitting}
                              style={{
                                padding: "10px 25px",
                                borderRadius: "8px",
                                boxShadow: "0 4px 10px rgba(0, 123, 255, 0.3)",
                                transition: "transform 0.3s ease",
                              }}
                              className="hover-scale"
                            >
                              {isSubmitting ? "Filtering..." : "Apply Filters"}
                            </Button>
                          </Col>
                        </Row>
                      </Form>
                    )}
                  </Formik>

                  {/* Report Table */}
                  <div ref={reportRef} className="table-container">
                    <Table className="table table-striped table-hover align-middle" responsive>
                      <thead
                        style={{
                          background: "linear-gradient(90deg, #007bff, #00c4cc)",
                          color: "#fff",
                        }}
                      >
                        <tr>
                          <th>Sr.No</th>
                          <th>ID</th>
                          <th>Financial Year</th>
                          <th>Customer Type</th>
                          <th>Payment Mode</th>
                          <th>Date</th>
                          <th>Brand</th>
                          <th>Doctor</th>
                          <th>Employee</th>
                          <th>Total Gross Sales</th>
                          <th>Total Net Sales</th>
                          <th>Total GST Collected</th>
                          <th>Sales Returns</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {salesDataList.map((sale, index) => (
                          <tr key={sale.id}>
                            <td>{index + 1}</td>
                            <td>{sale.id}</td>
                            <td>{sale.financialYear}</td>
                            <td>{sale.customerType}</td>
                            <td>{sale.paymentMode}</td>
                            <td>{sale.date}</td>
                            <td>{sale.brand}</td>
                            <td>{sale.doctor}</td>
                            <td>{sale.employee}</td>
                            <td>₹{sale.totalGrossSales}</td>
                            <td>₹{sale.totalNetSales}</td>
                            <td>₹{sale.totalGstCollected}</td>
                            <td>₹{sale.salesReturns}</td>
                            <td>
                              <div className="d-flex gap-2 justify-content-center">
                                <FaEye
                                  style={{ fontSize: "18px", color: "#007bff", cursor: "pointer" }}
                                  onClick={() => handleView(sale.id)}
                                  title="View"
                                />
                                <FaEdit
                                  style={{ fontSize: "18px", color: "#4caf50", cursor: "pointer" }}
                                  onClick={() => handleEdit(sale.id)}
                                  title="Edit"
                                />
                                <FaTrash
                                  style={{ fontSize: "18px", color: "#f44336", cursor: "pointer" }}
                                  onClick={() => handleDelete(sale.id)}
                                  title="Delete"
                                />
                              </div>
                            </td>
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
        .form-control:focus {
          border-color: #007bff;
          box-shadow: 0 0 8px rgba(0, 123, 255, 0.3);
        }
        .invalid-feedback {
          font-size: 12px;
          color: #dc3545;
        }
        .table-container {
          max-height: 400px; 
          overflow-y: auto;
          overflow-x: auto;
          border-radius: 10px;
          background: #fff;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          padding: 10px;
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
        @media print {
          .table-container {
            box-shadow: none;
            border: 1px solid #000;
            padding: 0;
          }
          .table thead {
            background: #007bff !important;
            -webkit-print-color-adjust: exact;
          }
          .no-print {
            display: none; 
          }
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

export default YearlySalesReport;