import React from "react";
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
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { postBusinessOwnerDetails, putBusinessOwnerDetails } from "../../ApiService/BusinessOverview/BusinessOwner";
import Swal from "sweetalert2";
import { useFormik } from "formik";

// Validation schema using Yup
const validationSchema = Yup.object({
  aadhar_card: Yup.string()
    .required("Aadhar is required")
    .matches(/^[0-9]{12}$/, "Aadhar must be a 12-digit number"),
  pan_card: Yup.string()
    .required("PAN is required")
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format (e.g., ABCDE1234F)"),
  address_proof_text: Yup.string().required("Address is required"),
  address_proof: Yup.mixed().required("Address Proof is required"),
  pharmacy_qualification_certificate: Yup.string().required("Pharmacy Qualification Certificate is required"),
  pq_photo: Yup.mixed().required("Pharmacy Qualification Certificate file is required"),
  pharmacy_registration_certificate: Yup.string().required("Pharmacist Registration Certificate is required"),
  pr_photo: Yup.mixed().required("Pharmacist Registration Certificate file is required"),
  experience_certificate: Yup.string().required("Experience Certificate is required"),
  ec_photo: Yup.mixed().required("Experience Certificate file is required"),
  noc_certificate: Yup.mixed().required("NOC from Local Body is required"),
  shop_agreement_no: Yup.string().required("Shop Agreement is required"),
  sa_photo: Yup.mixed().required("Shop Agreement file is required"),
});

