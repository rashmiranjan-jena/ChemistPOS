import React, { useEffect, useState } from "react";
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
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import {
  postFinancialYearSetup,
  getFinancialYearData,
} from "../../../ApiService/FinancialYearSetup/FinancialYearSetup";

const validationSchema = Yup.object({
  startDate: Yup.date().required("Start Date is required").nullable(),
  endDate: Yup.date()
    .required("End Date is required")
    .nullable()
    .min(Yup.ref("startDate"), "End Date must be after Start Date"),
  lockPrevYear: Yup.string()
    .required("Lock Previous Year selection is required")
    .oneOf(["Yes", "No"], "Invalid selection"),
});

const FinancialYearSetupForm = () => {
  const navigate = useNavigate();
  const [financialData, setFinancialData] = useState({
    financialYear: "",
    openingStock: "0",
    closingStock: "0",
    openingCash: "0",
    closingCash: "0",
  });

  const getCurrentFinancialYear = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const startYear = currentMonth < 3 ? currentYear - 1 : currentYear;
    const endYear = startYear + 1;

    return {
      name: `${startYear}-${endYear}`,
      startDate: new Date(startYear, 3, 1), // April 1st
      endDate: new Date(endYear, 2, 31), // March 31st
    };
  };

  const currentFinancialYear = getCurrentFinancialYear();

  const generateFinancialYearName = (startDate) => {
    if (!startDate) return currentFinancialYear.name;
    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth();
    const financialStartYear = startMonth < 3 ? startYear - 1 : startYear;
    const financialEndYear = financialStartYear + 1;
    return `${financialStartYear}-${financialEndYear}`;
  };

  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth();
        const prevFinancialStartYear =
          currentMonth < 3 ? currentYear - 2 : currentYear - 1;
        const prevFinancialEndYear = prevFinancialStartYear + 1;

        const response = await getFinancialYearData();
        setFinancialData({
          financialYear: response?.financial_year ?? "",
          openingStock: response?.opening_stock_count ?? "0",
          closingStock: response?.closing_stock_count ?? "0",
          openingCash: response?.open_balance ?? "0",
          closingCash: response?.close_balance ?? "0",
        });
      } catch (error) {
        console.error("Error fetching financial data:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to fetch financial data.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };

    fetchFinancialData();
  }, []);

  const formik = useFormik({
    initialValues: {
      financialYearName: currentFinancialYear.name,
      startDate: currentFinancialYear.startDate,
      endDate: currentFinancialYear.endDate,
      lockPrevYear: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const fy_name = generateFinancialYearName(values.startDate);
        const payload = {
          fy_name,
          start_date: values.startDate.toISOString().slice(0, 10),
          end_date: values.endDate.toISOString().slice(0, 10),
          fy_data: {
            opening_stock_count: parseFloat(financialData.openingStock),
            closing_stock_count: parseFloat(financialData.closingStock),
            open_balance: parseFloat(financialData.openingCash),
            closing_balance: parseFloat(financialData.closingCash),
          },
          lock: values.lockPrevYear,
          previous_financial_year: financialData.financialYear,
        };

        const response = await postFinancialYearSetup(payload);

        Swal.fire({
          title: "Financial Year Setup Registered!",
          text: "The financial year setup has been successfully registered.",
          icon: "success",
          confirmButtonText: "OK",
        });

        if (response) {
          formik.resetForm();
          navigate("/financial-year-setup-list");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        Swal.fire({
          title: "Error!",
          text: error.message || "Failed to submit the financial year setup.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    },
  });

  document.title = "Financial Year Setup";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Financial Management"
            breadcrumbItem="Add Financial Year Setup"
          />
          <Row>
            <Col xs="12">
              <Card
                className="shadow-lg"
                style={{ borderRadius: "15px", overflow: "hidden" }}
              >
                <CardBody className="p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
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
                      Add Financial Year Setup
                    </h4>
                    <Button
                      color="secondary"
                      onClick={() => navigate(-1)}
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
                      <i
                        className="bx bx-undo"
                        style={{ fontSize: "30px" }}
                      ></i>
                    </Button>
                  </div>

                  <Form onSubmit={formik.handleSubmit}>
                    <Row className="g-4">
                      {/* Financial Year Name (Auto-generated) */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="financialYearName"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Financial Year Name
                          </Label>
                          <Input
                            type="text"
                            name="financialYearName"
                            id="financialYearName"
                            value={generateFinancialYearName(
                              formik.values.startDate
                            )}
                            disabled
                            className="form-control"
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          <small className="text-muted">
                            Auto-generated based on Start Date
                          </small>
                        </FormGroup>
                      </Col>

                      {/* Start Date (Calendar Input) */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="startDate"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Start Date <span className="text-danger">*</span>
                          </Label>
                          <DatePicker
                            selected={formik.values.startDate}
                            onChange={(date) => {
                              formik.setFieldValue("startDate", date);
                              formik.setFieldValue(
                                "financialYearName",
                                generateFinancialYearName(date)
                              );
                              if (date) {
                                const nextYear = date.getFullYear() + 1;
                                formik.setFieldValue(
                                  "endDate",
                                  new Date(nextYear, 2, 31)
                                );
                              }
                            }}
                            dateFormat="yyyy-MM-dd"
                            className={`form-control ${
                              formik.touched.startDate &&
                              formik.errors.startDate
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                            placeholderText="Select Start Date"
                          />
                          {formik.touched.startDate &&
                            formik.errors.startDate && (
                              <div className="invalid-feedback">
                                {formik.errors.startDate}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      {/* End Date (Calendar Input) */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="endDate"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            End Date <span className="text-danger">*</span>
                          </Label>
                          <DatePicker
                            selected={formik.values.endDate}
                            onChange={(date) =>
                              formik.setFieldValue("endDate", date)
                            }
                            dateFormat="yyyy-MM-dd"
                            className={`form-control ${
                              formik.touched.endDate && formik.errors.endDate
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                            placeholderText="Select End Date"
                            minDate={formik.values.startDate}
                          />
                          {formik.touched.endDate && formik.errors.endDate && (
                            <div className="invalid-feedback">
                              {formik.errors.endDate}
                            </div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* Financial Data Table */}
                      <Col md="12">
                        <FormGroup>
                          <Label
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Financial Data
                          </Label>
                          <Table
                            bordered
                            responsive
                            className="table table-bordered"
                            style={{ backgroundColor: "#f8f9fa" }}
                          >
                            <thead className="table-light">
                              <tr>
                                <th>Financial Year</th>
                                <th>Stock (Opening Stock)</th>
                                <th>Stock (Closing Stock)</th>
                                <th>Cash (Opening Cash)</th>
                                <th>Cash (Closing Cash)</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>{financialData.financialYear}</td>
                                <td>{financialData.openingStock}</td>
                                <td>{financialData.closingStock}</td>
                                <td>{financialData.openingCash}</td>
                                <td>{financialData.closingCash}</td>
                              </tr>
                            </tbody>
                          </Table>
                        </FormGroup>
                      </Col>

                      {/* Lock Previous Year Transactions (Yes/No) */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="lockPrevYear"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Lock Previous Year Transactions{" "}
                            <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="select"
                            name="lockPrevYear"
                            id="lockPrevYear"
                            value={formik.values.lockPrevYear}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.lockPrevYear &&
                              formik.errors.lockPrevYear
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          >
                            <option value="">Select Option</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </Input>
                          {formik.touched.lockPrevYear &&
                            formik.errors.lockPrevYear && (
                              <div className="invalid-feedback">
                                {formik.errors.lockPrevYear}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      {/* Submit Button */}
                      <Col md="12" className="text-end">
                        <Button
                          type="submit"
                          color="primary"
                          disabled={formik.isSubmitting}
                          style={{
                            padding: "10px 25px",
                            borderRadius: "8px",
                            boxShadow: "0 4px 10px rgba(0, 123, 255, 0.3)",
                            transition: "transform 0.3s ease",
                          }}
                          className="hover-scale"
                        >
                          {formik.isSubmitting ? "Submitting..." : "Submit"}
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <style jsx>{`
        .hover-scale:hover {
          transform: scale(1.05) !important;
        }
        .form-control:focus {
          border-color: #007bff;
          box-shadow: 0 0 8px rgba(0, 123, 255, 0.3);
        }
        .invalid-feedback {
          font-size: 12px;
          color: #dc3545;
        }
        .react-datepicker-wrapper {
          width: 100%;
        }
        .table-bordered th,
        .table-bordered td {
          vertical-align: middle;
          text-align: center;
        }
      `}</style>
    </React.Fragment>
  );
};

export default FinancialYearSetupForm;
