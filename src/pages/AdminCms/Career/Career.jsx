import React, { useState, useEffect } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  Input,
  Label,
  Row,
  FormFeedback,
} from "reactstrap";
import * as yup from "yup";
import { useFormik } from "formik";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useNavigate, useLocation } from "react-router-dom";
import {
  createJob,
  getJobById,
  updateJob,
} from "../../../ApiService/Career/Career";
import Swal from "sweetalert2";

const Career = () => {
  document.title = "Job Registration";
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location.state || {};
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      job_title: "",
      total_opening: "",
      job_description: "",
      job_responsibility: "",
      start_date: "",
      end_date: "",
      location: "",
      experience: "",
    },
    validationSchema: yup.object().shape({
      job_title: yup.string().required("Please enter the Job Role"),
      total_opening: yup
        .number()
        .required("Please enter the total number of openings")
        .positive("Total openings must be a positive number")
        .integer("Total openings must be an integer"),
      job_description: yup
        .string()
        .required("Please enter the Job Description"),
      job_responsibility: yup
        .string()
        .required("Please enter the Job Responsibilities"),
      start_date: yup.date().required("Please enter the Starting Date"),
      end_date: yup
        .date()
        .min(
          yup.ref("start_date"),
          "Ending date cannot be earlier than the starting date"
        )
        .required("Please enter the Ending Date"),
      location: yup.string().required("Please enter the Location"),
      experience: yup
        .number()
        .required("Please enter the Experience required (in years)")
        .positive("Experience must be a positive number")
        .integer("Experience must be an integer"),
    }),
    onSubmit: async (values) => {
      try {
        let response;
        if (id) {
          response = await updateJob(id, values);
          Swal.fire({
            icon: "success",
            title: "Updated!",
            text: "Job details updated successfully.",
            confirmButtonText: "OK",
          });
        } else {
          // Create a new job
          response = await createJob(values);
          Swal.fire({
            icon: "success",
            title: "Created!",
            text: "Job details added successfully!",
            confirmButtonText: "OK",
          });
        }
        formik.resetForm();
        navigate("/careerlist");
      } catch (error) {
        console.error("Error submitting form:", error);
        const errorMessage =
          error.response?.data?.message ||
          "Failed to save job details. Please try again.";
        Swal.fire({
          icon: "error",
          title: "Error",
          text: errorMessage,
          confirmButtonText: "Retry",
        });
      }
    },
  });

  useEffect(() => {
    if (id) {
      setLoading(true);
      getJobById(id)
        .then((response) => {
          const jobData = response.data;
          formik.setValues({
            job_title: jobData.job_title || "",
            total_opening: jobData.total_opening || "",
            job_description: jobData.job_description || "",
            job_responsibility: jobData.job_responsibility || "",
            start_date: jobData.start_date || "",
            end_date: jobData.end_date || "",
            location: jobData.location || "",
            experience: jobData.experience || "",
          });
        })
        .catch((error) => {
          console.error("Error fetching job details:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to fetch job details.",
          });
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Breadcrumb */}
          <Breadcrumbs
            title="Job Registration"
            breadcrumbItem={id ? "Edit Job Details" : "Add Job Details"}
          />

          <Row>
            <Col sm="6">
              <div className="mb-3">
                <Label htmlFor="job_title">Job Role</Label>
                <Input
                  id="job_title"
                  name="job_title"
                  type="text"
                  value={formik.values.job_title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  invalid={formik.touched.job_title && formik.errors.job_title}
                />
                {formik.touched.job_title && formik.errors.job_title && (
                  <FormFeedback>{formik.errors.job_title}</FormFeedback>
                )}
              </div>

              <div className="mb-3">
                <Label htmlFor="total_opening">Total Opening</Label>
                <Input
                  id="total_opening"
                  name="total_opening"
                  type="number"
                  value={formik.values.total_opening}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  invalid={
                    formik.touched.total_opening && formik.errors.total_opening
                  }
                />
                {formik.touched.total_opening &&
                  formik.errors.total_opening && (
                    <FormFeedback>{formik.errors.total_opening}</FormFeedback>
                  )}
              </div>

              <div className="mb-3">
                <Label htmlFor="job_description">Job Description</Label>
                <Input
                  id="job_description"
                  name="job_description"
                  type="textarea"
                  value={formik.values.job_description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  invalid={
                    formik.touched.job_description &&
                    formik.errors.job_description
                  }
                />
                {formik.touched.job_description &&
                  formik.errors.job_description && (
                    <FormFeedback>{formik.errors.job_description}</FormFeedback>
                  )}
              </div>

              {/* Job Responsibility Field */}
              <div className="mb-3">
                <Label htmlFor="job_responsibility">Job Responsibility</Label>
                <Input
                  id="job_responsibility"
                  name="job_responsibility"
                  type="textarea"
                  value={formik.values.job_responsibility}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  invalid={
                    formik.touched.job_responsibility &&
                    formik.errors.job_responsibility
                  }
                />
                {formik.touched.job_responsibility &&
                  formik.errors.job_responsibility && (
                    <FormFeedback>
                      {formik.errors.job_responsibility}
                    </FormFeedback>
                  )}
              </div>

              <div className="mb-3">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  type="text"
                  value={formik.values.location}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  invalid={formik.touched.location && formik.errors.location}
                />
                {formik.touched.location && formik.errors.location && (
                  <FormFeedback>{formik.errors.location}</FormFeedback>
                )}
              </div>

              <div className="mb-3">
                <Label htmlFor="experience">Experience (in years)</Label>
                <Input
                  id="experience"
                  name="experience"
                  type="number"
                  value={formik.values.experience}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  invalid={
                    formik.touched.experience && formik.errors.experience
                  }
                />
                {formik.touched.experience && formik.errors.experience && (
                  <FormFeedback>{formik.errors.experience}</FormFeedback>
                )}
              </div>
            </Col>

            <Col sm="6">
              <div className="mb-3">
                <Label htmlFor="start_date">Starting Date</Label>
                <Input
                  id="start_date"
                  name="start_date"
                  type="date"
                  value={formik.values.start_date}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  invalid={
                    formik.touched.start_date && formik.errors.start_date
                  }
                />
                {formik.touched.start_date && formik.errors.start_date && (
                  <FormFeedback>{formik.errors.start_date}</FormFeedback>
                )}
              </div>

              <div className="mb-3">
                <Label htmlFor="end_date">Ending Date</Label>
                <Input
                  id="end_date"
                  name="end_date"
                  type="date"
                  value={formik.values.end_date}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  invalid={formik.touched.end_date && formik.errors.end_date}
                />
                {formik.touched.end_date && formik.errors.end_date && (
                  <FormFeedback>{formik.errors.end_date}</FormFeedback>
                )}
              </div>
            </Col>
          </Row>

          <div className="d-flex flex-wrap gap-2">
            <Button type="submit" color="primary" onClick={formik.handleSubmit}>
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
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Career;
