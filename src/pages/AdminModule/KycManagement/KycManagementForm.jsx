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
import Select from "react-select";
import {
  postKycDetails,
  getKycDetailsById,
  updateKycDetails,
} from "../../../ApiService/AdminModule/KycManagement";

// import {
//   getDoctors,
//   getEmployees,
//   getSellers,
// } from "../../../ApiService/AdminModule/AssociateService";

import { getAllDocumentTypes } from "../../../ApiService/AdminModule/DocumentMaster";
import { getManufacturers } from "../../../ApiService/Drugs/Drug";
import { getSuppliers } from "../../../ApiService/Associate/Supplier";

const validationSchema = Yup.object().shape({
  documentName: Yup.array()
    .min(1, "At least one document must be selected")
    .required("Document Name is required"),
  associateType: Yup.string()
    .required("Associate Type is required")
    .oneOf(
      ["Employee", "Doctor", "Manufacturer", "Supplier", "Seller"],
      "Invalid Associate Type"
    ),
});

const KycManagementForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditMode, setIsEditMode] = useState(false);
  const [kycId, setKycId] = useState(null);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [associateOptions, setAssociateOptions] = useState([]);
  const [loadingAssociates, setLoadingAssociates] = useState(false);

  useEffect(() => {
    fetchDocumentTypes();
    if (location.state && location.state.id) {
      setIsEditMode(true);
      setKycId(location.state.id);
      fetchKycDetails(location.state.id);
    }
  }, [location.state]);

  const fetchDocumentTypes = async () => {
    try {
      const response = await getAllDocumentTypes();
      setDocumentTypes(response || []);
    } catch (error) {
      console.error("Error fetching document types:", error);
      Swal.fire({
        title: "Error!",
        text: error.message || "Failed to fetch document types.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const fetchKycDetails = async (id) => {
    try {
      const data = await getKycDetailsById(id);
      formik.setValues({
        documentName: data.document_id ? [data.document_id] : [],
        associateType: data.associate_type || "",
      });
      if (data.associate_type) {
        fetchAssociateNames(data.associate_type);
      }
    } catch (error) {
      console.error("Error fetching KYC details:", error);
      Swal.fire({
        title: "Error!",
        text: error.message || "Failed to fetch KYC details.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const fetchAssociateNames = async (type) => {
    setLoadingAssociates(true);
    try {
      let data;
      let nameKey; 
      let nameId;
      switch (type) {
        case "Doctor":
          data = await getDoctors();
          nameKey = "doctor_name";
          nameId = "doctor_id"
          break;
        case "Supplier":
          data = await getSuppliers();
          nameKey = "supplier_name";
          nameId = "supplier_id";
          break;
        case "Employee":
          data = await getEmployees();
          nameKey = "employee_name";
          break;
        case "Manufacturer":
          data = await getManufacturers();
          nameKey = "manufacturer_name"; 
          nameId = "manufacturer_id";
          break;
        case "Seller":
          data = await getSellers();
          nameKey = "seller_name";
          break;
        default:
          data = [];
          nameKey = "name"; 
      }
      const options = data.map((item) => ({
        value: item[nameId],
        label: item[nameKey], 
      }));
      setAssociateOptions(options);
    } catch (error) {
      console.error(`Error fetching ${type} names:`, error);
      Swal.fire({
        title: "Error!",
        text: `Failed to fetch ${type} names: ${error.message}`,
        icon: "error",
        confirmButtonText: "OK",
      });
      setAssociateOptions([]);
    } finally {
      setLoadingAssociates(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      documentName: [],
      associateType: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const formData = {
          document_ids: values.documentName,
          associate_type: values.associateType,
        };

        let response;
        if (isEditMode) {
          response = await updateKycDetails(kycId, formData);
          Swal.fire({
            title: "KYC Details Updated!",
            text: "The KYC details have been successfully updated.",
            icon: "success",
            confirmButtonText: "OK",
          });
        } else {
          response = await postKycDetails(formData);
          Swal.fire({
            title: "KYC Details Added!",
            text: "The KYC details have been successfully added.",
            icon: "success",
            confirmButtonText: "OK",
          });
        }

        if (response) {
          formik.resetForm();
          setAssociateOptions([]);
          navigate("/kyc-management-list");
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

  const handleAssociateTypeChange = (e) => {
    const value = e.target.value;
    formik.setFieldValue("associateType", value);
    if (value) {
      fetchAssociateNames(value);
    }
  };

  document.title = isEditMode ? "Edit KYC Details" : "Add KYC Details";

  // Prepare document options for multi-select
  const documentOptions = documentTypes.map(doc => ({
    value: doc.id,
    label: doc.document_name
  }));

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="KYC Management"
            breadcrumbItem={isEditMode ? "Edit KYC Details" : "Add KYC Details"}
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
                        background: " Bentley-gradient(90deg, #007bff, #00c4cc)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {isEditMode ? "Edit KYC Details" : "Add KYC Details"}
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
                      {/* Document Name - Multi Select */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="documentName"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Document Name
                          </Label>
                          <Select
                            isMulti
                            name="documentName"
                            id="documentName"
                            options={documentOptions}
                            value={documentOptions.filter(option => 
                              formik.values.documentName.includes(option.value)
                            )}
                            onChange={(selectedOptions) => {
                              formik.setFieldValue(
                                "documentName",
                                selectedOptions ? selectedOptions.map(option => option.value) : []
                              );
                            }}
                            onBlur={() => formik.setFieldTouched("documentName", true)}
                            className={
                              formik.touched.documentName && formik.errors.documentName
                                ? "is-invalid"
                                : ""
                            }
                            styles={{
                              control: (base) => ({
                                ...base,
                                borderRadius: "8px",
                                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                padding: "2px",
                                minHeight: "44px",
                              }),
                              multiValue: (base) => ({
                                ...base,
                                backgroundColor: "#e9f5ff",
                                borderRadius: "4px",
                              }),
                            }}
                            placeholder="Select one or more documents"
                          />
                          {formik.touched.documentName &&
                            formik.errors.documentName && (
                              <div
                                className="invalid-feedback"
                                style={{ display: "block" }}
                              >
                                {formik.errors.documentName}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      {/* Associate Type */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="associateType"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Associate Type
                          </Label>
                          <Input
                            type="select"
                            name="associateType"
                            id="associateType"
                            value={formik.values.associateType}
                            onChange={handleAssociateTypeChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.associateType &&
                              formik.errors.associateType
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          >
                            <option value="">Select Associate Type</option>
                            <option value="Employee">Employee</option>
                            <option value="Doctor">Doctor</option>
                            <option value="Manufacturer">Manufacturer</option>
                            <option value="Supplier">Supplier</option>
                            <option value="Seller">Seller</option>
                          </Input>
                          {formik.touched.associateType &&
                            formik.errors.associateType && (
                              <div className="invalid-feedback">
                                {formik.errors.associateType}
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
        a.text-primary:hover {
          color: #0056b3 !important;
        }
      `}</style>
    </React.Fragment>
  );
};

export default KycManagementForm;