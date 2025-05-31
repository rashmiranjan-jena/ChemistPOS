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
import {
  postGST,
  getGSTById,
  updateGST,
} from "../../../ApiService/GST/GstMaster";
import { getProductTypes } from "../../../ApiService/Drugs/ProductType";
import Swal from "sweetalert2";

const validationSchema = Yup.object().shape({
  gstValue: Yup.number()
    .required("GST Value is required")
    .min(0, "GST Value cannot be negative")
    .max(100, "GST Value cannot exceed 100%"),
  hsnCode: Yup.string()
    .required("HSN Code is required")
    .matches(/^[0-9]{4,8}$/, "HSN Code must be a 4-8 digit number"),
  productType: Yup.string().required("Product Type is required"),
});

const GstMasterForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [productTypes, setProductTypes] = useState([]);
  const [loadingProductTypes, setLoadingProductTypes] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [gstId, setGstId] = useState(null);

  useEffect(() => {
    if (location.state && location.state.id) {
      setIsEditMode(true);
      setGstId(location.state.id);
      fetchGST(location.state.id);
    }
  }, [location.state]);

  // Fetch product types on mount
  useEffect(() => {
    const fetchProductTypes = async () => {
      try {
        const data = await getProductTypes();
        setProductTypes(data);
        setLoadingProductTypes(false);
      } catch (error) {
        console.error("Error fetching product types:", error);
        Swal.fire({
          title: "Error!",
          text: error.message || "Failed to fetch product types.",
          icon: "error",
          confirmButtonText: "OK",
        });
        setLoadingProductTypes(false);
      }
    };
    fetchProductTypes();
  }, []);

  const fetchGST = async (id) => {
    try {
      const data = await getGSTById(id);
      formik.setValues({
        gstValue: data.gst_value || "",
        sgst: data.sgst || "",
        cgst: data.cgst || "",
        igst: data.igst || "",
        hsnCode: data.hsn || "",
        productType: data.product_type_id || "",
      });
    } catch (error) {
      console.error("Error fetching GST data:", error);
      Swal.fire({
        title: "Error!",
        text: error.message || "Failed to fetch GST data.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const formik = useFormik({
    initialValues: {
      gstValue: "",
      sgst: "",
      cgst: "",
      igst: "",
      hsnCode: "",
      productType: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();

        formData.append("sgst", values.sgst || "");
        formData.append("cgst", values.cgst || "");
        formData.append("igst", values.igst || "");
        formData.append("hsn", values.hsnCode);
        formData.append("product_type_id", values.productType);

        let response;
        if (isEditMode) {
          response = await updateGST(gstId, formData);
          Swal.fire({
            title: "GST Updated!",
            text: "The GST details have been successfully updated.",
            icon: "success",
            confirmButtonText: "OK",
          });
        } else {
          response = await postGST(formData);
          Swal.fire({
            title: "GST Registered!",
            text: "The GST details have been successfully registered.",
            icon: "success",
            confirmButtonText: "OK",
          });
        }

        if (response) {
          formik.resetForm();
          navigate("/gst-master-list");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        Swal.fire({
          title: "Error!",
          text: error.message || "Failed to submit the form. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    },
  });

  useEffect(() => {
    const gstValue = parseFloat(formik.values.gstValue) || 0;
    const cgst = gstValue / 2;
    const sgst = gstValue / 2;
    const igst = cgst + sgst;

    formik.setFieldValue("cgst", cgst.toFixed(2));
    formik.setFieldValue("sgst", sgst.toFixed(2));
    formik.setFieldValue("igst", igst.toFixed(2));
  }, [formik.values.gstValue]);

  document.title = isEditMode ? "Edit GST" : "GST Registration";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="GST Management"
            breadcrumbItem={isEditMode ? "Edit GST Details" : "Add GST Details"}
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
                      {isEditMode ? "Edit GST Details" : "Add GST Details"}
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
                        style={{ fontSize: "18px" }}
                      ></i>
                    </Button>
                  </div>

                  <Form onSubmit={formik.handleSubmit}>
                    <Row className="g-4">
                      {/* GST Value */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="gstValue"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            GST Value (%)
                          </Label>
                          <Input
                            type="number"
                            name="gstValue"
                            id="gstValue"
                            placeholder="Enter GST percentage"
                            value={formik.values.gstValue}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.gstValue && formik.errors.gstValue
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.touched.gstValue &&
                            formik.errors.gstValue && (
                              <div className="invalid-feedback">
                                {formik.errors.gstValue}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      {/* SGST (Auto-calculated) */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="sgst"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            SGST (%)
                          </Label>
                          <Input
                            type="number"
                            name="sgst"
                            id="sgst"
                            placeholder="Auto-calculated"
                            value={formik.values.sgst}
                            readOnly
                            className="form-control"
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                              backgroundColor: "#f1f1f1",
                            }}
                          />
                        </FormGroup>
                      </Col>

                      {/* CGST (Auto-calculated) */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="cgst"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            CGST (%)
                          </Label>
                          <Input
                            type="number"
                            name="cgst"
                            id="cgst"
                            placeholder="Auto-calculated"
                            value={formik.values.cgst}
                            readOnly
                            className="form-control"
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                              backgroundColor: "#f1f1f1",
                            }}
                          />
                        </FormGroup>
                      </Col>

                      {/* IGST (Auto-calculated) */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="igst"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            IGST (%)
                          </Label>
                          <Input
                            type="number"
                            name="igst"
                            id="igst"
                            placeholder="Auto-calculated"
                            value={formik.values.igst}
                            readOnly
                            className="form-control"
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                              backgroundColor: "#f1f1f1",
                            }}
                          />
                        </FormGroup>
                      </Col>

                      {/* HSN Code */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="hsnCode"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            HSN Code
                          </Label>
                          <Input
                            type="text"
                            name="hsnCode"
                            id="hsnCode"
                            placeholder="Enter HSN code (4-8 digits)"
                            value={formik.values.hsnCode}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.hsnCode && formik.errors.hsnCode
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.touched.hsnCode && formik.errors.hsnCode && (
                            <div className="invalid-feedback">
                              {formik.errors.hsnCode}
                            </div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* Product Type */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="productType"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Product Type
                          </Label>
                          <Input
                            type="select"
                            name="productType"
                            id="productType"
                            value={formik.values.productType}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.productType &&
                              formik.errors.productType
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                            disabled={loadingProductTypes}
                          >
                            <option value="">
                              {loadingProductTypes
                                ? "Loading..."
                                : productTypes.length === 0
                                ? "No product types available"
                                : "Select Product Type"}
                            </option>
                            {productTypes.length > 0 &&
                              productTypes.map((option) => (
                                <option
                                  key={option.product_type_id}
                                  value={option.product_type_id}
                                >
                                  {option.product_type_name}
                                </option>
                              ))}
                          </Input>
                          {formik.touched.productType &&
                            formik.errors.productType && (
                              <div className="invalid-feedback">
                                {formik.errors.productType}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      {/* Submit Button */}
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
      `}</style>
    </React.Fragment>
  );
};

export default GstMasterForm;
