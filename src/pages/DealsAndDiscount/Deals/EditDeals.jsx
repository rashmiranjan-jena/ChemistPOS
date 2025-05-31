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
import { useFormik } from "formik";
import * as yup from "yup";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import {
  postDeal,
  updateDeal,
  getDealByID,
} from "../../../ApiService/DealAndDiscount/Deals/Deals";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

const EditDeals = () => {
  document.title = "Edit Deal Registration";
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [bannerPreview, setBannerPreview] = useState(null);
  useEffect(() => {
    if (id) {
      fetchDealData(id);
    }
  }, [id]);

  // Fetch existing deal details
  const fetchDealData = async (dealId) => {
    try {
      const response = await getDealByID(dealId);
      const deal = response.data;

      const formatDateTimeLocal = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16);
      };

      const startTime = formatDateTimeLocal(deal.start_date);
      const endTime = formatDateTimeLocal(deal.end_date);

      console.log("Formatted Start Time:", startTime);
      console.log("Formatted End Time:", endTime);

      const banner = deal.banners.length > 0 ? deal.banners[0] : null;
      console.log(banner)

      formik.setValues({
        dealName: deal.deal_name || "",
        dealType: deal.deal_type || "",
        discountValue: deal.discount_value || "",
        startTime: startTime,
        endTime: endTime,
        description: deal.description || "",
        dealPhoto: null,
        bannerImage: null,
        bannerHeading: banner ? banner.banner_heading : "",
        bannerDescription: banner ? banner.banner_description : "",
        bannerStatus: banner && banner.banner_status ? "Published" : "Draft",
      });

      // Set images if available
      if (deal.deal_photo) setSelectedFiles([deal.deal_photo]);
      if (banner && banner.banner_images.length > 0) {
        setBannerPreview(banner.banner_images[0]);
      }
    } catch (error) {
      console.error("Error fetching deal:", error);
    }
  };

  const handleAcceptedFiles = (files) => {
    const updatedFiles = files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
    setSelectedFiles([...selectedFiles, ...updatedFiles]);
  };
  const formik = useFormik({
    initialValues: {
      dealName: "",
      dealType: "",
      discountValue: "",
      startTime: "",
      endTime: "",
      description: "",
      dealPhoto: null,
      bannerImage: null,
      bannerHeading: "",
      bannerDescription: "",
      bannerStatus: "",
    },
    validationSchema: yup.object().shape({
      dealName: yup.string().required("Please enter the Deal Name"),
      dealType: yup.string().required("Please select the Deal Type"),
      discountValue: yup
        .number()
        .required("Please enter the Discount Value")
        .min(0, "Discount value cannot be negative"),
      startTime: yup.date().required("Please select the Start Time"),
      endTime: yup.date().required("Please select the End Time"),
      description: yup.string().required("Please enter a Description"),
      bannerHeading: yup.string().required("Please enter the Banner Heading"),
      bannerDescription: yup
        .string()
        .required("Please enter the Banner Description"),
      bannerStatus: yup.string().required("Please select the Banner Status"),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("deal_name", values.dealName);
      formData.append("deal_type", values.dealType);
      formData.append("discount_value", values.discountValue);
      formData.append("start_date", values.startTime);
      formData.append("end_date", values.endTime);
      formData.append("description", values.description);
      formData.append("banner_heading", values.bannerHeading);
      formData.append("banner_description", values.bannerDescription);
      formData.append("banner_status", values.bannerStatus === "Published");

      if (values.dealPhoto) formData.append("deal_photo", values.dealPhoto);
      if (values.bannerImage)
        formData.append("banner_image", values.bannerImage);

      try {
        if (id) {
          // Update existing deal
          await updateDeal(id, formData);
          Swal.fire({
            title: "Success!",
            text: "Deal Updated Successfully.",
            icon: "success",
            confirmButtonText: "OK",
          });
        } else {
          // Create a new deal (if no ID is provided)
          await postDeal(formData);
          Swal.fire({
            title: "Success!",
            text: "Deal Registered Successfully.",
            icon: "success",
            confirmButtonText: "OK",
          });
        }

        formik.resetForm();
        navigate("/dealslist");
      } catch (error) {
        console.error("Error submitting deal:", error);
        Swal.fire({
          title: "Error!",
          text: "There was an error submitting the deal. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    },
  });

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Deal Registration" breadcrumbItem="Add Details" />
          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
                  <CardTitle tag="h4">
                    {id ? "Edit Deal" : "Add Deal"}
                  </CardTitle>
                  <p className="card-title-desc mb-4">
                    {id
                      ? "Modify the details below to update the deal."
                      : "Fill out the fields below to register your deal."}
                  </p>

                  <Form onSubmit={formik.handleSubmit} autoComplete="off">
                    <Row>
                      {/* Left Side - Deal Information */}
                      <Col sm="6">
                        <Card>
                          <CardBody>
                            <CardTitle tag="h4">Deal Information</CardTitle>
                            <p className="card-title-desc mb-4">
                              Fill out the fields below to register your deal.
                            </p>

                            <Form
                              onSubmit={formik.handleSubmit}
                              autoComplete="off"
                            >
                              {/* Deal Name */}
                              <div className="mb-3">
                                <Label htmlFor="dealName">Deal Name</Label>
                                <Input
                                  id="dealName"
                                  name="dealName"
                                  type="text"
                                  value={formik.values.dealName}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  invalid={
                                    formik.touched.dealName &&
                                    formik.errors.dealName
                                  }
                                />
                                <FormFeedback>
                                  {formik.errors.dealName}
                                </FormFeedback>
                              </div>

                              {/* Deal Type */}
                              <div className="mb-3">
                                <Label htmlFor="dealType">Deal Type</Label>
                                <Input
                                  id="dealType"
                                  name="dealType"
                                  type="select"
                                  value={formik.values.dealType}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  invalid={
                                    formik.touched.dealType &&
                                    formik.errors.dealType
                                  }
                                >
                                  <option value="">Select Deal Type</option>
                                  <option value="Percentage">Percentage</option>
                                  <option value="Flat">Flat</option>
                                  <option value="BOGO">Buy One Get One</option>
                                  <option value="Flash Sale">Flash Sale</option>
                                  <option value="Bundle">Bundle</option>
                                </Input>
                                <FormFeedback>
                                  {formik.errors.dealType}
                                </FormFeedback>
                              </div>

                              {/* Discount Value */}
                              <div className="mb-3">
                                <Label htmlFor="discountValue">
                                  Discount Value
                                </Label>
                                <Input
                                  id="discountValue"
                                  name="discountValue"
                                  type="number"
                                  value={formik.values.discountValue}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  invalid={
                                    formik.touched.discountValue &&
                                    formik.errors.discountValue
                                  }
                                />
                                <FormFeedback>
                                  {formik.errors.discountValue}
                                </FormFeedback>
                              </div>

                              {/* Start Time */}
                              <div className="mb-3">
                                <Label htmlFor="startTime">Start Time</Label>
                                <Input
                                  id="startTime"
                                  name="startTime"
                                  type="datetime-local"
                                  value={formik.values.startTime}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  invalid={
                                    formik.touched.startTime &&
                                    formik.errors.startTime
                                  }
                                />
                                <FormFeedback>
                                  {formik.errors.startTime}
                                </FormFeedback>
                              </div>

                              {/* End Time */}
                              <div className="mb-3">
                                <Label htmlFor="endTime">End Time</Label>
                                <Input
                                  id="endTime"
                                  name="endTime"
                                  type="datetime-local"
                                  value={formik.values.endTime}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  invalid={
                                    formik.touched.endTime &&
                                    formik.errors.endTime
                                  }
                                />
                                <FormFeedback>
                                  {formik.errors.endTime}
                                </FormFeedback>
                              </div>

                              {/* Description */}
                              <div className="mb-3">
                                <Label htmlFor="description">Description</Label>
                                <Input
                                  id="description"
                                  name="description"
                                  type="textarea"
                                  value={formik.values.description}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  invalid={
                                    formik.touched.description &&
                                    formik.errors.description
                                  }
                                />
                                <FormFeedback>
                                  {formik.errors.description}
                                </FormFeedback>
                              </div>

                              <div className="mb-3">
                                <Label htmlFor="dealPhoto">Deal Photo</Label>
                                <Input
                                  id="dealPhoto"
                                  name="dealPhoto"
                                  type="file"
                                  accept="image/*"
                                  onChange={(event) => {
                                    const file = event.target.files[0];
                                    formik.setFieldValue("dealPhoto", file);

                                    if (file) {
                                      const previewUrl =
                                        URL.createObjectURL(file);
                                      setSelectedFiles([previewUrl]);
                                    }
                                  }}
                                  onBlur={formik.handleBlur}
                                  invalid={
                                    formik.touched.dealPhoto &&
                                    !!formik.errors.dealPhoto
                                  }
                                />
                                <FormFeedback>
                                  {formik.errors.dealPhoto}
                                </FormFeedback>

                                {/* Image Preview */}
                                {selectedFiles.length > 0 && (
                                  <div className="mt-3">
                                    {selectedFiles.map((file, index) => (
                                      <img
                                        key={index}
                                        src={file}
                                        alt="Preview"
                                        style={{
                                          width: "150px",
                                          height: "150px",
                                          objectFit: "cover",
                                          borderRadius: "8px",
                                          boxShadow:
                                            "0 2px 6px rgba(0, 0, 0, 0.15)",
                                        }}
                                      />
                                    ))}
                                  </div>
                                )}
                              </div>
                            </Form>
                          </CardBody>
                        </Card>
                      </Col>

                      {/* Right Side - Banner Information */}
                      <Col sm="6">
                        <Card>
                          <CardBody>
                            <CardTitle tag="h4">Banner Information</CardTitle>
                            <p className="card-title-desc mb-4">
                              Upload the banner image and enter details below.
                            </p>
                            {/* Banner Image */}
                            <div className="mb-3">
                              <Label htmlFor="bannerImage">Banner Image</Label>
                              <Input
                                id="bannerImage"
                                name="bannerImage"
                                type="file"
                                accept="image/*"
                                onChange={(event) => {
                                  const file = event.target.files[0];
                                  formik.setFieldValue("bannerImage", file);
                                  if (file)
                                    setBannerPreview(URL.createObjectURL(file));
                                }}
                                onBlur={formik.handleBlur}
                                invalid={
                                  formik.touched.bannerImage &&
                                  !!formik.errors.bannerImage
                                }
                              />
                              <FormFeedback>
                                {formik.errors.bannerImage}
                              </FormFeedback>

                              {/* Image Preview */}
                              {bannerPreview && (
                                <div className="mt-3">
                                  <img
                                    src={bannerPreview}
                                    alt="Preview"
                                    style={{
                                      width: "150px",
                                      height: "150px",
                                      objectFit: "cover",
                                      borderRadius: "8px",
                                      boxShadow:
                                        "0 2px 6px rgba(0, 0, 0, 0.15)",
                                    }}
                                  />
                                </div>
                              )}
                            </div>

                            {/* Banner Heading */}
                            <div className="mb-3">
                              <Label htmlFor="bannerHeading">
                                Banner Heading
                              </Label>
                              <Input
                                id="bannerHeading"
                                name="bannerHeading"
                                type="text"
                                value={formik.values.bannerHeading}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                invalid={
                                  formik.touched.bannerHeading &&
                                  formik.errors.bannerHeading
                                }
                              />
                              <FormFeedback>
                                {formik.errors.bannerHeading}
                              </FormFeedback>
                            </div>

                            {/* Banner Description */}
                            <div className="mb-3">
                              <Label htmlFor="bannerDescription">
                                Banner Description
                              </Label>
                              <Input
                                id="bannerDescription"
                                name="bannerDescription"
                                type="textarea"
                                value={formik.values.bannerDescription}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                invalid={
                                  formik.touched.bannerDescription &&
                                  formik.errors.bannerDescription
                                }
                              />
                              <FormFeedback>
                                {formik.errors.bannerDescription}
                              </FormFeedback>
                            </div>
                            <div className="mb-3">
                              <Label htmlFor="bannerStatus">
                                Banner Status
                              </Label>
                              <Input
                                id="bannerStatus"
                                name="bannerStatus"
                                type="select"
                                {...formik.getFieldProps("bannerStatus")}
                                invalid={
                                  formik.touched.bannerStatus &&
                                  !!formik.errors.bannerStatus
                                }
                              >
                                <option value="">Select Status</option>
                                <option value="Published">Published</option>
                                <option value="Unpublished">Unpublished</option>
                              </Input>
                              <FormFeedback>
                                {formik.errors.bannerStatus}
                              </FormFeedback>
                            </div>
                          </CardBody>
                        </Card>
                      </Col>
                      <div className="text-center">
                        <Button type="submit" color="primary">
                          Update
                        </Button>
                        <Button
                          type="button"
                          color="secondary"
                          className="mx-3"
                          onClick={() => formik.resetForm()}
                        >
                          Cancel
                        </Button>
                      </div>
                    </Row>
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

export default EditDeals;
