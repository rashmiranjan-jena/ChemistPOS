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
  Table,
} from "reactstrap";

import * as yup from "yup";
import { useFormik } from "formik";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import {
  fetchCategories,
  fetchCategoryDetails,
} from "../../../ApiService/ProductInventory/ProductInventory";
import axios from "axios";
import Swal from "sweetalert2";

const ProductInventory = () => {
  document.title = "ProductInventory";
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productDetails, setProductDetails] = useState({});
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImagePreviews([...imagePreviews, ...newPreviews]);
    formik.setFieldValue("productImages", [
      ...(formik.values.productImages || []),
      ...files,
    ]);
  };

  const removeImage = (index) => {
    const updatedImages = [...formik.values.productImages];
    updatedImages.splice(index, 1);
    formik.setFieldValue("productImages", updatedImages);

    const updatedPreviews = [...imagePreviews];
    URL.revokeObjectURL(updatedPreviews[index].preview); 
    updatedPreviews.splice(index, 1);
    setImagePreviews(updatedPreviews);
  };

  console.log("subcategories--->", subcategories);
  console.log("brands--->", brands);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const getCategories = async () => {
      setLoading(true);
      const data = await fetchCategories();
      setCategories(data || []);
      setLoading(false);
    };
    getCategories();
  }, []);

  const handleCategoryChange = async (categoryId) => {
    if (!categoryId) return;

    setLoading(true);

    const categoryData = await fetchCategoryDetails(categoryId);
    console.log("Category Data:", categoryData);
    console.log("setSubcategories---->", categoryData.subcategories);
    if (categoryData) {
      setSubcategories(categoryData.subcategories || []);
      setBrands(categoryData.brands || []);
      setVariants(categoryData.variants || []);
    }

    setLoading(false);
  };

  const handleFormSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("product_name", values.productName);
      formData.append("product_type", values.productType);
      formData.append("category_name_id", values.category);
      formData.append("subcategory_name_id", values.subcategory);
      formData.append("brand_name_id", JSON.stringify(values.brands));

      const formattedVariants = Object.keys(values.variants).map((brandId) => {
        console.log("values.variants--->", values.variants[brandId]);

        return {
          varient_details: Object.entries(values.variants[brandId]).map(
            ([variantName, variantData]) => {
              const variant = variants.find(
                (v) => v.varientname === variantName
              );
              console.log("variant--->", variant);
              return {
                variant_name: variant?.varientid || null,
                codes: variantData,
              };
            }
          ),
        };
      });

      formData.append("variant_details", JSON.stringify(formattedVariants));
      formData.append("description", values.description);

      if (values.productImages && values.productImages.length > 0) {
        Array.from(values.productImages).forEach((image) => {
          if (image instanceof File) {
            formData.append("product_images", image);
          }
        });
      }

      const colorImages = {};
      if (values.variants) {
        Object.keys(values.variants).forEach((brandId) => {
          if (values.variants[brandId]["Colour"]) {
            values.variants[brandId]["Colour"].forEach((colorCode) => {
              if (!colorImages[brandId]) {
                colorImages[brandId] = {};
              }

              if (!colorImages[brandId][colorCode]) {
                colorImages[brandId][colorCode] = [];
              }

              if (
                values.colorImages &&
                values.colorImages[brandId] &&
                values.colorImages[brandId][colorCode]
              ) {
                colorImages[brandId][colorCode] =
                  values.colorImages[brandId][colorCode];
              }
            });
          }
        });
      }
      Object.keys(colorImages).forEach((brandId) => {
        Object.keys(colorImages[brandId]).forEach((colorCode) => {
          colorImages[brandId][colorCode].forEach((image, index) => {
            if (image instanceof File) {
              formData.append(`color_images[${brandId}][${colorCode}]`, image);
            }
          });
        });
      });

      const response = await axios.post(
        `${BASE_URL}/api/products-handler/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Response from API:", response.data);
      Swal.fire({
        title: "Success!",
        text: "Added Successfully",
        icon: "success",
        confirmButtonText: "OK",
      });
      formik.resetForm();
      window.location.href = "/productinventorylist";
    } catch (error) {
      console.error("Error submitting form:", error);
      Swal.fire({
        title: "Error!",
        text: "Something went wrong",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const formik = useFormik({
    initialValues: {
      productName: "",
      category: "",
      subcategory: "",
      brands: [],
      variants: {},
      description: "",
      productImages: [],
    },
    validationSchema: yup.object().shape({
      productName: yup.string().required("Product Name is required"),
      category: yup.string().required("Category is required"),
      subcategory: yup.string().required("Subcategory is required"),
      brands: yup.array().min(1, "At least one brand is required"),
    }),
    onSubmit: (values) => handleFormSubmit(values),
  });

  const handleVariantChange = (brandId, variantName, code) => {
    const newVariants = { ...formik.values.variants };

    if (!newVariants[brandId]) {
      newVariants[brandId] = {};
    }

    if (newVariants[brandId][variantName]) {
      if (newVariants[brandId][variantName].includes(code)) {
        newVariants[brandId][variantName] = newVariants[brandId][
          variantName
        ].filter((item) => item !== code);
      } else {
        newVariants[brandId][variantName].push(code);
      }
    } else {
      newVariants[brandId][variantName] = [code];
    }

    formik.setFieldValue("variants", newVariants);
  };

  const handleBrandChange = async (brandId) => {
    const selectedBrands = [...formik.values.brands];

    if (selectedBrands.includes(brandId)) {
      const index = selectedBrands.indexOf(brandId);
      selectedBrands.splice(index, 1);
    } else {
      selectedBrands.push(brandId);
    }

    formik.setFieldValue("brands", selectedBrands);

    const updatedProductDetails = { ...productDetails };

    selectedBrands.forEach((brandId) => {
      if (!updatedProductDetails[brandId]) {
        updatedProductDetails[brandId] = [];
      }

      updatedProductDetails[brandId].push({
        productName: formik.values.productName,
        category: formik.values.category,
        subcategory: formik.values.subcategory,
        variants: formik.values.variants,
      });
    });

    setProductDetails(updatedProductDetails);
  };

  const renderVariantDetails = (brandId, variantName) => {
    const variant = variants.find((v) => v.varientname === variantName);
    const selectedVariants =
      formik.values.variants[brandId]?.[variantName] || [];

    return variant && variant.varient_data
      ? variant.varient_data.map((detail) => (
          <div key={detail.code} className="form-check">
            <Input
              type="checkbox"
              className="form-check-input"
              id={`${variantName}-${brandId}-${detail.code}`}
              checked={selectedVariants.includes(detail.code)}
              onChange={() =>
                handleVariantChange(brandId, variantName, detail.code)
              }
            />
            <Label
              className="form-check-label"
              htmlFor={`${variantName}-${brandId}-${detail.code}`}
            >
              {detail.name}
            </Label>
            {variantName === "Colour" &&
              selectedVariants.includes(detail.code) && (
                <div className="mt-3">
                  <Label
                    htmlFor={`image-upload-${variantName}-${brandId}-${detail.code}`}
                  >
                    Upload Image(s) for {detail.name}
                  </Label>
                  <Input
                    type="file"
                    id={`image-upload-${variantName}-${brandId}-${detail.code}`}
                    onChange={(e) =>
                      handleImageUpload(e, brandId, variantName, detail.code)
                    }
                    accept="image/*"
                    multiple
                  />
                  {formik.values.variants[brandId]?.[variantName]?.[
                    detail.code
                  ]?.images?.map((image, index) => (
                    <div key={index} className="mt-2">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index}`}
                        className="img-fluid"
                        style={{ maxWidth: "100px", maxHeight: "100px" }}
                      />
                    </div>
                  ))}
                </div>
              )}
          </div>
        ))
      : "N/A";
  };

  const handleImageUpload = (e, brandId, variantName, colorCode) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newColorImages = { ...formik.values.colorImages };

      if (!newColorImages[brandId]) {
        newColorImages[brandId] = {};
      }

      if (!newColorImages[brandId][colorCode]) {
        newColorImages[brandId][colorCode] = [];
      }

      Array.from(files).forEach((file) => {
        newColorImages[brandId][colorCode].push(file);
      });

      formik.setFieldValue("colorImages", newColorImages);
    }
  };

  const renderTable = (brandId, subcategoriesId, categoryId) => {
    console.log("categoryId passed to renderTable:", categoryId);
    console.log("categories array:", categories);
  
    const brandName = brands.find((brand) => brand.id === brandId)?.name;
    const subcategory = subcategories.find(
      (subcategory) => subcategory.id == subcategoriesId
    )?.name;
  
    // Convert categoryId to number and find matching category
    const parsedCategoryId = categoryId ? Number(categoryId) : null;
    const categoryName = parsedCategoryId
      ? categories.find((cat) => cat.category_name_id === parsedCategoryId)
          ?.category_name || "N/A"
      : "No category selected";
  
    console.log("Parsed categoryId:", parsedCategoryId);
    console.log("Computed categoryName:", categoryName);
  
    return (
      <Card
        className="mt-4 shadow-sm border-0"
        style={{
          borderRadius: "12px",
          overflow: "hidden",
          backgroundColor: "#ffffff",
        }}
        key={brandId}
      >
        <CardBody className="p-4">
          <h5
            className="card-title mb-4"
            style={{
              fontWeight: "600",
              color: "#2c3e50",
              borderBottom: "2px solid #3498db",
              paddingBottom: "8px",
              display: "inline-block",
            }}
          >
            {brandName ? `Brand: ${brandName}` : "Brand: N/A"}
          </h5>
          <div
            style={{
              maxHeight: "250px",
              overflowY: "auto",
              overflowX: "auto",
              borderRadius: "8px",
              backgroundColor: "#f9fbfc",
            }}
          >
            <Table
              responsive
              striped
              hover
              className="table-nowrap mb-0"
              style={{
                borderCollapse: "separate",
                borderSpacing: "0",
                fontSize: "14px",
              }}
            >
              <thead
                style={{
                  backgroundColor: "#3498db",
                  color: "#ffffff",
                  position: "sticky",
                  top: "0",
                  zIndex: "1",
                }}
              >
                <tr>
                  <th
                    style={{
                      padding: "12px 15px",
                      fontWeight: "600",
                      borderTopLeftRadius: "8px",
                    }}
                  >
                    Sr No.
                  </th>
                  <th style={{ padding: "12px 15px", fontWeight: "600" }}>
                    Product Name
                  </th>
                  <th style={{ padding: "12px 15px", fontWeight: "600" }}>
                    Category
                  </th>
                  <th style={{ padding: "12px 15px", fontWeight: "600" }}>
                    Subcategory
                  </th>
                  {variants.map((variant) => (
                    <th
                      key={variant.varientname}
                      style={{ padding: "12px 15px", fontWeight: "600" }}
                    >
                      {variant.varientname}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr
                  style={{
                    backgroundColor: "#ffffff",
                    transition: "background-color 0.2s ease",
                  }}
                  className="table-row-hover"
                >
                  <td
                    style={{
                      padding: "15px",
                      borderBottom: "1px solid #e9ecef",
                      color: "#7f8c8d",
                    }}
                  >
                    1
                  </td>
                  <td
                    style={{
                      padding: "15px",
                      borderBottom: "1px solid #e9ecef",
                      color: "#34495e",
                      fontWeight: "500",
                    }}
                  >
                    {formik.values.productName || (
                      <span style={{ color: "#bdc3c7" }}>N/A</span>
                    )}
                  </td>
                  <td
                    style={{
                      padding: "15px",
                      borderBottom: "1px solid #e9ecef",
                      color: "#34495e",
                      fontWeight: "500",
                    }}
                  >
                    {categoryName}
                  </td>
                  <td
                    style={{
                      padding: "15px",
                      borderBottom: "1px solid #e9ecef",
                      color: "#34495e",
                      fontWeight: "500",
                    }}
                  >
                    {subcategory || (
                      <span style={{ color: "#bdc3c7" }}>N/A</span>
                    )}
                  </td>
                  {variants.map((variant) => (
                    <td
                      key={variant.varientname}
                      style={{
                        padding: "15px",
                        borderBottom: "1px solid #e9ecef",
                        color: "#34495e",
                      }}
                    >
                      {renderVariantDetails(brandId, variant.varientname)}
                    </td>
                  ))}
                </tr>
              </tbody>
            </Table>
          </div>
        </CardBody>
      </Card>
    );
  };
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Product Inventory" breadcrumbItem="Add Product" />

          <Row>
            <Col xs="12">
              <Card className="shadow-lg border-0 rounded-3">
                <CardBody>
                  <CardTitle tag="h3" className="text-primary fw-bold mb-3">
                    Product Information
                  </CardTitle>
                  <p className="text-muted">
                    Fill out the fields below to register product details.
                  </p>

                  <Form autoComplete="off" onSubmit={formik.handleSubmit}>
                    <Row className="g-4">
                      <Col md="6">
                        <Label htmlFor="productName" className="fw-semibold">
                          Product Name
                        </Label>
                        <Input
                          id="productName"
                          name="productName"
                          type="text"
                          className="form-control shadow-sm"
                          value={formik.values.productName}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          invalid={
                            formik.touched.productName &&
                            formik.errors.productName
                          }
                        />
                        <FormFeedback>{formik.errors.productName}</FormFeedback>
                      </Col>

                      <Col md="6">
                        <Label htmlFor="description" className="fw-semibold">
                          Product Description
                        </Label>
                        <Input
                          id="description"
                          name="description"
                          type="textarea"
                          className="form-control shadow-sm"
                          rows="3"
                          value={formik.values.description}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          invalid={
                            formik.touched.description &&
                            formik.errors.description
                          }
                        />
                        <FormFeedback>{formik.errors.description}</FormFeedback>
                      </Col>

                      <Col md="6">
                        <Label htmlFor="productType" className="fw-semibold">
                          Product Type
                        </Label>
                        <Input
                          id="productType"
                          name="productType"
                          type="text"
                          className="form-control shadow-sm"
                          value={formik.values.productType}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                      </Col>

                      <Col md="6">
                        <Label htmlFor="productImages" className="fw-semibold">
                          Product Images
                        </Label>
                        <Input
                          type="file"
                          id="productImages"
                          name="productImages"
                          className="form-control shadow-sm"
                          multiple
                          onChange={handleImageChange}
                          accept="image/*"
                        />
                        <FormFeedback>
                          {formik.errors.productImages}
                        </FormFeedback>

                        {/* Image Preview Section */}
                        <div className="d-flex flex-wrap mt-3">
                          {imagePreviews.map((img, index) => (
                            <div
                              key={index}
                              className="position-relative me-2 mb-2"
                            >
                              <img
                                src={img.preview}
                                alt="Preview"
                                className="rounded shadow-sm"
                                style={{
                                  width: "100px",
                                  height: "100px",
                                  objectFit: "cover",
                                }}
                              />
                              <Button
                                type="button"
                                className="position-absolute top-0 end-0 bg-danger text-white p-1 rounded-circle"
                                style={{
                                  width: "20px",
                                  height: "20px",
                                  fontSize: "14px",
                                  lineHeight: "14px",
                                }}
                                onClick={() => removeImage(index)}
                              >
                                &times; {/* This is the "X" symbol */}
                              </Button>
                            </div>
                          ))}
                        </div>
                      </Col>

                      <Col md="6">
                        <Label htmlFor="category" className="fw-semibold">
                          Category
                        </Label>
                        <Input
                          id="category"
                          name="category"
                          type="select"
                          className="form-select shadow-sm"
                          value={formik.values.category}
                          onChange={(e) => {
                            formik.handleChange(e);
                            handleCategoryChange(e.target.value);
                          }}
                          onBlur={formik.handleBlur}
                          invalid={
                            formik.touched.category && formik.errors.category
                          }
                          disabled={loading}
                        >
                          <option value="">Select Category</option>
                          {categories.map((category) => (
                            <option
                              key={category.id}
                              value={category.category_name_id}
                            >
                              {category.category_name}
                            </option>
                          ))}
                        </Input>
                        <FormFeedback>{formik.errors.category}</FormFeedback>
                      </Col>

                      <Col md="6">
                        <Label htmlFor="subcategory" className="fw-semibold">
                          Subcategory
                        </Label>
                        <Input
                          id="subcategory"
                          name="subcategory"
                          type="select"
                          className="form-select shadow-sm"
                          value={formik.values.subcategory}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          invalid={
                            formik.touched.subcategory &&
                            formik.errors.subcategory
                          }
                          disabled={loading || subcategories.length === 0}
                        >
                          <option value="">Select Subcategory</option>
                          {subcategories.map((subcategory) => (
                            <option key={subcategory.id} value={subcategory.id}>
                              {subcategory.name}
                            </option>
                          ))}
                        </Input>
                      </Col>

                      <Col xs="12">
                        <Label className="fw-semibold">Choose Brands</Label>
                        <div className="d-flex flex-wrap gap-3">
                          {brands.map((brand) => (
                            <div key={brand.id} className="form-check">
                              <Input
                                type="checkbox"
                                id={`brand-${brand.id}`}
                                name="brands"
                                value={brand.id}
                                checked={formik.values.brands.includes(
                                  brand.id
                                )}
                                onChange={() => handleBrandChange(brand.id)}
                                className="form-check-input"
                              />
                              <Label
                                check
                                htmlFor={`brand-${brand.id}`}
                                className="form-check-label"
                              >
                                {brand.name}
                              </Label>
                            </div>
                          ))}
                        </div>
                        <FormFeedback>{formik.errors.brands}</FormFeedback>
                      </Col>

                      <Col xs="12">
                        <Label className="fw-semibold">Variants</Label>
                        <div className="d-flex flex-wrap gap-3">
                          {variants
                            .sort((a, b) => a.order - b.order)
                            .map((variant) => (
                              <div
                                key={variant.varientname}
                                className="variant-section p-2 bg-light rounded shadow-sm"
                              >
                                <h6 className="mb-0 text-secondary">
                                  {variant.varientname}
                                </h6>
                              </div>
                            ))}
                        </div>
                      </Col>
                    </Row>

                    <Button
                      color="primary"
                      type="submit"
                      disabled={loading}
                      className="mt-4 px-4 py-2 fw-bold"
                    >
                      {loading ? "Loading..." : "Submit"}
                    </Button>
                  </Form>

                  {formik.values.brands.map((brandId) =>
                    renderTable(
                      brandId,
                      formik.values.subcategory,
                      formik.values.category
                    )
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ProductInventory;
