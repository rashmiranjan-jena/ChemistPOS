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
import Breadcrumbs from "../../../components/Common/Breadcrumb"; // Adjust path as needed
import { useNavigate, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import {
  addDoctor,
  getDoctorById,
  updateDoctor,
} from "../../../ApiService/Associate/Doctor"; // Assume these API functions exist

// Validation schema using Yup
const validationSchema = Yup.object({
  name: Yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),
  hospitalClinic: Yup.string().optional(),
  diseasesSpecializedIn: Yup.array()
    .of(Yup.string().min(2, "Disease must be at least 2 characters").optional())
    .optional(),
  designations: Yup.array()
    .of(
      Yup.string()
        .min(2, "Designation must be at least 2 characters")
        .optional()
    )
    .optional(),
  qualifications: Yup.array()
    .of(
      Yup.string()
        .min(2, "Qualification must be at least 2 characters")
        .optional()
    )
    .optional(),
  specialistCategory: Yup.array()
    .of(
      Yup.string()
        .min(2, "Specialist Category must be at least 2 characters")
        .optional()
    )
    .optional(),
  commissionPercentage: Yup.number()
    .min(0, "Percentage must be 0 or greater")
    .max(100, "Percentage cannot exceed 100")
    .optional(),
  phoneNo: Yup.string()
    .matches(/^\d{10}$/, "Phone Number must be exactly 10 digits", {
      excludeEmptyString: true,
    })
    .optional(),
  emailId: Yup.string().email("Invalid email format").optional(),
  address: Yup.string().optional(),
  agreementDocument: Yup.mixed()
    .nullable()
    .test(
      "fileSize",
      "File size must be less than 5MB",
      (value) => !value || value.size <= 5 * 1024 * 1024
    )
    .test(
      "fileType",
      "Only PDF files are allowed",
      (value) => !value || value.type === "application/pdf"
    )
    .optional(),
  prohibitedStatus: Yup.string().optional(),
  licenceNo: Yup.string()
    .matches(
      /^[A-Za-z0-9-]+$/,
      "Licence Number can only contain letters, numbers, and hyphens",
      { excludeEmptyString: true }
    )
    .optional(),
  paymentCycle: Yup.string().optional(),
});

const DoctorBasicDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditMode, setIsEditMode] = useState(false);
  const [doctorId, setDoctorId] = useState(null);

  useEffect(() => {
    if (location.state && location.state.id) {
      setIsEditMode(true);
      setDoctorId(location.state.id);
      fetchDoctorDetails(location.state.id);
    }
  }, [location.state]);

  const fetchDoctorDetails = async (id) => {
    try {
      const data = await getDoctorById(id);
      formik.setValues({
        name: data.name || "",
        hospitalClinic: data.hospitalClinic || "",
        diseasesSpecializedIn: data.diseasesSpecializedIn?.length
          ? data.diseasesSpecializedIn
          : [""],
        designations: data.designations?.length ? data.designations : [""],
        qualifications: data.qualifications?.length
          ? data.qualifications
          : [""],
        specialistCategory: data.specialistCategory?.length
          ? data.specialistCategory
          : [""],
        commissionPercentage: data.commissionPercentage || "",
        phoneNo: data.phoneNo || "",
        emailId: data.emailId || "",
        address: data.address || "",
        agreementDocument: null, // File cannot be pre-filled; handle separately if needed
        prohibitedStatus: data.prohibitedStatus || "",
        licenceNo: data.licenceNo || "",
        paymentCycle: data.paymentCycle || "",
      });
    } catch (error) {
      console.error("Error fetching doctor details:", error);
      Swal.fire({
        title: "Error!",
        text: error.message || "Failed to fetch doctor details.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      hospitalClinic: "",
      diseasesSpecializedIn: [""],
      designations: [""],
      qualifications: [""],
      specialistCategory: [""],
      commissionPercentage: "",
      phoneNo: "",
      emailId: "",
      address: "",
      agreementDocument: null,
      prohibitedStatus: "",
      licenceNo: "",
      paymentCycle: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const formData = new FormData();

        // Manually append individual fields
        if (values.name) formData.append("name", values.name);
        if (values.hospitalClinic)
          formData.append("hospital_clinic", values.hospitalClinic);
        if (values.commissionPercentage)
          formData.append("commission_percentage", values.commissionPercentage);
        if (values.phoneNo) formData.append("phone_no", values.phoneNo);
        if (values.emailId) formData.append("email_id", values.emailId);
        if (values.address) formData.append("address", values.address);
        if (values.prohibitedStatus)
          formData.append("prohibited_status", values.prohibitedStatus);
        if (values.licenceNo) formData.append("licence_no", values.licenceNo);
        if (values.paymentCycle)
          formData.append("payment_cycle", values.paymentCycle);

        // Append file if exists
        if (values.agreementDocument) {
          formData.append("agreementDocument", values.agreementDocument);
        }

        // Append diseasesSpecializedIn as JSON array
        if (
          Array.isArray(values.diseasesSpecializedIn) &&
          values.diseasesSpecializedIn[0] !== ""
        ) {
          formData.append(
            "diseases_specialized_in",
            JSON.stringify(
              values.diseasesSpecializedIn.filter((item) => item !== "")
            )
          );
        }

        // Append designations as JSON array
        if (
          Array.isArray(values.designations) &&
          values.designations[0] !== ""
        ) {
          formData.append(
            "designation",
            JSON.stringify(values.designations.filter((item) => item !== ""))
          );
        }

        // Append qualifications as JSON array
        if (
          Array.isArray(values.qualifications) &&
          values.qualifications[0] !== ""
        ) {
          formData.append(
            "qualification",
            JSON.stringify(values.qualifications.filter((item) => item !== ""))
          );
        }

        // Append specialistCategory as JSON array
        if (
          Array.isArray(values.specialistCategory) &&
          values.specialistCategory[0] !== ""
        ) {
          formData.append(
            "specialist_category",
            JSON.stringify(
              values.specialistCategory.filter((item) => item !== "")
            )
          );
        }

        let response;

        if (isEditMode) {
          response = await updateDoctor(doctorId, formData);
          Swal.fire({
            title: "Doctor Updated!",
            text: "The doctor details have been successfully updated.",
            icon: "success",
            confirmButtonText: "OK",
          });
        } else {
          response = await addDoctor(formData);
           console.log("responseid",response.id)
          Swal.fire({
            title: "Doctor Added!",
            text: "The doctor details have been successfully added.",
            icon: "success",
            confirmButtonText: "OK",
          });
        }

        if (response) {
          formik.resetForm();
          navigate(`/doctor-activity-details`, {
            state: { id: response.id }});
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
        setSubmitting(false);
      }
    },
  });

  const {
    values,
    handleSubmit,
    handleChange,
    setFieldValue,
    errors,
    touched,
    isSubmitting,
    handleBlur,
  } = formik;

  document.title = isEditMode ? "Edit Doctor Details" : "Add Doctor Details";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Doctor Management"
            breadcrumbItem={
              isEditMode ? "Edit Doctor Details" : "Add Doctor Details"
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
                        ? "Edit Doctor Details"
                        : "Add Doctor Details"}
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
                      {/* Name */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="name"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Name *
                          </Label>
                          <Input
                            type="text"
                            name="name"
                            id="name"
                            placeholder="Enter name"
                            value={values.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`form-control ${
                              touched.name && errors.name ? "is-invalid" : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {touched.name && errors.name && (
                            <div className="invalid-feedback">
                              {errors.name}
                            </div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* Hospital/Clinic */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="hospitalClinic"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Hospital/Clinic
                          </Label>
                          <Input
                            type="text"
                            name="hospitalClinic"
                            id="hospitalClinic"
                            placeholder="Enter hospital/clinic"
                            value={values.hospitalClinic}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`form-control ${
                              touched.hospitalClinic && errors.hospitalClinic
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {touched.hospitalClinic && errors.hospitalClinic && (
                            <div className="invalid-feedback">
                              {errors.hospitalClinic}
                            </div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* Diseases Specialized In (Multiple Entries) */}
                      <Col md="12">
                        <FormGroup>
                          <Label
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Diseases Specialized In
                          </Label>
                          {values.diseasesSpecializedIn.map(
                            (disease, index) => (
                              <Row
                                key={index}
                                className="mb-2 align-items-center"
                              >
                                <Col md="9">
                                  <Input
                                    type="text"
                                    name={`diseasesSpecializedIn[${index}]`}
                                    placeholder="Enter disease (e.g., Diabetes)"
                                    value={disease}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`form-control ${
                                      touched.diseasesSpecializedIn?.[index] &&
                                      errors.diseasesSpecializedIn?.[index]
                                        ? "is-invalid"
                                        : ""
                                    }`}
                                    style={{
                                      borderRadius: "8px",
                                      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                      padding: "10px",
                                    }}
                                  />
                                  {touched.diseasesSpecializedIn?.[index] &&
                                    errors.diseasesSpecializedIn?.[index] && (
                                      <div className="invalid-feedback">
                                        {errors.diseasesSpecializedIn[index]}
                                      </div>
                                    )}
                                </Col>
                                <Col md="3">
                                  {index > 0 && (
                                    <Button
                                      color="danger"
                                      size="sm"
                                      onClick={() => {
                                        const newDiseases = [
                                          ...values.diseasesSpecializedIn,
                                        ];
                                        newDiseases.splice(index, 1);
                                        setFieldValue(
                                          "diseasesSpecializedIn",
                                          newDiseases
                                        );
                                      }}
                                      style={{ borderRadius: "8px" }}
                                    >
                                      Remove
                                    </Button>
                                  )}
                                </Col>
                              </Row>
                            )
                          )}
                          <Button
                            color="primary"
                            size="sm"
                            onClick={() =>
                              setFieldValue("diseasesSpecializedIn", [
                                ...values.diseasesSpecializedIn,
                                "",
                              ])
                            }
                            style={{ borderRadius: "8px", marginTop: "10px" }}
                          >
                            Add Disease
                          </Button>
                        </FormGroup>
                      </Col>

                      {/* Designations (Multiple Entries) */}
                      <Col md="12">
                        <FormGroup>
                          <Label
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Designations
                          </Label>
                          {values.designations.map((designation, index) => (
                            <Row
                              key={index}
                              className="mb-2 align-items-center"
                            >
                              <Col md="9">
                                <Input
                                  type="text"
                                  name={`designations[${index}]`}
                                  placeholder="Enter designation"
                                  value={designation}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  className={`form-control ${
                                    touched.designations?.[index] &&
                                    errors.designations?.[index]
                                      ? "is-invalid"
                                      : ""
                                  }`}
                                  style={{
                                    borderRadius: "8px",
                                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                    padding: "10px",
                                  }}
                                />
                                {touched.designations?.[index] &&
                                  errors.designations?.[index] && (
                                    <div className="invalid-feedback">
                                      {errors.designations[index]}
                                    </div>
                                  )}
                              </Col>
                              <Col md="3">
                                {index > 0 && (
                                  <Button
                                    color="danger"
                                    size="sm"
                                    onClick={() => {
                                      const newDesignations = [
                                        ...values.designations,
                                      ];
                                      newDesignations.splice(index, 1);
                                      setFieldValue(
                                        "designations",
                                        newDesignations
                                      );
                                    }}
                                    style={{ borderRadius: "8px" }}
                                  >
                                    Remove
                                  </Button>
                                )}
                              </Col>
                            </Row>
                          ))}
                          <Button
                            color="primary"
                            size="sm"
                            onClick={() =>
                              setFieldValue("designations", [
                                ...values.designations,
                                "",
                              ])
                            }
                            style={{ borderRadius: "8px", marginTop: "10px" }}
                          >
                            Add Designation
                          </Button>
                        </FormGroup>
                      </Col>

                      {/* Qualifications (Multiple Entries) */}
                      <Col md="12">
                        <FormGroup>
                          <Label
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Qualifications
                          </Label>
                          {values.qualifications.map((qualification, index) => (
                            <Row
                              key={index}
                              className="mb-2 align-items-center"
                            >
                              <Col md="9">
                                <Input
                                  type="text"
                                  name={`qualifications[${index}]`}
                                  placeholder="Enter qualification"
                                  value={qualification}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  className={`form-control ${
                                    touched.qualifications?.[index] &&
                                    errors.qualifications?.[index]
                                      ? "is-invalid"
                                      : ""
                                  }`}
                                  style={{
                                    borderRadius: "8px",
                                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                    padding: "10px",
                                  }}
                                />
                                {touched.qualifications?.[index] &&
                                  errors.qualifications?.[index] && (
                                    <div className="invalid-feedback">
                                      {errors.qualifications[index]}
                                    </div>
                                  )}
                              </Col>
                              <Col md="3">
                                {index > 0 && (
                                  <Button
                                    color="danger"
                                    size="sm"
                                    onClick={() => {
                                      const newQualifications = [
                                        ...values.qualifications,
                                      ];
                                      newQualifications.splice(index, 1);
                                      setFieldValue(
                                        "qualifications",
                                        newQualifications
                                      );
                                    }}
                                    style={{ borderRadius: "8px" }}
                                  >
                                    Remove
                                  </Button>
                                )}
                              </Col>
                            </Row>
                          ))}
                          <Button
                            color="primary"
                            size="sm"
                            onClick={() =>
                              setFieldValue("qualifications", [
                                ...values.qualifications,
                                "",
                              ])
                            }
                            style={{ borderRadius: "8px", marginTop: "10px" }}
                          >
                            Add Qualification
                          </Button>
                        </FormGroup>
                      </Col>

                      {/* Specialist Category (Multiple Entries) */}
                      <Col md="12">
                        <FormGroup>
                          <Label
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Specialist Categories
                          </Label>
                          {values.specialistCategory.map((category, index) => (
                            <Row
                              key={index}
                              className="mb-2 align-items-center"
                            >
                              <Col md="9">
                                <Input
                                  type="text"
                                  name={`specialistCategory[${index}]`}
                                  placeholder="Enter specialist category (e.g., Cardiologist)"
                                  value={category}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  className={`form-control ${
                                    touched.specialistCategory?.[index] &&
                                    errors.specialistCategory?.[index]
                                      ? "is-invalid"
                                      : ""
                                  }`}
                                  style={{
                                    borderRadius: "8px",
                                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                    padding: "10px",
                                  }}
                                />
                                {touched.specialistCategory?.[index] &&
                                  errors.specialistCategory?.[index] && (
                                    <div className="invalid-feedback">
                                      {errors.specialistCategory[index]}
                                    </div>
                                  )}
                              </Col>
                              <Col md="3">
                                {index > 0 && (
                                  <Button
                                    color="danger"
                                    size="sm"
                                    onClick={() => {
                                      const newCategories = [
                                        ...values.specialistCategory,
                                      ];
                                      newCategories.splice(index, 1);
                                      setFieldValue(
                                        "specialistCategory",
                                        newCategories
                                      );
                                    }}
                                    style={{ borderRadius: "8px" }}
                                  >
                                    Remove
                                  </Button>
                                )}
                              </Col>
                            </Row>
                          ))}
                          <Button
                            color="primary"
                            size="sm"
                            onClick={() =>
                              setFieldValue("specialistCategory", [
                                ...values.specialistCategory,
                                "",
                              ])
                            }
                            style={{ borderRadius: "8px", marginTop: "10px" }}
                          >
                            Add Specialist Category
                          </Button>
                        </FormGroup>
                      </Col>

                      {/* Commission Percentage */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="commissionPercentage"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Commission Percentage (%)
                          </Label>
                          <Input
                            type="number"
                            name="commissionPercentage"
                            id="commissionPercentage"
                            placeholder="Enter commission percentage"
                            value={values.commissionPercentage}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`form-control ${
                              touched.commissionPercentage &&
                              errors.commissionPercentage
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {touched.commissionPercentage &&
                            errors.commissionPercentage && (
                              <div className="invalid-feedback">
                                {errors.commissionPercentage}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      {/* Payment Cycle */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="paymentCycle"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Payment Cycle
                          </Label>
                          <Input
                            type="select"
                            name="paymentCycle"
                            id="paymentCycle"
                            value={values.paymentCycle}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`form-control ${
                              touched.paymentCycle && errors.paymentCycle
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          >
                            <option value="">Select Payment Cycle</option>
                            <option value="Monthly">Monthly</option>
                            <option value="Quarterly">Quarterly</option>
                            <option value="Annually">Annually</option>
                          </Input>
                          {touched.paymentCycle && errors.paymentCycle && (
                            <div className="invalid-feedback">
                              {errors.paymentCycle}
                            </div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* Phone No */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="phoneNo"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Phone Number
                          </Label>
                          <Input
                            type="text"
                            name="phoneNo"
                            id="phoneNo"
                            placeholder="Enter phone number"
                            value={values.phoneNo}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`form-control ${
                              touched.phoneNo && errors.phoneNo
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {touched.phoneNo && errors.phoneNo && (
                            <div className="invalid-feedback">
                              {errors.phoneNo}
                            </div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* Email ID */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="emailId"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Email ID
                          </Label>
                          <Input
                            type="email"
                            name="emailId"
                            id="emailId"
                            placeholder="Enter email ID"
                            value={values.emailId}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`form-control ${
                              touched.emailId && errors.emailId
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {touched.emailId && errors.emailId && (
                            <div className="invalid-feedback">
                              {errors.emailId}
                            </div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* Address */}
                      <Col md="12">
                        <FormGroup>
                          <Label
                            for="address"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Address
                          </Label>
                          <Input
                            type="textarea"
                            name="address"
                            id="address"
                            placeholder="Enter address"
                            rows="3"
                            value={values.address}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`form-control ${
                              touched.address && errors.address
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {touched.address && errors.address && (
                            <div className="invalid-feedback">
                              {errors.address}
                            </div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* Agreement Document */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="agreementDocument"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Agreement Document (PDF)
                          </Label>
                          <Input
                            type="file"
                            name="agreementDocument"
                            id="agreementDocument"
                            accept="application/pdf"
                            onChange={(event) => {
                              setFieldValue(
                                "agreementDocument",
                                event.currentTarget.files[0]
                              );
                            }}
                            onBlur={handleBlur}
                            className={`form-control ${
                              touched.agreementDocument &&
                              errors.agreementDocument
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "8px",
                            }}
                          />
                          {touched.agreementDocument &&
                            errors.agreementDocument && (
                              <div className="invalid-feedback">
                                {errors.agreementDocument}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      {/* Prohibited Status */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="prohibitedStatus"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Prohibited Status
                          </Label>
                          <Input
                            type="select"
                            name="prohibitedStatus"
                            id="prohibitedStatus"
                            value={values.prohibitedStatus}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`form-control ${
                              touched.prohibitedStatus &&
                              errors.prohibitedStatus
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          >
                            <option value="">Select Status</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </Input>
                          {touched.prohibitedStatus &&
                            errors.prohibitedStatus && (
                              <div className="invalid-feedback">
                                {errors.prohibitedStatus}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      {/* Licence No */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="licenceNo"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Licence Number
                          </Label>
                          <Input
                            type="text"
                            name="licenceNo"
                            id="licenceNo"
                            placeholder="Enter licence number"
                            value={values.licenceNo}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`form-control ${
                              touched.licenceNo && errors.licenceNo
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {touched.licenceNo && errors.licenceNo && (
                            <div className="invalid-feedback">
                              {errors.licenceNo}
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

export default DoctorBasicDetails;
