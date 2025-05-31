import React, { useEffect, useState } from "react";
import { Button, Card, CardBody, CardTitle, Col, Container, Form, Input, Label, Row, FormFeedback } from "reactstrap";
import * as yup from "yup";
import { useFormik } from "formik";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import Swal from "sweetalert2";
import { getCategoryOptions,getVariantOptions,registerProduct,getProductDetails,updateProduct } from "../../../ApiService/ProductMaster/ProductMaster";
import { useLocation } from "react-router-dom";
const ProductMaster = () => {
  document.title = "Product Registration";
   const location=useLocation();
   const {id} = location.state || {}
   console.log(id)
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [variantOptions, setVariantOptions] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryData = await getCategoryOptions();
        setCategoryOptions(categoryData);

        const variantData = await getVariantOptions();
        setVariantOptions(variantData);

        if (id) {
          setIsEditing(true);
          const productDetails = await getProductDetails(id); 
          console.log(productDetails)
          formik.setValues({
            category: productDetails.data.category_name_id || "",
            variants: productDetails.data.varient_data?.map((variant) => ({
              varient_name_id: variant.varientid,
              name: variant.varientname,
            })) || [],
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    const variant = variantOptions.find((item) => item.display_name === value);

    if (checked && variant) {
      formik.setFieldValue("variants", [
        ...formik.values.variants,
        { varient_name_id: variant.varient_name_id, name: variant.display_name },
      ]);
    } else {
      formik.setFieldValue("variants", formik.values.variants.filter((item) => item.name !== value));
    }
  };

  const formik = useFormik({
    initialValues: {
      category: "",
      variants: [],
    },
    validationSchema: yup.object().shape({
      category: yup.string().required("Please select a Category"),
    }),
    onSubmit: async (values) => {
      const dataToSubmit = {
        category_name_id: values.category,
        varient_data: values.variants.map((variant) => ({
          varientid: variant.varient_name_id,
          varientname: variant.name,
        })),
      };

      try {
        let response;
        if (isEditing) {
          response = await updateProduct(id, dataToSubmit); 
        } else {
          response = await registerProduct(dataToSubmit);
        }

        if (response.status === 201 || response.status === 200) {
          Swal.fire({
            title: "Success!",
            text: isEditing ? "Product Updated Successfully!" : "Product Registered Successfully!",
            icon: "success",
            confirmButtonText: "OK",
          });

          formik.resetForm();
          
        } else {
          Swal.fire({
            title: "Error!",
            text: "Unexpected error occurred",
            icon: "error",
            confirmButtonText: "Try Again",
          });
        }
      } catch (error) {
        console.error("Error submitting data:", error);
        Swal.fire({
          title: "Error!",
          text: "Error processing request",
          icon: "error",
          confirmButtonText: "Try Again",
        });
      }
    },
  });

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Breadcrumb */}
          <Breadcrumbs title="Product Registration" breadcrumbItem="Add Details" />

          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
                <CardTitle tag="h4">{isEditing ? "Edit Product" : "Product Information"}</CardTitle>
                <p className="card-title-desc mb-4">
                    {isEditing ? "Update the fields below to edit the product." : "Fill out the fields below to register your product."}
                  </p>

                  <Form onSubmit={formik.handleSubmit} autoComplete="off">
                    <Row>
                      <Col sm="6">
                        {/* Category Dropdown */}
                        <div className="mb-3">
                          <Label htmlFor="category">Category</Label>
                          <Input
                            id="category"
                            name="category"
                            type="select"
                            value={formik.values.category}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={formik.touched.category && formik.errors.category}
                          >
                            <option value="">Select Category</option>
                            {categoryOptions.length > 0 ? (
                              categoryOptions?.map((category) => (
                                <option key={category.category_name_id} value={category.category_name_id}>
                                  {category.category_name}
                                </option>
                              ))
                            ) : (
                              <option>Loading categories...</option>
                            )}
                          </Input>

                          {formik.touched.category && formik.errors.category && (
                            <FormFeedback>{formik.errors.category}</FormFeedback>
                          )}
                        </div>

                        {/* Variant Section */}
                        <div className="mb-3">
                          <h5>Variants</h5>
                        </div>

                        {/* Variant checkboxes */}
                        <div className="mb-3">
                          <div className="d-flex flex-wrap">
                            {variantOptions.map((variant, index) => (
                              <div key={index} className="form-check mr-3">
                                <Input
                                  type="checkbox"
                                  id={`variant-${index}`}
                                  name="variants"
                                  value={variant.display_name}
                                  checked={formik.values.variants.some((item) => item.name === variant.display_name)}
                                  onChange={handleCheckboxChange}
                                  className="form-check-input"
                                />
                                <Label className="form-check-label" htmlFor={`variant-${index}`}>
                                  {variant.display_name}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </Col>
                    </Row>

                    <div className="d-flex flex-wrap gap-2">
                      <Button type="submit" color="primary">
                        {isEditing ? "Update" : "Submit"}
                      </Button>
                      <Button type="button" color="secondary" onClick={() => formik.resetForm()}>
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

export default ProductMaster;
