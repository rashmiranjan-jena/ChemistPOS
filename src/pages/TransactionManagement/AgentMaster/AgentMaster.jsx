import React, { useState, useEffect } from "react";
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
} from "reactstrap";
import * as yup from "yup";
import { useFormik } from "formik";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import {
  postAgentData,
  getAgentById,
  updateAgentData,
} from "../../../ApiService/TransationManagement/AgentMaster";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const AgentMaster = () => {
  document.title = "Agent Registration";
  const navigate = useNavigate();
  const [villages, setVillages] = useState([""]);
  const [areas, setAreas] = useState([""]);
  const location = useLocation();
  const { id } = location.state || {};
  const [agentPhotoPreview, setAgentPhotoPreview] = useState("");
const [adharPhotoPreview, setAdharPhotoPreview] = useState("");
const [dlPhotoPreview, setDlPhotoPreview] = useState("");

  const formik = useFormik({
    initialValues: {
      agentName: "",
      agentDob: "",
      agentJoiningDate: "",
      agentMobileNumber: "",
      agentAddress: "",
      agentPhoto: null,
      agentAadharNumber: "",
      agentAadharPhoto: null,
      agentDrivingLicensePhoto: null,
      state: "",
      district: "",
      city: "",
      pincode: "",
      villages: "",
      areas: "",
    },
    validationSchema: yup.object().shape({
      agentName: yup.string().required("Please enter agent's name"),
      agentDob: yup.date().required("Please enter agent's date of birth"),
      agentJoiningDate: yup
        .date()
        .required("Please enter agent's joining date"),
      agentMobileNumber: yup
        .string()
        .matches(/^[0-9]{10}$/, "Please enter a valid mobile number")
        .required("Please enter agent's mobile number"),
      agentAddress: yup.string().required("Please enter agent's address"),
      agentAadharNumber: yup
        .string()
        .matches(/^[0-9]{12}$/, "Please enter a valid Aadhar number")
        .required("Please enter agent's Aadhar number"),
      state: yup.string().required("Please enter the state"),
      district: yup.string().required("Please enter the district"),
      city: yup.string().required("Please enter the city"),
      pincode: yup
        .string()
        .matches(/^[0-9]{6}$/, "Please enter a valid pincode")
        .required("Please enter the pincode"),
    }),
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append("agent_name", values.agentName);
      formData.append("dob", values.agentDob);
      formData.append("doj", values.agentJoiningDate);
      formData.append("mob_no", values.agentMobileNumber);
      formData.append("address", values.agentAddress);
      formData.append("adhar_no", values.agentAadharNumber);
      formData.append("state", values.state);
      formData.append("district", values.district);
      formData.append("city", values.city);
      formData.append("pincode", values.pincode);
      formData.append("villages", JSON.stringify(villages));
      formData.append("areas", JSON.stringify(areas));
      if (values.agentPhoto) formData.append("agent_photo", values.agentPhoto);
      if (values.agentAadharPhoto)
        formData.append("adhar_photo", values.agentAadharPhoto);
      if (values.agentDrivingLicensePhoto)
        formData.append("dl_photo", values.agentDrivingLicensePhoto);

      if (id) {
        // Update existing agent
        updateAgentData(id, formData)
          .then((response) => {
            console.log("Agent Updated Successfully", response);
            Swal.fire({
              icon: "success",
              title: "Agent Updated Successfully",
              text: "The agent details have been updated successfully!",
            });
            navigate("/agentlist");
          })
          .catch((error) => {
            console.error("Error in form submission", error);
            const errorMessage =
              error?.response?.data?.error ||
              "Failed to update agent. Please try again.";
            Swal.fire({
              icon: "error",
              title: errorMessage,
              text: "There was an error while updating the agent. Please try again.",
            });
          });
      } else {
        // Create new agent
        postAgentData(formData)
          .then((response) => {
            console.log("Form Submitted Successfully", response);
            Swal.fire({
              icon: "success",
              title: "Agent Registered Successfully",
              text: "The agent details have been submitted successfully!",
            });
            formik.resetForm();
            navigate("/agentlist");
          })
          .catch((error) => {
            console.error("Error in form submission", error);
            const errorMessage =
              error?.response?.data?.error ||
              "Failed to submit agent. Please try again.";
            Swal.fire({
              icon: "error",
              title: errorMessage,
              text: "There was an error while submitting the form. Please try again.",
            });
          });
      }
    },
  });

  useEffect(() => {
    if (id) {
      getAgentById(id)
        .then((response) => {
          const agentData = response.data;

          const formatDate = (isoDate) => {
            const date = new Date(isoDate);
            return date.toISOString().split("T")[0];
          };
          if (agentData.agent_photo) {
            setAgentPhotoPreview(
              `${import.meta.env.VITE_API_BASE_URL}${agentData.agent_photo}`
            );
          }
          if (agentData.adhar_photo) {
            setAdharPhotoPreview(
              `${import.meta.env.VITE_API_BASE_URL}${agentData.adhar_photo}`
            );
          }
          if (agentData.dl_photo) {
            setDlPhotoPreview(
              `${import.meta.env.VITE_API_BASE_URL}${agentData.dl_photo}`
            );
          }

          // Set other form values
          formik.setValues({
            agentName: agentData.agent_name,
            agentDob: formatDate(agentData.dob),
            agentJoiningDate: formatDate(agentData.doj),
            agentMobileNumber: agentData.mob_no.toString(),
            agentAddress: agentData.address,
            agentAadharNumber: agentData.adhar_no.toString(),
            state: agentData.state,
            district: agentData.district,
            city: agentData.city,
            pincode: agentData.pincode,
            villages: agentData.villages,
            areas: agentData.areas,
          });

          setVillages(agentData.villages);
          setAreas(agentData.areas);
        })
        .catch((error) => {
          console.error("Error fetching agent data:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to fetch agent data. Please try again.",
          });
        });
    }
  }, [id]);

  const fetchLocationData = async (pincode) => {
    if (pincode.length === 6) {
      try {
        const response = await axios.get(
          `https://api.postalpincode.in/pincode/${pincode}`
        );
        if (response.data[0].Status === "Success") {
          const postOffice = response.data[0].PostOffice[0];
          formik.setValues({
            ...formik.values,
            state: postOffice.State,
            district: postOffice.District,
            pincode,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Invalid Pincode",
            text: "Please enter a valid pincode.",
          });
          formik.setValues({ ...formik.values, state: "", district: "" });
        }
      } catch (error) {
        console.error("Error fetching pincode data:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch location data. Please try again.",
        });
      }
    }
  };

  const handleFileChange = (e, fieldName) => {
    formik.setFieldValue(fieldName, e.target.files[0]);
  };

  const addVillage = () => setVillages([...villages, ""]);
  const removeVillage = (index) =>
    setVillages(villages.filter((_, i) => i !== index));
  const handleVillageChange = (index, value) => {
    const newVillages = [...villages];
    newVillages[index] = value;
    setVillages(newVillages);
  };

  const addArea = () => setAreas([...areas, ""]);
  const removeArea = (index) => setAreas(areas.filter((_, i) => i !== index));
  const handleAreaChange = (index, value) => {
    const newAreas = [...areas];
    newAreas[index] = value;
    setAreas(newAreas);
  };
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Breadcrumb */}
          <Breadcrumbs title="Agent Registration" breadcrumbItem="Add Agent" />

          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
                  <CardTitle tag="h4">Agent Information</CardTitle>
                  <p className="card-title-desc mb-4">
                    Fill out the fields below to register your agent.
                  </p>

                  <Form onSubmit={formik.handleSubmit} autoComplete="off">
                    <Row>
                      <Col sm="6">
                        <div className="mb-3">
                          <Label htmlFor="agentName">Agent Name</Label>
                          <Input
                            id="agentName"
                            name="agentName"
                            type="text"
                            value={formik.values.agentName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={
                              formik.touched.agentName &&
                              formik.errors.agentName
                            }
                          />
                          {formik.touched.agentName &&
                            formik.errors.agentName && (
                              <FormFeedback>
                                {formik.errors.agentName}
                              </FormFeedback>
                            )}
                        </div>

                        <div className="mb-3">
                          <Label htmlFor="agentDob">Date of Birth</Label>
                          <Input
                            id="agentDob"
                            name="agentDob"
                            type="date"
                            value={formik.values.agentDob}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={
                              formik.touched.agentDob && formik.errors.agentDob
                            }
                          />
                          {formik.touched.agentDob &&
                            formik.errors.agentDob && (
                              <FormFeedback>
                                {formik.errors.agentDob}
                              </FormFeedback>
                            )}
                        </div>

                        <div className="mb-3">
                          <Label htmlFor="agentJoiningDate">Joining Date</Label>
                          <Input
                            id="agentJoiningDate"
                            name="agentJoiningDate"
                            type="date"
                            value={formik.values.agentJoiningDate}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={
                              formik.touched.agentJoiningDate &&
                              formik.errors.agentJoiningDate
                            }
                          />
                          {formik.touched.agentJoiningDate &&
                            formik.errors.agentJoiningDate && (
                              <FormFeedback>
                                {formik.errors.agentJoiningDate}
                              </FormFeedback>
                            )}
                        </div>

                        <div className="mb-3">
                          <Label htmlFor="agentMobileNumber">
                            Mobile Number
                          </Label>
                          <Input
                            id="agentMobileNumber"
                            name="agentMobileNumber"
                            type="text"
                            value={formik.values.agentMobileNumber}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={
                              formik.touched.agentMobileNumber &&
                              formik.errors.agentMobileNumber
                            }
                          />
                          {formik.touched.agentMobileNumber &&
                            formik.errors.agentMobileNumber && (
                              <FormFeedback>
                                {formik.errors.agentMobileNumber}
                              </FormFeedback>
                            )}
                        </div>

                        <div className="mb-3">
                          <Label htmlFor="agentAddress">Address</Label>
                          <Input
                            id="agentAddress"
                            name="agentAddress"
                            type="text"
                            value={formik.values.agentAddress}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={
                              formik.touched.agentAddress &&
                              formik.errors.agentAddress
                            }
                          />
                          {formik.touched.agentAddress &&
                            formik.errors.agentAddress && (
                              <FormFeedback>
                                {formik.errors.agentAddress}
                              </FormFeedback>
                            )}
                        </div>

                        <div className="mb-3">
                          <Label htmlFor="agentPhoto">Agent Photo</Label>
                          {agentPhotoPreview && (
                            <div className="mb-2">
                              <img
                                src={agentPhotoPreview}
                                alt="Agent Photo Preview"
                                style={{
                                  width: "100px",
                                  height: "100px",
                                  objectFit: "cover",
                                }}
                              />
                              <Button
                                color="danger"
                                size="sm"
                                onClick={() => {
                                  setAgentPhotoPreview("");
                                  formik.setFieldValue("agentPhoto", null);
                                }}
                                className="ms-2"
                              >
                                Remove
                              </Button>
                            </div>
                          )}
                          <Input
                            id="agentPhoto"
                            name="agentPhoto"
                            type="file"
                            onChange={(e) => handleFileChange(e, "agentPhoto")}
                          />
                        </div>

                        <div className="mb-3">
                          <Label htmlFor="agentAadharNumber">
                            Aadhar Number
                          </Label>
                          <Input
                            id="agentAadharNumber"
                            name="agentAadharNumber"
                            type="text"
                            value={formik.values.agentAadharNumber}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={
                              formik.touched.agentAadharNumber &&
                              formik.errors.agentAadharNumber
                            }
                          />
                          {formik.touched.agentAadharNumber &&
                            formik.errors.agentAadharNumber && (
                              <FormFeedback>
                                {formik.errors.agentAadharNumber}
                              </FormFeedback>
                            )}
                        </div>

                        <div className="mb-3">
                          <Label htmlFor="agentAadharPhoto">Aadhar Photo</Label>
                          {adharPhotoPreview && (
                            <div className="mb-2">
                              <img
                                src={adharPhotoPreview}
                                alt="Aadhar Photo Preview"
                                style={{
                                  width: "100px",
                                  height: "100px",
                                  objectFit: "cover",
                                }}
                              />
                              <Button
                                color="danger"
                                size="sm"
                                onClick={() => {
                                  setAdharPhotoPreview("");
                                  formik.setFieldValue(
                                    "agentAadharPhoto",
                                    null
                                  );
                                }}
                                className="ms-2"
                              >
                                Remove
                              </Button>
                            </div>
                          )}
                          <Input
                            id="agentAadharPhoto"
                            name="agentAadharPhoto"
                            type="file"
                            onChange={(e) =>
                              handleFileChange(e, "agentAadharPhoto")
                            }
                          />
                        </div>

                        <div className="mb-3">
                          <Label htmlFor="agentDrivingLicensePhoto">
                            Driving License Photo
                          </Label>
                          {dlPhotoPreview && (
                            <div className="mb-2">
                              <img
                                src={dlPhotoPreview}
                                alt="Driving License Photo Preview"
                                style={{
                                  width: "100px",
                                  height: "100px",
                                  objectFit: "cover",
                                }}
                              />
                              <Button
                                color="danger"
                                size="sm"
                                onClick={() => {
                                  setDlPhotoPreview("");
                                  formik.setFieldValue(
                                    "agentDrivingLicensePhoto",
                                    null
                                  );
                                }}
                                className="ms-2"
                              >
                                Remove
                              </Button>
                            </div>
                          )}
                          <Input
                            id="agentDrivingLicensePhoto"
                            name="agentDrivingLicensePhoto"
                            type="file"
                            onChange={(e) =>
                              handleFileChange(e, "agentDrivingLicensePhoto")
                            }
                          />
                        </div>
                      </Col>

                      {/* Route Fields */}
                      <Col sm="6">
                        <CardTitle tag="h5">Route :</CardTitle>

                        <div className="mb-3">
                          <Label htmlFor="pincode">Pincode</Label>
                          <Input
                            id="pincode"
                            name="pincode"
                            type="text"
                            value={formik.values.pincode}
                            onChange={(e) => {
                              formik.handleChange(e);
                              fetchLocationData(e.target.value);
                            }}
                            onBlur={formik.handleBlur}
                            invalid={
                              formik.touched.pincode && formik.errors.pincode
                            }
                          />
                          <FormFeedback>{formik.errors.pincode}</FormFeedback>
                        </div>

                        <div className="mb-3">
                          <Label htmlFor="state">State</Label>
                          <Input
                            id="state"
                            name="state"
                            type="text"
                            value={formik.values.state}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={
                              formik.touched.state && formik.errors.state
                            }
                            readOnly
                          />
                          <FormFeedback>{formik.errors.state}</FormFeedback>
                        </div>

                        <div className="mb-3">
                          <Label htmlFor="district">District</Label>
                          <Input
                            id="district"
                            name="district"
                            type="text"
                            value={formik.values.district}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={
                              formik.touched.district && formik.errors.district
                            }
                            readOnly
                          />
                          <FormFeedback>{formik.errors.district}</FormFeedback>
                        </div>

                        <div className="mb-3">
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            name="city"
                            type="text"
                            value={formik.values.city}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={formik.touched.city && formik.errors.city}
                          />
                          {formik.touched.city && formik.errors.city && (
                            <FormFeedback>{formik.errors.city}</FormFeedback>
                          )}
                        </div>

                        <div className="mb-3">
                          <Label>Villages</Label>
                          {villages.map((village, index) => (
                            <Row
                              key={index}
                              className="align-items-center mb-2"
                            >
                              <Col sm="10">
                                <Input
                                  type="text"
                                  value={village}
                                  onChange={(e) =>
                                    handleVillageChange(index, e.target.value)
                                  }
                                  placeholder="Enter village name"
                                />
                              </Col>
                              <Col sm="2">
                                {index > 0 && (
                                  <Button
                                    color="danger"
                                    onClick={() => removeVillage(index)}
                                  >
                                    Remove
                                  </Button>
                                )}
                              </Col>
                            </Row>
                          ))}
                          <Button color="primary" onClick={addVillage}>
                            Add Village
                          </Button>
                        </div>
                        <div className="mb-3">
                          <Label>Areas</Label>
                          {areas.map((area, index) => (
                            <Row
                              key={index}
                              className="align-items-center mb-2"
                            >
                              <Col sm="10">
                                <Input
                                  type="text"
                                  value={area}
                                  onChange={(e) =>
                                    handleAreaChange(index, e.target.value)
                                  }
                                  placeholder="Enter area name"
                                />
                              </Col>
                              <Col sm="2">
                                {index > 0 && (
                                  <Button
                                    color="danger"
                                    onClick={() => removeArea(index)}
                                  >
                                    Remove
                                  </Button>
                                )}
                              </Col>
                            </Row>
                          ))}
                          <Button color="primary" onClick={addArea}>
                            Add Area
                          </Button>
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
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AgentMaster;
