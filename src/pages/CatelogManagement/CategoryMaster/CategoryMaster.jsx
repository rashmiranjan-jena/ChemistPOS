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
  Modal,
  ModalBody,
} from "reactstrap";
import Dropzone from "react-dropzone";
import * as yup from "yup";
import { useFormik } from "formik";
import axios from "axios";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";

const CategoryMaster = () => {
  document.title = "Category Registration";
  const location = useLocation();
  const { id } = location.state || {};

  const editbackendCategoryUrl = `${
    import.meta.env.VITE_API_BASE_URL
  }/api/category-master/`;
  const backendBrandUrl = `${
    import.meta.env.VITE_API_BASE_URL
  }/api/brand-master/`;
  const backendCategoryUrl = `${
    import.meta.env.VITE_API_BASE_URL
  }/api/category-master/`;
  const categoryNameUrl = `${
    import.meta.env.VITE_API_BASE_URL
  }/api/category-name/`;

  const [selectedBannerImage, setSelectedBannerImage] = useState(null);
  const [modalImage, setModalImage] = useState(null);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleBannerImage = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const previewUrl = URL.createObjectURL(file);
    setSelectedBannerImage({ file, preview: previewUrl });
  };

  const handleBrandSelection = (brandId) => {
    setSelectedBrands((prev) =>
      prev.includes(brandId)
        ? prev.filter((id) => id !== brandId)
        : [...prev, brandId]
    );
  };

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get(backendBrandUrl);
        setBrands(response.data);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get(categoryNameUrl);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchBrands();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (id) {
      axios
        .get(`${editbackendCategoryUrl}?category_id=${id}`)
        .then((response) => {
          const data = response.data;
          if (data.category_details) {
            formik.setValues({
              categoryName: data.category_details.category_name_id || "",
              aboutCategory: data.category_details.about_category || "",
              bannerHeading: data.banners?.[0]?.banner_heading || "",
              bannerDescription: data.banners?.[0]?.banner_description || "",
              bannerStatus: data.banners?.[0]?.banner_status
                ? "Published"
                : "Unpublished",
            });

            setSelectedBrands(
              Array.isArray(data.category_details.brand_name_id)
                ? data.category_details.brand_name_id
                : data.category_details.brand_name_id
                ? [data.category_details.brand_name_id]
                : []
            );

            if (data.banners?.[0]?.banner_images?.[0]?.image) {
              setSelectedBannerImage({
                file: null,
                preview: `${import.meta.env.VITE_API_BASE_URL}${
                  data.banners[0].banner_images[0].image
                }`,
              });
            }
          }
        })
        .catch((error) =>
          console.error("Error fetching category details:", error)
        );
    }
  }, [id]);

  const formik = useFormik({
    initialValues: {
      categoryName: "",
      aboutCategory: "",
      bannerHeading: "",
      bannerDescription: "",
      bannerStatus: "",
    },
    validationSchema: yup.object().shape({
      categoryName: yup.string().required("Please enter the Category Name"),
      aboutCategory: yup.string(),
      bannerHeading: yup
        .string()
        .required("Please enter the Banner Heading")
        .max(50, "Banner Heading must not exceed 50 characters"),
      bannerDescription: yup
        .string()
        .required("Please enter the Banner Description")
        .max(150, "Banner Description must not exceed 150 characters"),
      bannerStatus: yup.string().required("Please select a Banner Status"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("brand_name_id", JSON.stringify(selectedBrands));
        formData.append("category_name", values.categoryName);
        formData.append("about_category", values.aboutCategory);
        formData.append("banner_heading", values.bannerHeading);
        formData.append("banner_description", values.bannerDescription);
        formData.append("banner_status", values.bannerStatus === "Published");

        if (selectedBannerImage?.file) {
          formData.append("banner_images[0]", selectedBannerImage.file);
        }

        let response;
        if (id) {
          formData.append("category_id", id);
          response = await axios.put(
            `${backendCategoryUrl}?category_id=${id}`,
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
        } else {
          response = await axios.post(backendCategoryUrl, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }

        if (response) {
          Swal.fire({
            title: id ? "Updated!" : "Created!",
            text: `Category has been ${
              id ? "updated" : "added"
            } successfully.`,
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => {
            window.location.href = "/categorymasterlist";
          });
        }
      } catch (error) {
        console.error("Error submitting data:", error);
        Swal.fire({
          title: "Error!",
          text:
            error.response?.data?.message ||
            "Failed to save category. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      } finally {
        setLoading(false);
      }
    },
  });

  const handleReset = () => {
    formik.resetForm();
    setSelectedBrands([]);
    setSelectedBannerImage(null);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Category Registration"
            breadcrumbItem={id ? "Edit Category" : "Add Details"}
          />
          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
                  <CardTitle tag="h4">
                    {id ? "Edit Category" : "Category Information"}
                  </CardTitle>
                  <p className="card-title-desc mb-4">
                    Fill out the fields below to{" "}
                    {id ? "update" : "register"} your category.
                  </p>

                  <Form onSubmit={formik.handleSubmit} autoComplete="off">
                    <Row>
                      <Col sm="6">
                        <div className="mb-3">
                          <Label htmlFor="categoryName">Category Name</Label>
                          <Input
                            id="categoryName"
                            name="categoryName"
                            type="select"
                            value={formik.values.categoryName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={
                              formik.touched.categoryName &&
                              formik.errors.categoryName
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
                          {formik.touched.categoryName &&
                            formik.errors.categoryName && (
                              <FormFeedback>
                                {formik.errors.categoryName}
                              </FormFeedback>
                            )}
                        </div>

                        <div className="mb-3">
                          <Label htmlFor="brand">Brands</Label>
                          <Row>
                            {brands.map((brand, index) => (
                              <Col sm="4" key={index} className="mb-2">
                                <div className="form-check">
                                  <Input
                                    type="checkbox"
                                    id={`brand_${brand.brand_details.brand_id}`}
                                    className="form-check-input"
                                    checked={selectedBrands.includes(
                                      brand.brand_details.brand_id
                                    )}
                                    onChange={() =>
                                      handleBrandSelection(
                                        brand.brand_details.brand_id
                                      )
                                    }
                                  />
                                  <Label
                                    htmlFor={`brand_${brand.brand_details.brand_id}`}
                                    className="form-check-label"
                                  >
                                    {brand.brand_details.brand_name}
                                  </Label>
                                </div>
                              </Col>
                            ))}
                          </Row>
                        </div>

                        <div className="mb-3">
                          <Label htmlFor="aboutCategory">
                            About Category (Optional)
                          </Label>
                          <Input
                            id="aboutCategory"
                            name="aboutCategory"
                            type="textarea"
                            value={formik.values.aboutCategory}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                        </div>
                      </Col>

                      <Col sm="6">
                        <div className="mb-3">
                          <Label>Banner Image</Label>
                          <Dropzone onDrop={handleBannerImage} multiple={false}>
                            {({ getRootProps, getInputProps }) => (
                              <div className="dropzone" {...getRootProps()}>
                                <input {...getInputProps()} />
                                <div className="text-center">
                                  <i className="mdi mdi-plus-circle-outline font-size-24"></i>
                                  <p>Add Image</p>
                                </div>
                              </div>
                            )}
                          </Dropzone>
                          {selectedBannerImage?.preview && (
                            <img
                              src={selectedBannerImage.preview}
                              alt="Banner Preview"
                              className="img-thumbnail mt-2"
                              style={{
                                width: "50px",
                                height: "50px",
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                setModalImage(selectedBannerImage.preview)
                              }
                            />
                          )}
                        </div>
                        <div className="mb-3">
                          <Label htmlFor="bannerHeading">Banner Heading</Label>
                          <Input
                            id="bannerHeading"
                            name="bannerHeading"
                            type="text"
                            value={formik.values.bannerHeading}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={
                              formik.touched.bannerHeading &&
                              formik.errors.bannerHeading
                            }
                          />
                          {formik.touched.bannerHeading &&
                            formik.errors.bannerHeading && (
                              <FormFeedback>
                                {formik.errors.bannerHeading}
                              </FormFeedback>
                            )}
                        </div>
                        <div className="mb-3">
                          <Label htmlFor="bannerDescription">
                            Banner Description
                          </Label>
                          <Input
                            id="bannerDescription"
                            name="bannerDescription"
                            type="textarea"
                            value={formik.values.bannerDescription}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={
                              formik.touched.bannerDescription &&
                              formik.errors.bannerDescription
                            }
                          />
                          {formik.touched.bannerDescription &&
                            formik.errors.bannerDescription && (
                              <FormFeedback>
                                {formik.errors.bannerDescription}
                              </FormFeedback>
                            )}
                        </div>

                        <div className="mb-3">
                          <Label htmlFor="bannerStatus">Banner Status</Label>
                          <Input
                            id="bannerStatus"
                            name="bannerStatus"
                            type="select"
                            value={formik.values.bannerStatus}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={
                              formik.touched.bannerStatus &&
                              formik.errors.bannerStatus
                            }
                          >
                            <option value="">Select Status</option>
                            <option value="Published">Published</option>
                            <option value="Unpublished">Unpublished</option>
                          </Input>
                          {formik.touched.bannerStatus &&
                            formik.errors.bannerStatus && (
                              <FormFeedback>
                                {formik.errors.bannerStatus}
                              </FormFeedback>
                            )}
                        </div>
                      </Col>
                    </Row>

                    <div className="d-flex flex-wrap gap-2">
                      <Button type="submit" color="primary" disabled={loading}>
                        {loading
                          ? "Processing..."
                          : id
                          ? "Update"
                          : "Submit"}
                      </Button>
                      <Button type="button" color="secondary" onClick={handleReset}>
                        Cancel
                      </Button>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
        <Modal isOpen={!!modalImage} toggle={() => setModalImage(null)}>
          <ModalBody>
            <img src={modalImage} alt="Large Preview" className="img-fluid" />
          </ModalBody>
        </Modal>
      </div>
    </React.Fragment>
  );
};

export default CategoryMaster;