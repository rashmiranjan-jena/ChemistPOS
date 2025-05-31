import React from "react";
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
  Table,
} from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";
import { Formik, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";

// Validation schema (unchanged)
const validationSchema = Yup.object({
  commissionTracking: Yup.object({
    earned: Yup.number()
      .required("Earned Commission is required")
      .min(0, "Earned Commission cannot be negative"),
    settlements: Yup.array().of(
      Yup.object({
        date: Yup.date().required("Date is required"),
        mode: Yup.string().required("Mode is required"),
        transactionId: Yup.string().required("Transaction ID is required"),
        amount: Yup.number()
          .required("Amount is required")
          .min(0, "Amount cannot be negative"),
      })
    ),
  }),
});

const DoctorActivityDetails = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const orderDetails = [
    {
      date: "2025-03-01",
      prescription: "RX123",
      patientName: "John Doe",
      billNo: "B001",
      billAmount: 1500,
      company: "PharmaCo",
      drug: "Paracetamol",
      quantity: 10,
    },
    {
      date: "2025-03-15",
      prescription: "RX124",
      patientName: "Jane Smith",
      billNo: "B002",
      billAmount: 2000,
      company: "MediCorp",
      drug: "Ibuprofen",
      quantity: 15,
    },
  ];

  const autoFetchedValues = {
    totalOrders: orderDetails.length,
    totalPatients: new Set(orderDetails.map(order => order.patientName)).size,
    totalBusiness: orderDetails.reduce((sum, order) => sum + order.billAmount, 0),
    totalQuantity: orderDetails.reduce((sum, order) => sum + order.quantity, 0),
  };

  const initialValues = {
    totalOrders: autoFetchedValues.totalOrders,
    totalPatients: autoFetchedValues.totalPatients,
    totalBusiness: autoFetchedValues.totalBusiness,
    totalQuantity: autoFetchedValues.totalQuantity,
    commissionTracking: {
      earned: "",
      settlements: [{ date: "", mode: "", transactionId: "", amount: "" }],
    },
  };

  const handleSubmit = (values, { setSubmitting }) => {
    console.log("Form Values:", values);
    setTimeout(() => {
      alert("Doctor activity details submitted successfully!");
      setSubmitting(false);
      navigate("/doctor-list");
    }, 1000);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Doctor Management"
            breadcrumbItem="Add Doctor Activity Details"
          />
          <Row>
            <Col xs="12">
              <Card className="shadow-lg" style={{ borderRadius: "15px", overflow: "hidden" }}>
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
                      Add Doctor Activity Details
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
                      <i className="bx bx-undo" style={{ fontSize: "30px" }}></i>
                    </Button>
                  </div>

                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ values, isSubmitting, errors, touched }) => (
                      <Form>
                        <Row className="g-4">
                          {/* Other Form Fields (unchanged) */}
                          <Col md="6">
                            <FormGroup>
                              <Label for="totalOrders" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                Total Orders
                              </Label>
                              <Input
                                type="number"
                                name="totalOrders"
                                id="totalOrders"
                                value={values.totalOrders}
                                disabled
                                className="form-control"
                                style={{
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  padding: "10px",
                                  backgroundColor: "#f8f9fa",
                                }}
                              />
                            </FormGroup>
                          </Col>
                          <Col md="6">
                            <FormGroup>
                              <Label for="totalPatients" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                Total Patients
                              </Label>
                              <Input
                                type="number"
                                name="totalPatients"
                                id="totalPatients"
                                value={values.totalPatients}
                                disabled
                                className="form-control"
                                style={{
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  padding: "10px",
                                  backgroundColor: "#f8f9fa",
                                }}
                              />
                            </FormGroup>
                          </Col>
                          <Col md="6">
                            <FormGroup>
                              <Label for="totalBusiness" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                Total Business (INR)
                              </Label>
                              <Input
                                type="number"
                                name="totalBusiness"
                                id="totalBusiness"
                                value={values.totalBusiness}
                                disabled
                                className="form-control"
                                style={{
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  padding: "10px",
                                  backgroundColor: "#f8f9fa",
                                }}
                              />
                            </FormGroup>
                          </Col>
                          <Col md="6">
                            <FormGroup>
                              <Label for="totalQuantity" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                Total Quantity
                              </Label>
                              <Input
                                type="number"
                                name="totalQuantity"
                                id="totalQuantity"
                                value={values.totalQuantity}
                                disabled
                                className="form-control"
                                style={{
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  padding: "10px",
                                  backgroundColor: "#f8f9fa",
                                }}
                              />
                            </FormGroup>
                          </Col>

                          {/* Order Details Table (unchanged) */}
                          <Col md="12">
                            <h5 className="text-dark mt-3 mb-3" style={{ fontWeight: "600" }}>
                              Order Details
                            </h5>
                            <div className="table-responsive">
                              <Table className="custom-table">
                                <thead>
                                  <tr>
                                    <th>Date</th>
                                    <th>Prescription</th>
                                    <th>Patient Name</th>
                                    <th>Bill No.</th>
                                    <th className="text-end">Bill Amount (INR)</th>
                                    <th>Company</th>
                                    <th>Drug</th>
                                    <th className="text-end">Quantity</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {orderDetails.map((order, index) => (
                                    <tr key={index}>
                                      <td>{order.date}</td>
                                      <td>{order.prescription}</td>
                                      <td>{order.patientName}</td>
                                      <td>{order.billNo}</td>
                                      <td className="text-end">{order.billAmount.toLocaleString()}</td>
                                      <td>{order.company}</td>
                                      <td>{order.drug}</td>
                                      <td className="text-end">{order.quantity}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </Table>
                            </div>
                          </Col>

                          {/* Commission Tracking Table with Labeled Fields */}
                          <Col md="12">
                            <h5 className="text-dark mt-3 mb-3" style={{ fontWeight: "600" }}>
                              Commission Tracking (INR)
                            </h5>
                            <div className="table-responsive">
                              <Table className="custom-table">
                                <thead>
                                  <tr>
                                    <th>Total Earned</th>
                                    <th>Settled</th>
                                    <th>Due</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>
                                      <Field
                                        as={Input}
                                        type="number"
                                        name="commissionTracking.earned"
                                        id="commissionTracking.earned"
                                        placeholder="Enter earned commission"
                                        className={`form-control ${errors.commissionTracking?.earned && touched.commissionTracking?.earned ? "is-invalid" : ""}`}
                                        style={{
                                          borderRadius: "6px",
                                          padding: "8px",
                                          border: "1px solid #e0e0e0",
                                        }}
                                      />
                                      <ErrorMessage
                                        name="commissionTracking.earned"
                                        component="div"
                                        className="invalid-feedback"
                                      />
                                    </td>
                                    <td>
                                      {values.commissionTracking.settlements
                                        .reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
                                        .toLocaleString()}
                                      <FieldArray name="commissionTracking.settlements">
                                        {({ push, remove }) => (
                                          <div>
                                            <Table size="sm" className="nested-table mt-2">
                                              <tbody>
                                                {values.commissionTracking.settlements.map(
                                                  (settlement, index) => (
                                                    <tr key={index}>
                                                      <td>
                                                        <div className="field-container">
                                                          <Field
                                                            as={Input}
                                                            type="date"
                                                            name={`commissionTracking.settlements.${index}.date`}
                                                            className={`form-control ${errors.commissionTracking?.settlements?.[index]?.date && touched.commissionTracking?.settlements?.[index]?.date ? "is-invalid" : ""}`}
                                                            style={{
                                                              borderRadius: "6px",
                                                              padding: "6px",
                                                              border: "1px solid #e0e0e0",
                                                            }}
                                                          />
                                                          <div className="field-label">Date</div>
                                                          <ErrorMessage
                                                            name={`commissionTracking.settlements.${index}.date`}
                                                            component="div"
                                                            className="invalid-feedback"
                                                          />
                                                        </div>
                                                      </td>
                                                      <td>
                                                        <div className="field-container">
                                                          <Field
                                                            as={Input}
                                                            type="select"
                                                            name={`commissionTracking.settlements.${index}.mode`}
                                                            className={`form-control ${errors.commissionTracking?.settlements?.[index]?.mode && touched.commissionTracking?.settlements?.[index]?.mode ? "is-invalid" : ""}`}
                                                            style={{
                                                              borderRadius: "6px",
                                                              padding: "6px",
                                                              border: "1px solid #e0e0e0",
                                                            }}
                                                          >
                                                            <option value="">Select Mode</option>
                                                            <option value="Bank Transfer">Bank Transfer</option>
                                                            <option value="UPI">UPI</option>
                                                            <option value="Cash">Cash</option>
                                                            <option value="Cheque">Cheque</option>
                                                          </Field>
                                                          <div className="field-label">Mode of Transaction</div>
                                                          <ErrorMessage
                                                            name={`commissionTracking.settlements.${index}.mode`}
                                                            component="div"
                                                            className="invalid-feedback"
                                                          />
                                                        </div>
                                                      </td>
                                                      <td>
                                                        <div className="field-container">
                                                          <Field
                                                            as={Input}
                                                            type="text"
                                                            name={`commissionTracking.settlements.${index}.transactionId`}
                                                            placeholder="Transaction ID"
                                                            className={`form-control ${errors.commissionTracking?.settlements?.[index]?.transactionId && touched.commissionTracking?.settlements?.[index]?.transactionId ? "is-invalid" : ""}`}
                                                            style={{
                                                              borderRadius: "6px",
                                                              padding: "6px",
                                                              border: "1px solid #e0e0e0",
                                                            }}
                                                          />
                                                          <div className="field-label">Transaction ID</div>
                                                          <ErrorMessage
                                                            name={`commissionTracking.settlements.${index}.transactionId`}
                                                            component="div"
                                                            className="invalid-feedback"
                                                          />
                                                        </div>
                                                      </td>
                                                      <td>
                                                        <div className="field-container">
                                                          <Field
                                                            as={Input}
                                                            type="number"
                                                            name={`commissionTracking.settlements.${index}.amount`}
                                                            placeholder="Amount"
                                                            className={`form-control ${errors.commissionTracking?.settlements?.[index]?.amount && touched.commissionTracking?.settlements?.[index]?.amount ? "is-invalid" : ""}`}
                                                            style={{
                                                              borderRadius: "6px",
                                                              padding: "6px",
                                                              border: "1px solid #e0e0e0",
                                                            }}
                                                          />
                                                          <div className="field-label">Amount</div>
                                                          <ErrorMessage
                                                            name={`commissionTracking.settlements.${index}.amount`}
                                                            component="div"
                                                            className="invalid-feedback"
                                                          />
                                                        </div>
                                                      </td>
                                                      <td>
                                                        {index > 0 && (
                                                          <Button
                                                            color="danger"
                                                            size="sm"
                                                            onClick={() => remove(index)}
                                                            style={{
                                                              borderRadius: "6px",
                                                              padding: "4px 8px",
                                                            }}
                                                          >
                                                            X
                                                          </Button>
                                                        )}
                                                      </td>
                                                    </tr>
                                                  )
                                                )}
                                              </tbody>
                                            </Table>
                                            <Button
                                              color="primary"
                                              size="sm"
                                              onClick={() =>
                                                push({
                                                  date: "",
                                                  mode: "",
                                                  transactionId: "",
                                                  amount: "",
                                                })
                                              }
                                              style={{
                                                borderRadius: "6px",
                                                marginTop: "10px",
                                                padding: "6px 12px",
                                              }}
                                            >
                                              Add Settlement
                                            </Button>
                                          </div>
                                        )}
                                      </FieldArray>
                                    </td>
                                    <td>
                                      {(
                                        (values.commissionTracking.earned || 0) -
                                        values.commissionTracking.settlements.reduce(
                                          (sum, item) => sum + (Number(item.amount) || 0),
                                          0
                                        )
                                      ).toLocaleString()}
                                    </td>
                                  </tr>
                                </tbody>
                              </Table>
                            </div>
                          </Col>

                          {/* Submit Button (unchanged) */}
                          <Col md="12" className="text-end">
                            <Button
                              type="submit"
                              color="primary"
                              disabled={isSubmitting}
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
                  </Formik>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <style jsx>{`
        /* Custom Table Styling */
        .custom-table {
          background: #ffffff;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          border-collapse: separate;
          border-spacing: 0;
          overflow: hidden;
          margin-bottom: 20px;
        }

        .custom-table thead th {
          background: linear-gradient(90deg, #f8f9fa, #e9ecef);
          color: #333;
          font-weight: 600;
          font-size: 14px;
          padding: 12px 16px;
          border-bottom: 2px solid #dee2e6;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .custom-table tbody tr {
          transition: background-color 0.2s ease;
        }

        .custom-table tbody tr:nth-child(even) {
          background-color: #f9fafb;
        }

        .custom-table tbody tr:hover {
          background-color: #e6f3ff;
        }

        .custom-table tbody td {
          padding: 12px 16px;
          font-size: 14px;
          color: #444;
          border-bottom: 1px solid #e9ecef;
          vertical-align: middle;
        }

        .custom-table tbody td.text-end {
          text-align: right;
        }

        /* Nested Table for Settlements */
        .nested-table {
          background: #f8f9fa;
          border-radius: 6px;
          margin-top: 10px;
          border: 1px solid #e0e0e0;
        }

        .nested-table td {
          padding: 8px;
          border-bottom: none;
          vertical-align: top; /* Align fields to top for consistent label positioning */
        }

        .nested-table .form-control {
          font-size: 13px;
          height: 34px;
          background: #fff;
          transition: border-color 0.2s ease;
        }

        .nested-table .form-control:focus {
          border-color: #007bff;
          box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
        }

        /* Field Container for Labels */
        .field-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .field-label {
          font-size: 11px;
          color: #666;
          text-align: center;
          line-height: 1.2;
          max-width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Buttons */
        .custom-table .btn {
          font-size: 12px;
          padding: 4px 10px;
          transition: transform 0.2s ease;
        }

        .custom-table .btn:hover {
          transform: translateY(-1px);
        }

        /* Responsive Adjustments */
        .table-responsive {
          border-radius: 8px;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        @media (max-width: 768px) {
          .custom-table thead th,
          .custom-table tbody td {
            font-size: 13px;
            padding: 10px;
          }

          .nested-table .form-control {
            font-size: 12px;
            height: 32px;
          }

          .field-label {
            font-size: 10px;
          }

          .nested-table td {
            padding: 6px;
          }
        }

        /* Existing Styles */
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
          text-align: center;
        }
      `}</style>
    </React.Fragment>
  );
};

export default DoctorActivityDetails;