const PharmacistDocuments = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { doc } = location.state || {};
  console.log(doc);

  const isEditMode = !!doc?.business_owner_id;

  const formik = useFormik({
    initialValues: {
      aadhar_card: doc?.aadhar_card || "",
      pan_card: doc?.pan_card || "",
      address_proof_text: doc?.address_proof_text || "",
      address_proof: null,
      pharmacy_qualification_certificate: doc?.pharmacy_qualification_certificate || "",
      pq_photo: null,
      pharmacy_registration_certificate: doc?.pharmacy_registration_certificate || "",
      pr_photo: null,
      experience_certificate: doc?.experience_certificate || "",
      ec_photo: null,
      noc_certificate: null,
      shop_agreement_no: doc?.shop_agreement_no || "",
      sa_photo: null,
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const formData = new FormData();

      // Append all values to FormData
      Object.keys(values).forEach(key => {
        if (values[key] !== null) {
          formData.append(key, values[key]);
        }
      });

      try {
        setSubmitting(true);
        let response;
        console.log("Submitting");

        if (isEditMode) {
          response = await putBusinessOwnerDetails(doc.business_owner_id, formData);
          if (response.status === 200) {
            Swal.fire({
              title: "Success",
              text: "Document Updated Successfully",
              icon: "success",
              confirmButtonText: "OK",
            });
          }
        } else {
          response = await postBusinessOwnerDetails(formData);
          if (response.status === 201) {
            Swal.fire({
              title: "Success",
              text: "Document saved Successfully",
              icon: "success",
              confirmButtonText: "OK",
            });
          }
        }
        navigate("/pharmacist-documents-list");
      } catch (error) {
        console.error("Submission error:", error);
        Swal.fire({
          title: "Error",
          text: "An error occurred while submitting the form",
          icon: "error",
          confirmButtonText: "OK",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Pharmacist Management"
            breadcrumbItem="Add Pharmacist Documents"
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
                      Add Pharmacist Documents
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
                      {/* aadhar_card */}
                      <Col md="6">
                        <FormGroup>
                          <Label for="aadhar_card" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                            Aadhar <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            name="aadhar_card"
                            id="aadhar_card"
                            value={formik.values.aadhar_card}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Enter 12-digit aadhar number"
                            className={`form-control ${formik.errors.aadhar_card && formik.touched.aadhar_card ? "is-invalid" : ""}`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.errors.aadhar_card && formik.touched.aadhar_card && (
                            <div className="invalid-feedback">{formik.errors.aadhar_card}</div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* PAN */}
                      <Col md="6">
                        <FormGroup>
                          <Label for="pan_card" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                            PAN <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            name="pan_card"
                            id="pan_card"
                            value={formik.values.pan_card}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Enter PAN (e.g., ABCDE1234F)"
                            className={`form-control ${formik.errors.pan_card && formik.touched.pan_card ? "is-invalid" : ""}`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.errors.pan_card && formik.touched.pan_card && (
                            <div className="invalid-feedback">{formik.errors.pan_card}</div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* Address */}
                      <Col md="6">
                        <FormGroup>
                          <Label for="address_proof_text" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                            Address <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            name="address_proof_text"
                            id="address_proof_text"
                            value={formik.values.address_proof_text}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Enter Address"
                            className={`form-control ${formik.errors.address_proof_text && formik.touched.address_proof_text ? "is-invalid" : ""}`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.errors.address_proof_text && formik.touched.address_proof_text && (
                            <div className="invalid-feedback">{formik.errors.address_proof_text}</div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* Address Proof */}
                      <Col md="6">
                        <FormGroup>
                          <Label for="address_proof" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                            Address Proof <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="file"
                            name="address_proof"
                            id="address_proof"
                            onChange={(event) => {
                              formik.setFieldValue("address_proof", event.currentTarget.files[0]);
                            }}
                            onBlur={formik.handleBlur}
                            className={`form-control ${formik.errors.address_proof && formik.touched.address_proof ? "is-invalid" : ""}`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.errors.address_proof && formik.touched.address_proof && (
                            <div className="invalid-feedback">{formik.errors.address_proof}</div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* Pharmacy Qualification Certificate */}
                      <Col md="6">
                        <FormGroup>
                          <Label for="pharmacy_qualification_certificate" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                            Pharmacy Qualification Certificate <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            name="pharmacy_qualification_certificate"
                            id="pharmacy_qualification_certificate"
                            value={formik.values.pharmacy_qualification_certificate}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Enter certificate details"
                            className={`form-control ${formik.errors.pharmacy_qualification_certificate && formik.touched.pharmacy_qualification_certificate ? "is-invalid" : ""}`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.errors.pharmacy_qualification_certificate && formik.touched.pharmacy_qualification_certificate && (
                            <div className="invalid-feedback">{formik.errors.pharmacy_qualification_certificate}</div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* Pharmacy Qualification Certificate File */}
                      <Col md="6">
                        <FormGroup>
                          <Label for="pq_photo" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                            Pharmacy Qualification Certificate File <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="file"
                            name="pq_photo"
                            id="pq_photo"
                            onChange={(event) => {
                              formik.setFieldValue("pq_photo", event.currentTarget.files[0]);
                            }}
                            onBlur={formik.handleBlur}
                            className={`form-control ${formik.errors.pq_photo && formik.touched.pq_photo ? "is-invalid" : ""}`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.errors.pq_photo && formik.touched.pq_photo && (
                            <div className="invalid-feedback">{formik.errors.pq_photo}</div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* Pharmacist Registration Certificate */}
                      <Col md="6">
                        <FormGroup>
                          <Label for="pharmacy_registration_certificate" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                            Pharmacist Registration Certificate <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            name="pharmacy_registration_certificate"
                            id="pharmacy_registration_certificate"
                            value={formik.values.pharmacy_registration_certificate}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Enter registration details"
                            className={`form-control ${formik.errors.pharmacy_registration_certificate && formik.touched.pharmacy_registration_certificate ? "is-invalid" : ""}`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.errors.pharmacy_registration_certificate && formik.touched.pharmacy_registration_certificate && (
                            <div className="invalid-feedback">{formik.errors.pharmacy_registration_certificate}</div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* Pharmacist Registration Certificate File */}
                      <Col md="6">
                        <FormGroup>
                          <Label for="pr_photo" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                            Pharmacist Registration Certificate File <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="file"
                            name="pr_photo"
                            id="pr_photo"
                            onChange={(event) => {
                              formik.setFieldValue("pr_photo", event.currentTarget.files[0]);
                            }}
                            onBlur={formik.handleBlur}
                            className={`form-control ${formik.errors.pr_photo && formik.touched.pr_photo ? "is-invalid" : ""}`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.errors.pr_photo && formik.touched.pr_photo && (
                            <div className="invalid-feedback">{formik.errors.pr_photo}</div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* Experience Certificate */}
                      <Col md="6">
                        <FormGroup>
                          <Label for="experience_certificate" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                            Experience Certificate <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            name="experience_certificate"
                            id="experience_certificate"
                            value={formik.values.experience_certificate}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Enter experience details"
                            className={`form-control ${formik.errors.experience_certificate && formik.touched.experience_certificate ? "is-invalid" : ""}`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.errors.experience_certificate && formik.touched.experience_certificate && (
                            <div className="invalid-feedback">{formik.errors.experience_certificate}</div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* Experience Certificate File */}
                      <Col md="6">
                        <FormGroup>
                          <Label for="ec_photo" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                            Experience Certificate File <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="file"
                            name="ec_photo"
                            id="ec_photo"
                            onChange={(event) => {
                              formik.setFieldValue("ec_photo", event.currentTarget.files[0]);
                            }}
                            onBlur={formik.handleBlur}
                            className={`form-control ${formik.errors.ec_photo && formik.touched.ec_photo ? "is-invalid" : ""}`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.errors.ec_photo && formik.touched.ec_photo && (
                            <div className="invalid-feedback">{formik.errors.ec_photo}</div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* NOC from Local Body */}
                      <Col md="6">
                        <FormGroup>
                          <Label for="noc_certificate" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                            NOC from Local Body <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="file"
                            name="noc_certificate"
                            id="noc_certificate"
                            onChange={(event) => {
                              formik.setFieldValue("noc_certificate", event.currentTarget.files[0]);
                            }}
                            onBlur={formik.handleBlur}
                            className={`form-control ${formik.errors.noc_certificate && formik.touched.noc_certificate ? "is-invalid" : ""}`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.errors.noc_certificate && formik.touched.noc_certificate && (
                            <div className="invalid-feedback">{formik.errors.noc_certificate}</div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* Shop Agreement */}
                      <Col md="6">
                        <FormGroup>
                          <Label for="shop_agreement_no" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                            Shop Agreement <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            name="shop_agreement_no"
                            id="shop_agreement_no"
                            value={formik.values.shop_agreement_no}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Enter shop agreement details"
                            className={`form-control ${formik.errors.shop_agreement_no && formik.touched.shop_agreement_no ? "is-invalid" : ""}`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.errors.shop_agreement_no && formik.touched.shop_agreement_no && (
                            <div className="invalid-feedback">{formik.errors.shop_agreement_no}</div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* Shop Agreement File */}
                      <Col md="6">
                        <FormGroup>
                          <Label for="sa_photo" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                            Shop Agreement File <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="file"
                            name="sa_photo"
                            id="sa_photo"
                            onChange={(event) => {
                              formik.setFieldValue("sa_photo", event.currentTarget.files[0]);
                            }}
                            onBlur={formik.handleBlur}
                            className={`form-control ${formik.errors.sa_photo && formik.touched.sa_photo ? "is-invalid" : ""}`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.errors.sa_photo && formik.touched.sa_photo && (
                            <div className="invalid-feedback">{formik.errors.sa_photo}</div>
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
                          {formik.isSubmitting
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

export default PharmacistDocuments;