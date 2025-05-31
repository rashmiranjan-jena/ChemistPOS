import React, { useState, useEffect } from "react";
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
import {
  submitAboutUs,
  getAboutUsDetails,
  updateAboutUs,
} from "../../../ApiService/AdminCms/AboutUs/AboutUs";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";

const AboutUs = () => {
  document.title = "About Us Registration";
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location.state || {};
  console.log(id);
  const [journeySteps, setJourneySteps] = useState([""]);
  const [socialLinks, setSocialLinks] = useState([{ platform: "", url: "" }]);

  useEffect(() => {
    if (id) {
      async function fetchData() {
        try {
          const response = await getAboutUsDetails(id);
          const data = response.data;

          formik.setValues({
            slogan: data.about_slogan || "",
            aboutCompany: data.about_company || "",
            founderName: data.founder_name || "",
            description: data.about_founder || "",
          });

          setJourneySteps(data.our_journey || [""]);
          setSocialLinks(
            data.social_links.map((item) => {
              const platform = Object.keys(item)[0];
              const url = item[platform];
              return { platform, url };
            })
          );
        } catch (error) {
          console.error("Error fetching data", error);
        }
      }
      fetchData();
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
      slogan: "",
      aboutCompany: "",
      companyImage: null,
      founderPhoto: null,
      founderName: "",
      description: "",
    },
    validationSchema: yup.object().shape({
      slogan: yup.string().required("Company slogan is required"),
      aboutCompany: yup.string().required("About company is required"),
      founderName: yup.string().required("Founder name is required"),
      description: yup.string().required("Description is required"),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("about_slogan", values.slogan);
      formData.append("about_company", values.aboutCompany);
      formData.append("founder_name", values.founderName);
      formData.append("about_founder", values.description);

      if (values.companyImage)
        formData.append("company_image", values.companyImage);
      if (values.founderPhoto)
        formData.append("founder_photo", values.founderPhoto);

      formData.append("our_journey", JSON.stringify(journeySteps));

      const transformedSocialLinks = socialLinks.reduce((acc, social) => {
        if (social.platform && social.url) {
          acc.push({ [social.platform]: social.url });
        }
        return acc;
      }, []);
      formData.append("social_links", JSON.stringify(transformedSocialLinks));

      try {
        let response;
        if (id) {
          // If editing, make an update API call
          response = await updateAboutUs(id, formData);
        } else {
          // If adding a new entry, make a create API call
          response = await submitAboutUs(formData);
        }

        if (response.status === 200 || response.status === 201) {
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: id
              ? "Details updated successfully!"
              : "Details submitted successfully!",
          });
          navigate("/admincms/aboutuslist");
        } else {
          throw new Error(response.data?.error || "Failed to save details.");
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.error || "Failed to submit details.",
        });
      }
    },
  });

  const socialPlatforms = [
    "Instagram",
    "LinkedIn",
    "Facebook",
    "Twitter",
    "YouTube",
  ];

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Business Information"
            breadcrumbItem={id ? "Edit Details" : "Add Details"}
          />
          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
                  <CardTitle tag="h4">Business Information</CardTitle>
                  <p className="card-title-desc mb-4">
                    Fill in the details about your business.
                  </p>

                  <Form
                    onSubmit={formik.handleSubmit}
                    autoComplete="off"
                    encType="multipart/form-data"
                  >
                    <Row>
                      <Col sm="6">
                        <FormGroup>
                          <Label>Company Slogan</Label>
                          <Input
                            type="text"
                            name="slogan"
                            {...formik.getFieldProps("slogan")}
                            invalid={
                              formik.touched.slogan && !!formik.errors.slogan
                            }
                          />
                          <FormFeedback>{formik.errors.slogan}</FormFeedback>
                        </FormGroup>
                      </Col>
                      <Col sm="6">
                        <FormGroup>
                          <Label>About Company</Label>
                          <Input
                            type="text"
                            name="aboutCompany"
                            {...formik.getFieldProps("aboutCompany")}
                            invalid={
                              formik.touched.aboutCompany &&
                              !!formik.errors.aboutCompany
                            }
                          />
                          <FormFeedback>
                            {formik.errors.aboutCompany}
                          </FormFeedback>
                        </FormGroup>
                      </Col>

                      <Col sm="6">
                        <FormGroup>
                          <Label>Company Image</Label>
                          <Input
                            type="file"
                            name="companyImage"
                            onChange={(e) =>
                              formik.setFieldValue(
                                "companyImage",
                                e.currentTarget.files[0]
                              )
                            }
                          />
                        </FormGroup>
                      </Col>
                      <Col sm="6">
                        <FormGroup>
                          <Label>Founder Name</Label>
                          <Input
                            type="text"
                            name="founderName"
                            {...formik.getFieldProps("founderName")}
                            invalid={
                              formik.touched.founderName &&
                              !!formik.errors.founderName
                            }
                          />
                          <FormFeedback>
                            {formik.errors.founderName}
                          </FormFeedback>
                        </FormGroup>
                      </Col>
                      <Col sm="6">
                        <FormGroup>
                          <Label>Founder Image</Label>
                          <Input
                            type="file"
                            name="founderPhoto"
                            onChange={(e) =>
                              formik.setFieldValue(
                                "founderPhoto",
                                e.currentTarget.files[0]
                              )
                            }
                          />
                        </FormGroup>
                      </Col>

                      <Col sm="12">
                        <FormGroup>
                          <Label>Founder Description</Label>
                          <Input
                            type="textarea"
                            name="description"
                            rows="3"
                            {...formik.getFieldProps("description")}
                            invalid={
                              formik.touched.description &&
                              !!formik.errors.description
                            }
                          />
                          <FormFeedback>
                            {formik.errors.description}
                          </FormFeedback>
                        </FormGroup>
                      </Col>
                    </Row>

                    {/* Social Links Section */}
                    <Row className="mt-4">
                      <Col xs="12">
                        <h5>Social Links</h5>
                        {socialLinks.map((social, index) => (
                          <Row key={index} className="mb-2 align-items-center">
                            <Col sm="4">
                              <Input
                                type="select"
                                value={social.platform}
                                onChange={(e) =>
                                  handleSocialChange(
                                    index,
                                    "platform",
                                    e.target.value
                                  )
                                }
                              >
                                <option value="">Select Platform</option>
                                {socialPlatforms.map((platform, i) => (
                                  <option key={i} value={platform}>
                                    {platform}
                                  </option>
                                ))}
                              </Input>
                            </Col>
                            <Col sm="6">
                              {social.platform && (
                                <Input
                                  type="url"
                                  placeholder={`Enter ${social.platform} link`}
                                  value={social.url}
                                  onChange={(e) =>
                                    handleSocialChange(
                                      index,
                                      "url",
                                      e.target.value
                                    )
                                  }
                                />
                              )}
                            </Col>
                            <Col sm="2">
                              <Button
                                color="danger"
                                onClick={() => handleRemoveSocial(index)}
                              >
                                Remove
                              </Button>
                            </Col>
                          </Row>
                        ))}
                        <Button color="success" onClick={handleAddSocial}>
                          Add Social Link
                        </Button>
                      </Col>
                    </Row>

                    {/* Journey Steps */}
                    <Row className="mt-4">
                      <Col xs="12">
                        <h5>Our Journey</h5>
                        {journeySteps.map((step, index) => (
                          <Row key={index} className="mb-2">
                            <Col sm="10">
                              <Input
                                type="text"
                                placeholder="Journey Step"
                                value={step}
                                onChange={(e) =>
                                  handleJourneyStepChange(index, e.target.value)
                                }
                              />
                            </Col>
                            <Col sm="2">
                              <Button
                                color="danger"
                                onClick={() => handleRemoveJourneyStep(index)}
                              >
                                Remove
                              </Button>
                            </Col>
                          </Row>
                        ))}
                        <Button color="success" onClick={handleAddJourneyStep}>
                          Add Journey Step
                        </Button>
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

export default AboutUs;
