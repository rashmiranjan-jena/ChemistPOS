import React, { useEffect } from "react";
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
import Swal from "sweetalert2";
import { postBankInfo,getBankInfoById,updateBankInfo } from "../../../ApiService/BankInfo/BankInfo";
import { useFormik } from "formik";
import * as Yup from "yup";

// Validation schema using Yup
const validationSchema = Yup.object({
  bank_name: Yup.string()
    .required("Bank Name is required")
    .min(1, "Bank Name cannot be empty"),
  branch: Yup.string()
    .required("Branch is required")
    .min(1, "Branch cannot be empty"),
  ifsc_code: Yup.string()
    .required("IFSC Code is required")
    .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC Code format (e.g., SBIN0001234)"),
  account_name: Yup.string()
    .required("Account Name is required")
    .min(1, "Account Name cannot be empty"),
  account_number: Yup.string()
    .required("Account Number is required")
    .matches(/^[0-9]{9,18}$/, "Account Number must be 9 to 18 digits"),
  account_type: Yup.string()
    .required("Account Type is required")
    .oneOf(["Savings", "Current", "Fixed Deposit"], "Invalid Account Type"),
});

const BankInfoForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const businessBankId = location?.state?.business_bank_id;
  console.log(businessBankId)

  const formik = useFormik({
    initialValues: {
      bank_name: "",
      branch: "",
      ifsc_code: "",
      account_name: "",
      account_number: "",
      account_type: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const payload = {
          bank_name: values?.bank_name,
          branch: values?.branch,
          ifsc_code: values?.ifsc_code,
          account_name: values?.account_name,
          account_number: values?.account_number,
          account_type: values?.account_type,
        };

        let response;
        if (businessBankId) {
          // Edit mode: Update existing bank info
          response = await updateBankInfo(businessBankId, payload);
          if (response?.status === 200) {
            Swal.fire({
              title: "Success",
              text: "Bank details updated successfully!",
              icon: "success",
              confirmButtonText: "OK",
            }).then(() => {
              navigate("/bank-info-list");
            });
          }
        } else {
          // Add mode: Create new bank info
          response = await postBankInfo(payload);
          if (response?.status === 201) {
            Swal.fire({
              title: "Success",
              text: "Bank details added successfully!",
              icon: "success",
              confirmButtonText: "OK",
            }).then(() => {
              navigate("/bank-info-list");
            });
          }
        }
      } catch (error) {
        console.error("Error submitting bank details:", error);
        Swal.fire({
          title: "Error",
          text: `Failed to ${businessBankId ? "update" : "add"} bank details`,
          icon: "error",
          confirmButtonText: "OK",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Fetch bank details for edit mode
  useEffect(() => {
    if (businessBankId) {
      const fetchBankDetails = async () => {
        try {
          const response = await getBankInfoById(businessBankId);
          const bankData = response?.data;
          if (bankData) {
            formik.setValues({
              bank_name: bankData?.bank_name ?? "",
              branch: bankData?.branch ?? "",
              ifsc_code: bankData?.ifsc_code ?? "",
              account_name: bankData?.account_name ?? "",
              account_number: bankData?.account_number ?? "",
              account_type: bankData?.account_type ?? "",
            });
          }
        } catch (error) {
          console.error("Error fetching bank details:", error);
          Swal.fire({
            title: "Error",
            text: "Failed to fetch bank details",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      };
      fetchBankDetails();
    }
  }, [businessBankId]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Bank Management"
            breadcrumbItem={businessBankId ? "Edit Bank Details" : "Add Bank Details"}
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
                      {businessBankId ? "Edit Bank Details" : "Add Bank Details"}
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
                      <i className="bx bx-undo" style={{ fontSize: "30px" }}></i>
                    </Button>
                  </div>

                  <Form onSubmit={formik.handleSubmit}>
                    <Row className="g-4">
                      {/* Bank Name */}
                      <Col md="6">
                        <FormGroup>
                          <Label for="bank_name" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                            Bank Name <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            name="bank_name"
                            id="bank_name"
                            value={formik.values.bank_name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Enter Bank Name"
                            className={`form-control ${formik.errors.bank_name && formik.touched.bank_name ? "is-invalid" : ""}`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.errors.bank_name && formik.touched.bank_name && (
                            <div className="invalid-feedback">{formik.errors.bank_name}</div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* Branch */}
                      <Col md="6">
                        <FormGroup>
                          <Label for="branch" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                            Branch <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            name="branch"
                            id="branch"
                            value={formik.values.branch}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Enter Branch Name"
                            className={`form-control ${formik.errors.branch && formik.touched.branch ? "is-invalid" : ""}`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.errors.branch && formik.touched.branch && (
                            <div className="invalid-feedback">{formik.errors.branch }</div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* IFSC No */}
                      <Col md="6">
                        <FormGroup>
                          <Label for="ifsc_code" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                            IFSC Number <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            name="ifsc_code"
                            id="ifsc_code"
                            value={formik.values.ifsc_code}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Enter IFSC Number (e.g., SBIN0001234)"
                            className={`form-control ${formik.errors.ifsc_code && formik.touched.ifsc_code ? "is-invalid" : ""}`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.errors.ifsc_code && formik.touched.ifsc_code && (
                            <div className="invalid-feedback">{formik.errors.ifsc_code}</div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* Account Name */}
                      <Col md="6">
                        <FormGroup>
                          <Label for="account_name" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                            Account Name <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            name="account_name"
                            id="account_name"
                            value={formik.values.account_name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Enter Account Name"
                            className={`form-control ${formik.errors.account_name && formik.touched.account_name ? "is-invalid" : ""}`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.errors.account_name && formik.touched.account_name && (
                            <div className="invalid-feedback">{formik.errors.account_name}</div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* Account Number */}
                      <Col md="6">
                        <FormGroup>
                          <Label for="account_number" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                            Account Number <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            name="account_number"
                            id="account_number"
                            value={formik.values.account_number}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Enter Account Number"
                            className={`form-control ${formik.errors.account_number && formik.touched.account_number ? "is-invalid" : ""}`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.errors.account_number && formik.touched.account_number && (
                            <div className="invalid-feedback">{formik.errors.account_number}</div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* Account Type */}
                      <Col md="6">
                        <FormGroup>
                          <Label for="account_type" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                            Account Type <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="select"
                            name="account_type"
                            id="account_type"
                            value={formik.values.account_type}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${formik.errors.account_type && formik.touched.account_type ? "is-invalid" : ""}`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          >
                            <option value="">Select Account Type</option>
                            <option value="Savings">Savings</option>
                            <option value="Current">Current</option>
                            <option value="Fixed Deposit">Fixed Deposit</option>
                          </Input>
                          {formik.errors.account_type && formik.touched.account_type && (
                            <div className="invalid-feedback">{formik.errors.account_type}</div>
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
                          {formik.isSubmitting ? "Submitting..." : businessBankId ? "Update" : "Submit"}
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

      {/* Inline CSS for hover effects */}
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
      `}</style>
    </React.Fragment>
  );
};

export default BankInfoForm;