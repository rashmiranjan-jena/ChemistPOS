import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  FormGroup,
  Input,
  Label,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useNavigate, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import {
  getExpenseCategories,
  createExpenseCategory,
  postExpenseData,
  getExpenseById,
  updateExpense,
} from "../../../ApiService/AccountingManagement/SalaryAndExpense";

// Validation schema using Yup
const validationSchema = Yup.object({
  expenseCategory: Yup.string().required("Expense Category is required"),
  amount: Yup.number()
    .required("Amount is required")
    .min(0, "Amount cannot be negative"),
  dateTime: Yup.date().required("Date & Time is required"),
  paymentMode: Yup.string()
    .required("Payment Mode is required")
    .oneOf(["Cash", "Bank Transfer", "UPI", "Cheque"], "Invalid Payment Mode"),
  transactionId: Yup.string().when("paymentMode", {
    is: (paymentMode) =>
      ["Bank Transfer", "UPI", "Cheque"].includes(paymentMode),
    then: (schema) => schema.required("Transaction ID is required"),
    otherwise: (schema) => schema.nullable(),
  }),
  panNumber: Yup.string()
    .required("Pan number is required")
    .matches(
      /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
      "PAN Number must be 10 characters (5 letters, 4 numbers, 1 letter)"
    ),
  notes: Yup.string().nullable(),
  voucherFile: Yup.mixed()
    .nullable()
    .test("fileType", "Only PDF or image files are allowed", (value) => {
      if (!value) return true;
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/jpg",
      ];
      return allowedTypes.includes(value?.type);
    })
    .test("fileSize", "File size must be less than 5MB", (value) => {
      if (!value) return true;
      return value?.size <= 5 * 1024 * 1024;
    }),
  section: Yup.string().nullable(),
  tdsPercentage: Yup.number()
    .nullable()
    .min(0, "TDS % cannot be negative")
    .max(100, "TDS % cannot exceed 100"),
});

const ExpenseForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const expenseId = location.state?.expenseId; 
  const [modal, setModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [existingVoucherFile, setExistingVoucherFile] = useState(null);

  const calculateTds = (amount, tdsPercentage) => {
    const amountVal = parseFloat(amount) || 0;
    const tdsPercent = parseFloat(tdsPercentage) || 0;
    const tdsDeduct = (amountVal * tdsPercent) / 100;
    const finalAmount = amountVal - tdsDeduct;
    return {
      tdsDeduct: tdsDeduct.toFixed(2),
      finalAmount: finalAmount.toFixed(2),
    };
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getExpenseCategories();
        setExpenseCategories(categories ?? []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch expense categories.",
        });
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (expenseId) {
      const fetchExpense = async () => {
        try {
          const expense = await getExpenseById(expenseId);
          formik.setValues({
            expenseCategory: expense?.category_id?.toString() || "",
            amount: parseFloat(expense?.amount) || "",
            dateTime: expense?.date
              ? new Date(expense.date).toISOString().slice(0, 16)
              : "",
            paymentMode: expense?.payment_mode || "Cash",
            transactionId: expense?.txn_id || "",
            panNumber: expense?.pan_no || "",
            notes: expense?.notes || "",
            voucherFile: null, 
            section: expense?.tds_details?.section || "",
            tdsPercentage: parseFloat(expense?.tds_details?.tds_rate) || "",
          });
          setExistingVoucherFile(expense?.voucher_file);
        } catch (error) {
          console.error(`Failed to fetch expense with ID ${expenseId}:`, error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to load expense details.",
          });
        }
      };
      fetchExpense();
    }
  }, [expenseId]);

  const toggleModal = () => setModal(!modal);

  const handleAddCategory = async () => {
    if (
      newCategory.trim() &&
      !expenseCategories.some((cat) => cat?.name === newCategory.trim())
    ) {
      try {
        const response = await createExpenseCategory({
          name: newCategory.trim(),
        });
        setExpenseCategories([
          ...expenseCategories,
          { id: response?.id, name: newCategory.trim() },
        ]);
        setNewCategory("");
        toggleModal();
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "New category added successfully!",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("Failed to create category:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to create new category. Please try again.",
        });
      }
    } else {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Please enter a unique category name.",
      });
    }
  };

  const formik = useFormik({
    initialValues: {
      expenseCategory: "",
      amount: "",
      dateTime: new Date().toISOString().slice(0, 16),
      paymentMode: "Cash",
      transactionId: "",
      panNumber: "",
      notes: "",
      voucherFile: null,
      section: "",
      tdsPercentage: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const { tdsDeduct, finalAmount } = calculateTds(
          values.amount,
          values.tdsPercentage
        );
        const formData = new FormData();
        formData.append("category_id", values.expenseCategory);
        formData.append("amount", parseFloat(values.amount));
        formData.append("date", values.dateTime);
        formData.append("payment_mode", values.paymentMode);
        if (values.transactionId) {
          formData.append("txn_id", values.transactionId);
        }
        if (values.panNumber) {
          formData.append("pan_no", values.panNumber);
        }
        if (values.notes) {
          formData.append("notes", values.notes);
        }
        if (values.voucherFile) {
          formData.append("voucher_file", values.voucherFile);
        }
        if (values.section) {
          formData.append("section", values.section);
        }
        if (values.tdsPercentage) {
          formData.append("tds_rate", parseFloat(values.tdsPercentage));
        }
        formData.append("tds_deduct", parseFloat(tdsDeduct));
        formData.append("final_amount", parseFloat(finalAmount));

        if (expenseId) {
          await updateExpense(expenseId, formData);
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Expense details updated successfully!",
            timer: 1500,
            showConfirmButton: false,
          });
        } else {
          await postExpenseData(formData);
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Expense details submitted successfully!",
            timer: 1500,
            showConfirmButton: false,
          });
        }
        navigate("/expense-list");
      } catch (error) {
        console.error("Failed to submit expense:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: `Failed to ${
            expenseId ? "update" : "submit"
          } expense. Please try again.`,
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    isSubmitting,
  } = formik;

  const { tdsDeduct, finalAmount } = calculateTds(
    values.amount,
    values.tdsPercentage
  );

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs
          title="Finance"
          breadcrumbItem={expenseId ? "Edit Expense" : "Add Expense"}
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
                    {expenseId ? "Edit Expense" : "Add Expense"}
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
                    <i className="bx bx-undo" style={{ fontSize: "30px" }}></i>
                  </Button>
                </div>

                <form onSubmit={handleSubmit}>
                  <Row className="g-4">
                    {/* Expense Category (Dropdown with Add Button) */}
                    <Col md="6">
                      <FormGroup>
                        <Label
                          for="expenseCategory"
                          className="fw-bold text-dark"
                          style={{ fontSize: "14px" }}
                        >
                          Expense Category *
                        </Label>
                        <div className="d-flex align-items-center">
                          <Input
                            type="select"
                            name="expenseCategory"
                            id="expenseCategory"
                            value={values.expenseCategory}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`form-control ${
                              errors.expenseCategory && touched.expenseCategory
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px 0 0 8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          >
                            <option value="">Select Category</option>
                            {expenseCategories.map((category) => (
                              <option key={category?.id} value={category?.id}>
                                {category?.name}
                              </option>
                            ))}
                          </Input>
                          <Button
                            color="primary"
                            onClick={toggleModal}
                            style={{
                              borderRadius: "0 8px 8px 0",
                              padding: "10px",
                              height: "44px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                            }}
                            title="Add New Category"
                          >
                            <i
                              className="bx bx-plus"
                              style={{ fontSize: "20px" }}
                            ></i>
                          </Button>
                        </div>
                        {errors.expenseCategory && touched.expenseCategory && (
                          <div className="invalid-feedback">
                            {errors.expenseCategory}
                          </div>
                        )}
                      </FormGroup>
                    </Col>

                    {/* Amount (Input) */}
                    <Col md="6">
                      <FormGroup>
                        <Label
                          for="amount"
                          className="fw-bold text-dark"
                          style={{ fontSize: "14px" }}
                        >
                          Amount (₹) *
                        </Label>
                        <Input
                          type="number"
                          name="amount"
                          id="amount"
                          placeholder="Enter Amount"
                          value={values.amount}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`form-control ${
                            errors.amount && touched.amount ? "is-invalid" : ""
                          }`}
                          style={{
                            borderRadius: "8px",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                            padding: "10px",
                          }}
                        />
                        {errors.amount && touched.amount && (
                          <div className="invalid-feedback">
                            {errors.amount}
                          </div>
                        )}
                      </FormGroup>
                    </Col>

                    {/* PAN Number (Optional) */}
                    <Col md="6">
                      <FormGroup>
                        <Label
                          for="panNumber"
                          className="fw-bold text-dark"
                          style={{ fontSize: "14px" }}
                        >
                          PAN Number *
                        </Label>
                        <Input
                          type="text"
                          name="panNumber"
                          id="panNumber"
                          placeholder="Enter PAN Number"
                          value={values.panNumber}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`form-control ${
                            errors.panNumber && touched.panNumber
                              ? "is-invalid"
                              : ""
                          }`}
                          style={{
                            borderRadius: "8px",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                            padding: "10px",
                          }}
                        />
                        {errors.panNumber && touched.panNumber && (
                          <div className="invalid-feedback">
                            {errors.panNumber}
                          </div>
                        )}
                      </FormGroup>
                    </Col>

                    {/* Section (Input) */}
                    <Col md="6">
                      <FormGroup>
                        <Label
                          for="section"
                          className="fw-bold text-dark"
                          style={{ fontSize: "14px" }}
                        >
                          Section (Optional)
                        </Label>
                        <Input
                          type="text"
                          name="section"
                          id="section"
                          placeholder="Enter Section (e.g., 194C)"
                          value={values.section}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`form-control ${
                            errors.section && touched.section
                              ? "is-invalid"
                              : ""
                          }`}
                          style={{
                            borderRadius: "8px",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                            padding: "10px",
                          }}
                        />
                        {errors.section && touched.section && (
                          <div className="invalid-feedback">
                            {errors.section}
                          </div>
                        )}
                      </FormGroup>
                    </Col>

                    {/* TDS Percentage (Input) */}
                    <Col md="6">
                      <FormGroup>
                        <Label
                          for="tdsPercentage"
                          className="fw-bold text-dark"
                          style={{ fontSize: "14px" }}
                        >
                          TDS (%) (Optional)
                        </Label>
                        <Input
                          type="number"
                          name="tdsPercentage"
                          id="tdsPercentage"
                          placeholder="Enter TDS Percentage"
                          value={values.tdsPercentage}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`form-control ${
                            errors.tdsPercentage && touched.tdsPercentage
                              ? "is-invalid"
                              : ""
                          }`}
                          style={{
                            borderRadius: "8px",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                            padding: "10px",
                          }}
                        />
                        {errors.tdsPercentage && touched.tdsPercentage && (
                          <div className="invalid-feedback">
                            {errors.tdsPercentage}
                          </div>
                        )}
                      </FormGroup>
                    </Col>

                    {/* TDS Deduct (Read-only) */}
                    <Col md="6">
                      <FormGroup>
                        <Label
                          for="tdsDeduct"
                          className="fw-bold text-dark"
                          style={{ fontSize: "14px" }}
                        >
                          TDS Deduct (₹)
                        </Label>
                        <Input
                          type="text"
                          name="tdsDeduct"
                          id="tdsDeduct"
                          value={tdsDeduct}
                          readOnly
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

                    {/* Final Amount (Read-only) */}
                    <Col md="6">
                      <FormGroup>
                        <Label
                          for="finalAmount"
                          className="fw-bold text-dark"
                          style={{ fontSize: "14px" }}
                        >
                          Final Amount (₹)
                        </Label>
                        <Input
                          type="text"
                          name="finalAmount"
                          id="finalAmount"
                          value={finalAmount}
                          readOnly
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

                    {/* Date & Time (Auto) */}
                    <Col md="6">
                      <FormGroup>
                        <Label
                          for="dateTime"
                          className="fw-bold text-dark"
                          style={{ fontSize: "14px" }}
                        >
                          Date & Time *
                        </Label>
                        <Input
                          type="datetime-local"
                          name="dateTime"
                          id="dateTime"
                          value={values.dateTime}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`form-control ${
                            errors.dateTime && touched.dateTime
                              ? "is-invalid"
                              : ""
                          }`}
                          style={{
                            borderRadius: "8px",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                            padding: "10px",
                          }}
                        />
                        {errors.dateTime && touched.dateTime && (
                          <div className="invalid-feedback">
                            {errors.dateTime}
                          </div>
                        )}
                      </FormGroup>
                    </Col>

                    {/* Payment Mode (Dropdown) */}
                    <Col md="6">
                      <FormGroup>
                        <Label
                          for="paymentMode"
                          className="fw-bold text-dark"
                          style={{ fontSize: "14px" }}
                        >
                          Payment Mode *
                        </Label>
                        <Input
                          type="select"
                          name="paymentMode"
                          id="paymentMode"
                          value={values.paymentMode}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`form-control ${
                            errors.paymentMode && touched.paymentMode
                              ? "is-invalid"
                              : ""
                          }`}
                          style={{
                            borderRadius: "8px",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                            padding: "10px",
                          }}
                        >
                          <option value="Cash">Cash</option>
                          <option value="Bank Transfer">Bank Transfer</option>
                          <option value="UPI">UPI</option>
                          <option value="Cheque">Cheque</option>
                        </Input>
                        {errors.paymentMode && touched.paymentMode && (
                          <div className="invalid-feedback">
                            {errors.paymentMode}
                          </div>
                        )}
                      </FormGroup>
                    </Col>

                    {/* Transaction ID (Conditional) */}
                    <Col md="6">
                      <FormGroup>
                        <Label
                          for="transactionId"
                          className="fw-bold text-dark"
                          style={{ fontSize: "14px" }}
                        >
                          Transaction ID{" "}
                          {values.paymentMode !== "Cash" ? "*" : ""}
                        </Label>
                        <Input
                          type="text"
                          name="transactionId"
                          id="transactionId"
                          placeholder="Enter Transaction ID"
                          value={values.transactionId}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`form-control ${
                            errors.transactionId && touched.transactionId
                              ? "is-invalid"
                              : ""
                          }`}
                          style={{
                            borderRadius: "8px",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                            padding: "10px",
                          }}
                        />
                        {errors.transactionId && touched.transactionId && (
                          <div className="invalid-feedback">
                            {errors.transactionId}
                          </div>
                        )}
                      </FormGroup>
                    </Col>

                    {/* Existing Voucher File (Displayed when editing) */}
                    {expenseId && existingVoucherFile && (
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="existingVoucherFile"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Current Voucher File
                          </Label>
                          <div>
                            <a
                              href={`${import.meta.env.VITE_API_BASE_URL}${existingVoucherFile}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: "#007bff" }}
                            >
                              View Current File
                            </a>
                          </div>
                        </FormGroup>
                      </Col>
                    )}

                    {/* Voucher File (Optional) */}
                    <Col md="6">
                      <FormGroup>
                        <Label
                          for="voucherFile"
                          className="fw-bold text-dark"
                          style={{ fontSize: "14px" }}
                        >
                          {expenseId
                            ? "Replace Voucher File (PDF/Image, Optional)"
                            : "Voucher File (PDF/Image, Optional)"}
                        </Label>
                        <Input
                          type="file"
                          name="voucherFile"
                          id="voucherFile"
                          accept="image/*,application/pdf"
                          onChange={(event) => {
                            setFieldValue(
                              "voucherFile",
                              event.currentTarget.files?.[0]
                            );
                          }}
                          onBlur={handleBlur}
                          className={`form-control ${
                            errors.voucherFile && touched.voucherFile
                              ? "is-invalid"
                              : ""
                          }`}
                          style={{
                            borderRadius: "8px",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                            padding: "10px",
                          }}
                        />
                        {errors.voucherFile && touched.voucherFile && (
                          <div className="invalid-feedback">
                            {errors.voucherFile}
                          </div>
                        )}
                      </FormGroup>
                    </Col>

                    {/* Notes (Optional) */}
                    <Col md="12">
                      <FormGroup>
                        <Label
                          for="notes"
                          className="fw-bold text-dark"
                          style={{ fontSize: "14px" }}
                        >
                          Notes (Optional)
                        </Label>
                        <Input
                          type="textarea"
                          name="notes"
                          id="notes"
                          placeholder="Enter additional notes"
                          value={values.notes}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`form-control ${
                            errors.notes && touched.notes ? "is-invalid" : ""
                          }`}
                          style={{
                            borderRadius: "8px",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                            padding: "10px",
                          }}
                        />
                        {errors.notes && touched.notes && (
                          <div className="invalid-feedback">{errors.notes}</div>
                        )}
                      </FormGroup>
                    </Col>

                    {/* Submit Button */}
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
                        {isSubmitting
                          ? "Submitting..."
                          : expenseId
                          ? "Update"
                          : "Submit"}
                      </Button>
                    </Col>
                  </Row>
                </form>

                {/* Modal for Adding New Category */}
                <Modal isOpen={modal} toggle={toggleModal}>
                  <ModalHeader toggle={toggleModal}>
                    Add New Expense Category
                  </ModalHeader>
                  <ModalBody>
                    <FormGroup>
                      <Label for="newCategory">Category Name</Label>
                      <Input
                        type="text"
                        id="newCategory"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="Enter new category"
                      />
                    </FormGroup>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary" onClick={handleAddCategory}>
                      Add
                    </Button>{" "}
                    <Button color="secondary" onClick={toggleModal}>
                      Cancel
                    </Button>
                  </ModalFooter>
                </Modal>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

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
    </div>
  );
};

export default ExpenseForm;
