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
  getReturnBillById,
  postReturnAdjustment,
} from "../../ApiService/ReturnDrug/ReturnProduct";

// Validation schema using Yup
const validationSchema = Yup.object({
  adjDate: Yup.date()
    .required("Adjustment Date is required")
    .typeError("Invalid date format"),
  purchaseBillNumber: Yup.string()
    .required("Purchase Bill Number is required")
    .max(50, "Purchase Bill Number cannot exceed 50 characters"),
  adjAmount: Yup.number()
    .required("Adjustment Amount is required")
    .min(0, "Adjustment Amount cannot be negative")
    .test(
      "max-amount",
      "Adjustment Amount cannot exceed Return Bill Amount",
      function (value) {
        return value <= this.parent.amount;
      }
    ),
  adjStatus: Yup.string().required("Adjustment Status is required"),
});

const ReturnAdjustmentForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // State for API data
  const [billData, setBillData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const billId = location.state?.id;

  useEffect(() => {
    if (!billId) {
      console.error("No bill ID provided");
      setError("No bill ID provided");
      setLoading(false);
      return;
    }

    const fetchBillData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getReturnBillById(billId);
        console.log("getReturnBillById response:", response);
        setBillData({
          return_bill_id: response?.return_bill_id,
          returnBillNumber: response?.return_bill_no,
          date: new Date(response?.date).toISOString().slice(0, 16),
          supplier: response?.supplier,
          amount: response?.amount,
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching return bill:", err);
        setError("Failed to load return bill data. Please try again.");
        setLoading(false);
        Swal.fire({
          title: "Error!",
          text: err.message || "Failed to load return bill data.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };

    fetchBillData();
  }, [billId]);

  // Log billData to debug submit button disabled state
  useEffect(() => {
    console.log("billData:", billData);
    console.log("loading:", loading);
    console.log("billData?.return_bill_id:", billData?.return_bill_id);
  }, [billData, loading]);

  const initialValues = billData
    ? {
        returnBillNumber: billData?.returnBillNumber || "",
        date: billData?.date || "",
        supplier: billData?.supplier || "",
        amount: billData?.amount || 0,
        adjDate: new Date().toISOString().slice(0, 16),
        purchaseBillNumber: "",
        adjAmount: "",
        adjStatus: "",
      }
    : {
        returnBillNumber: "",
        date: "",
        supplier: "",
        amount: 0,
        adjDate: new Date().toISOString().slice(0, 16),
        purchaseBillNumber: "",
        adjAmount: "",
        adjStatus: "",
      };

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      console.log("Form values on submit:", values);
      console.log("Form errors:", formik.errors);
      console.log("Form touched:", formik.touched);

      if (!billData?.return_bill_id) {
        console.error("Missing return_bill_id");
        Swal.fire({
          title: "Error!",
          text: "Return bill ID is missing. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
        setSubmitting(false);
        return;
      }

      const returnLoss = values.amount - (values.adjAmount || 0);
      const submissionData = {
        bill_id : billData?.return_bill_id,
        Date: values?.date,
        "adjustment_date": values?.adjDate,
        "purchase_bill_no": values?.purchaseBillNumber,
        "adjustment_amount": Number(values?.adjAmount),
        "status": values?.adjStatus,
        "return_loss": returnLoss,
      };

      console.log("Submission payload:", submissionData);

      try {
        await postReturnAdjustment(submissionData);
        Swal.fire({
          title: "Success!",
          text: "Return Adjustment submitted successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });
        setSubmitting(false);
        navigate("/return-adjustment");
      } catch (err) {
        console.error("Error submitting return adjustment:", err);
        Swal.fire({
          title: "Error!",
          text: err.message || "Failed to submit return adjustment.",
          icon: "error",
          confirmButtonText: "OK",
        });
        setSubmitting(false);
      }
    },
  });

  const {
    values,
    errors,
    touched,
    handleSubmit,
    handleChange,
    handleBlur,
    isSubmitting,
  } = formik;

  // Log submit button disabled state
  useEffect(() => {
    console.log("Submit button disabled:", {
      isSubmitting,
      loading,
      hasReturnBillId: !!billData?.return_bill_id,
    });
  }, [isSubmitting, loading, billData]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Inventory"
            breadcrumbItem="Add Return Adjustment"
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
                      Add Return Adjustment
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

                  {loading ? (
                    <div className="text-center">
                      Loading return bill data...
                    </div>
                  ) : error ? (
                    <div className="alert alert-danger">{error}</div>
                  ) : (
                    <Form onSubmit={handleSubmit}>
                      <Row className="g-4">
                        {/* Return Bill Number (Auto-fetched, Disabled) */}
                        <Col md="6">
                          <FormGroup>
                            <Label
                              for="returnBillNumber"
                              className="fw-bold text-dark"
                              style={{ fontSize: "14px" }}
                            >
                              Return Bill Number
                            </Label>
                            <Input
                              type="text"
                              name="returnBillNumber"
                              id="returnBillNumber"
                              value={values?.returnBillNumber || ""}
                              disabled
                              className="form-control"
                              style={{
                                borderRadius: "8px",
                                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                padding: "10px",
                              }}
                            />
                          </FormGroup>
                        </Col>

                        {/* Date (Auto-fetched, Disabled) */}
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
                              type="text"
                              name="date"
                              id="date"
                              value={values?.date || ""}
                              disabled
                              className="form-control"
                              style={{
                                borderRadius: "8px",
                                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                padding: "10px",
                              }}
                            />
                          </FormGroup>
                        </Col>

                        {/* Supplier (Auto-fetched, Disabled) */}
                        <Col md="6">
                          <FormGroup>
                            <Label
                              for="supplier"
                              className="fw-bold text-dark"
                              style={{ fontSize: "14px" }}
                            >
                              Supplier
                            </Label>
                            <Input
                              type="text"
                              name="supplier"
                              id="supplier"
                              value={values?.supplier || ""}
                              disabled
                              className="form-control"
                              style={{
                                borderRadius: "8px",
                                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                padding: "10px",
                              }}
                            />
                          </FormGroup>
                        </Col>

                        {/* Amount (Auto-fetched, Disabled) */}
                        <Col md="6">
                          <FormGroup>
                            <Label
                              for="amount"
                              className="fw-bold text-dark"
                              style={{ fontSize: "14px" }}
                            >
                              Amount
                            </Label>
                            <Input
                              type="number"
                              name="amount"
                              id="amount"
                              value={values?.amount || 0}
                              disabled
                              className="form-control"
                              style={{
                                borderRadius: "8px",
                                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                padding: "10px",
                              }}
                            />
                          </FormGroup>
                        </Col>

                        {/* Adjustment Section */}
                        <Col md="12">
                          <h5
                            className="mb-3 d-flex align-items-center gap-2"
                            style={{
                              fontWeight: "600",
                              color: "#007bff",
                              borderBottom: "2px solid #007bff",
                              paddingBottom: "5px",
                            }}
                          >
                            Adjustment
                          </h5>
                        </Col>

                        {/* Adj. Date (Editable) */}
                        <Col md="6">
                          <FormGroup>
                            <Label
                              for="adjDate"
                              className="fw-bold text-dark"
                              style={{ fontSize: "14px" }}
                            >
                              Adjustment Date
                            </Label>
                            <Input
                              type="datetime-local"
                              name="adjDate"
                              id="adjDate"
                              value={values?.adjDate || ""}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className={`form-control ${
                                errors?.adjDate && touched?.adjDate
                                  ? "is-invalid"
                                  : ""
                              }`}
                              style={{
                                borderRadius: "8px",
                                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                padding: "10px",
                              }}
                            />
                            {errors?.adjDate && touched?.adjDate && (
                              <div className="invalid-feedback">
                                {errors.adjDate}
                              </div>
                            )}
                          </FormGroup>
                        </Col>

                        {/* Purchase Bill Number (Input) */}
                        <Col md="6">
                          <FormGroup>
                            <Label
                              for="purchaseBillNumber"
                              className="fw-bold text-dark"
                              style={{ fontSize: "14px" }}
                            >
                              Purchase Bill Number
                            </Label>
                            <Input
                              type="text"
                              name="purchaseBillNumber"
                              id="purchaseBillNumber"
                              placeholder="Enter purchase bill number"
                              value={values?.purchaseBillNumber || ""}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className={`form-control ${
                                errors?.purchaseBillNumber &&
                                touched?.purchaseBillNumber
                                  ? "is-invalid"
                                  : ""
                              }`}
                              style={{
                                borderRadius: "8px",
                                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                padding: "10px",
                              }}
                            />
                            {errors?.purchaseBillNumber &&
                              touched?.purchaseBillNumber && (
                                <div className="invalid-feedback">
                                  {errors.purchaseBillNumber}
                                </div>
                              )}
                          </FormGroup>
                        </Col>

                        {/* Adj. Amount (Input) */}
                        <Col md="6">
                          <FormGroup>
                            <Label
                              for="adjAmount"
                              className="fw-bold text-dark"
                              style={{ fontSize: "14px" }}
                            >
                              Adjustment Amount
                            </Label>
                            <Input
                              type="number"
                              name="adjAmount"
                              id="adjAmount"
                              placeholder="Enter adjustment amount"
                              value={values?.adjAmount || ""}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className={`form-control ${
                                errors?.adjAmount && touched?.adjAmount
                                  ? "is-invalid"
                                  : ""
                              }`}
                              style={{
                                borderRadius: "8px",
                                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                padding: "10px",
                              }}
                            />
                            {errors?.adjAmount && touched?.adjAmount && (
                              <div className="invalid-feedback">
                                {errors.adjAmount}
                              </div>
                            )}
                          </FormGroup>
                        </Col>

                        {/* Adj. Status (Dropdown) */}
                        <Col md="6">
                          <FormGroup>
                            <Label
                              for="adjStatus"
                              className="fw-bold text-dark"
                              style={{ fontSize: "14px" }}
                            >
                              Adjustment Status
                            </Label>
                            <Input
                              type="select"
                              name="adjStatus"
                              id="adjStatus"
                              value={values?.adjStatus || ""}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className={`form-control ${
                                errors?.adjStatus && touched?.adjStatus
                                  ? "is-invalid"
                                  : ""
                              }`}
                              style={{
                                borderRadius: "8px",
                                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                padding: "10px",
                              }}
                            >
                              <option value="">Select Status</option>
                              <option value="partial">Partial</option>
                              <option value="complete">Complete</option>
                            </Input>
                            {errors?.adjStatus && touched?.adjStatus && (
                              <div className="invalid-feedback">
                                {errors.adjStatus}
                              </div>
                            )}
                          </FormGroup>
                        </Col>

                        {/* Return Loss (Calculated, Disabled) */}
                        <Col md="12">
                          <FormGroup>
                            <Label
                              for="returnLoss"
                              className="fw-bold text-dark"
                              style={{ fontSize: "14px" }}
                            >
                              Return Loss
                            </Label>
                            <Input
                              type="number"
                              name="returnLoss"
                              id="returnLoss"
                              value={
                                (values?.amount || 0) -
                                  (values?.adjAmount || 0) || 0
                              }
                              disabled
                              className="form-control"
                              style={{
                                borderRadius: "8px",
                                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                padding: "10px",
                                backgroundColor: "#e9ecef",
                                fontWeight: "600",
                                color:
                                  (values?.amount || 0) -
                                    (values?.adjAmount || 0) <
                                  0
                                    ? "#dc3545"
                                    : "#28a745",
                              }}
                            />
                          </FormGroup>
                        </Col>

                        {/* Submit Button */}
                        <Col md="12" className="text-end">
                          <Button
                            type="submit"
                            color="primary"
                            disabled={
                              isSubmitting ||
                              loading ||
                              !billData?.return_bill_id ||
                              Object.keys(errors).length > 0
                            }
                            style={{
                              padding: "10px 25px",
                              borderRadius: "8px",
                              boxShadow: "0 4px 10px rgba(0, 123, 255, 0.3)",
                              transition: "transform 0.3s ease",
                            }}
                            className="hover-scale"
                          >
                            {isSubmitting ? "Submitting..." : "Submit"}
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  )}
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

export default ReturnAdjustmentForm;