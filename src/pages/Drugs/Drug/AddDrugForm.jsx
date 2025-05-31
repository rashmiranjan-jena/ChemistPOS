import React, { useState, useRef, useEffect, useCallback } from "react";
import { debounce } from "lodash";
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
  postDrug,
  getDrugById,
  updateDrug,
  getManufacturers,
  getGST,
} from "../../../ApiService/Drugs/Drug";
import { getDrugTypes } from "../../../ApiService/Drugs/DrugType";
import { getBrands } from "../../../ApiService/Drugs/BrandForm";
import { getGroupCategories } from "../../../ApiService/Drugs/GroupCategory";
import { getCategories } from "../../../ApiService/Drugs/Category";
import { getSubCategories } from "../../../ApiService/Drugs/Subcategory";
import { getProductTypes } from "../../../ApiService/Drugs/ProductType";
import { getGroupDiseases } from "../../../ApiService/Drugs/GroupDisease";
import { getDiseases } from "../../../ApiService/Drugs/Disease";
import { getStrengths } from "../../../ApiService/Drugs/Strength";
import { getGenericDescriptions } from "../../../ApiService/Drugs/GenericDescripsation";
import { getDrugs } from "../../../ApiService/Drugs/DrugForm";
import Select from "react-select";
import Swal from "sweetalert2";
import _ from "lodash";

// Validation schema based on product type
const getValidationSchema = (productType) => {
  if (productType === "medical") {
    return Yup.object().shape({
      drugType: Yup.string().required("Drug Type is required"),
      drugName: Yup.string().required("Drug Name is required"),
      drugNameManufacturer: Yup.string().required("Manufacturer is required"),
      brand: Yup.string().required("Brand is required"),
      category: Yup.string().required("Category is required"),
      subCategory: Yup.string().required("Sub Category is required"),
      productType: Yup.string().required("Product Type is required"),
      form: Yup.string().required("Form is required"),
      hsn: Yup.string().required("HSN is required"),
      returnable: Yup.string().required("Returnable is required"),
      image: Yup.mixed()
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
            !value ||
            ["image/jpeg", "image/png", "image/jpg"].includes(value?.type)
        ),
    });
  } else {
    return Yup.object().shape({
      drugName: Yup.string().required("Product Name is required"),
      drugNameManufacturer: Yup.string().required("Manufacturer is required"),
      brand: Yup.string().required("Brand is required"),
      category: Yup.string().required("Category is required"),
      subCategory: Yup.string().required("Sub Category is required"),
      productType: Yup.string().required("Product Type is required"),
      form: Yup.string().required("Form is required"),
      hsn: Yup.string().required("HSN is required"),
      image: Yup.mixed()
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
            !value ||
            ["image/jpeg", "image/png", "image/jpg"].includes(value?.type)
        ),
    });
  }
};

const AddDrugForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const photoRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageName, setImageName] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [drugId, setDrugId] = useState(null);
  const [productType, setProductType] = useState("medical");
  const [selectedManufacturer, setSelectedManufacturer] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedDisease, setSelectedDisease] = useState(null);

  const [drugTypes, setDrugTypes] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [brands, setBrands] = useState([]);
  const [groupCategories, setGroupCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [groupDiseases, setGroupDiseases] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [genericDescriptions, setGenericDescriptions] = useState([]);
  const [drugForms, setDrugForms] = useState([]);
  const [hsnCodes, setHsnCodes] = useState([]);
  const [strengths, setStrengths] = useState([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);

  // State for searchable dropdowns
  const [manufacturerOptions, setManufacturerOptions] = useState([]);
  const [brandOptions, setBrandOptions] = useState([]);
  const [diseaseOptions, setDiseaseOptions] = useState([]);
  const [isLoadingManufacturers, setIsLoadingManufacturers] = useState(false);
  const [isLoadingBrands, setIsLoadingBrands] = useState(false);
  const [isLoadingDiseases, setIsLoadingDiseases] = useState(false);
  const [isLoadingStrengths, setIsLoadingStrengths] = useState(false);
const [isLoadingGenericDescriptions, setIsLoadingGenericDescriptions] = useState(false);
const [selectedStrength, setSelectedStrength] = useState(null);
const [selectedGenericDescription, setSelectedGenericDescription] = useState(null);
const [strengthOptions, setStrengthOptions] = useState([]);
const [genericDescriptionOptions, setGenericDescriptionOptions] = useState([]);

  const yesNoOptions = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ];

  useEffect(() => {
    if (location.state?.id) {
      setIsEditMode(true);
      setDrugId(location.state.id);
      fetchDrug(location.state.id);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [
          drugTypesData,
          manufacturersResponse,
          brandsResponse,
          groupCategoriesData,
          categoriesData,
          subCategoriesData,
          productTypesData,
          groupDiseasesData,
          diseasesResponse,
          genericDescriptionsData,
          drugFormsData,
          gstData,
          strengthsData,
        ] = await Promise.all([
          getDrugTypes(),
          getManufacturers(1, 100),
          getBrands(1, 100),
          getGroupCategories(),
          getCategories(),
          getSubCategories(),
          getProductTypes(),
          getGroupDiseases(),
          getDiseases(1, 100),
          getGenericDescriptions(1,100),
          getDrugs(),
          getGST(),
          getStrengths(1,100),
        ]);

        setDrugTypes(drugTypesData ?? []);
        setManufacturers(manufacturersResponse?.data ?? []);
        setBrands(brandsResponse?.data ?? []);
        setGroupCategories(groupCategoriesData ?? []);
        setCategories(categoriesData ?? []);
        setSubCategories(subCategoriesData ?? []);
        setProductTypes(productTypesData ?? []);
        setGroupDiseases(groupDiseasesData ?? []);
        setDiseases(diseasesResponse?.data ?? []);
        setGenericDescriptions(genericDescriptionsData.data ?? []);
        setDrugForms(drugFormsData ?? []);
        setHsnCodes(gstData ?? []);
        setStrengths(strengthsData.data ?? []);

        // Initialize options for searchable dropdowns
        setManufacturerOptions(
          manufacturersResponse?.data?.map((m) => ({
            value: m.manufacturer_id,
            label: m.manufacturer_name,
          })) ?? []
        );
        setBrandOptions(
          brandsResponse?.data?.map((b) => ({
            value: b.brand_id,
            label: b.brand_name,
          })) ?? []
        );
        setDiseaseOptions(
          diseasesResponse?.data?.map((d) => ({
            value: d.disease_id,
            label: d.disease_name,
          })) ?? []
        );
        setStrengthOptions(
        strengthsData?.data?.map((s) => ({
          value: s.strength_id,
          label: s.strength_name,
        })) ?? []
      );
      setGenericDescriptionOptions(
        genericDescriptionsData?.data?.map((g) => ({
          value: g.generic_description_id,
          label: g.generic_description_name,
        })) ?? []
      );

        setLoadingDropdowns(false);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
        Swal.fire({
          title: "Error!",
          text: error.message || "Failed to fetch dropdown data.",
          icon: "error",
          confirmButtonText: "OK",
        });
        setLoadingDropdowns(false);
      }
    };
    fetchDropdownData();
  }, []);

  const fetchDrug = async (id) => {
  try {
    const data = await getDrugById(id);
    setProductType(data?.type ?? "medical");

    // Map API response to formik values
    const formikValues = {
      prohibition: data?.prohibition ? "yes" : "no",
      hide: data?.hide ? "yes" : "no",
      drugType: data?.drug_type ?? "",
      prescriptionNeeded: data?.prescription_needed ? "yes" : "no",
      restriction: data?.restriction ? "yes" : "no",
      drugName: data?.drug_name ?? "",
      drugNameManufacturer: data?.manufacturer_id ?? "",
      brand: data?.brand ?? "",
      groupCategory: data?.group_category ?? "",
      category: data?.category ?? "",
      subCategory: data?.sub_category ?? "",
      productType: data?.product_type ?? "",
      groupDisease: data?.group_disease ?? "",
      disease: data?.disease ?? "",
      drugComposition: data?.drug_composition ?? "",
      genericDescription: data?.generic_description ?? "",
      strength: data?.strength ?? "",
      drugDescription: data?.drug_description ?? "",
      image: null,
      use: data?.use ?? "",
      form: data?.drug_form ?? "",
      hsn: data?.hsn ?? "",
      maxDiscount: data?.max_discount ?? "",
      returnable: data?.returnable ? "yes" : "no",
    };

    // Set formik values
    formik.setValues(formikValues);

    // Set selected options for react-select
    setSelectedManufacturer({
      value: data?.manufacturer_id,
      label: data?.manufacturer_name,
    });
    setSelectedBrand({
      value: data?.brand,
      label: data?.brand_name,
    });
    setSelectedDisease({
      value: data?.disease,
      label: data?.disease_name,
    });
    setSelectedStrength({
      value: data?.strength,
      label: data?.strength_name,
    });
    setSelectedGenericDescription({
      value: data?.generic_description,
      label: data?.generic_description_name,
    });

    // Update options to ensure selected values are included
    setManufacturerOptions((prev) => {
      const newOption = {
        value: data?.manufacturer_id,
        label: data?.manufacturer_name,
      };
      return _.uniqBy([newOption, ...prev], "value");
    });
    setBrandOptions((prev) => {
      const newOption = { value: data?.brand, label: data?.brand_name };
      return _.uniqBy([newOption, ...prev], "value");
    });
    setDiseaseOptions((prev) => {
      const newOption = { value: data?.disease, label: data?.disease_name };
      return _.uniqBy([newOption, ...prev], "value");
    });
    setStrengthOptions((prev) => {
      const newOption = {
        value: data?.strength,
        label: data?.strength_name,
      };
      return _.uniqBy([newOption, ...prev], "value");
    });
    setGenericDescriptionOptions((prev) => {
      const newOption = {
        value: data?.generic_description,
        label: data?.generic_description_name,
      };
      return _.uniqBy([newOption, ...prev], "value");
    });

    if (data?.image) {
      setImagePreview(`${import.meta.env.VITE_API_BASE_URL}${data.image}`);
      setImageName(data.image.split("/").pop() ?? "");
    }
  } catch (error) {
    console.error("Error fetching drug:", error);
    Swal.fire({
      title: "Error!",
      text: error?.message || "Failed to fetch drug data.",
      icon: "error",
      confirmButtonText: "OK",
    });
  }
};

  const searchManufacturers = useCallback(
    debounce(async (inputValue) => {
      if (inputValue.length < 2 && inputValue !== "") return;
      try {
        setIsLoadingManufacturers(true);
        const response = await getManufacturers(1, 50, inputValue);
        const newOptions =
          response?.data?.map((m) => ({
            value: m.manufacturer_id,
            label: m.manufacturer_name,
          })) ?? [];
        // Only update options if the response is meaningful
        if (newOptions.length > 0 || inputValue === "") {
          setManufacturerOptions(newOptions);
        }
      } catch (error) {
        console.error("Error searching manufacturers:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to search manufacturers.",
          icon: "error",
          confirmButtonText: "OK",
        });
      } finally {
        setIsLoadingManufacturers(false);
      }
    }, 500),
    []
  );

