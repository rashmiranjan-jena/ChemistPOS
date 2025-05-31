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
import { createPolicy, getPolicyById, updatePolicy } from "../../../ApiService/Policy/ProductPolicy/ProductPolicy";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";

const PolicyName = () => {
  document.title = "Policy Registration";
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location.state || {};
  console.log(id)
  
  const [clauses, setClauses] = useState([{ name: "", days: "", penalty: "" }]);

  const formik = useFormik({
    initialValues: {
      policy: "",
      clauses: [{ name: "", days: "", penalty: "" }],
    },
    validationSchema: yup.object().shape({
      policy: yup.string().required("Please enter the Policy"),
      clauses: yup.array().of(
        yup.object().shape({
          name: yup.string().required("Please enter the Clause Name"),
          days: yup.string().required("Please enter the Number of Days"),
          penalty: yup.string().required("Please enter the Penalty for Clause"),
        })
      ),
    }),
    onSubmit: async (values) => {
      const payload = {
        policyName: values.policy,
        clauses: values.clauses.map((clause) => ({
          clause_name: clause.name,
          number_of_days: clause.days,
          penalty_amount: clause.penalty,
        })),
      };
  
      try {
        if (id) {
          await updatePolicy(id, payload);
          Swal.fire({
            icon: 'success',
            title: 'Policy Updated Successfully!',
            text: `The policy has been updated successfully.`,
          });
        } else {
          const response = await createPolicy(payload);
          Swal.fire({
            icon: 'success',
            title: 'Policy Created Successfully!',
            text: `The policy has been created with ID: ${response.id}`,
          });
        }
  
        formik.resetForm();
        navigate("/policynamelist");
      } catch (error) {
        console.error("Failed to submit policy:", error);
        Swal.fire({
          icon: 'error',
          title: `Failed to ${id ? 'Update' : 'Create'} Policy`,
          text: `There was an error ${id ? 'updating' : 'creating'} the policy. Please try again later.`,
        });
      }
    },
  });

  useEffect(() => {
    if (id) {
      const fetchPolicy = async () => {
        try {
          const policy = await getPolicyById(id);
          formik.setValues({
            policy: policy.policyName,
            clauses: policy.clauses.map((clause) => ({
              name: clause.clause_name,
              days: clause.number_of_days,
              penalty: clause.penalty_amount,
            })),
          });
        } catch (error) {
          console.error("Failed to fetch policy:", error);
        }
      };

      fetchPolicy();
    }
  }, [id]);

  const handleClauseChange = (index, event) => {
    const updatedClauses = [...formik.values.clauses];
    updatedClauses[index][event.target.name] = event.target.value;
    formik.setFieldValue("clauses", updatedClauses);
  };

  const addClauseField = () => {
    const updatedClauses = [...formik.values.clauses, { name: "", days: "", penalty: "" }];
    formik.setFieldValue("clauses", updatedClauses);
  };

  const removeClauseField = (index) => {
    const updatedClauses = formik.values.clauses.filter((_, i) => i !== index);
    formik.setFieldValue("clauses", updatedClauses);
  };

  return (
    <React.Fragment>
    <div className="page-content">
      <Container fluid>
        {/* Breadcrumb */}
        <Breadcrumbs title="Policy Registration" breadcrumbItem={id ? "Edit Policy" : "Add Policy"} />
  
        <Row>
          <Col xs="12">
            <Card>
              <CardBody>
                <CardTitle tag="h4">Policy Information</CardTitle>
                <p className="card-title-desc mb-4">
                  Fill out the fields below to {id ? "edit" : "register"} your policy.
                </p>
  
                <Form onSubmit={formik.handleSubmit} autoComplete="off">
                  <Row>
                    <Col sm="6">
                      <div className="mb-3">
                        <Label htmlFor="policy">Policy Name</Label>
                        <Input
                          id="policy"
                          name="policy"
                          type="text"
                          value={formik.values.policy}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          invalid={
                            formik.touched.policy && formik.errors.policy
                              ? true
                              : false
                          }
                          placeholder="Enter Policy Name"
                        />
                        {formik.touched.policy && formik.errors.policy && (
                          <FormFeedback>{formik.errors.policy}</FormFeedback>
                        )}
                      </div>
  
                      <div className="mb-3">
                        <Label htmlFor="clauses">Clauses</Label>
                        {formik.values.clauses.map((clause, index) => (
                          <div key={index} className="mb-2">
                            <div className="d-flex align-items-center gap-2">
                              <Input
                                type="text"
                                name="name"
                                placeholder="Clause Name"
                                value={clause.name}
                                onChange={(e) => handleClauseChange(index, e)}
                                onBlur={formik.handleBlur}
                                invalid={
                                  formik.touched.clauses?.[index]?.name &&
                                  formik.errors.clauses?.[index]?.name
                                    ? true
                                    : false
                                }
                                className="flex-grow-1"
                                style={{ minWidth: "140px" }}
                              />
                              <Input
                                type="text"
                                name="days"
                                placeholder="Number of Days"
                                value={clause.days}
                                onChange={(e) => handleClauseChange(index, e)}
                                onBlur={formik.handleBlur}
                                invalid={
                                  formik.touched.clauses?.[index]?.days &&
                                  formik.errors.clauses?.[index]?.days
                                    ? true
                                    : false
                                }
                                className="flex-grow-1"
                                style={{ minWidth: "140px" }} 
                              />
                              <Input
                                type="number"
                                name="penalty"
                                placeholder="Penalty"
                                value={clause.penalty}
                                onChange={(e) => handleClauseChange(index, e)}
                                onBlur={formik.handleBlur}
                                invalid={
                                  formik.touched.clauses?.[index]?.penalty &&
                                  formik.errors.clauses?.[index]?.penalty
                                    ? true
                                    : false
                                }
                                className="flex-grow-1"
                                style={{ minWidth: "140px" }}
                              />
                              <Button
                                color="danger"
                                onClick={() => removeClauseField(index)}
                                disabled={formik.values.clauses.length <= 1}
                              >
                                Remove
                              </Button>
                            </div>
                            {index === formik.values.clauses.length - 1 && (
                              <Button
                                color="primary"
                                onClick={addClauseField}
                                className="mt-2"
                              >
                                Add Clause
                              </Button>
                            )}
                          </div>
                        ))}
                        {formik.touched.clauses && formik.errors.clauses && (
                          <FormFeedback>{formik.errors.clauses}</FormFeedback>
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

export default PolicyName;
