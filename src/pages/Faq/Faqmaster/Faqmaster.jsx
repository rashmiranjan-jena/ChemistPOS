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
import { getCategories, createFaq, editFaq, getFaqByID } from "../../../ApiService/Faq/FaqMaster";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";

const Faqmaster = () => {
  document.title = "FAQ";
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location.state || {};
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response);
      } catch (error) {
        console.error("Error fetching categories:", error);
        Swal.fire("Error", "Failed to load categories. Please try again.", "error");
      }
    };

    const fetchFaq = async () => {
      if (id) {
        try {
          const response = await getFaqByID(id);
          formik.setValues({
            categoryName: response.faq_category_id,
            faqQuestion: response.question,
            faqAnswer: response.answer,
          });
        } catch (error) {
          console.error("Error fetching FAQ:", error);
          Swal.fire("Error", "Failed to load FAQ. Please try again.", "error");
        }
      }
    };

    fetchCategories();
    fetchFaq();
  }, [id]);

  const formik = useFormik({
    initialValues: {
      categoryName: "",
      faqQuestion: "",
      faqAnswer: "",
    },
    validationSchema: yup.object().shape({
      categoryName: yup.string().required("Please select a Category Name"),
      faqQuestion: yup.string().required("Please enter the FAQ Question"),
      faqAnswer: yup.string().required("Please enter the FAQ Answer"),
    }),
    onSubmit: async (values) => {
      const faqData = {
        faq_category_id: values.categoryName,
        answer: values.faqAnswer,
        question: values.faqQuestion,
      };
      try {
        let response;
        if (id) {
          response = await editFaq(id, faqData);
          Swal.fire("Success", "FAQ updated successfully", "success");
        } else {
          response = await createFaq(faqData);
          Swal.fire("Success", "FAQ added successfully", "success");
        }
        formik.resetForm();
        navigate("/faqmastertable");
      } catch (error) {
        console.error("Error submitting FAQ:", error);
        Swal.fire("Error", "Failed to submit FAQ. Please try again.", "error");
      }
    },
  });

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Breadcrumb */}
          <Breadcrumbs title="FAQ Registration" breadcrumbItem={id ? "Edit Details" : "Add Details"} />

          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
                  <CardTitle tag="h4">FAQ Information</CardTitle>
                  <p className="card-title-desc mb-4">
                    Fill out the fields below to {id ? "edit" : "register"} your FAQ.
                  </p>

                  <Form onSubmit={formik.handleSubmit} autoComplete="off">
                    <Row>
                      <Col sm="6">
                        <div className="mb-3">
                          <Label htmlFor="categoryName">Category Name</Label>
                          <Input
                            id="categoryName"
                            name="categoryName"
                            type="select"
                            value={formik.values.categoryName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={formik.touched.categoryName && formik.errors.categoryName ? true : false}
                          >
                            <option value="">Select Category Name</option>
                            {categories.map((category) => (
                              <option key={category.faqCategory_id} value={category.faqCategory_id}>
                                {category.category_name}
                              </option>
                            ))}
                          </Input>
                          {formik.touched.categoryName && formik.errors.categoryName && (
                            <FormFeedback>{formik.errors.categoryName}</FormFeedback>
                          )}
                        </div>

                        <div className="mb-3">
                          <Label htmlFor="faqQuestion">FAQ Question</Label>
                          <Input
                            id="faqQuestion"
                            name="faqQuestion"
                            type="text"
                            value={formik.values.faqQuestion}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={formik.touched.faqQuestion && formik.errors.faqQuestion ? true : false}
                          />
                          {formik.touched.faqQuestion && formik.errors.faqQuestion && (
                            <FormFeedback>{formik.errors.faqQuestion}</FormFeedback>
                          )}
                        </div>

                        <div className="mb-3">
                          <Label htmlFor="faqAnswer">FAQ Answer</Label>
                          <Input
                            id="faqAnswer"
                            name="faqAnswer"
                            type="textarea"
                            value={formik.values.faqAnswer}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={formik.touched.faqAnswer && formik.errors.faqAnswer ? true : false}
                          />
                          {formik.touched.faqAnswer && formik.errors.faqAnswer && (
                            <FormFeedback>{formik.errors.faqAnswer}</FormFeedback>
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

export default Faqmaster;
