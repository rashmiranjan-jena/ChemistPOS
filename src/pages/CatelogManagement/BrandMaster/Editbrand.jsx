import React, { useState, useEffect } from "react";
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
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const Editbrand = () => {
  document.title = "Brand Registration";
  const navigate = useNavigate();
  const { id } = useParams();
  const backendUrl = `${import.meta.env.VITE_API_BASE_URL}api/brand-master/`;

  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);

  const formik = useFormik({
    initialValues: {
      brandName: "",
      brandCode: "",
      aboutBrand: "",
      brandLogo: "", 
      brandBannerImage: "",
      bannerHeading: "",
      bannerDescription: "",
      bannerStatus: "",
      brandImages: [],
    },
    validationSchema: yup.object().shape({
      brandName: yup.string().required("Please enter the Brand Name"),
      brandCode: yup.string().required("Please enter the Brand Code"),
      aboutBrand: yup.string(),
      brandLogo: yup.mixed().notRequired(),
      bannerHeading: yup.string().required("Please enter the Banner Heading"),
      bannerDescription: yup
        .string()
        .required("Please enter the Banner Description"),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("brand_name", values.brandName);
      formData.append("brand_code", values.brandCode);
      formData.append("about_brand", values.aboutBrand);
      formData.append("banner_heading", values.bannerHeading);
      formData.append("banner_description", values.bannerDescription);
      formData.append(
        "banner_status",
        formik.values.bannerStatus === "Published" ? "true" : "false"
      );
      if (formik.values.brandLogo instanceof File) {
        formData.append("brand_logo", formik.values.brandLogo);
      }
    
      if (formik.values.brandBannerImage instanceof File) {
        formData.append("banner_images", formik.values.brandBannerImage);
      }

      try {
        const response = await axios.put(
          `${backendUrl}?brand_id=${id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 200) {
          alert("Brand updated successfully!");
          navigate("/brandmastertable");
        } else {
          console.error("Error updating brand");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    },
  });

  const handleImageChange = (event) => {
    formik.setFieldValue("brandImages", Array.from(event.target.files));
  };
  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/brand-master/?brand_id=${id}`
        );
        setBrand(response.data);
        setLoading(false);
        const brandDetails = response.data.brand_details;
        const banner = response.data.banners?.[0] || {};

        formik.setValues({
          brandName: brandDetails.brand_name || "",
          brandCode: brandDetails.brand_code || "",
          aboutBrand: brandDetails.about_brand || "",
          brandLogo: brandDetails.brand_logo || "", // Store existing image URL
          brandBannerImage: brandDetails.brand_banner_image || "",
          bannerHeading: banner.banner_heading || "",
          bannerDescription: banner.banner_description || "",
          bannerStatus: brandDetails.status || "Published",
          brandImages: brandDetails.brand_images || [],
        });
      } catch (error) {
        console.error("Error fetching brand data:", error);
      }
    };

    fetchBrand();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Brand Registration" breadcrumbItem="Edit Brand" />
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
                  <Label htmlFor="brandLogo">Brand Logo</Label>
                  <Input
                    id="brandLogo"
                    name="brandLogo"
                    type="file"
                    onChange={(event) =>
                      formik.setFieldValue(
                        "brandLogo",
                        event.currentTarget.files[0]
                      )
                    }
                    onBlur={formik.handleBlur}
                  />
                  {formik.values.brandLogo && (
                    <div className="mt-3">
                      <img
                        src={
                          formik.values.brandLogo instanceof File
                            ? URL.createObjectURL(formik.values.brandLogo)
                            : `${import.meta.env.VITE_API_BASE_URL}${
                                formik.values.brandLogo
                              }`
                        }
                        alt="Brand Logo"
                        width="150"
                        height="150"
                        style={{ objectFit: "contain", borderRadius: "5px" }}
                      />
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <Label htmlFor="brandImages">Brand Images (Optional)</Label>
                  <Input
                    id="brandImages"
                    name="brandImages"
                    type="file"
                    multiple
                    onChange={handleImageChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.values.brandImages &&
                    formik.values.brandImages.length > 0 && (
                      <div className="mt-2">
                        {Array.from(formik.values.brandImages).map(
                          (file, index) => {
                            if (file && file instanceof File) {
                              return (
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
                              );
                            } else {
                              return null;
                            }
                          }
                        )}
                      </div>
                    )}
                </div>
              </Col>

              <Col sm="6">
                <div className="mb-3">
                  <Label htmlFor="brandBannerImage">Banner Image</Label>
                  <Input
                    id="brandBannerImage"
                    name="brandBannerImage"
                    type="file"
                    onChange={(event) =>
                      formik.setFieldValue(
                        "brandBannerImage",
                        event.currentTarget.files[0]
                      )
                    }
                    onBlur={formik.handleBlur}
                  />
                  {formik.values.brandBannerImage && (
                    <div className="mt-3">
                      <img
                        src={
                          formik.values.brandBannerImage instanceof File
                            ? URL.createObjectURL(
                                formik.values.brandBannerImage
                              )
                            : `${import.meta.env.VITE_API_BASE_URL}${
                                formik.values.brandBannerImage
                              }`
                        }
                        alt="Banner Image"
                        width="200"
                        height="100"
                        style={{ objectFit: "cover", borderRadius: "5px" }}
                      />
                    </div>
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
                  >
                  <option value="">Select Status</option>
                    <option value="Published">Published</option>
                    <option value="Unpublished">Unpublished</option>
                  </Input>
                </div>
              </Col>
            </Row>
              <Button type="submit" color="primary">
              Update Brand
            </Button>
          </form>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Editbrand;
