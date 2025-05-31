import React, { useState } from "react";
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
import Breadcrumbs from "../../components/Common/Breadcrumb"; // Adjust path as needed
import { useNavigate, useLocation } from "react-router-dom";
import Select from "react-select";
import { submitFormData, updateBusiness } from "../../ApiService/Registration/Registration";
import Swal from "sweetalert2";

// Validation function
const validate = (values) => {
  const errors = {};
  if (!values.business_name) {
    errors.business_name = "Please enter your Business Name";
  }
  if (!values.email) {
    errors.email = "Please enter your Email ID";
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = "Invalid email format";
  }
  if (!values.contact_number) {
    errors.contact_number = "Please enter your Contact Number";
  } else if (!/^[0-9]{10}$/.test(values.contact_number)) {
    errors.contact_number = "Contact number must be 10 digits";
  }
  if (!values.business_type) {
    errors.business_type = "Please select a Business Type";
  }
  return errors;
};

const RegistrationModule = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { business } = location.state || {};
  const isEditMode = !!business?.business_id;

  // Static business types
  const businessTypes = [
    { value: "fashion", label: "Fashion" },
    { value: "grocery", label: "Grocery" },
    { value: "electronics", label: "Electronics" },
    { value: "books", label: "Books" },
    { value: "stationary", label: "Stationary" },
    { value: "electrical", label: "Electrical" },
    { value: "hardware", label: "Hardware" },
    { value: "computers", label: "Computers" },
    { value: "jewellery", label: "Jewellery" },
    { value: "restaurants", label: "Restaurants" },
    { value: "fish_meat", label: "Fish & Meat" },
    { value: "garment", label: "Garment" },
    { value: "dairy", label: "Dairy" },
    { value: "bakery", label: "Bakery" },
    { value: "house_hold", label: "House Hold" },
    { value: "construction", label: "Construction" },
    { value: "spare_parts", label: "Spare Parts" },
    { value: "automobile", label: "Automobile" },
    { value: "parlours", label: "Parlours" },
     { value: "pharmacy", label: "Pharmacy" },
    { value: "others", label: "Others" },
  ];

  const [formValues, setFormValues] = useState({
    business_name: isEditMode ? business.business_name : "",
    email: isEditMode ? business.email : "",
    contact_number: isEditMode ? business.contact_number : "",
    business_type: isEditMode ? business.business_type : "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSelectChange = (selectedOption) => {
    setFormValues({ ...formValues, business_type: selectedOption.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(formValues);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      try {
        if (isEditMode) {
          const response = await updateBusiness(business?.business_id, formValues);
          if (response) {
            Swal.fire({
              title: "success",
              text: "Business Details Updated Successfully",
              icon: "success",
              confirmButtonText: "OK",
            });
          }
        } else {
          const response = await submitFormData(formValues);
          if (response.status !== 201) {
            throw new Error("Network response was not ok");
          }
          Swal.fire({
            title: "success",
            text: "Registration Successfully",
            icon: "success",
            confirmButtonText: "OK",
          });
        }
        navigate("/registrationlist");
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Business Registration"
            breadcrumbItem={isEditMode ? "Edit Details" : "Add Details"}
          />
          <Row>
            <Col xs="12">
              <Card className="shadow-lg" style={{ borderRadius: "15px" }}>
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
                        ? "Edit Business Registration"
                        : "Add Business Registration"}
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

                  <Form onSubmit={handleSubmit}>
                    <Row className="g-4">
                      {/* Business Name */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="businessName"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Business Name <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            name="business_name"
                            id="business_name"
                            placeholder="Enter Business Name"
                            value={formValues.business_name}
                            onChange={handleChange}
                            className={`form-control ${
                              errors.business_name ? "is-invalid" : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                            disabled={isSubmitting}
                          />
                          {errors.business_name && (
                            <div className="invalid-feedback">
                              {errors.business_name}
                            </div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* Email */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="email"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Email ID <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Enter Email ID"
                            value={formValues.email}
                            onChange={handleChange}
                            className={`form-control ${
                              errors.email ? "is-invalid" : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                            disabled={isSubmitting}
                          />
                          {errors.email && (
                            <div className="invalid-feedback">{errors.email}</div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* Contact Number */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="contactNumber"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Contact Number <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            name="contact_number"
                            id="contact_number"
                            placeholder="Enter Contact Number"
                            value={formValues.contact_number}
                            onChange={handleChange}
                            className={`form-control ${
                              errors.contact_number ? "is-invalid" : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                            disabled={isSubmitting}
                          />
                          {errors.contact_number && (
                            <div className="invalid-feedback">
                              {errors.contact_number}
                            </div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* Business Type */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="businessType"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Business Type <span className="text-danger">*</span>
                          </Label>
                          <Select
                            name="business_type"
                            options={businessTypes}
                            value={businessTypes.find(
                              (type) => type.value === formValues.business_type
                            )}
                            onChange={handleSelectChange}
                            isDisabled={isSubmitting}
                            styles={{
                              control: (base) => ({
                                ...base,
                                borderRadius: "8px",
                                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                padding: "2px",
                              }),
                              menu: (base) => ({
                                ...base,
                                zIndex: 9999,
                              }),
                            }}
                          />
                          {errors.business_type && (
                            <div className="invalid-feedback d-block">
                              {errors.business_type}
                            </div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* Buttons */}
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
                            marginRight: "10px",
                          }}
                          className="hover-scale"
                        >
                          {isSubmitting
                            ? "Processing..."
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

export default RegistrationModule;