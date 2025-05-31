import React, { useState, useRef, useEffect } from "react";
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
import AsyncSelect from "react-select/async";
import Swal from "sweetalert2";
import debounce from "lodash.debounce";
import {
  postManufacturer,
  getManufacturerById,
  updateManufacturer,
} from "../../../ApiService/Drugs/Drug";
import { getBrands } from "../../../ApiService/Drugs/BrandForm";

// Validation schema
const validationSchema = Yup.object().shape({
  manufacturerName: Yup.string()
    .required("Manufacturer Name is required")
    .min(2, "Manufacturer Name must be at least 2 characters"),
  prohibitedStatus: Yup.string().required("Prohibited Status is required"),
  logo: Yup.mixed()
    .nullable()
    .test(
      "fileSize",
      "File size must be less than 2MB",
      (value) => !value || value.size <= 2 * 1024 * 1024
    )
    .test(
      "fileType",
      "Only image files are allowed (jpg, png, jpeg)",
      (value) =>
        !value || ["image/jpeg", "image/png", "image/jpg"].includes(value.type)
    ),
  drugLicence: Yup.mixed()
    .nullable()
    .test(
      "fileSize",
      "File size must be less than 5MB",
      (value) => !value || value.size <= 5 * 1024 * 1024
    )
    .test(
      "fileType",
      "Only PDF or image files are allowed (pdf, jpg, png, jpeg)",
      (value) =>
        !value ||
        ["application/pdf", "image/jpeg", "image/png", "image/jpg"].includes(
          value.type
        )
    ),
  discount: Yup.number()
    .nullable()
    .min(0, "Discount cannot be negative")
    .max(100, "Discount cannot exceed 100%"),
  expiryDateManagement: Yup.number()
    .nullable()
    .min(1, "Expiry Date Management must be at least 1 day")
    .max(365, "Expiry Date Management cannot exceed 365 days")
    .integer("Expiry Date Management must be an integer"),
  reorderLevel: Yup.number()
    .nullable()
    .min(0, "Reorder Level cannot be negative")
    .integer("Reorder Level must be an integer"),
  brands: Yup.array().of(Yup.string()).min(1, "At least one Brand is required"),
  status: Yup.string().nullable(),
  shortForm: Yup.string().nullable(),
  description: Yup.string().nullable(),
  establishmentYear: Yup.string().nullable(),
  drugLicenceNo: Yup.string().nullable(),
  type: Yup.string().nullable(),
  contactDetails: Yup.object()
    .shape({
      phone: Yup.string().nullable(),
      email: Yup.string().email("Invalid email format").nullable(),
      website: Yup.string().nullable(),
      address: Yup.string().nullable(),
    })
    .nullable(),
});

const ManufacturDetailsForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const logoRef = useRef(null);
  const drugLicenceRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageName, setImageName] = useState("");
  const [drugLicencePreview, setDrugLicencePreview] = useState(null);
  const [drugLicenceName, setDrugLicenceName] = useState("");
  const [brandOptions, setBrandOptions] = useState([]);
  const [loadingBrands, setLoadingBrands] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [manufacturerId, setManufacturerId] = useState(null);

  useEffect(() => {
    if (location.state && location.state.id) {
      setIsEditMode(true);
      setManufacturerId(location.state.id);
      fetchManufacturer(location.state.id);
    }
  }, [location.state]);

  useEffect(() => {
    const loadInitialBrands = async () => {
      try {
        setLoadingBrands(true);
        const { data } = await getBrands(1, 10, "");
        const formattedBrands = data.map((brand) => ({
          value: brand.brand_id,
          label: brand.brand_name,
        }));
        setBrandOptions(formattedBrands);
      } catch (error) {
        console.error("Error fetching initial brands:", error);
        Swal.fire({
          title: "Error!",
          text: error.message || "Failed to fetch brands.",
          icon: "error",
          confirmButtonText: "OK",
        });
      } finally {
        setLoadingBrands(false);
      }
    };
    loadInitialBrands();
  }, []);

  const fetchManufacturer = async (id) => {
    try {
      const data = await getManufacturerById(id);
      const brandIds = Array.isArray(data.brand_id)
        ? data.brand_id.map((brand) => brand.brand_id)
        : [];

      formik.setValues({
        manufacturerName: data.manufacturer_name || "",
        shortForm: data.short_form || "",
        logo: null,
        description: data.description || "",
        establishmentYear: data.estd_year || "",
        prohibitedStatus: data.prohibited_status ? "Yes" : "No",
        drugLicenceNo: data.drug_licence_no || "",
        drugLicence: null,
        type: data.type || "",
        brands: brandIds,
        status: data.status ? "Active" : "Inactive",
        discount: data.discount_type || "",
        expiryDateManagement: data.exp_date_management || "",
        reorderLevel: data.reorder_level || "",
        contactDetails: {
          phone: data.contact_details?.phone || "",
          email: data.contact_details?.email || "",
          website: data.contact_details?.website || "",
          address: data.contact_details?.address || "",
        },
      });

      if (brandIds.length > 0) {
        const existingValues = brandOptions.map((opt) => opt.value);
        const missingBrands = brandIds.filter(
          (id) => !existingValues.includes(id)
        );
        if (missingBrands.length > 0) {
          const newOptions = missingBrands.map((id) => ({
            value: id,
            label: `Brand ${id}`, // Placeholder; replace with actual name if API provides it
          }));
          setBrandOptions((prev) => [...prev, ...newOptions]);
        }
      }

      if (data.manufactuter_logo) {
        setImagePreview(
          `${import.meta.env.VITE_API_BASE_URL}${data.manufactuter_logo}`
        );
        setImageName(data.manufactuter_logo.split("/").pop());
      }

      if (data.drug_licence_no_file) {
        setDrugLicencePreview(
          `${import.meta.env.VITE_API_BASE_URL}${data.drug_licence_no_file}`
        );
        setDrugLicenceName(data.drug_licence_no_file.split("/").pop());
      }
    } catch (error) {
      console.error("Error fetching manufacturer:", error);
      Swal.fire({
        title: "Error!",
        text: error.message || "Failed to fetch manufacturer data.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const debouncedSearchBrands = debounce(async (inputValue, callback) => {
    try {
      setLoadingBrands(true);
      const { data } = await getBrands(1, 10, inputValue || "");
      const formattedBrands = data.map((brand) => ({
        value: brand.brand_id,
        label: brand.brand_name,
      }));

      // Preserve selected brands in brandOptions
      const selectedBrands = formik.values.brands.map((brandId) => {
        const existingOption = brandOptions.find(
          (opt) => opt.value === brandId
        );
        return (
          existingOption || {
            value: brandId,
            label: `Brand ${brandId}`, // Placeholder if brand name not available
          }
        );
      });

      // Merge selected brands with search results, avoiding duplicates
      const uniqueBrands = [
        ...selectedBrands,
        ...formattedBrands.filter(
          (brand) => !selectedBrands.some((sb) => sb.value === brand.value)
        ),
      ];

      setBrandOptions(uniqueBrands);
      callback(formattedBrands); // Only return search results to AsyncSelect
    } catch (error) {
      console.error("Error searching brands:", error);
      Swal.fire({
        title: "Error!",
        text: error.message || "Failed to search brands.",
        icon: "error",
        confirmButtonText: "OK",
      });
      callback([]);
    } finally {
      setLoadingBrands(false);
    }
  }, 700);

  const handleSearchBrands = (inputValue, callback) => {
    debouncedSearchBrands(inputValue, callback);
  };

  const formik = useFormik({
    initialValues: {
      manufacturerName: "",
      shortForm: "",
      logo: null,
      description: "",
      establishmentYear: "",
      prohibitedStatus: "",
      drugLicenceNo: "",
      drugLicence: null,
      type: "",
      brands: [],
      status: "",
      discount: "",
      expiryDateManagement: "",
      reorderLevel: "",
      contactDetails: {
        phone: "",
        email: "",
        website: "",
        address: "",
      },
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("manufacturer_name", values.manufacturerName);
        if (values.shortForm) formData.append("short_form", values.shortForm);
        if (values.logo) formData.append("manufactuter_logo", values.logo);
        if (values.description)
          formData.append("description", values.description);
        if (values.establishmentYear)
          formData.append("estd_year", values.establishmentYear);
        formData.append("prohibited_status", values.prohibitedStatus === "Yes");
        if (values.drugLicenceNo)
          formData.append("drug_licence_no", values.drugLicenceNo);
        if (values.drugLicence)
          formData.append("drug_licence_no_file", values.drugLicence);
        if (values.type) formData.append("type", values.type);
        if (values.brands.length > 0)
          formData.append("brand_id", JSON.stringify(values.brands));
        formData.append("status", values.status === "Active");
        if (values.discount) formData.append("discount_type", values.discount);
        if (values.expiryDateManagement)
          formData.append("exp_date_management", values.expiryDateManagement);
        if (values.reorderLevel)
          formData.append("reorder_level", values.reorderLevel);
        if (Object.values(values.contactDetails).some((val) => val)) {
          formData.append(
            "contact_details",
            JSON.stringify(values.contactDetails)
          );
        }

        let response;
        if (isEditMode) {
          response = await updateManufacturer(manufacturerId, formData);
          Swal.fire({
            title: "Manufacturer Updated!",
            text: "The manufacturer has been successfully updated.",
            icon: "success",
            confirmButtonText: "OK",
          });
        } else {
          response = await postManufacturer(formData);
          Swal.fire({
            title: "Manufacturer Registered!",
            text: "The manufacturer has been successfully registered.",
            icon: "success",
            confirmButtonText: "OK",
          });
        }

        if (response) {
          formik.resetForm();
          if (logoRef.current) logoRef.current.value = "";
          if (drugLicenceRef.current) drugLicenceRef.current.value = "";
          setImagePreview(null);
          setImageName("");
          setDrugLicencePreview(null);
          setDrugLicenceName("");
          navigate("/manufacturer-management-list");
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

  const handleImageChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setImageName(file.name);
      formik.setFieldValue("logo", file);
    }
  };

  const handleImageRemove = () => {
    setImagePreview(null);
    setImageName("");
    formik.setFieldValue("logo", null);
    if (logoRef.current) logoRef.current.value = "";
  };

  const handleDrugLicenceChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      setDrugLicencePreview(URL.createObjectURL(file));
      setDrugLicenceName(file.name);
      formik.setFieldValue("drugLicence", file);
    }
  };

  const handleDrugLicenceRemove = () => {
    setDrugLicencePreview(null);
    setDrugLicenceName("");
    formik.setFieldValue("drugLicence", null);
    if (drugLicenceRef.current) drugLicenceRef.current.value = "";
  };

  document.title = isEditMode ? "Edit Manufacturer" : "Add Manufacturer";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Manufacturer Management"
            breadcrumbItem={
              isEditMode ? "Edit Manufacturer" : "Add Manufacturer"
            }
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
                      {isEditMode ? "Edit Manufacturer" : "Add Manufacturer"}
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
                      {/* Manufacturer Name */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="manufacturerName"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Manufacturer Name{" "}
                            <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            name="manufacturerName"
                            id="manufacturerName"
                            placeholder="Enter manufacturer name"
                            value={formik.values.manufacturerName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.manufacturerName &&
                              formik.errors.manufacturerName
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.touched.manufacturerName &&
                            formik.errors.manufacturerName && (
                              <div className="invalid-feedback">
                                {formik.errors.manufacturerName}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      {/* Short Form */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="shortForm"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Short Form (Optional)
                          </Label>
                          <Input
                            type="text"
                            name="shortForm"
                            id="shortForm"
                            placeholder="Enter short form"
                            value={formik.values.shortForm}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.shortForm &&
                              formik.errors.shortForm
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.touched.shortForm &&
                            formik.errors.shortForm && (
                              <div className="invalid-feedback">
                                {formik.errors.shortForm}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      {/* Logo */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="logo"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Manufacturer Logo (Optional)
                          </Label>
                          <Input
                            type="file"
                            name="logo"
                            id="logo"
                            accept="image/*"
                            ref={logoRef}
                            onChange={handleImageChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.logo && formik.errors.logo
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "8px",
                            }}
                          />
                          {formik.touched.logo && formik.errors.logo && (
                            <div className="invalid-feedback">
                              {formik.errors.logo}
                            </div>
                          )}
                          {imagePreview && (
                            <div
                              style={{
                                position: "relative",
                                display: "inline-block",
                                marginTop: "10px",
                              }}
                            >
                              <img
                                src={imagePreview}
                                alt="Manufacturer Logo"
                                style={{
                                  width: "100px",
                                  height: "100px",
                                  objectFit: "cover",
                                }}
                              />
                              <Button
                                style={{
                                  position: "absolute",
                                  top: "0",
                                  right: "0",
                                  background: "rgba(255, 0, 0, 0.6)",
                                  color: "white",
                                  padding: "0.2rem",
                                  borderRadius: "50%",
                                }}
                                onClick={handleImageRemove}
                              >
                                X
                              </Button>
                            </div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* Description */}
                      <Col md="12">
                        <FormGroup>
                          <Label
                            for="description"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Manufacturer Description (Optional)
                          </Label>
                          <Input
                            type="textarea"
                            name="description"
                            id="description"
                            placeholder="Enter description"
                            rows="3"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.description &&
                              formik.errors.description
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.touched.description &&
                            formik.errors.description && (
                              <div className="invalid-feedback">
                                {formik.errors.description}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      {/* Establishment Year */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="establishmentYear"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Establishment Year (Optional)
                          </Label>
                          <Input
                            type="date"
                            name="establishmentYear"
                            id="establishmentYear"
                            value={formik.values.establishmentYear}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.establishmentYear &&
                              formik.errors.establishmentYear
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                            max={new Date().toISOString().split("T")[0]}
                            min="1800-01-01"
                          />
                          {formik.touched.establishmentYear &&
                            formik.errors.establishmentYear && (
                              <div className="invalid-feedback">
                                {formik.errors.establishmentYear}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      {/* Prohibited Status */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="prohibitedStatus"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Manufacturer Prohibited Status{" "}
                            <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="select"
                            name="prohibitedStatus"
                            id="prohibitedStatus"
                            value={formik.values.prohibitedStatus}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.prohibitedStatus &&
                              formik.errors.prohibitedStatus
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          >
                            <option value="">Select Status</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </Input>
                          {formik.touched.prohibitedStatus &&
                            formik.errors.prohibitedStatus && (
                              <div className="invalid-feedback">
                                {formik.errors.prohibitedStatus}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      {/* Drug Licence No */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="drugLicenceNo"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Manufacturer Drug Licence No. (Optional)
                          </Label>
                          <Input
                            type="text"
                            name="drugLicenceNo"
                            id="drugLicenceNo"
                            placeholder="Enter drug licence no."
                            value={formik.values.drugLicenceNo}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.drugLicenceNo &&
                              formik.errors.drugLicenceNo
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.touched.drugLicenceNo &&
                            formik.errors.drugLicenceNo && (
                              <div className="invalid-feedback">
                                {formik.errors.drugLicenceNo}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      {/* Drug Licence */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="drugLicence"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Manufacturer Drug Licence (Optional)
                          </Label>
                          <Input
                            type="file"
                            name="drugLicence"
                            id="drugLicence"
                            accept=".pdf,image/*"
                            ref={drugLicenceRef}
                            onChange={handleDrugLicenceChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.drugLicence &&
                              formik.errors.drugLicence
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "8px",
                            }}
                          />
                          {formik.touched.drugLicence &&
                            formik.errors.drugLicence && (
                              <div className="invalid-feedback">
                                {formik.errors.drugLicence}
                              </div>
                            )}
                          {drugLicencePreview && (
                            <div
                              style={{
                                position: "relative",
                                display: "inline-block",
                                marginTop: "10px",
                              }}
                            >
                              {drugLicenceName.endsWith(".pdf") ? (
                                <a
                                  href={drugLicencePreview}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    display: "block",
                                    fontSize: "14px",
                                    color: "#007bff",
                                  }}
                                >
                                  {drugLicenceName} (PDF)
                                </a>
                              ) : (
                                <img
                                  src={drugLicencePreview}
                                  alt="Drug Licence"
                                  style={{
                                    width: "100px",
                                    height: "100px",
                                    objectFit: "cover",
                                  }}
                                />
                              )}
                              <Button
                                style={{
                                  position: "absolute",
                                  top: "0",
                                  right: "0",
                                  background: "rgba(255, 0, 0, 0.6)",
                                  color: "white",
                                  padding: "0.2rem",
                                  borderRadius: "50%",
                                }}
                                onClick={handleDrugLicenceRemove}
                              >
                                X
                              </Button>
                            </div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* Type */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="type"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Manufacturer Type (Optional)
                          </Label>
                          <Input
                            type="text"
                            name="type"
                            id="type"
                            placeholder="Enter type"
                            value={formik.values.type}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.type && formik.errors.type
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.touched.type && formik.errors.type && (
                            <div className="invalid-feedback">
                              {formik.errors.type}
                            </div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* Brands (AsyncSelect with Search) */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="brands"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Manufacturer Brands{" "}
                            <span className="text-danger">*</span>
                          </Label>
                          <AsyncSelect
                            cacheOptions
                            defaultOptions={brandOptions}
                            loadOptions={handleSearchBrands}
                            isMulti
                            name="brands"
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={(selectedOptions) =>
                              formik.setFieldValue(
                                "brands",
                                selectedOptions
                                  ? selectedOptions.map(
                                      (option) => option.value
                                    )
                                  : []
                              )
                            }
                            onBlur={() =>
                              formik.setFieldTouched("brands", true)
                            }
                            value={formik.values.brands.map((brandId) => {
                              const option = brandOptions.find(
                                (opt) => opt.value === brandId
                              );
                              return (
                                option || {
                                  value: brandId,
                                  label: `Brand ${brandId}`,
                                }
                              );
                            })}
                            placeholder={
                              loadingBrands
                                ? "Loading..."
                                : "Search brands by name..."
                            }
                            isDisabled={loadingBrands}
                            isLoading={loadingBrands}
                          />
                          {formik.touched.brands && formik.errors.brands && (
                            <div
                              className="invalid-feedback"
                              style={{ display: "block" }}
                            >
                              {formik.errors.brands}
                            </div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* Status */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="status"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Status (Optional)
                          </Label>
                          <Input
                            type="select"
                            name="status"
                            id="status"
                            value={formik.values.status}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.status && formik.errors.status
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                              width: "140px",
                            }}
                          >
                            <option value="">Select Status</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                          </Input>
                          {formik.touched.status && formik.errors.status && (
                            <div className="invalid-feedback">
                              {formik.errors.status}
                            </div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* Discount */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="discount"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Discount (Optional)
                          </Label>
                          <Input
                            type="number"
                            name="discount"
                            id="discount"
                            placeholder="Enter discount percentage (e.g., 10%)"
                            value={formik.values.discount}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.discount && formik.errors.discount
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.touched.discount &&
                            formik.errors.discount && (
                              <div className="invalid-feedback">
                                {formik.errors.discount}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      {/* Expiry Date Management */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="expiryDateManagement"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Expiry Date Management (days) (Optional)
                          </Label>
                          <Input
                            type="number"
                            name="expiryDateManagement"
                            id="expiryDateManagement"
                            placeholder="Enter days (e.g., 30)"
                            value={formik.values.expiryDateManagement}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.expiryDateManagement &&
                              formik.errors.expiryDateManagement
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.values.expiryDateManagement &&
                            !formik.errors.expiryDateManagement && (
                              <small className="text-muted">{`${formik.values.expiryDateManagement} days`}</small>
                            )}
                          {formik.touched.expiryDateManagement &&
                            formik.errors.expiryDateManagement && (
                              <div className="invalid-feedback">
                                {formik.errors.expiryDateManagement}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      {/* Reorder Level */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="reorderLevel"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Reorder Level (Optional)
                          </Label>
                          <Input
                            type="number"
                            name="reorderLevel"
                            id="reorderLevel"
                            placeholder="Enter reorder level"
                            value={formik.values.reorderLevel}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.reorderLevel &&
                              formik.errors.reorderLevel
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.values.reorderLevel &&
                            !formik.errors.reorderLevel && (
                              <small className="text-muted">{`Minimum units: ${formik.values.reorderLevel}`}</small>
                            )}
                          {formik.touched.reorderLevel &&
                            formik.errors.reorderLevel && (
                              <div className="invalid-feedback">
                                {formik.errors.reorderLevel}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      {/* Contact Details */}
                      <Col md="12">
                        <h5 className="text-dark mt-3">Contact Details</h5>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="contactDetails.phone"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Phone Number (Optional)
                          </Label>
                          <Input
                            type="text"
                            name="contactDetails.phone"
                            id="contactDetails.phone"
                            placeholder="Enter phone number"
                            value={formik.values.contactDetails.phone}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.contactDetails?.phone &&
                              formik.errors.contactDetails?.phone
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.touched.contactDetails?.phone &&
                            formik.errors.contactDetails?.phone && (
                              <div className="invalid-feedback">
                                {formik.errors.contactDetails.phone}
                              </div>
                            )}
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="contactDetails.email"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Email (Optional)
                          </Label>
                          <Input
                            type="email"
                            name="contactDetails.email"
                            id="contactDetails.email"
                            placeholder="Enter email"
                            value={formik.values.contactDetails.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.contactDetails?.email &&
                              formik.errors.contactDetails?.email
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.touched.contactDetails?.email &&
                            formik.errors.contactDetails?.email && (
                              <div className="invalid-feedback">
                                {formik.errors.contactDetails.email}
                              </div>
                            )}
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="contactDetails.website"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Website (Optional)
                          </Label>
                          <Input
                            type="text"
                            name="contactDetails.website"
                            id="contactDetails.website"
                            placeholder="Enter website URL"
                            value={formik.values.contactDetails.website}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.contactDetails?.website &&
                              formik.errors.contactDetails?.website
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.touched.contactDetails?.website &&
                            formik.errors.contactDetails?.website && (
                              <div className="invalid-feedback">
                                {formik.errors.contactDetails.website}
                              </div>
                            )}
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="contactDetails.address"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Address (Optional)
                          </Label>
                          <Input
                            type="textarea"
                            name="contactDetails.address"
                            id="contactDetails.address"
                            placeholder="Enter address"
                            rows="3"
                            value={formik.values.contactDetails.address}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.contactDetails?.address &&
                              formik.errors.contactDetails?.address
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.touched.contactDetails?.address &&
                            formik.errors.contactDetails?.address && (
                              <div className="invalid-feedback">
                                {formik.errors.contactDetails.address}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      {/* Submit Button */}
                      <Col md="12" className="text-end">
                        <Button
                          type="submit"
                          color="primary"
                          disabled={formik.isSubmitting || loadingBrands}
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
        .text-muted {
          font-size: 12px;
        }
      `}</style>
    </React.Fragment>
  );
};

export default ManufacturDetailsForm;
