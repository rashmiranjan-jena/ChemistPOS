import React, { useState } from "react";
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

const BulkOrder = () => {
  document.title = "Bulk Order";

  const formik = useFormik({
    initialValues: {
      supplierName: "",
      invoiceNo: "",
      uploadInvoice: null,
    },
    validationSchema: yup.object().shape({
      supplierName: yup.string().required("Please select a Supplier"),
      invoiceNo: yup
        .string()
        .matches(/^[a-zA-Z0-9]*$/, "Invoice No must contain only alphanumeric characters")
        .required("Please enter the Invoice No"),
      uploadInvoice: yup
        .mixed()
        .required("Please upload the Invoice")
        .test(
          "fileType",
          "Only PDF or DOCX files are allowed",
          (value) =>
            value &&
            ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(value.type)
        ),
    }),
    onSubmit: (values) => {
      console.log("Form Submitted", values);
      formik.resetForm();
    },
  });

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Breadcrumb */}
          <Breadcrumbs title="Bulk Order" breadcrumbItem="Add Details" />

          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
                  <CardTitle tag="h4">Bulk Order Information</CardTitle>
                  <p className="card-title-desc mb-4">
                    Fill out the fields below to register bulk order details.
                  </p>

                  <Form onSubmit={formik.handleSubmit} autoComplete="off">
                    <Row>
                      <Col sm="6">
                        {/* Supplier Name Dropdown */}
                        <div className="mb-3">
                          <Label htmlFor="supplierName">Supplier Name</Label>
                          <Input
                            id="supplierName"
                            name="supplierName"
                            type="select"
                            value={formik.values.supplierName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={
                              formik.touched.supplierName && formik.errors.supplierName
                                ? true
                                : false
                            }
                          >
                            <option value="">Select Supplier</option>
                            <option value="Supplier1">Supplier 1</option>
                            <option value="Supplier2">Supplier 2</option>
                            <option value="Supplier3">Supplier 3</option>
                          </Input>
                          {formik.touched.supplierName && formik.errors.supplierName && (
                            <FormFeedback>{formik.errors.supplierName}</FormFeedback>
                          )}
                        </div>

                        {/* Invoice No */}
                        <div className="mb-3">
                          <Label htmlFor="invoiceNo">Invoice No</Label>
                          <Input
                            id="invoiceNo"
                            name="invoiceNo"
                            type="text"
                            value={formik.values.invoiceNo}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={
                              formik.touched.invoiceNo && formik.errors.invoiceNo
                                ? true
                                : false
                            }
                          />
                          {formik.touched.invoiceNo && formik.errors.invoiceNo && (
                            <FormFeedback>{formik.errors.invoiceNo}</FormFeedback>
                          )}
                        </div>

                        {/* Upload Invoice */}
                        <div className="mb-3">
                          <Label htmlFor="uploadInvoice">Upload Invoice</Label>
                          <Input
                            id="uploadInvoice"
                            name="uploadInvoice"
                            type="file"
                            onChange={(event) => {
                              formik.setFieldValue(
                                "uploadInvoice",
                                event.currentTarget.files[0]
                              );
                            }}
                            onBlur={formik.handleBlur}
                            invalid={
                              formik.touched.uploadInvoice && formik.errors.uploadInvoice
                                ? true
                                : false
                            }
                          />
                          {formik.touched.uploadInvoice && formik.errors.uploadInvoice && (
                            <FormFeedback>{formik.errors.uploadInvoice}</FormFeedback>
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

export default BulkOrder;
