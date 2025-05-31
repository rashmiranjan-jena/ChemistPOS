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
import Breadcrumbs from "../../components/Common/Breadcrumb"; 
import { useLocation, useNavigate } from "react-router-dom";
import { editDrugLicenceData, postDrugLicenceDetails } from "../../ApiService/BusinessOverview/DrugLicence";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import { useBusiness } from "../../context/BusinessContext";
import { updateStoreInfo } from "../../ApiService/CreateStore/CreateStore";

// Validation function
const validate = (values) => {
  const errors = {};
  if (!values.licence_issued_by) {
    errors.licence_issued_by = "Licence Issued By is required";
  } else if (values.licence_issued_by.length < 2 || values.licence_issued_by.length > 100) {
    errors.licence_issued_by = "Must be between 2 and 100 characters";
  }
  if (!values.type_of_licence) {
    errors.type_of_licence = "Type of Licence is required";
  } else if (!["Retail", "Wholesale", "Manufacturing", "Import"].includes(values.type_of_licence)) {
    errors.type_of_licence = "Invalid Licence Type";
  }
  if (!values.licence_no) {
    errors.licence_no = "Licence Number is required";
  } else if (!/^[A-Z0-9-]+$/.test(values.licence_no) || values.licence_no.length < 5 || values.licence_no.length > 50) {
    errors.licence_no = "Licence Number must be alphanumeric with dashes allowed and between 5 and 50 characters";
  }
  if (!values.licence_file) {
    errors.licence_file = "Licence file is required";
  }
  return errors;
};

const StoreDrugLicenceForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { licence,Id,store} = location.state || {};
  // const storeId = location.state.Id;
  const licenceData = licence || {};
  
  const {
        state,
        setIsEdit,
        resetBusinessData
    } = useBusiness();

  const formik = useFormik({
    initialValues: {
      licence_issued_by: licenceData?.licence_issued_by || store?.licence_issued_by|| "",
      type_of_licence: licenceData?.type_of_licence || store?.type_of_licence || "",
      licence_no: licenceData?.licence_no || store?.licence_no || "",
      licence_file: null,
    },
    validate,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        console.log("called");
        
        const formData = new FormData();
        formData.append('licence_issued_by', values.licence_issued_by);
        formData.append('type_of_licence', values.type_of_licence);
        formData.append('licence_no', values.licence_no);
        if (values.licence_file) {
          formData.append('licence_file', values.licence_file);
        }

        let response;
         if(store){
          const Id = store.business_store_id;
          response = await updateStoreInfo(Id, formData);
         }else{
          response = await updateStoreInfo(Id, formData);
         }
          if (!response) {
            throw new Error("Network response was not ok");
          }
          Swal.fire({
            title: "Success",
            text: "Licence updated successfully",
            icon: "success",
            confirmButtonText: "OK",
          });
          setSubmitting(false);
          const id = response.business_store_id;
          console.log("id", id);
          if(store){
            navigate("/store-details-list");
          }
          else{
            navigate("/store-registration-form", { state: { id } });
          }
        
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Licence Management" breadcrumbItem="Add Drug Licence Details" />
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
                      Add Drug Licence Details
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
                      {/* Licence Issued By */}
                      <Col md="6">
                        <FormGroup>
                          <Label for="licence_issued_by" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                            Licence Issued By
                          </Label>
                          <Input
                            type="text"
                            name="licence_issued_by"
                            id="licence_issued_by"
                            placeholder="Enter issuing authority"
                            {...formik.getFieldProps('licence_issued_by')}
                            className={`form-control ${formik.errors.licence_issued_by && formik.touched.licence_issued_by ? "is-invalid" : ""}`}
                            style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                          />
                          {formik.errors.licence_issued_by && formik.touched.licence_issued_by && (
                            <div className="invalid-feedback">
                              {formik.errors.licence_issued_by}
                            </div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* Type of Licence */}
                      <Col md="6">
                        <FormGroup>
                          <Label for="type_of_licence" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                            Type of Licence
                          </Label>
                          <Input
                            type="select"
                            name="type_of_licence"
                            id="type_of_licence"
                            {...formik.getFieldProps('type_of_licence')}
                            className={`form-control ${formik.errors.type_of_licence && formik.touched.type_of_licence ? "is-invalid" : ""}`}
                            style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                          >
                            <option value="">Select Licence Type</option>
                            <option value="Retail">Retail</option>
                            <option value="Wholesale">Wholesale</option>
                            <option value="Manufacturing">Manufacturing</option>
                            <option value="Import">Import</option>
                          </Input>
                          {formik.errors.type_of_licence && formik.touched.type_of_licence && (
                            <div className="invalid-feedback">
                              {formik.errors.type_of_licence}
                            </div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* Licence No */}
                      <Col md="6">
                        <FormGroup>
                          <Label for="licence_no" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                            Licence No.
                          </Label>
                          <Input
                            type="text"
                            name="licence_no"
                            id="licence_no"
                            placeholder="Enter licence number"
                            {...formik.getFieldProps('licence_no')}
                            className={`form-control ${formik.errors.licence_no && formik.touched.licence_no ? "is-invalid" : ""}`}
                            style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                          />
                          {formik.errors.licence_no && formik.touched.licence_no && (
                            <div className="invalid-feedback">
                              {formik.errors.licence_no}
                            </div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* Licence File */}
                      <Col md="6">
                        <FormGroup>
                          <Label for="licence_file" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                            Licence File
                          </Label>
                          <Input
                            type="file"
                            name="licence_file"
                            id="licence_file"
                            onChange={(event) => {
                              formik.setFieldValue("licence_file", event.currentTarget.files[0]);
                            }}
                            className={`form-control ${formik.errors.licence_file && formik.touched.licence_file ? "is-invalid" : ""}`}
                            accept=".pdf,.jpg,.jpeg,.png"
                            style={{ 
                              borderRadius: "8px", 
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)", 
                              padding: "10px" 
                            }}
                          />
                          {formik.errors.licence_file && formik.touched.licence_file && (
                            <div className="invalid-feedback">
                              {formik.errors.licence_file}
                            </div>
                          )}
                          <small className="text-muted">
                            Supported formats: PDF, JPG, PNG (max 5MB)
                          </small>
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
                            : licenceData
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

export default StoreDrugLicenceForm;