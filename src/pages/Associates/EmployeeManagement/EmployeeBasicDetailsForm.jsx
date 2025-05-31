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
  addEmployee,
  getEmployeeById,
  updateEmployee,
} from "../../../ApiService/Associats/Employee";

// Validation schema using Yup
const validationSchema = Yup.object({
  name: Yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),
  contactNumber: Yup.string()
    .required("Contact Number is required")
    .matches(
      /^\+?\d{1,4}[-.\s]?\d{1,14}$/,
      "Contact Number must be a valid phone number (e.g., 8457045959 or 123-456-7890)"
    ),
  panNo: Yup.string()
    .required("PAN Number is required")
    .matches(
      /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
      "PAN Number must be valid (e.g., ABCDE1234F)"
    ),
  email: Yup.string().email("Must be a valid email address").nullable(),
});

const EmployeeBasicDetailsForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  console.log(location.state.emp_id);
  const [isEditMode, setIsEditMode] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);

  useEffect(() => {
    if (location.state && location.state.emp_id) {
      setIsEditMode(true);
      setEmployeeId(location.state.emp_id);
      fetchEmployee(location.state.emp_id);
    }
  }, [location.state]);

  const fetchEmployee = async (id) => {
    try {
      const data = await getEmployeeById(id);

      // Handle "NA" and empty string as nulls
      const cleanValue = (value) => (value && value !== "NA" ? value : "");

      // Parse present address safely
      const presentAddress =
        data.present_address && typeof data.present_address === "string"
          ? JSON.parse(data.present_address)
          : data.present_address || {};

      // Permanent address fallback
      const permanentAddress = data.permanent_address || {};

      formik.setValues({
        salutation: cleanValue(data.salutation),
        name: cleanValue(data.full_name),
        fatherName: cleanValue(data.fathers_name),
        motherName: cleanValue(data.mothers_name),
        dob: cleanValue(data.dob),
        aadhaarNo: cleanValue(data.aadhaar_no),
        panNo: cleanValue(data.pan_no),
        contactNumber: cleanValue(data.contact_no),
        email: cleanValue(data.email),
        presentAddress1: cleanValue(presentAddress.address1),
        presentAddress2: cleanValue(presentAddress.address2),
        presentCity: cleanValue(presentAddress.city),
        presentDistrict: cleanValue(presentAddress.district),
        presentState: cleanValue(presentAddress.state),
        presentPin: cleanValue(presentAddress.pin),
        presentCountry: cleanValue(presentAddress.country),
        permanentAddress1: cleanValue(permanentAddress.address1),
        permanentAddress2: cleanValue(permanentAddress.address2),
        permanentCity: cleanValue(permanentAddress.city),
        permanentDistrict: cleanValue(permanentAddress.district),
        permanentState: cleanValue(permanentAddress.state),
        permanentPin: cleanValue(permanentAddress.pin),
        permanentCountry: cleanValue(permanentAddress.country),
        emergencyContact: cleanValue(data.emergency_contact),
        bloodGroup: cleanValue(data.blood_group),
      });
    } catch (error) {
      console.error("Error fetching employee:", error);
      Swal.fire({
        title: "Error!",
        text: error.message || "Failed to fetch employee data.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const formik = useFormik({
    initialValues: {
      salutation: "",
      name: "",
      fatherName: "",
      motherName: "",
      dob: "",
      aadhaarNo: "",
      panNo: "",
      contactNumber: "",
      email: "",
      presentAddress1: "",
      presentAddress2: "",
      presentCity: "",
      presentDistrict: "",
      presentState: "",
      presentPin: "",
      presentCountry: "",
      permanentAddress1: "",
      permanentAddress2: "",
      permanentCity: "",
      permanentDistrict: "",
      permanentState: "",
      permanentPin: "",
      permanentCountry: "",
      emergencyContact: "",
      bloodGroup: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();

        // Append individual fields only if truthy
        if (values.salutation) {
          formData.append("salutation", values.salutation);
        }
        if (values.name) {
          formData.append("full_name", values.name);
        }
        if (values.fatherName) {
          formData.append("fathers_name", values.fatherName);
        }
        if (values.motherName) {
          formData.append("mothers_name", values.motherName);
        }
        if (values.dob) {
          formData.append("dob", values.dob);
        }
        if (values.aadhaarNo) {
          formData.append("aadhaar_no", values.aadhaarNo);
        }
        if (values.panNo) {
          formData.append("pan_no", values.panNo);
        }
        if (values.contactNumber) {
          formData.append("contact_no", values.contactNumber);
        }
        if (values.email) {
          formData.append("email", values.email);
        }
        if (values.emergencyContact) {
          formData.append("emergency_contact", values.emergencyContact);
        }
        if (values.bloodGroup) {
          formData.append("blood_group", values.bloodGroup);
        }

        // Create guaranteeAddress object only with truthy fields
        const presentAddress = {};
        if (values.presentAddress1) {
          presentAddress.address1 = values.presentAddress1;
        }
        if (values.presentAddress2) {
          presentAddress.address2 = values.presentAddress2;
        }
        if (values.presentCity) {
          presentAddress.city = values.presentCity;
        }
        if (values.presentDistrict) {
          presentAddress.district = values.presentDistrict;
        }
        if (values.presentState) {
          presentAddress.state = values.presentState;
        }
        if (values.presentPin) {
          presentAddress.pin = values.presentPin;
        }
        if (values.presentCountry) {
          presentAddress.country = values.presentCountry;
        }
        // Append presentAddress only if it has at least one field
        if (Object.keys(presentAddress).length > 0) {
          formData.append("present_address", JSON.stringify(presentAddress));
        }

        // Create permanentAddress object only with truthy fields
        const permanentAddress = {};
        if (values.permanentAddress1) {
          permanentAddress.address1 = values.permanentAddress1;
        }
        if (values.permanentAddress2) {
          permanentAddress.address2 = values.permanentAddress2;
        }
        if (values.permanentCity) {
          permanentAddress.city = values.permanentCity;
        }
        if (values.permanentDistrict) {
          permanentAddress.district = values.permanentDistrict;
        }
        if (values.permanentState) {
          permanentAddress.state = values.permanentState;
        }
        if (values.permanentPin) {
          permanentAddress.pin = values.permanentPin;
        }
        if (values.permanentCountry) {
          permanentAddress.country = values.permanentCountry;
        }
        // Append permanentAddress only if it has at least one field
        if (Object.keys(permanentAddress).length > 0) {
          formData.append(
            "permanent_address",
            JSON.stringify(permanentAddress)
          );
        }

        let response;
        if (isEditMode) {
          response = await updateEmployee(employeeId, formData);
          Swal.fire({
            title: "Employee Updated!",
            text: "The employee details have been successfully updated.",
            icon: "success",
            confirmButtonText: "OK",
          });
          if (response) {
            formik.resetForm();
            navigate(`/add-new-employee-list`);
          }
        } else {
          response = await addEmployee(formData);
          const displayMessage =
            response?.message || "Employee added successfully!";
          Swal.fire({
            title: "Employee Added!",
            text: displayMessage,
            icon: "success",
            confirmButtonText: "OK",
          });
          if (response) {
            formik.resetForm();
            navigate(`/employee-company-details`, {
              state: { id: response.emp_id },
            });
          }
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        Swal.fire({
          title: "Error!",
          text: error.message || "Failed to submit the form. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    },
  });

  document.title = isEditMode
    ? "Edit Employee Details"
    : "Add Employee Details";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Employee Management"
            breadcrumbItem={
              isEditMode ? "Edit Employee Details" : "Add Employee Details"
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
                        ? "Edit Employee Details"
                        : "Add Employee Details"}
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
                      {/* Salutation */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="salutation"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Salutation
                          </Label>
                          <Input
                            type="select"
                            name="salutation"
                            id="salutation"
                            value={formik.values.salutation}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="form-control"
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          >
                            <option value="">Select Salutation</option>
                            <option value="Mr.">Mr.</option>
                            <option value="Ms.">Ms.</option>
                            <option value="Mrs.">Mrs.</option>
                            <option value="Dr.">Dr.</option>
                          </Input>
                        </FormGroup>
                      </Col>

                      {/* Name */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="name"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Name <span style={{ color: "red" }}>*</span>
                          </Label>
                          <Input
                            type="text"
                            name="name"
                            id="name"
                            placeholder="Enter name"
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

                      {/* Father's Name */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="fatherName"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Father's Name
                          </Label>
                          <Input
                            type="text"
                            name="fatherName"
                            id="fatherName"
                            placeholder="Enter father's name"
                            value={formik.values.fatherName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="form-control"
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                        </FormGroup>
                      </Col>

                      {/* Mother's Name */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="motherName"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Mother's Name
                          </Label>
                          <Input
                            type="text"
                            name="motherName"
                            id="motherName"
                            placeholder="Enter mother's name"
                            value={formik.values.motherName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="form-control"
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                        </FormGroup>
                      </Col>

                      {/* Date of Birth */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="dob"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Date of Birth
                          </Label>
                          <Input
                            type="date"
                            name="dob"
                            id="dob"
                            value={formik.values.dob}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="form-control"
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                        </FormGroup>
                      </Col>

                      {/* Aadhaar Number */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="aadhaarNo"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Aadhaar Number
                          </Label>
                          <Input
                            type="text"
                            name="aadhaarNo"
                            id="aadhaarNo"
                            placeholder="Enter Aadhaar number"
                            value={formik.values.aadhaarNo}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="form-control"
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                        </FormGroup>
                      </Col>

                      {/* PAN Number */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="panNo"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            PAN Number <span style={{ color: "red" }}>*</span>
                          </Label>
                          <Input
                            type="text"
                            name="panNo"
                            id="panNo"
                            placeholder="Enter PAN number"
                            value={formik.values.panNo}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.panNo && formik.errors.panNo
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.touched.panNo && formik.errors.panNo && (
                            <div className="invalid-feedback">
                              {formik.errors.panNo}
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
                            Email
                          </Label>
                          <Input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Enter email (optional)"
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

                      {/* Contact Number */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="contactNumber"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Contact Number{" "}
                            <span style={{ color: "red" }}>*</span>
                          </Label>
                          <Input
                            type="text"
                            name="contactNumber"
                            id="contactNumber"
                            placeholder="Enter contact number"
                            value={formik.values.contactNumber}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.contactNumber &&
                              formik.errors.contactNumber
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.touched.contactNumber &&
                            formik.errors.contactNumber && (
                              <div className="invalid-feedback">
                                {formik.errors.contactNumber}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      {/* Present Address */}
                      <Col md="12">
                        <h5 className="text-dark mt-3">Present Address</h5>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="presentAddress1"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Address Line 1
                          </Label>
                          <Input
                            type="text"
                            name="presentAddress1"
                            id="presentAddress1"
                            placeholder="Enter address line 1"
                            value={formik.values.presentAddress1}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="form-control"
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="presentAddress2"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Address Line 2
                          </Label>
                          <Input
                            type="text"
                            name="presentAddress2"
                            id="presentAddress2"
                            placeholder="Enter address line 2 (optional)"
                            value={formik.values.presentAddress2}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="form-control"
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="presentCity"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            City
                          </Label>
                          <Input
                            type="text"
                            name="presentCity"
                            id="presentCity"
                            placeholder="Enter city"
                            value={formik.values.presentCity}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="form-control"
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="presentDistrict"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            District
                          </Label>
                          <Input
                            type="text"
                            name="presentDistrict"
                            id="presentDistrict"
                            placeholder="Enter district"
                            value={formik.values.presentDistrict}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="form-control"
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="presentState"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            State
                          </Label>
                          <Input
                            type="text"
                            name="presentState"
                            id="presentState"
                            placeholder="Enter state"
                            value={formik.values.presentState}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="form-control"
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="presentPin"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            PIN
                          </Label>
                          <Input
                            type="text"
                            name="presentPin"
                            id="presentPin"
                            placeholder="Enter PIN"
                            value={formik.values.presentPin}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="form-control"
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="presentCountry"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Country
                          </Label>
                          <Input
                            type="text"
                            name="presentCountry"
                            id="presentCountry"
                            placeholder="Enter country"
                            value={formik.values.presentCountry}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="form-control"
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                        </FormGroup>
                      </Col>

                      {/* Permanent Address */}
                      <Col md="12">
                        <h5 className="text-dark mt-3">Permanent Address</h5>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="permanentAddress1"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Address Line 1
                          </Label>
                          <Input
                            type="text"
                            name="permanentAddress1"
                            id="permanentAddress1"
                            placeholder="Enter address line 1"
                            value={formik.values.permanentAddress1}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="form-control"
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="permanentAddress2"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Address Line 2
                          </Label>
                          <Input
                            type="text"
                            name="permanentAddress2"
                            id="permanentAddress2"
                            placeholder="Enter address line 2 (optional)"
                            value={formik.values.permanentAddress2}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="form-control"
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="permanentCity"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            City
                          </Label>
                          <Input
                            type="text"
                            name="permanentCity"
                            id="permanentCity"
                            placeholder="Enter city"
                            value={formik.values.permanentCity}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="form-control"
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="permanentDistrict"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            District
                          </Label>
                          <Input
                            type="text"
                            name="permanentDistrict"
                            id="permanentDistrict"
                            placeholder="Enter district"
                            value={formik.values.permanentDistrict}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="form-control"
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="permanentState"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            State
                          </Label>
                          <Input
                            type="text"
                            name="permanentState"
                            id="permanentState"
                            placeholder="Enter state"
                            value={formik.values.permanentState}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="form-control"
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="permanentPin"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            PIN
                          </Label>
                          <Input
                            type="text"
                            name="permanentPin"
                            id="permanentPin"
                            placeholder="Enter PIN"
                            value={formik.values.permanentPin}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="form-control"
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="permanentCountry"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Country
                          </Label>
                          <Input
                            type="text"
                            name="permanentCountry"
                            id="permanentCountry"
                            placeholder="Enter country"
                            value={formik.values.permanentCountry}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="form-control"
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                        </FormGroup>
                      </Col>

                      {/* Emergency Contact */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="emergencyContact"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Emergency Contact Number
                          </Label>
                          <Input
                            type="text"
                            name="emergencyContact"
                            id="emergencyContact"
                            placeholder="Enter emergency contact"
                            value={formik.values.emergencyContact}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="form-control"
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                        </FormGroup>
                      </Col>

                      {/* Blood Group */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="bloodGroup"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Blood Group
                          </Label>
                          <Input
                            type="select"
                            name="bloodGroup"
                            id="bloodGroup"
                            value={formik.values.bloodGroup}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="form-control"
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          >
                            <option value="">Select Blood Group</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                          </Input>
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

export default EmployeeBasicDetailsForm;
