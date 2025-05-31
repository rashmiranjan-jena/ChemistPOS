import React, { useState, useRef } from "react";
import {
  Button,
  Col,
  Container,
  Input,
  Label,
  Row,
  FormFeedback,
} from "reactstrap";
import * as yup from "yup";
import { useFormik } from "formik";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { registerBrand } from "../../../ApiService/Catalogmanagement/BrandMaster";
import { useNavigate } from "react-router-dom";

const BrandMaster = () => {
  document.title = "Brand Registration";
  const navigate = useNavigate();
  const brandLogoRef = useRef(null);
  const brandBannerImageRef = useRef(null);

  const formik = useFormik({
    initialValues: {
      brandName: "",
      brandCode: "",
      aboutBrand: "",
      brandLogo: null,
      brandBannerImage: null,
      bannerHeading: "",
      bannerDescription: "",
      bannerStatus: "",
      brandImages: [],
    },
    validationSchema: yup.object().shape({
      brandName: yup.string().required("Please enter the Brand Name"),
      brandCode: yup.string().required("Please enter the Brand Code"),
      aboutBrand: yup.string(),
      brandLogo: yup.mixed().required("Please upload the Brand Logo"),
      brandBannerImage: yup.mixed().required("Please upload the Banner Image"),

      bannerHeading: yup
        .string()
        .required("Please enter the Banner Heading")
        .max(50, "Banner Heading must not exceed 50 characters"),
      bannerDescription: yup
        .string()
        .required("Please enter the Banner Description")
        .max(150, "Banner Description must not exceed 150 characters"),
    }),
    onSubmit: async (values) => {
      try {
        const formData = new FormData();

        formData.append("brand_name", values.brandName);
        formData.append("brand_code", values.brandCode);
        formData.append("about_brand", values.aboutBrand);
        formData.append("brand_logo", values.brandLogo);
        formData.append("banner_images", values.brandBannerImage);
        formData.append("banner_heading", values.bannerHeading);
        formData.append("banner_description", values.bannerDescription);

        const bannerStatusBoolean = values.bannerStatus === "Published";
        formData.append("banner_status", bannerStatusBoolean);

        values.brandImages.forEach((image) => {
          formData.append("brand_images", image);
        });

        const response = await registerBrand(formData);
        if (response) {
          formik.resetForm();
          if (brandLogoRef.current) brandLogoRef.current.value = "";
          if (brandBannerImageRef.current)
            brandBannerImageRef.current.value = "";
          navigate("/brandmastertable");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        alert("Failed to submit the form. Please try again.");
      }
    },
  });
  const handleImageChange = (event) => {
    formik.setFieldValue("brandImages", Array.from(event.target.files));
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Brand Registration"
            breadcrumbItem="Add Details"
          />
          <form onSubmit={formik.handleSubmit}>
            <Row>
              <Col sm="6">
                <div className="mb-3">
                  <Label htmlFor="brandName">Brand Name</Label>
                  <Input
                    id="brandName"
                    name="brandName"
                    type="text"
                    value={formik.values.brandName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    invalid={
                      formik.touched.brandName && formik.errors.brandName
                    }
                  />
                  {formik.touched.brandName && formik.errors.brandName && (
                    <FormFeedback>{formik.errors.brandName}</FormFeedback>
                  )}
                </div>

                <div className="mb-3">
                  <Label htmlFor="brandCode">Brand Code</Label>
                  <Input
                    id="brandCode"
                    name="brandCode"
                    type="text"
                    value={formik.values.brandCode}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    invalid={
                      formik.touched.brandCode && formik.errors.brandCode
                    }
                  />
                  {formik.touched.brandCode && formik.errors.brandCode && (
                    <FormFeedback>{formik.errors.brandCode}</FormFeedback>
                  )}
                </div>

                <div className="mb-3">
                  <Label htmlFor="aboutBrand">About Brand (Optional)</Label>
                  <Input
                    id="aboutBrand"
                    name="aboutBrand"
                    type="textarea"
                    value={formik.values.aboutBrand}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>

                <div className="mb-3">
                  <Label htmlFor="brandLogo">
                    Brand Logo(height:100px,width:100px)
                  </Label>
                  <Input
                    id="brandLogo"
                    name="brandLogo"
                    type="file"
                    innerRef={brandLogoRef}
                    onChange={(event) =>
                      formik.setFieldValue(
                        "brandLogo",
                        event.currentTarget.files[0]
                      )
                    }
                    onBlur={formik.handleBlur}
                    invalid={
                      formik.touched.brandLogo && formik.errors.brandLogo
                    }
                  />
                  {formik.touched.brandLogo && formik.errors.brandLogo && (
                    <FormFeedback>{formik.errors.brandLogo}</FormFeedback>
                  )}
                </div>

                <div className="mb-3">
                  <Label htmlFor="brandImages">Brand Images (Optional)</Label>
                  <Input
                    id="brandImages"
                    name="brandImages"
                    // innerRef={brandImages}
                    type="file"
                    multiple
                    onChange={handleImageChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.values.brandImages.length > 0 && (
                    <div className="mt-2">
                      {Array.from(formik.values.brandImages).map(
                        (file, index) => (
                          <div key={index}>
                            <img
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              width="100"
                              height="100"
                              style={{
                                marginRight: "10px",
                                marginBottom: "10px",
                              }}
                            />
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              </Col>

              <Col sm="6">
                <div className="mb-3">
                  <Label htmlFor="brandBannerImage">
                    Banner Image(height:1080px,width:1920px)
                  </Label>
                  <Input
                    id="brandBannerImage"
                    name="brandBannerImage"
                    innerRef={brandBannerImageRef}
                    type="file"
                    onChange={(event) =>
                      formik.setFieldValue(
                        "brandBannerImage",
                        event.currentTarget.files[0]
                      )
                    }
                    onBlur={formik.handleBlur}
                    invalid={
                      formik.touched.brandBannerImage &&
                      formik.errors.brandBannerImage
                    }
                  />
                  {formik.touched.brandBannerImage &&
                    formik.errors.brandBannerImage && (
                      <FormFeedback>
                        {formik.errors.brandBannerImage}
                      </FormFeedback>
                    )}
                </div>

                <div className="mb-3">
                  <Label htmlFor="bannerHeading">Banner Heading</Label>
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
                  {formik.touched.bannerHeading &&
                    formik.errors.bannerHeading && (
                      <FormFeedback>{formik.errors.bannerHeading}</FormFeedback>
                    )}
                </div>

                <div className="mb-3">
                  <Label htmlFor="bannerDescription">Banner Description</Label>
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
                  {formik.touched.bannerDescription &&
                    formik.errors.bannerDescription && (
                      <FormFeedback>
                        {formik.errors.bannerDescription}
                      </FormFeedback>
                    )}
                </div>

                <div className="mb-3">
                  <Label htmlFor="bannerStatus">Banner Status</Label>
                  <Input
                    id="bannerStatus"
                    name="bannerStatus"
                    type="select"
                    value={formik.values.bannerStatus}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                  <option value="">Select Status</option>
                    <option value="Published">Published</option>
                    <option value="Unpublished">Unpublished</option>
                  </Input>
                </div>
              </Col>
            </Row>

            <div className="d-flex flex-wrap gap-2">
              <Button type="submit" color="primary">
                Submit
              </Button>
              <Button
                type="button"
                color="secondary"
                onClick={() => {
                  formik.resetForm();
                  if (brandLogoRef.current) brandLogoRef.current.value = "";
                  if (brandBannerImageRef.current)
                    brandBannerImageRef.current.value = "";
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default BrandMaster;
