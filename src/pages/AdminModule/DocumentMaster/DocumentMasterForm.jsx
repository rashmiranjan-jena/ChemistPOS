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
  postDocumentType,
  getDocumentTypeById,
  updateDocumentType,
} from "../../../ApiService/AdminModule/DocumentMaster";

const validationSchema = Yup.object().shape({
  documentTypeName: Yup.string()
    .required("Document Type Name is required")
    .min(2, "Document Type Name must be at least 2 characters")
    .max(50, "Document Type Name must not exceed 50 characters"),
});

const DocumentMasterForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditMode, setIsEditMode] = useState(false);
  const [documentTypeId, setDocumentTypeId] = useState(null);

  useEffect(() => {
    if (location.state && location.state.id) {
      setIsEditMode(true);
      setDocumentTypeId(location.state.id);
      fetchDocumentType(location.state.id);
    }
  }, [location.state]);

  const fetchDocumentType = async (id) => {
    try {
      const data = await getDocumentTypeById(id);
      formik.setValues({
        documentTypeName: data.document_name || "",
      });
    } catch (error) {
      console.error("Error fetching document type:", error);
      Swal.fire({
        title: "Error!",
        text: error.message || "Failed to fetch document type data.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const formik = useFormik({
    initialValues: {
      documentTypeName: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("document_name", values.documentTypeName);

        let response;
        if (isEditMode) {
          response = await updateDocumentType(documentTypeId, formData);
          Swal.fire({
            title: "Document Type Updated!",
            text: "The document type has been successfully updated.",
            icon: "success",
            confirmButtonText: "OK",
          });
        } else {
          response = await postDocumentType(formData);
          Swal.fire({
            title: "Document Type Added!",
            text: "The document type has been successfully added.",
            icon: "success",
            confirmButtonText: "OK",
          });
        }

        if (response) {
          formik.resetForm();
          navigate("/document-master-list");
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

  document.title = "Add Document Type";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Document Master"
            breadcrumbItem={isEditMode ? "Edit Document" : "Add Document"}
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
                        ? "Edit Document Details"
                        : "Add Document Details"}
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
                      {/* Document Type Name */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="documentTypeName"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Document Type Name
                          </Label>
                          <Input
                            type="text"
                            name="documentTypeName"
                            id="documentTypeName"
                            placeholder="Enter document type name"
                            value={formik.values.documentTypeName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.documentTypeName &&
                              formik.errors.documentTypeName
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.touched.documentTypeName &&
                            formik.errors.documentTypeName && (
                              <div className="invalid-feedback">
                                {formik.errors.documentTypeName}
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

export default DocumentMasterForm;
