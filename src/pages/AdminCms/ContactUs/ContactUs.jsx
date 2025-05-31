import React,{useState,useEffect} from "react";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  FormFeedback,
} from "reactstrap";
import * as yup from "yup";
import { useFormik } from "formik";
import { submitContactus,getContactusById,updateContactus } from "../../../ApiService/ContactUs/ContactUs";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import Swal from "sweetalert2";
import { useNavigate,useLocation } from "react-router-dom";

const ContactUs = () => {
  document.title = "ContactUs Registration";
  const navigate=useNavigate();
  const location =useLocation();
  const {id} = location.state || {};
  const formik = useFormik({
    initialValues: {
      phone: "",
      email: "",
      location: "",
      iframe: "",
    },
    validationSchema: yup.object().shape({
      phone: yup
        .string()
        .matches(/^[0-9]+$/, "Phone number must be numeric")
        .min(10, "Phone number must be at least 10 digits")
        .required("Phone is required"),
      email: yup
        .string()
        .email("Invalid email address")
        .required("Email is required"),
      location: yup.string().required("Location is required"),
      iframe: yup
        .string()
        .matches(
          /^<iframe.*src="https?:\/\/[^"]+"[^>]*><\/iframe>$/,
          "Must be a valid iframe HTML tag"
        )
        .required("Iframe is required"),
    }),
    onSubmit: async (values) => {
      const payload = {
        phone: values.phone,
        email: values.email,
        location: values.location,
        i_frame: values.iframe,
      };
    
      console.log("Submitting form with custom key-value pairs:", payload);
    
      try {
        let response;
        if (id) {
          response = await updateContactus(id, payload);
          if (response) {
            const message =
              response.data?.message || "Contact information updated successfully!";
            Swal.fire({
              icon: "success",
              title: "Updated Successfully!",
              text: message,
            });
          } else {
            const errorMessage =
              response.data?.error || "Failed to update contact information. Please try again.";
            Swal.fire({
              icon: "error",
              title: "Update Failed",
              text: errorMessage,
            });
          }
        } else {
          response = await submitContactus(payload);
          if (response) {
            const message =
              response.data?.message || "Contact information submitted successfully!";
            Swal.fire({
              icon: "success",
              title: "Submitted Successfully!",
              text: message,
            });
          } else {
            const errorMessage =
              response.data?.error || "Failed to submit contact information. Please try again.";
            Swal.fire({
              icon: "error",
              title: "Submission Failed",
              text: errorMessage,
            });
          }
        }
        formik.resetForm();
        navigate("/contactuslist");
    
      } catch (error) {
        const errorMessage =
          error.response?.data?.error || "Failed to submit contact information. Please try again.";
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: errorMessage,
        });
        console.error("Error:", error);
      }
    }
    
  });

  useEffect(() => {
    if (id) {
      const fetchContact = async () => {
        try {
          const response = await getContactusById(id);
          const contactData = response.data;
          formik.setValues({
            phone: contactData.phone,
            email: contactData.email,
            location: contactData.location,
            iframe: contactData.i_frame,
          });
        } catch (error) {
          console.error("Error fetching contact data:", error);
        }
      };

      fetchContact();
    }
  }, [id]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
        <Breadcrumbs
            title="Contact Information Registration"
            breadcrumbItem={id ? "Edit Details" : "Add Details"}
          />

          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
                  <CardTitle tag="h4">Contact Information</CardTitle>
                  <p className="card-title-desc mb-4">
                    Fill in the contact details for your business.
                  </p>

                  <Form onSubmit={formik.handleSubmit} autoComplete="off">
                    <Row>
                      <Col sm="6">
                        <div className="mb-3">
                          <Label htmlFor="phone">Phone</Label>
                          <input
                            type="text"
                            id="phone"
                            name="phone"
                            className={`form-control ${
                              formik.errors.phone && formik.touched.phone
                                ? "is-invalid"
                                : ""
                            }`}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.phone}
                          />
                          {formik.errors.phone && formik.touched.phone && (
                            <FormFeedback>{formik.errors.phone}</FormFeedback>
                          )}
                        </div>
                      </Col>

                      <Col sm="6">
                        <div className="mb-3">
                          <Label htmlFor="email">Email</Label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            className={`form-control ${
                              formik.errors.email && formik.touched.email
                                ? "is-invalid"
                                : ""
                            }`}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.email}
                          />
                          {formik.errors.email && formik.touched.email && (
                            <FormFeedback>{formik.errors.email}</FormFeedback>
                          )}
                        </div>
                      </Col>

                      <Col sm="6">
                        <div className="mb-3">
                          <Label htmlFor="location">Location</Label>
                          <input
                            type="text"
                            id="location"
                            name="location"
                            className={`form-control ${
                              formik.errors.location && formik.touched.location
                                ? "is-invalid"
                                : ""
                            }`}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.location}
                          />
                          {formik.errors.location &&
                            formik.touched.location && (
                              <FormFeedback>
                                {formik.errors.location}
                              </FormFeedback>
                            )}
                        </div>
                      </Col>

                      <Col sm="6">
                        <div className="mb-3">
                          <Label htmlFor="iframe">Iframe</Label>
                          <textarea
                            id="iframe"
                            name="iframe"
                            className={`form-control ${
                              formik.errors.iframe && formik.touched.iframe
                                ? "is-invalid"
                                : ""
                            }`}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.iframe}
                          />
                          {formik.errors.iframe && formik.touched.iframe && (
                            <FormFeedback>{formik.errors.iframe}</FormFeedback>
                          )}
                        </div>
                      </Col>
                    </Row>

                    <div className="d-flex flex-wrap gap-2">
                    <Button type="submit" color="primary">
                        {id ? "Update" : "Submit"}
                      </Button>
                      <Button
                        type="button"
                        color="secondary"
                        onClick={() => {
                          formik.resetForm();
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ContactUs;
