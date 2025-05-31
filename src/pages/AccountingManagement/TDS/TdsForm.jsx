import React, { useState, useRef, useEffect } from "react";
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
import { postTds, getTdsById, updateTds } from "../../../ApiService/AccountingManagement/Tds";
import Swal from "sweetalert2";

const TdsForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileRef = useRef(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [tdsId, setTdsId] = useState(null);
  const [existingFile, setExistingFile] = useState(null);

  // Validation schema
  const validationSchema = Yup.object().shape({
    party: Yup.string().required("Party name is required"),
    panNumber: Yup.string()
      .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format")
      .required("PAN Number is required"),
    invoiceNo: Yup.string().required("Invoice No. is required"),
    date: Yup.date().required("Date is required"),
    amount: Yup.number()
      .required("Amount is required")
      .min(0, "Amount cannot be negative"),
    section: Yup.string().required("Section is required"),
    tdsRate: Yup.number()
      .required("TDS Rate is required")
      .min(0, "TDS Rate cannot be negative")
      .max(100, "TDS Rate cannot exceed 100%"),
    tdsDeducted: Yup.number()
      .required("TDS Deducted is required")
      .min(0, "TDS Deducted cannot be negative")
      .test("is-valid-number", "Invalid TDS Deducted value", (value) => !isNaN(value)),
    paymentDate: Yup.date().required("Payment Date is required"),
    invoiceFile: isEditMode
      ? Yup.mixed().notRequired()
      : Yup.mixed()
          .required("Invoice file is required")
          .test(
            "fileType",
            "Unsupported file type. Please upload PDF, PNG, or JPEG.",
            (value) => {
              if (!value) return false;
              const allowedTypes = ["application/pdf", "image/png", "image/jpeg"];
              return allowedTypes.includes(value?.type);
            }
          )
          .test(
            "fileSize",
            "File size too large. Maximum 5MB allowed.",
            (value) => {
              if (!value) return false;
              return value?.size <= 5 * 1024 * 1024;
            }
          ),
  });

  useEffect(() => {
    if (location?.state?.id) {
      setIsEditMode(true);
      setTdsId(location.state.id);
      fetchTds(location.state.id);
    }
  }, [location?.state]);

  const fetchTds = async (id) => {
    try {
      const data = await getTdsById(id);
      formik.setValues({
        party: data?.party || "",
        panNumber: data?.pan || "",
        invoiceNo: data?.invoice_no || "",
        date: data?.date || new Date().toISOString().slice(0, 10),
        amount: data?.amount || "",
        section: data?.section || "",
        tdsRate: parseFloat(data?.tds_rate) || "",
        tdsDeducted: parseFloat(data?.tds_deducted) || "",
        paymentDate: data?.payment_date || new Date().toISOString().slice(0, 10),
        invoiceFile: null,
      });
      if (data?.file) {
        const fileName = data.file.split("/").pop();
        setExistingFile({
          name: fileName,
          url: `${import.meta.env.VITE_API_BASE_URL}${data.file}`,
          type: fileName.toLowerCase().endsWith(".pdf")
            ? "application/pdf"
            : fileName.toLowerCase().endsWith(".png")
            ? "image/png"
            : "image/jpeg",
        });
      }
    } catch (error) {
      console.error("Error fetching TDS:", error);
      Swal.fire({
        title: "Error!",
        text: error?.response?.data?.message || "Failed to fetch TDS data.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const formik = useFormik({
    initialValues: {
      party: "",
      panNumber: "",
      invoiceNo: "",
      date: new Date().toISOString().slice(0, 10),
      amount: "",
      section: "",
      tdsRate: "",
      tdsDeducted: "",
      paymentDate: new Date().toISOString().slice(0, 10),
      invoiceFile: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log("Submit triggered with values:", values);
      try {
        const formData = new FormData();
        formData.append("party", values.party);
        formData.append("pan", values.panNumber);
        formData.append("invoice_no", values.invoiceNo);
        formData.append("date", values.date);
        formData.append("amount", values.amount);
        formData.append("section", values.section);
        formData.append("tds_rate", values.tdsRate);
        formData.append("tds_deducted", values.tdsDeducted);
        formData.append("payment_date", values.paymentDate);
        if (values.invoiceFile) {
          formData.append("file", values.invoiceFile);
        }
        console.log("FormData contents:");
        for (let pair of formData.entries()) {
          console.log(`${pair[0]}: ${pair[1]}`);
        }

        let response;
        if (isEditMode) {
          response = await updateTds(tdsId, formData);
          console.log("Update response:", response);
          Swal.fire({
            title: "TDS Updated!",
            text: "The TDS details have been successfully updated.",
            icon: "success",
            confirmButtonText: "OK",
          });
        } else {
          response = await postTds(formData);
          console.log("Post response:", response);
          Swal.fire({
            title: "TDS Registered!",
            text: "The TDS details have been successfully registered.",
            icon: "success",
            confirmButtonText: "OK",
          });
        }

        if (response) {
          formik.resetForm();
          if (fileRef.current) fileRef.current.value = "";
          setExistingFile(null);
          navigate("/tds-list");
        }
      } catch (error) {
        console.error("Error submitting form:", error.response?.data || error);
        Swal.fire({
          title: "Error!",
          text: error.response?.data?.message || "Failed to submit the form.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    },
  });

  const handleFileChange = (event) => {
    const file = event.currentTarget.files?.[0];
    console.log("Selected file:", file);
    if (file) {
      formik.setFieldValue("invoiceFile", file);
      setExistingFile(null);
    }
  };

  const handleFileRemove = () => {
    formik.setFieldValue("invoiceFile", null);
    setExistingFile(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const calculateTdsDeducted = (amount, tdsRate) => {
    console.log("Calculating TDS: amount =", amount, "tdsRate =", tdsRate);
    if (amount && tdsRate) {
      return ((parseFloat(amount) * parseFloat(tdsRate)) / 100).toFixed(2);
    }
    return "0.00";
  };

  useEffect(() => {
    const calculatedTds = calculateTdsDeducted(formik.values.amount, formik.values.tdsRate);
    formik.setFieldValue("tdsDeducted", calculatedTds);
  }, [formik.values.amount, formik.values.tdsRate]);

  const renderFilePreview = () => {
    const file =
      existingFile ||
      (formik.values.invoiceFile && {
        url: URL.createObjectURL(formik.values.invoiceFile),
        type: formik.values.invoiceFile.type,
        name: formik.values.invoiceFile.name,
      });

    if (!file) return null;

    if (file.type === "application/pdf") {
      return (
        <div className="mt-2">
          <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-primary">
            View PDF: {file.name}
          </a>
        </div>
      );
    } else if (file.type === "image/png" || file.type === "image/jpeg") {
      return (
        <div className="mt-2">
          <img
            src={file.url}
            alt="Invoice Preview"
            style={{
              maxWidth: "200px",
              maxHeight: "200px",
              borderRadius: "8px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            }}
          />
        </div>
      );
    }
    return null;
  };

  document.title = "TDS Registration";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="TDS Management"
            breadcrumbItem={isEditMode ? "Edit TDS Details" : "Add TDS Details"}
          />
          <Row>
            <Col xs="12">
              <Card className="shadow-lg" style={{ borderRadius: "15px", overflow: "hidden" }}>
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
                      {isEditMode ? "Edit TDS Details" : "Add TDS Details"}
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
                      <i className="bx bx-undo" style={{ fontSize: "18px" }}></i>
                    </Button>
                  </div>

                  <Form onSubmit={formik.handleSubmit}>
                    {console.log("Formik errors:", formik.errors)}
                    {console.log("Formik touched:", formik.touched)}
                    <Row className="g-4">
                      {/* Party */}
                      <Col md="6">
                        <FormGroup>
                          <Label for="party" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                            Party Name <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            name="party"
                            id="party"
                            placeholder="Enter Party Name"
                            value={formik.values.party}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.party && formik.errors.party ? "is-invalid" : ""
                            }`}
                            style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                          />
                          {formik.touched.party && formik.errors.party && (
                            <div className="invalid-feedback">{formik.errors.party}</div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* PAN Number */}
                      <Col md="6">
                        <FormGroup>
                          <Label for="panNumber" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                            PAN Number <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            name="panNumber"
                            id="panNumber"
                            placeholder="Enter PAN Number (e.g., ABCDE1234F)"
                            value={formik.values.panNumber}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.panNumber && formik.errors.panNumber ? "is-invalid" : ""
                            }`}
                            style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                          />
                          {formik.touched.panNumber && formik.errors.panNumber && (
                            <div className="invalid-feedback">{formik.errors.panNumber}</div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* Invoice No. */}
                      <Col md="6">
                        <FormGroup>
                          <Label for="invoiceNo" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                            Invoice No. <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            name="invoiceNo"
                            id="invoiceNo"
                            placeholder="Enter Invoice No."
                            value={formik.values.invoiceNo}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.invoiceNo && formik.errors.invoiceNo ? "is-invalid" : ""
                            }`}
                            style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                          />
                          {formik.touched.invoiceNo && formik.errors.invoiceNo && (
                            <div className="invalid-feedback">{formik.errors.invoiceNo}</div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* Invoice File */}
                      <Col md="6">
                        <FormGroup>
                          <Label for="invoiceFile" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                            Invoice File {!isEditMode && <span className="text-danger">*</span>}
                          </Label>
                          <Input
                            type="file"
                            name="invoiceFile"
                            id="invoiceFile"
                            accept=".pdf,.png,.jpeg"
                            ref={fileRef}
                            onChange={handleFileChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.invoiceFile && formik.errors.invoiceFile ? "is-invalid" : ""
                            }`}
                            style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "8px" }}
                          />
                          {formik.touched.invoiceFile && formik.errors.invoiceFile && (
                            <div className="invalid-feedback">{formik.errors.invoiceFile}</div>
                          )}
                          <small className="text-muted">Supported formats: PDF, PNG, JPEG. Max size: 5MB.</small>
                          {(existingFile || formik.values.invoiceFile) && (
                            <div style={{ position: "relative", display: "inline-block", marginTop: "10px" }}>
                              <Button
                                style={{
                                  position: "absolute",
                                  top: "0",
                                  right: "-30px",
                                  background: "rgba(255, 0, 0, 0.6)",
                                  color: "white",
                                  padding: "0.2rem",
                                  borderRadius: "50%",
                                }}
                                onClick={handleFileRemove}
                              >
                                X
                              </Button>
                            </div>
                          )}
                          {renderFilePreview()}
                        </FormGroup>
                      </Col>

                      {/* Date */}
                      <Col md="6">
                        <FormGroup>
                          <Label for="date" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                            Date <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="date"
                            name="date"
                            id="date"
                            value={formik.values.date}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.date && formik.errors.date ? "is-invalid" : ""
                            }`}
                            style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                          />
                          {formik.touched.date && formik.errors.date && (
                            <div className="invalid-feedback">{formik.errors.date}</div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* Amount */}
                      <Col md="6">
                        <FormGroup>
                          <Label for="amount" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                            Amount (₹) <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="number"
                            name="amount"
                            id="amount"
                            placeholder="Enter Amount"
                            value={formik.values.amount}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.amount && formik.errors.amount ? "is-invalid" : ""
                            }`}
                            style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                          />
                          {formik.touched.amount && formik.errors.amount && (
                            <div className="invalid-feedback">{formik.errors.amount}</div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* Section */}
                      <Col md="6">
                        <FormGroup>
                          <Label for="section" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                            Section <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            name="section"
                            id="section"
                            placeholder="Enter Section"
                            value={formik.values.section}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.section && formik.errors.section ? "is-invalid" : ""
                            }`}
                            style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                          />
                          {formik.touched.section && formik.errors.section && (
                            <div className="invalid-feedback">{formik.errors.section}</div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* TDS Rate */}
                      <Col md="6">
                        <FormGroup>
                          <Label for="tdsRate" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                            TDS Rate (%) <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="number"
                            name="tdsRate"
                            id="tdsRate"
                            placeholder="Enter TDS Rate"
                            value={formik.values.tdsRate}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.tdsRate && formik.errors.tdsRate ? "is-invalid" : ""
                            }`}
                            style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                          />
                          {formik.touched.tdsRate && formik.errors.tdsRate && (
                            <div className="invalid-feedback">{formik.errors.tdsRate}</div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* TDS Deducted */}
                      <Col md="6">
                        <FormGroup>
                          <Label for="tdsDeducted" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                            TDS Deducted (₹)
                          </Label>
                          <Input
                            type="text"
                            name="tdsDeducted"
                            id="tdsDeducted"
                            value={formik.values.tdsDeducted}
                            readOnly
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

                      {/* Payment Date */}
                      <Col md="6">
                        <FormGroup>
                          <Label for="paymentDate" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                            Payment Date <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="date"
                            name="paymentDate"
                            id="paymentDate"
                            value={formik.values.paymentDate}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.paymentDate && formik.errors.paymentDate ? "is-invalid" : ""
                            }`}
                            style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                          />
                          {formik.touched.paymentDate && formik.errors.paymentDate && (
                            <div className="invalid-feedback">{formik.errors.paymentDate}</div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* Submit Button */}
                      <Col md="12" className="text-end">
                        <div>
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
                            {formik.isSubmitting ? "Submitting..." : isEditMode ? "Update" : "Submit"}
                          </Button>
                        </div>
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

export default TdsForm;