import React, { useEffect } from "react";
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
import { useFormik } from "formik";
import * as yup from "yup";
import Breadcrumbs from "../../../components/Common/Breadcrumb"; // Adjust path as necessary
import {
  postDiscountCode,
  getDiscountCodeById,
  updateDiscountCode,
} from "../../../ApiService/DealAndDiscount/DiscountCode/DiscountCode";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";

const DiscountCode = () => {
  document.title = "Discount Coupons";

  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location.state || {};
 
  const formik = useFormik({
    initialValues: {
      couponDescription: "",
      discountType: "",
      discountValue: "",
      startDate: "",
      endDate: "",
      minimumOrderValue: "",
      maximumDiscountValue: "",
    },
    validationSchema: yup.object().shape({
      couponDescription: yup.string().required("Please enter the Coupon Description"),
      discountType: yup.string().required("Please select Discount Type"),
      discountValue: yup.number().typeError("Please enter a valid number").required("Please enter the Discount Value"),
      startDate: yup.date().required("Please select Start Date"),
      endDate: yup.date().required("Please select End Date").min(yup.ref("startDate"), "End date cannot be before start date"),
      minimumOrderValue: yup.number().typeError("Please enter a valid number").required("Please enter the Minimum Order Value"),
      maximumDiscountValue: yup.number().typeError("Please enter a valid number").required("Please enter the Maximum Discount Value"),
    }),
    onSubmit: async (values) => {
      const payload = {
        description: values.couponDescription,
        discount_type: values.discountType,
        discount_value: values.discountValue,
        start_date: values.startDate,
        end_date: values.endDate,
        min_order_value: values.minimumOrderValue,
        max_discount_value: values.maximumDiscountValue,
      };

      try {
        let response;
        if (id) {
          response = await updateDiscountCode(id, payload);
          console.log("API Response:", response);
          const successMessage = response.message || "Discount code updated successfully!";
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: successMessage,
          });
        } else {
          response = await postDiscountCode(payload);
          console.log("API Response:", response);
          const successMessage = response.message || "Discount code submitted successfully!";
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: successMessage,
          });
        }

        formik.resetForm();
        navigate("/discountcodeslist");
      } catch (error) {
        console.error("Error submitting discount code:", error);
        const errorMessage = error.response?.data?.error || "An error occurred while submitting the discount code.";
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: errorMessage,
        });
      }
    },
  });

  useEffect(() => {
    if (id) {
      const fetchDiscountCode = async () => {
        try {
          const response = await getDiscountCodeById(id);
          const data = response.coupons;
          formik.setValues({
            couponCode:  data.coupon_code,
            couponName: data.coupon_name,
            couponDescription: data.description,
            discountType: data.discount_type,
            discountValue: data.discount_value,
            startDate: new Date(data.start_date).toISOString().slice(0, 16),
            endDate: new Date(data.end_date).toISOString().slice(0, 16),
            minimumOrderValue: data.min_order_value,
            maximumDiscountValue: data.max_discount_value,
          });
        } catch (error) {
          console.error("Error fetching discount code:", error);
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: "An error occurred while fetching the discount code details.",
          });
        }
      };
      fetchDiscountCode();
    }
  }, [id]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Discount Code Registration"
            breadcrumbItem="Add Details"
          />
          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
                  <CardTitle tag="h4">Discount Code Information</CardTitle>
                  <p className="card-title-desc mb-4">
                    Fill out the fields below to register your discount code.
                  </p>

                  <Form onSubmit={formik.handleSubmit} autoComplete="off">
                    <Row>
                      <Col sm="6">
                        <div className="mb-3">
                          <Label htmlFor="couponDescription">
                            Coupon Description
                          </Label>
                          <Input
                            id="couponDescription"
                            name="couponDescription"
                            type="text"
                            value={formik.values.couponDescription}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={
                              formik.touched.couponDescription &&
                              formik.errors.couponDescription
                                ? true
                                : false
                            }
                          />
                          {formik.touched.couponDescription &&
                            formik.errors.couponDescription && (
                              <FormFeedback>
                                {formik.errors.couponDescription}
                              </FormFeedback>
                            )}
                        </div>

                        <div className="mb-3">
                          <Label htmlFor="discountType">Discount Type</Label>
                          <Input
                            id="discountType"
                            name="discountType"
                            type="select"
                            value={formik.values.discountType}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={
                              formik.touched.discountType &&
                              formik.errors.discountType
                                ? true
                                : false
                            }
                          >
                            <option value="">Select Discount Type</option>
                            <option value="Percentage">Percentage</option>
                            <option value="Flat">Flat</option>
                          </Input>
                          {formik.touched.discountType &&
                            formik.errors.discountType && (
                              <FormFeedback>
                                {formik.errors.discountType}
                              </FormFeedback>
                            )}
                        </div>

                        <div className="mb-3">
                          <Label htmlFor="discountValue">Discount Value</Label>
                          <Input
                            id="discountValue"
                            name="discountValue"
                            type="number"
                            value={formik.values.discountValue}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={
                              formik.touched.discountValue &&
                              formik.errors.discountValue
                                ? true
                                : false
                            }
                          />
                          {formik.touched.discountValue &&
                            formik.errors.discountValue && (
                              <FormFeedback>
                                {formik.errors.discountValue}
                              </FormFeedback>
                            )}
                        </div>
                      </Col>

                      <Col sm="6">
                        <div className="mb-3">
                          <Label htmlFor="startDate">Start Date</Label>
                          <Input
                            id="startDate"
                            name="startDate"
                            type="datetime-local"
                            value={formik.values.startDate}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={
                              formik.touched.startDate &&
                              formik.errors.startDate
                                ? true
                                : false
                            }
                          />
                          {formik.touched.startDate &&
                            formik.errors.startDate && (
                              <FormFeedback>
                                {formik.errors.startDate}
                              </FormFeedback>
                            )}
                        </div>

                        <div className="mb-3">
                          <Label htmlFor="endDate">End Date</Label>
                          <Input
                            id="endDate"
                            name="endDate"
                            type="datetime-local"
                            value={formik.values.endDate}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={
                              formik.touched.endDate && formik.errors.endDate
                                ? true
                                : false
                            }
                          />
                          {formik.touched.endDate && formik.errors.endDate && (
                            <FormFeedback>{formik.errors.endDate}</FormFeedback>
                          )}
                        </div>

                        <div className="mb-3">
                          <Label htmlFor="minimumOrderValue">
                            Minimum Order Value
                          </Label>
                          <Input
                            id="minimumOrderValue"
                            name="minimumOrderValue"
                            type="number"
                            value={formik.values.minimumOrderValue}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={
                              formik.touched.minimumOrderValue &&
                              formik.errors.minimumOrderValue
                                ? true
                                : false
                            }
                          />
                          {formik.touched.minimumOrderValue &&
                            formik.errors.minimumOrderValue && (
                              <FormFeedback>
                                {formik.errors.minimumOrderValue}
                              </FormFeedback>
                            )}
                        </div>

                        <div className="mb-3">
                          <Label htmlFor="maximumDiscountValue">
                            Maximum Discount Value
                          </Label>
                          <Input
                            id="maximumDiscountValue"
                            name="maximumDiscountValue"
                            type="number"
                            value={formik.values.maximumDiscountValue}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={
                              formik.touched.maximumDiscountValue &&
                              formik.errors.maximumDiscountValue
                                ? true
                                : false
                            }
                          />
                          {formik.touched.maximumDiscountValue &&
                            formik.errors.maximumDiscountValue && (
                              <FormFeedback>
                                {formik.errors.maximumDiscountValue}
                              </FormFeedback>
                            )}
                        </div>
                      </Col>
                    </Row>
                    <div className="d-flex flex-wrap gap-2">
                    <Button color="primary" type="submit">
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

export default DiscountCode;
