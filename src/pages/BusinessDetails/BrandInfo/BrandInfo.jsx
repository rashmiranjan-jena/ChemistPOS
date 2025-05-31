import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormGroup,
  Label,
  Row,
} from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb"; // Adjust path as needed
import { useLocation, useNavigate } from "react-router-dom";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Dropzone from "react-dropzone";
import { AiOutlineCloseCircle } from "react-icons/ai";
import Swal from "sweetalert2";
import { postBusinessBrandDetails } from "../../../ApiService/BusinessOverview/Brandinfo";

// Validation schema using Yup
const validationSchema = Yup.object({
  header_logo: Yup.array()
    .min(1, "Please upload at least one Logo")
    .required("Logo is required"),
  favicon: Yup.array()
    .min(1, "Please upload at least one Favicon")
    .required("Favicon is required"),
  footer_logo: Yup.array()
    .min(1, "Please upload at least one Footer Logo")
    .required("Footer Logo is required"),
  header_footer_letterhead: Yup.array()
    .min(1, "Please upload at least one Letterhead Header/Footer")
    .required("Letterhead Header/Footer is required"),
  watermark_letterhead: Yup.array()
    .min(1, "Please upload at least one Watermark")
    .required("Watermark is required"),
});

const BrandInfo = () => {
  document.title = "Brand Registration";
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}`;
  const location = useLocation();
  const brandData = location.state?.brand;
  console.log(brandData);

  const initialValues = {
    header_logo: brandData?.header_logo ? [brandData.header_logo] : [],
    favicon: brandData?.favicon ? [brandData.favicon] : [],
    footer_logo: brandData?.footer_logo ? [brandData.footer_logo] : [],
    header_footer_letterhead: brandData?.header_footer_letterhead ? [brandData.header_footer_letterhead] : [],
    watermark_letterhead: brandData?.watermark_letterhead ? [brandData.watermark_letterhead] : [],
  };

  // Set initial previews from brandData
  useEffect(() => {
    if (brandData) {
      const initialSelectedFiles = {};
      if (brandData.header_logo) {
        initialSelectedFiles.header_logo = [{ preview: `${BASE_URL}${brandData.header_logo}` }];
      }
      if (brandData.favicon) {
        initialSelectedFiles.favicon = [{ preview: `${BASE_URL}${brandData.favicon}` }];
      }
      if (brandData.footer_logo) {
        initialSelectedFiles.footer_logo = [{ preview: `${BASE_URL}${brandData.footer_logo}` }];
      }
      if (brandData.header_footer_letterhead) {
        initialSelectedFiles.header_footer_letterhead = {
          preview: `${BASE_URL}${brandData.header_footer_letterhead}`,
        };
      }
      if (brandData.watermark_letterhead) {
        initialSelectedFiles.watermark_letterhead = {
          preview: `${BASE_URL}${brandData.watermark_letterhead}`,
        };
      }
      setSelectedFiles(initialSelectedFiles);
    }
  }, [brandData]);

  const handleSubmit = async (values, { setSubmitting }) => {
    setIsSubmitting(true);

    // Create FormData object for file uploads
    const formData = new FormData();

    // Append all files to FormData
    Object.keys(values).forEach((fieldName) => {
      values[fieldName].forEach((file) => {
        formData.append(`${fieldName}`, file);
      });
    });

    try {
      const response = await postBusinessBrandDetails(formData);
      if (response.status === 201) {
        Swal.fire({
          title: "Success!",
          text: "Branding assets submitted successfully.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          setSubmitting(false);
          navigate("/brandinfolist");
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to submit branding assets.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
    setSubmitting(false);
  };

  const handleAcceptedFiles = (fieldName, files, setFieldValue) => {
    const updatedFiles = files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
    setSelectedFiles((prevFiles) => ({
      ...prevFiles,
      [fieldName]: updatedFiles,
    }));
    setFieldValue(fieldName, updatedFiles);
  };

  const removeFile = (fieldName, index, setFieldValue) => {
    const updatedFiles = selectedFiles[fieldName].filter(
      (_, idx) => idx !== index
    );
    setSelectedFiles((prevFiles) => ({
      ...prevFiles,
      [fieldName]: updatedFiles,
    }));
    setFieldValue(fieldName, updatedFiles);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Brand Management"
            breadcrumbItem="Add Brand Assets"
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
                      Add Brand Assets
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
                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    validateOnMount={true}
                    onSubmit={handleSubmit}
                  >
                    {({ setFieldValue, handleSubmit, errors, touched, setFieldTouched }) => (
                      <Form onSubmit={(e) => {
                        e.preventDefault();
                        // Mark all fields as touched to trigger error display
                        Object.keys(initialValues).forEach(field => setFieldTouched(field, true));
                        handleSubmit();
                      }}>
                        <Row className="g-4">
                          {/* Logo */}
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="header_logo"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Logo <span className="text-danger">*</span>
                              </Label>
                              <Dropzone
                                onDrop={(acceptedFiles) =>
                                  handleAcceptedFiles(
                                    "header_logo",
                                    acceptedFiles,
                                    setFieldValue
                                  )
                                }
                                accept="image/*"
                              >
                                {({ getRootProps, getInputProps }) => (
                                  <div
                                    className="dropzone"
                                    {...getRootProps()}
                                    style={{
                                      borderRadius: "8px",
                                      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                      padding: "10px",
                                      textAlign: "center",
                                      cursor: "pointer",
                                    }}
                                  >
                                    <input {...getInputProps()} />
                                    <div className="mb-3">
                                      <i className="display-4 text-muted bx bxs-cloud-upload" />
                                    </div>
                                    <h4>Drop image here or click to upload.</h4>
                                  </div>
                                )}
                              </Dropzone>
                              {selectedFiles?.header_logo?.length > 0 && (
                                <div className="mt-2">
                                  {selectedFiles.header_logo.map((file, index) => (
                                    <div
                                      key={index}
                                      style={{
                                        position: "relative",
                                        display: "inline-block",
                                        marginRight: "10px",
                                      }}
                                    >
                                      <img
                                        src={file.preview}
                                        alt={`Logo ${index + 1}`}
                                        style={{
                                          width: "100px",
                                          height: "auto",
                                          marginRight: "10px",
                                        }}
                                      />
                                      <AiOutlineCloseCircle
                                        style={{
                                          position: "absolute",
                                          top: "0",
                                          right: "0",
                                          cursor: "pointer",
                                          fontSize: "20px",
                                          color: "red",
                                        }}
                                        onClick={() =>
                                          removeFile(
                                            "header_logo",
                                            index,
                                            setFieldValue
                                          )
                                        }
                                      />
                                    </div>
                                  ))}
                                </div>
                              )}
                              {errors.header_logo && touched.header_logo && (
                                <div className="invalid-feedback d-block">{errors.header_logo}</div>
                              )}
                            </FormGroup>
                          </Col>

                          {/* Favicon */}
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="favicon"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Favicon <span className="text-danger">*</span>
                              </Label>
                              <Dropzone
                                onDrop={(acceptedFiles) =>
                                  handleAcceptedFiles(
                                    "favicon",
                                    acceptedFiles,
                                    setFieldValue
                                  )
                                }
                                accept="image/*"
                              >
                                {({ getRootProps, getInputProps }) => (
                                  <div
                                    className="dropzone"
                                    {...getRootProps()}
                                    style={{
                                      borderRadius: "8px",
                                      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                      padding: "10px",
                                      textAlign: "center",
                                      cursor: "pointer",
                                    }}
                                  >
                                    <input {...getInputProps()} />
                                    <div className="mb-3">
                                      <i className="display-4 text-muted bx bxs-cloud-upload" />
                                    </div>
                                    <h4>Drop image here or click to upload.</h4>
                                  </div>
                                )}
                              </Dropzone>
                              {selectedFiles?.favicon?.length > 0 && (
                                <div className="mt-2">
                                  {selectedFiles.favicon.map((file, index) => (
                                    <div
                                      key={index}
                                      style={{
                                        position: "relative",
                                        display: "inline-block",
                                        marginRight: "10px",
                                      }}
                                    >
                                      <img
                                        src={file.preview}
                                        alt={`Favicon ${index + 1}`}
                                        style={{
                                          width: "50px",
                                          height: "auto",
                                          marginRight: "10px",
                                        }}
                                      />
                                      <AiOutlineCloseCircle
                                        style={{
                                          position: "absolute",
                                          top: "0",
                                          right: "0",
                                          cursor: "pointer",
                                          fontSize: "20px",
                                          color: "red",
                                        }}
                                        onClick={() =>
                                          removeFile(
                                            "favicon",
                                            index,
                                            setFieldValue
                                          )
                                        }
                                      />
                                    </div>
                                  ))}
                                </div>
                              )}
                              {errors.favicon && touched.favicon && (
                                <div className="invalid-feedback d-block">{errors.favicon}</div>
                              )}
                            </FormGroup>
                          </Col>

                          {/* Footer Logo */}
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="footer_logo"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Footer Logo <span className="text-danger">*</span>
                              </Label>
                              <Dropzone
                                onDrop={(acceptedFiles) =>
                                  handleAcceptedFiles(
                                    "footer_logo",
                                    acceptedFiles,
                                    setFieldValue
                                  )
                                }
                                accept="image/*"
                              >
                                {({ getRootProps, getInputProps }) => (
                                  <div
                                    className="dropzone"
                                    {...getRootProps()}
                                    style={{
                                      borderRadius: "8px",
                                      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                      padding: "10px",
                                      textAlign: "center",
                                      cursor: "pointer",
                                    }}
                                  >
                                    <input {...getInputProps()} />
                                    <div className="mb-3">
                                      <i className="display-4 text-muted bx bxs-cloud-upload" />
                                    </div>
                                    <h4>Drop image here or click to upload.</h4>
                                  </div>
                                )}
                              </Dropzone>
                              {selectedFiles?.footer_logo?.length > 0 && (
                                <div className="mt-2">
                                  {selectedFiles.footer_logo.map(
                                    (file, index) => (
                                      <div
                                        key={index}
                                        style={{
                                          position: "relative",
                                          display: "inline-block",
                                          marginRight: "10px",
                                        }}
                                      >
                                        <img
                                          src={file.preview}
                                          alt={`Footer Logo ${index + 1}`}
                                          style={{
                                            width: "100px",
                                            height: "auto",
                                            marginRight: "10px",
                                          }}
                                        />
                                        <AiOutlineCloseCircle
                                          style={{
                                            position: "absolute",
                                            top: "0",
                                            right: "0",
                                            cursor: "pointer",
                                            fontSize: "20px",
                                            color: "red",
                                          }}
                                          onClick={() =>
                                            removeFile(
                                              "footer_logo",
                                              index,
                                              setFieldValue
                                            )
                                          }
                                        />
                                      </div>
                                    )
                                  )}
                                </div>
                              )}
                              {errors.footer_logo && touched.footer_logo && (
                                <div className="invalid-feedback d-block">{errors.footer_logo}</div>
                              )}
                            </FormGroup>
                          </Col>

                          {/* Letterhead Header/Footer */}
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="header_footer_letterhead"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Letterhead Header/Footer <span className="text-danger">*</span>
                              </Label>
                              <Dropzone
                                onDrop={(acceptedFiles) =>
                                  handleAcceptedFiles(
                                    "header_footer_letterhead",
                                    acceptedFiles,
                                    setFieldValue
                                  )
                                }
                                accept="image/*,application/pdf"
                              >
                                {({ getRootProps, getInputProps }) => (
                                  <div
                                    className="dropzone"
                                    {...getRootProps()}
                                    style={{
                                      borderRadius: "8px",
                                      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                      padding: "10px",
                                      textAlign: "center",
                                      cursor: "pointer",
                                    }}
                                  >
                                    <input {...getInputProps()} />
                                    <div className="mb-3">
                                      <i className="display-4 text-muted bx bxs-cloud-upload" />
                                    </div>
                                    <h4>Drop file here or click to upload.</h4>
                                  </div>
                                )}
                              </Dropzone>
                              {selectedFiles?.header_footer_letterhead?.length > 0 && (
                                <div className="mt-2">
                                  {selectedFiles.header_footer_letterhead.map(
                                    (file, index) => (
                                      <div
                                        key={index}
                                        style={{
                                          position: "relative",
                                          display: "inline-block",
                                          marginRight: "10px",
                                        }}
                                      >
                                        {file.type && file.type.startsWith("image/") ? (
                                          <img
                                            src={file.preview}
                                            alt={`Letterhead ${index + 1}`}
                                            style={{
                                              width: "100px",
                                              height: "auto",
                                              marginRight: "10px",
                                            }}
                                          />
                                        ) : (
                                          <div
                                            style={{
                                              width: "100px",
                                              height: "100px",
                                              display: "flex",
                                              alignItems: "center",
                                              justifyContent: "center",
                                              background: "#f1f1f1",
                                              borderRadius: "8px",
                                            }}
                                          >
                                            <span>PDF</span>
                                          </div>
                                        )}
                                        <AiOutlineCloseCircle
                                          style={{
                                            position: "absolute",
                                            top: "0",
                                            right: "0",
                                            cursor: "pointer",
                                            fontSize: "20px",
                                            color: "red",
                                          }}
                                          onClick={() =>
                                            removeFile(
                                              "header_footer_letterhead",
                                              index,
                                              setFieldValue
                                            )
                                          }
                                        />
                                      </div>
                                    )
                                  )}
                                </div>
                              )}
                              {errors.header_footer_letterhead && touched.header_footer_letterhead && (
                                <div className="invalid-feedback d-block">{errors.header_footer_letterhead}</div>
                              )}
                            </FormGroup>
                          </Col>

                          {/* Watermark */}
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="watermark_letterhead"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Watermark <span className="text-danger">*</span>
                              </Label>
                              <Dropzone
                                onDrop={(acceptedFiles) =>
                                  handleAcceptedFiles(
                                    "watermark_letterhead",
                                    acceptedFiles,
                                    setFieldValue
                                  )
                                }
                                accept="image/*"
                              >
                                {({ getRootProps, getInputProps }) => (
                                  <div
                                    className="dropzone"
                                    {...getRootProps()}
                                    style={{
                                      borderRadius: "8px",
                                      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                      padding: "10px",
                                      textAlign: "center",
                                      cursor: "pointer",
                                    }}
                                  >
                                    <input {...getInputProps()} />
                                    <div className="mb-3">
                                      <i className="display-4 text-muted bx bxs-cloud-upload" />
                                    </div>
                                    <h4>Drop image here or click to upload.</h4>
                                  </div>
                                )}
                              </Dropzone>
                              {selectedFiles?.watermark_letterhead?.length > 0 && (
                                <div className="mt-2">
                                  {selectedFiles.watermark_letterhead.map((file, index) => (
                                    <div
                                      key={index}
                                      style={{
                                        position: "relative",
                                        display: "inline-block",
                                        marginRight: "10px",
                                      }}
                                    >
                                      <img
                                        src={file.preview}
                                        alt={`Watermark ${index + 1}`}
                                        style={{
                                          width: "100px",
                                          height: "auto",
                                          marginRight: "10px",
                                        }}
                                      />
                                      <AiOutlineCloseCircle
                                        style={{
                                          position: "absolute",
                                          top: "0",
                                          right: "0",
                                          cursor: "pointer",
                                          fontSize: "20px",
                                          color: "red",
                                        }}
                                        onClick={() =>
                                          removeFile(
                                            "watermark_letterhead",
                                            index,
                                            setFieldValue
                                          )
                                        }
                                      />
                                    </div>
                                  ))}
                                </div>
                              )}
                              {errors.watermark_letterhead && touched.watermark_letterhead && (
                                <div className="invalid-feedback d-block">{errors.watermark_letterhead}</div>
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
                              {isSubmitting ? "Submitting..." : "Submit"}
                            </Button>
                          </Col>
                        </Row>
                      </Form>
                    )}
                  </Formik>
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
        .dropzone {
          border: 2px dashed #007bff;
          background: #f9f9f9;
        }
        .dropzone:hover {
          background: #f1f1f1;
        }
      `}</style>
    </React.Fragment>
  );
};

export default BrandInfo;