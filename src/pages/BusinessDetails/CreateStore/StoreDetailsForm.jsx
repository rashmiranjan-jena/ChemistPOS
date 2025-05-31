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
import Breadcrumbs from "../../../components/Common/Breadcrumb"; // Adjust path as needed
import { useLocation, useNavigate } from "react-router-dom";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { useBusiness } from "../../../context/BusinessContext";
import { submitStoreInfo, updateStoreInfo } from "../../../ApiService/CreateStore/CreateStore";

// Validation schema using Yup
const validationSchema = Yup.object({
  store_name: Yup.string()
    .required("Store Name is required")
    .min(2, "Store Name must be at least 2 characters"),
  alias: Yup.string()
    .required("Alias is required")
    .min(1, "Alias must be at least 1 character")
    .max(10, "Alias cannot exceed 10 characters"),
  address1: Yup.string().required("Address 1 is required"),
  address2: Yup.string(),
  city: Yup.string().required("City is required"),
  district: Yup.string().required("District is required"),
  state: Yup.string().required("State is required"),
  country: Yup.string().required("Country is required"),
  pinCode: Yup.string()
    .required("PIN/ZIP Code is required")
    .matches(/^[0-9]{5,10}$/, "PIN/ZIP Code must be a 5-10 digit number"),
});

const StoreDetailsForm = () => {
  const navigate = useNavigate();
  const {
    state
} = useBusiness();
const location = useLocation(); 
const { store } = location.state || {};
console.log(store,state);


  const initialValues = {
    store_name: store?.store_name ||"",
    alias: store?.alias ||"",
    address1: store?.address_details?.address1 ||"",
    address2: store?.address_details?.address2 ||"",
    city: store?.address_details?.city ||"",
    district: store?.address_details?.district ||"",
    state: store?.address_details?.state ||"",
    country: store?.address_details?.country ||"",
    pinCode: store?.address_details?.pincode ||"",
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    console.log('call',state);
    try {
      if (state.isEdit) {
        // For edit mode
        
        const data={
          store_name: values.store_name,
          alias: values.alias,
          address_details:{
            address1: values.address1,
            address2: values.address2,
            city: values.city,
            district: values.district,
            state: values.state,
            country: values.country,
            pincode: values.pinCode,
          },
          iframe_location: "values.iframe_location",
        }
        const id = store?.business_store_id;
        const response = await updateStoreInfo(id,data); // Add your update API
        if (response) {
          Swal.fire({
            title: "Success",
            text: "Store details updated successfully!",
            icon: "success",
            confirmButtonText: "OK",
          })
        }
        navigate("/store-details-list")
      } else {
        const data = {
          store_name: values.store_name,
          alias: values.alias,
          address_details:{
            address1: values.address1,
            address2: values.address2,
            city: values.city,
            district: values.district,
            state: values.state,
            country: values.country,
            pincode: values.pinCode,
          },
          iframe_location: "values.iframe_location",
        }
        // updatePage1Data(values);
        const response = await submitStoreInfo(data)
        console.log(response,"response");
        
        if (response) {
          const storeId = response.business_store_id;
          navigate("/contactinfo",{state:{storeId}});
        }
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.error || "Failed to submit store details",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Company" breadcrumbItem="Add Store Details" />
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
                      Add Store Details
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
                    {({ values, isSubmitting, errors, touched, handleSubmit }) => (
                      <Form onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit(e);
                      }}>
                        <Row className="g-4">
                          {/* Store Name */}
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="store_name"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Store Name
                              </Label>
                              <Field
                                as={Input}
                                type="text"
                                name="store_name"
                                id="store_name"
                                placeholder="Enter store name"
                                className={`form-control ${
                                  errors.store_name && touched.store_name
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
                                name="store_name"
                                component="div"
                                className="invalid-feedback"
                              />
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
                              <Field
                                as={Input}
                                type="text"
                                name="alias"
                                id="alias"
                                placeholder="Enter alias"
                                className={`form-control ${
                                  errors.alias && touched.alias
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
                                name="alias"
                                component="div"
                                className="invalid-feedback"
                              />
                            </FormGroup>
                          </Col>

                          {/* Address 1 */}
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="address1"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Address 1
                              </Label>
                              <Field
                                as={Input}
                                type="text"
                                name="address1"
                                id="address1"
                                placeholder="Enter address line 1"
                                className={`form-control ${
                                  errors.address1 && touched.address1
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
                                name="address1"
                                component="div"
                                className="invalid-feedback"
                              />
                            </FormGroup>
                          </Col>

                          {/* Address 2 */}
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="address2"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Address 2 (Optional)
                              </Label>
                              <Field
                                as={Input}
                                type="text"
                                name="address2"
                                id="address2"
                                placeholder="Enter address line 2"
                                className={`form-control ${
                                  errors.address2 && touched.address2
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
                                name="address2"
                                component="div"
                                className="invalid-feedback"
                              />
                            </FormGroup>
                          </Col>

                          {/* City */}
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="city"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                City
                              </Label>
                              <Field
                                as={Input}
                                type="text"
                                name="city"
                                id="city"
                                placeholder="Enter city"
                                className={`form-control ${
                                  errors.city && touched.city
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
                                name="city"
                                component="div"
                                className="invalid-feedback"
                              />
                            </FormGroup>
                          </Col>

                          {/* District */}
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="district"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                District
                              </Label>
                              <Field
                                as={Input}
                                type="text"
                                name="district"
                                id="district"
                                placeholder="Enter district"
                                className={`form-control ${
                                  errors.district && touched.district
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
                                name="district"
                                component="div"
                                className="invalid-feedback"
                              />
                            </FormGroup>
                          </Col>

                          {/* State */}
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="state"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                State
                              </Label>
                              <Field
                                as={Input}
                                type="text"
                                name="state"
                                id="state"
                                placeholder="Enter state"
                                className={`form-control ${
                                  errors.state && touched.state
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
                                name="state"
                                component="div"
                                className="invalid-feedback"
                              />
                            </FormGroup>
                          </Col>

                          {/* Country */}
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="country"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Country
                              </Label>
                              <Field
                                as={Input}
                                type="text"
                                name="country"
                                id="country"
                                placeholder="Enter country"
                                className={`form-control ${
                                  errors.country && touched.country
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
                                name="country"
                                component="div"
                                className="invalid-feedback"
                              />
                            </FormGroup>
                          </Col>

                          {/* PIN/ZIP Code */}
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="pinCode"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                PIN/ZIP Code
                              </Label>
                              <Field
                                as={Input}
                                type="text"
                                name="pinCode"
                                id="pinCode"
                                placeholder="Enter PIN/ZIP code"
                                className={`form-control ${
                                  errors.pinCode && touched.pinCode
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
                                name="pinCode"
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

export default StoreDetailsForm;