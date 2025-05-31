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
import Select from "react-select";

import {
  postSupplier,
  getSupplierById,
  updateSupplier,
} from "../../../ApiService/Associate/Supplier";
import { getManufacturers } from "../../../ApiService/Drugs/Drug";
import { getDrugTypes } from "../../../ApiService/Drugs/DrugType";
import { getSupplierTypes } from "../../../ApiService/Associate/SupplierTypeMaster";

const validationSchema = Yup.object().shape({
  supplierName: Yup.string()
    .required("Supplier Name is required")
    .min(2, "Supplier Name must be at least 2 characters"),
  drugLicenceNo: Yup.string()
    .required("Drug Licence No. is required"),
   
  gstNo: Yup.string()
    .required("GST No. is required")
    .matches(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      "Invalid GST No. format"
    ),
  fssaiNo: Yup.string()
    .nullable()
    .matches(/^[0-9]{14}$/, "FSSAI No. must be 14 digits"),
  prohibitedStatus: Yup.string().required("Prohibited Status is required"),
  type: Yup.string().required("Supplier Type is required"),
  manufacturerMapping: Yup.array().of(Yup.string()),
  expiryManagement: Yup.string().required("Expiry Management is required"),
  returnPeriod: Yup.number()
    .typeError("Return Period must be a number")
    .required("Return Period is required")
    .min(1, "Return Period must be at least 1 day"),
  drugType: Yup.array()
    .of(Yup.string())
    .min(1, "At least one Drug Type is required")
    .required("Drug Type is required"),
  shortForm: Yup.string()
    .min(2, "Short Form must be at least 2 characters")
    .max(10, "Short Form cannot exceed 10 characters"),
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
  description: Yup.string().min(
    10,
    "Description must be at least 10 characters"
  ),
  drugLicenceUpload: Yup.mixed()
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
  gstUpload: Yup.mixed()
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
  fssaiUpload: Yup.mixed()
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
  discount: Yup.string(),
  returnDate: Yup.number()
    .nullable()
    .min(0, "Return Date cannot be negative")
    .integer("Return Date must be an integer"),
  contactDetails: Yup.object({
    phone: Yup.string().matches(
      /^\d{10}$/,
      "Phone Number must be exactly 10 digits"
    ),
    email: Yup.string().email("Invalid email format"),
    website: Yup.string().url("Invalid URL format"),
    address: Yup.string(),
  }),
  creditDetails: Yup.object().shape({
    collectionType: Yup.string(),
    collectionDay: Yup.string().when("collectionType", {
      is: (collectionType) => ["Weekly", "Monthly"].includes(collectionType),
      then: (schema) => schema.required("Collection Day is required"),
      otherwise: (schema) => schema.nullable(),
    }),
    interestRate: Yup.number().min(0, "Interest Rate cannot be negative"),
  }),
  historyTracking: Yup.object({
    creditPeriod: Yup.number()
      .min(0, "Credit Period cannot be negative")
      .integer("Credit Period must be an integer"),
    creditLimit: Yup.number().min(0, "Credit Limit cannot be negative"),
    invoiceLimit: Yup.number().min(0, "Invoice Limit cannot be negative"),
    billingCycle: Yup.number()
      .min(0, "Billing Cycle cannot be negative")
      .integer("Billing Cycle must be an integer"),
    paymentCycle: Yup.string(),
  }),
});

const SupplierManagementForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const logoRef = useRef(null);
  const drugLicenceRef = useRef(null);
  const gstUploadRef = useRef(null);
  const fssaiUploadRef = useRef(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoName, setLogoName] = useState("");
  const [drugLicencePreview, setDrugLicencePreview] = useState(null);
  const [drugLicenceName, setDrugLicenceName] = useState("");
  const [gstUploadPreview, setGstUploadPreview] = useState(null);
  const [gstUploadName, setGstUploadName] = useState("");
  const [fssaiUploadPreview, setFssaiUploadPreview] = useState(null);
  const [fssaiUploadName, setFssaiUploadName] = useState("");
  const [manufacturerOptions, setManufacturerOptions] = useState([]);
  const [drugTypeOptions, setDrugTypeOptions] = useState([]);
  const [supplierTypeOptions, setSupplierTypeOptions] = useState([]);
  const [loadingManufacturers, setLoadingManufacturers] = useState(true);
  const [loadingDrugTypes, setLoadingDrugTypes] = useState(true);
  const [loadingSupplierTypes, setLoadingSupplierTypes] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [supplierId, setSupplierId] = useState(null);

  useEffect(() => {
    if (location.state && location.state.id) {
      setIsEditMode(true);
      setSupplierId(location.state.id);
      fetchSupplier(location.state.id);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchManufacturers = async () => {
      try {
        setLoadingManufacturers(true);
        const response = await getManufacturers(1, 100, "");
        const formattedManufacturers = response.data.map((manufacturer) => ({
          value: manufacturer.manufacturer_id,
          label: manufacturer.manufacturer_name,
        }));
        setManufacturerOptions(formattedManufacturers);
      } catch (error) {
        console.error("Error fetching manufacturers:", error);
        Swal.fire({
          title: "Error!",
          text: error.message || "Failed to fetch manufacturers.",
          icon: "error",
          confirmButtonText: "OK",
        });
      } finally {
        setLoadingManufacturers(false);
      }
    };
    fetchManufacturers();
  }, []);

  useEffect(() => {
    const fetchDrugTypes = async () => {
      try {
        const data = await getDrugTypes();
        const formattedDrugTypes = data.map((drugType) => ({
          value: drugType.drug_type_id || drugType.type,
          label: drugType.drug_type_name || drugType.type,
        }));
        setDrugTypeOptions(formattedDrugTypes);
        setLoadingDrugTypes(false);
      } catch (error) {
        console.error("Error fetching drug types:", error);
        Swal.fire({
          title: "Error!",
          text: error.message || "Failed to fetch drug types.",
          icon: "error",
          confirmButtonText: "OK",
        });
        setLoadingDrugTypes(false);
      }
    };
    fetchDrugTypes();
  }, []);

  useEffect(() => {
    const fetchSupplierTypes = async () => {
      try {
        const data = await getSupplierTypes();
        const formattedSupplierTypes = data.map((type) => ({
          value: type.id || type.type || type.supplier_type_id,
          label: type.supplier_type || type.type || type.supplier_type_name,
        }));
        setSupplierTypeOptions(formattedSupplierTypes);
        setLoadingSupplierTypes(false);
      } catch (error) {
        console.error("Error fetching supplier types:", error);
        Swal.fire({
          title: "Error!",
          text: error.message || "Failed to fetch supplier types.",
          icon: "error",
          confirmButtonText: "OK",
        });
        setLoadingSupplierTypes(false);
      }
    };
    fetchSupplierTypes();
  }, []);

 const fetchSupplier = async (id) => {
  try {
    const data = await getSupplierById(id);
    
    // Map manufacturer IDs
    const manufacturerMapping = data.manufacturer_name
      ? data.manufacturer_name.map((m) => m.manufacturer_id)
      : [];

    // Map drug type IDs
    const drugTypeMapping = data.drug_type_name
      ? data.drug_type_name.map((d) => d.drug_type_id)
      : [];

    // Set form values
    formik.setValues({
      supplierName: data.supplier_name || "",
      shortForm: data.short_form || "",
      logo: null, // File input should remain null for edit mode
      description: data.description || "",
      drugLicenceNo: data.drug_license_no || "",
      drugLicenceUpload: null,
      gstNo: data.gst_no || "",
      gstUpload: null,
      fssaiNo: data.fssai_no || "",
      fssaiUpload: null,
      prohibitedStatus: data.prohibited_status ? "Yes" : "No",
      type: data.supplier_type_id ? String(data.supplier_type_id) : "", // Ensure string for select input
      manufacturerMapping: manufacturerMapping,
      discount: data.discount || "",
      expiryManagement: data.expiry_management || "",
      returnPeriod: data.reorder_level || "",
      drugType: drugTypeMapping,
      contactDetails: {
        phone: data.contact_details?.phone || "",
        email: data.contact_details?.email || "",
        website: data.contact_details?.website || "",
        address: data.contact_details?.address || "",
      },
      creditDetails: {
        collectionType: data.credit_details?.collectionType || "", // Default to empty string if not present
        collectionDay: data.credit_details?.collectionDay || "", // Default to empty string if not present
        interestRate: data.credit_details?.interestRate || "",
      },
      historyTracking: {
        creditPeriod: data.credit_details?.creditPeriod || "",
        creditLimit: data.credit_details?.creditLimit || "",
        invoiceLimit: data.credit_details?.invoiceLimit || "",
        billingCycle: data.credit_details?.billingCycle || "",
        paymentCycle: data.credit_details?.paymentCycle || "",
      },
    });

    // Update manufacturer options to include selected manufacturers
    if (manufacturerMapping.length > 0) {
      const existingValues = manufacturerOptions.map((opt) => opt.value);
      const missingManufacturers = manufacturerMapping.filter(
        (id) => !existingValues.includes(id)
      );
      if (missingManufacturers.length > 0) {
        const newOptions = missingManufacturers.map((id) => {
          const manufacturer = data.manufacturer_name.find(
            (m) => m.manufacturer_id === id
          );
          return {
            value: id,
            label: manufacturer
              ? manufacturer.manufacturer_name
              : `Manufacturer ${id}`,
          };
        });
        setManufacturerOptions((prev) => [...prev, ...newOptions]);
      }
    }

    // Set file previews
    if (data.logo) {
      setLogoPreview(`${import.meta.env.VITE_API_BASE_URL}${data.logo}`);
      setLogoName(data.logo.split("/").pop());
    } else {
      setLogoPreview(null);
      setLogoName("");
    }

    if (data.drug_license_no_file) {
      setDrugLicencePreview(
        `${import.meta.env.VITE_API_BASE_URL}${data.drug_license_no_file}`
      );
      setDrugLicenceName(data.drug_license_no_file.split("/").pop());
    } else {
      setDrugLicencePreview(null);
      setDrugLicenceName("");
    }

    if (data.gst_file) {
      setGstUploadPreview(
        `${import.meta.env.VITE_API_BASE_URL}${data.gst_file}`
      );
      setGstUploadName(data.gst_file.split("/").pop());
    } else {
      setGstUploadPreview(null);
      setGstUploadName("");
    }

    if (data.fassi_file) {
      setFssaiUploadPreview(
        `${import.meta.env.VITE_API_BASE_URL}${data.fassi_file}`
      );
      setFssaiUploadName(data.fassi_file.split("/").pop());
    } else {
      setFssaiUploadPreview(null);
      setFssaiUploadName("");
    }
  } catch (error) {
    console.error("Error fetching supplier:", error);
    Swal.fire({
      title: "Error!",
      text: error.message || "Failed to fetch supplier data.",
      icon: "error",
      confirmButtonText: "OK",
    });
  }
};

  const debouncedSearchManufacturers = debounce(
    async (inputValue, callback) => {
      try {
        setLoadingManufacturers(true);
        const response = await getManufacturers(1, 100, inputValue || "");
        const formattedManufacturers = response.data.map((manufacturer) => ({
          value: manufacturer.manufacturer_id,
          label: manufacturer.manufacturer_name,
        }));

        // Preserve selected manufacturers in manufacturerOptions
        const selectedManufacturers = formik.values.manufacturerMapping.map(
          (manuId) => {
            const existingOption = manufacturerOptions.find(
              (opt) => opt.value === manuId
            );
            return (
              existingOption || {
                value: manuId,
                label: `Manufacturer ${manuId}`, // Placeholder if name not available
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
          text: error.message || "Failed to search manufacturers.",
          icon: "error",
          confirmButtonText: "OK",
        });
        callback([]);
      } finally {
        setLoadingManufacturers(false);
      }
    },
    700
  );

  const handleSearchManufacturers = (inputValue, callback) => {
    debouncedSearchManufacturers(inputValue, callback);
  };

  const formik = useFormik({
    initialValues: {
      supplierName: "",
      shortForm: "",
      logo: null,
      description: "",
      drugLicenceNo: "",
      drugLicenceUpload: null,
      gstNo: "",
      gstUpload: null,
      fssaiNo: "",
      fssaiUpload: null,
      prohibitedStatus: "",
      type: "",
      manufacturerMapping: [],
      discount: "",
      expiryManagement: "",
      returnPeriod: "",
      drugType: [],
      contactDetails: { phone: "", email: "", website: "", address: "" },
      creditDetails: {
        collectionType: "",
        collectionDay: "",
        interestRate: "",
      },
      historyTracking: {
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
        formData.append("supplier_name", values.supplierName);
        if (values.shortForm) formData.append("short_form", values.shortForm);
        if (values.logo) formData.append("logo", values.logo);
        if (values.description)
          formData.append("description", values.description);
        formData.append("drug_license_no", values.drugLicenceNo);
        if (values.drugLicenceUpload)
          formData.append("drug_license_no_file", values.drugLicenceUpload);
        formData.append("gst_no", values.gstNo);
        if (values.gstUpload) formData.append("gst_file", values.gstUpload);
        if (values.fssaiNo) formData.append("fssai_no", values.fssaiNo);
        if (values.fssaiUpload)
          formData.append("fassi_file", values.fssaiUpload);
        formData.append(
          "prohibited_status",
          values.prohibitedStatus === "Yes" ? true : false
        );
        formData.append("supplier_type_id", values.type);
        formData.append(
          "manufacturer_id",
          JSON.stringify(values.manufacturerMapping)
        );
        if (values.discount) formData.append("discount", values.discount);
        formData.append("expiry_management", values.expiryManagement);
        formData.append("reorder_level", values.returnPeriod);
        formData.append("drug_type", JSON.stringify(values.drugType));

        if (
          values.contactDetails &&
          Object.values(values.contactDetails).some((val) => val)
        )
          formData.append(
            "contact_details",
            JSON.stringify(values.contactDetails)
          );

        const creditDetails = {};
        if (values.creditDetails.collectionType)
          creditDetails.collectionType = values.creditDetails.collectionType;
        if (values.creditDetails.collectionDay)
          creditDetails.collectionDay = values.creditDetails.collectionDay;
        if (values.creditDetails.interestRate)
          creditDetails.interestRate = values.creditDetails.interestRate;
        if (values.historyTracking.creditPeriod)
          creditDetails.creditPeriod = values.historyTracking.creditPeriod;
        if (values.historyTracking.creditLimit)
          creditDetails.creditLimit = values.historyTracking.creditLimit;
        if (values.historyTracking.invoiceLimit)
          creditDetails.invoiceLimit = values.historyTracking.invoiceLimit;
        if (values.historyTracking.billingCycle)
          creditDetails.billingCycle = values.historyTracking.billingCycle;
        if (values.historyTracking.paymentCycle)
          creditDetails.paymentCycle = values.historyTracking.paymentCycle;

        if (Object.keys(creditDetails).length > 0)
          formData.append("credit_details", JSON.stringify(creditDetails));

        let response;
        if (isEditMode) {
          response = await updateSupplier(supplierId, formData);
          Swal.fire({
            title: "Supplier Updated!",
            text: "The supplier has been successfully updated.",
            icon: "success",
            confirmButtonText: "OK",
          });
        } else {
          response = await postSupplier(formData);
          Swal.fire({
            title: "Supplier Registered!",
            text: "The supplier has been successfully registered.",
            icon: "success",
            confirmButtonText: "OK",
          });
        }

        if (response) {
          formik.resetForm();
          if (logoRef.current) logoRef.current.value = "";
          if (drugLicenceRef.current) drugLicenceRef.current.value = "";
          if (gstUploadRef.current) gstUploadRef.current.value = "";
          if (fssaiUploadRef.current) fssaiUploadRef.current.value = "";
          setLogoPreview(null);
          setLogoName("");
          setDrugLicencePreview(null);
          setDrugLicenceName("");
          setGstUploadPreview(null);
          setGstUploadName("");
          setFssaiUploadPreview(null);
          setFssaiUploadName("");
          navigate("/supplier-management-list");
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

  const handleLogoChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
      setLogoName(file.name);
      formik.setFieldValue("logo", file);
    }
  };

  const handleLogoRemove = () => {
    setLogoPreview(null);
    setLogoName("");
    formik.setFieldValue("logo", null);
    if (logoRef.current) logoRef.current.value = "";
  };

  const handleDrugLicenceChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      setDrugLicencePreview(URL.createObjectURL(file));
      setDrugLicenceName(file.name);
      formik.setFieldValue("drugLicenceUpload", file);
    }
  };

  const handleDrugLicenceRemove = () => {
    setDrugLicencePreview(null);
    setDrugLicenceName("");
    formik.setFieldValue("drugLicenceUpload", null);
    if (drugLicenceRef.current) drugLicenceRef.current.value = "";
  };

  const handleGstUploadChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      setGstUploadPreview(URL.createObjectURL(file));
      setGstUploadName(file.name);
      formik.setFieldValue("gstUpload", file);
    }
  };

  const handleGstUploadRemove = () => {
    setGstUploadPreview(null);
    setGstUploadName("");
    formik.setFieldValue("gstUpload", null);
    if (gstUploadRef.current) gstUploadRef.current.value = "";
  };

  const handleFssaiUploadChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      setFssaiUploadPreview(URL.createObjectURL(file));
      setFssaiUploadName(file.name);
      formik.setFieldValue("fssaiUpload", file);
    }
  };

  const handleFssaiUploadRemove = () => {
    setFssaiUploadPreview(null);
    setFssaiUploadName("");
    formik.setFieldValue("fssaiUpload", null);
    if (fssaiUploadRef.current) fssaiUploadRef.current.value = "";
  };

  document.title = isEditMode ? "Edit Supplier" : "Add Supplier";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Supplier Management"
            breadcrumbItem={
              isEditMode ? "Edit Supplier Details" : "Add Supplier Details"
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
                        ? "Edit Supplier Details"
                        : "Add Supplier Details"}
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
                      {/* Supplier Name */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="supplierName"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Supplier Name *
                          </Label>
                          <Input
                            type="text"
                            name="supplierName"
                            id="supplierName"
                            placeholder="Enter supplier name"
                            value={formik.values.supplierName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.supplierName &&
                              formik.errors.supplierName
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.touched.supplierName &&
                            formik.errors.supplierName && (
                              <div className="invalid-feedback">
                                {formik.errors.supplierName}
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
                            Supplier Logo (Optional)
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
                          {logoPreview && (
                            <div
                              style={{
                                position: "relative",
                                display: "inline-block",
                                marginTop: "10px",
                              }}
                            >
                              <img
                                src={logoPreview}
                                alt="Supplier Logo"
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

                      {/* Drug Licence No */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="drugLicenceNo"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Drug Licence No. *
                          </Label>
                          <Input
                            type="text"
                            name="drugLicenceNo"
                            id="drugLicenceNo"
                            placeholder="Enter drug licence number"
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

                      {/* Drug Licence Upload */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="drugLicenceUpload"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Drug Licence Upload (Optional)
                          </Label>
                          <Input
                            type="file"
                            name="drugLicenceUpload"
                            id="drugLicenceUpload"
                            accept=".pdf,image/*"
                            ref={drugLicenceRef}
                            onChange={handleDrugLicenceChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.drugLicenceUpload &&
                              formik.errors.drugLicenceUpload
                              ? "is-invalid"
                              : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "8px",
                            }}
                          />
                          {formik.touched.drugLicenceUpload &&
                            formik.errors.drugLicenceUpload && (
                              <div className="invalid-feedback">
                                {formik.errors.drugLicenceUpload}
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

                      {/* GST No */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="gstNo"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            GST No. *
                          </Label>
                          <Input
                            type="text"
                            name="gstNo"
                            id="gstNo"
                            placeholder="Enter GST number"
                            value={formik.values.gstNo}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.gstNo && formik.errors.gstNo
                              ? "is-invalid"
                              : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.touched.gstNo && formik.errors.gstNo && (
                            <div className="invalid-feedback">
                              {formik.errors.gstNo}
                            </div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* GST Upload */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="gstUpload"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Upload GST File (Optional)
                          </Label>
                          <Input
                            type="file"
                            name="gstUpload"
                            id="gstUpload"
                            accept=".pdf,image/*"
                            ref={gstUploadRef}
                            onChange={handleGstUploadChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.gstUpload &&
                              formik.errors.gstUpload
                              ? "is-invalid"
                              : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "8px",
                            }}
                          />
                          {formik.touched.gstUpload &&
                            formik.errors.gstUpload && (
                              <div className="invalid-feedback">
                                {formik.errors.gstUpload}
                              </div>
                            )}
                          {gstUploadPreview && (
                            <div
                              style={{
                                position: "relative",
                                display: "inline-block",
                                marginTop: "10px",
                              }}
                            >
                              {gstUploadName.endsWith(".pdf") ? (
                                <a
                                  href={gstUploadPreview}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    display: "block",
                                    fontSize: "14px",
                                    color: "#007bff",
                                  }}
                                >
                                  {gstUploadName} (PDF)
                                </a>
                              ) : (
                                <img
                                  src={gstUploadPreview}
                                  alt="GST Upload"
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
                                onClick={handleGstUploadRemove}
                              >
                                X
                              </Button>
                            </div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* FSSAI No */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="fssaiNo"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            FSSAI No.
                          </Label>
                          <Input
                            type="text"
                            name="fssaiNo"
                            id="fssaiNo"
                            placeholder="Enter FSSAI number"
                            value={formik.values.fssaiNo}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.fssaiNo && formik.errors.fssaiNo
                              ? "is-invalid"
                              : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.touched.fssaiNo && formik.errors.fssaiNo && (
                            <div className="invalid-feedback">
                              {formik.errors.fssaiNo}
                            </div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* FSSAI Upload */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="fssaiUpload"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Upload FSSAI File (Optional)
                          </Label>
                          <Input
                            type="file"
                            name="fssaiUpload"
                            id="fssaiUpload"
                            accept=".pdf,image/*"
                            ref={fssaiUploadRef}
                            onChange={handleFssaiUploadChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.fssaiUpload &&
                              formik.errors.fssaiUpload
                              ? "is-invalid"
                              : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "8px",
                            }}
                          />
                          {formik.touched.fssaiUpload &&
                            formik.errors.fssaiUpload && (
                              <div className="invalid-feedback">
                                {formik.errors.fssaiUpload}
                              </div>
                            )}
                          {fssaiUploadPreview && (
                            <div
                              style={{
                                position: "relative",
                                display: "inline-block",
                                marginTop: "10px",
                              }}
                            >
                              {fssaiUploadName.endsWith(".pdf") ? (
                                <a
                                  href={fssaiUploadPreview}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    display: "block",
                                    fontSize: "14px",
                                    color: "#007bff",
                                  }}
                                >
                                  {fssaiUploadName} (PDF)
                                </a>
                              ) : (
                                <img
                                  src={fssaiUploadPreview}
                                  alt="FSSAI Upload"
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
                                onClick={handleFssaiUploadRemove}
                              >
                                X
                              </Button>
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
                            Prohibited Status *
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

                      {/* Supplier Type */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="type"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Supplier Type *
                          </Label>
                          <Input
                            type="select"
                            name="type"
                            id="type"
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
                          >
                            <option value="">Select Supplier Type</option>
                            {supplierTypeOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </Input>
                          {formik.touched.type && formik.errors.type && (
                            <div className="invalid-feedback">
                              {formik.errors.type}
                            </div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* Manufacturer Mapping */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="manufacturerMapping"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Manufacturer Mapping
                          </Label>
                          <AsyncSelect
                            cacheOptions
                            defaultOptions={manufacturerOptions}
                            loadOptions={handleSearchManufacturers}
                            isMulti
                            name="manufacturerMapping"
                            className="basic-select"
                            classNamePrefix="select"
                            onChange={(selectedOptions) =>
                              formik.setFieldValue(
                                "manufacturerMapping",
                                selectedOptions
                                  ? selectedOptions.map(
                                      (option) => option.value
                                    )
                                  : []
                              )
                            }
                            onBlur={() =>
                              formik.setFieldTouched(
                                "manufacturerMapping",
                                true
                              )
                            }
                            value={formik.values.manufacturerMapping.map(
                              (manuId) => {
                                const option = manufacturerOptions.find(
                                  (opt) => opt.value === manuId
                                );
                                return (
                                  option || {
                                    value: manuId,
                                    label: `Manufacturer ${manuId}`,
                                  }
                                );
                              }
                            )}
                            placeholder={
                              loadingManufacturers
                                ? "Loading..."
                                : "Search manufacturers by name..."
                            }
                            isDisabled={loadingManufacturers}
                            isLoading={loadingManufacturers}
                          />
                          <small className="text-muted">
                            Note: If no manufacturers are selected, all
                            available manufacturers will be automatically
                            associated with this supplier.
                          </small>
                          {formik.touched.manufacturerMapping &&
                            formik.errors.manufacturerMapping && (
                              <div
                                className="invalid-feedback"
                                style={{ display: "block" }}
                              >
                                {formik.errors.manufacturerMapping}
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
                            placeholder="Enter discount"
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

                      {/* Expiry Management */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="expiryManagement"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Expiry Management (days) *
                          </Label>
                          <Input
                            type="number"
                            name="expiryManagement"
                            id="expiryManagement"
                            placeholder="Enter days (e.g., 30)"
                            value={formik.values.expiryManagement}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.expiryManagement &&
                              formik.errors.expiryManagement
                              ? "is-invalid"
                              : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.values.expiryManagement &&
                            !formik.errors.expiryManagement && (
                              <small className="text-muted">{`${formik.values.expiryManagement} days`}</small>
                            )}
                          {formik.touched.expiryManagement &&
                            formik.errors.expiryManagement && (
                              <div className="invalid-feedback">
                                {formik.errors.expiryManagement}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      {/* Return Period */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="returnPeriod"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Return Period (days) *
                          </Label>
                          <Input
                            type="number"
                            name="returnPeriod"
                            id="returnPeriod"
                            placeholder="Enter days (e.g., 15)"
                            value={formik.values.returnPeriod}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.returnPeriod &&
                              formik.errors.returnPeriod
                              ? "is-invalid"
                              : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.values.returnPeriod &&
                            !formik.errors.returnPeriod && (
                              <small className="text-muted">{`${formik.values.returnPeriod} days`}</small>
                            )}
                          {formik.touched.returnPeriod &&
                            formik.errors.returnPeriod && (
                              <div className="invalid-feedback">
                                {formik.errors.returnPeriod}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      {/* Drug Type */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="drugType"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Drug Type *
                          </Label>
                          <Select
                            name="drugType"
                            options={drugTypeOptions}
                            isMulti
                            className="basic-select"
                            classNamePrefix="select"
                            onChange={(selectedOptions) =>
                              formik.setFieldValue(
                                "drugType",
                                selectedOptions
                                  ? selectedOptions.map(
                                      (option) => option.value
                                    )
                                  : []
                              )
                            }
                            onBlur={() =>
                              formik.setFieldTouched("drugType", true)
                            }
                            value={drugTypeOptions.filter((option) =>
                              formik.values.drugType.includes(option.value)
                            )}
                            placeholder={
                              loadingDrugTypes
                                ? "Loading..."
                                : "Select drug types..."
                            }
                            isDisabled={loadingDrugTypes}
                          />
                          {formik.touched.drugType &&
                            formik.errors.drugType && (
                              <div
                                className="invalid-feedback"
                                style={{ display: "block" }}
                              >
                                {formik.errors.drugType}
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

                      {/* Credit Details */}
                      <Col md="12">
                        <h5 className="text-dark mt-3">Credit Details</h5>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="creditDetails.collectionType"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Collection Type (Optional)
                          </Label>
                          <Input
                            type="select"
                            name="creditDetails.collectionType"
                            id="creditDetails.collectionType"
                            value={formik.values.creditDetails.collectionType}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.creditDetails?.collectionType &&
                              formik.errors.creditDetails?.collectionType
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
                          {formik.touched.creditDetails?.collectionType &&
                            formik.errors.creditDetails?.collectionType && (
                              <div className="invalid-feedback">
                                {formik.errors.creditDetails.collectionType}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      {/* Collection Day (Conditional) */}
                      {(formik.values.creditDetails.collectionType ===
                        "Weekly" ||
                        formik.values.creditDetails.collectionType ===
                          "Monthly") && (
                        <Col md="6">
                          <FormGroup>
                            <Label
                              for="creditDetails.collectionDay"
                              className="fw-bold text-dark"
                              style={{ fontSize: "14px" }}
                            >
                              Collection Day *
                            </Label>
                            <Input
                              type="text"
                              name="creditDetails.collectionDay"
                              id="creditDetails.collectionDay"
                              placeholder={
                                formik.values.creditDetails.collectionType ===
                                "Weekly"
                                  ? "e.g., Monday"
                                  : "e.g., 15th"
                              }
                              value={formik.values.creditDetails.collectionDay}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              className={`form-control ${
                                formik.touched.creditDetails?.collectionDay &&
                                formik.errors.creditDetails?.collectionDay
                                ? "is-invalid"
                                : ""
                              }`}
                              style={{
                                borderRadius: "8px",
                                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                padding: "10px",
                              }}
                            />
                            {formik.touched.creditDetails?.collectionDay &&
                              formik.errors.creditDetails?.collectionDay && (
                                <div className="invalid-feedback">
                                  {formik.errors.creditDetails.collectionDay}
                                </div>
                              )}
                          </FormGroup>
                        </Col>
                      )}

                      {/* History Tracking */}
                      <Col md="4">
                        <FormGroup>
                          <Label
                            for="historyTracking.creditPeriod"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Credit Period (days) (Optional)
                          </Label>
                          <Input
                            type="number"
                            name="historyTracking.creditPeriod"
                            id="historyTracking.creditPeriod"
                            placeholder="Enter credit period"
                            value={formik.values.historyTracking.creditPeriod}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.historyTracking?.creditPeriod &&
                              formik.errors.historyTracking?.creditPeriod
                              ? "is-invalid"
                              : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.touched.historyTracking?.creditPeriod &&
                            formik.errors.historyTracking?.creditPeriod && (
                              <div className="invalid-feedback">
                                {formik.errors.historyTracking.creditPeriod}
                              </div>
                            )}
                        </FormGroup>
                      </Col>
                      <Col md="4">
                        <FormGroup>
                          <Label
                            for="historyTracking.creditLimit"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Credit Limit (Optional)
                          </Label>
                          <Input
                            type="number"
                            name="historyTracking.creditLimit"
                            id="historyTracking.creditLimit"
                            placeholder="Enter credit limit"
                            value={formik.values.historyTracking.creditLimit}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.historyTracking?.creditLimit &&
                              formik.errors.historyTracking?.creditLimit
                              ? "is-invalid"
                              : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.touched.historyTracking?.creditLimit &&
                            formik.errors.historyTracking?.creditLimit && (
                              <div className="invalid-feedback">
                                {formik.errors.historyTracking.creditLimit}
                              </div>
                            )}
                        </FormGroup>
                      </Col>
                      <Col md="4">
                        <FormGroup>
                          <Label
                            for="historyTracking.invoiceLimit"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Invoice Limit (Optional)
                          </Label>
                          <Input
                            type="number"
                            name="historyTracking.invoiceLimit"
                            id="historyTracking.invoiceLimit"
                            placeholder="Enter invoice limit"
                            value={formik.values.historyTracking.invoiceLimit}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.historyTracking?.invoiceLimit &&
                              formik.errors.historyTracking?.invoiceLimit
                              ? "is-invalid"
                              : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.touched.historyTracking?.invoiceLimit &&
                            formik.errors.historyTracking?.invoiceLimit && (
                              <div className="invalid-feedback">
                                {formik.errors.historyTracking.invoiceLimit}
                              </div>
                            )}
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="historyTracking.billingCycle"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Billing Cycle (days)
                          </Label>
                          <Input
                            type="number"
                            name="historyTracking.billingCycle"
                            id="historyTracking.billingCycle"
                            placeholder="Enter days (e.g., 30)"
                            value={formik.values.historyTracking.billingCycle}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.historyTracking?.billingCycle &&
                              formik.errors.historyTracking?.billingCycle
                              ? "is-invalid"
                              : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="historyTracking.paymentCycle"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Payment Cycle (Optional)
                          </Label>
                          <Input
                            type="text"
                            name="historyTracking.paymentCycle"
                            id="historyTracking.paymentCycle"
                            placeholder="Enter payment cycle (e.g., 15 days)"
                            value={formik.values.historyTracking.paymentCycle}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.historyTracking?.paymentCycle &&
                              formik.errors.historyTracking?.paymentCycle
                              ? "is-invalid"
                              : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.touched.historyTracking?.paymentCycle &&
                            formik.errors.historyTracking?.paymentCycle && (
                              <div className="invalid-feedback">
                                {formik.errors.historyTracking.paymentCycle}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="creditDetails.interestRate"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Interest Rate (%) (Optional)
                          </Label>
                          <Input
                            type="number"
                            name="creditDetails.interestRate"
                            id="creditDetails.interestRate"
                            placeholder="Enter interest rate"
                            value={formik.values.creditDetails.interestRate}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.creditDetails?.interestRate &&
                              formik.errors.creditDetails?.interestRate
                              ? "is-invalid"
                              : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.touched.creditDetails?.interestRate &&
                            formik.errors.creditDetails?.interestRate && (
                              <div className="invalid-feedback">
                                {formik.errors.creditDetails.interestRate}
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
                            formik.isSubmitting ||
                            loadingManufacturers ||
                            loadingDrugTypes ||
                            loadingSupplierTypes
                          }
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

export default SupplierManagementForm;