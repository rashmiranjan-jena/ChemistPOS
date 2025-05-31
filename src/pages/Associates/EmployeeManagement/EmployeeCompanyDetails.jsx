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
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useNavigate, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import {
  addEmployeeCompanyDetails,
  getEmployeeCompanyDetailsById,
  updateEmployeeCompanyDetails,
  getDepartments,
  getDesignations,
  getStores,
} from "../../../ApiService/Associats/Employee";

// Validation schema with all fields optional
const validationSchema = Yup.object({
  department: Yup.string().nullable(),
  designation: Yup.string().nullable(),
  store: Yup.string().nullable(),
  doj: Yup.date()
    .nullable()
    .max(new Date(), "Date of Joining cannot be in the future"),
  dol: Yup.date()
    .nullable()
    .min(Yup.ref("doj"), "Date of Leaving cannot be before Date of Joining"),
  salaryDetails: Yup.number()
    .positive("Salary must be a positive number")
    .integer("Salary must be an integer")
    .nullable(),
});

const EmployeeCompanyDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditMode, setIsEditMode] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [stores, setStores] = useState([]);

  useEffect(() => {
    // Fetch dropdown options
    const fetchDropdownOptions = async () => {
      const deptData = await getDepartments();
      const desigData = await getDesignations();
      const storeData = await getStores();
      setDepartments(deptData || []);
      setDesignations(desigData || []);
      setStores(storeData || []);
    };

    fetchDropdownOptions();

    // Handle create/edit mode
    console.log("Location state:", location.state);
    if (location.state?.emp_id) {
      setIsEditMode(true);
      setEmployeeId(location.state.emp_id);
      fetchEmployeeCompanyDetails(location.state.emp_id);
    } else if (location.state?.id) {
      setIsEditMode(false);
      setEmployeeId(location.state.id);
    }
  }, [location.state]);

  const fetchEmployeeCompanyDetails = async (id) => {
    try {
      const data = await getEmployeeCompanyDetailsById(id);
      formik.setValues({
        department: data?.department_id || "",
        designation: data?.designation_id || "",
        store: data?.store_id || "",
        doj: data?.doj ? data.doj.split("T")[0] : "",
        dol: data?.dol ? data.dol.split("T")[0] : "",
        salaryDetails: data?.previous_salary || "",
      });
    } catch (error) {
      console.error("Error fetching employee company details:", error);
      Swal.fire({
        title: "Error!",
        text: error.message || "Failed to fetch employee company details.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const initialValues = {
    department: "",
    designation: "",
    store: "",
    doj: "",
    dol: "",
    salaryDetails: "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        console.log(
          "Submitting form with values:",
          values,
          "isEditMode:",
          isEditMode,
          "employeeId:",
          employeeId
        );

        const formData = new FormData();

        if (values.department) {
          formData.append("department_id", values.department);
        }
        if (values.designation) {
          formData.append("designation_id", values.designation);
        }
        if (values.store) {
          formData.append("store_id", values.store);
        }
        if (values.doj) {
          formData.append("doj", values.doj);
        }
        if (values.dol) {
          formData.append("dol", values.dol);
        }
        if (values.salaryDetails) {
          formData.append("previous_salary", values.salaryDetails);
        }

        console.log("FormData entries:", [...formData.entries()]);

        let response;
        if (isEditMode) {
          response = await updateEmployeeCompanyDetails(employeeId, formData);
          Swal.fire({
            title: "Employee Company Details Updated!",
            text: "The employee company details have been successfully updated.",
            icon: "success",
            confirmButtonText: "OK",
          });

          if (response) {
          formik.resetForm();
          navigate("/add-new-employee-list");
        }
        } else {
          response = await addEmployeeCompanyDetails(formData, employeeId);
          Swal.fire({
            title: "Employee Company Details Added!",
            text:
              response?.message ||
              "Employee company details added successfully!",
            icon: "success",
            confirmButtonText: "OK",
          });
          if (response) {
          formik.resetForm();
          navigate("/employee-education-details", {
            state: { id: employeeId },
          });
        }
        }

        
      } catch (error) {
        console.error("Form submission error:", error, error.stack);
        Swal.fire({
          title: "Error!",
          text: error.message || "Failed to submit the form. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleBack = () => {
    navigate(-1);
  };

  document.title = isEditMode
    ? "Edit Employee Company Details"
    : "Add Employee Company Details";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Employee Management"
            breadcrumbItem={
              isEditMode
                ? "Edit Employee Company Details"
                : "Add Employee Company Details"
            }
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
                      {isEditMode
                        ? "Edit Employee Company Details"
                        : "Add Employee Company Details"}
                    </h4>
                    <Button
                      color="secondary"
                      onClick={handleBack}
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
                      {/* Department Dropdown */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="department"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Department (Optional)
                          </Label>
                          <Input
                            type="select"
                            name="department"
                            id="department"
                            value={formik.values.department}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.department &&
                              formik.errors.department
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          >
                            <option value="">Select Department</option>
                            {departments.map((dept) => (
                              <option key={dept.department_id} value={dept.department_id}>
                                {dept.department_name}
                              </option>
                            ))}
                          </Input>
                          {formik.touched.department &&
                            formik.errors.department && (
                              <div className="invalid-feedback">
                                {formik.errors.department}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      {/* Designation Dropdown */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="designation"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Designation (Optional)
                          </Label>
                          <Input
                            type="select"
                            name="designation"
                            id="designation"
                            value={formik.values.designation}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.designation &&
                              formik.errors.designation
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          >
                            <option value="">Select Designation</option>
                            {designations.map((desig) => (
                              <option key={desig.designation_id} value={desig.designation_id}>
                                {desig.designation_name}
                              </option>
                            ))}
                          </Input>
                          {formik.touched.designation &&
                            formik.errors.designation && (
                              <div className="invalid-feedback">
                                {formik.errors.designation}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      {/* Store Dropdown */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="store"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Store (Optional)
                          </Label>
                          <Input
                            type="select"
                            name="store"
                            id="store"
                            value={formik.values.store}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.store && formik.errors.store
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          >
                            <option value="">Select Store</option>
                            {stores.map((store) => (
                              <option key={store.business_store_id} value={store.business_store_id}>
                                {store.store_name}
                              </option>
                            ))}
                          </Input>
                          {formik.touched.store && formik.errors.store && (
                            <div className="invalid-feedback">
                              {formik.errors.store}
                            </div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* Date of Joining */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="doj"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Date of Joining (Optional)
                          </Label>
                          <Input
                            type="date"
                            name="doj"
                            id="doj"
                            value={formik.values.doj}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.doj && formik.errors.doj
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.touched.doj && formik.errors.doj && (
                            <div className="invalid-feedback">
                              {formik.errors.doj}
                            </div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* Date of Leaving */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="dol"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Date of Leaving (Optional)
                          </Label>
                          <Input
                            type="date"
                            name="dol"
                            id="dol"
                            value={formik.values.dol}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.dol && formik.errors.dol
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.touched.dol && formik.errors.dol && (
                            <div className="invalid-feedback">
                              {formik.errors.dol}
                            </div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* Salary Details */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="salaryDetails"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Salary Details (in INR) (Optional)
                          </Label>
                          <Input
                            type="number"
                            name="salaryDetails"
                            id="salaryDetails"
                            placeholder="Enter salary"
                            value={formik.values.salaryDetails}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.salaryDetails &&
                              formik.errors.salaryDetails
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.touched.salaryDetails &&
                            formik.errors.salaryDetails && (
                              <div className="invalid-feedback">
                                {formik.errors.salaryDetails}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      {/* Submit Button */}
                      <Col md="12" className="text-end">
                        <Button
                          type="submit"
                          color="primary"
                          disabled={formik.isSubmitting}
                          style={{
                            padding: "10px 25px",
                            borderRadius: "8px",
                            boxShadow: "0 4px 10px rgba(0, 123, 255, 0.3)",
                            transition: "transform 0.3s ease",
                          }}
                          className="hover-scale"
                        >
                          {formik.isSubmitting
                            ? "Submitting..."
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

export default EmployeeCompanyDetails;
