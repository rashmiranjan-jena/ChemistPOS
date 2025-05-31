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
  postStrength,
  getStrengthById,
  updateStrength,
} from "../../../ApiService/Drugs/Strength";
import Swal from "sweetalert2";

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Strength Name is required")
    .min(2, "Name must be at least 2 characters"),
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

const StrengthForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const photoRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageName, setImageName] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [strengthId, setStrengthId] = useState(null);

  useEffect(() => {
    if (location.state && location.state.id) {
      setIsEditMode(true);
      setStrengthId(location.state.id);
      fetchStrength(location.state.id);
    }
  }, [location.state]);

  const fetchStrength = async (id) => {
    try {
      const data = await getStrengthById(id);
      formik.setValues({
        name: data.strength_name || "",
        photo: null,
        description: data.strength_description || "",
      });
      if (data.strength_image) {
        setImagePreview(
          `${import.meta.env.VITE_API_BASE_URL}${data.strength_image}`
        );
        setImageName(data.strength_image.split("/").pop());
      }
    } catch (error) {
      console.error("Error fetching strength:", error);
      Swal.fire({
        title: "Error!",
        text: error.message || "Failed to fetch strength data.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      photo: null,
      description: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("strength_name", values.name);
        formData.append("strength_description", values.description || "");
        if (values.photo) {
          formData.append("strength_image", values.photo);
        }

        let response;
        if (isEditMode) {
          response = await updateStrength(strengthId, formData);
          Swal.fire({
            title: "Strength Updated!",
            text: "The strength has been successfully updated.",
            icon: "success",
            confirmButtonText: "OK",
          });
        } else {
          response = await postStrength(formData);
          Swal.fire({
            title: "Strength Registered!",
            text: "The strength has been successfully registered.",
            icon: "success",
            confirmButtonText: "OK",
          });
        }

        if (response) {
          formik.resetForm();
          if (photoRef.current) photoRef.current.value = "";
          setImagePreview(null);
          setImageName("");
          navigate("/strength-list");
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

  document.title = "Strength Registration";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Drugs"
            breadcrumbItem={isEditMode ? "Edit Strength" : "Add Strength"}
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
                      {isEditMode ? "Edit Strength" : "Add Strength"}
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
                      {/* Strength Name */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="name"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Strength Name
                          </Label>
                          <Input
                            type="text"
                            name="name"
                            id="name"
                            placeholder="Enter strength name (e.g., 500mg)"
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

                      {/* Photo Upload */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="photo"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Photo (Optional)
                          </Label>
                          <Input
                            type="file"
                            name="photo"
                            id="photo"
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
                              alt="Strength Photo"
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

      {/* Inline CSS for hover effects */}
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

export default StrengthForm;
