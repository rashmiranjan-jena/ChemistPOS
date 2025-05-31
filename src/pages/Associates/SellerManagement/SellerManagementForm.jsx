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
  CardImg,
} from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useNavigate, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import Swal from "sweetalert2";
import debounce from "lodash.debounce";
import {
  postSeller,
  getSellerById,
  updateSeller,
} from "../../../ApiService/Associate/SellerManagement";
import { getManufacturers } from "../../../ApiService/Drugs/Drug";
import { getDrugTypes } from "../../../ApiService/Drugs/DrugType";
import { getSellerTypes } from "../../../ApiService/Associate/SellerTypeMaster";

// Validation schema
const validationSchema = Yup.object({
  seller_name: Yup.string()
    .required("Seller Name is required")
    .min(2, "Seller Name must be at least 2 characters"),
  seller_type: Yup.string().required("Seller Type is required"),
  manufacturer: Yup.array()
    .of(Yup.string())
    .min(1, "At least one Manufacturer is required"),
  expirymanagement: Yup.boolean().required("Expiry Management is required"),
  drug_type: Yup.string().required("Drug Type is required"),
  short_form: Yup.string()
    .min(2, "Short Form must be at least 2 characters")
    .max(10, "Short Form cannot exceed 10 characters"),
  logo: Yup.mixed()
    .nullable()
    .test(
      "fileSize",
      "File size must be less than 2MB",
      (value) => !value || value?.size <= 2 * 1024 * 1024
    )
    .test(
      "fileType",
      "Only image files are allowed (jpg, png, jpeg)",
      (value) =>
        !value || ["image/jpeg", "image/png", "image/jpg"].includes(value?.type)
    ),
  description: Yup.string().min(
    10,
    "Description must be at least 10 characters"
  ),
  drug_licence_no: Yup.string().matches(
    /^[A-Za-z0-9-]+$/,
    "Drug Licence No. can only contain letters, numbers, and hyphens"
  ),
  pharma_certificate_no: Yup.string(),
  pharma_certificate: Yup.mixed()
    .nullable()
    .test(
      "fileSize",
      "File size must be less than 5MB",
      (value) => !value || value?.size <= 5 * 1024 * 1024
    )
    .test(
      "fileType",
      "Only image or PDF files are allowed",
      (value) =>
        !value ||
        ["image/jpeg", "image/png", "image/jpg", "application/pdf"].includes(
          value?.type
        )
    ),
  GST_no: Yup.string().matches(
    /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
    "Invalid GST No. format"
  ),
  FASSI_no: Yup.string().matches(/^[0-9]{14}$/, "FSSAI No. must be 14 digits"),
  prohibited_status: Yup.boolean(),
  discount: Yup.string(),
  contact_details: Yup.object({
    phone: Yup.string().matches(
      /^\d{10}$/,
      "Phone Number must be exactly 10 digits"
    ),
    email: Yup.string().email("Invalid email format"),
    website: Yup.string().url("Invalid URL format"),
    address: Yup.string(),
  }),
  credit_details: Yup.object({
    collectionType: Yup.string(),
    collectionDay: Yup.string().when("collectionType", {
      is: (collectionType) => ["Weekly", "Monthly"].includes(collectionType),
      then: (schema) => schema.required("Collection day is required"),
      otherwise: (schema) => schema,
    }),
    interestRate: Yup.number().min(0, "Interest Rate cannot be negative"),
    creditPeriod: Yup.number().min(0, "Credit Period cannot be negative"),
    creditLimit: Yup.number().min(0, "Credit Limit cannot be negative"),
    invoiceLimit: Yup.number().min(0, "Invoice Limit cannot be negative"),
    billingCycle: Yup.string(),
    paymentCycle: Yup.string(),
  }),
});

const SellerManagementForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const logoRef = useRef(null);
  const pharmaCertRef = useRef(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoName, setLogoName] = useState("");
  const [pharmaCertPreview, setPharmaCertPreview] = useState(null);
  const [pharmaCertName, setPharmaCertName] = useState("");
  const [manufacturerOptions, setManufacturerOptions] = useState([]);
  const [drugTypeOptions, setDrugTypeOptions] = useState([]);
  const [sellerTypeOptions, setSellerTypeOptions] = useState([]);
  const [loadingManufacturers, setLoadingManufacturers] = useState(true);
  const [loadingDrugTypes, setLoadingDrugTypes] = useState(true);
  const [loadingSellerTypes, setLoadingSellerTypes] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [sellerId, setSellerId] = useState(null);

  useEffect(() => {
    if (location?.state?.id) {
      setIsEditMode(true);
      setSellerId(location?.state?.id);
      fetchSeller(location?.state?.id);
    }
  }, [location?.state]);

  useEffect(() => {
    const loadInitialManufacturers = async () => {
      try {
        setLoadingManufacturers(true);
        const response = await getManufacturers(1, 10, "");
        const formattedManufacturers =
          response?.data?.map((manu) => ({
            value: manu?.manufacturer_id,
            label: manu?.manufacturer_name,
          })) ?? [];
        setManufacturerOptions(formattedManufacturers);
      } catch (error) {
        console.error("Error fetching initial manufacturers:", error);
        Swal.fire({
          title: "Error!",
          text: error?.message || "Failed to fetch manufacturers.",
          icon: "error",
          confirmButtonText: "OK",
        });
      } finally {
        setLoadingManufacturers(false);
      }
    };
    loadInitialManufacturers();
  }, []);

  useEffect(() => {
    const fetchDrugTypes = async () => {
      try {
        const data = await getDrugTypes();
        const formattedDrugTypes =
          data?.map((type) => ({
            value: type?.drug_type_id,
            label: type?.drug_type_name,
          })) ?? [];
        setDrugTypeOptions(formattedDrugTypes);
        setLoadingDrugTypes(false);
      } catch (error) {
        console.error("Error fetching drug types:", error);
        Swal.fire({
          title: "Error!",
          text: error?.message || "Failed to fetch drug types.",
          icon: "error",
          confirmButtonText: "OK",
        });
        setLoadingDrugTypes(false);
      }
    };
    fetchDrugTypes();
  }, []);

  useEffect(() => {
    const fetchSellerTypes = async () => {
      try {
        const data = await getSellerTypes();
        const formattedSellerTypes =
          data?.map((type) => ({
            value: type?.id,
            label: type?.seller_type,
          })) ?? [];
        setSellerTypeOptions(formattedSellerTypes);
        setLoadingSellerTypes(false);
      } catch (error) {
        console.error("Error fetching seller types:", error);
        Swal.fire({
          title: "Error!",
          text: error?.message || "Failed to fetch seller types.",
          icon: "error",
          confirmButtonText: "OK",
        });
        setLoadingSellerTypes(false);
      }
    };
    fetchSellerTypes();
  }, []);

  const debouncedSearchManufacturers = debounce(
    async (inputValue, callback) => {
      try {
        setLoadingManufacturers(true);
        const response = await getManufacturers(1, 10, inputValue || "");
        const formattedManufacturers =
          response?.data?.map((manu) => ({
            value: manu?.manufacturer_id,
            label: manu?.manufacturer_name,
          })) ?? [];

        // Preserve selected manufacturers in manufacturerOptions
        const selectedManufacturers = formik.values.manufacturer.map(
          (manuId) => {
            const existingOption = manufacturerOptions.find(
              (opt) => opt.value === manuId
            );
            return (
              existingOption || {
                value: manuId,
                label: `Manufacturer ${manuId}`, // Placeholder if manufacturer name not available
              }
            );
          }
        );

        // Merge selected manufacturers with search results, avoiding duplicates
        const uniqueManufacturers = [
          ...selectedManufacturers,
          ...formattedManufacturers.filter(
            (manu) =>
              !selectedManufacturers.some((sm) => sm.value === manu.value)
          ),
        ];

        setManufacturerOptions(uniqueManufacturers);
        callback(formattedManufacturers); // Only return search results to AsyncSelect
      } catch (error) {
        console.error("Error searching manufacturers:", error);
        Swal.fire({
          title: "Error!",
          text: error?.message || "Failed to search manufacturers.",
          icon: "error",
          confirmButtonText: "OK",
        });
        callback([]);
      } finally {
        setLoadingManufacturers(false);
      }
    },
    800
  );

  const handleSearchManufacturers = (inputValue, callback) => {
    debouncedSearchManufacturers(inputValue, callback);
  };

 const fetchSeller = async (id) => {
  try {
    const data = await getSellerById(id);
    // Ensure manufacturer is an array
    const manufacturerArray = Array.isArray(data?.manufacturer)
      ? data?.manufacturer
      : data?.manufacturer
      ? [data?.manufacturer]
      : [];
    formik.setValues({
      seller_name: data?.seller_name || "",
      short_form: data?.short_form || "",
      logo: null,
      description: data?.description || "",
      drug_licence_no: data?.drug_licence_no || "",
      pharma_certificate_no: data?.pharma_certificate_no || "",
      pharma_certificate: null,
      GST_no: data?.GST_no || "",
      FASSI_no: data?.FASSI_no || "",
      prohibited_status: data?.prohibited_status || false,
      seller_type: data?.seller_type || "",
      manufacturer: manufacturerArray,
      discount: data?.discount || "",
      expirymanagement: data?.expirymanagement || false,
      drug_type: data?.drug_type || "",
      contact_details: {
        phone: data?.contact_details?.phone || "",
        email: data?.contact_details?.email || "",
        website: data?.contact_details?.website || "",
        address: data?.contact_details?.address || "",
      },
      credit_details: {
        collectionType: data?.credit_details?.collectionType || "",
        collectionDay: data?.credit_details?.collectionDay || "",
        interestRate: data?.credit_details?.interestRate || "",
        creditPeriod: data?.credit_details?.creditPeriod || "",
        creditLimit: data?.credit_details?.creditLimit || "",
        invoiceLimit: data?.credit_details?.invoiceLimit || "",
        billingCycle: data?.credit_details?.billingCycle || "",
        paymentCycle: data?.credit_details?.paymentCycle || "",
      },
    });

    // Add selected manufacturers to options with their names
    if (manufacturerArray.length > 0) {
      const newOptions = manufacturerArray.map((id) => ({
        value: id,
        label: data?.manufacturer_name || `Manufacturer ${id}`, // Use manufacturer_name from response
      }));
      setManufacturerOptions((prev) => {
        // Merge new options, avoiding duplicates
        const existingValues = prev.map((opt) => opt.value);
        const uniqueNewOptions = newOptions.filter(
          (opt) => !existingValues.includes(opt.value)
        );
        return [...prev, ...uniqueNewOptions];
      });
    }

    if (data?.logo) {
      setLogoPreview(`${import.meta.env.VITE_API_BASE_URL}${data?.logo}`);
      setLogoName(data?.logo?.split("/")?.pop() ?? "");
    }
    if (data?.pharma_certificate) {
      setPharmaCertPreview(
        `${import.meta.env.VITE_API_BASE_URL}${data?.pharma_certificate}`
      );
      setPharmaCertName(data?.pharma_certificate?.split("/")?.pop() ?? "");
    }
  } catch (error) {
    console.error("Error fetching seller:", error);
    Swal.fire({
      title: "Error!",
      text: error?.message || "Failed to fetch seller data.",
      icon: "error",
      confirmButtonText: "OK",
    });
  }
};

  const formik = useFormik({
    initialValues: {
      seller_name: "",
      short_form: "",
      logo: null,
      description: "",
      drug_licence_no: "",
      pharma_certificate_no: "",
      pharma_certificate: null,
      GST_no: "",
      FASSI_no: "",
      prohibited_status: false,
      seller_type: "",
      manufacturer: [],
      discount: "",
      expirymanagement: false,
      drug_type: "",
      contact_details: {
        phone: "",
        email: "",
        website: "",
        address: "",
      },
      credit_details: {
        collectionType: "",
        collectionDay: "",
        interestRate: "",
        creditPeriod: "",
        creditLimit: "",
        invoiceLimit: "",
        billingCycle: "",
        paymentCycle: "",
      },
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("seller_name", values?.seller_name ?? "");
        if (values?.short_form)
          formData.append("short_form", values?.short_form);
        if (values?.logo) formData.append("logo", values?.logo);
        if (values?.description)
          formData.append("description", values?.description);
        if (values?.drug_licence_no)
          formData.append("drug_licence_no", values?.drug_licence_no);
        if (values?.pharma_certificate_no)
          formData.append(
            "pharma_certificate_no",
            values?.pharma_certificate_no
          );
        if (values?.pharma_certificate)
          formData.append("pharma_certificate", values?.pharma_certificate);
        if (values?.GST_no) formData.append("GST_no", values?.GST_no);
        if (values?.FASSI_no) formData.append("FASSI_no", values?.FASSI_no);
        formData.append(
          "prohibited_status",
          values?.prohibited_status ?? false
        );
        formData.append("seller_type", values?.seller_type ?? "");
        if (values?.manufacturer?.length > 0)
          formData.append("manufacturer", JSON.stringify(values?.manufacturer));
        if (values?.discount) formData.append("discount", values?.discount);
        formData.append("expirymanagement", values?.expirymanagement ?? false);
        formData.append("drug_type", values?.drug_type ?? "");

        if (Object.values(values?.contact_details ?? {}).some((val) => val)) {
          formData.append(
            "contact_details",
            JSON.stringify(values?.contact_details)
          );
        }

        if (Object.values(values?.credit_details ?? {}).some((val) => val)) {
          formData.append(
            "credit_details",
            JSON.stringify(values?.credit_details)
          );
        }

        let response;
        if (isEditMode) {
          response = await updateSeller(sellerId, formData);
          Swal.fire({
            title: "Seller Updated!",
            text: "The seller has been successfully updated.",
            icon: "success",
            confirmButtonText: "OK",
          });
        } else {
          response = await postSeller(formData);
          Swal.fire({
            title: "Seller Registered!",
            text: "The seller has been successfully registered.",
            icon: "success",
            confirmButtonText: "OK",
          });
        }

        if (response) {
          formik.resetForm();
          if (logoRef?.current) logoRef.current.value = "";
          if (pharmaCertRef?.current) pharmaCertRef.current.value = "";
          setLogoPreview(null);
          setLogoName("");
          setPharmaCertPreview(null);
          setPharmaCertName("");
          navigate("/seller-management-list");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        Swal.fire({
          title: "Error!",
          text:
            error?.message || "Failed to submit the form. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    },
  });

  const handleLogoChange = (event) => {
    const file = event?.currentTarget?.files?.[0];
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
      setLogoName(file?.name ?? "");
      formik.setFieldValue("logo", file);
    }
  };

  const handleLogoRemove = () => {
    setLogoPreview(null);
    setLogoName("");
    formik.setFieldValue("logo", null);
    if (logoRef?.current) logoRef.current.value = "";
  };

  const handlePharmaCertChange = (event) => {
    const file = event?.currentTarget?.files?.[0];
    if (file) {
      setPharmaCertPreview(URL.createObjectURL(file));
      setPharmaCertName(file?.name ?? "");
      formik.setFieldValue("pharma_certificate", file);
    }
  };

  const handlePharmaCertRemove = () => {
    setPharmaCertPreview(null);
    setPharmaCertName("");
    formik.setFieldValue("pharma_certificate", null);
    if (pharmaCertRef?.current) pharmaCertRef.current.value = "";
  };

  document.title = isEditMode ? "Edit Seller" : "Add Seller";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Seller Management"
            breadcrumbItem={
              isEditMode ? "Edit Seller Details" : "Add Seller Details"
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
                      {isEditMode
                        ? "Edit Seller Details"
                        : "Add Seller Details"}
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
                      {/* Seller Name */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="seller_name"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Seller Name *
                          </Label>
                          <Input
                            type="text"
                            name="seller_name"
                            id="seller_name"
                            placeholder="Enter seller name"
                            value={formik?.values?.seller_name ?? ""}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik?.touched?.seller_name &&
                              formik?.errors?.seller_name
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik?.touched?.seller_name &&
                            formik?.errors?.seller_name && (
                              <div className="invalid-feedback">
                                {formik?.errors?.seller_name}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      {/* Short Form */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="short_form"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Short Form (Optional)
                          </Label>
                          <Input
                            type="text"
                            name="short_form"
                            id="short_form"
                            placeholder="Enter short form"
                            value={formik?.values?.short_form ?? ""}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik?.touched?.short_form &&
                              formik?.errors?.short_form
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik?.touched?.short_form &&
                            formik?.errors?.short_form && (
                              <div className="invalid-feedback">
                                {formik?.errors?.short_form}
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
                            Logo (Optional)
                          </Label>
                          <Input
                            type="file"
                            name="logo"
                            id="logo"
                            accept="image/*"
                            ref={logoRef}
                            onChange={handleLogoChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik?.touched?.logo && formik?.errors?.logo
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "8px",
                            }}
                          />
                          {formik?.touched?.logo && formik?.errors?.logo && (
                            <div className="invalid-feedback">
                              {formik?.errors?.logo}
                            </div>
                          )}
                          {logoPreview && (
                            <div
                              style={{
                                position: "relative",
                                display: "inline-block",
                                marginTop: " strenuous: 10px",
                              }}
                            >
                              <CardImg
                                src={logoPreview}
                                alt="Seller Logo"
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
                                onClick={handleLogoRemove}
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
                            Description (Optional)
                          </Label>
                          <Input
                            type="textarea"
                            name="description"
                            id="description"
                            placeholder="Enter description"
                            value={formik?.values?.description ?? ""}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik?.touched?.description &&
                              formik?.errors?.description
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik?.touched?.description &&
                            formik?.errors?.description && (
                              <div className="invalid-feedback">
                                {formik?.errors?.description}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      {/* Drug Licence No */}
                      <Col md="4">
                        <FormGroup>
                          <Label
                            for="drug_licence_no"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Drug Licence No. (Optional)
                          </Label>
                          <Input
                            type="text"
                            name="drug_licence_no"
                            id="drug_licence_no"
                            placeholder="Enter drug licence no."
                            value={formik?.values?.drug_licence_no ?? ""}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik?.touched?.drug_licence_no &&
                              formik?.errors?.drug_licence_no
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik?.touched?.drug_licence_no &&
                            formik?.errors?.drug_licence_no && (
                              <div className="invalid-feedback">
                                {formik?.errors?.drug_licence_no}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      {/* Pharma Certificate No */}
                      <Col md="4">
                        <FormGroup>
                          <Label
                            for="pharma_certificate_no"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Pharma Certificate No. (Optional)
                          </Label>
                          <Input
                            type="text"
                            name="pharma_certificate_no"
                            id="pharma_certificate_no"
                            placeholder="Enter pharma certificate no."
                            value={formik?.values?.pharma_certificate_no ?? ""}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik?.touched?.pharma_certificate_no &&
                              formik?.errors?.pharma_certificate_no
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik?.touched?.pharma_certificate_no &&
                            formik?.errors?.pharma_certificate_no && (
                              <div className="invalid-feedback">
                                {formik?.errors?.pharma_certificate_no}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      {/* Pharma Certificate Upload */}
                      <Col md="4">
                        <FormGroup>
                          <Label
                            for="pharma_certificate"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Pharma Certificate Upload (Optional)
                          </Label>
                          <Input
                            type="file"
                            name="pharma_certificate"
                            id="pharma_certificate"
                            accept="image/*,application/pdf"
                            ref={pharmaCertRef}
                            onChange={handlePharmaCertChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik?.touched?.pharma_certificate &&
                              formik?.errors?.pharma_certificate
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "8px",
                            }}
                          />
                          {formik?.touched?.pharma_certificate &&
                            formik?.errors?.pharma_certificate && (
                              <div className="invalid-feedback">
                                {formik?.errors?.pharma_certificate}
                              </div>
                            )}
                          {pharmaCertPreview && (
                            <div
                              style={{
                                position: "relative",
                                display: "inline-block",
                                marginTop: "10px",
                              }}
                            >
                              {pharmaCertName?.endsWith?.(".pdf") ? (
                                <a
                                  href={pharmaCertPreview}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    display: "block",
                                    fontSize: "14px",
                                    color: "#007bff",
                                  }}
                                >
                                  {pharmaCertName} (PDF)
                                </a>
                              ) : (
                                <CardImg
                                  src={pharmaCertPreview}
                                  alt="Pharma Certificate"
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
                                onClick={handlePharmaCertRemove}
                              >
                                X
                              </Button>
                            </div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* GST No */}
                      <Col md="4">
                        <FormGroup>
                          <Label
                            for="GST_no"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            GST No. (Optional)
                          </Label>
                          <Input
                            type="text"
                            name="GST_no"
                            id="GST_no"
                            placeholder="Enter GST no."
                            value={formik?.values?.GST_no ?? ""}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik?.touched?.GST_no && formik?.errors?.GST_no
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik?.touched?.GST_no &&
                            formik?.errors?.GST_no && (
                              <div className="invalid-feedback">
                                {formik?.errors?.GST_no}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      {/* FSSAI No */}
                      <Col md="4">
                        <FormGroup>
                          <Label
                            for="FASSI_no"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            FSSAI No. (Optional)
                          </Label>
                          <Input
                            type="text"
                            name="FASSI_no"
                            id="FASSI_no"
                            placeholder="Enter FSSAI no."
                            value={formik?.values?.FASSI_no ?? ""}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik?.touched?.FASSI_no &&
                              formik?.errors?.FASSI_no
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik?.touched?.FASSI_no &&
                            formik?.errors?.FASSI_no && (
                              <div className="invalid-feedback">
                                {formik?.errors?.FASSI_no}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      {/* Prohibited Status */}
                      <Col md="4">
                        <FormGroup>
                          <Label
                            for="prohibited_status"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Prohibited Status (Optional)
                          </Label>
                          <Input
                            type="select"
                            name="prohibited_status"
                            id="prohibited_status"
                            value={
                              formik?.values?.prohibited_status ? "Yes" : "No"
                            }
                            onChange={(e) =>
                              formik.setFieldValue(
                                "prohibited_status",
                                e.target.value === "Yes"
                              )
                            }
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik?.touched?.prohibited_status &&
                              formik?.errors?.prohibited_status
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          >
                            <option value="No">No</option>
                            <option value="Yes">Yes</option>
                          </Input>
                          {formik?.touched?.prohibited_status &&
                            formik?.errors?.prohibited_status && (
                              <div className="invalid-feedback">
                                {formik?.errors?.prohibited_status}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      {/* Seller Type */}
                      <Col md="4">
                        <FormGroup>
                          <Label
                            for="seller_type"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Seller Type *
                          </Label>
                          <Select
                            name="seller_type"
                            options={sellerTypeOptions}
                            className="basic-select"
                            classNamePrefix="select"
                            onChange={(selectedOption) =>
                              formik.setFieldValue(
                                "seller_type",
                                selectedOption?.value ?? ""
                              )
                            }
                            onBlur={() =>
                              formik.setFieldTouched("seller_type", true)
                            }
                            value={sellerTypeOptions?.find(
                              (option) =>
                                option?.value === formik?.values?.seller_type
                            )}
                            placeholder={
                              loadingSellerTypes
                                ? "Loading..."
                                : "Select seller type..."
                            }
                            isDisabled={loadingSellerTypes}
                          />
                          {formik?.touched?.seller_type &&
                            formik?.errors?.seller_type && (
                              <div
                                className="invalid-feedback"
                                style={{ display: "block" }}
                              >
                                {formik?.errors?.seller_type}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      {/* Manufacturer */}
                      <Col md="4">
                        <FormGroup>
                          <Label
                            for="manufacturer"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Manufacturers *
                          </Label>
                          <AsyncSelect
                            cacheOptions
                            defaultOptions={manufacturerOptions}
                            loadOptions={handleSearchManufacturers}
                            name="manufacturer"
                            isMulti
                            className="basic-select"
                            classNamePrefix="select"
                            onChange={(selectedOptions) =>
                              formik.setFieldValue(
                                "manufacturer",
                                selectedOptions
                                  ? selectedOptions.map(
                                      (option) => option.value
                                    )
                                  : []
                              )
                            }
                            onBlur={() =>
                              formik.setFieldTouched("manufacturer", true)
                            }
                            value={formik.values.manufacturer.map((manuId) => {
                              const option = manufacturerOptions.find(
                                (opt) => opt.value === manuId
                              );
                              return (
                                option || {
                                  value: manuId,
                                  label: `Manufacturer ${manuId}`,
                                }
                              );
                            })}
                            placeholder={
                              loadingManufacturers
                                ? "Loading..."
                                : "Search manufacturers..."
                            }
                            isDisabled={loadingManufacturers}
                            isLoading={loadingManufacturers}
                          />
                          {formik?.touched?.manufacturer &&
                            formik?.errors?.manufacturer && (
                              <div
                                className="invalid-feedback"
                                style={{ display: "block" }}
                              >
                                {formik?.errors?.manufacturer}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      {/* Discount */}
                      <Col md="4">
                        <FormGroup>
                          <Label
                            for="discount"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Discount (Optional)
                          </Label>
                          <Input
                            type="text"
                            name="discount"
                            id="discount"
                            placeholder="Enter discount"
                            value={formik?.values?.discount ?? ""}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik?.touched?.discount &&
                              formik?.errors?.discount
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik?.touched?.discount &&
                            formik?.errors?.discount && (
                              <div className="invalid-feedback">
                                {formik?.errors?.discount}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      {/* Expiry Management */}
                      <Col md="4">
                        <FormGroup>
                          <Label
                            for="expirymanagement"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Expiry Management *
                          </Label>
                          <Input
                            type="select"
                            name="expirymanagement"
                            id="expirymanagement"
                            value={
                              formik?.values?.expirymanagement ? "Yes" : "No"
                            }
                            onChange={(e) =>
                              formik.setFieldValue(
                                "expirymanagement",
                                e.target.value === "Yes"
                              )
                            }
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik?.touched?.expirymanagement &&
                              formik?.errors?.expirymanagement
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          >
                            <option value="No">No</option>
                            <option value="Yes">Yes</option>
                          </Input>
                          {formik?.touched?.expirymanagement &&
                            formik?.errors?.expirymanagement && (
                              <div className="invalid-feedback">
                                {formik?.errors?.expirymanagement}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      {/* Drug Type */}
                      <Col md="4">
                        <FormGroup>
                          <Label
                            for="drug_type"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Drug Type *
                          </Label>
                          <Select
                            name="drug_type"
                            options={drugTypeOptions}
                            className="basic-select"
                            classNamePrefix="select"
                            onChange={(selectedOption) =>
                              formik.setFieldValue(
                                "drug_type",
                                selectedOption?.value ?? ""
                              )
                            }
                            onBlur={() =>
                              formik.setFieldTouched("drug_type", true)
                            }
                            value={drugTypeOptions?.find(
                              (option) =>
                                option?.value === formik?.values?.drug_type
                            )}
                            placeholder={
                              loadingDrugTypes
                                ? "Loading..."
                                : "Select drug type..."
                            }
                            isDisabled={loadingDrugTypes}
                          />
                          {formik?.touched?.drug_type &&
                            formik?.errors?.drug_type && (
                              <div
                                className="invalid-feedback"
                                style={{ display: "block" }}
                              >
                                {formik?.errors?.drug_type}
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
                            for="contact_details.phone"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Phone Number (Optional)
                          </Label>
                          <Input
                            type="text"
                            name="contact_details.phone"
                            id="contact_details.phone"
                            placeholder="Enter phone number"
                            value={formik?.values?.contact_details?.phone ?? ""}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik?.touched?.contact_details?.phone &&
                              formik?.errors?.contact_details?.phone
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik?.touched?.contact_details?.phone &&
                            formik?.errors?.contact_details?.phone && (
                              <div className="invalid-feedback">
                                {formik?.errors?.contact_details?.phone}
                              </div>
                            )}
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="contact_details.email"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Email (Optional)
                          </Label>
                          <Input
                            type="email"
                            name="contact_details.email"
                            id="contact_details.email"
                            placeholder="Enter email"
                            value={formik?.values?.contact_details?.email ?? ""}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik?.touched?.contact_details?.email &&
                              formik?.errors?.contact_details?.email
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik?.touched?.contact_details?.email &&
                            formik?.errors?.contact_details?.email && (
                              <div className="invalid-feedback">
                                {formik?.errors?.contact_details?.email}
                              </div>
                            )}
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="contact_details.website"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Website (Optional)
                          </Label>
                          <Input
                            type="text"
                            name="contact_details.website"
                            id="contact_details.website"
                            placeholder="Enter website URL"
                            value={
                              formik?.values?.contact_details?.website ?? ""
                            }
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik?.touched?.contact_details?.website &&
                              formik?.errors?.contact_details?.website
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik?.touched?.contact_details?.website &&
                            formik?.errors?.contact_details?.website && (
                              <div className="invalid-feedback">
                                {formik?.errors?.contact_details?.website}
                              </div>
                            )}
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="contact_details.address"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Address (Optional)
                          </Label>
                          <Input
                            type="textarea"
                            name="contact_details.address"
                            id="contact_details.address"
                            placeholder="Enter address"
                            value={
                              formik?.values?.contact_details?.address ?? ""
                            }
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik?.touched?.contact_details?.address &&
                              formik?.errors?.contact_details?.address
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik?.touched?.contact_details?.address &&
                            formik?.errors?.contact_details?.address && (
                              <div className="invalid-feedback">
                                {formik?.errors?.contact_details?.address}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      {/* Credit Details */}
                      <Col md="12">
                        <h5 className="text-dark mt-3">Credit Details</h5>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="credit_details.collectionType"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Collection Type (Optional)
                          </Label>
                          <Input
                            type="select"
                            name="credit_details.collectionType"
                            id="credit_details.collectionType"
                            value={
                              formik?.values?.credit_details?.collectionType ??
                              ""
                            }
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik?.touched?.credit_details?.collectionType &&
                              formik?.errors?.credit_details?.collectionType
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          >
                            <option value="">Select Type</option>
                            <option value="Daily">Daily</option>
                            <option value="Weekly">Weekly</option>
                            <option value="Monthly">Monthly</option>
                          </Input>
                          {formik?.touched?.credit_details?.collectionType &&
                            formik?.errors?.credit_details?.collectionType && (
                              <div className="invalid-feedback">
                                {formik?.errors?.credit_details?.collectionType}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      {(formik?.values?.credit_details?.collectionType ===
                        "Weekly" ||
                        formik?.values?.credit_details?.collectionType ===
                          "Monthly") && (
                        <Col md="6">
                          <FormGroup>
                            <Label
                              for="credit_details.collectionDay"
                              className="fw-bold text-dark"
                              style={{ fontSize: "14px" }}
                            >
                              Collection Day *
                            </Label>
                            <Input
                              type="text"
                              name="credit_details.collectionDay"
                              id="credit_details.collectionDay"
                              placeholder={
                                formik?.values?.credit_details
                                  ?.collectionType === "Weekly"
                                  ? "e.g., Monday"
                                  : "e.g., 15th"
                              }
                              value={
                                formik?.values?.credit_details?.collectionDay ??
                                ""
                              }
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              className={`form-control ${
                                formik?.touched?.credit_details
                                  ?.collectionDay &&
                                formik?.errors?.credit_details?.collectionDay
                                  ? "is-invalid"
                                  : ""
                              }`}
                              style={{
                                borderRadius: "8px",
                                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                padding: "10px",
                              }}
                            />
                            {formik?.touched?.credit_details?.collectionDay &&
                              formik?.errors?.credit_details?.collectionDay && (
                                <div className="invalid-feedback">
                                  {
                                    formik?.errors?.credit_details
                                      ?.collectionDay
                                  }
                                </div>
                              )}
                          </FormGroup>
                        </Col>
                      )}

                      <Col md="4">
                        <FormGroup>
                          <Label
                            for="credit_details.creditPeriod"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Credit Period (days) (Optional)
                          </Label>
                          <Input
                            type="number"
                            name="credit_details.creditPeriod"
                            id="credit_details.creditPeriod"
                            placeholder="Enter credit period"
                            value={
                              formik?.values?.credit_details?.creditPeriod ?? ""
                            }
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik?.touched?.credit_details?.creditPeriod &&
                              formik?.errors?.credit_details?.creditPeriod
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik?.touched?.credit_details?.creditPeriod &&
                            formik?.errors?.credit_details?.creditPeriod && (
                              <div className="invalid-feedback">
                                {formik?.errors?.credit_details?.creditPeriod}
                              </div>
                            )}
                        </FormGroup>
                      </Col>
                      <Col md="4">
                        <FormGroup>
                          <Label
                            for="credit_details.creditLimit"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Credit Limit (Optional)
                          </Label>
                          <Input
                            type="number"
                            name="credit_details.creditLimit"
                            id="credit_details.creditLimit"
                            placeholder="Enter credit limit"
                            value={
                              formik?.values?.credit_details?.creditLimit ?? ""
                            }
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik?.touched?.credit_details?.creditLimit &&
                              formik?.errors?.credit_details?.creditLimit
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik?.touched?.credit_details?.creditLimit &&
                            formik?.errors?.credit_details?.creditLimit && (
                              <div className="invalid-feedback">
                                {formik?.errors?.credit_details?.creditLimit}
                              </div>
                            )}
                        </FormGroup>
                      </Col>
                      <Col md="4">
                        <FormGroup>
                          <Label
                            for="credit_details.invoiceLimit"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Invoice Limit (Optional)
                          </Label>
                          <Input
                            type="number"
                            name="credit_details.invoiceLimit"
                            id="credit_details.invoiceLimit"
                            placeholder="Enter invoice limit"
                            value={
                              formik?.values?.credit_details?.invoiceLimit ?? ""
                            }
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik?.touched?.credit_details?.invoiceLimit &&
                              formik?.errors?.credit_details?.invoiceLimit
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik?.touched?.credit_details?.invoiceLimit &&
                            formik?.errors?.credit_details?.invoiceLimit && (
                              <div className="invalid-feedback">
                                {formik?.errors?.credit_details?.invoiceLimit}
                              </div>
                            )}
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="credit_details.billingCycle"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Billing Cycle (Optional)
                          </Label>
                          <Input
                            type="select"
                            name="credit_details.billingCycle"
                            id="credit_details.billingCycle"
                            value={
                              formik?.values?.credit_details?.billingCycle ?? ""
                            }
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik?.touched?.credit_details?.billingCycle &&
                              formik?.errors?.credit_details?.billingCycle
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          >
                            <option value="">Select Cycle</option>
                            <option value="Daily">Daily</option>
                            <option value="Weekly">Weekly</option>
                            <option value="Monthly">Monthly</option>
                          </Input>
                          {formik?.touched?.credit_details?.billingCycle &&
                            formik?.errors?.credit_details?.billingCycle && (
                              <div className="invalid-feedback">
                                {formik?.errors?.credit_details?.billingCycle}
                              </div>
                            )}
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="credit_details.paymentCycle"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Payment Cycle (Optional)
                          </Label>
                          <Input
                            type="text"
                            name="credit_details.paymentCycle"
                            id="credit_details.paymentCycle"
                            placeholder="Enter payment cycle (e.g., 15 days)"
                            value={
                              formik?.values?.credit_details?.paymentCycle ?? ""
                            }
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik?.touched?.credit_details?.paymentCycle &&
                              formik?.errors?.credit_details?.paymentCycle
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik?.touched?.credit_details?.paymentCycle &&
                            formik?.errors?.credit_details?.paymentCycle && (
                              <div className="invalid-feedback">
                                {formik?.errors?.credit_details?.paymentCycle}
                              </div>
                            )}
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="credit_details.interestRate"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Interest Rate (%) (Optional)
                          </Label>
                          <Input
                            type="number"
                            name="credit_details.interestRate"
                            id="credit_details.interestRate"
                            placeholder="Enter interest rate"
                            value={
                              formik?.values?.credit_details?.interestRate ?? ""
                            }
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik?.touched?.credit_details?.interestRate &&
                              formik?.errors?.credit_details?.interestRate
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik?.touched?.credit_details?.interestRate &&
                            formik?.errors?.credit_details?.interestRate && (
                              <div className="invalid-feedback">
                                {formik?.errors?.credit_details?.interestRate}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      {/* Submit Button */}
                      <Col md="12" className="text-end">
                        <Button
                          type="submit"
                          color="primary"
                          disabled={
                            formik?.isSubmitting ||
                            loadingManufacturers ||
                            loadingDrugTypes ||
                            loadingSellerTypes
                          }
                          style={{
                            padding: "10px 25px",
                            borderRadius: "8px",
                            boxShadow: "0 4px 10px rgba(0, 123, 255, 0.3)",
                            transition: "transform 0.3s ease",
                          }}
                          className="hover-scale"
                        >
                          {formik?.isSubmitting
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
          fontsize: 12px;
          color: #dc3545;
        }
      `}</style>
    </React.Fragment>
  );
};

export default SellerManagementForm;
