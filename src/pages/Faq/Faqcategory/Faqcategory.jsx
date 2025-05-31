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
import * as yup from "yup";
import { useFormik } from "formik";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import Swal from "sweetalert2";
import { postCategoryData, editCategoryData, getCategoryByID } from "../../../ApiService/Faq/Faq";
import { useNavigate, useLocation } from "react-router-dom";

const Faqcategory = () => {
  document.title = "FAQ Registration";
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location.state || {};

  const formik = useFormik({
    initialValues: {
      categoryName: "",
    },
    validationSchema: yup.object().shape({
      categoryName: yup.string().required("Please enter a Category Name"),
    }),
    onSubmit: async (values) => {
      try {
        let response;
        if (id) {
          response = await editCategoryData(id, {
            category_name: values.categoryName,
          });
          Swal.fire({
            icon: "success",
            title: "Category Updated!",
            text: response.message || "Category has been successfully updated.",
          });
        } else {
          response = await postCategoryData({
            category_name: values.categoryName,
          });
          Swal.fire({
            icon: "success",
            title: "Category Added!",
            text: response.message || "Category has been successfully added.",
          });
        }

        formik.resetForm();
        navigate("/faqcategorytable");
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message || "An error occurred while submitting the form.",
        });
      }
    },
  });

  useEffect(() => {
    if (id) {
      // Fetch existing category data for editing
      const fetchCategory = async () => {
        try {
          const response = await getCategoryByID(id);
          formik.setValues({
            categoryName: response.category_name,
          });
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: error.message || "An error occurred while fetching category data.",
          });
        }
      };
      fetchCategory();
    }
  }, [id]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Breadcrumb */}
          <Breadcrumbs
            title="Product Registration"
            breadcrumbItem={id ? "Edit Details" : "Add Details"}
          />

          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
                  <CardTitle tag="h4">{id ? "Edit" : "Add"} Product Information</CardTitle>
                  <p className="card-title-desc mb-4">
                    Fill out the field below to {id ? "edit" : "register"} your product.
                  </p>

                  <Form onSubmit={formik.handleSubmit} autoComplete="off">
                    <Row>
                      <Col sm="6">
                        <div className="mb-3">
                          <Label htmlFor="categoryName">Category Name</Label>
                          <Input
                            id="categoryName"
                            name="categoryName"
                            type="text"
                            value={formik.values.categoryName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Enter Category For FAQ"
                            invalid={formik.touched.categoryName && formik.errors.categoryName ? true : false}
                          />
                          {formik.touched.categoryName && formik.errors.categoryName && (
                            <FormFeedback>{formik.errors.categoryName}</FormFeedback>
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

export default Faqcategory;
