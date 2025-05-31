import React, { useRef, useState, useEffect, useCallback } from "react";
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
import AsyncSelect from "react-select/async";
import debounce from "lodash.debounce";
import Select from "react-select";
import {
  postPurchaseReceipt,
  fetchDrugDataByWithoutPOinEdit,
  updatePurchaseReceiptWithoutPO,
} from "../../../ApiService/Purchase/PurchaseRecipt";
import { getSuppliers } from "../../../ApiService/Associate/Supplier";
import {
  getDrugsBySupplier,
  searchDrugsBySupplier,
} from "../../../ApiService/Purchase/PurchaseWithoutPo";
import * as XLSX from "xlsx";
import CreateDrugModal from "../../../components/Modal/CreateDrugModal";

const deliveryModes = ["Courier", "Transport", "Direct"];
const stockTypes = ["old_stock", "new_stock"];
const adjustmentTypes = ["bonus", "return", "advertisementcost", "other"];
const adjustmentTypeLabels = {
  bonus: "Bonus",
  return: "Return",
  advertisementcost: "Advertisement Cost",
  other: "Other",
};

const getValidationSchema = (isEditMode) =>
  Yup.object({
    stockType: Yup.string().required("Stock Type is required"),
    supplier: Yup.string().required("Supplier is required"),
    invoiceReceivedDate: Yup.string().required(
      "Invoice Received Date is required"
    ),
    deliveryPerson: Yup.string().required("Delivery Person is required"),
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
    purchaseInvoiceNo: Yup.string().when("stockType", {
      is: "new_stock",
      then: (schema) => schema.required("Purchase Invoice No. is required"),
      otherwise: (schema) => schema.notRequired().nullable(),
    }),
    purchaseInvoice: Yup.mixed().when("stockType", {
      is: "new_stock",
      then: (schema) =>
        isEditMode
          ? schema.nullable()
          : schema.required("Purchase Invoice is required"),
      otherwise: (schema) => schema.notRequired().nullable(),
    }),
    deliveryBoyPhoto: Yup.mixed().nullable(),
    adjustmentType: Yup.string().nullable(),
    adjustmentAmount: Yup.number().when("adjustmentType", {
      is: (value) => adjustmentTypes.includes(value),
      then: (schema) =>
        schema
          .min(0, "Adjustment Amount cannot be negative")
          .required("Adjustment Amount is required"),
      otherwise: (schema) => schema.notRequired().nullable(),
    }),
    billNumber: Yup.string().when("adjustmentType", {
      is: "return",
      then: (schema) => schema.required("Bill Number is required"),
      otherwise: (schema) => schema.notRequired().nullable(),
    }),
    drugsTally: Yup.array()
      .of(
        Yup.object({
          drugName: Yup.string().required("Drug is required"),
          brand: Yup.string().required("Brand is required"),
          pack: Yup.string().required("Pack is required"),
          conversion_id: Yup.string(),
          quantity: Yup.number()
            .min(0, "Quantity cannot be negative")
            .required("Quantity is required"),
          free: Yup.number()
            .min(0, "Free Drug cannot be negative")
            .required("Free Drug is required"),
          hsn: Yup.string().required("HSN is required"),
          batch: Yup.string().when("type", {
            is: "medical",
            then: (schema) => schema.required("Batch No is required"),
            otherwise: (schema) => schema.notRequired().nullable(),
          }),
          expireDate: Yup.string().when("type", {
            is: "medical",
            then: (schema) =>
              schema
                .matches(
                  /^01-\d{2}-\d{4}$/,
                  "Expire Date must be in 01-MM-YYYY format"
                )
                .required("Expire Date is required"),
            otherwise: (schema) => schema.notRequired().nullable(),
          }),
          mrp: Yup.number()
            .min(0, "MRP cannot be negative")
            .required("MRP is required"),
          rate: Yup.number()
            .min(0, "Rate cannot be negative")
            .required("Rate is required"),
          discount: Yup.number()
            .min(0, "Discount cannot be negative")
            .max(100, "Discount cannot exceed 100%")
            .required("Discount is required"),
          gst: Yup.number()
            .min(0, "GST cannot be negative")
            .required("GST is required"),
        })
      )
      .min(1, "At least one drug must be added"),
  });

const PurchesWithoutPoForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const deliveryBoyPhotoRef = useRef(null);
  const [availableDrugs, setAvailableDrugs] = useState([]);
  const [isExcelUploaded, setIsExcelUploaded] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [purchaseId, setPurchaseId] = useState(null);
  const [originalDeliveryBoyPhoto, setOriginalDeliveryBoyPhoto] =
    useState(null);

  const [originalPurchaseInvoice, setOriginalPurchaseInvoice] = useState(null);
  const [bills, setBills] = useState([]);
  const [isDrugsLoading, setIsDrugsLoading] = useState(false);
  const [isCreateDrugModalOpen, setIsCreateDrugModalOpen] = useState(false);
  const [currentRowIndex, setCurrentRowIndex] = useState(null);

  const currentDate = new Date().toISOString().split("T")[0];

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };
  const currentTime = formatTime(new Date());

  // Load supplier options with debounced search
  const loadSupplierOptions = useCallback(
    debounce((inputValue, callback) => {
      getSuppliers(1, 10, inputValue)
        .then((response) => {
          const options = response.data.map((supplier) => ({
            value: supplier.supplier_id,
            label: supplier.supplier_name,
          }));

          setSuppliers(response.data);
          callback(options);
        })
        .catch((error) => {
          console.error("Error fetching suppliers:", error);
          Swal.fire({
            title: "Error!",
            text: "Failed to fetch suppliers.",
            icon: "error",
            confirmButtonText: "OK",
          });
          callback([]);
        });
    }, 300),
    []
  );

  useEffect(() => {
    const fetchPurchaseReceipt = async (id) => {
      try {
        const response = await fetchDrugDataByWithoutPOinEdit(id);
        const data = response;
        console.log("Purchase Receipt API Response:", data);

        setOriginalDeliveryBoyPhoto(data.delivery_boy_photo);
        setOriginalPurchaseInvoice(data.purchase_invoice_file);

        let supplierOption = null;
        if (data.supplier_id) {
          const supplierResponse = await getSuppliers(
            1,
            10,
            "",
            data.supplier_id
          );
          const supplier = supplierResponse.data.find(
            (sup) => sup.supplier_id === data.supplier_id
          );
          if (supplier) {
            supplierOption = {
              value: supplier.supplier_id,
              label: supplier.supplier_name,
            };
            setSelectedSupplier(supplierOption);
          }
        }

        let formattedDrugs = [];
        let formattedBills = [];
        try {
          const drugsResponse = await getDrugsBySupplier(data.supplier_id);
          const drugs = drugsResponse.drugs || [];
          formattedDrugs = drugs.map((drug) => ({
            value: drug.drug_id,
            label: drug.drug_name,
            packOptions: drug.conversions.map((conv) => ({
              value: conv.measurement_name,
              label: conv.measurement_name,
              id: conv.id || "",
            })),
            hsn_code: drug.hsn_code,
            brand_name: drug.brand_name,
            conversions: drug.conversions,
            type: drug.type,
            gst: drug.gst || 0,
            ...drug,
          }));

          // Add drugs from drug_tally to ensure they are included in availableDrugs
          const tallyDrugs = data.drug_tally.map((drug) => ({
            value: drug.drug_id,
            label: drug.drugName, // Use drugName from response
            packOptions: drug.pack_type
              ? [
                  {
                    value: drug.pack_type,
                    label: drug.pack_type,
                    id: drug.conversion_id || "",
                  },
                ]
              : [],
            hsn_code: drug.hsn,
            brand_name: drug.brand,
            conversions: drug.pack_type
              ? [{ measurement_name: drug.pack_type, id: drug.conversion_id }]
              : [],
            type: drug.pack_type.includes("other") ? "non-medical" : "medical", // Adjust based on your logic
            gst: drug.gst || 0,
            drug_id: drug.drug_id,
          }));

          // Merge tallyDrugs with formattedDrugs, avoiding duplicates
          const uniqueDrugs = [
            ...formattedDrugs,
            ...tallyDrugs.filter(
              (tDrug) =>
                !formattedDrugs.some((fDrug) => fDrug.value === tDrug.value)
            ),
          ];
          setAvailableDrugs(uniqueDrugs);

          const invoices = drugsResponse.invoices || [];
          formattedBills = invoices.map((invoice) => ({
            value: invoice.purchase_Invoice_No,
            label: invoice.purchase_Invoice_No,
          }));
          setBills(formattedBills);
        } catch (drugError) {
          console.error("Error fetching drugs:", drugError);
          // If fetching drugs fails, still populate availableDrugs with drug_tally
          formattedDrugs = data.drug_tally.map((drug) => ({
            value: drug.drug_id,
            label: drug.drugName,
            packOptions: drug.pack_type
              ? [
                  {
                    value: drug.pack_type,
                    label: drug.pack_type,
                    id: drug.conversion_id || "",
                  },
                ]
              : [],
            hsn_code: drug.hsn,
            brand_name: drug.brand,
            conversions: drug.pack_type
              ? [{ measurement_name: drug.pack_type, id: drug.conversion_id }]
              : [],
            type: drug.pack_type.includes("other") ? "non-medical" : "medical",
            gst: drug.gst || 0,
            drug_id: drug.drug_id,
          }));
          setAvailableDrugs(formattedDrugs);
          Swal.fire({
            title: "Warning!",
            text: "Failed to fetch drugs for the supplier. Using drug tally data.",
            icon: "warning",
            confirmButtonText: "OK",
          });
        }

        formik.setValues({
          stockType: data.stock_type || "new_stock",
          supplier: data.supplier_id || "",
          date: data.date || currentDate,
          time: data.time || currentTime,
          invoiceReceivedDate: data.inv_date || "",
          deliveryPerson: data.delivery_boy_name || "",
          phoneNo: data.phone_no || "",
          emailId: data.email || "",
          modeOfDelivery: data.mode_of_delivery || "",
          vehicleNo: data.vehicle_no || "",
          driverNo: data.driver_no || "",
          purchaseReceiptNumber: data.reciept_no || "N/A",
          purchaseInvoiceNo: data.purchase_Invoice_No || "",
          purchaseInvoice: data.purchase_invoice_file || null,
          deliveryBoyPhoto: data.delivery_boy_photo || null,
          adjustmentType: data.adj_type || "",
          adjustmentAmount: data.adj_amt || "",
          billNumber: data.return_bill_no || "",
          drugsTally: data.drug_tally.map((drug) => {
            const selectedDrug = formattedDrugs.find(
              (d) => d.value === drug.drug_id
            ) || {
              conversions: [],
              brand_name: drug.brand,
              hsn_code: drug.hsn,
              type: drug.pack_type.includes("other")
                ? "non-medical"
                : "medical",
            };
            const conversion = selectedDrug.conversions.find(
              (conv) => conv.measurement_name === drug.pack_type
            );

            let formattedExpireDate = drug.expireDate || "";
            if (
              formattedExpireDate &&
              formattedExpireDate.match(/^\d{4}-\d{2}-\d{2}$/)
            ) {
              const [year, month] = formattedExpireDate.split("-");
              formattedExpireDate = `01-${month}-${year}`;
            } else if (
              formattedExpireDate &&
              !formattedExpireDate.match(/^01-\d{2}-\d{4}$/)
            ) {
              console.warn(
                `Invalid expireDate format for drug ${drug.drug_id}: ${formattedExpireDate}`
              );
              formattedExpireDate = "";
            }
            return {
              drugId: drug.drug_id || "",
              drugName: drug.drug_id || "", // Keep drug_id for formik state
              conversion_id: drug.conversion_id || conversion?.id || "",
              brand: drug.brand || selectedDrug.brand_name || "",
              pack: drug.pack_type || "",
              type: selectedDrug.type || "",
              quantity: drug.quantity || 0,
              free: drug.free_drug || 0,
              hsn: drug.hsn || selectedDrug.hsn_code || "",
              batch: drug.batch || "",
              expireDate: formattedExpireDate,
              mrp: drug.mrp || 0,
              rate: drug.rate || 0,
              discount: drug.discount || 0,
              gst: drug.gst || 0,
              amount: drug.amount || 0,
              purchaseAmount: drug.purchaseAmount || 0,
            };
          }),
        });
      } catch (error) {
        console.error("Error fetching purchase receipt:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to fetch purchase receipt data.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };

    if (location.state && location.state.id) {
      setIsEditMode(true);
      setPurchaseId(location.state.id);

      fetchPurchaseReceipt(location.state.id);
    }
  }, [location.state]);

  const formik = useFormik({
    initialValues: {
      stockType: "new_stock",
      supplier: "",
      date: currentDate,
      time: currentTime,
      invoiceReceivedDate: "",
      deliveryPerson: "",
      phoneNo: "",
      emailId: "",
      modeOfDelivery: "",
      vehicleNo: "",
      driverNo: "",
      purchaseReceiptNumber: "N/A",
      purchaseInvoiceNo: "",
      purchaseInvoice: null,
      deliveryBoyPhoto: null,
      adjustmentType: "",
      adjustmentAmount: "",
      billNumber: "",
      drugsTally: [
        {
          drugId: "",
          drugName: "",
          conversion_id: "",
          brand: "",
          pack: "",
          type: "",
          quantity: 0,
          free: 0,
          hsn: "",
          batch: "",
          expireDate: "",
          mrp: 0,
          rate: 0,
          discount: 0,
          gst: 0,
          amount: 0,
          purchaseAmount: 0,
        },
      ],
    },
    validationSchema: getValidationSchema(isEditMode),
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("delivery_Type", "Complete");
        formData.append("stock_type", values.stockType || "");
        formData.append("supplier_id", values.supplier || "");
        formData.append("date", values.date);
        formData.append("time", values.time);
        formData.append(
          "invoice_receive_date",
          values.invoiceReceivedDate || ""
        );
        formData.append("delivery_boy_name", values.deliveryPerson || "");
        formData.append("phone_no", values.phoneNo || "");
        formData.append("email", values.emailId || "");
        formData.append("mode_of_delivery", values.modeOfDelivery || "");
        formData.append("vehicle_no", values.vehicleNo || "");
        formData.append("driver_no", values.driverNo || "");

        const transformedAdjustmentType = values.adjustmentType
          ? values.adjustmentType.toLowerCase().replace(/\s+/g, "")
          : "";
        formData.append("adj_type", transformedAdjustmentType);
        formData.append("adj_amt", values.adjustmentAmount || "");
        formData.append("return_bill_no", values.billNumber || "");

        if (values.stockType === "new_stock") {
          formData.append(
            "purchase_Invoice_No",
            values.purchaseInvoiceNo || ""
          );
          if (
            !isEditMode ||
            (values.purchaseInvoice &&
              values.purchaseInvoice !== originalPurchaseInvoice &&
              values.purchaseInvoice instanceof File)
          ) {
            if (values.purchaseInvoice) {
              formData.append("purchase_invoice_file", values.purchaseInvoice);
            }
          }
        }

        if (
          !isEditMode ||
          (values.deliveryBoyPhoto &&
            values.deliveryBoyPhoto !== originalDeliveryBoyPhoto &&
            values.deliveryBoyPhoto instanceof File)
        ) {
          if (values.deliveryBoyPhoto) {
            formData.append("delivery_boy_photo", values.deliveryBoyPhoto);
          }
        }

        const updatedDrugsTally = values.drugsTally.map((drug) => {
          const amount = (drug.rate || 0) * (drug.quantity || 0);
          const discountAmount = amount * ((drug.discount || 0) / 100);
          const discountedAmount = amount - discountAmount;
          const gstAmount = discountedAmount * ((drug.gst || 0) / 100);
          const purchaseAmount = discountedAmount + gstAmount;

          const selectedDrug = availableDrugs.find(
            (d) => d.value === drug.drugName
          );

          // Transform expireDate from 01-MM-YYYY to YYYY-MM-DD
          let formattedExpireDate = "";
          if (drug.expireDate && drug.expireDate.match(/^01-\d{2}-\d{4}$/)) {
            const [, month, year] = drug.expireDate.split("-");
            formattedExpireDate = `${year}-${month.padStart(2, "0")}-01`;
          } else if (drug.expireDate && selectedDrug?.type === "medical") {
            console.warn(
              `Invalid expireDate format for drug ${drug.drugName}: ${drug.expireDate}`
            );
          }

          return {
            drug_id: drug.drugName || "",
            drugName: selectedDrug ? selectedDrug.label : "",
            brand: drug.brand || "",
            pack_type: drug.pack || "",
            conversion_id: drug.conversion_id || "",
            quantity: drug.quantity || 0,
            free_drug: drug.free || 0,
            hsn: drug.hsn || "",
            batch: drug.batch || "",
            expireDate: formattedExpireDate, // Send YYYY-MM-DD to API
            mrp: drug.mrp || 0,
            rate: drug.rate || 0,
            discount: drug.discount || 0,
            gst: drug.gst || 0,
            amount: amount.toFixed(2),
            purchaseAmount: purchaseAmount.toFixed(2),
          };
        });

        // Log the drug_tally for debugging
        console.log("drug_tally:", JSON.stringify(updatedDrugsTally, null, 2));

        formData.append("drug_tally", JSON.stringify(updatedDrugsTally));

        const {
          totalGST,
          totalPurchaseAmount,
          subTotalRate,
          subTotalGST,
          totalDiscount,
        } = calculateTotals(updatedDrugsTally);
        formData.append("subtotal_rate", subTotalRate);
        formData.append("subtotal_GST", subTotalGST);
        formData.append("subtotal_purchase_amount", totalPurchaseAmount);
        formData.append("inv_gst", totalGST);
        formData.append("inv_amount", totalPurchaseAmount);
        formData.append("total_discount", totalDiscount);

        const totalPayable = (
          parseFloat(totalPurchaseAmount) -
          (parseFloat(values.adjustmentAmount) || 0)
        ).toFixed(2);
        formData.append("payable_amt", totalPayable);

        if (isEditMode) {
          formData.append("id", purchaseId);
          const response = await updatePurchaseReceiptWithoutPO(
            purchaseId,
            formData
          );
          if (response) {
            Swal.fire({
              title: "Success!",
              text: `Purchase receipt updated successfully.`,
              icon: "success",
              confirmButtonText: "OK",
            }).then(() => {
              navigate("/purchase-receipt-list");
            });
          }
        } else {
          const response = await postPurchaseReceipt(formData);
          if (response) {
            Swal.fire({
              title: "Success!",
              text: `Purchase receipt submitted successfully.`,
              icon: "success",
              confirmButtonText: "OK",
            }).then(() => {
              formik.resetForm();
              if (deliveryBoyPhotoRef.current)
                deliveryBoyPhotoRef.current.value = "";
              navigate("/purchase-receipt-list");
            });
          }
        }
      } catch (error) {
        console.error("Error submitting/updating purchase receipt:", error);
        Swal.fire({
          title: "Error!",
          text: error.message || "Failed to submit/update purchase receipt.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    },
  });
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Insert") {
        setIsCreateDrugModalOpen(true);
      }
    };

    // Add event listener on mount
    window.addEventListener("keydown", handleKeyDown);

    // Clean up on unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  const handleCreateDrug = (newDrug) => {};

  const customNoOptionsMessage = ({ inputValue }) => (
    <div className="text-center p-2">
      <p className="mb-1">No drugs found</p>
      <div className="d-flex align-items-center justify-content-center">
        <span className="me-2">Press</span>
        <kbd
          style={{
            padding: "4px 8px",
            backgroundColor: "primary",
            border: "1px solid #dee2e6",
            borderRadius: "4px",
            cursor: "pointer",
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsCreateDrugModalOpen(true);
          }}
        >
          Insert
        </kbd>
        <span className="ms-2">create</span>
      </div>
    </div>
  );

  // Update the loadDrugOptions callback to include the no options message
  const loadDrugOptions = useCallback(
    debounce((inputValue, supplierId, callback, rowIndex) => {
      if (!supplierId) {
        callback([]);
        return;
      }
      setIsDrugsLoading((prev) => ({ ...prev, [rowIndex]: true }));
      searchDrugsBySupplier(supplierId, inputValue)
        .then((response) => {
          console.log(response, "response");
          const drugs = response.results || response.results || [];
          console.log(drugs, "drugs");

          const formattedDrugs = drugs.map((drug) => ({
            value: drug.drug_id,
            label: drug.drug_name,
            packOptions: drug.conversions.map((conv) => ({
              value: conv.measurement_name,
              label: conv.measurement_name,
              id: conv.id || "",
              quantity: conv.quantity || 1,
            })),
            hsn_code: drug.hsn || "",
            brand_name: drug.brand_name || "",
            conversions: drug.conversions || [],
            type: drug.type || "",
            gst: drug.gst || 0,
          }));

          // Update availableDrugs with new drugs, avoiding duplicates
          setAvailableDrugs((prev) => {
            const existingIds = new Set(prev.map((d) => d.value));
            const newDrugs = formattedDrugs.filter(
              (d) => !existingIds.has(d.value)
            );
            return [...prev, ...newDrugs];
          });

          callback(formattedDrugs);
        })
        .catch((error) => {
          console.error("Error fetching drugs:", error);
          Swal.fire({
            title: "Error!",
            text: "Failed to search drugs.",
            icon: "error",
            confirmButtonText: "OK",
          });
          callback([]);
        })
        .finally(() => {
          setIsDrugsLoading((prev) => ({ ...prev, [rowIndex]: false }));
        });
    }, 300),
    []
  );
  const { values, handleSubmit, handleChange, setFieldValue, errors, touched } =
    formik;

  const handleSupplierChange = async (selectedOption) => {
    const supplierId = selectedOption ? selectedOption.value : "";
    setSelectedSupplier(selectedOption);
    setFieldValue("supplier", supplierId);
    setIsDrugsLoading(true);
    setFieldValue("supplier", supplierId);
    setAvailableDrugs([]);
    setBills([]);
    setIsDrugsLoading({});
    if (supplierId) {
      try {
        const response = await getDrugsBySupplier(supplierId);
        const drugs = response.results?.drugs || [];
        const formattedDrugs = drugs.map((drug) => ({
          value: drug.drug_id,
          label: drug.drug_name,
          packOptions: drug.conversions.map((conv) => ({
            value: conv.measurement_name,
            label: conv.measurement_name,
            id: conv.id || "",
          })),
          hsn_code: drug.hsn_code,
          brand_name: drug.brand_name,
          conversions: drug.conversions,
          type: drug.type,
          ...drug,
        }));
        setAvailableDrugs(formattedDrugs);

        const invoices = response.invoices || [];
        const formattedBills = invoices.map((invoice) => ({
          value: invoice.purchase_Invoice_No,
          label: invoice.purchase_Invoice_No,
        }));
        setBills(formattedBills);

        if (
          formattedDrugs.some((drug) => drug.packOptions.some((opt) => !opt.id))
        ) {
          Swal.fire({
            title: "Warning!",
            text: "Some drugs are missing conversion IDs. Please contact support.",
            icon: "warning",
            confirmButtonText: "OK",
          });
        }
      } catch (error) {
        console.error("Error fetching drugs or invoices:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to fetch drugs or invoices for the selected supplier.",
          icon: "error",
          confirmButtonText: "OK",
        });
        setAvailableDrugs([]);
        setBills([]);
      } finally {
        setIsDrugsLoading(false);
      }
    } else {
      setAvailableDrugs([]);
      setBills([]);
      setIsDrugsLoading(false);
    }
  };

  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsExcelUploaded(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          if (jsonData.length === 0) {
            Swal.fire({
              title: "Warning!",
              text: "The Excel file is empty. Please ensure it contains drug data.",
              icon: "warning",
              confirmButtonText: "OK",
            });
            return;
          }

          const errors = [];
          const mappedDrugs = jsonData
            .map((row, rowIndex) => {
              const drugName = row["Drug Name"]
                ? String(row["Drug Name"]).trim()
                : "";
              if (!drugName) {
                errors.push(`Row ${rowIndex + 2}: Missing Drug Name`);
                return null;
              }

              const selectedDrug = availableDrugs.find(
                (d) => d.label.toLowerCase() === drugName.toLowerCase()
              );

              if (!selectedDrug) {
                errors.push(
                  `Row ${rowIndex + 2}: Drug not found: "${drugName}"`
                );
                return null;
              }

              // Process expireDate to 01-MM-YYYY
              let expireDate = row["Expire Date"]
                ? String(row["Expire Date"]).trim()
                : "";
              if (expireDate && expireDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
                const [year, month] = expireDate.split("-");
                expireDate = `01-${month}-${year}`;
              } else if (expireDate && expireDate.match(/^\d{2}-\d{4}$/)) {
                const [month, year] = expireDate.split("-");
                expireDate = `01-${month}-${year}`;
              } else if (
                expireDate &&
                !expireDate.match(/^01-\d{2}-\d{4}$/) &&
                selectedDrug.type === "medical"
              ) {
                errors.push(
                  `Row ${
                    rowIndex + 2
                  }: Invalid Expire Date format for "${drugName}". Use MM-YYYY or YYYY-MM-DD.`
                );
                expireDate = "";
              }

              return {
                drugId: selectedDrug.value,
                drugName: selectedDrug.value,
                brand: selectedDrug.brand_name || "",
                pack: "",
                conversion_id: "",
                type: selectedDrug.type || "",
                quantity: parseFloat(row["Quantity"]) || 0,
                free: parseFloat(row["Free"]) || 0,
                hsn: selectedDrug.hsn_code || "",
                batch: row["Batch"] ? String(row["Batch"]).trim() : "",
                expireDate: expireDate,
                mrp: parseFloat(row["MRP"]) || 0,
                rate: parseFloat(row["Rate"]) || 0,
                discount: parseFloat(row["Discount"]) || 0,
                gst: parseFloat(row["GST"]) || selectedDrug.gst || 0,
                amount:
                  (parseFloat(row["Rate"]) || 0) *
                  (parseFloat(row["Quantity"]) || 0),
                purchaseAmount: 0,
              };
            })
            .filter((drug) => drug !== null);

          if (mappedDrugs.length === 0) {
            const errorMessage = errors.length
              ? `No valid drugs found in the Excel file. Issues:\n${errors.join(
                  "\n"
                )}`
              : "No valid drugs found. Please ensure the file contains correct drug names.";
            Swal.fire({
              title: "Warning!",
              text: errorMessage,
              icon: "warning",
              confirmButtonText: "OK",
            });
            return;
          }

          const updatedDrugsTally = mappedDrugs.map((drug) => {
            const amount = (drug.rate || 0) * (drug.quantity || 0);
            const discountAmount = amount * ((drug.discount || 0) / 100);
            const discountedAmount = amount - discountAmount;
            const gstAmount = discountedAmount * ((drug.gst || 0) / 100);
            const purchaseAmount = discountedAmount + gstAmount;

            return {
              ...drug,
              amount: amount.toFixed(2),
              purchaseAmount: purchaseAmount.toFixed(2),
            };
          });

          setFieldValue("drugsTally", updatedDrugsTally);
          let successMessage = `Excel data loaded successfully. ${updatedDrugsTally.length} drug(s) added to the table.`;
          if (errors.length) {
            successMessage += `\nIssues encountered:\n${errors.join("\n")}`;
          }
          Swal.fire({
            title: "Success!",
            text: successMessage,
            icon: "success",
            confirmButtonText: "OK",
          });
        } catch (error) {
          console.error("Error processing Excel file:", error);
          Swal.fire({
            title: "Error!",
            text: "Failed to process the Excel file. Please ensure it is a valid Excel file.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      };
      reader.onerror = () => {
        Swal.fire({
          title: "Error!",
          text: "Failed to read the Excel file.",
          icon: "error",
          confirmButtonText: "OK",
        });
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const addDrugEntry = () => {
    setFieldValue("drugsTally", [
      ...values.drugsTally,
      {
        drugId: "",
        drugName: "",
        conversion_id: "",
        brand: "",
        pack: "",
        type: "",
        quantity: 0,
        free: 0,
        hsn: "",
        batch: "",
        expireDate: "",
        mrp: 0,
        rate: 0,
        discount: 0,
        gst: 0,
        amount: 0,
        purchaseAmount: 0,
      },
    ]);
  };

  const handleKeyPress = (e, index) => {
    if (e.key === "Enter" && index === values.drugsTally.length - 1) {
      e.preventDefault();
      addDrugEntry();
    }
  };

  const removeDrugEntry = (index) => {
    const updatedDrugs = values.drugsTally.filter((_, idx) => idx !== index);
    setFieldValue("drugsTally", updatedDrugs);
  };

  const removeFile = (fieldName) => {
    setFieldValue(fieldName, null);
  };

  const calculateTotals = (drugsTally) => {
    let subTotalRate = 0;
    let subTotalGST = 0;
    let totalPurchaseAmount = 0;
    let totalGST = 0;
    let totalDiscount = 0;

    drugsTally.forEach((drug) => {
      const amount = (drug.rate || 0) * (drug.quantity || 0);
      const discountAmount = amount * ((drug.discount || 0) / 100);
      const discountedAmount = amount - discountAmount;
      const gstAmount = discountedAmount * ((drug.gst || 0) / 100);
      const purchaseAmount = discountedAmount + gstAmount;

      subTotalRate += amount;
      subTotalGST += gstAmount;
      totalPurchaseAmount += purchaseAmount;
      totalGST += gstAmount;
      totalDiscount += discountAmount;
    });

    return {
      subTotalRate: subTotalRate.toFixed(2),
      subTotalGST: subTotalGST.toFixed(2),
      totalPurchaseAmount: totalPurchaseAmount.toFixed(2),
      totalGST: totalGST.toFixed(2),
      totalDiscount: totalDiscount.toFixed(2),
    };
  };

  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      borderRadius: "6px",
      padding: "2px",
      fontSize: "14px",
      boxShadow: state.isFocused
        ? "0 0 5px rgba(0, 196, 204, 0.5)"
        : "inset 0 1px 3px rgba(0, 0, 0, 0.1)",
      border: state.isFocused
        ? "1px solid #00c4cc"
        : touched.supplier && errors.supplier
        ? "1px solid #dc3545"
        : "1px solid #ced4da",
      minHeight: "38px",
      "&:hover": {
        borderColor: state.isFocused ? "#00c4cc" : "#ced4da",
      },
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
      position: "absolute",
      top: "100%",
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: "200px",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#007bff"
        : state.isFocused
        ? "#f1f9ff"
        : "white",
      color: state.isSelected ? "white" : "black",
      "&:hover": {
        backgroundColor: state.isSelected ? "#007bff" : "#f1f9ff",
      },
    }),
  };

  const {
    subTotalRate,
    subTotalGST,
    totalPurchaseAmount,
    totalGST,
    totalDiscount,
  } = calculateTotals(values.drugsTally);

  const totalPayable = (
    parseFloat(totalPurchaseAmount) - (parseFloat(values.adjustmentAmount) || 0)
  ).toFixed(2);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Purchase Management"
            breadcrumbItem={
              isEditMode
                ? "Edit Purchase Without PO"
                : "Add Purchase Without PO"
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
                        ? "Edit Purchase Without PO"
                        : "Add Purchase Without PO"}
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
                          <Label
                            for="stockType"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Stock Type *
                          </Label>
                          <Input
                            type="select"
                            name="stockType"
                            id="stockType"
                            value={values.stockType}
                            onChange={(e) => {
                              handleChange(e);
                              if (e.target.value === "old_stock") {
                                setFieldValue("purchaseInvoiceNo", "");
                                setFieldValue("purchaseInvoice", null);
                              }
                            }}
                            className={`form-control ${
                              touched.stockType && errors.stockType
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          >
                            <option value="">Select Stock Type</option>
                            {stockTypes.map((type, index) => (
                              <option key={index} value={type}>
                                {type}
                              </option>
                            ))}
                          </Input>
                          {touched.stockType && errors.stockType && (
                            <div className="invalid-feedback">
                              {errors.stockType}
                            </div>
                          )}
                        </FormGroup>
                      </Col>

                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="supplier"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Supplier *
                          </Label>
                          <AsyncSelect
                            name="supplier"
                            cacheOptions
                            defaultOptions
                            loadOptions={loadSupplierOptions}
                            value={selectedSupplier} // Use selectedSupplier state
                            onChange={handleSupplierChange}
                            placeholder="Search for a supplier..."
                            isClearable
                            styles={customSelectStyles}
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                          />
                          {touched.supplier && errors.supplier && (
                            <div
                              className="invalid-feedback"
                              style={{ display: "block" }}
                            >
                              {errors.supplier}
                            </div>
                          )}
                        </FormGroup>
                      </Col>

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
                            type="date"
                            name="date"
                            id="date"
                            value={values.date}
                            disabled={!isEditMode}
                            onChange={handleChange}
                            className="form-control"
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                        </FormGroup>
                      </Col>

                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="time"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Time
                          </Label>
                          <Input
                            type="text"
                            name="time"
                            id="time"
                            value={values.time}
                            disabled={!isEditMode}
                            onChange={handleChange}
                            className="form-control"
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                        </FormGroup>
                      </Col>

                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="invoiceReceivedDate"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Invoice Received Date *
                          </Label>
                          <Input
                            type="date"
                            name="invoiceReceivedDate"
                            id="invoiceReceivedDate"
                            value={values.invoiceReceivedDate}
                            onChange={handleChange}
                            className={`form-control ${
                              touched.invoiceReceivedDate &&
                              errors.invoiceReceivedDate
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {touched.invoiceReceivedDate &&
                            errors.invoiceReceivedDate && (
                              <div className="invalid-feedback">
                                {errors.invoiceReceivedDate}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="deliveryPerson"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Delivery Person *
                          </Label>
                          <Input
                            type="text"
                            name="deliveryPerson"
                            id="deliveryPerson"
                            placeholder="Enter Delivery Person Name"
                            value={values.deliveryPerson}
                            onChange={handleChange}
                            className={`form-control ${
                              touched.deliveryPerson && errors.deliveryPerson
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {touched.deliveryPerson && errors.deliveryPerson && (
                            <div className="invalid-feedback">
                              {errors.deliveryPerson}
                            </div>
                          )}
                        </FormGroup>
                      </Col>

                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="deliveryBoyPhoto"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
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
                            onChange={(event) => {
                              if (event.target.files && event.target.files[0]) {
                                const file = event.target.files[0];
                                setFieldValue("deliveryBoyPhoto", file);
                              }
                            }}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                              marginBottom: "10px",
                            }}
                          />
                          {values.deliveryBoyPhoto && (
                            <div
                              style={{
                                position: "relative",
                                display: "inline-block",
                                marginTop: "10px",
                              }}
                            >
                              <img
                                src={
                                  values.deliveryBoyPhoto instanceof File
                                    ? URL.createObjectURL(
                                        values.deliveryBoyPhoto
                                      )
                                    : `${import.meta.env.VITE_API_BASE_URL}${
                                        values.deliveryBoyPhoto
                                      }`
                                }
                                alt="Delivery Boy Preview"
                                style={{
                                  maxWidth: "100%",
                                  maxHeight: "200px",
                                  borderRadius: "8px",
                                  border: "1px solid #dee2e6",
                                }}
                                onError={(e) => {
                                  e.target.src = "path/to/fallback-image.jpg";
                                  console.error(
                                    "Failed to load delivery boy photo:",
                                    values.deliveryBoyPhoto
                                  );
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setFieldValue("deliveryBoyPhoto", null);
                                  if (deliveryBoyPhotoRef.current)
                                    deliveryBoyPhotoRef.current.value = "";
                                }}
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
                          {touched.deliveryBoyPhoto &&
                            errors.deliveryBoyPhoto && (
                              <div className="invalid-feedback">
                                {errors.deliveryBoyPhoto}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="phoneNo"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Phone No.
                          </Label>
                          <Input
                            type="text"
                            name="phoneNo"
                            id="phoneNo"
                            placeholder="Enter 10-digit Phone No."
                            value={values.phoneNo}
                            onChange={handleChange}
                            className={`form-control ${
                              touched.phoneNo && errors.phoneNo
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {touched.phoneNo && errors.phoneNo && (
                            <div className="invalid-feedback">
                              {errors.phoneNo}
                            </div>
                          )}
                        </FormGroup>
                      </Col>

                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="emailId"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Email ID
                          </Label>
                          <Input
                            type="email"
                            name="emailId"
                            id="emailId"
                            placeholder="Enter Email ID"
                            value={values.emailId}
                            onChange={handleChange}
                            className={`form-control ${
                              touched.emailId && errors.emailId
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {touched.emailId && errors.emailId && (
                            <div className="invalid-feedback">
                              {errors.emailId}
                            </div>
                          )}
                        </FormGroup>
                      </Col>

                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="modeOfDelivery"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Mode of Delivery
                          </Label>
                          <Input
                            type="select"
                            name="modeOfDelivery"
                            id="modeOfDelivery"
                            value={values.modeOfDelivery}
                            onChange={handleChange}
                            className="form-control"
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          >
                            <option value="">Select Mode of Delivery</option>
                            {deliveryModes.map((mode, index) => (
                              <option key={index} value={mode}>
                                {mode}
                              </option>
                            ))}
                          </Input>
                        </FormGroup>
                      </Col>

                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="vehicleNo"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Vehicle No.
                          </Label>
                          <Input
                            type="text"
                            name="vehicleNo"
                            id="vehicleNo"
                            placeholder="Enter Vehicle No."
                            value={values.vehicleNo}
                            onChange={handleChange}
                            className="form-control"
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                        </FormGroup>
                      </Col>

                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="driverNo"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Driver No.
                          </Label>
                          <Input
                            type="text"
                            name="driverNo"
                            id="driverNo"
                            placeholder="Enter 10-digit Driver No."
                            value={values.driverNo}
                            onChange={handleChange}
                            className={`form-control ${
                              touched.driverNo && errors.driverNo
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {touched.driverNo && errors.driverNo && (
                            <div className="invalid-feedback">
                              {errors.driverNo}
                            </div>
                          )}
                        </FormGroup>
                      </Col>

                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="purchaseReceiptNumber"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Purchase Receipt Number
                          </Label>
                          <Input
                            type="text"
                            name="purchaseReceiptNumber"
                            id="_purchaseReceiptNumber"
                            value={values.purchaseReceiptNumber}
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

                      {values.stockType === "new_stock" && (
                        <Col md="6">
                          <FormGroup>
                            <Label
                              for="purchaseInvoiceNo"
                              className="fw-bold text-dark"
                              style={{ fontSize: "14px" }}
                            >
                              Purchase Invoice No. *
                            </Label>
                            <Input
                              type="text"
                              name="purchaseInvoiceNo"
                              id="purchaseInvoiceNo"
                              placeholder="Enter Purchase Invoice No."
                              value={values.purchaseInvoiceNo}
                              onChange={handleChange}
                              className={`form-control ${
                                touched.purchaseInvoiceNo &&
                                errors.purchaseInvoiceNo
                                  ? "is-invalid"
                                  : ""
                              }`}
                              style={{
                                borderRadius: "8px",
                                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                padding: "10px",
                              }}
                            />
                            {touched.purchaseInvoiceNo &&
                              errors.purchaseInvoiceNo && (
                                <div className="invalid-feedback">
                                  {errors.purchaseInvoiceNo}
                                </div>
                              )}
                          </FormGroup>
                        </Col>
                      )}

                      {values.stockType === "new_stock" && (
                        <Col md="6">
                          <FormGroup>
                            <Label
                              for="purchaseInvoice"
                              className="fw-bold text-dark"
                              style={{ fontSize: "14px" }}
                            >
                              Upload Purchase Invoice *
                            </Label>
                            <Input
                              type="file"
                              name="purchaseInvoice"
                              id="purchaseInvoice"
                              accept="image/*,application/pdf"
                              className={`form-control ${
                                touched.purchaseInvoice &&
                                errors.purchaseInvoice
                                  ? "is-invalid"
                                  : ""
                              }`}
                              style={{
                                borderRadius: "8px",
                                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                padding: "10px",
                              }}
                              onChange={(event) => {
                                if (
                                  event.target.files &&
                                  event.target.files[0]
                                ) {
                                  const file = event.target.files[0];
                                  setFieldValue("purchaseInvoice", file);
                                }
                              }}
                            />
                            {touched.purchaseInvoice &&
                              errors.purchaseInvoice && (
                                <div className="invalid-feedback">
                                  {errors.purchaseInvoice}
                                </div>
                              )}
                            {values.purchaseInvoice && (
                              <div className="mt-2">
                                <div
                                  style={{
                                    position: "relative",
                                    display: "inline-block",
                                    marginRight: "10px",
                                  }}
                                >
                                  {values.purchaseInvoice instanceof File &&
                                  values.purchaseInvoice.type.startsWith(
                                    "image/"
                                  ) ? (
                                    <img
                                      src={URL.createObjectURL(
                                        values.purchaseInvoice
                                      )}
                                      alt="Invoice Preview"
                                      style={{
                                        width: "100px",
                                        height: "auto",
                                        marginRight: "10px",
                                      }}
                                    />
                                  ) : values.purchaseInvoice instanceof File &&
                                    values.purchaseInvoice.type ===
                                      "application/pdf" ? (
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
                                        href={URL.createObjectURL(
                                          values.purchaseInvoice
                                        )}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                          textDecoration: "none",
                                          color: "#007bff",
                                          fontWeight: "bold",
                                          fontSize: "14px",
                                          textAlign: "center",
                                        }}
                                      >
                                        View PDF
                                      </a>
                                    </div>
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
                                      {values.purchaseInvoice.endsWith(
                                        ".pdf"
                                      ) ? (
                                        <a
                                          href={`${
                                            import.meta.env.VITE_API_BASE_URL
                                          }${values.purchaseInvoice}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          style={{
                                            textDecoration: "none",
                                            color: "#007bff",
                                            fontWeight: "bold",
                                            fontSize: "14px",
                                            textAlign: "center",
                                          }}
                                        >
                                          View PDF
                                        </a>
                                      ) : (
                                        <img
                                          src={`${
                                            import.meta.env.VITE_API_BASE_URL
                                          }${values.purchaseInvoice}`}
                                          alt="Invoice Preview"
                                          style={{
                                            width: "100px",
                                            height: "auto",
                                            marginRight: "10px",
                                          }}
                                          onError={(e) => {
                                            e.target.src =
                                              "path/to/fallback-image.jpg";
                                            console.error(
                                              "Failed to load purchase invoice:",
                                              values.purchaseInvoice
                                            );
                                          }}
                                        />
                                      )}
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
                                      removeFile("purchaseInvoice")
                                    }
                                  />
                                </div>
                              </div>
                            )}
                          </FormGroup>
                        </Col>
                      )}

                      {values.stockType === "new_stock" && (
                        <Col md="6">
                          <FormGroup>
                            <Label
                              for="excelUpload"
                              className="fw-bold text-dark"
                              style={{ fontSize: "14px" }}
                            >
                              Upload Excel for Drugs
                            </Label>
                            <Input
                              type="file"
                              name="excelUpload"
                              id="excelUpload"
                              accept=".xlsx, .xls"
                              className="form-control"
                              style={{
                                borderRadius: "8px",
                                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                padding: "10px",
                              }}
                              onChange={handleExcelUpload}
                              disabled={!values.supplier}
                            />
                            {isExcelUploaded && (
                              <div className="mt-2">
                                <span className="text-success">
                                  Excel file uploaded successfully.
                                </span>
                              </div>
                            )}
                          </FormGroup>
                        </Col>
                      )}

                      <Col md="12">
                        <FormGroup>
                          <div className="mb-3">
                            <Label
                              for="drugsTally"
                              className="fw-bold text-dark"
                              style={{ fontSize: "14px" }}
                            >
                              Drugs Details *
                            </Label>
                          </div>
                          <Table
                            bordered
                            responsive
                            className="table-modern shadow-sm"
                            style={{ borderRadius: "10px" }}
                          >
                            <thead className="table-primary">
                              <tr>
                                <th
                                  className="text-white fw-bold"
                                  style={{ minWidth: "300px" }}
                                >
                                  Drug Name *
                                </th>
                                <th className="text-white fw-bold">Brand *</th>
                                <th className="text-white fw-bold">Pack *</th>
                                <th className="text-white fw-bold">
                                  Quantity *
                                </th>
                                <th className="text-white fw-bold">Free *</th>
                                <th className="text-white fw-bold">HSN *</th>
                                <th className="text-white fw-bold">Batch *</th>
                                <th className="text-white fw-bold">
                                  Expire Date *
                                </th>
                                <th className="text-white fw-bold">MRP *</th>
                                <th className="text-white fw-bold">Rate *</th>
                                <th className="text-white fw-bold">Amount</th>
                                <th className="text-white fw-bold">
                                  Discount (%) *
                                </th>
                                <th className="text-white fw-bold">
                                  GST (%) *
                                </th>
                                <th className="text-white fw-bold">
                                  Purchase Amount
                                </th>
                                <th className="text-white fw-bold">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {values.drugsTally.map((drug, index) => {
                                const amount =
                                  (drug.rate || 0) * (drug.quantity || 0);
                                const discountAmount =
                                  amount * ((drug.discount || 0) / 100);
                                const discountedAmount =
                                  amount - discountAmount;
                                const gstAmount =
                                  discountedAmount * ((drug.gst || 0) / 100);
                                const purchaseAmount =
                                  discountedAmount + gstAmount;

                                const selectedDrug = availableDrugs.find(
                                  (d) => d.value === drug.drugName
                                );
                                const packOptions = selectedDrug
                                  ? selectedDrug.packOptions
                                  : [];

                                return (
                                  <tr
                                    key={index}
                                    className={
                                      index % 2 === 0 ? "bg-light" : "bg-white"
                                    }
                                  >
                                    <td>
                                      <div className="d-flex gap-2">
                                        <AsyncSelect
                                          name={`drugsTally[${index}].drugName`}
                                          cacheOptions
                                          defaultOptions={availableDrugs} // Show cached drugs initially
                                          loadOptions={(inputValue, callback) =>
                                            loadDrugOptions(
                                              inputValue,
                                              values.supplier,
                                              callback,
                                              index
                                            )
                                          }
                                          value={
                                            drug.drugName
                                              ? availableDrugs.find(
                                                  (d) =>
                                                    d.value === drug.drugName
                                                )
                                              : null
                                          }
                                          onChange={(selectedOption) => {
                                            const drugId = selectedOption
                                              ? selectedOption.value
                                              : "";
                                            setFieldValue(
                                              `drugsTally[${index}].drugName`,
                                              drugId
                                            );
                                            if (selectedOption) {
                                              setFieldValue(
                                                `drugsTally[${index}].brand`,
                                                selectedOption.brand_name || ""
                                              );
                                              setFieldValue(
                                                `drugsTally[${index}].type`,
                                                selectedOption.type || ""
                                              );
                                              setFieldValue(
                                                `drugsTally[${index}].gst`,
                                                selectedOption.gst || 0
                                              );
                                              if (
                                                selectedOption.conversions
                                                  ?.length > 0
                                              ) {
                                                setFieldValue(
                                                  `drugsTally[${index}].pack`,
                                                  selectedOption.conversions[0]
                                                    .measurement_name || ""
                                                );
                                                setFieldValue(
                                                  `drugsTally[${index}].conversion_id`,
                                                  selectedOption.conversions[0]
                                                    .id || ""
                                                );
                                              } else {
                                                setFieldValue(
                                                  `drugsTally[${index}].pack`,
                                                  ""
                                                );
                                                setFieldValue(
                                                  `drugsTally[${index}].conversion_id`,
                                                  ""
                                                );
                                              }
                                              setFieldValue(
                                                `drugsTally[${index}].hsn`,
                                                selectedOption.hsn_code || ""
                                              );
                                            } else {
                                              setFieldValue(
                                                `drugsTally[${index}].brand`,
                                                ""
                                              );
                                              setFieldValue(
                                                `drugsTally[${index}].type`,
                                                ""
                                              );
                                              setFieldValue(
                                                `drugsTally[${index}].gst`,
                                                0
                                              );
                                              setFieldValue(
                                                `drugsTally[${index}].pack`,
                                                ""
                                              );
                                              setFieldValue(
                                                `drugsTally[${index}].conversion_id`,
                                                ""
                                              );
                                              setFieldValue(
                                                `drugsTally[${index}].hsn`,
                                                ""
                                              );
                                            }
                                          }}
                                          isSearchable={true}
                                          isClearable
                                          isDisabled={!values.supplier}
                                          isLoading={
                                            isDrugsLoading[index] || false
                                          }
                                          noOptionsMessage={
                                            customNoOptionsMessage
                                          }
                                          styles={{
                                            ...customSelectStyles,
                                            container: (provided) => ({
                                              ...provided,
                                              width: "100%",
                                            }),
                                            noOptionsMessage: (provided) => ({
                                              ...provided,
                                              backgroundColor: "white",
                                              color: "#6c757d",
                                            }),
                                          }}
                                          placeholder={
                                            isDrugsLoading[index]
                                              ? "Loading..."
                                              : "Search Drug..."
                                          }
                                          menuPortalTarget={document.body}
                                          menuPosition="fixed"
                                        />
                                      </div>
                                    </td>
                                    <td>
                                      <span
                                        style={{
                                          width: "100px",
                                          display: "inline-block",
                                        }}
                                      >
                                        {drug.brand || "-"}
                                      </span>
                                    </td>
                                    <td>
                                      <Select
                                        name={`drugsTally[${index}].pack`}
                                        options={packOptions}
                                        value={
                                          drug.pack
                                            ? packOptions.find(
                                                (option) =>
                                                  option.value === drug.pack
                                              )
                                            : null
                                        }
                                        onChange={(selectedOption) => {
                                          console.log(
                                            "Selected Pack:",
                                            selectedOption
                                          );
                                          setFieldValue(
                                            `drugsTally[${index}].pack`,
                                            selectedOption
                                              ? selectedOption.value
                                              : ""
                                          );
                                          setFieldValue(
                                            `drugsTally[${index}].conversion_id`,
                                            selectedOption
                                              ? selectedOption.id
                                              : ""
                                          );
                                        }}
                                        placeholder="Select Pack..."
                                        isSearchable={true}
                                        isClearable
                                        isDisabled={!drug.drugName}
                                        styles={customSelectStyles}
                                        index={index}
                                        menuPortalTarget={document.body}
                                        menuPosition="fixed"
                                      />
                                      {touched.drugsTally?.[index]?.pack &&
                                        errors.drugsTally?.[index]?.pack && (
                                          <div
                                            className="invalid-feedback"
                                            style={{ display: "block" }}
                                          >
                                            {errors.drugsTally[index].pack}
                                          </div>
                                        )}
                                    </td>
                                    <td>
                                      <Input
                                        type="number"
                                        name={`drugsTally[${index}].quantity`}
                                        value={drug.quantity}
                                        onChange={(e) => {
                                          handleChange(e);
                                          setFieldValue(
                                            `drugsTally[${index}].amount`,
                                            (
                                              (drug.rate || 0) *
                                              (e.target.value || 0)
                                            ).toFixed(2)
                                          );
                                        }}
                                        onKeyPress={(e) =>
                                          handleKeyPress(e, index)
                                        }
                                        className={`form-control ${
                                          touched.drugsTally?.[index]
                                            ?.quantity &&
                                          errors.drugsTally?.[index]?.quantity
                                            ? "is-invalid"
                                            : ""
                                        }`}
                                        style={{
                                          borderRadius: "8px",
                                          width: "100px",
                                        }}
                                      />
                                      {touched.drugsTally?.[index]?.quantity &&
                                        errors.drugsTally?.[index]
                                          ?.quantity && (
                                          <div className="invalid-feedback">
                                            {errors.drugsTally[index].quantity}
                                          </div>
                                        )}
                                    </td>
                                    <td>
                                      <Input
                                        type="number"
                                        name={`drugsTally[${index}].free`}
                                        value={drug.free}
                                        onChange={handleChange}
                                        onKeyPress={(e) =>
                                          handleKeyPress(e, index)
                                        }
                                        className={`form-control ${
                                          touched.drugsTally?.[index]?.free &&
                                          errors.drugsTally?.[index]?.free
                                            ? "is-invalid"
                                            : ""
                                        }`}
                                        style={{
                                          borderRadius: "8px",
                                          width: "100px",
                                        }}
                                      />
                                      {touched.drugsTally?.[index]?.free &&
                                        errors.drugsTally?.[index]?.free && (
                                          <div className="invalid-feedback">
                                            {errors.drugsTally[index].free}
                                          </div>
                                        )}
                                    </td>
                                    <td>
                                      <span
                                        style={{
                                          width: "100px",
                                          display: "inline-block",
                                        }}
                                      >
                                        {drug.hsn || "-"}
                                      </span>
                                    </td>
                                    <td>
                                      <Input
                                        type="text"
                                        name={`drugsTally[${index}].batch`}
                                        value={drug.batch}
                                        onChange={handleChange}
                                        onKeyPress={(e) =>
                                          handleKeyPress(e, index)
                                        }
                                        className={`form-control ${
                                          touched.drugsTally?.[index]?.batch &&
                                          errors.drugsTally?.[index]?.batch
                                            ? "is-invalid"
                                            : ""
                                        }`}
                                        style={{
                                          borderRadius: "8px",
                                          width: "100px",
                                        }}
                                      />
                                      {touched.drugsTally?.[index]?.batch &&
                                        errors.drugsTally?.[index]?.batch && (
                                          <div className="invalid-feedback">
                                            {errors.drugsTally[index].batch}
                                          </div>
                                        )}
                                    </td>
                                    <td>
                                      <Input
                                        type="month"
                                        name={`drugsTally[${index}].expireDate`}
                                        value={
                                          drug.expireDate &&
                                          drug.expireDate.match(
                                            /^01-\d{2}-\d{4}$/
                                          )
                                            ? `${drug.expireDate.slice(
                                                6
                                              )}-${drug.expireDate.slice(3, 5)}` // Convert 01-MM-YYYY to YYYY-MM
                                            : ""
                                        }
                                        onChange={(e) => {
                                          const value = e.target.value; // e.g., "2025-05"
                                          if (value) {
                                            const [year, month] =
                                              value.split("-");
                                            setFieldValue(
                                              `drugsTally[${index}].expireDate`,
                                              `01-${month}-${year}` // Set to 01-MM-YYYY
                                            );
                                          } else {
                                            setFieldValue(
                                              `drugsTally[${index}].expireDate`,
                                              ""
                                            );
                                          }
                                        }}
                                        onKeyPress={(e) =>
                                          handleKeyPress(e, index)
                                        }
                                        className={`form-control ${
                                          touched.drugsTally?.[index]
                                            ?.expireDate &&
                                          errors.drugsTally?.[index]?.expireDate
                                            ? "is-invalid"
                                            : ""
                                        }`}
                                        style={{
                                          borderRadius: "8px",
                                          width: "150px",
                                        }}
                                      />
                                      {touched.drugsTally?.[index]
                                        ?.expireDate &&
                                        errors.drugsTally?.[index]
                                          ?.expireDate && (
                                          <div className="invalid-feedback">
                                            {
                                              errors.drugsTally[index]
                                                .expireDate
                                            }
                                          </div>
                                        )}
                                    </td>
                                    <td>
                                      <Input
                                        type="number"
                                        name={`drugsTally[${index}].mrp`}
                                        value={drug.mrp}
                                        onChange={handleChange}
                                        onKeyPress={(e) =>
                                          handleKeyPress(e, index)
                                        }
                                        className={`form-control ${
                                          touched.drugsTally?.[index]?.mrp &&
                                          errors.drugsTally?.[index]?.mrp
                                            ? "is-invalid"
                                            : ""
                                        }`}
                                        style={{
                                          borderRadius: "8px",
                                          width: "100px",
                                        }}
                                      />
                                      {touched.drugsTally?.[index]?.mrp &&
                                        errors.drugsTally?.[index]?.mrp && (
                                          <div className="invalid-feedback">
                                            {errors.drugsTally[index].mrp}
                                          </div>
                                        )}
                                    </td>
                                    <td>
                                      <Input
                                        type="number"
                                        name={`drugsTally[${index}].rate`}
                                        value={drug.rate}
                                        onChange={(e) => {
                                          handleChange(e);
                                          setFieldValue(
                                            `drugsTally[${index}].amount`,
                                            (
                                              (e.target.value || 0) *
                                              (drug.quantity || 0)
                                            ).toFixed(2)
                                          );
                                        }}
                                        onKeyPress={(e) =>
                                          handleKeyPress(e, index)
                                        }
                                        className={`form-control ${
                                          touched.drugsTally?.[index]?.rate &&
                                          errors.drugsTally?.[index]?.rate
                                            ? "is-invalid"
                                            : ""
                                        }`}
                                        style={{
                                          borderRadius: "8px",
                                          width: "100px",
                                        }}
                                      />
                                      {touched.drugsTally?.[index]?.rate &&
                                        errors.drugsTally?.[index]?.rate && (
                                          <div className="invalid-feedback">
                                            {errors.drugsTally[index].rate}
                                          </div>
                                        )}
                                    </td>
                                    <td>
                                      <span
                                        style={{
                                          width: "100px",
                                          display: "inline-block",
                                        }}
                                      >
                                        {amount.toFixed(2)}
                                      </span>
                                    </td>
                                    <td>
                                      <Input
                                        type="number"
                                        name={`drugsTally[${index}].discount`}
                                        value={drug.discount}
                                        onChange={handleChange}
                                        onKeyPress={(e) =>
                                          handleKeyPress(e, index)
                                        }
                                        className={`form-control ${
                                          touched.drugsTally?.[index]
                                            ?.discount &&
                                          errors.drugsTally?.[index]?.discount
                                            ? "is-invalid"
                                            : ""
                                        }`}
                                        style={{
                                          borderRadius: "8px",
                                          width: "100px",
                                        }}
                                      />
                                      {touched.drugsTally?.[index]?.discount &&
                                        errors.drugsTally?.[index]
                                          ?.discount && (
                                          <div className="invalid-feedback">
                                            {errors.drugsTally[index].discount}
                                          </div>
                                        )}
                                    </td>
                                    <td>
                                      <Input
                                        type="number"
                                        name={`drugsTally[${index}].gst`}
                                        value={drug.gst}
                                        onChange={handleChange}
                                        onKeyPress={(e) =>
                                          handleKeyPress(e, index)
                                        }
                                        className={`form-control ${
                                          touched.drugsTally?.[index]?.gst &&
                                          errors.drugsTally?.[index]?.gst
                                            ? "is-invalid"
                                            : ""
                                        }`}
                                        style={{
                                          borderRadius: "8px",
                                          width: "100px",
                                        }}
                                      />
                                      {touched.drugsTally?.[index]?.gst &&
                                        errors.drugsTally?.[index]?.gst && (
                                          <div className="invalid-feedback">
                                            {errors.drugsTally[index].gst}
                                          </div>
                                        )}
                                    </td>
                                    <td>
                                      <span
                                        style={{
                                          width: "100px",
                                          display: "inline-block",
                                        }}
                                      >
                                        {purchaseAmount.toFixed(2)}
                                      </span>
                                    </td>
                                    <td>
                                      <Button
                                        color="danger"
                                        size="sm"
                                        onClick={() => removeDrugEntry(index)}
                                        disabled={
                                          values.drugsTally.length === 1
                                        }
                                      >
                                        <i className="bx bx-trash"></i>
                                      </Button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </Table>
                          {touched.drugsTally && errors.drugsTally && (
                            <div className="text-danger">
                              {typeof errors.drugsTally === "string"
                                ? errors.drugsTally
                                : "Please ensure all drug details are valid."}
                            </div>
                          )}
                        </FormGroup>
                      </Col>

                      <Col md="12">
                        <FormGroup>
                          <Row className="g-3">
                            <Col md="4">
                              <Label
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Sub Total Rate
                              </Label>
                              <Input
                                type="text"
                                value={subTotalRate}
                                disabled
                                className="form-control"
                                style={{
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  padding: "10px",
                                }}
                              />
                            </Col>
                            <Col md="4">
                              <Label
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Sub Total GST
                              </Label>
                              <Input
                                type="text"
                                value={subTotalGST}
                                disabled
                                className="form-control"
                                style={{
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  padding: "10px",
                                }}
                              />
                            </Col>
                            <Col md="4">
                              <Label
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Sub Total Purchase Amount
                              </Label>
                              <Input
                                type="text"
                                value={totalPurchaseAmount}
                                disabled
                                className="form-control"
                                style={{
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  padding: "10px",
                                }}
                              />
                            </Col>
                            <Col md="4">
                              <Label
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Total GST
                              </Label>
                              <Input
                                type="text"
                                value={totalGST}
                                disabled
                                className="form-control"
                                style={{
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  padding: "10px",
                                }}
                              />
                            </Col>
                            <Col md="4">
                              <Label
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Total Purchase Amount
                              </Label>
                              <Input
                                type="text"
                                value={totalPurchaseAmount}
                                disabled
                                className="form-control"
                                style={{
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  padding: "10px",
                                }}
                              />
                            </Col>
                            <Col md="4">
                              <Label
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Total Discount
                              </Label>
                              <Input
                                type="text"
                                value={totalDiscount}
                                disabled
                                className="form-control"
                                style={{
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  padding: "10px",
                                }}
                              />
                            </Col>
                            <Col md="4">
                              <Label
                                for="adjustmentType"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Adjustment Type
                              </Label>
                              <Input
                                type="select"
                                name="adjustmentType"
                                id="adjustmentType"
                                value={values.adjustmentType}
                                onChange={(e) => {
                                  handleChange(e);
                                  if (e.target.value !== "return") {
                                    setFieldValue("billNumber", "");
                                  }
                                  if (
                                    !adjustmentTypes.includes(e.target.value)
                                  ) {
                                    setFieldValue("adjustmentAmount", "");
                                  }
                                }}
                                className={`form-control ${
                                  touched.adjustmentType &&
                                  errors.adjustmentType
                                    ? "is-invalid"
                                    : ""
                                }`}
                                style={{
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  padding: "10px",
                                }}
                              >
                                <option value="">Select Adjustment Type</option>
                                {adjustmentTypes.map((type, index) => (
                                  <option key={index} value={type}>
                                    {adjustmentTypeLabels[type]}
                                  </option>
                                ))}
                              </Input>
                              {touched.adjustmentType &&
                                errors.adjustmentType && (
                                  <div className="invalid-feedback">
                                    {errors.adjustmentType}
                                  </div>
                                )}
                            </Col>
                            {[
                              "bonus",
                              "return",
                              "advertisementcost",
                              "other",
                            ].includes(values.adjustmentType) && (
                              <Col md="4">
                                <Label
                                  for="adjustmentAmount"
                                  className="fw-bold text-dark"
                                  style={{ fontSize: "14px" }}
                                >
                                  Adjustment Amount *
                                </Label>
                                <Input
                                  type="number"
                                  name="adjustmentAmount"
                                  id="adjustmentAmount"
                                  placeholder="Enter Adjustment Amount"
                                  value={values.adjustmentAmount}
                                  onChange={handleChange}
                                  className={`form-control ${
                                    touched.adjustmentAmount &&
                                    errors.adjustmentAmount
                                      ? "is-invalid"
                                      : ""
                                  }`}
                                  style={{
                                    borderRadius: "8px",
                                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                    padding: "10px",
                                  }}
                                />
                                {touched.adjustmentAmount &&
                                  errors.adjustmentAmount && (
                                    <div className="invalid-feedback">
                                      {errors.adjustmentAmount}
                                    </div>
                                  )}
                              </Col>
                            )}
                            {values.adjustmentType === "return" && (
                              <Col md="4">
                                <Label
                                  for="billNumber"
                                  className="fw-bold text-dark"
                                  style={{ fontSize: "14px" }}
                                >
                                  Bill Number *
                                </Label>
                                <Select
                                  name="billNumber"
                                  options={bills}
                                  value={
                                    values.billNumber
                                      ? bills.find(
                                          (bill) =>
                                            bill.value === values.billNumber
                                        )
                                      : null
                                  }
                                  onChange={(selectedOption) =>
                                    setFieldValue(
                                      "billNumber",
                                      selectedOption ? selectedOption.value : ""
                                    )
                                  }
                                  placeholder="Select Bill Number..."
                                  isSearchable={true}
                                  isClearable
                                  styles={customSelectStyles}
                                  menuPortalTarget={document.body}
                                  menuPosition="fixed"
                                />
                                {touched.billNumber && errors.billNumber && (
                                  <div
                                    className="invalid-feedback"
                                    style={{ display: "block" }}
                                  >
                                    {errors.billNumber}
                                  </div>
                                )}
                              </Col>
                            )}
                            <Col md="4">
                              <Label
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Total Payable
                              </Label>
                              <Input
                                type="text"
                                value={totalPayable}
                                disabled
                                className="form-control"
                                style={{
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  padding: "10px",
                                }}
                              />
                            </Col>
                          </Row>
                        </FormGroup>
                      </Col>

                      <Col md="12" className="text-end">
                        <Button
                          color="primary"
                          type="submit"
                          className="px-5"
                          style={{
                            borderRadius: "8px",
                            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                          }}
                        >
                          {isEditMode ? "Update" : "Submit"}
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

      <CreateDrugModal
        open={isCreateDrugModalOpen}
        onClose={() => setIsCreateDrugModalOpen(false)}
        onSubmit={handleCreateDrug}
      />

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

export default PurchesWithoutPoForm;
