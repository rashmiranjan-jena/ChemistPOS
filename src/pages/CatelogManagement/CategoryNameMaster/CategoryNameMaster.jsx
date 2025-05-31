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
} from "reactstrap";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  postCategoryData,
  getCategoryById,
  updateCategoryData,
} from "../../../ApiService/CategoryMaster/CategoryNameMaster/CategoryNameMaster";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

const CategoryNameMaster = () => {
  document.title = "Category Registration";
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location.state || {};
  console.log("id--->", id);

  const [initialValues, setInitialValues] = useState({
    categoryName: "",
    categoryImage: null,
  });
  const [preview, setPreview] = useState(null);
  
  useEffect(() => {
    if (id) {
      getCategoryById(id)
        .then((response) => {
          const categoryData = response.data;
          console.log(categoryData);

          setInitialValues({
            categoryName: categoryData.category_name || "",
            categoryImage: null,
          });

          if (categoryData.category_image) {
            setPreview(
              `${import.meta.env.VITE_API_BASE_URL}${
                categoryData.category_image
              }`
            );
          }
        })
        .catch((error) => {
          console.error("Error fetching category details:", error);
        });
    }
  }, [id]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: yup.object().shape({
      categoryName: yup.string().required("Please enter a Category Name"),
      // categoryImage: yup.mixed().test(
      //   "required",
      //   "Please upload a category image",
      //   function (value) {
      //     if (!id) {
      //       return value != null;
      //     }
      //     return true;
      //   }
      // ),
    }),
    onSubmit: async (values) => {
      console.log("Form values before submission:", values);
      const formData = new FormData();
      formData.append("category_name", values.categoryName);
      if (values.categoryImage) {
        formData.append("category_image", values.categoryImage);
      }

      console.log("FormData being sent to API:", formData);

      try {
        if (id) {
          // Only send the image if it was uploaded during editing
          if (values.categoryImage) {
            await updateCategoryData(id, formData);
          } else {
            const updateData = new FormData();
            updateData.append("category_name", values.categoryName);
            await updateCategoryData(id, updateData);
          }
          Swal.fire("Updated!", "Category updated successfully.", "success");
        } else {
          // Create new category
          await postCategoryData(formData);
          Swal.fire("Success!", "Category registered successfully.", "success");
        }
        navigate("/categorynamemasterlist");
      } catch (error) {
        console.error("Error submitting category:", error);
        Swal.fire("Error!", "There was an issue processing your request.", "error");
      }
    },
  });
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      formik.setFieldValue("categoryImage", file);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
                  <CardTitle tag="h4">Category Name Registration</CardTitle>
                  <p className="card-title-desc mb-4">
                    Fill out the fields below to register a category name and
                    image.
                  </p>

                  <Form
                    onSubmit={formik.handleSubmit}
                    autoComplete="off"
                    encType="multipart/form-data"
                  >
                    <Row>
                      <Col sm="6">
                        <div className="mb-3">
                          <Label htmlFor="categoryName">Category Name</Label>
                          <Input
                            type="text"
                            id="categoryName"
                            name="categoryName"
                            value={formik.values.categoryName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Enter Category Name"
                            className="me-2"
                          />
                          {formik.touched.categoryName &&
                            formik.errors.categoryName && (
                              <div className="text-danger">
                                {formik.errors.categoryName}
                              </div>
                            )}

                          {/* Category Image */}
                          <Label htmlFor="categoryImage" className="mt-2">
                            Upload Category Image
                          </Label>
                          <Input
                            type="file"
                            id="categoryImage"
                            name="categoryImage"
                            accept="image/*"
                            onChange={handleImageChange}
                            onBlur={formik.handleBlur}
                            className="me-2"
                          />
                          {formik.touched.categoryImage &&
                            formik.errors.categoryImage && (
                              <div className="text-danger">
                                {formik.errors.categoryImage}
                              </div>
                            )}

                          {/* Image Preview */}
                          {preview && (
                            <div className="mt-2">
                              <img
                                src={preview} // Directly use the API image URL or new image preview
                                alt="Category Preview"
                                style={{
                                  width: 100,
                                  height: 50,
                                  borderRadius: "20%",
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </Col>
                    </Row>

                    {/* Submit and Cancel Buttons */}
                    <div className="d-flex flex-wrap gap-2 mt-4">
                      <Button type="submit" color="primary">
                        {id ? "Update" : "Submit"}
                      </Button>
                      <Button
                        type="button"
                        color="secondary"
                        onClick={() => navigate("/categorynamemasterlist")}
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

export default CategoryNameMaster;
