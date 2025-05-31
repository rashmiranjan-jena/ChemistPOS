import React, { useEffect, useState } from "react";
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
  postMeasurementUnit,
  getMeasurementUnitById,
  updateMeasurementUnit,
} from "../../../ApiService/UnitMeasurement/Measurementunit";
import { getDrugs } from "../../../ApiService/Drugs/DrugForm";
import { getUnitTypes,postUnitType } from "../../../ApiService/UnitMeasurement/Measurementunit";

const validationSchema = Yup.object().shape({
  // drugForm: Yup.string().required("Drug Form is required"),
  // packType: Yup.string().required("Pack Type is required"),
  // unitType: Yup.string().required("Unit Type is required"), // Add this field
  // quantity: Yup.number()
  //   .required("Quantity is required")
  //   .positive("Quantity must be positive")
  //   .integer("Quantity must be an integer"),
  // measurement: Yup.string().required("Measurement is required"),
});

const Measurementunit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditMode, setIsEditMode] = useState(false);
  const [unitId, setUnitId] = useState(null);
  const [drugForms, setDrugForms] = useState([]);
  const [unitTypes, setUnitTypes] = useState([]); 
  const [showNewUnitTypeInput, setShowNewUnitTypeInput] = useState(false);
  const [newUnitType, setNewUnitType] = useState("");

  useEffect(() => {
    fetchDrugForms();
    fetchUnitTypes();
    if (location?.state?.id) {
      setIsEditMode(true);
      setUnitId(location.state.id);
      fetchMeasurementUnit(location.state.id);
    }
  }, [location?.state]);

  const fetchDrugForms = async () => {
    try {
      const response = await getDrugs();
      setDrugForms(response || []);
    } catch (error) {
      console.error("Error fetching drug forms:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to fetch drug forms.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const fetchUnitTypes = async () => {
    try {
      const response = await getUnitTypes();
      setUnitTypes(response || []);
    } catch (error) {
      console.error("Error fetching unit types:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to fetch unit types.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const fetchMeasurementUnit = async (id) => {
    try {
      const data = await getMeasurementUnitById(id);
      formik.setValues({
        drugForm: data?.drug_form_id || "",
        packType: data?.pack_type || "",
        unitType: data?.unit_type || "", 
        quantity: data?.quantity || "",
        measurement: data?.measurement || "",
      });
    } catch (error) {
      console.error("Error fetching measurement unit:", error);
      Swal.fire({
        title: "Error!",
        text: error?.message || "Failed to fetch measurement unit data.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleAddNewUnitType = async () => {
    if (!newUnitType.trim()) {
      Swal.fire({
        title: "Error!",
        text: "Please enter a valid unit type",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }
  
    try {
      const response = await postUnitType({ unit_type: newUnitType });
      if (response) {
        await fetchUnitTypes();
        formik.setFieldValue("unitType", response.id);
        setNewUnitType("");
        setShowNewUnitTypeInput(false);
        Swal.fire({
          title: "Success!",
          text: "Unit type added successfully",
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error creating unit type:", error);
      Swal.fire({
        title: "Error!",
        text: error?.message || "Failed to create unit type",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };
  

  const formik = useFormik({
    initialValues: {
      drugForm: "",
      packType: "",
      unitType: "", 
      quantity: "",
      measurement: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("drug_form_id", values.drugForm);
        formData.append("pack_type", values.packType);
        formData.append("unit_type", values.unitType);
        formData.append("quantity", values.quantity);
        formData.append("measurement", values.measurement);

        let response;
        if (isEditMode) {
          response = await updateMeasurementUnit(unitId, formData);
          Swal.fire({
            title: "Measurement Unit Updated!",
            text: "The measurement unit has been successfully updated.",
            icon: "success",
            confirmButtonText: "OK",
          });
        } else {
          response = await postMeasurementUnit(formData);
          Swal.fire({
            title: "Measurement Unit Registered!",
            text: "The measurement unit has been successfully registered.",
            icon: "success",
            confirmButtonText: "OK",
          });
        }

        if (response) {
          formik.resetForm();
          navigate("/measurementunitlist");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        Swal.fire({
          title: "Error!",
          text:
            error?.message || "Failed to submit the form. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    },
  });

  document.title = "Measurement Unit Registration";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Measurement Units"
            breadcrumbItem={
              isEditMode ? "Edit Measurement Unit" : "Add Measurement Unit"
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
                        ? "Edit Measurement Unit"
                        : "Add Measurement Unit"}
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
                        style={{ fontSize: "18px" }}
                      ></i>
                    </Button>
                  </div>

                  <Form onSubmit={formik.handleSubmit}>
                    <Row className="g-4">
                      {/* Drug Form Dropdown */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="drugForm"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Drug Form
                          </Label>
                          <Input
                            type="select"
                            name="drugForm"
                            id="drugForm"
                            value={formik.values.drugForm}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.drugForm && formik.errors.drugForm
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          >
                            <option value="">Select Drug Form</option>
                            {drugForms.map((form) => (
                              <option
                                key={form.drug_form_id}
                                value={form.drug_form_id}
                              >
                                {form.drug_form_name}
                              </option>
                            ))}
                          </Input>
                          {formik.touched.drugForm &&
                            formik.errors.drugForm && (
                              <div className="invalid-feedback">
                                {formik.errors.drugForm}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      {/* Pack Type Dropdown */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="packType"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Pack Type
                          </Label>
                          <Input
                            type="text"
                            name="packType"
                            id="packType"
                            placeholder="Enter pack type"
                            value={formik.values.packType}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.packType && formik.errors.packType
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.touched.packType &&
                            formik.errors.packType && (
                              <div className="invalid-feedback">
                                {formik.errors.packType}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      {/* Unit Type Dropdown with Add New Option */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="unitType"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Unit Type
                          </Label>
                          {!showNewUnitTypeInput ? (
                            <div className="d-flex">
                              <Input
                                type="select"
                                name="unitType"
                                id="unitType"
                                value={formik.values.unitType}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`form-control ${
                                  formik.touched.unitType &&
                                  formik.errors.unitType
                                    ? "is-invalid"
                                    : ""
                                }`}
                                style={{
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  padding: "10px",
                                  flex: 1,
                                  marginRight: "10px",
                                }}
                              >
                                <option value="">Select Unit Type</option>
                                {unitTypes.map((unit) => (
                                  <option
                                    key={unit.id}
                                    value={unit.id}
                                  >
                                    {unit.unit_type}
                                  </option>
                                ))}
                              </Input>
                              <Button
                                color="info"
                                onClick={() => setShowNewUnitTypeInput(true)}
                                style={{
                                  borderRadius: "8px",
                                  padding: "0 15px",
                                }}
                              >
                                <i className="bx bx-plus"></i>
                              </Button>
                            </div>
                          ) : (
                            <div className="d-flex">
                              <Input
                                type="text"
                                placeholder="Enter new unit type"
                                value={newUnitType}
                                onChange={(e) => setNewUnitType(e.target.value)}
                                style={{
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  padding: "10px",
                                  flex: 1,
                                  marginRight: "10px",
                                }}
                              />
                              <Button
                                color="success"
                                onClick={handleAddNewUnitType}
                                style={{
                                  borderRadius: "8px",
                                  padding: "0 15px",
                                  marginRight: "10px",
                                }}
                              >
                                <i className="bx bx-check"></i>
                              </Button>
                              <Button
                                color="danger"
                                onClick={() => {
                                  setShowNewUnitTypeInput(false);
                                  setNewUnitType("");
                                }}
                                style={{
                                  borderRadius: "8px",
                                  padding: "0 15px",
                                }}
                              >
                                <i className="bx bx-x"></i>
                              </Button>
                            </div>
                          )}
                          {formik.touched.unitType &&
                            formik.errors.unitType && (
                              <div className="invalid-feedback">
                                {formik.errors.unitType}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      {/* Measurement */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="measurement"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Measurement
                          </Label>
                          <Input
                            type="text"
                            name="measurement"
                            id="measurement"
                            placeholder="Enter measurement"
                            value={formik.values.measurement}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.measurement &&
                              formik.errors.measurement
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.touched.measurement &&
                            formik.errors.measurement && (
                              <div className="invalid-feedback">
                                {formik.errors.measurement}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      {/* Quantity */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="quantity"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Quantity
                          </Label>
                          <Input
                            type="number"
                            name="quantity"
                            id="quantity"
                            placeholder="Enter quantity"
                            value={formik.values.quantity}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.quantity && formik.errors.quantity
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.touched.quantity &&
                            formik.errors.quantity && (
                              <div className="invalid-feedback">
                                {formik.errors.quantity}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      {/* Buttons */}
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
                            marginRight: "10px",
                          }}
                          className="hover-scale"
                        >
                          {formik.isSubmitting
                            ? "Processing..."
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

      {/* Inline CSS for hover effects */}
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

export default Measurementunit;
