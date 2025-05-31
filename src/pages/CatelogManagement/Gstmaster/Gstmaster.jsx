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
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import {
  fetchSubcategories,
  submitGstDetails,
  getGstById,
  updateGstDetails,
} from "../../../ApiService/Gstmaster/Gstmaster";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

const Gstmaster = () => {
  document.title = "GST Master";
  const location = useLocation();
  const { id } = location.state || {};
  console.log(id);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchSubcategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories.");
      }
    };

    getCategories();
  }, []);

  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      const fetchGstDetails = async () => {
        try {
          const gstData = await getGstById(id);
          console.log(gstData);
          formik.setValues({
            category: gstData.data.category_name_id,
            hsnNumber: gstData.data.hsn,
            gstAmount: gstData.data.gst_amount,
            gstname: gstData.data.gst_name,
          });
        } catch (error) {
          console.error("Failed to fetch GST details:", error);
        }
      };

      fetchGstDetails();
    }
  }, [id]);

  const formik = useFormik({
    initialValues: {
      category: "",
      hsnNumber: "",
      gstAmount: "",
      gstname: "",
    },
    validationSchema: yup.object().shape({
      category: yup.string().required("Please select a Category"),
      hsnNumber: yup
        .string()
        .required("Please enter the HSN Number")
        .matches(/^[0-9]+$/, "HSN Number must be numeric")
        .min(6, "HSN Number must be at least 6 digits long")
        .max(8, "HSN Number cannot exceed 8 digits"),
      gstAmount: yup
        .number()
        .typeError("GST Amount must be a number")
        .required("Please enter the GST Amount (%)")
        .min(0, "GST Amount cannot be less than 0%")
        .max(100, "GST Amount cannot exceed 100%"),
      gstname: yup
        .string()
        .required("Please enter the GST Name")
        .min(3, "GST Name must be at least 3 characters long"),
    }),
    onSubmit: async (values) => {
      try {
        if (isEditMode) {
          await updateGstDetails(id, {
            category_name_id: parseInt(values.category),
            hsn: values.hsnNumber,
            gst_amount: values.gstAmount,
            gst_name: values.gstname,
          });

          Swal.fire({
            icon: "success",
            title: "Updated!",
            text: "GST details updated successfully.",
          });
        } else {
          await submitGstDetails({
            category_name_id: parseInt(values.category),
            hsn: values.hsnNumber,
            gst_amount: values.gstAmount,
            gst_name: values.gstname,
          });

          Swal.fire({
            icon: "success",
            title: "Submitted!",
            text: "GST details added successfully.",
          });
        }

        formik.resetForm();
        navigate("/gstlist");
      } catch (error) {
        console.error("Error submitting form:", error);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Something went wrong. Please try again.",
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
            title="GST Master"
            breadcrumbItem={id ? "Edit Details" : "Add Details"}
          />

          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
                  <CardTitle tag="h4">GST Information</CardTitle>
                  <p className="card-title-desc mb-4">
                    {id
                      ? "Update the details below."
                      : "Fill out the fields below to register GST details."}
                  </p>

                  <Form onSubmit={formik.handleSubmit} autoComplete="off">
                    <Row>
                      <Col sm="6">
                        {/* Category */}
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
                                ? true
                                : false
                            }
                          >
                            <option value="">Select Category</option>
                            {categories.map((category) => (
                              <option
                                key={category.id}
                                value={category.category_name_id}
                              >
                                {category.category_name}
                              </option>
                            ))}
                          </Input>
                          {formik.touched.category &&
                            formik.errors.category && (
                              <FormFeedback>
                                {formik.errors.category}
                              </FormFeedback>
                            )}
                        </div>
                        {/* HSN Number */}
                        <div className="mb-3">
                          <Label htmlFor="hsnNumber">HSN Number</Label>
                          <Input
                            id="hsnNumber"
                            name="hsnNumber"
                            type="text"
                            value={formik.values.hsnNumber}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={
                              formik.touched.hsnNumber &&
                              formik.errors.hsnNumber
                                ? true
                                : false
                            }
                          />
                          {formik.touched.hsnNumber &&
                            formik.errors.hsnNumber && (
                              <FormFeedback>
                                {formik.errors.hsnNumber}
                              </FormFeedback>
                            )}
                        </div>

                        {/* GST Name */}
                        <div className="mb-3">
                          <Label htmlFor="gstname">GST Name</Label>
                          <Input
                            id="gstname"
                            name="gstname"
                            type="text"
                            value={formik.values.gstname}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={
                              formik.touched.gstname && formik.errors.gstname
                                ? true
                                : false
                            }
                          />
                          {formik.touched.gstname && formik.errors.gstname && (
                            <FormFeedback>{formik.errors.gstname}</FormFeedback>
                          )}
                        </div>

                        {/* GST Amount */}
                        <div className="mb-3">
                          <Label htmlFor="gstAmount">GST Amount (%)</Label>
                          <Input
                            id="gstAmount"
                            name="gstAmount"
                            type="number"
                            value={formik.values.gstAmount}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={
                              formik.touched.gstAmount &&
                              formik.errors.gstAmount
                                ? true
                                : false
                            }
                          />
                          {formik.touched.gstAmount &&
                            formik.errors.gstAmount && (
                              <FormFeedback>
                                {formik.errors.gstAmount}
                              </FormFeedback>
                            )}
                        </div>
                      </Col>
                    </Row>

                    {/* Submit and Cancel Buttons */}
                    <div className="d-flex flex-wrap gap-2">
                      <Button type="submit" color="primary">
                        {isEditMode ? "Update" : "Submit"}
                      </Button>
                      <Button
                        type="button"
                        color="secondary"
                        onClick={() => navigate("/gstlist")}
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

export default Gstmaster;
