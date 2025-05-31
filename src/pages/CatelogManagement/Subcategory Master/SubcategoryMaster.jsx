import React, { useState, useEffect, useRef } from "react";
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
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";
const SubcategoryMaster = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { id } = location.state || {};

  console.log(id);

  const [selectedImages, setSelectedImages] = useState([]);
  const [bannerImages, setBannerImages] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const backendUrl = `${
    import.meta.env.VITE_API_BASE_URL
  }api/subcategory-master/`;

  const categoryUrl = `${import.meta.env.VITE_API_BASE_URL}api/category-name/`;
  const fetchSubcategoryUrl = `${
    import.meta.env.VITE_API_BASE_URL
  }api/subcategory-master/?sub_category_id=${id}`;

  const dropzoneRef1 = useRef();
  const dropzoneRef2 = useRef();

  useEffect(() => {
    // Fetch Categories
    const fetchCategories = async () => {
      try {
        const response = await axios.get(categoryUrl);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchSubcategory = async () => {
      if (id) {
        try {
          setLoading(true);
          const response = await axios.get(fetchSubcategoryUrl);
          const data = response.data;
          formik.setValues({
            categoryName: data.sub_category_details.category_name_id,
            subcategoryName: data.sub_category_details.sub_category_name,
            aboutSubcategory:
              data.sub_category_details.about_sub_category || "",
            bannerHeading:
              data.banners.length > 0 ? data.banners[0].banner_heading : "",
            bannerDescription:
              data.banners.length > 0 ? data.banners[0].banner_description : "",
            bannerStatus:
              data.banners.length > 0
                ? data.banners[0].banner_status
                  ? "Published"
                  : "Unpublished"
                : "Unpublished",
          });

          setSelectedImages(data.sub_category_details.images || []);
          setBannerImages(
            data.banners.length > 0 ? data.banners[0].banner_images : []
          );

          setLoading(false);
        } catch (error) {
          console.error("Error fetching subcategory:", error);
          setLoading(false);
        }
      }
    };

    fetchCategories();
    fetchSubcategory();
  }, [id]);

  const handleAcceptedFiles = (files, setImages) => {
    const updatedFiles = files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
    setImages((prev) => [...prev, ...updatedFiles]);
  };

  const openPreview = (image) => setPreviewImage(image);
  const closePreview = () => setPreviewImage(null);

  const handleRemoveImage = (index) => {
    setBannerImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };
  const handleRemoveSubcategoryImage = (index) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };
  
  const formik = useFormik({
    initialValues: {
      categoryName: "",
      subcategoryName: "",
      aboutSubcategory: "",
      subcategoryImages: [],
      bannerImages: [],
      bannerHeading: "",
      bannerDescription: "",
      bannerStatus: "",
    },
    validationSchema: yup.object().shape({
      categoryName: yup.string().required("Please select a Category Name"),
      subcategoryName: yup
        .string()
        .required("Please enter the Subcategory Name"),
      bannerHeading: yup
        .string()
        .required("Please enter the Banner Heading")
        .max(50, "Banner Heading must not exceed 50 characters"),
      bannerDescription: yup
        .string()
        .required("Please enter the Banner Description")
        .max(150, "Banner Description must not exceed 150 characters"),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("category_name_id", values.categoryName);
      formData.append("sub_category_name", values.subcategoryName);
      formData.append("about_sub_category", values.aboutSubcategory);
      formData.append("banner_heading", values.bannerHeading);
      formData.append("banner_description", values.bannerDescription);
      formData.append("banner_status", values.bannerStatus);

      selectedImages.forEach((file, index) => {
        formData.append(`sub_category_images[${index}]`, file);
      });

      bannerImages.forEach((file, index) => {
        formData.append(`banner_images[${index}]`, file);
      });

      try {
        if (id) {
          // Edit existing subcategory
          const response = await axios.put(fetchSubcategoryUrl, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          if (response.status === 200) {
            Swal.fire({
              icon: "success",
              title: "Updated!",
              text: "Subcategory updated successfully!",
            });
          }
        } else {
          // Create new subcategory
          const response = await axios.post(backendUrl, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          if (response.status === 201) {
            Swal.fire({
              icon: "success",
              title: "Success!",
              text: "Subcategory created successfully!",
            });
          }
        }

        formik.resetForm();
        navigate("/subcategorymasterlist");
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: error.response?.data?.error || "Something went wrong!",
        });
      }
    },
  });

  return (
    <div className="page-content">
      <Container fluid>
        <Row>
          <Col xs="12">
            <Card>
              <CardBody>
                <CardTitle tag="h4">Subcategory Information</CardTitle>
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
                              key={category.id}
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
                        <Label htmlFor="subcategoryName">
                          Subcategory Name
                        </Label>
                        <Input
                          id="subcategoryName"
                          name="subcategoryName"
                          type="text"
                          value={formik.values.subcategoryName}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          invalid={
                            formik.touched.subcategoryName &&
                            formik.errors.subcategoryName
                          }
                        />
                        {formik.touched.subcategoryName &&
                          formik.errors.subcategoryName && (
                            <FormFeedback>
                              {formik.errors.subcategoryName}
                            </FormFeedback>
                          )}
                      </div>

                      <div className="mb-3">
                        <Label htmlFor="aboutSubcategory">
                          About Subcategory (Optional)
                        </Label>
                        <Input
                          id="aboutSubcategory"
                          name="aboutSubcategory"
                          type="textarea"
                          value={formik.values.aboutSubcategory}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                      </div>

                      <div className="mb-3">
                        <Label>Subcategory Images</Label>
                        <Dropzone
                          ref={dropzoneRef1}
                          onDrop={(files) =>
                            handleAcceptedFiles(files, setSelectedImages)
                          }
                        >
                          {({ getRootProps, getInputProps }) => (
                            <div className="dropzone" {...getRootProps()}>
                              <input {...getInputProps()} />
                              <div className="text-center">
                                <i className="mdi mdi-plus-circle-outline font-size-24"></i>
                                <p>Add Images</p>
                              </div>
                            </div>
                          )}
                        </Dropzone>

                        <div className="mt-3 d-flex flex-wrap">
                          {selectedImages.map((file, index) => (
                            <div
                              key={index}
                              className="position-relative d-inline-block me-2"
                            >
                              {/* Image Preview */}
                              <img
                                src={
                                  file.preview ||
                                  `${import.meta.env.VITE_API_BASE_URL}${
                                    file.sub_category_image
                                  }`
                                }
                                alt="Preview"
                                className="img-thumbnail"
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  openPreview(
                                    file.preview ||
                                      `${import.meta.env.VITE_API_BASE_URL}${
                                        file.sub_category_image
                                      }`
                                  )
                                }
                              />

                              {/* Remove Button (Cross Icon) */}
                              <button
                                className="position-absolute top-0 start-100 translate-middle btn btn-danger btn-sm p-1"
                                style={{
                                  borderRadius: "50%",
                                  width: "18px",
                                  height: "18px",
                                  fontSize: "12px",
                                }}
                                onClick={() =>
                                  handleRemoveSubcategoryImage(index)
                                }
                              >
                                ✖
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Col>

                    <Col sm="6">
                      <div className="mb-3">
                        <Label>Banner Images</Label>
                        <Dropzone
                          ref={dropzoneRef2}
                          onDrop={(files) =>
                            handleAcceptedFiles(files, setBannerImages)
                          }
                        >
                          {({ getRootProps, getInputProps }) => (
                            <div className="dropzone" {...getRootProps()}>
                              <input {...getInputProps()} />
                              <div className="text-center">
                                <i className="mdi mdi-plus-circle-outline font-size-24"></i>
                                <p>Add Banner Images</p>
                              </div>
                            </div>
                          )}
                        </Dropzone>

                        <div className="mt-3 d-flex flex-wrap">
                          {bannerImages.map((file, index) => (
                            <div
                              key={index}
                              className="position-relative d-inline-block me-2"
                            >
                              {/* Image Preview */}
                              <img
                                src={
                                  file.preview ||
                                  `${import.meta.env.VITE_API_BASE_URL}${
                                    file.image
                                  }`
                                }
                                alt="Preview"
                                className="img-thumbnail"
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  openPreview(
                                    file.preview ||
                                      `${import.meta.env.VITE_API_BASE_URL}${
                                        file.image
                                      }`
                                  )
                                }
                              />

                              {/* Remove Button (Cross Icon) */}
                              <button
                                className="position-absolute top-0 start-100 translate-middle btn btn-danger btn-sm p-1"
                                style={{
                                  borderRadius: "50%",
                                  width: "18px",
                                  height: "18px",
                                  fontSize: "12px",
                                }}
                                onClick={() => handleRemoveImage(index)}
                              >
                                ✖
                              </button>
                            </div>
                          ))}
                        </div>
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
                        >
                          <option value="">Select Status</option>
                          <option value="Published">Published</option>
                          <option value="Unpublished">Unpublished</option>
                        </Input>
                      </div>
                    </Col>
                  </Row>

                  <div className="d-flex flex-wrap gap-2">
                    <Button type="submit" color="primary">
                      {id ? "Update" : "Submit"}
                    </Button>
                    <Button
                      type="button"
                      color="secondary"
                      onClick={() => formik.resetForm()}
                    >
                      Cancel
                    </Button>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
        {previewImage && (
          <Modal isOpen={true} toggle={closePreview}>
            <ModalBody className="text-center">
              <img
                src={previewImage}
                alt="Preview"
                className="img-fluid"
                style={{ maxHeight: "90vh" }}
              />
              <Button className="mt-3" color="secondary" onClick={closePreview}>
                Close
              </Button>
            </ModalBody>
          </Modal>
        )}
      </Container>
    </div>
  );
};

export default SubcategoryMaster;
