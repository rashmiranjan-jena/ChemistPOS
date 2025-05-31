import React, { useState, useEffect } from "react";
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
} from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useNavigate, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  getEmployee,
  postSalary,
  getSalaryById,
  updateSalary,
} from "../../../ApiService/AccountingManagement/SalaryAndExpense";
import Swal from "sweetalert2";

// Validation schema using Yup
const validationSchema = Yup.object({
  employeeName: Yup.string().required("Employee Name is required"),
  employeeId: Yup.string().required("Employee ID is required"),
  salarySlipNo: Yup.string().nullable(),
  slipUpload: Yup.mixed()
    .nullable()
    .test("fileType", "Only PDF or images are allowed", (value) => {
      if (!value) return true;
      return ["application/pdf", "image/jpeg", "image/png"].includes(
        value?.type
      );
    })
    .test("fileSize", "File size must be less than 5MB", (value) => {
      if (!value) return true;
      return value?.size <= 5 * 1024 * 1024;
    }),
  salaryAmount: Yup.number()
    .required("Salary Amount is required")
    .min(0, "Salary Amount cannot be negative"),
  paymentMode: Yup.string()
    .required("Payment Mode is required")
    .oneOf(["Cash", "BankTransfer", "UPI", "Cheque"], "Invalid Payment Mode"),
  section: Yup.string().nullable(),
  tdsRate: Yup.number()
    .required("TDS Rate is required")
    .min(0, "TDS Rate cannot be negative")
    .max(100, "TDS Rate cannot exceed 100%"),
  tdsDeduct: Yup.number().nullable(),
  transactionId: Yup.string().when("paymentMode", {
    is: (paymentMode) =>
      ["BankTransfer", "UPI", "Cheque"].includes(paymentMode),
    then: (schema) =>
      schema.required("Transaction ID is required for this payment mode"),
    otherwise: (schema) => schema.nullable(),
  }),
  dateOfPayment: Yup.date().required("Date of Payment is required"),
});

const SalaryForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state?.id;

  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(!!id);
  const [existingSlipFile, setExistingSlipFile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const employeeResponse = await getEmployee();
        setEmployees(employeeResponse ?? []);

        if (id) {
          const salaryResponse = await getSalaryById(id);
          console.log("Salary Response:", salaryResponse);
          formik.setValues({
            employeeName: salaryResponse.employee_code,
            employeeId: salaryResponse.employee_code,
            salarySlipNo: salaryResponse.salary_slip_no || "",
            slipUpload: null,
            salaryAmount: parseFloat(salaryResponse.salary_amount) || "",
            paymentMode: salaryResponse.payment_mode || "Cash",
            section: salaryResponse.tds_details?.section || "",
            tdsRate: parseFloat(salaryResponse.tds_details?.tds_rate) || "",
            tdsDeduct:
              parseFloat(salaryResponse.tds_details?.tds_deducted) || "",
            transactionId: salaryResponse.ref_no || "",
            dateOfPayment:
              salaryResponse.payment_date ||
              new Date().toISOString().slice(0, 10),
            netSalary: parseFloat(salaryResponse.net_salary) || "",
          });

          const slipFileUrl = salaryResponse.slip_file
            ? `${import.meta.env.VITE_API_BASE_URL}${salaryResponse.slip_file}`
            : null;
          console.log("Slip File URL:", slipFileUrl);
          setExistingSlipFile(slipFileUrl);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire({
          title: "Error!",
          text: error?.response?.data?.message || "Failed to fetch data.",
          icon: "error",
          confirmButtonText: "OK",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const formik = useFormik({
    initialValues: {
      employeeName: "",
      employeeId: "",
      salarySlipNo: "",
      slipUpload: null,
      salaryAmount: "",
      paymentMode: "Cash",
      section: "",
      tdsRate: "",
      tdsDeduct: "",
      transactionId: "",
      dateOfPayment: new Date().toISOString().slice(0, 10),
      netSalary: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("employee_id", values.employeeId);
        formData.append("salary_slip_no", values.salarySlipNo);
        if (values.slipUpload) {
          formData.append("slip_file", values.slipUpload);
        }
        formData.append("salary_amount", values.salaryAmount);
        formData.append("payment_mode", values.paymentMode);
        formData.append("section", values.section);
        formData.append("tds_rate", values.tdsRate);
        formData.append("tds_deducted", values.tdsDeduct);
        formData.append("ref_no", values.transactionId);
        formData.append("payment_date", values.dateOfPayment);
        formData.append("net_salary", values.netSalary);

        let response;
        if (isEditMode) {
          response = await updateSalary(id, formData);
        } else {
          response = await postSalary(formData);
        }

        if (response) {
          Swal.fire({
            title: isEditMode ? "Salary Updated!" : "Salary Registered!",
            text: isEditMode
              ? "The salary details have been successfully updated."
              : "The salary details have been successfully registered.",
            icon: "success",
            confirmButtonText: "OK",
          });
          formik.resetForm();
          navigate("/salary-list");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        Swal.fire({
          title: "Error!",
          text:
            error?.response?.data?.message ||
            "Failed to submit salary details.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    },
  });

  const { values, errors, touched, isSubmitting, handleSubmit, setFieldValue } =
    formik;

  useEffect(() => {
    const salary = parseFloat(values.salaryAmount) || 0;
    const rate = parseFloat(values.tdsRate) || 0;
    const tdsDeduct = (salary * rate) / 100;
    setFieldValue("tdsDeduct", tdsDeduct.toFixed(2));
    setFieldValue("netSalary", (salary - tdsDeduct).toFixed(2));
  }, [values.salaryAmount, values.tdsRate, setFieldValue]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Finance"
            breadcrumbItem={isEditMode ? "Edit Salary" : "Add Salary"}
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
                      {isEditMode ? "Edit Salary" : "Add Salary"}
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

                  <Form onSubmit={handleSubmit}>
                    <Row className="g-4">
                      {/* Employee Name (Dropdown) */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="employeeName"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Employee Name <span className="text-danger">*</span>
                          </Label>
                          {isLoading ? (
                            <p>Loading employees...</p>
                          ) : (
                            <Input
                              type="select"
                              name="employeeName"
                              id="employeeName"
                              value={values.employeeName}
                              onChange={(e) => {
                                const selectedId = e.target.value;
                                setFieldValue("employeeName", selectedId);
                                const selectedEmployee = employees.find(
                                  (emp) =>
                                    emp?.emp_code?.toString() === selectedId
                                );
                                setFieldValue(
                                  "employeeId",
                                  selectedEmployee?.emp_code ?? ""
                                );
                                setFieldValue(
                                  "salaryAmount",
                                  selectedEmployee?.salary ??
                                    values.salaryAmount
                                );
                              }}
                              className={`form-control ${
                                errors.employeeName && touched.employeeName
                                  ? "is-invalid"
                                  : ""
                              }`}
                              style={{
                                borderRadius: "8px",
                                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                padding: "10px",
                              }}
                              disabled={isEditMode}
                            >
                              <option value="">Select Employee</option>
                              {employees.map((employee) => (
                                <option
                                  key={employee?.emp_code}
                                  value={employee?.emp_code}
                                >
                                  {employee?.full_name}
                                </option>
                              ))}
                            </Input>
                          )}
                          {errors.employeeName && touched.employeeName && (
                            <div className="invalid-feedback">
                              {errors.employeeName}
                            </div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* Employee ID (Auto) */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="employeeId"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Employee ID <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            name="employeeId"
                            id="employeeId"
                            value={values.employeeId}
                            disabled
                            className={`form-control ${
                              errors.employeeId && touched.employeeId
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {errors.employeeId && touched.employeeId && (
                            <div className="invalid-feedback">
                              {errors.employeeId}
                            </div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* Salary Slip No (Optional) */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="salarySlipNo"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Salary Slip No
                          </Label>
                          <Input
                            type="text"
                            name="salarySlipNo"
                            id="salarySlipNo"
                            value={values.salarySlipNo}
                            onChange={formik.handleChange}
                            placeholder="Enter Salary Slip No"
                            className={`form-control ${
                              errors.salarySlipNo && touched.salarySlipNo
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {errors.salarySlipNo && touched.salarySlipNo && (
                            <div className="invalid-feedback">
                              {errors.salarySlipNo}
                            </div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* Slip Upload (Optional) */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="slipUpload"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Upload Salary Slip (PDF/Image)
                          </Label>
                          {isEditMode && (
                            <div className="mb-2">
                              {existingSlipFile ? (
                                <a
                                  href={existingSlipFile}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary"
                                >
                                  View Current Slip
                                </a>
                              ) : (
                                <p className="text-muted">
                                  No existing slip file available.
                                </p>
                              )}
                            </div>
                          )}
                          <Input
                            type="file"
                            name="slipUpload"
                            id="slipUpload"
                            accept="image/jpeg,image/png,application/pdf"
                            className={`form-control ${
                              errors.slipUpload && touched.slipUpload
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                            onChange={(event) => {
                              setFieldValue(
                                "slipUpload",
                                event.currentTarget.files?.[0]
                              );
                            }}
                          />
                          {errors.slipUpload && touched.slipUpload && (
                            <div className="invalid-feedback">
                              {errors.slipUpload}
                            </div>
                          )}
                          <small className="text-muted">
                            Supported formats: PDF, PNG, JPEG. Max size: 5MB.
                          </small>
                        </FormGroup>
                      </Col>

                      {/* Salary Amount */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="salaryAmount"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Salary Amount ($){" "}
                            <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="number"
                            name="salaryAmount"
                            id="salaryAmount"
                            value={values.salaryAmount}
                            onChange={formik.handleChange}
                            placeholder="Enter Salary Amount"
                            className={`form-control ${
                              errors.salaryAmount && touched.salaryAmount
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {errors.salaryAmount && touched.salaryAmount && (
                            <div className="invalid-feedback">
                              {errors.salaryAmount}
                            </div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* Payment Mode */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="paymentMode"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Payment Mode <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="select"
                            name="paymentMode"
                            id="paymentMode"
                            value={values.paymentMode}
                            onChange={formik.handleChange}
                            className={`form-control ${
                              errors.paymentMode && touched.paymentMode
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          >
                            <option value="Cash">Cash</option>
                            <option value="BankTransfer">Bank Transfer</option>
                            <option value="UPI">UPI</option>
                            <option value="Cheque">Cheque</option>
                          </Input>
                          {errors.paymentMode && touched.paymentMode && (
                            <div className="invalid-feedback">
                              {errors.paymentMode}
                            </div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* Section */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="section"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Section
                          </Label>
                          <Input
                            type="text"
                            name="section"
                            id="section"
                            value={values.section}
                            onChange={formik.handleChange}
                            placeholder="Enter Section"
                            className={`form-control ${
                              errors.section && touched.section
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {errors.section && touched.section && (
                            <div className="invalid-feedback">
                              {errors.section}
                            </div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* TDS Rate */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="tdsRate"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            TDS Rate (%) <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="number"
                            name="tdsRate"
                            id="tdsRate"
                            value={values.tdsRate}
                            onChange={formik.handleChange}
                            placeholder="Enter TDS Rate"
                            className={`form-control ${
                              errors.tdsRate && touched.tdsRate
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {errors.tdsRate && touched.tdsRate && (
                            <div className="invalid-feedback">
                              {errors.tdsRate}
                            </div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* TDS Deduct (Calculated) */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="tdsDeduct"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            TDS Deduct ($)
                          </Label>
                          <Input
                            type="number"
                            name="tdsDeduct"
                            id="tdsDeduct"
                            value={values.tdsDeduct}
                            disabled
                            className="form-control"
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                              backgroundColor: "#f8f9fa",
                            }}
                          />
                          {errors.tdsDeduct && touched.tdsDeduct && (
                            <div className="invalid-feedback">
                              {errors.tdsDeduct}
                            </div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* Net Salary (Calculated) */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="netSalary"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Net Salary ($)
                          </Label>
                          <Input
                            type="number"
                            name="netSalary"
                            id="netSalary"
                            value={values.netSalary}
                            disabled
                            className="form-control"
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                              backgroundColor: "#f8f9fa",
                            }}
                          />
                        </FormGroup>
                      </Col>

                      {/* Transaction ID (Optional) */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="transactionId"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Transaction ID
                          </Label>
                          <Input
                            type="text"
                            name="transactionId"
                            id="transactionId"
                            value={values.transactionId}
                            onChange={formik.handleChange}
                            placeholder="Enter Transaction ID"
                            disabled={values.paymentMode === "Cash"}
                            className={`form-control ${
                              errors.transactionId && touched.transactionId
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {errors.transactionId && touched.transactionId && (
                            <div className="invalid-feedback">
                              {errors.transactionId}
                            </div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* Date of Payment */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="dateOfPayment"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Date of Payment{" "}
                            <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="date"
                            name="dateOfPayment"
                            id="dateOfPayment"
                            value={values.dateOfPayment}
                            onChange={formik.handleChange}
                            className={`form-control ${
                              errors.dateOfPayment && touched.dateOfPayment
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {errors.dateOfPayment && touched.dateOfPayment && (
                            <div className="invalid-feedback">
                              {errors.dateOfPayment}
                            </div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* Submit Button */}
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
                          {isSubmitting
                            ? "Submitting..."
                            : isEditMode
                            ? "Update"
                            : "Submit"}
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
        form {
          display: block !important;
        }
      `}</style>
    </React.Fragment>
  );
};

export default SalaryForm;
