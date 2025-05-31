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
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { postBusinessRegistrationDetails, updateBusinessRegistrationDetails } from "../../ApiService/BusinessOverview/BusinessRegistrationList";

// Validation schema using Yup
const validationSchema = Yup.object({
  type_of_business: Yup.string()
    .required("Type of Business is required")
    .oneOf(
      ["Proprietorship", "Partnership", "Pvt Ltd", "LLP", "Other"],
      "Invalid Business Type"
    ),
  gst_tax_number: Yup.string()
    .required("GST No. is required")
  

});

const BusinessRegistrationForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const registration = location.state?.registration;
  console.log(registration);
  

  const formik = useFormik({
    initialValues: {
      alias: registration?.alias || "",
      type_of_business: registration?.type_of_business || "",
      gst_tax_number: registration?.gst_tax_number || "", 
      fssai_licence_no: registration?.fssai_licence_no || "",
      shop_act_registration_no: registration?.shop_act_registration_no || "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        let response;
        if (registration) {
          response = await updateBusinessRegistrationDetails(registration.business_info_id, values);
          if (response.status !== 200) {
            throw new Error("Network response was not ok");
          }
          Swal.fire({
            title: "Success",
            text: "Business Registration Updated Successfully",
            icon: "success",
            confirmButtonText: "OK",
          });
        } else {
          response = await postBusinessRegistrationDetails(values);
          if (response.status !== 201) {
            throw new Error("Network response was not ok");
          }
          Swal.fire({
            title: "Success",
            text: "Registration Successfully",
            icon: "success",
            confirmButtonText: "OK",
          });
        }
        navigate("/business-registration-list");
      } catch (error) {
        console.error("Error:", error.response.data.error);
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
            title="Business Management"
            breadcrumbItem="Add Business Registration"
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
                      Add Business Registration
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
                      {/* Type of Business */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="type_of_business"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Type of Business <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="select"
                            name="type_of_business"
                            id="type_of_business"
                            {...formik.getFieldProps('type_of_business')}
                            className={`form-control ${formik.errors.type_of_business && formik.touched.type_of_business ? "is-invalid" : ""}`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          >
                            <option value="">Select Business Type</option>
                            <option value="Proprietorship">Proprietorship</option>
                            <option value="Partnership">Partnership</option>
                            <option value="Pvt Ltd">Pvt Ltd</option>
                            <option value="LLP">LLP</option>
                            <option value="Other">Other</option>
                          </Input>
                          {formik.errors.type_of_business && formik.touched.type_of_business && (
                            <div className="invalid-feedback">
                              {formik.errors.type_of_business}
                            </div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* GST No. */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="gst_tax_number"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            GST No. <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            name="gst_tax_number"
                            id="gst_tax_number"
                            placeholder="Enter GST Number (e.g., 27AABCU9603R1ZM)"
                            {...formik.getFieldProps('gst_tax_number')}
                            className={`form-control ${formik.errors.gst_tax_number && formik.touched.gst_tax_number ? "is-invalid" : ""}`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.errors.gst_tax_number && formik.touched.gst_tax_number && (
                            <div className="invalid-feedback">
                              {formik.errors.gst_tax_number}
                            </div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* Alias */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="alias"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Alias
                          </Label>
                          <Input
                            type="text"
                            name="alias"
                            id="alias"
                            placeholder="Enter Alias"
                            {...formik.getFieldProps('alias')}
                            className={`form-control ${formik.errors.alias && formik.touched.alias ? "is-invalid" : ""}`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.errors.alias && formik.touched.alias && (
                            <div className="invalid-feedback">
                              {formik.errors.alias}
                            </div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* FSSAI Licence No. */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="fssai_licence_no"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            FSSAI Licence No.
                          </Label>
                          <Input
                            type="text"
                            name="fssai_licence_no"
                            id="fssai_licence_no"
                            placeholder="Enter 14-digit FSSAI Licence No."
                            {...formik.getFieldProps('fssai_licence_no')}
                            className={`form-control ${formik.errors.fssai_licence_no && formik.touched.fssai_licence_no ? "is-invalid" : ""}`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                         
                        </FormGroup>
                      </Col>

                      {/* Shop Act Registration No. */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="shop_act_registration_no"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Shop Act Registration No. 
                          </Label>
                          <Input
                            type="text"
                            name="shop_act_registration_no"
                            id="shop_act_registration_no"
                            placeholder="Enter Shop Act Reg. No. (e.g., MH123456789)"
                            {...formik.getFieldProps('shop_act_registration_no')}
                            className={`form-control ${formik.errors.shop_act_registration_no && formik.touched.shop_act_registration_no ? "is-invalid" : ""}`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          
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
                            : registration
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

export default BusinessRegistrationForm;