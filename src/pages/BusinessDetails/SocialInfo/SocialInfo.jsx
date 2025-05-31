import React, { useState, useEffect } from "react";
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
import * as Yup from "yup";
import Breadcrumbs from "../../../components/Common/Breadcrumb"; // Adjust path as needed
import { submitSocialData, getSocialDataById, updateSocialData } from "../../../ApiService/SocialInfo/SocialInfo";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";
import { Formik, Field } from "formik";

const SocialInfo = () => {
  document.title = "Business Registration";
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location.state || {};
  console.log(id);

  const [isEdit, setIsEdit] = useState(false);
  const [socialData, setSocialData] = useState([]);

  const validationSchema = Yup.array().of(
    Yup.object().shape({
      socialPageName: Yup.string().required("Please select a Social Page Name"),
      url: Yup.string()
        .url("Invalid URL format (e.g., https://example.com)")
        .required("Please enter your URL"),
    })
  );

  const socialMediaOptions = [
    "Facebook",
    "Instagram",
    "Twitter",
    "LinkedIn",
    "YouTube",
    "Pinterest",
    "Reddit",
    "Google My Business",
    "Quora",
  ];

  useEffect(() => {
    if (id) {
      setIsEdit(true);
      const fetchData = async () => {
        try {
          const response = await getSocialDataById(id);
          const data = response?.data;
          if (data && data.social_details) {
            console.table(data.social_details.social_details);
            const updatedForms = data.social_details.social_details.map((item) => ({
              id: Date.now() + Math.random(),
              socialPageName: item.social_media_type,
              url: item.social_media_url,
            }));
            setSocialData(updatedForms);
          }
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Error fetching data for editing",
          });
        }
      };
      fetchData();
    }
  }, [id]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Social Registration" breadcrumbItem="Social Details" />
          <Row>
            <Col xs="12">
              <Card className="shadow-lg" style={{ borderRadius: "15px", overflow: "hidden" }}>
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
                      {isEdit ? "Edit Social Details" : "Add Social Details"}
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
                      <i className="bx bx-undo" style={{ fontSize: "30px" }}></i>
                    </Button>
                  </div>

                  <Formik
                    initialValues={{
                      forms: socialData.length > 0
                        ? socialData
                        : [
                            {
                              id: Date.now(),
                              socialPageName: "",
                              url: "",
                            },
                          ],
                    }}
                    validationSchema={validationSchema}
                    validateOnChange={true}
                    validateOnBlur={true}
                    enableReinitialize={true}
                    onSubmit={async (values, { setSubmitting }) => {
                      try {
                        const formattedData = values.forms.map(form => ({
                          social_media_type: form.socialPageName,
                          social_media_url: form.url,
                        }));

                        let response;
                        if (isEdit) {
                          response = await updateSocialData(id, { social_details: formattedData });
                        } else {
                          response = await submitSocialData({ social_details: formattedData });
                        }

                        if (response.status === 200 || response.status === 201) {
                          Swal.fire({
                            icon: "success",
                            title: "Success",
                            text: isEdit ? "Data Updated successfully!" : "Data submitted successfully!",
                          }).then(() => {
                            navigate("/socialinfolist");
                          });
                        }
                      } catch (error) {
                        Swal.fire({
                          icon: "error",
                          title: "Error",
                          text: error?.response?.data?.error || "An error occurred",
                        });
                      } finally {
                        setSubmitting(false);
                      }
                    }}
                  >
                    {({ values, setFieldValue, isSubmitting, errors, touched, handleSubmit, setTouched }) => (
                      <Form onSubmit={(e) => {
                        e.preventDefault();
                        // Mark all fields as touched to trigger error display
                        const newTouched = values.forms.reduce((acc, _, index) => ({
                          ...acc,
                          forms: {
                            ...acc.forms,
                            [index]: {
                              socialPageName: true,
                              url: true,
                            },
                          },
                        }), {});
                        setTouched(newTouched);
                        handleSubmit(e);
                      }}>
                        {values.forms.map((form, index) => (
                          <div key={form.id} className="border p-3 mb-4" style={{ borderRadius: "10px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
                            <Row className="g-4">
                              {/* Social Page Name */}
                              <Col md="6">
                                <FormGroup>
                                  <Label htmlFor={`forms[${index}].socialPageName`} className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                    Social Page Name <span className="text-danger">*</span>
                                  </Label>
                                  <Field
                                    as={Input}
                                    type="select"
                                    name={`forms[${index}].socialPageName`}
                                    id={`forms[${index}].socialPageName`}
                                    className={`form-control ${errors.forms?.[index]?.socialPageName && touched.forms?.[index]?.socialPageName ? "is-invalid" : ""}`}
                                    style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                                  >
                                    <option value="">Select Social Media</option>
                                    {socialMediaOptions.map((social, idx) => (
                                      <option key={idx} value={social}>
                                        {social}
                                      </option>
                                    ))}
                                  </Field>
                                  {errors.forms?.[index]?.socialPageName && touched.forms?.[index]?.socialPageName && (
                                    <div className="invalid-feedback" style={{ display: "block" }}>
                                      {errors.forms[index].socialPageName}
                                    </div>
                                  )}
                                </FormGroup>
                              </Col>

                              {/* URL */}
                              <Col md="6">
                                <FormGroup>
                                  <Label htmlFor={`forms[${index}].url`} className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                    URL <span className="text-danger">*</span>
                                  </Label>
                                  <Field
                                    as={Input}
                                    type="url"
                                    name={`forms[${index}].url`}
                                    id={`forms[${index}].url`}
                                    placeholder="Enter URL (e.g., https://example.com)"
                                    className={`form-control ${errors.forms?.[index]?.url && touched.forms?.[index]?.url ? "is-invalid" : ""}`}
                                    style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                                  />
                                  {errors.forms?.[index]?.url && touched.forms?.[index]?.url && (
                                    <div className="invalid-feedback" style={{ display: "block" }}>
                                      {errors.forms[index].url}
                                    </div>
                                  )}
                                </FormGroup>
                              </Col>

                              {/* Remove Button */}
                              {values.forms.length > 1 && (
                                <Col md="12" className="text-end">
                                  <Button
                                    color="danger"
                                    onClick={() => {
                                      const newForms = values.forms.filter((_, i) => i !== index);
                                      setFieldValue("forms", newForms.length > 0 ? newForms : [{ id: Date.now(), socialPageName: "", url: "" }]);
                                    }}
                                    style={{
                                      padding: "8px 20px",
                                      borderRadius: "8px",
                                      boxShadow: "0 4px 10px rgba(220, 53, 69, 0.3)",
                                      transition: "transform 0.3s ease",
                                    }}
                                    className="hover-scale"
                                  >
                                    Remove
                                  </Button>
                                </Col>
                              )}
                            </Row>
                          </div>
                        ))}

                        <div className="d-flex justify-content-between gap-2">
                          <Button
                            type="button"
                            color="secondary"
                            onClick={() => setFieldValue("forms", [...values.forms, { id: Date.now(), socialPageName: "", url: "" }])}
                            style={{
                              padding: "10px 25px",
                              borderRadius: "8px",
                              boxShadow: "0 4px 10px rgba(108, 117, 125, 0.3)",
                              transition: "transform 0.3s ease",
                            }}
                            className="hover-scale"
                          >
                            Add More
                          </Button>
                          <Button
                            type="submit"
                            color="primary"
                            disabled={isSubmitting}
                            style={{
                              padding: "10px 25px",
                              borderRadius: "8px",
                              boxShadow: "0 4px 10px rgba(0, 123, 255, 0.3)",
                              transition: "transform 0.3s ease",
                            }}
                            className="hover-scale"
                          >
                            {isSubmitting ? "Submitting..." : isEdit ? "Update" : "Submit"}
                          </Button>
                        </div>
                      </Form>
                    )}
                  </Formik>
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

export default SocialInfo;