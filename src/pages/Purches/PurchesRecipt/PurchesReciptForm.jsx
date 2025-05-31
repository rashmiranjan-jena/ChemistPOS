import React, { useEffect, useRef, useState } from "react";
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
import { useFormik } from "formik";
import * as Yup from "yup";
import { AiOutlineCloseCircle } from "react-icons/ai";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchDrugDataByPoNo } from "../../../ApiService/Purchase/PurchaseRecipt";
import {
  postPurchaseReceipt,
  getPurchaseEntryDetailsForEdit,
  updatePurchaseReceipt,
} from "../../../ApiService/Purchase/PurchaseRecipt";

const deliveryModes = ["Courier", "Transport", "Direct"];

const validationSchema = Yup.object({
  deliveryPerson: Yup.string(),
  phoneNo: Yup.string().matches(
    /^[0-9]{10}$/,
    "Phone No. must be a 10-digit number"
  ),
  emailId: Yup.string().email("Invalid email format"),
  modeOfDelivery: Yup.string(),
  vehicleNo: Yup.string(),
  driverNo: Yup.string().matches(
    /^[0-9]{10}$/,
    "Driver No. must be a 10-digit number"
  ),
  poNo: Yup.string(),
  deliveryType: Yup.string(),
  purchaseInvoiceReceived: Yup.boolean(),
  invoiceReceivedDate: Yup.string().required(
    "Challan Received Date is required"
  ),
  purchaseInvoiceNo: Yup.string().when("purchaseInvoiceReceived", {
    is: true,
    then: (schema) => schema.required("Purchase Invoice No. is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  invoiceTotalPurchaseAmount: Yup.number().when("purchaseInvoiceReceived", {
    is: true,
    then: (schema) =>
      schema
        .required("Invoice Total Purchase Amount is required")
        .min(0, "Invoice Total Purchase Amount cannot be negative"),
    otherwise: (schema) => schema.notRequired(),
  }),
  totalPurchaseGST: Yup.number().when("purchaseInvoiceReceived", {
    is: true,
    then: (schema) =>
      schema
        .required("Total Purchase GST is required")
        .min(0, "Total Purchase GST cannot be negative"),
    otherwise: (schema) => schema.notRequired(),
  }),
  purchaseInvoice: Yup.array().when("purchaseInvoiceReceived", {
    is: true,
    then: (schema) =>
      schema
        .min(1, "At least one Purchase Invoice file is required")
        .required("Purchase Invoice is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  deliveryChallanNo: Yup.string(),
  challanFiles: Yup.array(),
  drugsTally: Yup.array().of(
    Yup.object({
      orderReceived: Yup.number().min(0, "Order Received cannot be negative"),
      freeDrug: Yup.number().min(0, "Free Drug cannot be negative"),
      batchNo: Yup.string().when(["previouslyReceivedOrder", "totalOrder"], {
        is: (previouslyReceivedOrder, totalOrder) =>
          previouslyReceivedOrder < totalOrder,
        then: (schema) => schema.required("Batch No is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      hsn: Yup.string(),
      expireDate: Yup.string().when(["previouslyReceivedOrder", "totalOrder"], {
        is: (previouslyReceivedOrder, totalOrder) =>
          previouslyReceivedOrder < totalOrder,
        then: (schema) =>
          schema
            .required("Expire Date is required")
            .matches(
              /^\d{4}-\d{2}-\d{2}$/,
              "Expire Date must be in YYYY-MM-DD format"
            ),
        otherwise: (schema) => schema.notRequired(),
      }),
      mrp: Yup.number().min(0, "MRP cannot be negative"),
      rate: Yup.number().min(0, "Rate cannot be negative"),
      discount: Yup.number().min(0, "Discount cannot be negative"),
      gst: Yup.number().min(0, "GST cannot be negative"),
    })
  ),
});

const PurchaseReceiptForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id, po_id } = location?.state || {};
  const deliveryBoyPhotoRef = useRef(null);
  const purchaseInvoiceRef = useRef(null);
  const challanFileRef = useRef(null);
  const [isInvoiceUpdated, setIsInvoiceUpdated] = useState(false);
  const [isPhotoUpdated, setIsPhotoUpdated] = useState(false);
  const [isChallanUpdated, setIsChallanUpdated] = useState(false);
  const [previousTotals, setPreviousTotals] = useState({
    previousPurchaseAmount: 0,
    previousGST: 0,
  });
  const currentDate = new Date().toISOString().split("T")[0];
  const now = new Date();
  const currentTime = now.toLocaleTimeString("en-GB", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const formik = useFormik({
    initialValues: {
      date: currentDate,
      time: currentTime,
      deliveryPerson: "",
      deliveryBoyPhoto: null,
      existingDeliveryBoyPhoto: null,
      phoneNo: "",
      emailId: "",
      modeOfDelivery: "",
      vehicleNo: "",
      driverNo: "",
      purchaseReceiptNumber: 0,
      poNo: po_id || "",
      drugsTally: [],
      deliveryType: "Complete",
      purchaseInvoiceReceived: false,
      purchaseInvoiceNo: "",
      purchaseInvoice: [],
      existingPurchaseInvoice: [],
      invoiceReceivedDate: "",
      purchaseAmount: 0,
      invoiceTotalPurchaseAmount: 0,
      totalPurchaseGST: 0,
      deliveryChallanNo: "",
      challanFiles: [],
      existingChallanFiles: [],
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        // Validate that at least one drug has orderReceived > 0
        const hasValidDrugs = values?.drugsTally?.some(
          (drug) => (drug?.orderReceived || 0) > 0
        );
        if (!hasValidDrugs) {
          Swal.fire({
            title: "Error!",
            text: "At least one drug must have a received order quantity greater than 0.",
            icon: "error",
            confirmButtonText: "OK",
          });
          return;
        }

        const formData = new FormData();

        formData.append("date", values?.date);
        formData.append("time", values?.time);
        formData.append(
          "invoice_receive_date",
          values?.invoiceReceivedDate || ""
        );
        formData.append("delivery_boy_name", values?.deliveryPerson || "");
        formData.append("phone_no", values?.phoneNo || "");
        formData.append("email", values?.emailId || "");
        formData.append("mode_of_delivery", values?.modeOfDelivery || "");
        formData.append("vehicle_no", values?.vehicleNo || "");
        formData.append("driver_no", values?.driverNo || "");
        formData.append("po_id", values?.poNo || "");
        formData.append("delivery_Type", values?.deliveryType || "");
        formData.append(
          "purchase_Invoice_Received",
          values?.purchaseInvoiceReceived ? "true" : "false"
        );
        formData.append("purchase_Invoice_No", values?.purchaseInvoiceNo || "");
        formData.append("inv_amount", values?.invoiceTotalPurchaseAmount || 0);
        formData.append("inv_gst", values?.totalPurchaseGST || 0);
        formData.append("delivery_challan_no", values?.deliveryChallanNo || "");

        if (isPhotoUpdated && values?.deliveryBoyPhoto) {
          formData.append("delivery_boy_photo", values.deliveryBoyPhoto);
        }
        if (isInvoiceUpdated && values?.purchaseInvoice?.length > 0) {
          values.purchaseInvoice.forEach((file) => {
            formData.append("purchase_invoice_file", file.file || file);
          });
        }
        if (isChallanUpdated && values?.challanFiles?.length > 0) {
          values.challanFiles.forEach((file) => {
            formData.append("delivery_challan_file", file.file || file);
          });
        }

        // Filter drugsTally for submission (exclude drugs where previouslyReceivedOrder >= totalOrder)
        const drugsTallyForSubmission = values?.drugsTally
          ?.filter(
            (drug) =>
              (drug?.previouslyReceivedOrder || 0) < (drug?.totalOrder || 0)
          )
          ?.map((drug) => {
            const amount = (drug?.rate || 0) * (drug?.orderReceived || 0);
            const discountAmount = amount * ((drug?.discount || 0) / 100);
            const discountedAmount = amount - discountAmount;
            const gstAmount = discountedAmount * ((drug?.gst || 0) / 100);
            const purchaseAmount = discountedAmount + gstAmount;

            return {
              drug_id: drug?.drug_id,
              drug_name: drug?.drugName,
              conversion_id: drug?.conversion_id,
              totalOrder: drug?.totalOrder,
              previouslyReceivedOrder: drug?.previouslyReceivedOrder,
              quantity: drug?.orderReceived,
              free_drug: drug?.freeDrug,
              batch: drug?.batchNo,
              hsn: drug?.hsn,
              expireDate: drug?.expireDate,
              mrp: drug?.mrp,
              rate: drug?.rate,
              amount: drug?.amount,
              discount: drug?.discount,
              gst: drug?.gst,
              purchaseAmount: purchaseAmount.toFixed(2),
            };
          }) || [];

        formData.append("drug_tally", JSON.stringify(drugsTallyForSubmission));

        // Calculate totals based on drugs with orderReceived > 0
        const { totalGST, totalPurchaseAmount, totalRate } = calculateTotals(
          values?.drugsTally?.filter(
            (drug) => (drug?.orderReceived || 0) > 0
          ) || []
        );
        formData.append("subtotal_GST", totalGST);
        formData.append("subtotal_purchase_amount", totalPurchaseAmount);
        formData.append("subtotal_rate", totalRate);

        console.log("FormData contents:");
        for (let pair of formData.entries()) {
          console.log(`${pair[0]}: ${pair[1]}`);
        }

        let response;
        if (id) {
          response = await updatePurchaseReceipt(id, formData);
        } else {
          response = await postPurchaseReceipt(formData);
        }

        if (response) {
          Swal.fire({
            title: "Success!",
            text: id
              ? "Purchase receipt updated successfully."
              : "Purchase receipt submitted successfully.",
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => {
            formik.resetForm();
            if (deliveryBoyPhotoRef?.current)
              deliveryBoyPhotoRef.current.value = "";
            if (purchaseInvoiceRef?.current)
              purchaseInvoiceRef.current.value = "";
            if (challanFileRef?.current) challanFileRef.current.value = "";
            navigate("/purchase-receipt-list");
          });
        } else {
          throw new Error("Submission failed");
        }
      } catch (error) {
        console.error("Error submitting purchase receipt:", error);
        const errorMessage =
          error?.response?.data?.error ||
          error?.message ||
          "Failed to submit purchase receipt.";

        Swal.fire({
          title: "Error!",
          text: errorMessage || "Failed to submit purchase receipt.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    },
  });

  const { values, handleSubmit, handleChange, setFieldValue, errors, touched } =
    formik;

  const fetchDrugData = async (poNo) => {
    if (!poNo) {
      setFieldValue("drugsTally", []);
      return;
    }
    try {
      const response = await fetchDrugDataByPoNo(poNo);
      const drugDetails = response?.pr_no?.drug_details || [];

      setPreviousTotals({
        previousPurchaseAmount:
          parseFloat(response?.previous_total_amount) || 0,
        previousGST: parseFloat(response?.previous_total_gst) || 0,
      });

      const formattedDrugData =
        drugDetails?.map((drug) => ({
          drug_id: drug?.drug_id || "",
          drugName: drug?.drug_name || "",
          conversion_id: drug?.conversion_id || "",
          totalOrder: drug?.orderQuantity || 0,
          previouslyReceivedOrder: drug?.total_quantity_received || 0,
          orderReceived: 0,
          freeDrug: 0,
          batchNo: "",
          hsn: drug?.hsn_code || "",
          expireDate: "",
          mrp: 0,
          rate: 0,
          amount: 0,
          discount: 0,
          gst: drug?.gst || 0,
        })) || [];

      setFieldValue("drugsTally", formattedDrugData);
      setFieldValue("deliveryType", "Complete");
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text:
          error?.message ||
          "Failed to fetch drug data for the selected PO number.",
        icon: "error",
        confirmButtonText: "OK",
      });
      setFieldValue("drugsTally", []);
    }
  };

  const fetchReceiptData = async (receiptId) => {
    try {
      const data = await getPurchaseEntryDetailsForEdit(receiptId);
      if (data) {
        setFieldValue("date", data?.date || currentDate);
        setFieldValue("time", data?.time || currentTime);
        setFieldValue("invoiceReceivedDate", data?.invoice_receive_date || "");
        setFieldValue("deliveryPerson", data?.delivery_boy_name || "");
        setFieldValue("phoneNo", data?.phone_no || "");
        setFieldValue("emailId", data?.email || "");
        setFieldValue("modeOfDelivery", data?.mode_of_delivery || "");
        setFieldValue("vehicleNo", data?.vehicle_no || "");
        setFieldValue("driverNo", data?.driver_no || "");
        setFieldValue("poNo", data?.po_id || "");
        setFieldValue("purchaseReceiptNumber", data?.reciept_no);
        setFieldValue("deliveryType", data?.delivery_Type || "Complete");
        setFieldValue(
          "purchaseInvoiceReceived",
          data?.purchase_Invoice_Received || false
        );
        setFieldValue("purchaseInvoiceNo", data?.purchase_Invoice_No || "");
        setFieldValue("invoiceTotalPurchaseAmount", data?.inv_amount || 0);
        setFieldValue("totalPurchaseGST", data?.inv_gst || 0);
        setFieldValue("deliveryChallanNo", data?.delivery_challan_no || "");

        if (data?.purchase_invoice_file) {
          const invoiceFiles = Array.isArray(data.purchase_invoice_file)
            ? data.purchase_invoice_file
            : [data.purchase_invoice_file];
          setFieldValue(
            "existingPurchaseInvoice",
            invoiceFiles?.map((file) => ({
              preview: `${import.meta.env?.VITE_API_BASE_URL}${file}`,
              name: file?.split("/")?.pop(),
            })) || []
          );
          setFieldValue("purchaseInvoice", []);
        }

        if (data?.delivery_challan_file) {
          const challanFiles = Array.isArray(data.delivery_challan_file)
            ? data.delivery_challan_file
            : [data.delivery_challan_file];
          setFieldValue(
            "existingChallanFiles",
            challanFiles?.map((file) => ({
              preview: `${import.meta.env?.VITE_API_BASE_URL}${file}`,
              name: file?.split("/")?.pop(),
            })) || []
          );
          setFieldValue("challanFiles", []);
        }

        if (data?.delivery_boy_photo) {
          setFieldValue("existingDeliveryBoyPhoto", {
            preview: `${import.meta.env?.VITE_API_BASE_URL}${
              data?.delivery_boy_photo
            }`,
            name: data?.delivery_boy_photo?.split("/")?.pop(),
          });
          setFieldValue("deliveryBoyPhoto", null);
        }

        const formattedDrugData =
          data?.drug_tally?.map((drug) => ({
            drug_id: drug?.drug_id || "",
            conversion_id: drug?.conversion_id || "",
            totalOrder: drug?.totalOrder || 0,
            previouslyReceivedOrder: data?.total_quantity_received || 0,
            orderReceived: drug?.quantity || 0,
            freeDrug: drug?.free_drug || 0,
            batchNo: drug?.batch || "",
            hsn: drug?.hsn || "",
            expireDate: drug?.expireDate || "",
            mrp: drug?.mrp || 0,
            rate: drug?.rate || 0,
            amount: drug?.amount || 0,
            discount: drug?.discount || 0,
            gst: drug?.gst || 0,
            drugName: drug?.drug_name || "N/A",
          })) || [];

        setFieldValue("drugsTally", formattedDrugData);
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error?.message || "Failed to fetch receipt data.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  useEffect(() => {
    if (id) {
      fetchReceiptData(id);
    } else if (po_id) {
      fetchDrugData(po_id);
    }
  }, [id, po_id]);

  useEffect(() => {
    const isComplete = values?.drugsTally?.every((drug) => {
      const totalReceived =
        (drug?.previouslyReceivedOrder || 0) + (drug?.orderReceived || 0);
      return totalReceived >= (drug?.totalOrder || 0);
    });
    setFieldValue("deliveryType", isComplete ? "Complete" : "Partial");
  }, [values?.drugsTally, setFieldValue]);

  const handlePhotoChange = (event) => {
    if (event?.target?.files?.[0]) {
      const file = event.target.files[0];
      setFieldValue("deliveryBoyPhoto", file);
      setFieldValue("existingDeliveryBoyPhoto", {
        preview: URL.createObjectURL(file),
        name: file.name,
      });
      setIsPhotoUpdated(true);
    }
  };

  const removePhoto = () => {
    setFieldValue("deliveryBoyPhoto", null);
    setFieldValue("existingDeliveryBoyPhoto", null);
    setIsPhotoUpdated(true);
    if (deliveryBoyPhotoRef?.current) deliveryBoyPhotoRef.current.value = "";
  };

  const handleInvoiceFiles = (event) => {
    const files = Array.from(event.target.files || []);
    const newFiles = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }));
    setFieldValue("existingPurchaseInvoice", [
      ...(values.existingPurchaseInvoice || []),
      ...newFiles,
    ]);
    setFieldValue("purchaseInvoice", [
      ...(values.purchaseInvoice || []),
      ...newFiles,
    ]);
    setIsInvoiceUpdated(true);
  };

  const removeInvoiceFile = (index) => {
    const updatedFiles =
      values?.existingPurchaseInvoice?.filter((_, idx) => idx !== index) || [];
    setFieldValue("existingPurchaseInvoice", updatedFiles);
    setFieldValue("purchaseInvoice", updatedFiles);
    setIsInvoiceUpdated(true);
  };

  const handleChallanFiles = (event) => {
    const files = Array.from(event.target.files || []);
    const newFiles = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }));
    setFieldValue("existingChallanFiles", [
      ...(values.existingChallanFiles || []),
      ...newFiles,
    ]);
    setFieldValue("challanFiles", [
      ...(values.challanFiles || []),
      ...newFiles,
    ]);
    setIsChallanUpdated(true);
  };

  const removeChallanFile = (index) => {
    const updatedFiles =
      values?.existingChallanFiles?.filter((_, idx) => idx !== index) || [];
    setFieldValue("existingChallanFiles", updatedFiles);
    setFieldValue("challanFiles", updatedFiles);
    setIsChallanUpdated(true);
  };

  const calculatePurchaseAmount = (
    amount,
    discountPercentage,
    gstPercentage
  ) => {
    const discountAmount = amount * ((discountPercentage || 0) / 100);
    const discountedAmount = amount - discountAmount;
    const gstAmount = discountedAmount * ((gstPercentage || 0) / 100);
    return discountedAmount + gstAmount;
  };

  const calculateTotals = (drugsTally) => {
    let totalGST = 0;
    let totalPurchaseAmount = 0;
    let totalRate = 0;

    drugsTally?.forEach((drug) => {
      const amount = (drug?.rate || 0) * (drug?.orderReceived || 0);
      const discountAmount = amount * ((drug?.discount || 0) / 100);
      const discountedAmount = amount - discountAmount;
      const gstAmount = discountedAmount * ((drug?.gst || 0) / 100);
      const purchaseAmount = discountedAmount + gstAmount;

      totalGST += gstAmount;
      totalPurchaseAmount += purchaseAmount;
      totalRate += discountedAmount;
    });

    return {
      totalGST: totalGST?.toFixed(2) || "0.00",
      totalPurchaseAmount: totalPurchaseAmount?.toFixed(2) || "0.00",
      totalRate: totalRate?.toFixed(2) || "0.00",
    };
  };

  useEffect(() => {
    if (values.purchaseInvoiceReceived) {
      const { totalGST, totalPurchaseAmount } = calculateTotals(
        values.drugsTally.filter(
          (drug) => (drug?.orderReceived || 0) > 0
        )
      );
      const totalPurchaseAmountWithPrevious =
        parseFloat(totalPurchaseAmount) +
        parseFloat(previousTotals.previousPurchaseAmount);
      const totalGSTWithPrevious =
        parseFloat(totalGST) + parseFloat(previousTotals.previousGST);

      setFieldValue(
        "invoiceTotalPurchaseAmount",
        totalPurchaseAmountWithPrevious.toFixed(2)
      );
      setFieldValue("totalPurchaseGST", totalGSTWithPrevious.toFixed(2));
    }
  }, [
    values.drugsTally,
    values.purchaseInvoiceReceived,
    previousTotals,
    setFieldValue,
  ]);


  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Purchase Management"
            breadcrumbItem={
              id ? "Edit Purchase Receipt" : "Add Purchase Receipt"
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
                    <h4 className="text-primary">
                      {id ? "Edit Purchase Receipt" : "Add Purchase Receipt"}
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

                  <Form onSubmit={handleSubmit}>
                    <Row className="g-4">
                      <Col md="6">
                        <FormGroup>
                          <Label for="date" className="fw-bold text-dark">
                            Date
                          </Label>
                          <Input
                            type="date"
                            name="date"
                            id="date"
                            value={values?.date}
                            disabled={!id}
                            onChange={handleChange}
                            className="form-control"
                          />
                        </FormGroup>
                      </Col>

                      <Col md="6">
                        <FormGroup>
                          <Label for="time" className="fw-bold text-dark">
                            Time
                          </Label>
                          <Input
                            type="text"
                            name="time"
                            id="time"
                            value={values?.time}
                            disabled={!id}
                            onChange={handleChange}
                            className="form-control"
                          />
                        </FormGroup>
                      </Col>

                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="invoiceReceivedDate"
                            className="fw-bold text-dark"
                          >
                            Challan Received Date *
                          </Label>
                          <Input
                            type="date"
                            name="invoiceReceivedDate"
                            id="invoiceReceivedDate"
                            value={values?.invoiceReceivedDate}
                            onChange={handleChange}
                            className={`form-control ${
                              touched?.invoiceReceivedDate &&
                              errors?.invoiceReceivedDate
                                ? "is-invalid"
                                : ""
                            }`}
                          />
                          {touched?.invoiceReceivedDate &&
                            errors?.invoiceReceivedDate && (
                              <div className="invalid-feedback">
                                {errors?.invoiceReceivedDate}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="deliveryChallanNo"
                            className="fw-bold text-dark"
                          >
                            Delivery Challan No.
                          </Label>
                          <Input
                            type="text"
                            name="deliveryChallanNo"
                            id="deliveryChallanNo"
                            placeholder="Enter Delivery Challan No."
                            value={values?.deliveryChallanNo}
                            onChange={handleChange}
                            className={`form-control ${
                              touched?.deliveryChallanNo &&
                              errors?.deliveryChallanNo
                                ? "is-invalid"
                                : ""
                            }`}
                          />
                          {touched?.deliveryChallanNo &&
                            errors?.deliveryChallanNo && (
                              <div className="invalid-feedback">
                                {errors?.deliveryChallanNo}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="challanFiles"
                            className="fw-bold text-dark"
                          >
                            Upload Challan
                          </Label>
                          <input
                            type="file"
                            id="challanFiles"
                            name="challanFiles"
                            accept="image/*,application/pdf"
                            multiple
                            ref={challanFileRef}
                            className="form-control"
                            onChange={handleChallanFiles}
                          />
                          {values?.existingChallanFiles?.length > 0 && (
                            <div className="mt-2">
                              {values?.existingChallanFiles?.map(
                                (file, index) => (
                                  <div
                                    key={index}
                                    style={{
                                      position: "relative",
                                      display: "inline-block",
                                      marginRight: "10px",
                                      marginTop: "10px",
                                    }}
                                  >
                                    {file?.file?.type?.startsWith("image/") ||
                                    file?.preview?.includes("blob:") ? (
                                      <img
                                        src={file?.preview}
                                        alt={`Challan ${index + 1}`}
                                        style={{
                                          width: "100px",
                                          height: "auto",
                                          borderRadius: "8px",
                                        }}
                                      />
                                    ) : (
                                      <div
                                        style={{
                                          width: "100px",
                                          height: "100px",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          background: "#f1f1f1",
                                          borderRadius: "8px",
                                        }}
                                      >
                                        <a
                                          href={file?.preview}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          style={{
                                            textDecoration: "none",
                                            color: "#007bff",
                                          }}
                                        >
                                          {file?.name || "View PDF"}
                                        </a>
                                      </div>
                                    )}
                                    <AiOutlineCloseCircle
                                      style={{
                                        position: "absolute",
                                        top: "0",
                                        right: "0",
                                        cursor: "pointer",
                                        fontSize: "20px",
                                        color: "red",
                                      }}
                                      onClick={() => removeChallanFile(index)}
                                    />
                                  </div>
                                )
                              )}
                            </div>
                          )}
                          {touched?.challanFiles && errors?.challanFiles && (
                            <div className="invalid-feedback">
                              {errors?.challanFiles}
                            </div>
                          )}
                        </FormGroup>
                      </Col>

                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="deliveryPerson"
                            className="fw-bold text-dark"
                          >
                            Delivery Person
                          </Label>
                          <Input
                            type="text"
                            name="deliveryPerson"
                            id="deliveryPerson"
                            placeholder="Enter Delivery Person Name"
                            value={values?.deliveryPerson}
                            onChange={handleChange}
                            className={`form-control ${
                              touched?.deliveryPerson && errors?.deliveryPerson
                                ? "is-invalid"
                                : ""
                            }`}
                          />
                          {touched?.deliveryPerson &&
                            errors?.deliveryPerson && (
                              <div className="invalid-feedback">
                                {errors?.deliveryPerson}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="deliveryBoyPhoto"
                            className="fw-bold text-dark"
                          >
                            Delivery Boy Photo
                          </Label>
                          <input
                            type="file"
                            id="deliveryBoyPhoto"
                            name="deliveryBoyPhoto"
                            accept="image/*"
                            ref={deliveryBoyPhotoRef}
                            className="form-control"
                            onChange={handlePhotoChange}
                          />
                          {values?.existingDeliveryBoyPhoto && (
                            <div
                              style={{
                                position: "relative",
                                display: "inline-block",
                                marginTop: "10px",
                              }}
                            >
                              <img
                                src={values?.existingDeliveryBoyPhoto?.preview}
                                alt="Delivery Boy Preview"
                                style={{
                                  maxWidth: "100%",
                                  maxHeight: "200px",
                                  borderRadius: "8px",
                                }}
                              />
                              <button
                                type="button"
                                onClick={removePhoto}
                                style={{
                                  position: "absolute",
                                  top: "-10px",
                                  right: "-10px",
                                  background: "red",
                                  borderRadius: "50%",
                                  width: "25px",
                                  height: "25px",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  border: "none",
                                  color: "white",
                                  cursor: "pointer",
                                }}
                              >
                                <AiOutlineCloseCircle />
                              </button>
                            </div>
                          )}
                        </FormGroup>
                      </Col>

                      <Col md="6">
                        <FormGroup>
                          <Label for="phoneNo" className="fw-bold text-dark">
                            Phone No.
                          </Label>
                          <Input
                            type="text"
                            name="phoneNo"
                            id="phoneNo"
                            placeholder="Enter 10-digit Phone No."
                            value={values?.phoneNo}
                            onChange={handleChange}
                            className={`form-control ${
                              touched?.phoneNo && errors?.phoneNo
                                ? "is-invalid"
                                : ""
                            }`}
                          />
                          {touched?.phoneNo && errors?.phoneNo && (
                            <div className="invalid-feedback">
                              {errors?.phoneNo}
                            </div>
                          )}
                        </FormGroup>
                      </Col>

                      <Col md="6">
                        <FormGroup>
                          <Label for="emailId" className="fw-bold text-dark">
                            Email ID
                          </Label>
                          <Input
                            type="email"
                            name="emailId"
                            id="emailId"
                            placeholder="Enter Email ID"
                            value={values?.emailId}
                            onChange={handleChange}
                            className={`form-control ${
                              touched?.emailId && errors?.emailId
                                ? "is-invalid"
                                : ""
                            }`}
                          />
                          {touched?.emailId && errors?.emailId && (
                            <div className="invalid-feedback">
                              {errors?.emailId}
                            </div>
                          )}
                        </FormGroup>
                      </Col>

                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="modeOfDelivery"
                            className="fw-bold text-dark"
                          >
                            Mode of Delivery
                          </Label>
                          <Input
                            type="select"
                            name="modeOfDelivery"
                            id="modeOfDelivery"
                            value={values?.modeOfDelivery}
                            onChange={handleChange}
                            className={`form-control ${
                              touched?.modeOfDelivery && errors?.modeOfDelivery
                                ? "is-invalid"
                                : ""
                            }`}
                          >
                            <option value="">Select Mode of Delivery</option>
                            {deliveryModes?.map((mode, index) => (
                              <option key={index} value={mode}>
                                {mode}
                              </option>
                            ))}
                          </Input>
                          {touched?.modeOfDelivery &&
                            errors?.modeOfDelivery && (
                              <div className="invalid-feedback">
                                {errors?.modeOfDelivery}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      <Col md="6">
                        <FormGroup>
                          <Label for="vehicleNo" className="fw-bold text-dark">
                            Vehicle No.
                          </Label>
                          <Input
                            type="text"
                            name="vehicleNo"
                            id="vehicleNo"
                            placeholder="Enter Vehicle No."
                            value={values?.vehicleNo}
                            onChange={handleChange}
                            className={`form-control ${
                              touched?.vehicleNo && errors?.vehicleNo
                                ? "is-invalid"
                                : ""
                            }`}
                          />
                          {touched?.vehicleNo && errors?.vehicleNo && (
                            <div className="invalid-feedback">
                              {errors?.vehicleNo}
                            </div>
                          )}
                        </FormGroup>
                      </Col>

                      <Col md="6">
                        <FormGroup>
                          <Label for="driverNo" className="fw-bold text-dark">
                            Driver No.
                          </Label>
                          <Input
                            type="text"
                            name="driverNo"
                            id="driverNo"
                            placeholder="Enter 10-digit Driver No."
                            value={values?.driverNo}
                            onChange={handleChange}
                            className={`form-control ${
                              touched?.driverNo && errors?.driverNo
                                ? "is-invalid"
                                : ""
                            }`}
                          />
                          {touched?.driverNo && errors?.driverNo && (
                            <div className="invalid-feedback">
                              {errors?.driverNo}
                            </div>
                          )}
                        </FormGroup>
                      </Col>

                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="purchaseReceiptNumber"
                            className="fw-bold text-dark"
                          >
                            Purchase Receipt Number
                          </Label>
                          <Input
                            type="text"
                            name="purchaseReceiptNumber"
                            id="purchaseReceiptNumber"
                            value={values?.purchaseReceiptNumber}
                            disabled
                            className="form-control"
                          />
                        </FormGroup>
                      </Col>

                      <Col md="12">
                        <FormGroup>
                          <Label for="poNo" className="fw-bold text-dark">
                            PO No.
                          </Label>
                          <Input
                            type="text"
                            name="poNo"
                            id="poNo"
                            value={values?.poNo}
                            disabled
                            className="form-control"
                          />
                        </FormGroup>
                      </Col>

                      <Col md="12">
                        <FormGroup>
                          <Label for="drugsTally" className="fw-bold text-dark">
                            Drugs Tally (Ordered vs Received)
                          </Label>
                          {values?.deliveryType === "Complete" && (
                            <p className="text-success mb-2">
                              All orders have been fully received. Delivery
                              Type: Complete
                            </p>
                          )}
                          {values?.drugsTally?.length > 0 ? (
                            <>
                              <Table
                                bordered
                                responsive
                                className="table-modern shadow-sm"
                              >
                                <thead className="table-primary">
                                  <tr>
                                    <th className="text-white fw-bold">
                                      Drug Name
                                    </th>
                                    <th className="text-white fw-bold">
                                      Total Order
                                    </th>
                                    <th className="text-white fw-bold">
                                      Previously Order Received
                                    </th>
                                    <th className="text-white fw-bold">
                                      Order Received
                                    </th>
                                    <th className="text-white fw-bold">
                                      Free Drug
                                    </th>
                                    <th className="text-white fw-bold">
                                      Batch No *
                                    </th>
                                    <th className="text-white fw-bold">HSN</th>
                                    <th className="text-white fw-bold">
                                      Expire Date *
                                    </th>
                                    <th className="text-white fw-bold">MRP</th>
                                    <th className="text-white fw-bold">Rate</th>
                                    <th className="text-white fw-bold">
                                      Amount
                                    </th>
                                    <th className="text-white fw-bold">
                                      Discount (%)
                                    </th>
                                    <th className="text-white fw-bold">
                                      GST (%)
                                    </th>
                                    <th className="text-white fw-bold">
                                      Purchase Amount
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {values?.drugsTally?.map((drug, index) => {
                                    const amount =
                                      (drug?.rate || 0) *
                                      (drug?.orderReceived || 0);
                                    const discountAmount =
                                      amount * ((drug?.discount || 0) / 100);
                                    const discountedAmount =
                                      amount - discountAmount;
                                    const gstAmount =
                                      discountedAmount *
                                      ((drug?.gst || 0) / 100);
                                    const purchaseAmount =
                                      discountedAmount + gstAmount;

                                    return (
                                      <tr
                                        key={index}
                                        className={
                                          index % 2 === 0
                                            ? "bg-light"
                                            : "bg-white"
                                        }
                                      >
                                        <td className="fw-medium text-dark">
                                          {drug?.drugName}
                                        </td>
                                        <td className="text-muted">
                                          {drug?.totalOrder}
                                        </td>
                                        <td className="text-muted">
                                          {drug?.previouslyReceivedOrder || 0}
                                        </td>
                                        <td>
                                          <Input
                                            type="number"
                                            name={`drugsTally[${index}].orderReceived`}
                                            placeholder="Enter Received"
                                            value={drug?.orderReceived || ""}
                                            disabled={
                                              drug?.previouslyReceivedOrder >=
                                              drug?.totalOrder
                                            }
                                            onChange={(e) => {
                                              const orderReceived =
                                                parseInt(e?.target?.value) || 0;
                                              if (
                                                orderReceived > drug?.totalOrder
                                              ) {
                                                Swal.fire({
                                                  title: "Error!",
                                                  text: `You cannot enter an Order Received value greater than the Total Order (${drug?.totalOrder}) for ${drug?.drugName}.`,
                                                  icon: "error",
                                                  confirmButtonText: "OK",
                                                });
                                              } else {
                                                setFieldValue(
                                                  `drugsTally[${index}].orderReceived`,
                                                  orderReceived
                                                );
                                                const newAmount =
                                                  (drug?.rate || 0) *
                                                  orderReceived;
                                                setFieldValue(
                                                  `drugsTally[${index}].amount`,
                                                  newAmount
                                                );
                                              }
                                            }}
                                            className={`form-control modern-input ${
                                              touched?.drugsTally?.[index]
                                                ?.orderReceived &&
                                              errors?.drugsTally?.[index]
                                                ?.orderReceived
                                                ? "is-invalid"
                                                : ""
                                            }`}
                                            style={{ width: "100px" }}
                                          />
                                          {touched?.drugsTally?.[index]
                                            ?.orderReceived &&
                                            errors?.drugsTally?.[index]
                                              ?.orderReceived && (
                                              <div className="invalid-feedback">
                                                {
                                                  errors?.drugsTally?.[index]
                                                    ?.orderReceived
                                                }
                                              </div>
                                            )}
                                        </td>
                                        <td>
                                          <Input
                                            type="number"
                                            name={`drugsTally[${index}].freeDrug`}
                                            placeholder="Enter Free"
                                            value={drug?.freeDrug || ""}
                                            disabled={
                                              drug?.previouslyReceivedOrder >=
                                              drug?.totalOrder
                                            }
                                            onChange={(e) =>
                                              setFieldValue(
                                                `drugsTally[${index}].freeDrug`,
                                                parseInt(e?.target?.value) || 0
                                              )
                                            }
                                            className={`form-control modern-input ${
                                              touched?.drugsTally?.[index]
                                                ?.freeDrug &&
                                              errors?.drugsTally?.[index]
                                                ?.freeDrug
                                                ? "is-invalid"
                                                : ""
                                            }`}
                                            style={{ width: "100px" }}
                                          />
                                          {touched?.drugsTally?.[index]
                                            ?.freeDrug &&
                                            errors?.drugsTally?.[index]
                                              ?.freeDrug && (
                                              <div className="invalid-feedback">
                                                {
                                                  errors?.drugsTally?.[index]
                                                    ?.freeDrug
                                                }
                                              </div>
                                            )}
                                        </td>
                                        <td>
                                          <Input
                                            type="text"
                                            name={`drugsTally[${index}].batchNo`}
                                            placeholder="Batch No"
                                            value={drug?.batchNo || ""}
                                            disabled={
                                              drug?.previouslyReceivedOrder >=
                                              drug?.totalOrder
                                            }
                                            onChange={(e) =>
                                              setFieldValue(
                                                `drugsTally[${index}].batchNo`,
                                                e?.target?.value
                                              )
                                            }
                                            className={`form-control modern-input ${
                                              touched?.drugsTally?.[index]
                                                ?.batchNo &&
                                              errors?.drugsTally?.[index]
                                                ?.batchNo
                                                ? "is-invalid"
                                                : ""
                                            }`}
                                            style={{ width: "100px" }}
                                          />
                                          {touched?.drugsTally?.[index]
                                            ?.batchNo &&
                                            errors?.drugsTally?.[index]
                                              ?.batchNo && (
                                              <div className="invalid-feedback">
                                                {
                                                  errors?.drugsTally?.[index]
                                                    ?.batchNo
                                                }
                                              </div>
                                            )}
                                        </td>
                                        <td className="fw-medium text-dark">
                                          {drug?.hsn}
                                        </td>
                                        <td>
                                          <Input
                                            type="date"
                                            name={`drugsTally[${index}].expireDate`}
                                            value={drug?.expireDate || ""}
                                            disabled={
                                              drug?.previouslyReceivedOrder >=
                                              drug?.totalOrder
                                            }
                                            onChange={(e) =>
                                              setFieldValue(
                                                `drugsTally[${index}].expireDate`,
                                                e?.target?.value
                                              )
                                            }
                                            className={`form-control modern-input ${
                                              touched?.drugsTally?.[index]
                                                ?.expireDate &&
                                              errors?.drugsTally?.[index]
                                                ?.expireDate
                                                ? "is-invalid"
                                                : ""
                                            }`}
                                            style={{ width: "130px" }}
                                          />
                                          {touched?.drugsTally?.[index]
                                            ?.expireDate &&
                                            errors?.drugsTally?.[index]
                                              ?.expireDate && (
                                              <div className="invalid-feedback">
                                                {
                                                  errors?.drugsTally?.[index]
                                                    ?.expireDate
                                                }
                                              </div>
                                            )}
                                        </td>
                                        <td>
                                          <Input
                                            type="number"
                                            name={`drugsTally[${index}].mrp`}
                                            placeholder="MRP"
                                            value={drug?.mrp || ""}
                                            onChange={(e) =>
                                              setFieldValue(
                                                `drugsTally[${index}].mrp`,
                                                parseFloat(e?.target?.value) ||
                                                  0
                                              )
                                            }
                                            className={`form-control modern-input ${
                                              touched?.drugsTally?.[index]
                                                ?.mrp &&
                                              errors?.drugsTally?.[index]?.mrp
                                                ? "is-invalid"
                                                : ""
                                            }`}
                                            style={{ width: "100px" }}
                                          />
                                          {touched?.drugsTally?.[index]?.mrp &&
                                            errors?.drugsTally?.[index]
                                              ?.mrp && (
                                              <div className="invalid-feedback">
                                                {
                                                  errors?.drugsTally?.[index]
                                                    ?.mrp
                                                }
                                              </div>
                                            )}
                                        </td>
                                        <td>
                                          <Input
                                            type="number"
                                            name={`drugsTally[${index}].rate`}
                                            placeholder="Rate"
                                            value={drug?.rate || ""}
                                            onChange={(e) => {
                                              const rate =
                                                parseFloat(e?.target?.value) ||
                                                0;
                                              setFieldValue(
                                                `drugsTally[${index}].rate`,
                                                rate
                                              );
                                              const newAmount =
                                                rate *
                                                (drug?.orderReceived || 0);
                                              setFieldValue(
                                                `drugsTally[${index}].amount`,
                                                newAmount
                                              );
                                            }}
                                            className={`form-control modern-input ${
                                              touched?.drugsTally?.[index]
                                                ?.rate &&
                                              errors?.drugsTally?.[index]?.rate
                                                ? "is-invalid"
                                                : ""
                                            }`}
                                            style={{ width: "100px" }}
                                          />
                                          {touched?.drugsTally?.[index]?.rate &&
                                            errors?.drugsTally?.[index]
                                              ?.rate && (
                                              <div className="invalid-feedback">
                                                {
                                                  errors?.drugsTally?.[index]
                                                    ?.rate
                                                }
                                              </div>
                                            )}
                                        </td>
                                        <td className="text-muted">
                                          {amount?.toFixed(2)}
                                        </td>
                                        <td>
                                          <Input
                                            type="number"
                                            name={`drugsTally[${index}].discount`}
                                            placeholder="Discount %"
                                            value={drug?.discount || ""}
                                            onChange={(e) =>
                                              setFieldValue(
                                                `drugsTally[${index}].discount`,
                                                parseFloat(e?.target?.value) ||
                                                  0
                                              )
                                            }
                                            className={`form-control modern-input ${
                                              touched?.drugsTally?.[index]
                                                ?.discount &&
                                              errors?.drugsTally?.[index]
                                                ?.discount
                                                ? "is-invalid"
                                                : ""
                                            }`}
                                            style={{ width: "100px" }}
                                          />
                                          {touched?.drugsTally?.[index]
                                            ?.discount &&
                                            errors?.drugsTally?.[index]
                                              ?.discount && (
                                              <div className="invalid-feedback">
                                                {
                                                  errors?.drugsTally?.[index]
                                                    ?.discount
                                                }
                                              </div>
                                            )}
                                        </td>
                                        <td className="fw-medium text-dark">
                                          {drug?.gst}
                                        </td>
                                        <td className="text-muted">
                                          {purchaseAmount?.toFixed(2)}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </Table>

                              <div className="mt-3 d-flex justify-content-between">
                                <Card
                                  style={{
                                    width: "300px",
                                    borderRadius: "8px",
                                  }}
                                >
                                  <CardBody>
                                    <div className="d-flex justify-content-between mb-2">
                                      <strong>Previous Purchase Amount:</strong>
                                      <span>
                                        ₹
                                        {previousTotals.previousPurchaseAmount.toFixed(
                                          2
                                        )}
                                      </span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2">
                                      <strong>Previous GST:</strong>
                                      <span>
                                        ₹{previousTotals.previousGST.toFixed(2)}
                                      </span>
                                    </div>
                                  </CardBody>
                                </Card>
                                <Card
                                  style={{
                                    width: "300px",
                                    borderRadius: "8px",
                                  }}
                                >
                                  <CardBody>
                                    {(() => {
                                      const {
                                        totalGST,
                                        totalPurchaseAmount,
                                        totalRate,
                                      } = calculateTotals(
                                        values?.drugsTally.filter(
                                          (drug) =>
                                            (drug?.previouslyReceivedOrder ||
                                              0) < (drug?.totalOrder || 0)
                                        )
                                      );
                                      return (
                                        <>
                                          <div className="d-flex justify-content-between mb-2">
                                            <strong>Sub Total Rate:</strong>
                                            <span>₹{totalRate}</span>
                                          </div>
                                          <div className="d-flex justify-content-between mb-2">
                                            <strong>Sub Total GST:</strong>
                                            <span>₹{totalGST}</span>
                                          </div>
                                          <div className="d-flex justify-content-between mb-2">
                                            <strong>
                                              Sub Total Purchase Amount:
                                            </strong>
                                            <span>₹{totalPurchaseAmount}</span>
                                          </div>
                                          <div className="d-flex justify-content-between mb-2">
                                            <strong>Total GST:</strong>
                                            <span>
                                              ₹
                                              {(
                                                parseFloat(totalGST) +
                                                parseFloat(
                                                  previousTotals.previousGST
                                                )
                                              ).toFixed(2)}
                                            </span>
                                          </div>
                                          <div className="d-flex justify-content-between">
                                            <strong>
                                              Total Purchase Amount:
                                            </strong>
                                            <span>
                                              ₹
                                              {(
                                                parseFloat(
                                                  totalPurchaseAmount
                                                ) +
                                                parseFloat(
                                                  previousTotals.previousPurchaseAmount
                                                )
                                              ).toFixed(2)}
                                            </span>
                                          </div>
                                        </>
                                      );
                                    })()}
                                  </CardBody>
                                </Card>
                              </div>
                            </>
                          ) : (
                            <p className="text-muted">
                              No drug data available.
                            </p>
                          )}
                        </FormGroup>
                      </Col>

                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="deliveryType"
                            className="fw-bold text-dark"
                          >
                            Delivery Type
                          </Label>
                          <Input
                            type="text"
                            name="deliveryType"
                            id="deliveryType"
                            value={values?.deliveryType}
                            disabled
                            className="form-control"
                          />
                        </FormGroup>
                      </Col>

                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="purchaseInvoiceReceived"
                            className="fw-bold text-dark"
                          >
                            Purchase Invoice Received
                          </Label>
                          <Input
                            type="select"
                            name="purchaseInvoiceReceived"
                            id="purchaseInvoiceReceived"
                            value={values?.purchaseInvoiceReceived}
                            onChange={(e) => {
                              const value = e?.target?.value === "true";
                              setFieldValue("purchaseInvoiceReceived", value);
                              if (!value) {
                                setFieldValue("purchaseInvoiceNo", "");
                                setFieldValue("purchaseInvoice", []);
                                setFieldValue("existingPurchaseInvoice", []);
                                setFieldValue("invoiceTotalPurchaseAmount", 0);
                                setFieldValue("totalPurchaseGST", 0);
                                if (purchaseInvoiceRef?.current)
                                  purchaseInvoiceRef.current.value = "";
                              }
                            }}
                            className={`form-control ${
                              touched?.purchaseInvoiceReceived &&
                              errors?.purchaseInvoiceReceived
                                ? "is-invalid"
                                : ""
                            }`}
                          >
                            <option value="false">No</option>
                            <option value="true">Yes</option>
                          </Input>
                          {touched?.purchaseInvoiceReceived &&
                            errors?.purchaseInvoiceReceived && (
                              <div className="invalid-feedback">
                                {errors?.purchaseInvoiceReceived}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      {values?.purchaseInvoiceReceived && (
                        <>
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="purchaseInvoiceNo"
                                className="fw-bold text-dark"
                              >
                                Purchase Invoice No. *
                              </Label>
                              <Input
                                type="text"
                                name="purchaseInvoiceNo"
                                id="purchaseInvoiceNo"
                                placeholder="Enter Purchase Invoice No."
                                value={values?.purchaseInvoiceNo}
                                onChange={handleChange}
                                className={`form-control ${
                                  touched?.purchaseInvoiceNo &&
                                  errors?.purchaseInvoiceNo
                                    ? "is-invalid"
                                    : ""
                                }`}
                              />
                              {touched?.purchaseInvoiceNo &&
                                errors?.purchaseInvoiceNo && (
                                  <div className="invalid-feedback">
                                    {errors?.purchaseInvoiceNo}
                                  </div>
                                )}
                            </FormGroup>
                          </Col>

                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="invoiceTotalPurchaseAmount"
                                className="fw-bold text-dark"
                              >
                                Invoice Total Purchase Amount *
                              </Label>
                              <Input
                                type="number"
                                name="invoiceTotalPurchaseAmount"
                                id="invoiceTotalPurchaseAmount"
                                placeholder="Enter Total Purchase Amount"
                                value={values?.invoiceTotalPurchaseAmount}
                                onChange={handleChange}
                                readOnly
                                className={`form-control ${
                                  touched?.invoiceTotalPurchaseAmount &&
                                  errors?.invoiceTotalPurchaseAmount
                                    ? "is-invalid"
                                    : ""
                                }`}
                              />
                              {touched?.invoiceTotalPurchaseAmount &&
                                errors?.invoiceTotalPurchaseAmount && (
                                  <div className="invalid-feedback">
                                    {errors?.invoiceTotalPurchaseAmount}
                                  </div>
                                )}
                            </FormGroup>
                          </Col>

                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="totalPurchaseGST"
                                className="fw-bold text-dark"
                              >
                                Total Purchase GST *
                              </Label>
                              <Input
                                type="number"
                                name="totalPurchaseGST"
                                id="totalPurchaseGST"
                                placeholder="Enter Total Purchase GST"
                                value={values?.totalPurchaseGST}
                                onChange={handleChange}
                                readOnly
                                className={`form-control ${
                                  touched?.totalPurchaseGST &&
                                  errors?.totalPurchaseGST
                                    ? "is-invalid"
                                    : ""
                                }`}
                              />
                              {touched?.totalPurchaseGST &&
                                errors?.totalPurchaseGST && (
                                  <div className="invalid-feedback">
                                    {errors?.totalPurchaseGST}
                                  </div>
                                )}
                            </FormGroup>
                          </Col>

                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="purchaseInvoice"
                                className="fw-bold text-dark"
                              >
                                Upload Purchase Invoice *
                              </Label>
                              <input
                                type="file"
                                id="purchaseInvoice"
                                name="purchaseInvoice"
                                accept="image/*,application/pdf"
                                multiple
                                ref={purchaseInvoiceRef}
                                className={`form-control ${
                                  touched?.purchaseInvoice &&
                                  errors?.purchaseInvoice
                                    ? "is-invalid"
                                    : ""
                                }`}
                                onChange={handleInvoiceFiles}
                              />
                              {touched?.purchaseInvoice &&
                                errors?.purchaseInvoice && (
                                  <div className="invalid-feedback">
                                    {errors?.purchaseInvoice}
                                  </div>
                                )}
                              {values?.existingPurchaseInvoice?.length > 0 && (
                                <div className="mt-2">
                                  {values?.existingPurchaseInvoice?.map(
                                    (file, index) => (
                                      <div
                                        key={index}
                                        style={{
                                          position: "relative",
                                          display: "inline-block",
                                          marginRight: "10px",
                                          marginTop: "10px",
                                        }}
                                      >
                                        {file?.file?.type?.startsWith(
                                          "image/"
                                        ) ||
                                        file?.preview?.includes("blob:") ? (
                                          <img
                                            src={file?.preview}
                                            alt={`Invoice ${index + 1}`}
                                            style={{
                                              width: "100px",
                                              height: "auto",
                                              borderRadius: "8px",
                                            }}
                                          />
                                        ) : (
                                          <div
                                            style={{
                                              width: "100px",
                                              height: "100px",
                                              display: "flex",
                                              alignItems: "center",
                                              justifyContent: "center",
                                              background: "#f1f1f1",
                                              borderRadius: "8px",
                                            }}
                                          >
                                            <a
                                              href={file?.preview}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              style={{
                                                textDecoration: "none",
                                                color: "#007bff",
                                              }}
                                            >
                                              {file?.name || "View PDF"}
                                            </a>
                                          </div>
                                        )}
                                        <AiOutlineCloseCircle
                                          style={{
                                            position: "absolute",
                                            top: "0",
                                            right: "0",
                                            cursor: "pointer",
                                            fontSize: "20px",
                                            color: "red",
                                          }}
                                          onClick={() =>
                                            removeInvoiceFile(index)
                                          }
                                        />
                                      </div>
                                    )
                                  )}
                                </div>
                              )}
                            </FormGroup>
                          </Col>
                        </>
                      )}

                      <Col md="12" className="text-end">
                        <Button
                          type="submit"
                          color="primary"
                          disabled={formik?.isSubmitting}
                          style={{ padding: "10px 25px", borderRadius: "8px" }}
                          className="hover-scale"
                        >
                          {formik?.isSubmitting
                            ? "Submitting..."
                            : id
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
        .table-modern {
          border-collapse: separate;
          border-spacing: 0;
          background: #fff;
        }
        .table-modern th {
          background: linear-gradient(90deg, #007bff, #00c4cc);
          color: white;
          text-transform: uppercase;
          letter-spacing: 1px;
          padding: 12px;
          border: none;
        }
        .table-modern td {
          padding: 10px;
          vertical-align: middle;
          border: 1px solid #e9ecef;
          transition: background 0.3s ease;
        }
        .table-modern tr:hover {
          background: #f1f9ff;
        }
        .table-modern .bg-light {
          background: #f8f9fa;
        }
        .table-modern .bg-white {
          background: #ffffff;
        }
        .modern-input {
          border-radius: 6px;
          padding: 8px;
          font-size: 14px;
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #ced4da;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .modern-input:focus {
          border-color: #00c4cc;
          box-shadow: 0 0 5px rgba(0, 196, 204, 0.5);
        }
        .modern-input:disabled {
          background-color: #e9ecef;
          cursor: not-allowed;
        }
      `}</style>
    </React.Fragment>
  );
};

export default PurchaseReceiptForm;
