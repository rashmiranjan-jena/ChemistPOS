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
  postGroupDisease,
  getGroupDiseaseById,
  updateGroupDisease,
} from "../../../ApiService/Drugs/GroupDisease";
import Swal from "sweetalert2";

const validationSchema = Yup.object().shape({
  groupDiseaseName: Yup.string()
    .required("Please enter the Group Disease Name")
    .min(2, "Name must be at least 2 characters"),
  description: Yup.string().min(
    5,
    "Description must be at least 5 characters if provided"
  ),
});

const GroupDiseaseForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const photoRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageName, setImageName] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [groupDiseaseId, setGroupDiseaseId] = useState(null);

  useEffect(() => {
    if (location.state && location.state.id) {
      setIsEditMode(true);
      setGroupDiseaseId(location.state.id);
      fetchGroupDisease(location.state.id);
    }
  }, [location.state]);

  const fetchGroupDisease = async (id) => {
    try {
      const data = await getGroupDiseaseById(id);
      formik.setValues({
        groupDiseaseName: data.group_disease_name || "",
        photo: null,
        description: data.group_disease_description || "",
      });
      if (data.group_disease_image) {
        setImagePreview(
          `${import.meta.env.VITE_API_BASE_URL}${data.group_disease_image}`
        );
        setImageName(data.group_disease_image.split("/").pop());
      }
    } catch (error) {
      console.error("Error fetching group disease:", error);
      Swal.fire({
        title: "Error!",
        text: error.message || "Failed to fetch group disease data.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const formik = useFormik({
    initialValues: {
      groupDiseaseName: "",
      photo: null,
      description: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("group_disease_name", values.groupDiseaseName);
        if (values.photo) {
          formData.append("group_disease_image", values.photo);
        }
        formData.append("group_disease_description", values.description || "");

        let response;
        if (isEditMode) {
          response = await updateGroupDisease(groupDiseaseId, formData);
          Swal.fire({
            title: "Group Disease Updated!",
            text: "The group disease has been successfully updated.",
            icon: "success",
            confirmButtonText: "OK",
          });
        } else {
          response = await postGroupDisease(formData);
          Swal.fire({
            title: "Group Disease Registered!",
            text: "The group disease has been successfully registered.",
            icon: "success",
            confirmButtonText: "OK",
          });
        }

        if (response) {
          formik.resetForm();
          if (photoRef.current) photoRef.current.value = "";
          setImagePreview(null);
          setImageName("");
          navigate("/group-disease-list");
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

  document.title = "Group Disease";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Drugs"
            breadcrumbItem={
              isEditMode ? "Edit Group Disease" : "Add Group Disease"
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
                      {isEditMode ? "Edit Group Disease" : "Add Group Disease"}
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
                      {/* Group Disease Name */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="groupDiseaseName"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Group Disease Name
                          </Label>
                          <Input
                            type="text"
                            name="groupDiseaseName"
                            id="groupDiseaseName"
                            placeholder="Enter group disease name"
                            value={formik.values.groupDiseaseName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.groupDiseaseName &&
                              formik.errors.groupDiseaseName
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.touched.groupDiseaseName &&
                            formik.errors.groupDiseaseName && (
                              <div className="invalid-feedback">
                                {formik.errors.groupDiseaseName}
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
                              alt="Group Disease Photo"
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
                            placeholder="Enter description (optional)"
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
          boxshadow: 0 0 8px rgba(0, 123, 255, 0.3);
        }
        .invalid-feedback {
          fontsize: 12px;
          color: #dc3545;
        }
      `}</style>
    </React.Fragment>
  );
};

export default GroupDiseaseForm;
