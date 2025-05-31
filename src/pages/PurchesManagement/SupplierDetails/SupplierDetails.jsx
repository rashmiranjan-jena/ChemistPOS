import React, { useEffect, useState, useRef } from "react";
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
import Select from "react-select";
import {
  fetchBrands,
  fetchCategories,
  fetchSubcategories,
  submitSupplierDetails,
  fetchSupplierById,
  updateSupplierDetails,
} from "../../../ApiService/Supplierdetails/Supplierdetails";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";
import { AiOutlineCloseCircle } from "react-icons/ai";

const SupplierDetails = () => {
  document.title = "Supplier Details";
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location.state || {};
  console.log(id);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const businessLogoInputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const brandsData = await fetchBrands();
        setBrands(brandsData);

        const categoriesData = await fetchCategories();
        setCategories(categoriesData);

        const subcategoriesData = await fetchSubcategories();
        setSubcategories(subcategoriesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const fetchSupplierData = async () => {
      if (!id) return;
      try {
        const supplierData = await fetchSupplierById(id);
        console.log("Supplier Data:", supplierData);

        const brandIds = [
          ...new Set(
            supplierData.supplier_brands.map((item) => item.brand_name_id)
          ),
        ];
        const categoryIds = [
          ...new Set(
            supplierData.supplier_brands.map((item) => item.category_name_id)
          ),
        ];
        const subcategoryIds = [
          ...new Set(
            supplierData.supplier_brands.map((item) => item.subCategory_name_id)
          ),
        ];

        formik.setValues({
          businessName: supplierData.supplier_business_name || "",
          address: supplierData.address || "",
          contactNumber: supplierData.contact_number || "",
          emailId: supplierData.email_id || "",
          gstNo: supplierData.gst_no || "",
          brand: brandIds || [],
          category: categoryIds || [],
          subcategory: subcategoryIds || [],
          businessLogo: supplierData.business_logo || null,
        });

        // Use API for business logo
        if (supplierData.business_logo) {
          setPreview(
            `${import.meta.env.VITE_API_BASE_URL}${supplierData.business_logo}`
          );
        }
      } catch (error) {
        console.error("Error fetching supplier data:", error);
      }
    };

    fetchSupplierData();
  }, [id]);

  const formik = useFormik({
    initialValues: {
      businessName: "",
      address: "",
      contactNumber: "",
      emailId: "",
      gstNo: "",
      brand: [],
      category: [],
      subcategory: [],
      businessLogo: null, // This field is optional during editing
    },
    validationSchema: yup.object().shape({
      businessName: yup.string().required("Please enter the Business Name"),
      address: yup.string().required("Please enter the Address"),
      contactNumber: yup
        .string()
        .matches(/^\d{10}$/, "Contact Number must be 10 digits")
        .required("Please enter the Contact Number"),
      emailId: yup
        .string()
        .email("Invalid Email ID")
        .required("Please enter the Email ID"),
      gstNo: yup
        .string()
        .matches(
          /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{3}$/,
          "Invalid GST No format"
        )
        .required("Please enter the GST No"),
      businessLogo: id
        ? yup.mixed().nullable()
        : yup.mixed().required("Please upload a business logo"),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("supplier_business_name", values.businessName);
      formData.append("address", values.address);
      formData.append("contact_number", values.contactNumber);
      formData.append("email_id", values.emailId);
      formData.append("gst_no", values.gstNo);
      formData.append("brands", JSON.stringify(values.brand));
      formData.append("categories", JSON.stringify(values.category));
      formData.append("subcategories", JSON.stringify(values.subcategory));
      if (values.businessLogo instanceof File) {
        formData.append("business_logo", values.businessLogo);
      }

      try {
        let response;
        if (id) {
          response = await updateSupplierDetails(id, formData);
          Swal.fire({
            icon: "success",
            title: "Updated Successfully!",
            text:
              response.message || "Your supplier details have been updated.",
            confirmButtonText: "OK",
          });
        } else {
          response = await submitSupplierDetails(formData);
          Swal.fire({
            icon: "success",
            title: "Created Successfully!",
            text: response.message || "Your supplier details have been saved.",
            confirmButtonText: "OK",
          });
        }

        console.log("Data submitted successfully:", response);
        formik.resetForm();
        businessLogoInputRef.current.value = null;
        navigate("/supplierdetailslist");
      } catch (error) {
        console.error("Error submitting form data:", error);
        Swal.fire({
          icon: "error",
          title: "Oops... Something Went Wrong",
          text: error.response?.data?.message || "Please try again later.",
          confirmButtonText: "OK",
        });
      }
    },
  });

  const handleSelectChange = (selectedOptions, fieldName) => {
    formik.setFieldValue(
      fieldName,
      selectedOptions ? selectedOptions.map((option) => option.value) : []
    );
  };

  const handleImageChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      formik.setFieldValue("businessLogo", file);
      setPreview(URL.createObjectURL(file));
    }
  };
  const removeImage = () => {
    formik.setFieldValue("businessLogo", null);
    setPreview(null);
    if (businessLogoInputRef.current) {
      businessLogoInputRef.current.value = "";
    }
  };
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="GST Master"
            breadcrumbItem={id ? "Edit Details" : "Add Details"}
          />

          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
                  <CardTitle tag="h4">
                    {id
                      ? "Edit Supplier Information"
                      : "Add Supplier Information"}
                  </CardTitle>
                  <p className="card-title-desc mb-4">
                    Fill out the fields below to register supplier details.
                  </p>

                  <Form onSubmit={formik.handleSubmit}>
                    <Row>
                      <Col sm="6">
                        <div className="mb-3">
                          <Label htmlFor="businessName">Business Name</Label>
                          <Input
                            id="businessName"
                            name="businessName"
                            type="text"
                            value={formik.values.businessName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={
                              formik.touched.businessName &&
                              formik.errors.businessName
                            }
                          />
                          {formik.touched.businessName &&
                            formik.errors.businessName && (
                              <FormFeedback>
                                {formik.errors.businessName}
                              </FormFeedback>
                            )}
                        </div>

                        <div className="mb-3">
                          <Label htmlFor="address">Address</Label>
                          <Input
                            id="address"
                            name="address"
                            type="text"
                            value={formik.values.address}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={
                              formik.touched.address && formik.errors.address
                            }
                          />
                          {formik.touched.address && formik.errors.address && (
                            <FormFeedback>{formik.errors.address}</FormFeedback>
                          )}
                        </div>

                        <div className="mb-3">
                          <Label htmlFor="contactNumber">Contact Number</Label>
                          <Input
                            id="contactNumber"
                            name="contactNumber"
                            type="text"
                            value={formik.values.contactNumber}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={
                              formik.touched.contactNumber &&
                              formik.errors.contactNumber
                            }
                          />
                          {formik.touched.contactNumber &&
                            formik.errors.contactNumber && (
                              <FormFeedback>
                                {formik.errors.contactNumber}
                              </FormFeedback>
                            )}
                        </div>

                        <div className="mb-3">
                          <Label htmlFor="emailId">Email ID</Label>
                          <Input
                            id="emailId"
                            name="emailId"
                            type="email"
                            value={formik.values.emailId}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={
                              formik.touched.emailId && formik.errors.emailId
                            }
                          />
                          {formik.touched.emailId && formik.errors.emailId && (
                            <FormFeedback>{formik.errors.emailId}</FormFeedback>
                          )}
                        </div>

                        <div className="mb-3">
                          <Label htmlFor="gstNo">GST No</Label>
                          <Input
                            id="gstNo"
                            name="gstNo"
                            type="text"
                            value={formik.values.gstNo}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={
                              formik.touched.gstNo && formik.errors.gstNo
                            }
                          />
                          {formik.touched.gstNo && formik.errors.gstNo && (
                            <FormFeedback>{formik.errors.gstNo}</FormFeedback>
                          )}
                        </div>

                        {/* Brand Dropdown */}
                        <div className="mb-3">
                          <Label>Brand</Label>
                          <Select
                            isMulti
                            options={brands.map((brand) => ({
                              value: brand.brand_details.brand_id,
                              label: brand.brand_details.brand_name,
                            }))}
                            value={brands
                              .filter((brand) =>
                                formik.values.brand.includes(
                                  brand.brand_details.brand_id
                                )
                              )
                              .map((brand) => ({
                                value: brand.brand_details.brand_id,
                                label: brand.brand_details.brand_name,
                              }))}
                            onChange={(selectedOptions) =>
                              handleSelectChange(selectedOptions, "brand")
                            }
                            isSearchable
                          />
                          {formik.touched.brand && formik.errors.brand && (
                            <FormFeedback>{formik.errors.brand}</FormFeedback>
                          )}
                        </div>

                        {/* Category Dropdown */}
                        <div className="mb-3">
                          <Label>Category</Label>
                          <Select
                            isMulti
                            options={categories.map((category) => ({
                              value: category.category_name_id,
                              label: category.category_name,
                            }))}
                            value={categories
                              .filter((category) =>
                                formik.values.category.includes(
                                  category.category_name_id
                                )
                              )
                              .map((category) => ({
                                value: category.category_name_id,
                                label: category.category_name,
                              }))}
                            onChange={(selectedOptions) =>
                              handleSelectChange(selectedOptions, "category")
                            }
                            isSearchable
                          />
                          {formik.touched.category &&
                            formik.errors.category && (
                              <FormFeedback>
                                {formik.errors.category}
                              </FormFeedback>
                            )}
                        </div>

                        {/* Subcategory Dropdown */}
                        <div className="mb-3">
                          <Label>Subcategory</Label>
                          <Select
                            isMulti
                            options={subcategories.map((subcategory) => ({
                              value:
                                subcategory.sub_category_details
                                  .sub_category_id,
                              label:
                                subcategory.sub_category_details
                                  .sub_category_name,
                            }))}
                            value={subcategories
                              .filter((subcategory) =>
                                formik.values.subcategory.includes(
                                  subcategory.sub_category_details
                                    .sub_category_id
                                )
                              )
                              .map((subcategory) => ({
                                value:
                                  subcategory.sub_category_details
                                    .sub_category_id,
                                label:
                                  subcategory.sub_category_details
                                    .sub_category_name,
                              }))}
                            onChange={(selectedOptions) =>
                              handleSelectChange(selectedOptions, "subcategory")
                            }
                            isSearchable
                          />
                          {formik.touched.subcategory &&
                            formik.errors.subcategory && (
                              <FormFeedback>
                                {formik.errors.subcategory}
                              </FormFeedback>
                            )}
                        </div>

                        {/* Business Logo */}
                        <div className="mb-3">
                          <Label htmlFor="businessLogo">Business Logo</Label>
                          <Input
                            id="businessLogo"
                            name="businessLogo"
                            type="file"
                            innerRef={businessLogoInputRef}
                            onChange={handleImageChange}
                            onBlur={formik.handleBlur}
                            invalid={
                              formik.touched.businessLogo &&
                              formik.errors.businessLogo
                            }
                          />
                          {formik.touched.businessLogo &&
                            formik.errors.businessLogo && (
                              <FormFeedback>
                                {formik.errors.businessLogo}
                              </FormFeedback>
                            )}

                          {preview && (
                            <div className="relative mt-3">
                              <img
                                src={preview}
                                alt="Business Logo"
                                className="w-[50px] h-[50px] object-cover rounded-md border border-gray-300"
                              />
                              <AiOutlineCloseCircle
                                className="absolute top-[-8px] right-[-8px] text-red-500 cursor-pointer text-xl"
                                onClick={removeImage}
                              />
                            </div>
                          )}
                        </div>
                      </Col>
                    </Row>

                    <Button type="submit" color="primary">
                      {id ? "Update" : "Submit"}
                    </Button>
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

export default SupplierDetails;
