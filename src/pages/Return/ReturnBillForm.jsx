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
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useNavigate, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import {
  PostReturneOrder,
  GetReturnOrderById,
  UpdateReturnOrder,
} from "../../ApiService/ReturnDrug/ReturnProduct";

// Validation schema
const validationSchema = Yup.object({
  refMemoNumber: Yup.string().required("Reference Memo Number is required"),
  date: Yup.date()
    .required("Date is required")
    .typeError("Invalid date format"),
  collectionBoyName: Yup.string()
    .required("Collection Boy Name is required")
    .max(100, "Name cannot exceed 100 characters"),
  mobileNumber: Yup.string()
    .required("Mobile Number is required")
    .matches(/^\+?\d{10,15}$/, "Invalid mobile number (10-15 digits)"),
  photo: Yup.mixed()
    .nullable()
    .test(
      "fileType",
      "Only JPEG or PNG images are allowed",
      (value) => !value || ["image/jpeg", "image/png"].includes(value.type)
    )
    .test(
      "fileSize",
      "Photo size cannot exceed 5MB",
      (value) => !value || value.size <= 5 * 1024 * 1024
    ),
});

const ReturnBillForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const refMemoNumber = location.state?.memoNumber || "";
  const supplierEmailFromLocation = location.state?.supplierEmail || "";
  const productsFromLocation = location.state?.products || [];
  console.log(productsFromLocation)
  const memoid = location.state?.memoid || null;
  console.log(memoid, "memoid");
  const id = location.state?.id || null;

  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [supplierEmail, setSupplierEmail] = useState(supplierEmailFromLocation);
  const [isAddingEmail, setIsAddingEmail] = useState(!supplierEmailFromLocation);
  const [newSupplierEmail, setNewSupplierEmail] = useState("");
  const [isEditMode, setIsEditMode] = useState(!!id);
  const [products, setProducts] = useState(productsFromLocation);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [existingPhoto, setExistingPhoto] = useState(null);

  const formik = useFormik({
    initialValues: {
      date: new Date().toISOString().slice(0, 16),
      refMemoNumber: refMemoNumber,
      collectionBoyName: "",
      mobileNumber: "",
      photo: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      setSubmissionLoading(true);
      const emailToUse = isAddingEmail ? newSupplierEmail : supplierEmail;

      if (!emailToUse) {
        Swal.fire({
          title: "Error!",
          text: "Supplier email is required. Please provide an email.",
          icon: "error",
          confirmButtonText: "OK",
        });
        setSubmissionLoading(false);
        return;
      }

      try {
        const formData = new FormData();
        formData.append("email", emailToUse);
        formData.append("date", values.date);
        formData.append("memo_no", values.refMemoNumber);
        formData.append("collection_boy_name", values.collectionBoyName);
        formData.append("mobile_no", values.mobileNumber);
        if (values.photo) {
          formData.append("photo", values.photo);
        }
        formData.append("products", JSON.stringify(products));

        if (isEditMode) {
      
          await UpdateReturnOrder(id, formData);
          Swal.fire({
            title: "Success!",
            text: "Return bill data has been updated successfully!",
            icon: "success",
            confirmButtonText: "OK",
          });
        } else {
       
          await PostReturneOrder(formData);
          Swal.fire({
            title: "Success!",
            text: "Return bill data has been submitted successfully!",
            icon: "success",
            confirmButtonText: "OK",
          });
        }

        setTimeout(() => {
          formik.resetForm();
          setPhotoPreview(null);
          navigate("/return-bill");
        }, 2000);
      } catch (error) {
        console.error("Error submitting data:", error);
        Swal.fire({
          title: "Error!",
          text: error?.message || `Failed to ${isEditMode ? "update" : "submit"} data.`,
          icon: "error",
          confirmButtonText: "OK",
        });
      } finally {
        setSubmissionLoading(false);
      }
    },
  });

  useEffect(() => {
    if (id) {
      const fetchReturnOrder = async () => {
        try {
          const response = await GetReturnOrderById(id);
          const data = response?.data || response;
          console.log("Fetched return order data:", data);

          const date = data?.date ? new Date(data.date) : new Date();
          const formattedDate = isNaN(date.getTime())
            ? new Date().toISOString().slice(0, 16)
            : date.toISOString().slice(0, 16);

          formik.setValues({
            date: formattedDate,
            refMemoNumber: data?.memo_no_name || "",
            collectionBoyName: data?.collection_boy_name || "",
            mobileNumber: data?.mobile_no || "",
            photo: null, 
          });

          setSupplierEmail(data?.email || "");
          setNewSupplierEmail(data?.email || "");
          setIsAddingEmail(false);
          setProducts(data?.products || productsFromLocation);
          setExistingPhoto(data?.photo ? `${import.meta.env.VITE_API_BASE_URL}${data.photo}` : null);
        } catch (error) {
          console.error("Error fetching return order:", error);
          Swal.fire({
            title: "Error!",
            text: "Failed to fetch return order data.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      };
      fetchReturnOrder();
    }
  }, [id]);

  useEffect(() => {
    if (formik.values.photo) {
      const previewUrl = URL.createObjectURL(formik.values.photo);
      setPhotoPreview(previewUrl);

      return () => URL.revokeObjectURL(previewUrl);
    } else {
      setPhotoPreview(null);
    }
  }, [formik.values.photo]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Inventory"
            breadcrumbItem={isEditMode ? "Edit Return Bill" : "Add Return Bill"}
          />
          <Row>
            <Col xs="12">
              <Card
                className="shadow-lg"
                style={{ borderRadius: "15px", overflow: "hidden" }}
              >
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
                      {isEditMode ? "Edit Return Bill" : "Add Return Bill"}
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
                      <i
                        className="bx bx-undo"
                        style={{ fontSize: "30px" }}
                      ></i>
                    </Button>
                  </div>

                  <Form onSubmit={formik.handleSubmit}>
                    <Row className="g-4">
                      {/* Date */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="date"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Date
                          </Label>
                          <Input
                            type="datetime-local"
                            name="date"
                            id="date"
                            value={formik.values.date}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.date && formik.errors.date
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.touched.date && formik.errors.date && (
                            <div className="invalid-feedback">
                              {formik.errors.date}
                            </div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* Ref. Memo Number (Read-only) */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="refMemoNumber"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Ref. Memo Number
                          </Label>
                          <Input
                            type="text"
                            name="refMemoNumber"
                            id="refMemoNumber"
                            value={formik.values.refMemoNumber}
                            readOnly
                            className={`form-control ${
                              formik.touched.refMemoNumber &&
                              formik.errors.refMemoNumber
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                              backgroundColor: "#f1f1f1",
                            }}
                          />
                          {formik.touched.refMemoNumber &&
                            formik.errors.refMemoNumber && (
                              <div className="invalid-feedback">
                                {formik.errors.refMemoNumber}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      {/* Collection Boy Name */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="collectionBoyName"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Collection Boy Name
                          </Label>
                          <Input
                            type="text"
                            name="collectionBoyName"
                            id="collectionBoyName"
                            placeholder="Enter collection boy name"
                            value={formik.values.collectionBoyName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.collectionBoyName &&
                              formik.errors.collectionBoyName
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.touched.collectionBoyName &&
                            formik.errors.collectionBoyName && (
                              <div className="invalid-feedback">
                                {formik.errors.collectionBoyName}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      {/* Mobile Number */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="mobileNumber"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Mobile Number
                          </Label>
                          <Input
                            type="text"
                            name="mobileNumber"
                            id="mobileNumber"
                            placeholder="Enter mobile number"
                            value={formik.values.mobileNumber}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.mobileNumber &&
                              formik.errors.mobileNumber
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.touched.mobileNumber &&
                            formik.errors.mobileNumber && (
                              <div className="invalid-feedback">
                                {formik.errors.mobileNumber}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      {/* Photo */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="photo"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Photo (Optional)
                          </Label>
                          <Input
                            type="file"
                            name="photo"
                            id="photo"
                            accept="image/jpeg,image/png"
                            onChange={(event) => {
                              formik.setFieldValue(
                                "photo",
                                event.currentTarget.files[0]
                              );
                            }}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.photo && formik.errors.photo
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.touched.photo && formik.errors.photo && (
                            <div className="invalid-feedback">
                              {formik.errors.photo}
                            </div>
                          )}
                          {/* Photo Preview */}
                          {(photoPreview || (isEditMode && existingPhoto)) && (
                            <div className="mt-3">
                              <Label className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                Photo Preview
                              </Label>
                              <div>
                                <img
                                  src={photoPreview || existingPhoto}
                                  alt="Photo Preview"
                                  style={{
                                    maxWidth: "200px",
                                    maxHeight: "200px",
                                    borderRadius: "8px",
                                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                    objectFit: "cover",
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* Supplier Email */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="supplierEmail"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Supplier Email
                          </Label>
                          {supplierEmail && !isAddingEmail ? (
                            <div className="d-flex align-items-center">
                              <Input
                                type="email"
                                value={supplierEmail}
                                readOnly
                                className="form-control"
                                style={{
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  padding: "10px",
                                  backgroundColor: "#f1f1f1",
                                }}
                              />
                              <Button
                                color="link"
                                size="sm"
                                onClick={() => setIsAddingEmail(true)}
                                style={{ marginLeft: "10px" }}
                              >
                                Change Email
                              </Button>
                            </div>
                          ) : (
                            <div>
                              <Input
                                type="email"
                                value={newSupplierEmail}
                                onChange={(e) =>
                                  setNewSupplierEmail(e.target.value)
                                }
                                placeholder="Enter supplier email"
                                className="form-control"
                                style={{
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  padding: "10px",
                                }}
                                required
                              />
                              {supplierEmail && (
                                <Button
                                  color="link"
                                  size="sm"
                                  onClick={() => {
                                    setIsAddingEmail(false);
                                    setNewSupplierEmail("");
                                  }}
                                  style={{ marginTop: "10px" }}
                                >
                                  Cancel and Use Original Email
                                </Button>
                              )}
                            </div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* Submit Button */}
                      <Col md="12" className="text-end">
                        <Button
                          type="submit"
                          color="primary"
                          disabled={formik.isSubmitting || submissionLoading}
                          style={{
                            padding: "10px 25px",
                            borderRadius: "8px",
                            boxShadow: "0 4px 10px rgba(0, 123, 255, 0.3)",
                            transition: "transform 0.3s ease",
                          }}
                          className="hover-scale"
                        >
                          {submissionLoading
                            ? isEditMode
                              ? "Updating..."
                              : "Submitting..."
                            : isEditMode
                            ? "Update"
                            : "Submit"}
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Inline CSS */}
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

export default ReturnBillForm;