import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useNavigate, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { FaCheckCircle, FaRegCircle } from "react-icons/fa";
import Swal from "sweetalert2";

const validationSchema = Yup.object().shape({
  auto_application: Yup.string()
    .required("Auto-Application selection is required")
    .oneOf(["Seller Type", "Customer Type"], "Invalid auto-application type"),
  selected_types: Yup.array().when(
    "auto_application",
    (autoApplication, schema) => {
      return autoApplication === "Seller Type" ||
        autoApplication === "Customer Type"
        ? schema.min(1, "Please select at least one type")
        : schema.notRequired();
    }
  ),
});

const DiscountMasterForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [typeOptions, setTypeOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [discountId, setDiscountId] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const { state } = location;
    if (state?.id) {
      setIsEditMode(true);
      setDiscountId(state.id);
      fetchDiscountData(state.id);
    }
  }, [location]);

  const fetchDiscountData = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}api/discounts/${id}`);
      const data = response.data;

      formik.setValues({
        discount_type: data.discount_type || "",
        discount_percentage: data.discount_percentage || "",
        auto_application: data.auto_application || "",
        selected_types: data.selected_types
          ? data.selected_types.split(",")
          : [],
      });

      if (data.auto_application) {
        fetchTypes(data.auto_application);
      }
    } catch (err) {
      console.error("Error fetching discount data:", err);
      Swal.fire({
        title: "Error!",
        text: "Failed to load discount data. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const fetchTypes = async (autoApplication) => {
    if (!autoApplication) {
      setTypeOptions([]);
      formik.setFieldValue("selected_types", []);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let endpoint;
      switch (autoApplication) {
        case "Seller Type":
          endpoint = "api/seller-type/";
          break;
        case "Customer Type":
          endpoint = "api/customer-type/";
          break;
        default:
          throw new Error("Invalid auto-application type");
      }

      const response = await axios.get(`${API_BASE_URL}${endpoint}`);
      const data = Array.isArray(response.data) ? response.data : [];
      setTypeOptions(data);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Failed to fetch types. Please try again.");
      setTypeOptions([]);
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      discount_type: "",
      discount_percentage: "",
      auto_application: "",
      selected_types: [],
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const payload = {
          discount_type: values.discount_type,
          discount_percentage: values.discount_percentage,
          auto_applicable_type: values.auto_application,
        };
    
        if (values.auto_application === "Seller Type") {
          payload.seller_applicable_id = values.selected_types;
        } else if (values.auto_application === "Customer Type") {
          payload.customer_applicable_id = values.selected_types;
        }
    
        let response;
        let endpoint;
    
        // Determine the endpoint based on auto_application
        if (values.auto_application === "Seller Type") {
          endpoint = `${API_BASE_URL}api/seller-discounts/`;
        } else if (values.auto_application === "Customer Type") {
          endpoint = `${API_BASE_URL}api/customer-discounts/`;
        } else {
          throw new Error("Invalid auto-application type");
        }
    
        if (isEditMode) {
          // For edit mode, append the discountId to the endpoint
          response = await axios.put(`${endpoint}${discountId}`, payload);
          Swal.fire({
            title: "Discount Updated!",
            text: "The discount has been successfully updated.",
            icon: "success",
            confirmButtonText: "OK",
          });
        } else {
          // For create mode, use the base endpoint
          response = await axios.post(endpoint, payload);
          Swal.fire({
            title: "Discount Created!",
            text: "The discount has been successfully created.",
            icon: "success",
            confirmButtonText: "OK",
          });
        }
    
        if (response) {
          navigate("/discount-master-list");
        }
      } catch (error) {
        console.error("Submission Error:", error);
        Swal.fire({
          title: "Error!",
          text: error.response?.data?.message || "Failed to submit discount details. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    },
  });

  useEffect(() => {
    if (formik.values.auto_application) {
      fetchTypes(formik.values.auto_application);
    }
  }, [formik.values.auto_application]);

  const handleTypeSelection = (selectedId) => {
    const newSelectedTypes = formik.values.selected_types.includes(selectedId)
      ? formik.values.selected_types.filter((id) => id !== selectedId)
      : [...formik.values.selected_types, selectedId];
    formik.setFieldValue("selected_types", newSelectedTypes);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Discount Management"
            breadcrumbItem={isEditMode ? "Edit Discount" : "Add Discount"}
          />
          <Row>
            <Col xs="12">
              <Card
                className="shadow-lg"
                style={{ borderRadius: "15px", overflow: "hidden" }}
              >
                <CardBody className="p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4
                      className="text-primary"
                      style={{
                        fontWeight: "700",
                        letterSpacing: "1px",
                        background: "linear-gradient(90deg, #007bff, #00c4cc)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {isEditMode ? "Edit Discount" : "Add Discount"}
                    </h4>
                    <Button
                      color="secondary"
                      onClick={() => navigate(-1)}
                      style={{
                        height: "35px",
                        width: "35px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%",
                        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                        transition: "transform 0.3s ease",
                      }}
                      className="hover-scale"
                      title="Back"
                    >
                      <i
                        className="bx bx-undo"
                        style={{ fontSize: "30px" }}
                      ></i>
                    </Button>
                  </div>

                  <Form onSubmit={formik.handleSubmit}>
                    <Row className="g-4">
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="discount_type"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Discount Type
                          </Label>
                          <Input
                            type="text"
                            name="discount_type"
                            id="discount_type"
                            value={formik.values.discount_type}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.discount_type &&
                              formik.errors.discount_type
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                            placeholder="Enter discount type (Fixed, Percentage, or Promotional)"
                          />
                          {formik.touched.discount_type &&
                            formik.errors.discount_type && (
                              <div className="invalid-feedback">
                                {formik.errors.discount_type}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="discount_percentage"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Discount Percentage (%)
                          </Label>
                          <Input
                            type="number"
                            name="discount_percentage"
                            id="discount_percentage"
                            placeholder="Enter percentage (0-100)"
                            value={formik.values.discount_percentage}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.discount_percentage &&
                              formik.errors.discount_percentage
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                            min="0"
                            max="100"
                            step="0.01"
                          />
                          {formik.touched.discount_percentage &&
                            formik.errors.discount_percentage && (
                              <div className="invalid-feedback">
                                {formik.errors.discount_percentage}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      <Col md="12">
                        <FormGroup>
                          <Label
                            for="auto_application"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Auto-Application Based On
                          </Label>
                          <Input
                            type="select"
                            name="auto_application"
                            id="auto_application"
                            value={formik.values.auto_application}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.auto_application &&
                              formik.errors.auto_application
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          >
                            <option value="">
                              Select Auto-Application Type
                            </option>
                            <option value="Seller Type">Seller Type</option>
                            <option value="Customer Type">Customer Type</option>
                          </Input>
                          {formik.touched.auto_application &&
                            formik.errors.auto_application && (
                              <div className="invalid-feedback">
                                {formik.errors.auto_application}
                              </div>
                            )}
                        </FormGroup>
                        {formik.values.auto_application && (
                          <div className="type-options mt-3">
                            {loading && (
                              <div className="text-muted">Loading types...</div>
                            )}
                            {error && (
                              <div className="text-danger">{error}</div>
                            )}
                            {!loading &&
                              !error &&
                              Array.isArray(typeOptions) &&
                              typeOptions.length > 0 && (
                                <div className="d-flex flex-wrap gap-2">
                                  {typeOptions.map((option) => (
                                    <div
                                      key={option.id}
                                      className={`type-option ${
                                        formik.values.selected_types.includes(
                                          option.id
                                        )
                                          ? "selected"
                                          : ""
                                      }`}
                                      onClick={() =>
                                        handleTypeSelection(option.id)
                                      }
                                    >
                                      {formik.values.selected_types.includes(
                                        option.id
                                      ) ? (
                                        <FaCheckCircle
                                          className="me-2"
                                          style={{
                                            color: "#fff",
                                            fontSize: "0.8rem",
                                          }}
                                        />
                                      ) : (
                                        <FaRegCircle
                                          className="me-2"
                                          style={{
                                            color: "#adb5bd",
                                            fontSize: "0.8rem",
                                          }}
                                        />
                                      )}
                                      {formik.values.auto_application ===
                                      "Seller Type"
                                        ? option.seller_type || "N/A"
                                        : option.customer_type || "N/A"}
                                    </div>
                                  ))}
                                </div>
                              )}
                            {!loading &&
                              !error &&
                              (!Array.isArray(typeOptions) ||
                                typeOptions.length === 0) && (
                                <div className="text-muted">
                                  No types available.
                                </div>
                              )}
                            {formik.touched.selected_types &&
                              formik.errors.selected_types && (
                                <div className="invalid-feedback d-block">
                                  {formik.errors.selected_types}
                                </div>
                              )}
                          </div>
                        )}
                      </Col>

                      <Col md="12" className="text-end">
                        <Button
                          type="submit"
                          color="primary"
                          disabled={formik.isSubmitting}
                          style={{
                            padding: "10px 25px",
                            borderRadius: "8px",
                            boxShadow: "0 4px 10px rgba(0, 123, 255, 0.3)",
                            transition: "transform 0.3s ease",
                          }}
                          className="hover-scale"
                        >
                          {formik.isSubmitting
                            ? "Submitting..."
                            : isEditMode
                            ? "Update"
                            : "Submit"}
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <style jsx>{`
        .hover-scale:hover {
          transform: scale(1.05) !important;
        }
        .form-control:focus {
          border-color: #007bff;
          box-shadow: 0 0 8px rgba(0, 123, 255, 0.3);
        }
        .invalid-feedback {
          font-size: 12px;
          color: #dc3545;
        }
        .type-options {
          margin-top: 10px;
        }
        .type-option {
          display: inline-flex;
          align-items: center;
          padding: 8px 12px;
          border: 1px solid #e0e0e0;
          border-radius: 20px;
          background: #f8f9fa;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 13px;
          color: #333;
        }
        .type-option:hover {
          background: #e6f3ff;
          border-color: #007bff;
        }
        .type-option.selected {
          background: #007bff;
          color: #fff;
          border-color: #007bff;
        }
        @media (max-width: 768px) {
          .type-option {
            padding: 6px 10px;
            font-size: 12px;
          }
        }
      `}</style>
    </React.Fragment>
  );
};

export default DiscountMasterForm;