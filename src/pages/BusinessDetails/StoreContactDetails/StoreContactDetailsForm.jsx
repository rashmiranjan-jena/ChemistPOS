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
import Swal from "sweetalert2";
import {
  PostBusinessContact,
  GetBusinessContactById,
  UpdateBusinessContact,
} from "../../../ApiService/SystemAdmin/businessContactDetails";

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Contact Name is required")
    .min(2, "Contact Name must be at least 2 characters"),
  phoneNo: Yup.string()
    .required("Phone Number is required")
    .matches(
      /^\+?[1-9]\d{1,14}$/,
      "Invalid phone number format (e.g., +1234567890)"
    ),
  email: Yup.string().email("Invalid email address"), // Email is optional
  city: Yup.string().required("City is required"),
  district: Yup.string().required("District is required"),
  state: Yup.string().required("State is required"),
  country: Yup.string().required("Country is required"),
  pinCode: Yup.string()
    .required("PIN/ZIP Code is required")
    .matches(/^\d{5,6}$/, "PIN/ZIP Code must be 5-6 digits"),
  address1: Yup.string().required("Address 1 is required"),
  address2: Yup.string(),
  landmark: Yup.string(),
  phoneNo2: Yup.string().matches(
    /^\+?[1-9]\d{1,14}$/,
    "Invalid secondary phone number format (e.g., +1234567890)"
  ),
  website: Yup.string().url("Invalid website URL (e.g., https://example.com)"),
});

const StoreContactDetailsForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditMode, setIsEditMode] = useState(false);
  const [contactId, setContactId] = useState(null);
  const [submissionLoading, setSubmissionLoading] = useState(false);

  useEffect(() => {
    if (location.state?.department_contact_id) {
      setIsEditMode(true);
      setContactId(location.state.department_contact_id);
      fetchBusinessContact(location.state.department_contact_id);
    }
  }, [location.state]);

  const fetchBusinessContact = async (id) => {
    try {
      const response = await GetBusinessContactById(id);
      const data = response?.contact_details;
      formik.setValues({
        name: data?.name || "",
        phoneNo: data?.phoneNo || "",
        email: data?.email|| "",
        city: data?.city || "",
        district: data?.district || "",
        state: data?.state || "",
        country: data?.country || "",
        pinCode: data?.pinCode || "",
        address1: data?.address1 || "",
        address2: data?.address2 || "",
        landmark: data?.landmark || "",
        phoneNo2: data?.phoneNo2 || "",
        website: data?.website || "",
      });
    } catch (error) {
      console.error("Error fetching business contact:", error);
      Swal.fire({
        title: "Error!",
        text: error.message || "Failed to fetch business contact data.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      phoneNo: "",
      email: "",
      city: "",
      district: "",
      state: "",
      country: "",
      pinCode: "",
      address1: "",
      address2: "",
      landmark: "",
      phoneNo2: "",
      website: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmissionLoading(true);
      try {
        // Create JSON payload for text data
        const payload = {
          contact_details: {
            name: values.name,
            phoneNo: values.phoneNo,
            email: values.email || null,
            city: values.city,
            district: values.district,
            state: values.state,
            country: values.country,
            pinCode: values.pinCode,
            address1: values.address1,
            address2: values.address2 || null,
            landmark: values.landmark || null,
            phoneNo2: values.phoneNo2 || null,
            website: values.website || null,
          },
          // Include additional fields from API response if required by UpdateBusinessContact
          business_name_id: isEditMode ? formik.initialValues.business_name_id : 1, // Default or fetched value
          status: isEditMode ? formik.initialValues.status : false,
          department_id: isEditMode ? formik.initialValues.department_id : null,
        };

        let response;
        if (isEditMode) {
          response = await UpdateBusinessContact(contactId, payload);
          Swal.fire({
            title: "Contact Updated!",
            text: "The business contact has been successfully updated.",
            icon: "success",
            confirmButtonText: "OK",
          });
        } else {
          response = await PostBusinessContact(payload);
          Swal.fire({
            title: "Contact Registered!",
            text: "The business contact has been successfully registered.",
            icon: "success",
            confirmButtonText: "OK",
          });
        }

        if (response) {
          resetForm();
          setTimeout(() => {
            navigate("/store-contact-details-list");
          }, 1000);
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        Swal.fire({
          title: "Error!",
          text: error.message || "Failed to submit the form. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      } finally {
        setSubmissionLoading(false);
        setSubmitting(false);
      }
    },
  });

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Businesses"
            breadcrumbItem={
              isEditMode ? "Edit Business Contact" : "Add Business Contact"
            }
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
                      {isEditMode
                        ? "Edit Business Contact"
                        : "Add Business Contact"}
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
                        style={{ fontSize: "18px" }}
                      ></i>
                    </Button>
                  </div>

                  <Form onSubmit={formik.handleSubmit}>
                    <Row className="g-4">
                      {/* Contact Name */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="name"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Contact Name <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            name="name"
                            id="name"
                            placeholder="Enter contact name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.name && formik.errors.name
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.touched.name && formik.errors.name && (
                            <div className="invalid-feedback">
                              {formik.errors.name}
                            </div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* Phone No. */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="phoneNo"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Phone No. <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            name="phoneNo"
                            id="phoneNo"
                            placeholder="Enter phone number (e.g., +1234567890)"
                            value={formik.values.phoneNo}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.phoneNo && formik.errors.phoneNo
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.touched.phoneNo && formik.errors.phoneNo && (
                            <div className="invalid-feedback">
                              {formik.errors.phoneNo}
                            </div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* Email ID */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="email"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Email ID (Optional)
                          </Label>
                          <Input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Enter email address"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.email && formik.errors.email
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.touched.email && formik.errors.email && (
                            <div className="invalid-feedback">
                              {formik.errors.email}
                            </div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* City */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="city"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            City <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            name="city"
                            id="city"
                            placeholder="Enter city"
                            value={formik.values.city}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.city && formik.errors.city
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.touched.city && formik.errors.city && (
                            <div className="invalid-feedback">
                              {formik.errors.city}
                            </div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* District */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="district"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            District <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            name="district"
                            id="district"
                            placeholder="Enter district"
                            value={formik.values.district}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.district && formik.errors.district
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.touched.district &&
                            formik.errors.district && (
                              <div className="invalid-feedback">
                                {formik.errors.district}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      {/* State */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="state"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            State <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            name="state"
                            id="state"
                            placeholder="Enter state"
                            value={formik.values.state}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.state && formik.errors.state
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.touched.state && formik.errors.state && (
                            <div className="invalid-feedback">
                              {formik.errors.state}
                            </div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* Country */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="country"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Country <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            name="country"
                            id="country"
                            placeholder="Enter country"
                            value={formik.values.country}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.country && formik.errors.country
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.touched.country && formik.errors.country && (
                            <div className="invalid-feedback">
                              {formik.errors.country}
                            </div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* PIN/ZIP Code */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="pinCode"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            PIN/Z WIP Code <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            name="pinCode"
                            id="pinCode"
                            placeholder="Enter PIN/ZIP code (5-6 digits)"
                            value={formik.values.pinCode}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.pinCode && formik.errors.pinCode
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.touched.pinCode && formik.errors.pinCode && (
                            <div className="invalid-feedback">
                              {formik.errors.pinCode}
                            </div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* Address 1 */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="address1"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Address 1 <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            name="address1"
                            id="address1"
                            placeholder="Enter primary address"
                            value={formik.values.address1}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.address1 && formik.errors.address1
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.touched.address1 &&
                            formik.errors.address1 && (
                              <div className="invalid-feedback">
                                {formik.errors.address1}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      {/* Address 2 */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="address2"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Address 2 (Optional)
                          </Label>
                          <Input
                            type="text"
                            name="address2"
                            id="address2"
                            placeholder="Enter secondary address"
                            value={formik.values.address2}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.address2 && formik.errors.address2
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.touched.address2 &&
                            formik.errors.address2 && (
                              <div className="invalid-feedback">
                                {formik.errors.address2}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      {/* Landmark */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="landmark"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Landmark (Optional)
                          </Label>
                          <Input
                            type="text"
                            name="landmark"
                            id="landmark"
                            placeholder="Enter landmark"
                            value={formik.values.landmark}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.landmark && formik.errors.landmark
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.touched.landmark &&
                            formik.errors.landmark && (
                              <div className="invalid-feedback">
                                {formik.errors.landmark}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      {/* Phone No. 2 */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="phoneNo2"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Phone No. 2 (Optional)
                          </Label>
                          <Input
                            type="text"
                            name="phoneNo2"
                            id="phoneNo2"
                            placeholder="Enter secondary phone number (e.g., +1234567890)"
                            value={formik.values.phoneNo2}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.phoneNo2 && formik.errors.phoneNo2
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.touched.phoneNo2 &&
                            formik.errors.phoneNo2 && (
                              <div className="invalid-feedback">
                                {formik.errors.phoneNo2}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      {/* Website */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="website"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Website (Optional)
                          </Label>
                          <Input
                            type="text"
                            name="website"
                            id="website"
                            placeholder="Enter website URL (e.g., https://example.com)"
                            value={formik.values.website}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.website && formik.errors.website
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.touched.website && formik.errors.website && (
                            <div className="invalid-feedback">
                              {formik.errors.website}
                            </div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* Submit Button */}
                      <Col md="12" className="text-end">
                        <Button
                          type="submit"
                          color="primary"
                          disabled={formik.isSubmitting || submissionLoading}
                          style={{
                            padding: "10px 25px",
                            borderRadius: "8px",
                            boxShadow: "0 4px 10px rgba(0, 123, 255, 0.3)",
                            transition: "transform 0.3s ease",
                          }}
                          className="hover-scale"
                        >
                          {submissionLoading
                            ? isEditMode
                              ? "Updating..."
                              : "Submitting..."
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
          boxShadow: 0 0 8px rgba(0, 123, 255, 0.3);
        }
        .invalid-feedback {
          font-size: 12px;
          color: #dc3545;
        }
      `}</style>
    </React.Fragment>
  );
};

export default StoreContactDetailsForm;