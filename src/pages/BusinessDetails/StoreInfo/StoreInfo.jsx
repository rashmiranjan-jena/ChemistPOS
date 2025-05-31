import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Form,
  Input,
  Label,
  Row,
  FormFeedback,
} from "reactstrap";
import * as yup from "yup";
import { useFormik } from "formik";
import {
  submitStoreData,
  getStorebyId,
  updateStoreData,
} from "../../../ApiService/StoreInfo/StoreInfo";
import Swal from "sweetalert2";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useNavigate, useLocation } from "react-router-dom";

const StoreInfo = () => {
  document.title = "Store Registration";
  const navigate = useNavigate();

  const location = useLocation();
  const { id } = location.state || {};
  console.log(id);

  const [storeDetails, setStoreDetails] = useState(null);

  useEffect(() => {
    if (id) {
      getStorebyId(id).then((response) => {
        if (response.status === 200) {
          setStoreDetails(response.data);
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to fetch store data.",
          });
        }
      });
    }
  }, [id]);
  const formik = useFormik({
    initialValues: {
      store_name: storeDetails ? storeDetails.store_name : "",
      zipCode: storeDetails ? storeDetails.address_details.pin : "",
      city: storeDetails ? storeDetails.address_details.city : "",
      state: storeDetails ? storeDetails.address_details.state : "",
      country: storeDetails ? storeDetails.address_details.country : "",
      addressLine1: storeDetails ? storeDetails.address_details.address1 : "",
      addressLine2: storeDetails ? storeDetails.address_details.address2 : "",
      iframe: storeDetails ? storeDetails.iframe_location : "",
    },
    enableReinitialize: true,
    validationSchema: yup.object().shape({
      store_name: yup.string().required("Please enter your Store Name"),
      zipCode: yup.string().required("Please enter your ZIP / PIN Code"),
      city: yup.string().required("Please enter your City"),
      state: yup.string().required("Please enter your State"),
      country: yup.string().required("Please enter your Country"),
      addressLine1: yup.string().required("Please enter Address Line 1"),
      iframe: yup
        .string()
        .required("Please enter the Iframe")
        .matches(
          /<iframe.*?src=["'].*?["'].*?>.*?<\/iframe>/i,
          "Please enter a valid Iframe"
        ),
    }),
    onSubmit: async (values) => {
      const formattedData = {
        store_name: values.store_name,
        address_details: {
          pin: values.zipCode,
          city: values.city,
          state: values.state,
          country: values.country,
          address1: values.addressLine1,
          address2: values.addressLine2,
        },
        iframe_location: values.iframe,
      };

      console.log("Formatted Data Submitted:", formattedData);

      try {
        if (id) {
          // If an ID exists, it's an update request
          const response = await updateStoreData(id, formattedData);
          if (response.status === 200) {
            Swal.fire({
              icon: "success",
              title: "Success!",
              text: "Store details updated successfully!",
              confirmButtonText: "OK",
            });
            navigate("/storeinfolist");
          } else {
            Swal.fire({
              icon: "warning",
              title: "Warning",
              text: `Unexpected response status: ${response.status}`,
            });
          }
        } else {
          // If no ID exists, it's a store registration (create)
          const response = await submitStoreData(formattedData);
          if (response.status === 201) {
            Swal.fire({
              icon: "success",
              title: "Success!",
              text: "Store registered successfully!",
              confirmButtonText: "OK",
            });
            formik.resetForm();
            navigate("/storeinfolist");
          } else {
            Swal.fire({
              icon: "warning",
              title: "Warning",
              text: `Unexpected response status: ${response.status}`,
            });
          }
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: id ? "Update Failed" : "Submission Failed",
          text:
            error.response?.data?.error ||
            "There was an error processing your request.",
        });
      }
    },
  });

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Breadcrumb */}
          <Breadcrumbs
            title={id ? "Edit Store" : "Store Registration"}
            breadcrumbItem={id ? "Edit Store" : "Add Details"}
          />

          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
                  <CardTitle tag="h4">Store Information</CardTitle>
                  <p className="card-title-desc mb-4">
                    Fill out the fields below to register your store.
                  </p>

                  <Form onSubmit={formik.handleSubmit} autoComplete="off">
                    <Row>
                      <Col sm="6">
                        <div className="mb-3">
                          <Label htmlFor="store_name">Store Name</Label>
                          <Input
                            id="store_name"
                            name="store_name"
                            type="text"
                            placeholder="Enter Store Name"
                            value={formik.values.store_name}
                            onChange={formik.handleChange}
                            invalid={
                              formik.touched.store_name &&
                              formik.errors.store_name
                                ? true
                                : false
                            }
                          />
                          {formik.errors.store_name &&
                          formik.touched.store_name ? (
                            <FormFeedback>
                              {formik.errors.store_name}
                            </FormFeedback>
                          ) : null}
                        </div>
                        <div className="mb-3">
                          <Label htmlFor="zipCode">ZIP / PIN Code</Label>
                          <Input
                            id="zipCode"
                            name="zipCode"
                            type="text"
                            placeholder="Enter ZIP / PIN Code"
                            value={formik.values.zipCode}
                            onChange={formik.handleChange}
                            invalid={
                              formik.touched.zipCode && formik.errors.zipCode
                                ? true
                                : false
                            }
                          />
                          {formik.errors.zipCode && formik.touched.zipCode ? (
                            <FormFeedback>{formik.errors.zipCode}</FormFeedback>
                          ) : null}
                        </div>
                        <div className="mb-3">
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            name="city"
                            type="text"
                            placeholder="Enter City"
                            value={formik.values.city}
                            onChange={formik.handleChange}
                            invalid={
                              formik.touched.city && formik.errors.city
                                ? true
                                : false
                            }
                          />
                          {formik.errors.city && formik.touched.city ? (
                            <FormFeedback>{formik.errors.city}</FormFeedback>
                          ) : null}
                        </div>
                        <div className="mb-3">
                          <Label htmlFor="state">State</Label>
                          <Input
                            id="state"
                            name="state"
                            type="text"
                            placeholder="Enter State"
                            value={formik.values.state}
                            onChange={formik.handleChange}
                            invalid={
                              formik.touched.state && formik.errors.state
                                ? true
                                : false
                            }
                          />
                          {formik.errors.state && formik.touched.state ? (
                            <FormFeedback>{formik.errors.state}</FormFeedback>
                          ) : null}
                        </div>
                        <div className="mb-3">
                          <Label htmlFor="country">Country</Label>
                          <Input
                            id="country"
                            name="country"
                            type="text"
                            placeholder="Enter Country"
                            value={formik.values.country}
                            onChange={formik.handleChange}
                            invalid={
                              formik.touched.country && formik.errors.country
                                ? true
                                : false
                            }
                          />
                          {formik.errors.country && formik.touched.country ? (
                            <FormFeedback>{formik.errors.country}</FormFeedback>
                          ) : null}
                        </div>
                      </Col>

                      <Col sm="6">
                        <div className="mb-3">
                          <Label htmlFor="addressLine1">Address Line 1</Label>
                          <Input
                            id="addressLine1"
                            name="addressLine1"
                            type="text"
                            placeholder="Enter Address Line 1"
                            value={formik.values.addressLine1}
                            onChange={formik.handleChange}
                            invalid={
                              formik.touched.addressLine1 &&
                              formik.errors.addressLine1
                                ? true
                                : false
                            }
                          />
                          {formik.errors.addressLine1 &&
                          formik.touched.addressLine1 ? (
                            <FormFeedback>
                              {formik.errors.addressLine1}
                            </FormFeedback>
                          ) : null}
                        </div>
                        <div className="mb-3">
                          <Label htmlFor="addressLine2">
                            Address Line 2 (Optional)
                          </Label>
                          <Input
                            id="addressLine2"
                            name="addressLine2"
                            type="text"
                            placeholder="Enter Address Line 2 (Optional)"
                            value={formik.values.addressLine2}
                            onChange={formik.handleChange}
                          />
                        </div>
                        <div className="mb-3">
                          <Label htmlFor="iframe">Iframe</Label>
                          <Input
                            id="iframe"
                            name="iframe"
                            type="textarea"
                            placeholder="Enter Google Maps Iframe"
                            value={formik.values.iframe}
                            onChange={formik.handleChange}
                            invalid={
                              formik.touched.iframe && formik.errors.iframe
                                ? true
                                : false
                            }
                          />
                          {formik.errors.iframe && formik.touched.iframe ? (
                            <FormFeedback>{formik.errors.iframe}</FormFeedback>
                          ) : null}
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
                        onClick={() => formik.resetForm()}
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

export default StoreInfo;
