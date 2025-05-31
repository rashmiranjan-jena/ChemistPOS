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
import {
  postSubCategory,
  getSubCategoryById,
  updateSubCategory,
} from "../../../ApiService/Drugs/Subcategory";
import { getGroupCategories } from "../../../ApiService/Drugs/GroupCategory";
import { getCategories } from "../../../ApiService/Drugs/Category";
import Swal from "sweetalert2";

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Sub Category Name is required")
    .min(2, "Name must be at least 2 characters"),
  groupCategory: Yup.string().required("Group Category is required"),
  category: Yup.string().required("Category is required"),
  photo: Yup.mixed()
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
  description: Yup.string().nullable(),
});

const SubCategoryForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const photoRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageName, setImageName] = useState("");
  const [groupCategories, setGroupCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [subCategoryId, setSubCategoryId] = useState(null);

  useEffect(() => {
    const { state } = location;
    if (state?.id) {
      setIsEditMode(true);
      setSubCategoryId(state.id);
    }
  }, [location]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [groupResponse, categoryResponse] = await Promise.all([
          getGroupCategories(),
          getCategories(),
        ]);

        setGroupCategories(groupResponse || []);
        setCategories(categoryResponse || []);

        if (isEditMode && subCategoryId) {
          const subCategoryData = await getSubCategoryById(subCategoryId);
          formik.setValues({
            name: subCategoryData.sub_category_name || "",
            groupCategory: subCategoryData.group_category_id || "",
            category: subCategoryData.category_id || "",
            photo: null,
            description: subCategoryData.sub_category_description || "",
          });
          if (subCategoryData.sub_category_image) {
            setImagePreview(
              `${import.meta.env.VITE_API_BASE_URL}${
                subCategoryData.sub_category_image
              }`
            );
            setImageName(subCategoryData.sub_category_image.split("/").pop());
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to load data. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isEditMode, subCategoryId]);

  const formik = useFormik({
    initialValues: {
      name: "",
      groupCategory: "",
      category: "",
      photo: null,
      description: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("sub_category_name", values.name);
        formData.append("group_category_id", values.groupCategory);
        formData.append("category_id", values.category);
        if (values.description) {
          formData.append("sub_category_description", values.description);
        }
        if (values.photo) {
          formData.append("sub_category_image", values.photo);
        }

        let response;
        if (isEditMode) {
          response = await updateSubCategory(subCategoryId, formData);
          Swal.fire({
            title: "Sub Category Updated!",
            text: "The sub category has been successfully updated.",
            icon: "success",
            confirmButtonText: "OK",
          });
        } else {
          response = await postSubCategory(formData);
          Swal.fire({
            title: "Sub Category Registered!",
            text: "The sub category has been successfully registered.",
            icon: "success",
            confirmButtonText: "OK",
          });
        }

        if (response) {
          formik.resetForm();
          if (photoRef.current) photoRef.current.value = "";
          setImagePreview(null);
          setImageName("");
          navigate("/sub-category-list");
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
      formik.setFieldValue("photo", file);
    }
  };

  const handleImageRemove = () => {
    setImagePreview(null);
    setImageName("");
    formik.setFieldValue("photo", null);
    if (photoRef.current) photoRef.current.value = "";
  };

  if (loading) {
    return (
      <div className="page-content">
        <Container fluid>
          <div className="text-center">Loading...</div>
        </Container>
      </div>
    );
  }

  document.title = " Sub-Category Registration";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Drugs"
            breadcrumbItem={
              isEditMode ? "Edit Sub Category" : "Add Sub Category"
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
                      {isEditMode ? "Edit Sub Category" : "Add Sub Category"}
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
                      <Col md="6">
                        <FormGroup>
                          <Label
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Sub Category Name
                          </Label>
                          <Input
                            type="text"
                            name="name"
                            placeholder="Enter sub category name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.name && formik.errors.name
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.touched.name && formik.errors.name && (
                            <div className="invalid-feedback">
                              {formik.errors.name}
                            </div>
                          )}
                        </FormGroup>
                      </Col>

                      <Col md="6">
                        <FormGroup>
                          <Label
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Group Category
                          </Label>
                          <Input
                            type="select"
                            name="groupCategory"
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
                          >
                            <option value="">Select Group Category</option>
                            {groupCategories.map((option) => (
                              <option
                                key={option.group_category_id}
                                value={option.group_category_id}
                              >
                                {option.group_category_name}
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
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Category
                          </Label>
                          <Input
                            type="select"
                            name="category"
                            value={formik.values.category}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.category && formik.errors.category
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          >
                            <option value="">Select Category</option>
                            {categories.map((option) => (
                              <option
                                key={option.category_id}
                                value={option.category_id}
                              >
                                {option.category_name}
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
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Photo (Optional)
                          </Label>
                          <Input
                            type="file"
                            name="photo"
                            accept="image/*"
                            ref={photoRef}
                            onChange={handleImageChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.photo && formik.errors.photo
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "8px",
                            }}
                          />
                          {formik.touched.photo && formik.errors.photo && (
                            <div className="invalid-feedback">
                              {formik.errors.photo}
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
                              alt="Sub Category Photo"
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

                      <Col md="12">
                        <FormGroup>
                          <Label
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Description (Optional)
                          </Label>
                          <Input
                            type="textarea"
                            name="description"
                            placeholder="Enter description"
                            rows="4"
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
          boxshadow: 0 0 8px rgba(0, 123, 255, 0.3);
        }
        .invalid-feedback {
          font-size: 12px;
          color: #dc3545;
        }
      `}</style>
    </React.Fragment>
  );
};

export default SubCategoryForm;
