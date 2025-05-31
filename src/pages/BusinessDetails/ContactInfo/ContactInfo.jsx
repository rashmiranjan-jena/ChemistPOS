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
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { useBusiness } from "../../../context/BusinessContext";
import { updateJsonStoreInfo, updateStoreInfo } from "../../../ApiService/CreateStore/CreateStore";

// Validation schema using Yup
const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  phone_no: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .required("Phone No. is required"),
  email_id: Yup.string()
    .email("Invalid email format")
    .required("Email ID is required"),
  city: Yup.string().required("City is required"),
  district: Yup.string().required("District is required"),
  state: Yup.string().required("State is required"),
  country: Yup.string().required("Country is required"),
  pin_code: Yup.string()
    .matches(/^[0-9]{6}$/, "PIN/ZIP Code must be 6 digits")
    .required("PIN/ZIP Code is required"),
  address_1: Yup.string().required("Address 1 is required"),
  address_2: Yup.string(),
  landmark: Yup.string(),
  phone_no_2: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone No. 2 must be 10 digits")
    .nullable(),
  website: Yup.string()
    .url("Invalid website URL")
    .nullable(),
});

const ContactInfo = () => {
  document.title = "Contact Info Registration";
  const navigate = useNavigate();
  const location = useLocation();
  const { id ,storeId,store} = location.state || {};
  const [initialData, setInitialData] = useState(null);
  // console.log(store);
  
   const {
      state,
      updatePage2Data,
      setIsEdit,
      resetBusinessData
  } = useBusiness();

  useEffect(() => {
    if (id) {
      // Simulate fetching data for editing (replace with actual API call if needed)
      const mockData = {
        name: "John Doe",
        phone_no: "9876543210",
        email_id: "john.doe@example.com",
        city: "Mumbai",
        district: "Mumbai",
        state: "Maharashtra",
        country: "India",
        pin_code: "400001",
        address_1: "123 Main Street",
        address_2: "Apt 4B",
        landmark: "Near Central Park",
        phone_no_2: "9123456789",
        website: "https://johndoe.com",
      };
      setInitialData(mockData);
    }
  }, [id]);

  const initialValues = {
    name: initialData?.name || store?.contact_details.name || "",
    phone_no: initialData?.phone_no || store?.contact_details.phone_no || "",
    email_id: initialData?.email_id || store?.contact_details.email_id || "",
    city: initialData?.city || store?.contact_details.city || "",
    district: initialData?.district || store?.contact_details.district || "",
    state: initialData?.state || store?.contact_details.state || "",
    country: initialData?.country || store?.contact_details.country || "",
    pin_code: initialData?.pin_code || store?.contact_details.pin_code || "",
    address_1: initialData?.address_1 || store?.contact_details.address_1 || "",
    address_2: initialData?.address_2 || store?.contact_details.address_2 || "",
    landmark: initialData?.landmark || store?.contact_details.landmark || "",
    phone_no_2: initialData?.phone_no_2 || store?.contact_details.phone_no_2 || "",
    website: initialData?.website || store?.contact_details.website || "",
  };

  const handleSubmit = async(values, { setSubmitting }) => {
    console.log("Form Values:", values);
      if (state.isEdit) {
        const data = {
          contact_details:{
            name: values.name,
            phone_no: values.phone_no,
            email_id: values.email_id,
            city: values.city,
            district: values.district,
            state: values.state,
            country: values.country,
            pin_code: values.pin_code,
            address_1: values.address_1,
            address_2: values.address_2,
            landmark: values.landmark,
            phone_no_2: values.phone_no_2,
            website: values.website,
          }
        }
       const storeId = store.business_store_id;
        const response = await updateJsonStoreInfo(storeId,data)
        if(response){
          setSubmitting(false);
          const Id = response.business_store_id;
          console.log("Store ID:",Id);
            navigate("/store-details-list");
          
        Swal.fire({
          icon: "success",
          title: "Updated Successfully!",
          text: "Your Contact Info  have been updated successfully.",
          confirmButtonText: "OK",
        });}
      } else {
        const data = {
          contact_details:{
            name: values.name,
            phone_no: values.phone_no,
            email_id: values.email_id,
            city: values.city,
            district: values.district,
            state: values.state,
            country: values.country,
            pin_code: values.pin_code,
            address_1: values.address_1,
            address_2: values.address_2,
            landmark: values.landmark,
            phone_no_2: values.phone_no_2,
            website: values.website,
          }
        }
        const response = await updateJsonStoreInfo(storeId,data)
        if(response){
          setSubmitting(false);
          const Id = response.business_store_id;
          console.log("Store ID:",Id);
         
            navigate("/store-drug-licence-form",{state: {Id}});
        }
  }};

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Contact Info  Registration"
            breadcrumbItem="Add Contact Info "
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
                      {id ? "Edit Contact Info Documents" : "Add Contact Info"}
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
                          {/* Name */}
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="name"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Name
                              </Label>
                              <Field
                                as={Input}
                                type="text"
                                name="name"
                                id="name"
                                placeholder="Enter Name"
                                className={`form-control ${
                                  errors.name && touched.name ? "is-invalid" : ""
                                }`}
                                style={{
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  padding: "10px",
                                }}
                              />
                              <ErrorMessage
                                name="name"
                                component="div"
                                className="invalid-feedback"
                              />
                            </FormGroup>
                          </Col>

                          {/* Phone No. */}
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="phone_no"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Phone No.
                              </Label>
                              <Field
                                as={Input}
                                type="number"
                                name="phone_no"
                                id="phone_no"
                                placeholder="Enter Phone No."
                                className={`form-control ${
                                  errors.phone_no && touched.phone_no ? "is-invalid" : ""
                                }`}
                                style={{
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  padding: "10px",
                                }}
                              />
                              <ErrorMessage
                                name="phone_no"
                                component="div"
                                className="invalid-feedback"
                              />
                            </FormGroup>
                          </Col>

                          {/* Email ID */}
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="email_id"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Email ID
                              </Label>
                              <Field
                                as={Input}
                                type="email"
                                name="email_id"
                                id="email_id"
                                placeholder="Enter Email ID"
                                className={`form-control ${
                                  errors.email_id && touched.email_id ? "is-invalid" : ""
                                }`}
                                style={{
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  padding: "10px",
                                }}
                              />
                              <ErrorMessage
                                name="email_id"
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
                                placeholder="Enter City"
                                className={`form-control ${
                                  errors.city && touched.city ? "is-invalid" : ""
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
                                placeholder="Enter District"
                                className={`form-control ${
                                  errors.district && touched.district ? "is-invalid" : ""
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
                                placeholder="Enter State"
                                className={`form-control ${
                                  errors.state && touched.state ? "is-invalid" : ""
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
                                placeholder="Enter Country"
                                className={`form-control ${
                                  errors.country && touched.country ? "is-invalid" : ""
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
                                for="pin_code"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                PIN/ZIP Code
                              </Label>
                              <Field
                                as={Input}
                                type="number"
                                name="pin_code"
                                id="pin_code"
                                placeholder="Enter PIN/ZIP Code"
                                className={`form-control ${
                                  errors.pin_code && touched.pin_code ? "is-invalid" : ""
                                }`}
                                style={{
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  padding: "10px",
                                }}
                              />
                              <ErrorMessage
                                name="pin_code"
                                component="div"
                                className="invalid-feedback"
                              />
                            </FormGroup>
                          </Col>

                          {/* Address 1 */}
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="address_1"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Address 1
                              </Label>
                              <Field
                                as={Input}
                                type="text"
                                name="address_1"
                                id="address_1"
                                placeholder="Enter Address 1"
                                className={`form-control ${
                                  errors.address_1 && touched.address_1 ? "is-invalid" : ""
                                }`}
                                style={{
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  padding: "10px",
                                }}
                              />
                              <ErrorMessage
                                name="address_1"
                                component="div"
                                className="invalid-feedback"
                              />
                            </FormGroup>
                          </Col>

                          {/* Address 2 */}
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="address_2"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Address 2 (Optional)
                              </Label>
                              <Field
                                as={Input}
                                type="text"
                                name="address_2"
                                id="address_2"
                                placeholder="Enter Address 2"
                                className={`form-control ${
                                  errors.address_2 && touched.address_2 ? "is-invalid" : ""
                                }`}
                                style={{
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  padding: "10px",
                                }}
                              />
                              <ErrorMessage
                                name="address_2"
                                component="div"
                                className="invalid-feedback"
                              />
                            </FormGroup>
                          </Col>

                          {/* Landmark */}
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="landmark"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Landmark (Optional)
                              </Label>
                              <Field
                                as={Input}
                                type="text"
                                name="landmark"
                                id="landmark"
                                placeholder="Enter Landmark"
                                className={`form-control ${
                                  errors.landmark && touched.landmark ? "is-invalid" : ""
                                }`}
                                style={{
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  padding: "10px",
                                }}
                              />
                              <ErrorMessage
                                name="landmark"
                                component="div"
                                className="invalid-feedback"
                              />
                            </FormGroup>
                          </Col>

                          {/* Phone No. 2 */}
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="phone_no_2"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Phone No. 2 (Optional)
                              </Label>
                              <Field
                                as={Input}
                                type="number"
                                name="phone_no_2"
                                id="phone_no_2"
                                placeholder="Enter Phone No. 2"
                                className={`form-control ${
                                  errors.phone_no_2 && touched.phone_no_2 ? "is-invalid" : ""
                                }`}
                                style={{
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  padding: "10px",
                                }}
                              />
                              <ErrorMessage
                                name="phone_no_2"
                                component="div"
                                className="invalid-feedback"
                              />
                            </FormGroup>
                          </Col>

                          {/* Website */}
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="website"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Website (Optional)
                              </Label>
                              <Field
                                as={Input}
                                type="text"
                                name="website"
                                id="website"
                                placeholder="Enter Website"
                                className={`form-control ${
                                  errors.website && touched.website ? "is-invalid" : ""
                                }`}
                                style={{
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  padding: "10px",
                                }}
                              />
                              <ErrorMessage
                                name="website"
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
                              {isSubmitting
                                ? "Submitting..."
                                : id
                                ? "Update"
                                : "Submit"}
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

export default ContactInfo;