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
import {
  submitForm,
  editFormbyid,
  updateForm,
} from "../../../ApiService/Blog/Blog";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

const Blogs = () => {
  document.title = "Blog Registration";
  const location = useLocation();
  const { id } = location.state || {};
  console.log(id);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({
    bannerImage: null,
    displayImage: null,
    authorName: "",
    authorImage: null,
    authorDesignation: "",
    socialName: "",
    socialLink: "",
  });

  const [photoPreviews, setPhotoPreviews] = useState({
    bannerImage: "",
    displayImage: "",
    authorImage: "",
  });

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const response = await editFormbyid(id);

          if (Array.isArray(response) && response.length > 0) {
            const data = response[0];

            setInitialValues({
              title: data.title || "",
              description: data.description || "",
              readTime: data.time || "",
              content: data.content || "",
              blogQuote: data.blog_quote || "",
              authorName: data.author_name || "",
              authorDesignation: data.author_designation || "",
              socialName: data.social_links?.socialName || "",
              socialLink: data.social_links?.socialLink || "",
            });
            setPhotoPreviews({
              bannerImage: `${import.meta.env.VITE_API_BASE_URL}${
                data.banner_image
              }`,
              displayImage: `${import.meta.env.VITE_API_BASE_URL}${
                data.display_image
              }`,
              authorImage: `${import.meta.env.VITE_API_BASE_URL}${
                data.author_image
              }`,
            });
          } else {
            console.error("Unexpected API response format:", response);
          }
        } catch (error) {
          console.error("Error fetching blog details:", error);
        }
      };

      fetchData();
    }
  }, [id]);

  function handleAcceptedFiles(files) {
    const updatedFiles = files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
    setSelectedFiles([...selectedFiles, ...updatedFiles]);
  }
  const formik = useFormik({
    initialValues,
    enableReinitialize: true,

    validationSchema: yup.object().shape({
      title: yup.string().required("Please enter the Title"),
      description: yup.string().required("Please enter the Description"),
      readTime: yup
        .number()
        .typeError("Please enter a valid number")
        .positive("Please enter a positive number")
        .integer("Please enter a valid integer")
        .required("Please enter the Read Time (in minutes)"),
      content: yup.string().required("Please enter the Content"),
      blogQuote: yup.string().required("Please enter the Blog Quote"),
      bannerImage: yup.mixed().required("Please upload the Banner Image"),
      displayImage: yup.mixed().required("Please upload the Display Image"),
      authorImage: yup.mixed().required("Please upload the Author Image"),
      authorDesignation: yup
        .string()
        .required("Please enter the Author Designation"),
      authorName: yup.string().required("Please enter the Author Name"),
      socialLink: yup.string().required("Please select a Social Link"),
    }),

    onSubmit: async (values) => {
      const formData = new FormData();

      const socialData = {
        socialName: values.socialName,
        socialLink: values.socialLink,
      };

      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("time", values.readTime);
      formData.append("content", values.content);
      formData.append("blog_quote", values.blogQuote);
      formData.append("author_name", values.authorName);
      formData.append("author_designation", values.authorDesignation);
      formData.append("social_links", JSON.stringify(socialData));

      if (values.bannerImage) {
        formData.append("banner_image", values.bannerImage);
      }
      if (values.displayImage) {
        formData.append("display_image", values.displayImage);
      }
      if (values.authorImage) {
        formData.append("author_image", values.authorImage);
      }

      try {
        let response;
        if (id) {
          console.log("id--->", id);
          response = await updateForm(id, formData);
        } else {
          response = await submitForm(formData);
        }

        Swal.fire({
          icon: "success",
          title: id
            ? "Blog Updated Successfully!"
            : "Blog Created Successfully!",
          text: "Your blog has been saved.",
          confirmButtonText: "OK",
        });

        navigate("/blogslist");
        formik.resetForm();
      } catch (error) {
        console.error("Error:", error);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "There was an error submitting the form. Please try again.",
          confirmButtonText: "OK",
        });
      }
    },
  });

  const handleFileChange = (event, fieldName) => {
    const file = event.currentTarget.files[0];
    formik.setFieldValue(fieldName, file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreviews((prev) => ({
        ...prev,
        [fieldName]: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Breadcrumb */}
          <Breadcrumbs
            title="Blog Registration"
            breadcrumbItem={id ? "Edit Blog" : "Add Blog"}
          />

          <form onSubmit={formik.handleSubmit}>
            <Row>
              <Col sm="6">
                <div className="mb-3">
                  <Label htmlFor="title">Blog Title</Label>
                  <Input
                    id="title"
                    name="title"
                    type="text"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    invalid={
                      formik.touched.title && formik.errors.title ? true : false
                    }
                  />
                  {formik.touched.title && formik.errors.title && (
                    <FormFeedback>{formik.errors.title}</FormFeedback>
                  )}
                </div>

                <div className="mb-3">
                  <Label htmlFor="description" Blog>
                    Description
                  </Label>
                  <Input
                    id="description"
                    name="description"
                    type="textarea"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    invalid={
                      formik.touched.description && formik.errors.description
                        ? true
                        : false
                    }
                  />
                  {formik.touched.description && formik.errors.description && (
                    <FormFeedback>{formik.errors.description}</FormFeedback>
                  )}
                </div>

                <div className="mb-3">
                  <Label htmlFor="readTime">Read Time(in minutes)</Label>
                  <Input
                    id="readTime"
                    name="readTime"
                    type="text"
                    value={formik.values.readTime}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    invalid={formik.touched.readTime && formik.errors.readTime}
                  />
                  {formik.touched.readTime && formik.errors.readTime && (
                    <FormFeedback>{formik.errors.readTime}</FormFeedback>
                  )}
                </div>

                <div className="mb-3">
                  <Label htmlFor="content">Blog Content</Label>
                  <Input
                    id="content"
                    name="content"
                    type="textarea"
                    value={formik.values.content}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    invalid={
                      formik.touched.content && formik.errors.content
                        ? true
                        : false
                    }
                  />
                  {formik.touched.content && formik.errors.content && (
                    <FormFeedback>{formik.errors.content}</FormFeedback>
                  )}
                </div>

                <div className="mb-3">
                  <Label htmlFor="blogQuote">Blog Quote</Label>
                  <Input
                    id="blogQuote"
                    name="blogQuote"
                    type="textarea"
                    value={formik.values.blogQuote}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    invalid={
                      formik.touched.blogQuote && formik.errors.blogQuote
                        ? true
                        : false
                    }
                  />
                  {formik.touched.blogQuote && formik.errors.blogQuote && (
                    <FormFeedback>{formik.errors.blogQuote}</FormFeedback>
                  )}
                </div>

                <div className="mb-3">
                  <Label htmlFor="bannerImage">Banner Image</Label>
                  <Input
                    id="bannerImage"
                    name="bannerImage"
                    type="file"
                    onChange={(event) => handleFileChange(event, "bannerImage")}
                    onBlur={formik.handleBlur}
                    invalid={
                      formik.touched.bannerImage && formik.errors.bannerImage
                        ? true
                        : false
                    }
                  />
                  {photoPreviews.bannerImage && (
                    <img
                      src={photoPreviews.bannerImage}
                      alt="bannerImage Preview"
                      width="100"
                    />
                  )}
                  {formik.touched.bannerImage && formik.errors.bannerImage && (
                    <FormFeedback>{formik.errors.bannerImage}</FormFeedback>
                  )}
                </div>

                <div className="mb-3">
                  <Label htmlFor="displayImage">Display Image</Label>

                  <Input
                    id="displayImage"
                    name="displayImage"
                    type="file"
                    onChange={(event) =>
                      handleFileChange(event, "displayImage")
                    }
                    onBlur={formik.handleBlur}
                    invalid={
                      formik.touched.displayImage && formik.errors.displayImage
                        ? true
                        : false
                    }
                  />
                  {photoPreviews.displayImage && (
                    <img
                      src={photoPreviews.displayImage}
                      alt="displayImage Preview"
                      width="100"
                    />
                  )}
                  {formik.touched.displayImage &&
                    formik.errors.displayImage && (
                      <FormFeedback>{formik.errors.displayImage}</FormFeedback>
                    )}
                </div>
              </Col>

              <Col sm="6">
                <div className="mb-3">
                  <Label htmlFor="authorName">Author Name</Label>
                  <Input
                    id="authorName"
                    name="authorName"
                    type="text"
                    value={formik.values.authorName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    invalid={
                      formik.touched.authorName && formik.errors.authorName
                        ? true
                        : false
                    }
                  />
                  {formik.touched.authorName && formik.errors.authorName && (
                    <FormFeedback>{formik.errors.authorName}</FormFeedback>
                  )}
                </div>

                <div className="mb-3">
                  <Label htmlFor="authorImage">Author Image</Label>

                  <Input
                    id="authorImage"
                    name="authorImage"
                    type="file"
                    onChange={(event) => handleFileChange(event, "authorImage")}
                    onBlur={formik.handleBlur}
                    invalid={
                      formik.touched.authorImage && formik.errors.authorImage
                        ? true
                        : false
                    }
                  />
                  {photoPreviews.authorImage && (
                    <img
                      src={photoPreviews.authorImage}
                      alt="Author Preview"
                      width="100"
                    />
                  )}
                  {formik.touched.authorImage && formik.errors.authorImage && (
                    <FormFeedback>{formik.errors.authorImage}</FormFeedback>
                  )}
                </div>

                <div className="mb-3">
                  <Label htmlFor="authorDesignation">Author Designation</Label>
                  <Input
                    id="authorDesignation"
                    name="authorDesignation"
                    type="text"
                    value={formik.values.authorDesignation}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    invalid={
                      formik.touched.authorDesignation &&
                      formik.errors.authorDesignation
                        ? true
                        : false
                    }
                  />
                  {formik.touched.authorDesignation &&
                    formik.errors.authorDesignation && (
                      <FormFeedback>
                        {formik.errors.authorDesignation}
                      </FormFeedback>
                    )}
                </div>

                <div className="mb-3">
                  <Label htmlFor="socialName">Social Name</Label>
                  <Input
                    id="socialName"
                    name="socialName"
                    type="select"
                    value={formik.values.socialName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    invalid={
                      formik.touched.socialName && formik.errors.socialName
                        ? true
                        : false
                    }
                  >
                    <option value="">Select Social Name</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Twitter">Twitter</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Instagram">Instagram</option>
                  </Input>
                  {formik.touched.socialName && formik.errors.socialName && (
                    <FormFeedback>{formik.errors.socialName}</FormFeedback>
                  )}
                </div>

                <div className="mb-3">
                  <Label htmlFor="socialLink">Social Link</Label>
                  <Input
                    id="socialLink"
                    name="socialLink"
                    type="url"
                    placeholder="Enter the social link"
                    value={formik.values.socialLink}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    invalid={
                      formik.touched.socialLink && formik.errors.socialLink
                        ? true
                        : false
                    }
                  />
                  {formik.touched.socialLink && formik.errors.socialLink && (
                    <FormFeedback>{formik.errors.socialLink}</FormFeedback>
                  )}
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
          </form>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Blogs;
