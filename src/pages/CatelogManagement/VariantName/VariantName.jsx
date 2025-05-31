import React from "react";
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
import Swal from "sweetalert2";
import { submitFormData } from "../../../ApiService/VarientName/VarientName";
import { useNavigate } from "react-router-dom";
const VariantName = () => {
  document.title = "Variant Registration";
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      unit_name: "",
      display_name: "",
    },
    validationSchema: yup.object().shape({
      unit_name: yup.string().required("Please enter the Unit Name"),
      display_name: yup.string().required("Please enter the Display Name"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await submitFormData(values);
        if (response.status === 201) {
          Swal.fire({
            title: "Success!",
            text: "Variant has been registered successfully.",
            icon: "success",
            confirmButtonText: "OK",
          });

          resetForm();
          navigate("/variantnamelist");
        } else {
          Swal.fire({
            title: "Error!",
            text: "Unexpected response from the server.",
            icon: "warning",
            confirmButtonText: "OK",
          });
        }
      } catch (error) {
        console.error("Error submitting form data:", error);
        Swal.fire({
          title: "Error!",
          text: "Something went wrong. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    },
  });

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
                  <CardTitle tag="h4">Variant Information</CardTitle>
                  <p className="card-title-desc mb-4">
                    Fill out the fields below to register your variant.
                  </p>

                  <Form onSubmit={formik.handleSubmit} autoComplete="off">
                    <Row>
                      <Col sm="6">
                        <div className="mb-3">
                          <Label htmlFor="unit_name">Unit Name</Label>
                          <Input
                            id="unit_name"
                            name="unit_name"
                            type="text"
                            value={formik.values.unit_name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={
                              formik.touched.unit_name &&
                              formik.errors.unit_name
                            }
                          />
                          {formik.touched.unit_name &&
                            formik.errors.unit_name && (
                              <FormFeedback>
                                {formik.errors.unit_name}
                              </FormFeedback>
                            )}
                        </div>

                        <div className="mb-3">
                          <Label htmlFor="display_name">Display Name</Label>
                          <Input
                            id="display_name"
                            name="display_name"
                            type="text"
                            value={formik.values.display_name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={
                              formik.touched.display_name &&
                              formik.errors.display_name
                            }
                          />
                          {formik.touched.display_name &&
                            formik.errors.display_name && (
                              <FormFeedback>
                                {formik.errors.display_name}
                              </FormFeedback>
                            )}
                        </div>
                      </Col>
                    </Row>

                    <div className="d-flex flex-wrap gap-2">
                      <Button type="submit" color="primary">
                        Submit
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

export default VariantName;
