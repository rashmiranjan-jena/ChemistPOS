import React, { useEffect, useState } from "react";
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
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";
import Select from "react-select";
import {
  fetchAllData,
  poatalCode,
  postDeliveryData,
  getDeliveryDataById,
  updateDeliveryDataById,
} from "../../../ApiService/TransationManagement/DeliveryDistribution";

const DeliveryDistribution = () => {
  document.title = "Delivery Registration";
  const navigate = useNavigate();
  const location = useLocation();
  const { pincode } = location.state || {};
  console.log(pincode);
  const [dropdownData, setDropdownData] = useState({
    stores: [],
    categories: [],
    brands: [],
  });
  const [pincodeError, setPincodeError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAllData();
      setDropdownData(data);
    };
    fetchData();
  }, []);

  const validatePincode = async (pincode) => {
    if (!pincode) return;
    try {
      const response = await poatalCode(pincode);
      const data = response;
      if (data && data[0].Status === "Success") {
        setPincodeError("");
      } else {
        setPincodeError("Invalid pincode. Please enter a valid one.");
      }
    } catch (error) {
      setPincodeError("Error validating pincode. Try again.");
    }
  };

  const formik = useFormik({
    initialValues: {
      pincode: "",
      store: "",
      category: "",
      brand: [],
      expectedDeliveryDays: "",
      deliveryCharges: "",
    },
    validationSchema: yup.object().shape({
      pincode: yup.string().required("Please enter a pincode"),
      store: yup.string().required("Please select a store"),
      category: yup.string().required("Please select a category"),
      brand: yup.array().min(1, "Please select at least one brand"),
      expectedDeliveryDays: yup
        .string()
        .min(1, "Delivery days must be at least 1")
        .required("Please enter the expected delivery days"),
      deliveryCharges: yup
        .number()
        .typeError("Delivery charges must be a number")
        .min(0, "Delivery charges must be at least 0")
        .required("Please enter delivery charges"),
    }),
    onSubmit: async (values) => {
      if (pincodeError) {
        return;
      }

      const payload = {
        pincode: values.pincode,
        store_id: values.store,
        category_id: values.category,
        brand_ids: values.brand.map((brand) => brand.value), 
        delivery_time: values.expectedDeliveryDays,
        delivery_charges: values.deliveryCharges,
      };

      try {
        if (pincode) {
          await updateDeliveryDataById(pincode, payload);

          Swal.fire({
            icon: "success",
            title: "Delivery Updated Successfully",
            text: "The delivery details have been updated successfully!",
          });
        } else {
         
          await postDeliveryData(payload);

          Swal.fire({
            icon: "success",
            title: "Delivery Registered Successfully",
            text: "The delivery details have been submitted successfully!",
          });
        }

        formik.resetForm();
        navigate("/deliverydistributionlist");
      } catch (error) {
        const errorResponse = error?.response?.data;
        let errorMessage =
          "There was an error submitting your delivery information.";

        if (errorResponse) {
          errorMessage = errorResponse.error || errorMessage;
        }

        Swal.fire({
          icon: "error",
          title: "Error",
          text: errorMessage,
        });
      }
    },
  });


  useEffect(() => {
    const fetchDeliveryData = async () => {
      try {
        const response = await getDeliveryDataById(pincode);
        const deliveryData = response && response[0];
  
        if (deliveryData) {
          const formattedBrands = deliveryData.brands.map((brand) => ({
            value: brand.brand_id,
            label: brand.brand_name,
          }));
          formik.setValues({
            pincode: deliveryData.pincode,
            store: deliveryData.store_id,
            category: deliveryData.category_id,
            brand: formattedBrands, 
            expectedDeliveryDays: deliveryData.delivery_time,
            deliveryCharges: deliveryData.delivery_charges,
          });
        }
      } catch (error) {
        console.error("Error fetching delivery data:", error);
      }
    };
  
    if (pincode) {
      fetchDeliveryData();
    }
  }, [pincode]);
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
        <Breadcrumbs
            title="Delivery Registration"
            breadcrumbItem={pincode ? "Edit Delivery" : "Add Delivery"}
          />
          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
                  <CardTitle tag="h4">Delivery Information</CardTitle>
                  <p className="card-title-desc mb-4">
                    Fill out the fields below to {pincode ? "edit" : "register"} a delivery.
                  </p>

                  <Form onSubmit={formik.handleSubmit} autoComplete="off">
                    <Row>
                      <Col sm="6">
                        <div className="mb-3">
                          <Label htmlFor="pincode">Pincode</Label>
                          <Input
                            id="pincode"
                            name="pincode"
                            type="text"
                            value={formik.values.pincode}
                            onChange={(e) => {
                              formik.handleChange(e);
                              setPincodeError("");
                            }}
                            onBlur={(e) => {
                              formik.handleBlur(e);
                              validatePincode(e.target.value);
                            }}
                            invalid={
                              !!pincodeError ||
                              (formik.touched.pincode &&
                                !!formik.errors.pincode)
                            }
                          />
                          {pincodeError ? (
                            <FormFeedback>{pincodeError}</FormFeedback>
                          ) : (
                            formik.touched.pincode && (
                              <FormFeedback>
                                {formik.errors.pincode}
                              </FormFeedback>
                            )
                          )}
                        </div>
                        <div className="mb-3">
                          <Label htmlFor="store">Store</Label>
                          <Input
                            id="store"
                            name="store"
                            type="select"
                            value={formik.values.store}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={
                              formik.touched.store && formik.errors.store
                            }
                          >
                            <option value="">Select Store</option>
                            {dropdownData.stores.map((store) => (
                              <option
                                key={store.business_store_id}
                                value={store.business_store_id}
                              >
                                {store.store_name}
                              </option>
                            ))}
                          </Input>
                          <FormFeedback>{formik.errors.store}</FormFeedback>
                        </div>

                        <div className="mb-3">
                          <Label htmlFor="category">Category</Label>
                          <Input
                            id="category"
                            name="category"
                            type="select"
                            value={formik.values.category}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={
                              formik.touched.category && formik.errors.category
                            }
                          >
                            <option value="">Select Category</option>
                            {dropdownData.categories.map((category) => (
                              <option
                                key={category.category_name_id}
                                value={category.category_name_id}
                              >
                                {category.category_name}
                              </option>
                            ))}
                          </Input>
                          <FormFeedback>{formik.errors.category}</FormFeedback>
                        </div>

                        {/* Brand Multi-Select */}
                        <div className="mb-3">
                          <Label htmlFor="brand">Brand</Label>
                          <Select
                            id="brand"
                            name="brand"
                            isMulti
                            options={dropdownData.brands.map((brand) => ({
                              value: brand.brand_details.brand_id,
                              label: brand.brand_details.brand_name,
                            }))}
                            value={formik.values.brand}
                            onChange={(selectedOptions) =>
                              formik.setFieldValue("brand", selectedOptions)
                            }
                            onBlur={formik.handleBlur}
                            isSearchable
                          />
                          {formik.touched.brand && formik.errors.brand && (
                            <FormFeedback>{formik.errors.brand}</FormFeedback>
                          )}
                        </div>

                        <div className="mb-3">
                          <Label htmlFor="expectedDeliveryDays">
                            Expected Delivery Days
                          </Label>
                          <Input
                            id="expectedDeliveryDays"
                            name="expectedDeliveryDays"
                            type="text"
                            min="1"
                            placeholder="Enter days (e.g., 1-2, 2-3, 3-4.....)"
                            value={formik.values.expectedDeliveryDays}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={
                              formik.touched.expectedDeliveryDays &&
                              !!formik.errors.expectedDeliveryDays
                            }
                          />
                          <FormFeedback>
                            {formik.errors.expectedDeliveryDays}
                          </FormFeedback>
                        </div>

                        <div className="mb-3">
                          <Label htmlFor="deliveryCharges">
                            Delivery Charges
                          </Label>
                          <Input
                            id="deliveryCharges"
                            name="deliveryCharges"
                            type="text"
                            value={formik.values.deliveryCharges}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={
                              formik.touched.deliveryCharges &&
                              !!formik.errors.deliveryCharges
                            }
                          />
                          <FormFeedback>
                            {formik.errors.deliveryCharges}
                          </FormFeedback>
                        </div>
                      </Col>
                    </Row>

                    <div className="d-flex flex-wrap gap-2">
                    <Button
                        type="submit"
                        color="primary"
                        disabled={!!pincodeError || formik.isSubmitting}
                      >
                        {pincode ? "Update" : "Submit"}
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

export default DeliveryDistribution;
