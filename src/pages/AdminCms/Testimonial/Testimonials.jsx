import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  FormFeedback,
} from "reactstrap";
import * as yup from "yup";
import { useFormik } from "formik";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";
import {
  addTestimonial,
  editTestimonialsbyID,
  getTestimonialByID,
} from "../../../ApiService/AdminCms/Testimonials/Testimonials";

const Testimonials = () => {
  document.title = "Add/Edit Testimonial";
  const location = useLocation();
  const { id } = location.state || {};
  const navigate = useNavigate();
  const [journeySteps, setJourneySteps] = useState([""]);
  const [socialLinks, setSocialLinks] = useState([{ platform: "", url: "" }]);
  const [existingImage, setExistingImage] = useState(null);

  const testimonialImageRef = useRef(null);

  useEffect(() => {
    if (id) {
      const fetchTestimonial = async () => {
        try {
          const response = await editTestimonialsbyID(id);
          formik.setValues({
            testimonialName: response.testimoni_name,
            testimonialImage: null,
            designation: response.designation,
            testimonial: response.testimonial,
            date: response.date,
          });
          setExistingImage(
            `${import.meta.env.VITE_API_BASE_URL}${response.testimoni_image}`
          );
          setJourneySteps(response.journeySteps || [""]);
          setSocialLinks(response.socialLinks || [{ platform: "", url: "" }]);
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text:
              error.message ||
              "An error occurred while fetching the testimonial.",
          });
        }
      };
      fetchTestimonial();
    }
  }, [id]);

  const handleAddJourneyStep = () => {
    setJourneySteps([...journeySteps, ""]);
  };

  const handleRemoveJourneyStep = (index) => {
    setJourneySteps(journeySteps.filter((_, i) => i !== index));
  };

  const handleJourneyStepChange = (index, value) => {
    const updatedSteps = [...journeySteps];
    updatedSteps[index] = value;
    setJourneySteps(updatedSteps);
  };

  const handleAddSocial = () => {
    setSocialLinks([...socialLinks, { platform: "", url: "" }]);
  };

  const handleRemoveSocial = (index) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  const handleSocialChange = (index, field, value) => {
    const updatedSocials = [...socialLinks];
    updatedSocials[index][field] = value;
    setSocialLinks(updatedSocials);
  };

  const formik = useFormik({
    initialValues: {
      testimonialName: "",
      testimonialImage: null,
      designation: "",
      testimonial: "",
      date: "",
    },
    validationSchema: yup.object().shape({
      testimonialName: yup.string().required("Testimonial name is required"),
      designation: yup.string().required("Designation is required"),
      testimonial: yup.string().required("Testimonial content is required"),
      date: yup.date().required("Date is required"),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("testimoni_name", values.testimonialName);
      if (values.testimonialImage) {
        formData.append("testimoni_image", values.testimonialImage);
      }

      formData.append("designation", values.designation);
      formData.append("testimonial", values.testimonial);
      formData.append("date", values.date);

      try {
        let response;
        if (id) {
          response = await getTestimonialByID(id, formData);
          Swal.fire({
            icon: "success",
            title: "Testimonial Updated!",
            text:
              response.message || "Testimonial has been successfully updated.",
          });
        } else {
          response = await addTestimonial(formData);
          Swal.fire({
            icon: "success",
            title: "Testimonial Added!",
            text:
              response.message || "Testimonial has been successfully added.",
          });
        }
        formik.resetForm();
        testimonialImageRef.current.value = "";
        navigate("/admincms/testimoniallist");
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            error.message ||
            "An error occurred while submitting the testimonial.",
        });
      }
    },
  });

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Testimonial"
            breadcrumbItem={id ? "Edit Testimonial" : "Add Testimonial"}
          />
          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
                  <CardTitle tag="h4">Testimonial Information</CardTitle>
                  <p className="card-title-desc mb-4">
                    Fill in the details about the testimonial.
                  </p>

                  <Form
                    onSubmit={formik.handleSubmit}
                    autoComplete="off"
                    encType="multipart/form-data"
                  >
                    <Row>
                      <Col sm="6">
                        <FormGroup>
                          <Label>Testimonial Name</Label>
                          <Input
                            type="text"
                            name="testimonialName"
                            {...formik.getFieldProps("testimonialName")}
                            invalid={
                              formik.touched.testimonialName &&
                              !!formik.errors.testimonialName
                            }
                          />
                          <FormFeedback>
                            {formik.errors.testimonialName}
                          </FormFeedback>
                        </FormGroup>
                      </Col>
                      <Col sm="6">
                        <FormGroup>
                          <Label>Testimonial Image</Label>
                          <Input
                            type="file"
                            name="testimonialImage"
                            ref={testimonialImageRef}
                            onChange={(e) =>
                              formik.setFieldValue(
                                "testimonialImage",
                                e.currentTarget.files[0]
                              )
                            }
                          />

                          <FormFeedback>
                            {formik.errors.testimonialImage}
                          </FormFeedback>
                          {existingImage && !formik.values.testimonialImage && (
                            <div className="mt-2">
                              <img
                                src={existingImage}
                                alt="Existing Testimonial"
                                width="100"
                              />
                            </div>
                          )}
                        </FormGroup>
                      </Col>

                      <Col sm="6">
                        <FormGroup>
                          <Label>Designation</Label>
                          <Input
                            type="text"
                            name="designation"
                            {...formik.getFieldProps("designation")}
                            invalid={
                              formik.touched.designation &&
                              !!formik.errors.designation
                            }
                          />
                          <FormFeedback>
                            {formik.errors.designation}
                          </FormFeedback>
                        </FormGroup>
                      </Col>

                      <Col sm="6">
                        <FormGroup>
                          <Label>Testimonial</Label>
                          <Input
                            type="textarea"
                            name="testimonial"
                            rows="3"
                            {...formik.getFieldProps("testimonial")}
                            invalid={
                              formik.touched.testimonial &&
                              !!formik.errors.testimonial
                            }
                          />
                          <FormFeedback>
                            {formik.errors.testimonial}
                          </FormFeedback>
                        </FormGroup>
                      </Col>

                      <Col sm="6">
                        <FormGroup>
                          <Label>Date</Label>
                          <Input
                            type="date"
                            name="date"
                            {...formik.getFieldProps("date")}
                            invalid={
                              formik.touched.date && !!formik.errors.date
                            }
                          />
                          <FormFeedback>{formik.errors.date}</FormFeedback>
                        </FormGroup>
                      </Col>
                    </Row>

                    {/* Submit Button */}
                    <div className="d-flex flex-wrap gap-2 mt-4">
                      <Button type="submit" color="primary">
                        {id ? "Update" : "Submit"}
                      </Button>
                      <Button
                        type="button"
                        color="secondary"
                        onClick={() => {
                          formik.resetForm();
                          testimonialImageRef.current.value = "";
                          setJourneySteps([""]);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Testimonials;
