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
import Dropzone from "react-dropzone";
import * as yup from "yup";
import { useFormik } from "formik";

// Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb";

const PackUnitMaster = () => {
  document.title = "Brand Registration | Skote - React Admin Template";

  const [selectedFiles, setSelectedFiles] = useState([]);

  function handleAcceptedFiles(files) {
    const updatedFiles = files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
    setSelectedFiles([...selectedFiles, ...updatedFiles]);
  }

  const formik = useFormik({
    initialValues: {
      brandName: "",
      brandCode: "",
      aboutBrand: "",
      brandLogo: null,
      brandImages: [],
    },
    validationSchema: yup.object().shape({
      brandName: yup.string().required("Please enter the Brand Name"),
      brandCode: yup.string().required("Please enter the Brand Code"),
      aboutBrand: yup.string(),
      brandLogo: yup
        .mixed()
        .required("Please upload the Brand Logo"),
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
          <Breadcrumbs
            title="Brand Registration"
            breadcrumbItem="Add Details"
          />

          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
                  <CardTitle tag="h4">Brand Information</CardTitle>
                  <p className="card-title-desc mb-4">
                    Fill out the fields below to register your brand.
                  </p>

                  <Form onSubmit={formik.handleSubmit} autoComplete="off">
                    <Row>
                      <Col sm="6">
                        <div className="mb-3">
                          <Label htmlFor="brandName">Brand Name</Label>
                          <Input
                            id="brandName"
                            name="brandName"
                            type="text"
                            value={formik.values.brandName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={
                              formik.touched.brandName && formik.errors.brandName
                                ? true
                                : false
                            }
                          />
                          {formik.touched.brandName && formik.errors.brandName && (
                            <FormFeedback>{formik.errors.brandName}</FormFeedback>
                          )}
                        </div>

                        <div className="mb-3">
                          <Label htmlFor="brandCode">Brand Code</Label>
                          <Input
                            id="brandCode"
                            name="brandCode"
                            type="text"
                            value={formik.values.brandCode}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={
                              formik.touched.brandCode && formik.errors.brandCode
                                ? true
                                : false
                            }
                          />
                          {formik.touched.brandCode && formik.errors.brandCode && (
                            <FormFeedback>{formik.errors.brandCode}</FormFeedback>
                          )}
                        </div>

                        <div className="mb-3">
                          <Label htmlFor="aboutBrand">About Brand (Optional)</Label>
                          <Input
                            id="aboutBrand"
                            name="aboutBrand"
                            type="textarea"
                            value={formik.values.aboutBrand}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                        </div>

                        <div className="mb-3">
                          <Label htmlFor="brandLogo">Brand Logo</Label>
                          <Input
                            id="brandLogo"
                            name="brandLogo"
                            type="file"
                            onChange={(event) =>
                              formik.setFieldValue(
                                "brandLogo",
                                event.currentTarget.files[0]
                              )
                            }
                            onBlur={formik.handleBlur}
                            invalid={
                              formik.touched.brandLogo && formik.errors.brandLogo
                                ? true
                                : false
                            }
                          />
                          {formik.touched.brandLogo && formik.errors.brandLogo && (
                            <FormFeedback>{formik.errors.brandLogo}</FormFeedback>
                          )}
                        </div>
                      </Col>

                      <Col sm="6">
                        <div className="mb-3">
                          <Label>Brand Images (Optional)</Label>
                          <Dropzone onDrop={handleAcceptedFiles}>
                            {({ getRootProps, getInputProps }) => (
                              <div
                                className="dropzone"
                                {...getRootProps()}
                              >
                                <input {...getInputProps()} />
                                <div className="text-center">
                                  <i className="mdi mdi-plus-circle-outline font-size-24"></i>
                                  <p>Add Images</p>
                                </div>
                              </div>
                            )}
                          </Dropzone>
                          <div className="mt-3">
                            {selectedFiles.map((file, index) => (
                              <img
                                key={index}
                                src={file.preview}
                                alt="Preview"
                                className="img-thumbnail me-2"
                                style={{ width: "50px", height: "50px" }}
                              />
                            ))}
                          </div>
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

export default PackUnitMaster;
