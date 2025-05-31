import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
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
  Modal,
  ModalHeader,
  ModalBody,
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
import { FaEye } from "react-icons/fa";

const EditProductInventory = () => {
  document.title = "Edit Product Inventory";
  const location = useLocation();
  const { id } = location.state || {};
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productDetails, setProductDetails] = useState({});
  const [imagePreviews, setImagePreviews] = useState([]);
  const [colorImagePreviews, setColorImagePreviews] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [currentBrandId, setCurrentBrandId] = useState(null);
  const [currentColorCode, setCurrentColorCode] = useState(null);

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

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}api/products-handler/?product_id=${id}`
        );
        const productData = response.data;

        const formattedVariants = {};
        productData.variants.forEach((variant) => {
          formattedVariants[variant.variant_name] = variant.details.map(
            (detail) => detail.code
          );
        });

        const colorImages = {};
        const colorVariant = productData.variants.find(
          (v) => v.variant_name === "Colour"
        );
        if (colorVariant) {
          colorVariant.details.forEach((detail) => {
            colorImages[detail.code] = detail.photos.map((photo) => ({
              preview: `${BASE_URL}${photo.photo}`,
              photoId: photo.productPhoto_id,
            }));
          });
        }

        const brandId = productData.brand_name_id;
        const variantData = { [brandId]: formattedVariants };

        formik.setValues({
          productName: productData.product_name || "",
          category: productData.category_name_id || "",
          productType: productData.product_type || "",
          subcategory: productData.subcategory_name_id || "",
          brands: [productData.brand_name_id] || [],
          variants: variantData,
          description: productData.description || "",
          productImages: productData.main_image.map((img) => img.main_image),
          colorImages: { [brandId]: colorImages },
        });

        const mainImagePreviews = productData.main_image.map((img) => ({
          preview: `${BASE_URL}${img.main_image}`,
        }));
        setImagePreviews(mainImagePreviews);

        setColorImagePreviews({ [brandId]: colorImages });
        if (productData.category_name_id) {
          await handleCategoryChange(productData.category_name_id);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductDetails();
    }
  }, [id]);

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
    if (updatedPreviews[index]?.preview) {
      URL.revokeObjectURL(updatedPreviews[index].preview);
    }
    updatedPreviews.splice(index, 1);
    setImagePreviews(updatedPreviews);
  };

  const handleColorImageChange = (e, brandId, colorCode) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    const updatedColorImages = { ...formik.values.colorImages };
    if (!updatedColorImages[brandId]) updatedColorImages[brandId] = {};
    if (!updatedColorImages[brandId][colorCode])
      updatedColorImages[brandId][colorCode] = [];
    updatedColorImages[brandId][colorCode] = [
      ...updatedColorImages[brandId][colorCode],
      ...files,
    ];
    formik.setFieldValue("colorImages", updatedColorImages);

    const updatedColorPreviews = { ...colorImagePreviews };
    if (!updatedColorPreviews[brandId]) updatedColorPreviews[brandId] = {};
    if (!updatedColorPreviews[brandId][colorCode])
      updatedColorPreviews[brandId][colorCode] = [];
    updatedColorPreviews[brandId][colorCode] = [
      ...updatedColorPreviews[brandId][colorCode],
      ...newPreviews,
    ];
    setColorImagePreviews(updatedColorPreviews);
  };

  const removeColorImage = (brandId, colorCode, index) => {
    const updatedColorImages = { ...formik.values.colorImages };
    if (
      updatedColorImages[brandId] &&
      updatedColorImages[brandId][colorCode] &&
      updatedColorImages[brandId][colorCode][index]
    ) {
      updatedColorImages[brandId][colorCode].splice(index, 1);
      if (updatedColorImages[brandId][colorCode].length === 0) {
        delete updatedColorImages[brandId][colorCode];
      }
      formik.setFieldValue("colorImages", updatedColorImages);
    }

    const updatedColorPreviews = { ...colorImagePreviews };
    if (
      updatedColorPreviews[brandId] &&
      updatedColorPreviews[brandId][colorCode] &&
      updatedColorPreviews[brandId][colorCode][index]
    ) {
      const previewUrl =
        updatedColorPreviews[brandId][colorCode][index].preview;
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      updatedColorPreviews[brandId][colorCode].splice(index, 1);
      if (updatedColorPreviews[brandId][colorCode].length === 0) {
        delete updatedColorPreviews[brandId][colorCode];
      }
      setColorImagePreviews(updatedColorPreviews);
    }

    if (
      modalOpen &&
      brandId === currentBrandId &&
      colorCode === currentColorCode
    ) {
      const updatedModalImages = [...modalImages];
      if (updatedModalImages[index]) {
        updatedModalImages.splice(index, 1);
        setModalImages(updatedModalImages);
        if (updatedModalImages.length === 0) {
          setModalOpen(false); // Optionally close modal if no images remain
        }
      }
    }
  };

  const handleCategoryChange = async (categoryId) => {
    if (!categoryId) return;

    setLoading(true);
    const categoryData = await fetchCategoryDetails(categoryId);
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
      formData.append("product_type", values.productType || "");
      formData.append("category_name_id", values.category);
      formData.append("subcategory_name_id", values.subcategory);
      formData.append("brand_name_id", JSON.stringify(values.brands));

      const formattedVariants = Object.keys(values.variants).map((brandId) => ({
        varient_details: Object.entries(values.variants[brandId]).map(
          ([variantName, codes]) => {
            const variant = variants.find((v) => v.varientname === variantName);
            return {
              variant_name: variant?.varientid || null,
              codes,
            };
          }
        ),
      }));

      formData.append("variant_details", JSON.stringify(formattedVariants));
      formData.append("description", values.description);

      if (values.productImages && values.productImages.length > 0) {
        Array.from(values.productImages).forEach((image) => {
          if (image instanceof File) {
            formData.append("product_images", image);
          }
        });
      }

      if (values.colorImages) {
        Object.keys(values.colorImages).forEach((brandId) => {
          Object.keys(values.colorImages[brandId]).forEach((colorCode) => {
            values.colorImages[brandId][colorCode].forEach((image) => {
              if (image instanceof File) {
                formData.append(
                  `color_images[${brandId}][${colorCode}]`,
                  image
                );
              }
            });
          });
        });
      }

      const url = id
        ? `${BASE_URL}api/products-handler/?product_id=${id}`
        : `${BASE_URL}api/products-handler/`;
      const method = id ? "put" : "post";

      const response = await axios[method](url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Response from API:", response.data);
      Swal.fire({
        title: "Success!",
        text: id ? "Updated Successfully" : "Added Successfully",
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
      colorImages: {},
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

    if (!newVariants[brandId][variantName]) {
      newVariants[brandId][variantName] = [];
    }

    if (newVariants[brandId][variantName].includes(code)) {
      newVariants[brandId][variantName] = newVariants[brandId][
        variantName
      ].filter((item) => item !== code);
    } else {
      newVariants[brandId][variantName].push(code);
    }

    formik.setFieldValue("variants", newVariants);
  };

  const handleBrandChange = (brandId) => {
    const selectedBrands = [...formik.values.brands];
    if (selectedBrands.includes(brandId)) {
      const index = selectedBrands.indexOf(brandId);
      selectedBrands.splice(index, 1);
    } else {
      selectedBrands.push(brandId);
    }
    formik.setFieldValue("brands", selectedBrands);

    const updatedProductDetails = { ...productDetails };
    selectedBrands.forEach((bId) => {
      if (!updatedProductDetails[bId]) {
        updatedProductDetails[bId] = [];
      }
      updatedProductDetails[bId].push({
        productName: formik.values.productName,
        category: formik.values.category,
        subcategory: formik.values.subcategory,
        variants: formik.values.variants,
      });
    });
    setProductDetails(updatedProductDetails);
  };

  const openPreviewModal = (brandId, colorCode) => {
    const images = colorImagePreviews[brandId]?.[colorCode] || [];
    setModalImages(images);
    setCurrentBrandId(brandId);
    setCurrentColorCode(colorCode);
    setModalOpen(true);
  };

  const handleRemoveImageFromModal = (index) => {
    removeColorImage(currentBrandId, currentColorCode, index);
  };

  const renderVariantDetails = (brandId, variantName) => {
    const variant = variants.find((v) => v.varientname === variantName);
    const selectedVariants =
      formik.values.variants[brandId]?.[variantName] || [];

    return variant && variant.varient_data
      ? variant.varient_data.map((detail) => (
          <div key={detail.code} className="form-check mb-2">
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
                <div className="mt-2">
                  <div className="d-flex align-items-center gap-2">
                    <Button
                      color="link"
                      size="sm"
                      onClick={() => openPreviewModal(brandId, detail.code)}
                      disabled={
                        !colorImagePreviews[brandId]?.[detail.code]?.length
                      }
                    >
                      <FaEye /> Preview
                    </Button>
                    <Input
                      type="file"
                      id={`color-image-${brandId}-${detail.code}`}
                      multiple
                      accept="image/*"
                      onChange={(e) =>
                        handleColorImageChange(e, brandId, detail.code)
                      }
                      style={{ width: "auto" }}
                    />
                  </div>
                </div>
              )}
          </div>
        ))
      : "N/A";
  };

  const renderTable = (brandId, subcategoriesId, categoryId) => {
    const brandName = brands.find((brand) => brand.id === brandId)?.name;
    const subcategory = subcategories.find(
      (subcategory) => subcategory.id == subcategoriesId
    )?.name;

    const parsedCategoryId = categoryId ? Number(categoryId) : null;
    const categoryName = parsedCategoryId
      ? categories.find((cat) => cat.category_name_id === parsedCategoryId)
          ?.category_name || "N/A"
      : "No category selected";

    return (
      <Card className="mt-4" key={brandId}>
        <CardBody>
          <h5 className="card-title">Brand: {brandName || "N/A"}</h5>
          <div
            style={{ maxHeight: "200px", overflowY: "auto", overflowX: "auto" }}
          >
            <Table responsive>
              <thead>
                <tr>
                  <th>Sr No.</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Subcategory</th>
                  {variants.map((variant) => (
                    <th key={variant.varientname}>{variant.varientname}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>{formik.values.productName || "N/A"}</td>
                  <td>{categoryName || "N/A"}</td>
                  <td>{subcategory || "N/A"}</td>
                  {variants.map((variant) => (
                    <td key={variant.varientname}>
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
          <Breadcrumbs
            title="Product Inventory"
            breadcrumbItem={id ? "Edit Product" : "Add Product"}
          />

          <Row>
            <Col xs="12">
              <Card className="shadow-lg border-0 rounded-3">
                <CardBody>
                  <CardTitle tag="h3" className="text-primary fw-bold mb-3">
                    {id ? "Edit Product Information" : "Product Information"}
                  </CardTitle>
                  <p className="text-muted">
                    {id
                      ? "Update the fields below to edit product details."
                      : "Fill out the fields below to register product details."}
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
                        />
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
                                }}
                                onClick={() => removeImage(index)}
                              >
                                ×
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
                        <FormFeedback>{formik.errors.subcategory}</FormFeedback>
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
                      {loading ? "Loading..." : id ? "Update" : "Submit"}
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

      <Modal
        isOpen={modalOpen}
        toggle={() => setModalOpen(false)}
        centered
        size="lg"
      >
        <ModalHeader toggle={() => setModalOpen(false)}>
          Color Image Preview
        </ModalHeader>
        <ModalBody>
          <div className="d-flex flex-wrap gap-3">
            {modalImages.length > 0 ? (
              modalImages.map((img, index) => (
                <div key={index} className="position-relative">
                  <img
                    src={img.preview}
                    alt={`Preview ${index}`}
                    className="rounded shadow-sm"
                    style={{
                      maxWidth: "200px",
                      maxHeight: "200px",
                      objectFit: "cover",
                    }}
                  />
                  <Button
                    type="button"
                    className="position-absolute top-0 end-0 bg-danger text-white p-1 rounded-circle"
                    style={{ width: "20px", height: "20px", fontSize: "14px" }}
                    onClick={() => handleRemoveImageFromModal(index)}
                  >
                    ×
                  </Button>
                </div>
              ))
            ) : (
              <p>No images available to preview.</p>
            )}
          </div>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default EditProductInventory;