const searchBrands = useCallback(
  debounce(async (inputValue) => {
    if (inputValue.length < 2 && inputValue !== "") return;
    try {
      setIsLoadingBrands(true);
      const response = await getBrands(1, 50, inputValue);
      const newOptions =
        response?.data?.map((b) => ({
          value: b.brand_id,
          label: b.brand_name,
        })) ?? [];
      if (selectedBrand && !newOptions.find((opt) => opt.value === selectedBrand.value)) {
        newOptions.unshift(selectedBrand);
      }
      setBrandOptions(newOptions);
    } catch (error) {
      console.error("Error searching brands:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to search brands.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setIsLoadingBrands(false);
    }
  }, 500),
  [selectedBrand]
);

const searchDiseases = useCallback(
  debounce(async (inputValue) => {
    if (inputValue.length < 2 && inputValue !== "") return;
    try {
      setIsLoadingDiseases(true);
      const response = await getDiseases(1, 50, inputValue);
      const newOptions =
        response?.data?.map((d) => ({
          value: d.disease_id,
          label: d.disease_name,
        })) ?? [];
      if (selectedDisease && !newOptions.find((opt) => opt.value === selectedDisease.value)) {
        newOptions.unshift(selectedDisease);
      }
      setDiseaseOptions(newOptions);
    } catch (error) {
      console.error("Error searching diseases:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to search diseases.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setIsLoadingDiseases(false);
    }
  }, 500),
  [selectedDisease]
);


const searchStrengths = useCallback(
  debounce(async (inputValue) => {
    if (inputValue.length < 2 && inputValue !== "") return;
    try {
      setIsLoadingStrengths(true);
      const response = await getStrengths(1, 50, inputValue);
      const newOptions =
        response?.data?.map((s) => ({
          value: s.strength_id,
          label: s.strength_name,
        })) ?? [];
      if (selectedStrength && !newOptions.find((opt) => opt.value === selectedStrength.value)) {
        newOptions.unshift(selectedStrength);
      }
      setStrengthOptions(newOptions);
    } catch (error) {
      console.error("Error searching strengths:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to search strengths.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setIsLoadingStrengths(false);
    }
  }, 500),
  [selectedStrength]
);

const searchGenericDescriptions = useCallback(
  debounce(async (inputValue) => {
    if (inputValue.length < 2 && inputValue !== "") return;
    try {
      setIsLoadingGenericDescriptions(true);
      const response = await getGenericDescriptions(1, 50, inputValue);
      const newOptions =
        response?.data?.map((g) => ({
          value: g.generic_description_id,
          label: g.generic_description_name,
        })) ?? [];
      if (selectedGenericDescription && !newOptions.find((opt) => opt.value === selectedGenericDescription.value)) {
        newOptions.unshift(selectedGenericDescription);
      }
      setGenericDescriptionOptions(newOptions);
    } catch (error) {
      console.error("Error searching generic descriptions:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to search generic descriptions.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setIsLoadingGenericDescriptions(false);
    }
  }, 500),
  [selectedGenericDescription]
);

  const formik = useFormik({
    initialValues: {
      productType: "medical",
      prohibition: "",
      hide: "",
      drugType: "",
      prescriptionNeeded: "",
      restriction: "",
      drugName: "",
      drugNameManufacturer: "",
      brand: "",
      groupCategory: "",
      category: "",
      subCategory: "",
      productType: "",
      groupDisease: "",
      disease: "",
      drugComposition: "",
      genericDescription: "",
      strength: "",
      drugDescription: "",
      image: null,
      use: "",
      form: "",
      hsn: "",
      maxDiscount: "",
      returnable: "",
    },
    validationSchema: getValidationSchema(productType),
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("type", productType);
        formData.append("drug_name", values.drugName ?? "");
        formData.append("manufacturer_id", values.drugNameManufacturer ?? "");
        formData.append("brand", values.brand ?? "");
        formData.append("category", values.category ?? "");
        formData.append("sub_category", values.subCategory ?? "");
        formData.append("product_type", values.productType ?? "");
        formData.append("drug_description", values.drugDescription ?? "");
        if (values.image) {
          formData.append("image", values.image);
        }

        if (productType === "medical") {
          formData.append(
            "prohibition",
            values.prohibition === "yes" ? true : false
          );
          formData.append("hide", values.hide === "yes" ? true : false);
          formData.append("drug_type", values.drugType ?? "");
          formData.append(
            "prescription_needed",
            values.prescriptionNeeded === "yes" ? true : false
          );
          formData.append(
            "restriction",
            values.restriction === "yes" ? true : false
          );
          formData.append("group_category", values.groupCategory ?? "");
          formData.append("group_disease", values.groupDisease ?? "");
          formData.append("disease", values.disease ?? "");
          formData.append("drug_composition", values.drugComposition ?? "");
          formData.append(
            "generic_description",
            values.genericDescription ?? ""
          );
          formData.append("strength", values.strength ?? "");
          formData.append("use", values.use ?? "");
          formData.append("drug_form", values.form ?? "");
          formData.append("hsn", values.hsn ?? "");
          formData.append("max_discount", values.maxDiscount ?? "");
          formData.append(
            "returnable",
            values.returnable === "yes" ? true : false
          );
        } else {
          formData.append("drug_form", values.form ?? "");
          formData.append("hsn", values.hsn ?? "");
        }

        let response;
        if (isEditMode) {
          response = await updateDrug(drugId, formData);
          Swal.fire({
            title: `${productType === "medical" ? "Drug" : "Product"} Updated!`,
            text: `The ${
              productType === "medical" ? "drug" : "product"
            } has been successfully updated.`,
            icon: "success",
            confirmButtonText: "OK",
          });
        } else {
          response = await postDrug(formData);
          Swal.fire({
            title: `${
              productType === "medical" ? "Drug" : "Product"
            } Registered!`,
            text: `The ${
              productType === "medical" ? "drug" : "product"
            } has been successfully registered.`,
            icon: "success",
            confirmButtonText: "OK",
          });
        }

        if (response) {
          formik.resetForm();
          if (photoRef.current) photoRef.current.value = "";
          setImagePreview(null);
          setImageName("");
          navigate(productType === "medical" ? "/drug-list" : "/drug-list");
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

  const handleImageChange = (event) => {
    const file = event.currentTarget?.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setImageName(file.name);
      formik.setFieldValue("image", file);
    }
  };

  const handleImageRemove = () => {
    setImagePreview(null);
    setImageName("");
    formik.setFieldValue("image", null);
    if (photoRef.current) photoRef.current.value = "";
  };

  const handleHsnChange = (selectedOption) => {
    formik.setFieldValue("hsn", selectedOption?.value ?? "");
  };

  const hsnOptions = hsnCodes.map((item) => ({
    value: item?.gst_id ?? "",
    label: item?.hsn ?? "",
  }));

  const handleProductTypeChange = (type) => {
    setProductType(type);
    formik.resetForm({
      values: {
        ...formik.initialValues,
        productType: type,
      },
    });
    setImagePreview(null);
    setImageName("");
    if (photoRef.current) photoRef.current.value = "";
  };

  document.title =
    productType === "medical"
      ? "Drug Registration"
      : "NonMedical Product Registration";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Products"
            breadcrumbItem={
              isEditMode
                ? `Edit ${
                    productType === "medical" ? "Drug" : "NonMedical Product"
                  }`
                : `Add ${
                    productType === "medical" ? "Drug" : "NonMedical Product"
                  }`
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
                        ? `Edit ${
                            productType === "medical"
                              ? "Drug"
                              : "NonMedical Product"
                          }`
                        : `Add ${
                            productType === "medical"
                              ? "Drug"
                              : "NonMedical Product"
                          }`}
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

                  {/* Product Type Toggle Buttons */}
                  <div className="mb-4">
                    <Button
                      color={
                        productType === "medical" ? "primary" : "secondary"
                      }
                      onClick={() => handleProductTypeChange("medical")}
                      className="me-2"
                    >
                      Medical Product
                    </Button>
                    <Button
                      color={
                        productType === "nonmedical" ? "primary" : "secondary"
                      }
                      onClick={() => handleProductTypeChange("nonmedical")}
                    >
                      NonMedical Product
                    </Button>
                  </div>

                  <Form onSubmit={formik.handleSubmit}>
                    <Row className="g-4">
                      {productType === "medical" ? (
                        <>
                          {/* Medical Product Fields */}
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="prohibition"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Prohibition
                              </Label>
                              <Input
                                type="select"
                                name="prohibition"
                                id="prohibition"
                                value={formik.values.prohibition}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`form-control ${
                                  formik.touched.prohibition &&
                                  formik.errors.prohibition
                                    ? "is-invalid"
                                    : ""
                                }`}
                                style={{
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  padding: "10px",
                                }}
                              >
                                <option value="">Select</option>
                                {yesNoOptions.map((option) => (
                                  <option
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </option>
                                ))}
                              </Input>
                              {formik.touched.prohibition &&
                                formik.errors.prohibition && (
                                  <div className="invalid-feedback">
                                    {formik.errors.prohibition}
                                  </div>
                                )}
                            </FormGroup>
                          </Col>
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="hide"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Hide
                              </Label>
                              <Input
                                type="select"
                                name="hide"
                                id="hide"
                                value={formik.values.hide}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`form-control ${
                                  formik.touched.hide && formik.errors.hide
                                    ? "is-invalid"
                                    : ""
                                }`}
                                style={{
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  padding: "10px",
                                }}
                              >
                                <option value="">Select</option>
                                {yesNoOptions.map((option) => (
                                  <option
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </option>
                                ))}
                              </Input>
                              {formik.touched.hide && formik.errors.hide && (
                                <div className="invalid-feedback">
                                  {formik.errors.hide}
                                </div>
                              )}
                            </FormGroup>
                          </Col>
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="drugType"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Drug Type *
                              </Label>
                              <Input
                                type="select"
                                name="drugType"
                                id="drugType"
                                value={formik.values.drugType}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`form-control ${
                                  formik.touched.drugType &&
                                  formik.errors.drugType
                                    ? "is-invalid"
                                    : ""
                                }`}
                                style={{
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  padding: "10px",
                                }}
                                disabled={loadingDropdowns}
                              >
                                <option value="">
                                  {loadingDropdowns
                                    ? "Loading..."
                                    : drugTypes?.length === 0
                                    ? "No drug types available"
                                    : "Select Drug Type"}
                                </option>
                                {drugTypes?.map((option) => (
                                  <option
                                    key={option?.drug_type_id}
                                    value={option?.drug_type_id}
                                  >
                                    {option?.drug_type_name}
                                  </option>
                                ))}
                              </Input>
                              {formik.touched.drugType &&
                                formik.errors.drugType && (
                                  <div className="invalid-feedback">
                                    {formik.errors.drugType}
                                  </div>
                                )}
                            </FormGroup>
                          </Col>
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="prescriptionNeeded"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Prescription Needed
                              </Label>
                              <Input
                                type="select"
                                name="prescriptionNeeded"
                                id="prescriptionNeeded"
                                value={formik.values.prescriptionNeeded}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`form-control ${
                                  formik.touched.prescriptionNeeded &&
                                  formik.errors.prescriptionNeeded
                                    ? "is-invalid"
                                    : ""
                                }`}
                                style={{
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  padding: "10px",
                                }}
                              >
                                <option value="">Select</option>
                                {yesNoOptions.map((option) => (
                                  <option
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </option>
                                ))}
                              </Input>
                              {formik.touched.prescriptionNeeded &&
                                formik.errors.prescriptionNeeded && (
                                  <div className="invalid-feedback">
                                    {formik.errors.prescriptionNeeded}
                                  </div>
                                )}
                            </FormGroup>
                          </Col>
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="restriction"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Restriction
                              </Label>
                              <Input
                                type="select"
                                name="restriction"
                                id="restriction"
                                value={formik.values.restriction}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`form-control ${
                                  formik.touched.restriction &&
                                  formik.errors.restriction
                                    ? "is-invalid"
                                    : ""
                                }`}
                                style={{
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  padding: "10px",
                                }}
                              >
                                <option value="">Select</option>
                                {yesNoOptions.map((option) => (
                                  <option
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </option>
                                ))}
                              </Input>
                              {formik.touched.restriction &&
                                formik.errors.restriction && (
                                  <div className="invalid-feedback">
                                    {formik.errors.restriction}
                                  </div>
                                )}
                            </FormGroup>
                          </Col>
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="drugName"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Drug Name *
                              </Label>
                              <Input
                                type="text"
                                name="drugName"
                                id="drugName"
                                placeholder="Enter drug name"
                                value={formik.values.drugName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`form-control ${
                                  formik.touched.drugName &&
                                  formik.errors.drugName
                                    ? "is-invalid"
                                    : ""
                                }`}
                                style={{
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  padding: "10px",
                                }}
                              />
                              {formik.touched.drugName &&
                                formik.errors.drugName && (
                                  <div className="invalid-feedback">
                                    {formik.errors.drugName}
                                  </div>
                                )}
                            </FormGroup>
                          </Col>
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="drugNameManufacturer"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Manufacturer *
                              </Label>
                              <Select
                                id="drugNameManufacturer"
                                name="drugNameManufacturer"
                                options={manufacturerOptions}
                                value={selectedManufacturer}
                                onChange={(selectedOption) => {
                                  setSelectedManufacturer(selectedOption);
                                  formik.setFieldValue(
                                    "drugNameManufacturer",
                                    selectedOption?.value ?? ""
                                  );
                                }}
                                onInputChange={(inputValue) => {
                                  searchManufacturers(inputValue);
                                }}
                                placeholder="Search Manufacturer"
                                isClearable
                                isDisabled={loadingDropdowns}
                                isLoading={isLoadingManufacturers}
                                noOptionsMessage={() =>
                                  isLoadingManufacturers
                                    ? "Loading..."
                                    : "No manufacturers found"
                                }
                                styles={{
                                  control: (base) => ({
                                    ...base,
                                    borderRadius: "8px",
                                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                    padding: "2px",
                                    borderColor:
                                      formik.touched.drugNameManufacturer &&
                                      formik.errors.drugNameManufacturer
                                        ? "#dc3545"
                                        : base.borderColor,
                                  }),
                                  menu: (base) => ({ ...base, zIndex: 9999 }),
                                }}
                              />
                              {formik.touched.drugNameManufacturer &&
                                formik.errors.drugNameManufacturer && (
                                  <div
                                    className="invalid-feedback"
                                    style={{ display: "block" }}
                                  >
                                    {formik.errors.drugNameManufacturer}
                                  </div>
                                )}
                            </FormGroup>
                          </Col>
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="brand"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Brand *
                              </Label>
                              <Select
                                id="brand"
                                name="brand"
                                options={brandOptions}
                                value={selectedBrand}
                                onChange={(selectedOption) => {
                                  setSelectedBrand(selectedOption);
                                  formik.setFieldValue(
                                    "brand",
                                    selectedOption?.value ?? ""
                                  );
                                }}
                                onInputChange={(inputValue) => {
                                  searchBrands(inputValue);
                                }}
                                onBlur={() =>
                                  formik.setFieldTouched("brand", true)
                                }
                                placeholder="Search Brand"
                                isClearable
                                isDisabled={loadingDropdowns}
                                isLoading={isLoadingBrands}
                                noOptionsMessage={() =>
                                  isLoadingBrands
                                    ? "Loading..."
                                    : "No brands found"
                                }
                                styles={{
                                  control: (base) => ({
                                    ...base,
                                    borderRadius: "8px",
                                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                    padding: "2px",
                                    borderColor:
                                      formik.touched.brand &&
                                      formik.errors.brand
                                        ? "#dc3545"
                                        : base.borderColor,
                                  }),
                                  menu: (base) => ({ ...base, zIndex: 9999 }),
                                }}
                              />
                              {formik.touched.brand && formik.errors.brand && (
                                <div
                                  className="invalid-feedback"
                                  style={{ display: "block" }}
                                >
                                  {formik.errors.brand}
                                </div>
                              )}
                            </FormGroup>
                          </Col>
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="groupCategory"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Group Category
                              </Label>
                              <Input
                                type="select"
                                name="groupCategory"
                                id="groupCategory"
                                value={formik.values.groupCategory}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`form-control ${
                                  formik.touched.groupCategory &&
                                  formik.errors.groupCategory
                                    ? "is-invalid"
                                    : ""
                                }`}
                                style={{
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  padding: "10px",
                                }}
                                disabled={loadingDropdowns}
                              >
                                <option value="">
                                  {loadingDropdowns
                                    ? "Loading..."
                                    : groupCategories?.length === 0
                                    ? "No groupCategories available"
                                    : "Select Group Category"}
                                </option>
                                {groupCategories?.map((option) => (
                                  <option
                                    key={option?.group_category_id}
                                    value={option?.group_category_id}
                                  >
                                    {option?.group_category_name}
                                  </option>
                                ))}
                              </Input>
                              {formik.touched.groupCategory &&
                                formik.errors.groupCategory && (
                                  <div className="invalid-feedback">
                                    {formik.errors.groupCategory}
                                  </div>
                                )}
                            </FormGroup>
                          </Col>
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="category"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Category *
                              </Label>
                              <Input
                                type="select"
                                name="category"
                                id="category"
                                value={formik.values.category}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`form-control ${
                                  formik.touched.category &&
                                  formik.errors.category
                                    ? "is-invalid"
                                    : ""
                                }`}
                                style={{
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  padding: "10px",
                                }}
                                disabled={loadingDropdowns}
                              >
                                <option value="">
                                  {loadingDropdowns
                                    ? "Loading..."
                                    : categories?.length === 0
                                    ? "No categories available"
                                    : "Select Category"}
                                </option>
                                {categories?.map((option) => (
                                  <option
                                    key={option?.category_id}
                                    value={option?.category_id}
                                  >
                                    {option?.category_name}
                                  </option>
                                ))}
                              </Input>
                              {formik.touched.category &&
                                formik.errors.category && (
                                  <div className="invalid-feedback">
                                    {formik.errors.category}
                                  </div>
                                )}
                            </FormGroup>
                          </Col>
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="subCategory"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Sub Category *
                              </Label>
                              <Input
                                type="select"
                                name="subCategory"
                                id="subCategory"
                                value={formik.values.subCategory}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`form-control ${
                                  formik.touched.subCategory &&
                                  formik.errors.subCategory
                                    ? "is-invalid"
                                    : ""
                                }`}
                                style={{
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  padding: "10px",
                                }}
                                disabled={loadingDropdowns}
                              >
                                <option value="">
                                  {loadingDropdowns
                                    ? "Loading..."
                                    : subCategories?.length === 0
                                    ? "No data available"
                                    : "Select Sub Category"}
                                </option>
                                {subCategories?.map((option) => (
                                  <option
                                    key={option?.sub_category_id}
                                    value={option?.sub_category_id}
                                  >
                                    {option?.sub_category_name}
                                  </option>
                                ))}
                              </Input>
                              {formik.touched.subCategory &&
                                formik.errors.subCategory && (
                                  <div className="invalid-feedback">
                                    {formik.errors.subCategory}
                                  </div>
                                )}
                            </FormGroup>
                          </Col>
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="productType"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Product Type *
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
                                disabled={loadingDropdowns}
                              >
                                <option value="">
                                  {loadingDropdowns
                                    ? "Loading..."
                                    : productTypes?.length === 0
                                    ? "No data available"
                                    : "Select Product Type"}
                                </option>
                                {productTypes?.map((option) => (
                                  <option
                                    key={option?.product_type_id}
                                    value={option?.product_type_id}
                                  >
                                    {option?.product_type_name}
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
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="groupDisease"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Group Disease
                              </Label>
                              <Input
                                type="select"
                                name="groupDisease"
                                id="groupDisease"
                                value={formik.values.groupDisease}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`form-control ${
                                  formik.touched.groupDisease &&
                                  formik.errors.groupDisease
                                    ? "is-invalid"
                                    : ""
                                }`}
                                style={{
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  padding: "10px",
                                }}
                                disabled={loadingDropdowns}
                              >
                                <option value="">
                                  {loadingDropdowns
                                    ? "Loading..."
                                    : groupDiseases?.length === 0
                                    ? "No groupDiseases available"
                                    : "Select Group Disease"}
                                </option>
                                {groupDiseases?.map((option) => (
                                  <option
                                    key={option?.group_disease_id}
                                    value={option?.group_disease_id}
                                  >
                                    {option?.group_disease_name}
                                  </option>
                                ))}
                              </Input>
                              {formik.touched.groupDisease &&
                                formik.errors.groupDisease && (
                                  <div className="invalid-feedback">
                                    {formik.errors.groupDisease}
                                  </div>
                                )}
                            </FormGroup>
                          </Col>
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="disease"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Disease
                              </Label>
                              <Select
                                id="disease"
                                name="disease"
                                options={diseaseOptions}
                                value={selectedDisease}
                                onChange={(selectedOption) => {
                                  setSelectedDisease(selectedOption);
                                  formik.setFieldValue(
                                    "disease",
                                    selectedOption?.value ?? ""
                                  );
                                }}
                                onInputChange={(inputValue) => {
                                  searchDiseases(inputValue);
                                }}
                                onBlur={() =>
                                  formik.setFieldTouched("disease", true)
                                }
                                placeholder="Search Disease"
                                isClearable
                                isDisabled={loadingDropdowns}
                                isLoading={isLoadingDiseases}
                                noOptionsMessage={() =>
                                  isLoadingDiseases
                                    ? "Loading..."
                                    : "No diseases found"
                                }
                                styles={{
                                  control: (base) => ({
                                    ...base,
                                    borderRadius: "8px",
                                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                    padding: "2px",
                                    borderColor:
                                      formik.touched.disease &&
                                      formik.errors.disease
                                        ? "#dc3545"
                                        : base.borderColor,
                                  }),
                                  menu: (base) => ({ ...base, zIndex: 9999 }),
                                }}
                              />
                              {formik.touched.disease &&
                                formik.errors.disease && (
                                  <div
                                    className="invalid-feedback"
                                    style={{ display: "block" }}
                                  >
                                    {formik.errors.disease}
                                  </div>
                                )}
                            </FormGroup>
                          </Col>
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="drugComposition"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Drug Composition
                              </Label>
                              <Input
                                type="text"
                                name="drugComposition"
                                id="drugComposition"
                                placeholder="Enter drug composition"
                                value={formik.values.drugComposition}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`form-control ${
                                  formik.touched.drugComposition &&
                                  formik.errors.drugComposition
                                    ? "is-invalid"
                                    : ""
                                }`}
                                style={{
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  padding: "10px",
                                }}
                              />
                              {formik.touched.drugComposition &&
                                formik.errors.drugComposition && (
                                  <div className="invalid-feedback">
                                    {formik.errors.drugComposition}
                                  </div>
                                )}
                            </FormGroup>
                          </Col>
                         <Col md="6">
  <FormGroup>
    <Label for="genericDescription" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
      Generic Description
    </Label>
    <Select
      id="genericDescription"
      name="genericDescription"
      options={genericDescriptionOptions}
      value={selectedGenericDescription}
      onChange={(selectedOption) => {
        setSelectedGenericDescription(selectedOption);
        formik.setFieldValue("genericDescription", selectedOption?.value ?? "");
      }}
      onInputChange={(inputValue) => {
        searchGenericDescriptions(inputValue);
      }}
      onBlur={() => formik.setFieldTouched("genericDescription", true)}
      placeholder="Search Generic Description"
      isClearable
      isDisabled={loadingDropdowns}
      isLoading={isLoadingGenericDescriptions}
      noOptionsMessage={() =>
        isLoadingGenericDescriptions ? "Loading..." : "No generic descriptions found"
      }
      styles={{
        control: (base) => ({
          ...base,
          borderRadius: "8px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          padding: "2px",
          borderColor:
            formik.touched.genericDescription && formik.errors.genericDescription
              ? "#dc3545"
              : base.borderColor,
        }),
        menu: (base) => ({ ...base, zIndex: 9999 }),
      }}
    />
    {formik.touched.genericDescription && formik.errors.genericDescription && (
      <div className="invalid-feedback" style={{ display: "block" }}>
        {formik.errors.genericDescription}
      </div>
    )}
  </FormGroup>
</Col>
                         <Col md="6">
  <FormGroup>
    <Label for="strength" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
      Strength
    </Label>
    <Select
      id="strength"
      name="strength"
      options={strengthOptions}
      value={selectedStrength}
      onChange={(selectedOption) => {
        setSelectedStrength(selectedOption);
        formik.setFieldValue("strength", selectedOption?.value ?? "");
      }}
      onInputChange={(inputValue) => {
        searchStrengths(inputValue);
      }}
      onBlur={() => formik.setFieldTouched("strength", true)}
      placeholder="Search Strength"
      isClearable
      isDisabled={loadingDropdowns}
      isLoading={isLoadingStrengths}
      noOptionsMessage={() =>
        isLoadingStrengths ? "Loading..." : "No strengths found"
      }
      styles={{
        control: (base) => ({
          ...base,
          borderRadius: "8px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          padding: "2px",
          borderColor:
            formik.touched.strength && formik.errors.strength
              ? "#dc3545"
              : base.borderColor,
        }),
        menu: (base) => ({ ...base, zIndex: 9999 }),
      }}
    />
    {formik.touched.strength && formik.errors.strength && (
      <div className="invalid-feedback" style={{ display: "block" }}>
        {formik.errors.strength}
      </div>
    )}
  </FormGroup>
</Col>
                          <Col md="12">
                            <FormGroup>
                              <Label
                                for="drugDescription"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Drug Description
                              </Label>
                              <Input
                                type="textarea"
                                name="drugDescription"
                                id="drugDescription"
                                placeholder="Enter drug description"
                                rows="4"
                                value={formik.values.drugDescription}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`form-control ${
                                  formik.touched.drugDescription &&
                                  formik.errors.drugDescription
                                    ? "is-invalid"
                                    : ""
                                }`}
                                style={{
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  padding: "10px",
                                }}
                              />
                              {formik.touched.drugDescription &&
                                formik.errors.drugDescription && (
                                  <div className="invalid-feedback">
                                    {formik.errors.drugDescription}
                                  </div>
                                )}
                            </FormGroup>
                          </Col>
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="image"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Image (Optional)
                              </Label>
                              <Input
                                type="file"
                                name="image"
                                id="image"
                                accept="image/*"
                                ref={photoRef}
                                onChange={handleImageChange}
                                onBlur={formik.handleBlur}
                                className={`form-control ${
                                  formik.touched.image && formik.errors.image
                                    ? "is-invalid"
                                    : ""
                                }`}
                                style={{
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  padding: "8px",
                                }}
                              />
                              {formik.touched.image && formik.errors.image && (
                                <div className="invalid-feedback">
                                  {formik.errors.image}
                                </div>
                              )}
                            </FormGroup>
                            {imagePreview && (
                              <div
                                style={{
                                  position: "relative",
                                  display: "inline-block",
                                }}
                              >
                                <img
                                  src={imagePreview}
                                  alt="Drug Photo"
                                  style={{
                                    width: "100px",
                                    height: "100px",
                                    objectFit: "cover",
                                    marginTop: "10px",
                                  }}
                                />
                                <Button
                                  style={{
                                    position: "absolute",
                                    top: "10px",
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
                          </Col>
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="use"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Use
                              </Label>
                              <Input
                                type="text"
                                name="use"
                                id="use"
                                placeholder="Enter use"
                                value={formik.values.use}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`form-control ${
                                  formik.touched.use && formik.errors.use
                                    ? "is-invalid"
                                    : ""
                                }`}
                                style={{
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  padding: "10px",
                                }}
                              />
                              {formik.touched.use && formik.errors.use && (
                                <div className="invalid-feedback">
                                  {formik.errors.use}
                                </div>
                              )}
                            </FormGroup>
                          </Col>
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="form"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Drug Form *
                              </Label>
                              <Input
                                type="select"
                                name="form"
                                id="form"
                                value={formik.values.form}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`form-control ${
                                  formik.touched.form && formik.errors.form
                                    ? "is-invalid"
                                    : ""
                                }`}
                                style={{
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  padding: "10px",
                                }}
                                disabled={loadingDropdowns}
                              >
                                <option value="">
                                  {loadingDropdowns
                                    ? "Loading..."
                                    : drugForms?.length === 0
                                    ? "No drug forms available"
                                    : "Select Drug Form"}
                                </option>
                                {drugForms?.map((option) => (
                                  <option
                                    key={option?.drug_form_id}
                                    value={option?.drug_form_id}
                                  >
                                    {option?.drug_form_name}
                                  </option>
                                ))}
                              </Input>
                              {formik.touched.form && formik.errors.form && (
                                <div className="invalid-feedback">
                                  {formik.errors.form}
                                </div>
                              )}
                            </FormGroup>
                          </Col>
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="hsn"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                HSN *
                              </Label>
                              <Select
                                id="hsn"
                                name="hsn"
                                options={hsnOptions}
                                value={
                                  hsnOptions.find(
                                    (option) =>
                                      option.value === formik.values.hsn
                                  ) || null
                                }
                                onChange={handleHsnChange}
                                onBlur={() =>
                                  formik.setFieldTouched("hsn", true)
                                }
                                placeholder={
                                  loadingDropdowns
                                    ? "Loading..."
                                    : "Search HSN Code"
                                }
                                isClearable
                                isDisabled={loadingDropdowns}
                                styles={{
                                  control: (base) => ({
                                    ...base,
                                    borderRadius: "8px",
                                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                    padding: "2px",
                                    borderColor:
                                      formik.touched.hsn && formik.errors.hsn
                                        ? "#dc3545"
                                        : base.borderColor,
                                  }),
                                  menu: (base) => ({ ...base, zIndex: 9999 }),
                                }}
                              />
                              {formik.touched.hsn && formik.errors.hsn && (
                                <div
                                  className="invalid-feedback"
                                  style={{ display: "block" }}
                                >
                                  {formik.errors.hsn}
                                </div>
                              )}
                            </FormGroup>
                          </Col>
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="maxDiscount"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Max Discount
                              </Label>
                              <Input
                                type="number"
                                name="maxDiscount"
                                id="maxDiscount"
                                placeholder="Enter max discount %"
                                value={formik.values.maxDiscount}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`form-control ${
                                  formik.touched.maxDiscount &&
                                  formik.errors.maxDiscount
                                    ? "is-invalid"
                                    : ""
                                }`}
                                style={{
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  padding: "10px",
                                }}
                              />
                              {formik.touched.maxDiscount &&
                                formik.errors.maxDiscount && (
                                  <div className="invalid-feedback">
                                    {formik.errors.maxDiscount}
                                  </div>
                                )}
                            </FormGroup>
                          </Col>
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="returnable"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Returnable *
                              </Label> 
                              <Input
                                type="select"
                                name="returnable"
                                id="returnable"
                                value={formik.values.returnable}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`form-control ${
                                  formik.touched.returnable &&
                                  formik.errors.returnable
                                    ? "is-invalid"
                                    : ""
                                }`}
                                style={{
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  padding: "10px",
                                }}
                              >
                                <option value="">Select</option>
                                {yesNoOptions.map((option) => (
                                  <option
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </option>
                                ))}
                              </Input>
                              {formik.touched.returnable &&
                                formik.errors.returnable && (
                                  <div className="invalid-feedback">
                                    {formik.errors.returnable}
                                  </div>
                                )}
                            </FormGroup>
                          </Col>
                        </>
                      ) : (
                        <>
                          {/* NonMedical Product Fields */}
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="drugNameManufacturer"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Manufacturer *
                              </Label>
                              <Select
                                id="drugNameManufacturer"
                                name="drugNameManufacturer"
                                options={manufacturerOptions}
                                value={selectedManufacturer}
                                onChange={(selectedOption) => {
                                  setSelectedManufacturer(selectedOption);
                                  formik.setFieldValue(
                                    "drugNameManufacturer",
                                    selectedOption?.value ?? ""
                                  );
                                }}
                                onInputChange={(inputValue) => {
                                  searchManufacturers(inputValue);
                                }}
                                placeholder="Search Manufacturer"
                                isClearable
                                isDisabled={loadingDropdowns}
                                isLoading={isLoadingManufacturers}
                                noOptionsMessage={() =>
                                  isLoadingManufacturers
                                    ? "Loading..."
                                    : "No manufacturers found"
                                }
                                styles={{
                                  control: (base) => ({
                                    ...base,
                                    borderRadius: "8px",
                                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                    padding: "2px",
                                    borderColor:
                                      formik.touched.drugNameManufacturer &&
                                      formik.errors.drugNameManufacturer
                                        ? "#dc3545"
                                        : base.borderColor,
                                  }),
                                  menu: (base) => ({ ...base, zIndex: 9999 }),
                                }}
                              />
                              {formik.touched.drugNameManufacturer &&
                                formik.errors.drugNameManufacturer && (
                                  <div
                                    className="invalid-feedback"
                                    style={{ display: "block" }}
                                  >
                                    {formik.errors.drugNameManufacturer}
                                  </div>
                                )}
                            </FormGroup>
                          </Col>
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="drugName"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Product Name *
                              </Label>
                              <Input
                                type="text"
                                name="drugName"
                                id="drugName"
                                placeholder="Enter product name"
                                value={formik.values.drugName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`form-control ${
                                  formik.touched.drugName &&
                                  formik.errors.drugName
                                    ? "is-invalid"
                                    : ""
                                }`}
                                style={{
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  padding: "10px",
                                }}
                              />
                              {formik.touched.drugName &&
                                formik.errors.drugName && (
                                  <div className="invalid-feedback">
                                    {formik.errors.drugName}
                                  </div>
                                )}
                            </FormGroup>
                          </Col>

                         <Col md="6">
                            <FormGroup>
                              <Label
                                for="category"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Category *
                              </Label>
                              <Input
                                type="select"
                                name="category"
                                id="category"
                                value={formik.values.category}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`form-control ${
                                  formik.touched.category &&
                                  formik.errors.category
                                    ? "is-invalid"
                                    : ""
                                }`}
                                style={{
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  padding: "10px",
                                }}
                                disabled={loadingDropdowns}
                              >
                                <option value="">
                                  {loadingDropdowns
                                    ? "Loading..."
                                    : categories?.length === 0
                                    ? "No categories available"
                                    : "Select Category"}
                                </option>
                                {categories?.map((option) => (
                                  <option
                                    key={option?.category_id}
                                    value={option?.category_id}
                                  >
                                    {option?.category_name}
                                  </option>
                                ))}
                              </Input>
                              {formik.touched.category &&
                                formik.errors.category && (
                                  <div className="invalid-feedback">
                                    {formik.errors.category}
                                  </div>
                                )}
                            </FormGroup>
                          </Col>

                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="subCategory"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Sub Category *
                              </Label>
                              <Input
                                type="select"
                                name="subCategory"
                                id="subCategory"
                                value={formik.values.subCategory}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`form-control ${
                                  formik.touched.subCategory &&
                                  formik.errors.subCategory
                                    ? "is-invalid"
                                    : ""
                                }`}
                                style={{
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  padding: "10px",
                                }}
                                disabled={loadingDropdowns}
                              >
                                <option value="">
                                  {loadingDropdowns
                                    ? "Loading..."
                                    : subCategories?.length === 0
                                    ? "No data available"
                                    : "Select Sub Category"}
                                </option>
                                {subCategories?.map((option) => (
                                  <option
                                    key={option?.sub_category_id}
                                    value={option?.sub_category_id}
                                  >
                                    {option?.sub_category_name}
                                  </option>
                                ))}
                              </Input>
                              {formik.touched.subCategory &&
                                formik.errors.subCategory && (
                                  <div className="invalid-feedback">
                                    {formik.errors.subCategory}
                                  </div>
                                )}
                            </FormGroup>
                          </Col>
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="brand"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Brand *
                              </Label>
                              <Select
                                id="brand"
                                name="brand"
                                options={brandOptions}
                                value={selectedBrand}
                                onChange={(selectedOption) => {
                                  setSelectedBrand(selectedOption);
                                  formik.setFieldValue(
                                    "brand",
                                    selectedOption?.value ?? ""
                                  );
                                }}
                                onInputChange={(inputValue) => {
                                  searchBrands(inputValue);
                                }}
                                onBlur={() =>
                                  formik.setFieldTouched("brand", true)
                                }
                                placeholder="Search Brand"
                                isClearable
                                isDisabled={loadingDropdowns}
                                isLoading={isLoadingBrands}
                                noOptionsMessage={() =>
                                  isLoadingBrands
                                    ? "Loading..."
                                    : "No brands found"
                                }
                                styles={{
                                  control: (base) => ({
                                    ...base,
                                    borderRadius: "8px",
                                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                    padding: "2px",
                                    borderColor:
                                      formik.touched.brand &&
                                      formik.errors.brand
                                        ? "#dc3545"
                                        : base.borderColor,
                                  }),
                                  menu: (base) => ({ ...base, zIndex: 9999 }),
                                }}
                              />
                              {formik.touched.brand && formik.errors.brand && (
                                <div
                                  className="invalid-feedback"
                                  style={{ display: "block" }}
                                >
                                  {formik.errors.brand}
                                </div>
                              )}
                            </FormGroup>
                          </Col>
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="productType"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Product Type *
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
                                disabled={loadingDropdowns}
                              >
                                <option value="">
                                  {loadingDropdowns
                                    ? "Loading..."
                                    : productTypes?.length === 0
                                    ? "No data available"
                                    : "Select Product Type"}
                                </option>
                                {productTypes?.map((option) => (
                                  <option
                                    key={option?.product_type_id}
                                    value={option?.product_type_id}
                                  >
                                    {option?.product_type_name}
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
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="form"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Drug Form *
                              </Label>
                              <Input
                                type="select"
                                name="form"
                                id="form"
                                value={formik.values.form}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`form-control ${
                                  formik.touched.form && formik.errors.form
                                    ? "is-invalid"
                                    : ""
                                }`}
                                style={{
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  padding: "10px",
                                }}
                                disabled={loadingDropdowns}
                              >
                                <option value="">
                                  {loadingDropdowns
                                    ? "Loading..."
                                    : drugForms?.length === 0
                                    ? "No drug forms available"
                                    : "Select Drug Form"}
                                </option>
                                {drugForms?.map((option) => (
                                  <option
                                    key={option?.drug_form_id}
                                    value={option?.drug_form_id}
                                  >
                                    {option?.drug_form_name}
                                  </option>
                                ))}
                              </Input>
                              {formik.touched.form && formik.errors.form && (
                                <div className="invalid-feedback">
                                  {formik.errors.form}
                                </div>
                              )}
                            </FormGroup>
                          </Col>
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="hsn"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                HSN *
                              </Label>
                              <Select
                                id="hsn"
                                name="hsn"
                                options={hsnOptions}
                                value={
                                  hsnOptions.find(
                                    (option) =>
                                      option.value === formik.values.hsn
                                  ) || null
                                }
                                onChange={handleHsnChange}
                                onBlur={() =>
                                  formik.setFieldTouched("hsn", true)
                                }
                                placeholder={
                                  loadingDropdowns
                                    ? "Loading..."
                                    : "Search HSN Code"
                                }
                                isClearable
                                isDisabled={loadingDropdowns}
                                styles={{
                                  control: (base) => ({
                                    ...base,
                                    borderRadius: "8px",
                                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                    padding: "2px",
                                    borderColor:
                                      formik.touched.hsn && formik.errors.hsn
                                        ? "#dc3545"
                                        : base.borderColor,
                                  }),
                                  menu: (base) => ({ ...base, zIndex: 9999 }),
                                }}
                              />
                              {formik.touched.hsn && formik.errors.hsn && (
                                <div
                                  className="invalid-feedback"
                                  style={{ display: "block" }}
                                >
                                  {formik.errors.hsn}
                                </div>
                              )}
                            </FormGroup>
                          </Col>
                          <Col md="12">
                            <FormGroup>
                              <Label
                                for="drugDescription"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Description
                              </Label>
                              <Input
                                type="textarea"
                                name="drugDescription"
                                id="drugDescription"
                                placeholder="Enter product description"
                                rows="4"
                                value={formik.values.drugDescription}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`form-control ${
                                  formik.touched.drugDescription &&
                                  formik.errors.drugDescription
                                    ? "is-invalid"
                                    : ""
                                }`}
                                style={{
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  padding: "10px",
                                }}
                              />
                              {formik.touched.drugDescription &&
                                formik.errors.drugDescription && (
                                  <div className="invalid-feedback">
                                    {formik.errors.drugDescription}
                                  </div>
                                )}
                            </FormGroup>
                          </Col>
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="image"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Product Image (Optional)
                              </Label>
                              <Input
                                type="file"
                                name="image"
                                id="image"
                                accept="image/*"
                                ref={photoRef}
                                onChange={handleImageChange}
                                onBlur={formik.handleBlur}
                                className={`form-control ${
                                  formik.touched.image && formik.errors.image
                                    ? "is-invalid"
                                    : ""
                                }`}
                                style={{
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  padding: "8px",
                                }}
                              />
                              {formik.touched.image && formik.errors.image && (
                                <div className="invalid-feedback">
                                  {formik.errors.image}
                                </div>
                              )}
                            </FormGroup>
                            {imagePreview && (
                              <div
                                style={{
                                  position: "relative",
                                  display: "inline-block",
                                }}
                              >
                                <img
                                  src={imagePreview}
                                  alt="Product Photo"
                                  style={{
                                    width: "100px",
                                    height: "100px",
                                    objectFit: "cover",
                                    marginTop: "10px",
                                  }}
                                />
                                <Button
                                  style={{
                                    position: "absolute",
                                    top: "10px",
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
                          </Col>
                        </>
                      )}

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

export default AddDrugForm;
