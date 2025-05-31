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
import { useLocation, useNavigate } from "react-router-dom";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useBusiness } from "../../../context/BusinessContext";
import Swal from "sweetalert2";
import { getDepartmentDetails, submitStoreInfo, updateJsonStoreInfo, updateStoreInfo } from "../../../ApiService/CreateStore/CreateStore";
import Select from "react-select";

// Validation schema using Yup
const validationSchema = Yup.object({
  businessType: Yup.string()
    .required("Type of Business is required")
    .oneOf(
      ["Retail", "Wholesale", "Manufacturing", "Services"],
      "Invalid Business Type"
    ),
  gstNo: Yup.string()
    .required("GST No. is required")
    .matches(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      "Invalid GST No. format (e.g., 27AABCU9603R1ZM)"
    ),
  fssaiLicenceNo: Yup.string()
    .required("FSSAI Licence No. is required")
    .matches(/^[0-9]{14}$/, "FSSAI Licence No. must be a 14-digit number"),
  shopActRegNo: Yup.string()
    .required("Shop Act Registration No. is required")
    .matches(
      /^[A-Z]{2}[0-9]{7,10}$/,
      "Invalid Shop Act Registration No. format (e.g., MH123456789)"
    ),
  departments: Yup.array()
    .min(1, "Select at least one department")
    .required("Departments are required"),
});

const StoreRegistrationForm = () => {
  const navigate = useNavigate();
  const {
          state,
          updatePage3Data,
          setIsEdit,
          resetBusinessData
      } = useBusiness();
  const [departments, setDepartments] = useState([]);
  const location = useLocation();
  const { id,store} = location.state || {};
  console.log(store);
  
  
  // Add this useEffect to fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await getDepartmentDetails();
        if (response.status === 200) {
          const formattedDepartments = response.data.map(dept => ({
            value: dept.department_id,
            label: dept.department_name
          }));
          setDepartments(formattedDepartments);
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
    fetchDepartments();
  }, []);

  const initialValues = {
    businessType: store?.store_regd_details?.business_type || "",
    gstNo: store?.store_regd_details?.gst_no || "",
    fssaiLicenceNo: store?.store_regd_details?.fssai_licence_no || "",
    shopActRegNo: store?.store_regd_details?.shop_act_reg_no || "",
    departments: store?.departments || []
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const data ={
        store_regd_details:{
          business_type: values.businessType,
          gst_no: values.gstNo,
          fssai_licence_no: values.fssaiLicenceNo,
          shop_act_reg_no: values.shopActRegNo
        },
        departments: values.departments.map(dept => dept.value)
      }
      let response;
      // Send all data to API
      if(store){
        const id = store.business_store_id;
        response = await updateJsonStoreInfo(id,data);
      }else{
        response = await updateJsonStoreInfo(id,data);
      }

      if (response){
        // Show success message
      Swal.fire({
        title: "Success!",
        text: state.isEdit 
          ? "Store Registration details updated successfully!"
          : "Store Registration details submitted successfully!",
        icon: "success",
        confirmButtonColor: "#556ee6",
      });

      navigate("/store-details-list"); // Adjust the route as needed
      }
      // Reset form data if not in edit mode
      if (!state.isEdit) {
        resetBusinessData();
      }

      // Navigate to next page or dashboard

    } catch (error) {
      console.error("Error submitting Store Registration details:", error);
      Swal.fire({
        title: "Error!",
        text: "Something went wrong. Please try again later.",
        icon: "error",
        confirmButtonColor: "#556ee6",
      });
    } finally {
      setSubmitting(false);
    }
    setIsEdit(false);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Company"
            breadcrumbItem="Add Store Registration"
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
                      Add Store Registration
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
                    onSubmit={handleSubmit}
                  >
                    {({ values, setFieldValue, isSubmitting, errors, touched, handleSubmit }) => (
                      <Form onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit(e);
                      }}>
                        <Row className="g-4">
                          {/* Type of Business */}
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="businessType"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Type of Business
                              </Label>
                              <Field
                                as={Input}
                                type="select"
                                name="businessType"
                                id="businessType"
                                className={`form-control ${
                                  errors.businessType && touched.businessType
                                    ? "is-invalid"
                                    : ""
                                }`}
                                style={{
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  padding: "10px",
                                }}
                              >
                                <option value="">Select Business Type</option>
                                <option value="Retail">Retail</option>
                                <option value="Wholesale">Wholesale</option>
                                <option value="Manufacturing">
                                  Manufacturing
                                </option>
                                <option value="Services">Services</option>
                              </Field>
                              <ErrorMessage
                                name="businessType"
                                component="div"
                                className="invalid-feedback"
                              />
                            </FormGroup>
                          </Col>

                          {/* GST No. */}
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="gstNo"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                GST No.
                              </Label>
                              <Field
                                as={Input}
                                type="text"
                                name="gstNo"
                                id="gstNo"
                                placeholder="Enter GST No. (e.g., 27AABCU9603R1ZM)"
                                className={`form-control ${
                                  errors.gstNo && touched.gstNo
                                    ? "is-invalid"
                                    : ""
                                }`}
                                style={{
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  padding: "10px",
                                }}
                              />
                              <ErrorMessage
                                name="gstNo"
                                component="div"
                                className="invalid-feedback"
                              />
                            </FormGroup>
                          </Col>

                          {/* FSSAI Licence No. */}
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="fssaiLicenceNo"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                FSSAI Licence No.
                              </Label>
                              <Field
                                as={Input}
                                type="text"
                                name="fssaiLicenceNo"
                                id="fssaiLicenceNo"
                                placeholder="Enter 14-digit FSSAI Licence No."
                                className={`form-control ${
                                  errors.fssaiLicenceNo && touched.fssaiLicenceNo
                                    ? "is-invalid"
                                    : ""
                                }`}
                                style={{
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  padding: "10px",
                                }}
                              />
                              <ErrorMessage
                                name="fssaiLicenceNo"
                                component="div"
                                className="invalid-feedback"
                              />
                            </FormGroup>
                          </Col>

                          {/* Shop Act Registration No. */}
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="shopActRegNo"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Shop Act Registration No.
                              </Label>
                              <Field
                                as={Input}
                                type="text"
                                name="shopActRegNo"
                                id="shopActRegNo"
                                placeholder="Enter Shop Act Reg. No. (e.g., MH123456789)"
                                className={`form-control ${
                                  errors.shopActRegNo && touched.shopActRegNo
                                    ? "is-invalid"
                                    : ""
                                }`}
                                style={{
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  padding: "10px",
                                }}
                              />
                              <ErrorMessage
                                name="shopActRegNo"
                                component="div"
                                className="invalid-feedback"
                              />
                            </FormGroup>
                          </Col>

                          {/* Departments */}
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="departments"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Departments
                              </Label>
                              <Select
                                isMulti
                                name="departments"
                                options={departments}
                                className={`${errors.departments && touched.departments ? "is-invalid" : ""}`}
                                value={values.departments}
                                onChange={(selectedOptions) => {
                                  setFieldValue("departments", selectedOptions);
                                }}
                                styles={{
                                  control: (base) => ({
                                    ...base,
                                    borderRadius: "8px",
                                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                    padding: "2px",
                                  }),
                                }}
                              />
                              <ErrorMessage
                                name="departments"
                                component="div"
                                className="invalid-feedback"
                              />
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
      `}</style>
    </React.Fragment>
  );
};

export default StoreRegistrationForm;