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
import axios from "axios";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom"; // Import useLocation

const PolicyMaster = () => {
  document.title = "Policy Registration";
  const location = useLocation(); // Get location to access state
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [selectedPolicies, setSelectedPolicies] = useState([]);
  const [selectedClauses, setSelectedClauses] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false); // Track edit mode
  const [policyId, setPolicyId] = useState(null); // Store the policy ID for editing

  useEffect(() => {
    // Check if we're in edit mode by looking at location.state
    if (location.state?.id) {
      setIsEditMode(true);
      setPolicyId(location.state.id);
      fetchPolicyData(location.state.id);
    }

    // Fetch brands
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}api/brand-master/`)
      .then((response) => {
        const brandList = response.data.map((item) => ({
          id: item.brand_details.brand_id,
          name: item.brand_details.brand_name,
        }));
        setBrands(brandList);
      })
      .catch((error) => console.error("Error fetching brands:", error));

    // Fetch categories
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}api/category-name/`)
      .then((response) => setCategories(response.data))
      .catch((error) => console.error("Error fetching categories:", error));

    // Fetch subcategories
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}api/subcategory-master/`)
      .then((response) => setSubcategories(response.data))
      .catch((error) => console.error("Error fetching subcategories:", error));

    // Fetch policies
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}api/policy-names/`)
      .then((response) => {
        const normalizedPolicies = response.data.map((policy) => ({
          id: policy.policyName_id,
          policyName: policy.policyName,
          clauses: policy.clauses.map((clause) => ({
            id: clause.id || Math.random(),
            clauseName: clause.clauseName || clause.clause_name,
            numberOfDays: clause.numberOfDays || clause.number_of_days,
            penalty: clause.penalty || clause.penalty_amount,
          })),
          status: policy.status,
        }));
        setPolicies(normalizedPolicies);
      })
      .catch((error) => console.error("Error fetching policies:", error));
  }, [location.state]);

  // Function to fetch policy data for editing
  const fetchPolicyData = async (id) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}api/policy-master/${id}/`
      );
      const policyData = response.data;

      // Pre-populate formik values
      formik.setValues({
        brand: policyData.brand_name_id || "",
        category: policyData.category_name_id || "",
        subcategory: policyData.sub_category_name_id || "",
        policyName: policyData.policies.map((p) => p.policy_name_id) || [],
      });

      // Set selected policies and clauses
      setSelectedPolicies(policyData.policies.map((p) => p.policy_name_id));
      setSelectedClauses(
        policyData.policies.flatMap((p) =>
          p.clauses.map((c) => c.id || Math.random())
        )
      );
    } catch (error) {
      console.error("Error fetching policy data:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load policy data.",
      });
    }
  };

  const formik = useFormik({
    initialValues: {
      brand: "",
      category: "",
      subcategory: "",
      policyName: [],
      clauses: [],
    },
    validationSchema: yup.object().shape({
      brand: yup.string().required("Please select a Brand"),
      category: yup.string().required("Please select a Category"),
      subcategory: yup.string().required("Please select a Subcategory"),
      policyName: yup
        .array()
        .min(1, "Please select at least one policy")
        .required("Please select the Policy Name"),
    }),
    onSubmit: async (values) => {
      const payload = {
        brand_name_id: values.brand,
        category_name_id: values.category,
        sub_category_name_id: values.subcategory,
        policies: selectedPolicies.map((policyId) => ({
          policy_name_id: policyId,
          policy_name: policies.find((policy) => policy.id === policyId)
            ?.policyName,
          clauses: selectedClauses
            .filter((clauseId) =>
              policies
                .find((policy) => policy.id === policyId)
                ?.clauses.some((clause) => clause.id === clauseId)
            )
            .map((clauseId) => {
              const clause = policies
                .flatMap((policy) => policy.clauses)
                .find((clause) => clause.id === clauseId);
              return {
                clause_name: clause.clauseName,
                number_of_days: clause.numberOfDays,
                penalty: clause.penalty,
              };
            }),
        })),
      };

      try {
        let response;
        if (isEditMode) {
          // Update existing policy (PUT request)
          response = await axios.put(
            `${import.meta.env.VITE_API_BASE_URL}api/policy-master/${policyId}/`,
            payload
          );
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Policy updated successfully!",
            confirmButtonColor: "#3085d6",
          });
        } else {
          // Create new policy (POST request)
          response = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}api/policy-master/`,
            payload
          );
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Policy registered successfully!",
            confirmButtonColor: "#3085d6",
          });
        }
        console.log("Data processed successfully:", response.data);
        formik.resetForm();
        setSelectedPolicies([]);
        setSelectedClauses([]);
      } catch (error) {
        console.error("Error processing data:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: `Failed to ${isEditMode ? "update" : "register"} policy. Please try again.`,
          confirmButtonColor: "#d33",
        });
      }
    },
  });

  const handlePolicyCheckboxChange = (policyId) => {
    let newSelectedPolicies;
    if (selectedPolicies.includes(policyId)) {
      newSelectedPolicies = selectedPolicies.filter((id) => id !== policyId);
      setSelectedClauses((prevClauses) =>
        prevClauses.filter(
          (clause) =>
            !policies
              .find((policy) => policy.id === policyId)
              ?.clauses.some((cl) => cl.id === clause)
        )
      );
    } else {
      newSelectedPolicies = [...selectedPolicies, policyId];
      const clausesToAdd = policies
        .find((policy) => policy.id === policyId)
        ?.clauses.map((clause) => clause.id);
      setSelectedClauses((prevClauses) => [...prevClauses, ...clausesToAdd]);
    }
    setSelectedPolicies(newSelectedPolicies);
    formik.setFieldValue("policyName", newSelectedPolicies);
  };

  const handleClauseCheckboxChange = (clauseId) => {
    setSelectedClauses((prev) =>
      prev.includes(clauseId)
        ? prev.filter((id) => id !== clauseId)
        : [...prev, clauseId]
    );
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Policy Registration"
            breadcrumbItem={isEditMode ? "Edit Policy" : "Add Policy"}
          />
          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
                  <CardTitle tag="h4">
                    {isEditMode ? "Edit Policy" : "Policy Information"}
                  </CardTitle>
                  <p className="card-title-desc mb-4">
                    {isEditMode
                      ? "Update the fields below to edit the policy."
                      : "Fill out the fields below to register your policy."}
                  </p>

                  <Form onSubmit={formik.handleSubmit} autoComplete="off">
                    <Row>
                      <Col sm="6">
                        <div className="mb-3">
                          <Label htmlFor="brand">Brand</Label>
                          <Input
                            id="brand"
                            name="brand"
                            type="select"
                            value={formik.values.brand}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={
                              formik.touched.brand && formik.errors.brand
                            }
                          >
                            <option value="">Select Brand</option>
                            {brands.map((brand) => (
                              <option key={brand.id} value={brand.id}>
                                {brand.name}
                              </option>
                            ))}
                          </Input>
                          {formik.touched.brand && formik.errors.brand && (
                            <FormFeedback>{formik.errors.brand}</FormFeedback>
                          )}
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
                            {categories.map((category) => (
                              <option
                                key={category.category_name_id}
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

                        <div className="mb-3">
                          <Label htmlFor="subcategory">Subcategory</Label>
                          <Input
                            id="subcategory"
                            name="subcategory"
                            type="select"
                            value={formik.values.subcategory}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={
                              formik.touched.subcategory &&
                              formik.errors.subcategory
                            }
                          >
                            <option value="">Select Subcategory</option>
                            {subcategories.map((subcategory) => (
                              <option
                                key={
                                  subcategory.sub_category_details
                                    .sub_category_id
                                }
                                value={
                                  subcategory.sub_category_details
                                    .sub_category_id
                                }
                              >
                                {
                                  subcategory.sub_category_details
                                    .sub_category_name
                                }
                              </option>
                            ))}
                          </Input>
                          {formik.touched.subcategory &&
                            formik.errors.subcategory && (
                              <FormFeedback>
                                {formik.errors.subcategory}
                              </FormFeedback>
                            )}
                        </div>

                        <div className="mb-3">
                          <Label htmlFor="policyName">Policy Name</Label>
                          <Input
                            id="policyName"
                            name="policyName"
                            type="text"
                            value={selectedPolicies
                              .map(
                                (policyId) =>
                                  policies.find(
                                    (policy) => policy.id === policyId
                                  )?.policyName
                              )
                              .join(", ")}
                            readOnly
                            invalid={
                              formik.touched.policyName &&
                              formik.errors.policyName
                            }
                          />
                          {formik.touched.policyName &&
                            formik.errors.policyName && (
                              <FormFeedback>
                                {formik.errors.policyName}
                              </FormFeedback>
                            )}
                        </div>

                        <div className="mb-3">
                          {policies.map((policy) => (
                            <div key={policy.id} className="mb-2">
                              <Input
                                type="checkbox"
                                id={`policy-${policy.id}`}
                                checked={selectedPolicies.includes(policy.id)}
                                onChange={() =>
                                  handlePolicyCheckboxChange(policy.id)
                                }
                              />
                              <Label
                                htmlFor={`policy-${policy.id}`}
                                className="ml-2"
                              >
                                {policy.policyName}
                              </Label>

                              {selectedPolicies.includes(policy.id) && (
                                <div className="ml-4 mt-2">
                                  {policy.clauses.map((clause) => (
                                    <div key={clause.id} className="mb-1">
                                      <Input
                                        type="checkbox"
                                        id={`clause-${clause.id}`}
                                        checked={selectedClauses.includes(
                                          clause.id
                                        )}
                                        onChange={() =>
                                          handleClauseCheckboxChange(clause.id)
                                        }
                                      />
                                      <Label
                                        htmlFor={`clause-${clause.id}`}
                                        className="ml-2"
                                      >
                                        {clause.clauseName} (Days:{" "}
                                        {clause.numberOfDays}, Penalty:{" "}
                                        {clause.penalty})
                                      </Label>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </Col>
                    </Row>

                    <div className="d-flex flex-wrap gap-2">
                      <Button type="submit" color="primary">
                        {isEditMode ? "Update" : "Submit"}
                      </Button>
                      <Button
                        type="button"
                        color="secondary"
                        onClick={() => {
                          formik.resetForm();
                          setSelectedPolicies([]);
                          setSelectedClauses([]);
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

export default PolicyMaster;