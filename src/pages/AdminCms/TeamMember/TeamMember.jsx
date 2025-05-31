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
  addTeamMember,
  getTeamMemberByID,
  editTeamMemberbyID,
} from "../../../ApiService/AdminCms/TeamMember/TeamMember";

const TeamMember = () => {
  document.title = "Add Team Member";
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location.state || {};
  const [socialLinks, setSocialLinks] = useState([{ platform: "", url: "" }]);
  const [existingImage, setExistingImage] = useState(null);
  const photoRef = useRef(null);

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

  useEffect(() => {
    if (id) {
      const fetchTeamMember = async () => {
        try {
          const response = await getTeamMemberByID(id);
          formik.setValues({
            teamMemberName: response.member_name,
            photo: null,
            designation: response.designation,
          });
          setExistingImage(
            `${import.meta.env.VITE_API_BASE_URL}${response.member_image}`
          );

          setSocialLinks(response.social_links || [{ platform: "", url: "" }]);
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text:
              error.message ||
              "An error occurred while fetching the team member.",
          });
        }
      };
      fetchTeamMember();
    }
  }, [id]);
  const formik = useFormik({
    initialValues: {
      teamMemberName: "",
      photo: null,
      designation: "",
    },
    validationSchema: yup.object().shape({
      teamMemberName: yup.string().required("Team member name is required"),
      designation: yup.string().required("Designation is required"),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("member_name", values.teamMemberName);
      if (values.photo) {
        formData.append("member_image", values.photo);
      } else if (existingImage) {
        const response = await fetch(existingImage);
        const blob = await response.blob();
        formData.append("member_image", blob, "existing_image.jpg");
      }
      formData.append("designation", values.designation);
      formData.append("social_links", JSON.stringify(socialLinks));

      try {
        let response;
        if (id) {
          response = await editTeamMemberbyID(id, formData);
          Swal.fire({
            icon: "success",
            title: "Team Member Updated!",
            text: response.message || "Team member has been successfully updated.",
          });
        } else {
          response = await addTeamMember(formData);
          Swal.fire({
            icon: "success",
            title: "Team Member Added!",
            text: response.message || "Team member has been successfully added.",
          });
        }
        formik.resetForm();
        photoRef.current.value = "";
        setSocialLinks([{ platform: "", url: "" }]);
        navigate("/admincms/teammemberlist");
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message || "An error occurred while submitting the team member.",
        });
      }
    },
  });

  const socialPlatforms = [
    "LinkedIn",
    "Twitter",
    "Facebook",
    "Instagram",
    "GitHub",
  ];

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Team Member" breadcrumbItem="Add Team Member" />
          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
                  <CardTitle tag="h4">Team Member Information</CardTitle>
                  <p className="card-title-desc mb-4">
                    Fill in the details about the team member.
                  </p>

                  <Form
                    onSubmit={formik.handleSubmit}
                    autoComplete="off"
                    encType="multipart/form-data"
                  >
                    <Row>
                      <Col sm="6">
                        <FormGroup>
                          <Label>Team Member Name</Label>
                          <Input
                            type="text"
                            name="teamMemberName"
                            {...formik.getFieldProps("teamMemberName")}
                            invalid={
                              formik.touched.teamMemberName &&
                              !!formik.errors.teamMemberName
                            }
                          />
                          <FormFeedback>
                            {formik.errors.teamMemberName}
                          </FormFeedback>
                        </FormGroup>
                      </Col>
                      <Col sm="6">
                        <FormGroup>
                          <Label>Photo</Label>
                          <Input
                            type="file"
                            name="photo"
                            ref={photoRef}
                            onChange={(e) =>
                              formik.setFieldValue(
                                "photo",
                                e.currentTarget.files[0]
                              )
                            }
                            invalid={
                              formik.touched.photo && !!formik.errors.photo
                            }
                          />
                          <FormFeedback>{formik.errors.photo}</FormFeedback>
                          {existingImage && !formik.values.photo && (
                            <div className="mt-2">
                              <img
                                src={existingImage}
                                alt="Existing Team Member"
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
                    </Row>

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

                    {/* Submit Button */}
                    <div className="d-flex flex-wrap gap-2 mt-4">
                      <Button type="submit" color="primary">
                        Submit
                      </Button>
                      <Button
                        type="button"
                        color="secondary"
                        onClick={() => {
                          formik.resetForm();
                          photoRef.current.value = "";
                          setSocialLinks([{ platform: "", url: "" }]);
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

export default TeamMember;
