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
  postGroupCategory,
  getGroupCategoryById,
  updateGroupCategory,
} from "../../../ApiService/Drugs/GroupCategory";
import Swal from "sweetalert2";

const validationSchema = Yup.object().shape({
  group_category_name: Yup.string()
    .required("Please enter the Group Category Name")
    .min(2, "Name must be at least 2 characters"),

  group_category_description: Yup.string().min(
    10,
    "Description must be at least 10 characters if provided"
  ),
});

const GroupCategoryForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location.state || {};
  const photoRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageName, setImageName] = useState("");
  const [isEditing, setIsEditing] = useState(!!id);

  const formik = useFormik({
    initialValues: {
      group_category_name: "",
      group_category_image: null,
      group_category_description: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("group_category_name", values.group_category_name);
        formData.append(
          "group_category_description",
          values.group_category_description
        );
        if (values.group_category_image) {
          formData.append("group_category_image", values.group_category_image);
        }

        let response;
        if (isEditing) {
          response = await updateGroupCategory(id, formData);
          Swal.fire({
            title: "Group Category Updated!",
            text: "The group category has been successfully updated.",
            icon: "success",
            confirmButtonText: "OK",
          });
        } else {
          response = await postGroupCategory(formData);
          Swal.fire({
            title: "Group Category Registered!",
            text: "The group category has been successfully registered.",
            icon: "success",
            confirmButtonText: "OK",
          });
        }

        if (response) {
          formik.resetForm();
          if (photoRef.current) photoRef.current.value = "";
          setImagePreview(null);
          setImageName("");
          navigate("/group-category-list");
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
    if (id) {
      setIsEditing(true);
      const fetchGroupCategory = async () => {
        try {
          const data = await getGroupCategoryById(id);
          formik.setValues({
            group_category_name: data.group_category_name || "",
            group_category_image: null,
            group_category_description: data.group_category_description || "",
          });
          if (data.group_category_image) {
            setImagePreview(
              `${import.meta.env.VITE_API_BASE_URL}${data.group_category_image}`
            );
            setImageName(data.group_category_image.split("/").pop());
          }
        } catch (error) {
          console.error("Error fetching group category:", error);
          Swal.fire({
            title: "Error!",
            text: error.message || "Failed to fetch group category details.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      };
      fetchGroupCategory();
    }
  }, [id]);

  const handleImageChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setImageName(file.name);
      formik.setFieldValue("group_category_image", file);
    }
  };

  const handleImageRemove = () => {
    setImagePreview(null);
    setImageName("");
    formik.setFieldValue("group_category_image", null);
    if (photoRef.current) photoRef.current.value = "";
  };

  document.title = "Group Category";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Drugs"
            breadcrumbItem={
              isEditing ? "Edit Group Category" : "Add Group Category"
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
                      {isEditing ? "Edit Group Category" : "Add Group Category"}
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
                      {/* Group Category Name */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="group_category_name"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Group Category Name
                          </Label>
                          <Input
                            type="text"
                            name="group_category_name"
                            id="group_category_name"
                            placeholder="Enter group category name"
                            value={formik.values.group_category_name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.group_category_name &&
                              formik.errors.group_category_name
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.touched.group_category_name &&
                            formik.errors.group_category_name && (
                              <div className="invalid-feedback">
                                {formik.errors.group_category_name}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      {/* Photo Upload */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="group_category_image"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Photo (Optional)
                          </Label>
                          <Input
                            type="file"
                            name="group_category_image"
                            id="group_category_image"
                            accept="image/*"
                            ref={photoRef}
                            onChange={handleImageChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.group_category_image &&
                              formik.errors.group_category_image
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "8px",
                            }}
                          />
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
                              alt="Group Category Photo"
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

                      {/* Description */}
                      <Col md="12">
                        <FormGroup>
                          <Label
                            for="group_category_description"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Description (Optional)
                          </Label>
                          <Input
                            type="textarea"
                            name="group_category_description"
                            id="group_category_description"
                            placeholder="Enter description (optional)"
                            rows="4"
                            value={formik.values.group_category_description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.group_category_description &&
                              formik.errors.group_category_description
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.touched.group_category_description &&
                            formik.errors.group_category_description && (
                              <div className="invalid-feedback">
                                {formik.errors.group_category_description}
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
                            : isEditing
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

export default GroupCategoryForm;
