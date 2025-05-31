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
import Select from "react-select";
import Swal from "sweetalert2";
import {
  postMedicalReport,
  getMedicalReportById,
  updateMedicalReport,
} from "../../../ApiService/MedicalRepresentative/MedicalRepresentativeMaster";
import { getBrands } from "../../../ApiService/Drugs/BrandForm";

const validationSchema = Yup.object({
  mrName: Yup.string()
    .min(2, "MR Name must be at least 2 characters")
    .required("MR Name is required"),
  contactNumber: Yup.string().matches(
    /^[0-9]{10}$/,
    "Contact Number must be a 10-digit number"
  ),
  emailId: Yup.string().email("Invalid email address"),
  associatedBrands: Yup.array(),
  commissionPercentage: Yup.number()
    .min(0, "Commission Percentage cannot be negative")
    .max(100, "Commission Percentage cannot exceed 100%"),
  status: Yup.string().oneOf(
    ["Active", "Inactive"],
    "Status must be Active or Inactive"
  ),
  mrAgreement: Yup.mixed()
    .nullable()
    .test(
      "fileFormat",
      "Only PDF files are allowed",
      (value) => !value || (value && value.type === "application/pdf")
    )
    .test(
      "fileSize",
      "File size must be less than 5MB",
      (value) => !value || (value && value.size <= 5 * 1024 * 1024)
    ),
});

const MedicalReportMasterForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [fileName, setFileName] = useState("");
  const [brandOptions, setBrandOptions] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [medicalReportId, setMedicalReportId] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null); // For PDF link

  // Check if we're in edit mode by getting the ID from location state
  useEffect(() => {
    const id = location?.state?.id;
    if (id) {
      setIsEditMode(true);
      setMedicalReportId(id);
      fetchMedicalReport(id);
    }
  }, [location]);

  // Fetch brands
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const data = await getBrands();
        const formattedBrands = data.map((brand) => ({
          value: brand.brand_id,
          label: brand.brand_name,
        }));
        setBrandOptions(formattedBrands);
      } catch (error) {
        console.error("Error fetching brands:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to fetch brands.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };
    fetchBrands();
  }, []);

  // Fetch existing medical report data for editing
  const fetchMedicalReport = async (id) => {
    try {
      const response = await getMedicalReportById(id);
      if (response) {
        formik.setValues({
          mrName: response.mrName || "",
          contactNumber: response.contactNumber || "",
          emailId: response.emailId || "",
          associatedBrands: response.associatedBrands
            ? JSON.parse(response.associatedBrands)
            : [],
          commissionPercentage: response.commissionPercentage || "",
          status: response.status === "true" ? "Active" : "Inactive",
          mrAgreement: null,
        });
        if (response.mrAgreement) {
          setFileName("Existing file");
          // Assuming mrAgreement is a URL or path from the server
          setPreviewUrl(
            `${import.meta.env.VITE_API_BASE_URL}${response.mrAgreement}`
          );
        }
      }
    } catch (error) {
      console.error("Error fetching medical report:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to fetch medical report data.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const formik = useFormik({
    initialValues: {
      mrName: "",
      contactNumber: "",
      emailId: "",
      associatedBrands: [],
      commissionPercentage: "",
      status: "",
      mrAgreement: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("mrName", values.mrName);
        formData.append("contactNumber", values.contactNumber);
        formData.append("emailId", values.emailId);
        formData.append(
          "associatedBrands",
          JSON.stringify(values.associatedBrands)
        );
        formData.append("commissionPercentage", values.commissionPercentage);
        formData.append(
          "status",
          values.status === "Active" ? "true" : "false"
        );
        if (values.mrAgreement) {
          formData.append("mrAgreement", values.mrAgreement);
        }

        let response;
        if (isEditMode) {
          response = await updateMedicalReport(medicalReportId, formData);
          if (response) {
            Swal.fire({
              title: "Success!",
              text: "Medical Report Master updated successfully!",
              icon: "success",
              confirmButtonText: "OK",
            });
          }
        } else {
          response = await postMedicalReport(formData);
          if (response) {
            Swal.fire({
              title: "Success!",
              text: "Medical Report Master submitted successfully!",
              icon: "success",
              confirmButtonText: "OK",
            });
          }
        }

        formik.resetForm();
        setFileName("");
        setPreviewUrl(null); // Clear preview after submission
        navigate("/medical-report-list");
      } catch (error) {
        console.error("Error submitting form:", error);
        Swal.fire({
          title: "Error!",
          text: `Failed to ${
            isEditMode ? "update" : "submit"
          } the form. Please try again.`,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    },
  });

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Medical Reports"
            breadcrumbItem={isEditMode ? "Edit MR Details" : "Add MR Details"}
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
                      {isEditMode ? "Edit MR Details" : "Add MR Details"}
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
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="mrName"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            MR Name <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            name="mrName"
                            id="mrName"
                            placeholder="Enter MR Name"
                            value={formik.values.mrName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.mrName && formik.errors.mrName
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.touched.mrName && formik.errors.mrName && (
                            <div className="invalid-feedback">
                              {formik.errors.mrName}
                            </div>
                          )}
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="contactNumber"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Contact Number
                          </Label>
                          <Input
                            type="text"
                            name="contactNumber"
                            id="contactNumber"
                            placeholder="Enter 10-digit Contact Number"
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
                            placeholder="Enter Email ID"
                            value={formik.values.emailId}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.emailId && formik.errors.emailId
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.touched.emailId && formik.errors.emailId && (
                            <div className="invalid-feedback">
                              {formik.errors.emailId}
                            </div>
                          )}
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="associatedBrands"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Associated Brands
                          </Label>
                          <Select
                            isMulti
                            options={brandOptions}
                            name="associatedBrands"
                            id="associatedBrands"
                            value={brandOptions.filter((option) =>
                              formik.values.associatedBrands.includes(
                                option.value
                              )
                            )}
                            onChange={(selectedOptions) => {
                              formik.setFieldValue(
                                "associatedBrands",
                                selectedOptions
                                  ? selectedOptions.map(
                                      (option) => option.value
                                    )
                                  : []
                              );
                            }}
                            onBlur={() =>
                              formik.setFieldTouched("associatedBrands", true)
                            }
                            className={
                              formik.touched.associatedBrands &&
                              formik.errors.associatedBrands
                                ? "is-invalid"
                                : ""
                            }
                            styles={{
                              control: (base, state) => ({
                                ...base,
                                borderRadius: "8px",
                                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                padding: "2px",
                                borderColor:
                                  formik.touched.associatedBrands &&
                                  formik.errors.associatedBrands
                                    ? "#dc3545"
                                    : base.borderColor,
                                "&:hover": {
                                  borderColor:
                                    formik.touched.associatedBrands &&
                                    formik.errors.associatedBrands
                                      ? "#dc3545"
                                      : base.borderColor,
                                },
                                ...(state.isFocused && {
                                  borderColor: "#007bff",
                                  boxShadow: "0 0 8px rgba(0, 123, 255, 0.3)",
                                }),
                              }),
                              multiValue: (base) => ({
                                ...base,
                                backgroundColor: "#007bff",
                                color: "#fff",
                              }),
                              multiValueLabel: (base) => ({
                                ...base,
                                color: "#fff",
                              }),
                            }}
                          />
                          {formik.touched.associatedBrands &&
                            formik.errors.associatedBrands && (
                              <div className="invalid-feedback">
                                {formik.errors.associatedBrands}
                              </div>
                            )}
                        </FormGroup>
                      </Col>
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
                            placeholder="Enter Commission Percentage"
                            value={formik.values.commissionPercentage}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.commissionPercentage &&
                              formik.errors.commissionPercentage
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.touched.commissionPercentage &&
                            formik.errors.commissionPercentage && (
                              <div className="invalid-feedback">
                                {formik.errors.commissionPercentage}
                              </div>
                            )}
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="status"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Status
                          </Label>
                          <Input
                            type="select"
                            name="status"
                            id="status"
                            value={formik.values.status}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.status && formik.errors.status
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                              width: "130px",
                            }}
                          >
                            <option value="">Select Status</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                          </Input>
                          {formik.touched.status && formik.errors.status && (
                            <div className="invalid-feedback">
                              {formik.errors.status}
                            </div>
                          )}
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="mrAgreement"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Upload MR Agreement (PDF)
                          </Label>
                          <Input
                            type="file"
                            name="mrAgreement"
                            id="mrAgreement"
                            accept="application/pdf"
                            onChange={(event) => {
                              const file = event.currentTarget.files[0];
                              formik.setFieldValue("mrAgreement", file);
                              setFileName(file ? file.name : "");
                              setPreviewUrl(
                                file ? URL.createObjectURL(file) : null
                              ); // Set preview URL for new file
                            }}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.mrAgreement &&
                              formik.errors.mrAgreement
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />

                          {previewUrl && (
                            <div className="mt-2">
                              <a
                                href={previewUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  color: "#007bff",
                                  textDecoration: "underline",
                                }}
                              >
                                View PDF {fileName}
                              </a>
                            </div>
                          )}
                          {formik.touched.mrAgreement &&
                            formik.errors.mrAgreement && (
                              <div className="invalid-feedback">
                                {formik.errors.mrAgreement}
                              </div>
                            )}
                        </FormGroup>
                      </Col>
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

export default MedicalReportMasterForm;
