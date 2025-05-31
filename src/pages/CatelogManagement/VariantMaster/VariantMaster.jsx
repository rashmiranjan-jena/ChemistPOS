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
import { fetchVariantNames,postVariantData } from "../../../ApiService/VarientMaster/VarientMaster";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";

const VariantMaster = () => {
  document.title = "Variant Registration | Skote - React Admin Template";
  const navigate = useNavigate();
  const [fields, setFields] = useState([{ name: "", code: "" }]);
  const [variantNameOptions, setVariantNameOptions] = useState([]);

  useEffect(() => {
    const getVariantNames = async () => {
      try {
        const options = await fetchVariantNames();
        setVariantNameOptions(options);
      } catch (error) {
        console.error("Error fetching variant names:", error);
      }
    };

    getVariantNames();
  }, []);

  const handleAddField = () => {
    setFields([...fields, { name: "", code: "" }]);
  };

  const handleFieldChange = (index, key, value) => {
    const updatedFields = [...fields];
    updatedFields[index][key] = value;
    setFields(updatedFields);
  };

  const handleRemoveField = (index) => {
    const updatedFields = fields.filter((_, i) => i !== index);
    setFields(updatedFields);
  };

  const formik = useFormik({
    initialValues: {
      variantName: "",
      numericField: "", 
    },
    validationSchema: yup.object().shape({
      variantName: yup.string().required("Please select a Variant Name"),
      numericField: yup
        .number()
        .required("Please enter a numeric value")
        .typeError("Please enter a valid number"), 
    }),
    onSubmit: async (values) => {
      try {
        const data = {
          varient_name_id: Number(values.variantName), 
          varient_data: fields,
          order: values.numericField,
        };

        const response = await postVariantData(data);

        if (response) {
          formik.resetForm();
          setFields([{ name: "", code: "" }]);
          navigate("/variantmasterlist"); 
        }
      } catch (error) {
        console.error("Error posting data:", error);
      }
    },
  });

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Breadcrumb */}
          <Breadcrumbs title="Variant Registration" breadcrumbItem="Add Details" />

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
                        {/* Variant Name Field */}
                        <div className="mb-3">
                          <Label htmlFor="variantName">Variant Name</Label>
                          <Input
                            id="variantName"
                            name="variantName"
                            type="select"
                            value={formik.values.variantName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={formik.touched.variantName && formik.errors.variantName ? true : false}
                          >
                            <option value="">Select Variant Name</option>
                            {variantNameOptions.map((option, index) => (
                              <option key={index} value={option.varient_name_id}>
                                {option.display_name}
                              </option>
                            ))}
                          </Input>
                          {formik.touched.variantName && formik.errors.variantName && (
                            <FormFeedback>{formik.errors.variantName}</FormFeedback>
                          )}
                        </div>

                        {/* New Numeric Field */}
                        <div className="mb-3">
                          <Label htmlFor="numericField">Numeric Field</Label>
                          <Input
                            id="numericField"
                            name="numericField"
                            type="number"
                            value={formik.values.numericField}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={formik.touched.numericField && formik.errors.numericField ? true : false}
                          />
                          {formik.touched.numericField && formik.errors.numericField && (
                            <FormFeedback>{formik.errors.numericField}</FormFeedback>
                          )}
                        </div>

                        {/* Fields for Name and Code */}
                        <div className="mb-3">
                          <Label>Name</Label>
                          {fields.map((field, index) => (
                            <div key={index} className="d-flex align-items-center mb-2">
                              <Input
                                type="text"
                                value={field.name}
                                onChange={(e) => handleFieldChange(index, "name", e.target.value)}
                                placeholder={`Field Name ${index + 1}`}
                                className="me-2"
                              />
                              <Input
                                type="text"
                                value={field.code}
                                onChange={(e) => handleFieldChange(index, "code", e.target.value)}
                                placeholder={`Code ${index + 1}`}
                                className="me-2"
                              />
                              <Button
                                color="danger"
                                onClick={() => handleRemoveField(index)}
                                disabled={fields.length === 1}
                              >
                                -
                              </Button>
                            </div>
                          ))}
                          <Button
                            color="primary"
                            onClick={handleAddField}
                            className="mt-2"
                          >
                            + Add Field
                          </Button>
                        </div>
                      </Col>
                    </Row>

                    {/* Submit and Cancel Buttons */}
                    <div className="d-flex flex-wrap gap-2">
                      <Button type="submit" color="primary">
                        Submit
                      </Button>
                      <Button
                        type="button"
                        color="secondary"
                        onClick={() => {
                          formik.resetForm();
                          setFields([{ name: "", code: "" }]);
                        }}
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

export default VariantMaster;
