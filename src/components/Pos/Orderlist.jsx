import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  KeyboardEvent,
} from "react";
import {
  PersonAdd,
  QrCodeScanner,
  Delete,
  Add,
  Remove,
  Edit,
  PaidOutlined,
  CreditCard,
  AccountBalanceWallet,
  CallSplit,
  PauseCircle,
  RestartAlt,
  Receipt,
  ShoppingCart,
  Close,
  CheckCircle,
  CurrencyExchange,
  Refresh,
  Handshake,
} from "@mui/icons-material";
import { Modal, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import CouponModal from "./CouponModal";
import CardPaymentForm from "./CardPaymentForm";
import SplitPaymentModal from "./SplitPaymentModal";
import HoldOrderModal from "./HoldOrderModal";
import MobileModelPopup from "./MobileModelPopup";
import { createRoot } from "react-dom/client";
import { updateCartItems, clearCart } from "../../store/cart/cartSlice";
import { getNextOrderId, placeOrder } from "../../ApiService/Pos/Pos";
import { getCustomerTypes } from "../../ApiService/Associate/CustomerTypeMaster";

import jsPDF from "jspdf";
import {
  deleteOrder,
  getCustomerDetails,
  holdOrder,
  retrieveOrder,
} from "../../ApiService/Pos/OrderList";
import Swal from "sweetalert2";
import HoldRetriveModel from "./HoldRetriveModel";
import CustomerDetailsForm from "./CustomerDetailsForm";
// import { Handler } from "leaflet";

export default function Orderlist({
  setFetchProduct,
  fetchProducts,
  todayData,
}) {
  // State declarations
  const [customerOpen, setCustomerOpen] = useState(false);
  const [dayClose, setDayClose] = useState(false);
  const [selectedSalesman, setSelectedSalesman] = useState("");
  const [orderId, setOrderId] = useState(null);
  const [isRoundOff, setIsRoundOff] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingField, setEditingField] = useState({ label: "", value: 0 });
  const [paymentDetails, setPaymentDetails] = useState({
    shipping: 0.0,
    tax: 0.0,
    coupon: -0.0,
    // discount: -0.00,
    medicalDiscount: -0.0,
    nonMedicalDiscount: -0.0,
  });
  const [customerDetails, setCustomerDetails] = useState({
    customer_id: null,
    contact_number: "",
    customer_name: "",
    email: "",
    gstin: "",
    customerType: "Gold", // Set default to "Gold"
    abha_number: "",
    doctor_name: "",
    customer_category: "B2C",
  });
  const [prescription, setPrescription] = useState(null);
  const [barcode, setBarcode] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [receivedAmount, setReceivedAmount] = useState("");
  const [cardDetails, setCardDetails] = useState({ lastDigits: "" });
  const [isCardNumberSubmitted, setIsCardNumberSubmitted] = useState(false);
  const [splitPayments, setSplitPayments] = useState([
    { method: "Cash", amount: "" },
  ]);
  const [splitModalOpen, setSplitModalOpen] = useState(false);
  const [orderCompletedModal, setOrderCompletedModal] = useState(false);
  const [holdModalOpen, setHoldModalOpen] = useState(false);
  const [orderReference, setOrderReference] = useState("");
  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [selectedCreditNote, setSelectedCreditNote] = useState({
    cnNumber: "",
    amount: 0,
  });
  const [gstError, setGstError] = useState("");
  const [mobilePopupOpen, setMobilePopupOpen] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [barcodeProduct, setBarcodeProduct] = useState(null);
  const [taxDetails, setTaxDetails] = useState({
    details: [],
    grandTotalTax: 0,
  });
  const [customerTypes, setCustomerType] = useState([]);
  const [invoiceData, setInvoiceData] = useState({});
  const [openHoldRetriveModel, setOpenHoldRetriveModal] = useState(false);
  const [heldOrders, setHoldData] = useState([]);
  const [quickSearch, setQuickSearch] = useState("");
  const quickSearchRef = useRef(null);
  const [showAllDetails, setShowAllDetails] = useState(false);
  const [activePaymentMethod, setActivePaymentMethod] = useState(null);
  const mobileInputRef = useRef(null);
  const nameInputRef = useRef(null);
  const [creditModalOpen, setCreditModalOpen] = useState(false);
  // const heldOrders = [
  //   { id: 1, customerName: "John Doe", contactNumber: "1234567890", itemCount: 3, totalPrice: 450 },
  //   { id: 2, customerName: "Jane Smith", contactNumber: "9876543210", itemCount: 2, totalPrice: 300 },
  // ];

  const handleRetrieve = (order) => {
    try {
      // Update cartItems in Redux store
      const cartItemsFromOrder = order.product_details.map((item) => ({
        id: item.product_id,
        name: item.name,
        quantity: item.quantity,
        mrp: item.mrp,
        selling_price: item.selling_price,
        batch_no: item.batch_number,
        exp_date: item.expiry_date,
        discount: item.discount || 0,
        mfg: item.mfg,
        cgst: item.cgst || 0,
        sgst: item.sgst || 0,
        igst: item.igst || 0,
        type: item.type,
        stock_id: item.stock_id,
        sale_type: item.sale_type,
        total_price: item.totalMrp,
        hsn: item.hsn,
        conversion_id: item.conversion_id,
      }));
      dispatch(updateCartItems(cartItemsFromOrder));

      // Update customerDetails
      setCustomerDetails({
        customer_id: order.customer_id || null,
        contact_number: order.contact_number || "",
        customer_name: order.customer_name || "",
        email: order.email || "",
        gstin: order.gstin || "",
        customerType: order.customer_type || "",
        abha_number: order.abha_id || "",
        doctor_name: order.doctor_name || "",
        customer_category: order.customer_category || "B2C",
      });

      // Update paymentDetails
      setPaymentDetails({
        shipping: order.charges?.shipping || 0.0,
        tax: order.charges?.tax || 0.0,
        coupon: order.discounts?.coupon || -0.0,
        medicalDiscount: -(order.discounts?.medical || 0.0),
        nonMedicalDiscount: -(order.discounts?.non_medical || 0.0),
      });

      // Update orderId and orderReference
      getNextOrder();
      fetchAndSetCustomerDetails(order.contact_number);
      setOrderReference(order.order_reference_no || "");

      // Close the modal
      setOpenHoldRetriveModal(false);
      handleDelete(order?.hold_id);
      // Notify user
      toast.success("Order retrieved successfully");
    } catch (error) {
      console.error("Error retrieving order:", error);
      toast.error("Failed to retrieve order");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteOrder(id);
      if (response.status === 204) {
        toast.success("Order deleted successfully");
        fetchHoldData();
        setOpenHoldRetriveModal(false);
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order");
    }
  };
  // Get Hold Data
  const fetchHoldData = async () => {
    try {
      const response = await retrieveOrder();
      if (response.status === 200) {
        setHoldData(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Redux state
  const cartItems = useSelector((state) => state.cart?.cartItems || []);
  const dispatch = useDispatch();
  const barcodeInputRef = useRef(null);
  const timeoutRef = useRef(null);
  // console.log(cartItems);

  // Filter items by type
  // const medicalItems = cartItems.filter((item) => item.type === "medical");
  // const nonMedicalItems = cartItems.filter((item) => item.type !== "medical");
  // Memoized filtered items
  const medicalItems = useMemo(() => {
    return cartItems.filter((item) => item.type === "medical");
  }, [cartItems]);

  const nonMedicalItems = useMemo(() => {
    return cartItems.filter((item) => item.type !== "medical");
  }, [cartItems]);
  // number to word
  const numberToWords = (num) => {
    if (!num || isNaN(num)) return "Zero Only";

    const units = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];
    const scales = ["", "Thousand", "Million", "Billion"];

    const convertLessThanThousand = (n) => {
      if (n === 0) return "";
      if (n < 20) return units[n];
      if (n < 100) {
        return tens[Math.floor(n / 10)] + (n % 10 ? " " + units[n % 10] : "");
      }
      return (
        units[Math.floor(n / 100)] +
        " Hundred" +
        (n % 100 ? " " + convertLessThanThousand(n % 100) : "")
      );
    };

    // Split number into integer and decimal parts
    const [integerPart, decimalPart] = parseFloat(num).toFixed(2).split(".");
    let integerNum = parseInt(integerPart, 10);
    const decimalNum = parseInt(decimalPart, 10);

    // Convert integer part
    if (integerNum === 0) {
      return "Zero Only";
    }

    let words = [];
    let scaleIndex = 0;

    while (integerNum > 0) {
      const chunk = integerNum % 1000;
      if (chunk) {
        const chunkWords = convertLessThanThousand(chunk);
        words.unshift(
          chunkWords + (scales[scaleIndex] ? " " + scales[scaleIndex] : "")
        );
      }
      integerNum = Math.floor(integerNum / 1000);
      scaleIndex++;
    }

    let result = words.join(" ").trim();

    // Handle decimal part (paise)
    if (decimalNum > 0) {
      const decimalWords = convertLessThanThousand(decimalNum);
      result += ` and ${decimalWords} Paise`;
    }

    return result + " Only";
  };

  useEffect(() => {
    getNextOrder();
    fetchCustomerType();

    fetchHoldData();
  }, []);
  useEffect(() => {
    //  handleCustomerMobileChange(e)
  }, [customerDetails.contact_number]);
  const fetchAndSetCustomerDetails = async (contactNumber) => {
    try {
      const response = await getCustomerDetails(contactNumber);
      if (response.status === 200 && response.data) {
        setCustomerDetails({
          customer_id: response.data.customer_id || null,
          contact_number: response.data.contact_number || contactNumber,
          customer_name: response.data.customer_name || "",
          email: response.data.email || "",
          gstin: response.data.gstin || "",
          customerType: response.data.customer_type || "",
          abha_number: response.data.abha_id || "",
          customer_category: response.data.customer_category || "B2C",
        });
      }
    } catch (error) {
      console.error("Error fetching customer:", error);
      toast.error("Failed to fetch customer details", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  // fetch customer details
  // const fetchCustomerDetails = async (mob) => {
  //   try {
  //     const response = await getCustomerDetails(mob);
  //     if (response) {
  //       console.log(response);

  //       setCustomerDetails({
  //         ...customerDetails,
  //         contact_number: response?.contact_number,
  //         customer_name: response.customer_name || "",
  //         email: response.email || "",
  //         gstin: response.gstin || "",
  //         customerType: response.customer_type || "",
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error fetching customer details:", error);
  //   }
  // };

  // get customer type
  const fetchCustomerType = async () => {
    try {
      const response = await getCustomerTypes();
      setCustomerType(response || []);
    } catch (error) {
      console.error("Error fetching customer type:", error);
    }
  };
  // Calculation functions
  // const calculateMedicalTotal = () => {
  //   return medicalItems.reduce((sum, item) => sum + (item.total_price || 0), 0);
  // };

  // const calculateNonMedicalTotal = () => {
  //   return nonMedicalItems.reduce(
  //     (sum, item) => sum + (item.total_price || 0),
  //     0
  //   );
  // };
  const calculateMedicalTotal = () => {
    return medicalItems.reduce((sum, item) => {
      const discount = item.discount || 0; // Get discount from item (default to 0 if not set)
      const discountedPrice = (item.mrp || 0) * (1 - discount / 100); // Apply discount
      const itemTotal = discountedPrice * (item.quantity || 1); // Calculate total with discount
      return sum + itemTotal;
    }, 0);
  };

  const calculateNonMedicalTotal = () => {
    return nonMedicalItems.reduce((sum, item) => {
      const discount = item.discount || 0; // Get discount from item (default to 0 if not set)
      const discountedPrice = (item.mrp || 0) * (1 - discount / 100); // Apply discount
      const itemTotal = discountedPrice * (item.quantity || 1); // Calculate total with discount
      return sum + itemTotal;
    }, 0);
  };

  // const calculateMedicalDiscount = () => {
  //   return medicalItems.reduce((sum, item) => {
  //     const discountAmount = (item.mrp || 0) * (item.quantity || 1) * (item.discount || 0) / 100;
  //     return sum + discountAmount;
  //   }, 0);
  // };
  const calculateMedicalDiscount = () => {
    if (!Array.isArray(medicalItems)) return 0;
    return medicalItems.reduce((sum, item) => {
      const discountAmount =
        ((item.mrp || 0) * (item.quantity || 1) * (item.discount || 0)) / 100;
      return sum + discountAmount;
    }, 0);
  };

  // const calculateNonMedicalDiscount = () => {
  //   return nonMedicalItems.reduce((sum, item) => {
  //     const discountAmount = (item.mrp || 0) * (item.quantity || 1) * (item.discount || 0) / 100;
  //     return sum + discountAmount;
  //   }, 0);
  // };
  const calculateNonMedicalDiscount = () => {
    if (!Array.isArray(nonMedicalItems)) return 0;
    return nonMedicalItems.reduce((sum, item) => {
      const discountAmount =
        ((item.mrp || 0) * (item.quantity || 1) * (item.discount || 0)) / 100;
      return sum + discountAmount;
    }, 0);
  };

  // Update paymentDetails when discounts change
  // useEffect(() => {
  //   const medicalDiscount = calculateMedicalDiscount();
  //   const nonMedicalDiscount = calculateNonMedicalDiscount();

  //   setPaymentDetails((prev) => {
  //     const newDetails = {
  //       ...prev,
  //       medicalDiscount: medicalDiscount.toFixed(2),
  //       nonMedicalDiscount: nonMedicalDiscount.toFixed(2),
  //     };
  //     return newDetails;
  //   });
  // }, [medicalItems, nonMedicalItems]);
  useEffect(() => {
    const medicalDiscount = calculateMedicalDiscount();
    const nonMedicalDiscount = calculateNonMedicalDiscount();

    setPaymentDetails((prev) => {
      if (
        prev.medicalDiscount === medicalDiscount.toFixed(2) &&
        prev.nonMedicalDiscount === nonMedicalDiscount.toFixed(2)
      ) {
        return prev;
      }
      return {
        ...prev,
        medicalDiscount: medicalDiscount.toFixed(2),
        nonMedicalDiscount: nonMedicalDiscount.toFixed(2),
      };
    });
  }, [medicalItems, nonMedicalItems]);

  // Debug logging (optional, remove in production)
  useEffect(() => {
    // console.log("Cart Items:", cartItems);
  }, [cartItems]);

  const calculateSubTotal = () => {
    // return cartItems.reduce((total, item) => {
    //   const price = parseFloat(item?.mrp || 0);
    //   const quantity = parseInt(item?.quantity || 0);
    //   return total + price * quantity;
    // }, 0);
    return calculateMedicalTotal() + calculateNonMedicalTotal();
  };

  const calculateTotalSavings = () => {
    const totalDiscount =
      Math.abs(paymentDetails.medicalDiscount) +
      Math.abs(paymentDetails.nonMedicalDiscount) +
      Math.abs(paymentDetails.coupon);
    return totalDiscount.toFixed(2);
  };

  const calculateTaxDetails = useCallback(() => {
    const taxGroups = {};

    cartItems.forEach((item) => {
      const price = parseFloat(item?.mrp || 0);
      const quantity = parseInt(item?.quantity || 0);
      const cgst = parseFloat(item?.cgst || 0);
      const sgst = parseFloat(item?.sgst || 0);

      if (cgst > 0 || sgst > 0) {
        const subtotal = price * quantity;
        const taxKey = `${cgst}-${sgst}`;
        const taxRate = (cgst + sgst) / 100;
        const taxableAmount = subtotal / (1 + taxRate);

        if (!taxGroups[taxKey]) {
          taxGroups[taxKey] = {
            taxableAmount: 0,
            cgstPercent: cgst,
            sgstPercent: sgst,
            cgstAmount: 0,
            sgstAmount: 0,
            TotalTax: 0,
          };
        }

        taxGroups[taxKey].taxableAmount += taxableAmount;
        taxGroups[taxKey].cgstAmount += (taxableAmount * cgst) / 100;
        taxGroups[taxKey].sgstAmount += (taxableAmount * sgst) / 100;
      }
    });

    const taxDetailsArray = Object.values(taxGroups).map((group) => {
      group.TotalTax = group.cgstAmount + group.sgstAmount;
      return {
        taxableAmount: Number(group.taxableAmount.toFixed(2)),
        cgst: group.cgstPercent,
        sgst: group.sgstPercent,
        cgstAmount: Number(group.cgstAmount.toFixed(2)),
        sgstAmount: Number(group.sgstAmount.toFixed(2)),
        TotalTaxAmount: Number(group.TotalTax.toFixed(2)),
      };
    });

    const grandTotalTax = Number(
      taxDetailsArray.reduce(
        (sum, group) => sum + (group.TotalTaxAmount || 0),
        0
      )
    );

    setTaxDetails((prevTaxDetails) => {
      const newTaxDetails = { details: taxDetailsArray, grandTotalTax };
      return JSON.stringify(prevTaxDetails) !== JSON.stringify(newTaxDetails)
        ? newTaxDetails
        : prevTaxDetails;
    });
  }, [cartItems]);

  const calculateTotal = () => {
    const subTotal = calculateSubTotal() || 0;
    // const extraCharges = Object.values(paymentDetails).reduce((sum, value) => {
    //   return sum + (parseFloat(value) || 0);
    // }, 0);
    return subTotal;
  };

  const calculateRoundOff = () => {
    if (!isRoundOff) return 0;
    const total = calculateTotal();
    if (isNaN(total)) return "0.00";
    const rounded = Math.round(total);
    return (rounded - total).toFixed(2);
  };

  const getTotalWithRoundOff = () => {
    const total = calculateTotal();
    if (isNaN(total)) return "0.00";
    const roundOffAmount = parseFloat(calculateRoundOff()) || 0;
    return (total + roundOffAmount).toFixed(2);
  };

  const calculateReturnAmount = () => {
    const received = parseFloat(receivedAmount) || 0;
    const total = parseFloat(getTotalWithRoundOff()) || 0;
    return (received - total).toFixed(2);
  };

  // Handlers
  // const handleIncrease = (productId,discount) => {
  //   const updatedItems = cartItems.map((item) => {
  //     if (item.id === productId) {
  //       const newQty = (item.quantity || 0) + 1;
  //       return {
  //         ...item,
  //         quantity: newQty,
  //         total_price: (item.mrp || 0) * newQty,
  //       };
  //     }
  //     return item;
  //   });
  //   dispatch(updateCartItems(updatedItems));
  // };

  // const handleDecrease = (productId,discount) => {
  //   const updatedItems = cartItems.map((item) => {
  //     if (item.id === productId && item.quantity > 1) {
  //       const newQty = item.quantity - 1;
  //       return {
  //         ...item,
  //         quantity: newQty,
  //         total_price: (item.mrp || 0) * newQty,
  //       };
  //     }
  //     return item;
  //   });
  //   dispatch(updateCartItems(updatedItems));
  // };
  const handleIncrease = (productId, discount = 0) => {
    const updatedItems = cartItems.map((item) => {
      if (item.id === productId) {
        const newQty = (item.quantity || 0) + 1;
        const discountedPrice = (item.mrp || 0) * (1 - discount / 100); // Apply discount
        return {
          ...item,
          quantity: newQty,
          total_price: discountedPrice * newQty, // Calculate total with discount
          discount: discount, // Store discount percentage
        };
      }
      return item;
    });
    dispatch(updateCartItems(updatedItems));
  };

  const handleDecrease = (productId, discount = 0) => {
    const updatedItems = cartItems.map((item) => {
      if (item.id === productId && item.quantity > 1) {
        const newQty = item.quantity - 1;
        const discountedPrice = (item.mrp || 0) * (1 - discount / 100); // Apply discount
        return {
          ...item,
          quantity: newQty,
          total_price: discountedPrice * newQty, // Calculate total with discount
          discount: discount, // Store discount percentage
        };
      }
      return item;
    });
    dispatch(updateCartItems(updatedItems));
  };

  const handleRemove = (productId) => {
    const updatedItems = cartItems.filter((item) => item.id !== productId);
    dispatch(updateCartItems(updatedItems));
  };

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);

    setCustomerDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCustomerMobileChange = async (e) => {
    const { value } = e.target;
    setCustomerDetails((prev) => ({
      ...prev,
      contact_number: value,
    }));
    if (value.length === 10) {
      try {
        const response = await getCustomerDetails(value);
        if (response.status === 200 && response.data) {
          // setCustomerDetails(response.data);
          setCustomerDetails({
            customer_id: response.data.customer_id || null,
            contact_number: response.data.contact_number || value,
            customer_name: response.data.customer_name || "",
            email: response.data.email || "",
            gstin: response.data.gstin || "",
            customerType: response.data.customer_type || "", // Map customer_type_name to customerType
            abha_number: response.data.abha_id || "",
            customer_category: response.data.customer_category || "B2C",
          });
        }
      } catch (error) {
        console.error("Error fetching customer:", error);
        toast.error("Failed to fetch customer details", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      }
    } else {
      setCustomerDetails((prev) => ({
        ...prev,
        contact_number: value,
        customer_name: "",
        email: "",
        gstin: "",
        customerType: "Gold",
        abha_number: "",
        customer_category: "B2C",
      }));
    }
  };

  // const handleEditClick = (label, value) => {
  //   if (label === "Coupon") {
  //     setCouponModalOpen(true);
  //   } else {
  //     setEditingField({ label: label.toLowerCase(), value });
  //     setEditModalOpen(true);
  //   }
  // };
  const handleEditClick = (label, value) => {
    if (label === "Coupon") {
      setCouponModalOpen(true);
    } else {
      // Validate percentage to avoid NaN
      const calculatedValue =
        isNaN(value) || calculateMedicalTotal() === 0 ? 0 : value;
      setEditingField({ label, value: calculatedValue });
      setEditModalOpen(true);
    }
  };

  //   const handleEditSubmit = (e) => {
  //     e.preventDefault();
  //     const field = editingField.label;
  //     let newValue = parseFloat(editingField.value) || 0;

  //     if (field.includes("discount")) {
  //       // Handle percentage discounts
  //       const total =
  //         field === "medical discount"
  //           ? calculateMedicalTotal()
  //           : field === "non medical discount"
  //           ? calculateNonMedicalTotal()
  //           : calculateSubTotal();

  //       newValue = -(total * (newValue / 100));
  //     }
  //  console.log(newValue);

  //     // Map field names to paymentDetails keys
  //     const fieldMap = {
  //       "Medical Discount": "medicalDiscount",
  //       "Non Medical Discount": "nonMedicalDiscount",
  //       // Add other fields if needed (e.g., "Shipping": "shipping")
  //     };

  //     const fieldKey = fieldMap[field] || field.replace(" ", "").toLowerCase();

  //     setPaymentDetails((prev) => {
  //       const updated = {
  //         ...prev,
  //         [fieldKey]: newValue,
  //       };
  //       console.log('Updated paymentDetails:', updated); // Debug state
  //       return updated;
  //     });

  //     setEditModalOpen(false);
  //   };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const field = editingField.label.toLowerCase();
    let newValue = parseFloat(editingField.value) || 0;

    if (field.includes("discount")) {
      const total = field.includes("medical")
        ? calculateMedicalTotal()
        : calculateNonMedicalTotal();
      newValue = total * (newValue / 100); // Positive discount amount
    }

    const fieldMap = {
      "medical discount": "medicalDiscount",
      "non medical discount": "nonMedicalDiscount",
    };

    const fieldKey = fieldMap[field] || field.replace(" ", "").toLowerCase();

    setPaymentDetails((prev) => ({
      ...prev,
      [fieldKey]: newValue.toFixed(2),
    }));

    setEditModalOpen(false);
  };

  const handleClearCoupon = () => {
    setPaymentDetails((prev) => ({
      ...prev,
      coupon: -0.0,
    }));
    setSelectedCreditNote({
      cnNumber: "",
      amount: 0,
    });
  };

  const handlePaymentSelect = (methodId) => {
    if (todayData?.status === true) {
      Swal.fire({
        title: "Day Close Status",
        text: "You have already day close",
        icon: "warning",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }
    setSelectedPayment(methodId);
    if (methodId === "Cash" || methodId === "Card") {
      setPaymentModalOpen(true);
      setReceivedAmount("");
    } else if (methodId === "Partial") {
      setSplitModalOpen(true);
      setSplitPayments([{ method: "Cash", amount: "" }]);
    } else if (methodId === "Credit") {
      setCreditModalOpen(true); // Open Pay Later modal
    }
  };

  const handleConfirmCredit = () => {
    if (!customerDetails.contact_number && !customerDetails.customer_name) {
      Swal.fire({
        title: "Customer Details Required",
        text: "Please provide either a mobile number or customer name",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#007bff",
      });
      return;
    }
    setCreditModalOpen(false);
    handlePlaceOrder();
  };

  const handleClosePaymentModal = () => {
    setPaymentModalOpen(false);
    setCardDetails({ lastDigits: "" });
    setIsCardNumberSubmitted(false);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setPaymentModalOpen(false);
    handlePlaceOrder();
    // toast.success("Payment processed successfully");
  };

  const handleCardNumberChange = (e) => {
    if (isCardNumberSubmitted) return;
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 4) {
      setCardDetails((prev) => ({ ...prev, lastDigits: value }));
      if (value.length === 4) {
        setIsCardNumberSubmitted(true);
      }
    }
  };

  const handleResetCardNumber = () => {
    setCardDetails((prev) => ({ ...prev, lastDigits: "" }));
    setIsCardNumberSubmitted(false);
  };

  const handleSplitPaymentChange = (index, field, value) => {
    const newPayments = [...splitPayments];
    newPayments[index][field] = value;
    setSplitPayments(newPayments);
  };

  const addSplitPayment = () => {
    setSplitPayments([...splitPayments, { method: "Cash", amount: "" }]);
  };

  const removeSplitPayment = (index) => {
    const newPayments = splitPayments.filter((_, i) => i !== index);
    setSplitPayments(newPayments);
  };

  const calculateSplitRemaining = () => {
    const total = parseFloat(getTotalWithRoundOff()) || 0;
    const splitTotal = splitPayments.reduce((sum, payment) => {
      return sum + (parseFloat(payment.amount) || 0);
    }, 0);
    return (total - splitTotal).toFixed(2);
  };

  // const handleSplitPaymentSubmit = () => {
  //   setSelectedPayment("Partial");
  //   setSplitModalOpen(false);
  //   handlePlaceOrder();
  //   // toast.success("Split payment saved successfully");
  // };
  const handleSplitPaymentSubmit = () => {
    // Validate customer details
    if (!customerDetails.contact_number && !customerDetails.customer_name) {
      toast.error("Please provide either a mobile number or customer name.");
      return;
    }
    if (!customerDetails.customerType) {
      toast.error("Please select a valid customer type.");
      return;
    }

    // Validate split payments
    const isValid = splitPayments.every(
      (payment) =>
        payment.method &&
        payment.amount &&
        !isNaN(parseFloat(payment.amount)) &&
        parseFloat(payment.amount) > 0
    );

    const totalSplitAmount = splitPayments.reduce(
      (sum, payment) => sum + (parseFloat(payment.amount) || 0),
      0
    );
    const expectedTotal = parseFloat(getTotalWithRoundOff());

    if (!isValid) {
      toast.error("Please ensure all payment methods and amounts are valid.");
      return;
    }

    if (totalSplitAmount.toFixed(2) !== expectedTotal.toFixed(2)) {
      toast.error("The sum of split payments must equal the total amount.");
      return;
    }

    setSelectedPayment("Partial");
    setSplitModalOpen(false);
    handlePlaceOrder();
    toast.success("Split payment saved successfully");
  };

  const handlePlaceOrder = async () => {
    console.log(customerDetails.customerType);
    // alert("Please select a valid customer type");
    if (customerDetails.customerType === "") {
      Swal.fire({
        title: "Please select a valid customer type",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#007bff",
      });
      return;
    }

    try {
      const user = localStorage.getItem("userId");

      // Prepare order items data
      const orderItems = cartItems.map((item) => ({
        product_id: item.id,
        name: item?.name,
        quantity: item.quantity,
        mrp: item.mrp,
        selling_price: item.selling_price || item.mrp, // fallback to mrp if selling_price not available
        batch_number: item.batch_no || "",
        expiry_date: item.exp_date || "",
        discount: item.discount || 0,
        mfg: item?.mfg || "",
        cgst: item.cgst || 0,
        sgst: item.sgst || 0,
        igst: item.igst || 0,
        type: item.type || "non-medical",
        stock_id: item.stock_id,
        sale_type: item.sale_type,
        totalMrp: item?.total_price || 0,
        hsn: item?.hsn || 0,
        conversion_id: item.conversion_id,
      }));

      // Prepare payment data
      const paymentData = {
        payment_method: selectedPayment,
        amount: parseFloat(getTotalWithRoundOff()),
        ...(selectedPayment === "Card" && {
          card_last_digits: cardDetails.lastDigits,
        }),
        ...(selectedPayment === "Partial" && {
          partial_payment_data: splitPayments.map((payment) => ({
            method: payment.method,
            amount: parseFloat(payment.amount) || 0,
          })),
        }),
      };

      // Prepare the complete order payload
      const orderPayload = {
        emp_id: JSON.parse(user),
        order_id: orderId,
        customer_id: customerDetails.customer_id,
        contact_number: customerDetails.contact_number,
        customer_name: customerDetails.customer_name,
        email: customerDetails.email,
        gstin: customerDetails.gstin,
        customer_type: customerDetails.customerType,
        customer_category: customerDetails.customer_category,
        abha_id: customerDetails.abha_number,
        doctor_name: customerDetails.doctor_name,
        product_details: orderItems,
        payment: paymentData,
        payment_mode: selectedPayment,
        ...(selectedPayment === "Card" && {
          card_last_digits: cardDetails.lastDigits,
        }),
        ...(selectedPayment === "Partial" && {
          partial_payment_data: splitPayments.map((payment) => ({
            method: payment.method,
            amount: parseFloat(payment.amount) || 0,
          })),
        }),
        subtotal: calculateSubTotal().toFixed(2),
        total_bill_amount: parseFloat(getTotalWithRoundOff()),
        discounts: {
          medical: Math.abs(paymentDetails.medicalDiscount),
          non_medical: Math.abs(paymentDetails.nonMedicalDiscount),
          // coupon: Math.abs(paymentDetails.coupon),
          // credit_note: selectedCreditNote.amount > 0 ? {
          //   cn_number: selectedCreditNote.cnNumber,
          //   amount: selectedCreditNote.amount
          // } : null
        },
        discount:
          Math.abs(paymentDetails.medicalDiscount) +
            Math.abs(paymentDetails.nonMedicalDiscount) || 0,
        charges: {
          shipping: paymentDetails.shipping,
          tax: paymentDetails.tax,
        },
        total_tax: taxDetails?.grandTotalTax.toFixed(2),
        tax_details: taxDetails.details,
        round_off: isRoundOff ? parseFloat(calculateRoundOff()) : 0,
        salesman_id: selectedSalesman || null,
        reference: orderReference || null,
      };
      const formData = new FormData();
      formData.append("data", JSON.stringify(orderPayload));
      // console.log(prescription);

      if (prescription) {
        formData.append("prescription_upload", prescription);
      }
      // Call the API to place the order
      const response = await placeOrder(formData);

      if (response) {
        setInvoiceData(response);
        setOrderCompletedModal(true);
        fetchProducts();
        getNextOrder();
        setPrescription(null);
        toast.success("Order placed successfully");
        // Reset any necessary state here if needed
      } else {
        throw new Error(response.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Order placement error:", error);
      toast.error(error.response.data?.error || "Failed to place order");
    }
  };
  const handleNextOrder = () => {
    setOrderCompletedModal(false);
    dispatch(clearCart());
    setCustomerDetails({
      contact_number: "",
      customer_name: "",
      email: "",
      gstin: "",
      customerType: "Gold",
      abha_number: "",
      doctor_name: "",
      customer_category: "B2C",
    });
    setPaymentDetails({
      shipping: 0.0,
      tax: 0.0,
      coupon: -0.0,
      // discount: -0.00,
      medicalDiscount: -0.0,
      nonMedicalDiscount: -0.0,
    });
    setDiscountPercent(0);
    setShowAllDetails(false);
    window.location.reload();
  };

  const handlePrintReceipt = () => {
    // Add your print receipt logic here

    generatePDF(invoiceData);
    toast.success("Receipt printed successfully");
    handleNextOrder();
  };
  const generatePDF = (invoiceData) => {
    console.log("generatePDF", invoiceData);
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const HALF_PAGE_HEIGHT = 148.5;
    let currentPage = 1;
    let startY = 5;

    //     const addPageDecorations = (pageNumber, startY) => {
    //       doc.setLineWidth(0.5);
    //       doc.setDrawColor(0, 0, 0);
    //       doc.roundedRect(5, startY, 200, HALF_PAGE_HEIGHT - 10, 3, 3, "S");
    //       doc.setLineWidth(0.3);
    //       doc.setDrawColor(100, 100, 100);
    //       doc.roundedRect(7, startY + 2, 196, HALF_PAGE_HEIGHT - 14, 2, 2, "S");

    //       doc.setFont("helvetica", "normal");
    //       doc.setFontSize(8);
    //       doc.text(`Page No.: ${pageNumber}`, 185, startY + 5);
    //     };

    //     const addHeaderDetails = (startY) => {
    //       doc.setTextColor(0, 0, 0);
    //       doc.setFont("helvetica", "bold");
    //       doc.setFontSize(10);
    //       doc.text(`${invoiceData?.business_details?.business_name}`, 10, startY + 5);
    //       doc.setFont("helvetica", "normal");
    //       doc.setFontSize(7);
    //       doc.text(
    //         `${
    //           invoiceData?.business_details?.business_info?.contact_details
    //             ?.contact_details?.address1 +
    //           ", " +
    //           invoiceData?.business_details?.business_info?.contact_details?.contact_details
    //             ?.address2
    //         }`,
    //         10,
    //         startY + 9
    //       );
    //       // doc.text(
    //       //   `${
    //       //     invoiceData?.business_details?.business_info?.contact_details?.contact_details
    //       //       ?.landmark +
    //       //     ", " +
    //       //     invoiceData?.business_details?.business_info?.contact_details?.contact_details
    //       //       ?.city +
    //       //     ", " +
    //       //     invoiceData?.business_details?.business_info?.contact_details?.contact_details
    //       //       ?.state +
    //       //     ", " +
    //       //     invoiceData?.business_details?.business_info?.contact_details?.contact_details
    //       //       ?.pinCode +
    //       //     ", " +
    //       //     invoiceData?.business_details?.business_info?.contact_details?.contact_details
    //       //       ?.country
    //       //   }`,
    //       //   10,
    //       //   startY + 13
    //       // );
    //       const contact = invoiceData?.business_details?.business_info?.contact_details?.contact_details || {};

    // const fullAddress = [
    //   contact?.landmark || "-",
    //   contact?.city || "-",
    //   contact?.state || "-",
    //   contact?.pinCode || "-",
    //   contact?.country || "-"
    // ].join(", ");

    // doc.text(fullAddress, 10, startY + 13);

    //       doc.text(
    //         `Phone: ${invoiceData?.business_details?.contact_number}`,
    //         10,
    //         startY + 17
    //       );
    //       // doc.text(
    //       //   "D.L.No.: KH-BBS-V-26391(W), 26392(WC), 10524(VX)",
    //       //   10,
    //       //   startY + 21
    //       // );
    //       doc.text(
    //         `E-Mail: ${invoiceData?.business_details?.email}`,
    //         10,
    //         startY + 25
    //       );
    //       doc.text(
    //         `GSTIN: ${invoiceData?.business_details?.business_info?.gst_tax_number || "-"}`,
    //         10,
    //         startY + 29
    //       );

    //       doc.setFont("helvetica", "bold");
    //       doc.setFontSize(10);
    //       doc.text("CREDIT GST INVOICE", 125, startY + 5, { align: "center" });
    //       doc.setFont("helvetica", "normal");
    //       doc.setFontSize(7);
    //       doc.text(
    //         `${invoiceData?.invoice_data?.customer_id?.customer_name || "-"}`,
    //         110,
    //         startY + 9
    //       );
    //       doc.text("RASULGARH 21-ORISSA", 110, startY + 13);
    //       doc.text(
    //         `Ph.No.: ${
    //           invoiceData?.invoice_data?.customer_id?.contact_number || "-"
    //         }`,
    //         110,
    //         startY + 17
    //       );
    //       doc.text(
    //         `Email: ${invoiceData?.invoice_data?.customer_id?.email || "-"}`,
    //         110,
    //         startY + 21
    //       );
    //       doc.text(
    //         `GSTIN: ${invoiceData?.invoice_data?.customer_id?.gstin || "-"}`,
    //         110,
    //         startY + 25
    //       );
    //       // ABHA ID (New)
    // doc.text(
    //   `ABHA ID: ${invoiceData?.invoice_data?.customer_id?.abha_id || "-"}`,
    //   110,
    //   startY + 29
    // );

    // // Customer Type Name (New)
    // doc.text(
    //   `Customer Type: ${invoiceData?.invoice_data?.customer_id?.customer_type_name || "-"}`,
    //   110,
    //   startY + 33
    // );

    // // Customer Category (New)
    // doc.text(
    //   `Category: ${invoiceData?.invoice_data?.customer_id?.customer_category || "-"}`,
    //   110,
    //   startY + 37
    // );
    // doc.text(
    //   `Doctor: ${invoiceData?.invoice_data?.doctor_name || "-"}`,
    //   110,
    //   startY + 37
    // );
    //       // doc.text("Invoice No.: A008091", 110, startY + 29);
    //       doc.text(`Invoice No.: ${invoiceData?.order_id || "-"}`, 110, startY + 29);
    //       // doc.text("Date: 30-12-2024", 110, startY + 33);.doc.text(
    //      doc.text(
    //     `Date: ${new Date(invoiceData?.invoice_data?.created_at).toLocaleDateString("en-GB")}`,
    //     110,
    //     startY + 33
    //   );
    //       doc.text(
    //         `Due Date: ${new Date(invoiceData?.invoice_data?.created_at).toLocaleDateString("en-GB") || "-"}`,
    //         110,
    //         startY + 37
    //       );
    //     };

    //     addPageDecorations(currentPage, startY);
    //     addHeaderDetails(startY);
    const addPageDecorations = (pageNumber, startY) => {
      doc.setLineWidth(0.5);
      doc.setDrawColor(0, 0, 0);
      doc.roundedRect(5, startY, 200, HALF_PAGE_HEIGHT - 10, 3, 3, "S");
      doc.setLineWidth(0.3);
      doc.setDrawColor(100, 100, 100);
      doc.roundedRect(7, startY + 2, 196, HALF_PAGE_HEIGHT - 14, 2, 2, "S");

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.text(`Page No.: ${pageNumber}`, 185, startY + 5);
    };

    const addHeaderDetails = (startY) => {
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(
        `${invoiceData?.business_details?.business_name}`,
        10,
        startY + 5
      );
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      // doc.text(
      //   `${
      //     invoiceData?.business_details?.business_info?.contact_details
      //       ?.contact_details?.address1 +
      //     ", " +
      //     invoiceData?.business_details?.business_info?.contact_details?.contact_details
      //       ?.address2  || ""
      //   }`,
      //   10,
      //   startY + 9
      // );
      const address1 =
        invoiceData?.business_details?.business_info?.contact_details
          ?.contact_details?.address1 || "";
      const address2 =
        invoiceData?.business_details?.business_info?.contact_details
          ?.contact_details?.address2 || "";

      const fullAddres = address2 ? `${address1}, ${address2}` : address1;

      // Example position (change x and y as needed)
      doc.text(fullAddres, 10, startY + 9);

      const contact =
        invoiceData?.business_details?.business_info?.contact_details
          ?.contact_details || {};
      const fullAddress = [
        contact?.landmark || "",
        contact?.city || "",
        contact?.state || "",
        contact?.pinCode || "",
        contact?.country || "",
      ].join(" ");

      doc.text(fullAddress, 10, startY + 13);
      doc.text(
        `Phone: ${invoiceData?.business_details?.contact_number}`,
        10,
        startY + 17
      );
      doc.text(
        `DL.NO: ${
          invoiceData?.business_details?.business_info?.licence_no || "-"
        }`,
        10,
        startY + 25
      );
      doc.text(
        `E-Mail: ${invoiceData?.business_details?.email}`,
        10,
        startY + 29
      );
      doc.text(
        `GSTIN: ${
          invoiceData?.business_details?.business_info?.gst_tax_number || "-"
        }`,
        10,
        startY + 32
      );

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("INVOICE", 125, startY + 5, { align: "center" });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.text(
        `${invoiceData?.invoice_data?.customer_id?.customer_name || "-"}`,
        110,
        startY + 9
      );
      // doc.text("RASULGARH 21-ORISSA", 110, startY + 13);
      doc.text(
        `Ph.No.: ${
          invoiceData?.invoice_data?.customer_id?.contact_number || "-"
        }`,
        110,
        startY + 17
      );
      doc.text(
        `Email: ${invoiceData?.invoice_data?.customer_id?.email || "-"}`,
        110,
        startY + 21
      );
      doc.text(
        `GSTIN: ${invoiceData?.invoice_data?.customer_id?.gstin || "-"}`,
        110,
        startY + 25
      );
      // ABHA ID
      doc.text(
        `ABHA ID: ${invoiceData?.invoice_data?.customer_id?.abha_id || "-"}`,
        110,
        startY + 29
      );
      // New column for specified fields
      doc.text(
        `Customer Type: ${
          invoiceData?.invoice_data?.customer_id?.customer_type_name || "-"
        }`,
        160,
        startY + 9
      );
      doc.text(
        `Category: ${
          invoiceData?.invoice_data?.customer_id?.customer_category || "-"
        }`,
        160,
        startY + 13
      );
      doc.text(
        `Doctor: ${invoiceData?.invoice_data?.doctor_name || "-"}`,
        160,
        startY + 17
      );
      doc.text(
        `Invoice No.: ${invoiceData?.order_id || "-"}`,
        160,
        startY + 21
      );
      doc.text(
        `Date: ${new Date(
          invoiceData?.invoice_data?.created_at
        ).toLocaleDateString("en-GB")}`,
        160,
        startY + 25
      );
      doc.text(
        `Due Date: ${
          new Date(invoiceData?.invoice_data?.created_at).toLocaleDateString(
            "en-GB"
          ) || "-"
        }`,
        160,
        startY + 29
      );
    };

    addPageDecorations(currentPage, startY);
    addHeaderDetails(startY);

    // Helper function to format date (from yyyy-mm-dd to mm/yy or similar)
    const formatExpiry = (dateStr) => {
      const date = new Date(dateStr);
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = String(date.getFullYear()).slice(-2);
      return `${month}/${year}`;
    };
    const tableBody = invoiceData?.invoice_data?.product_details.map(
      (item, index) => {
        return [
          `${index + 1}`,
          item?.name || "Product Name", // Replace with actual name if available
          item?.mfg || "Mfg.", // Replace with actual manufacturer if available
          item.batch_number || "-", // Batch
          item.hsn || "-", // HSN
          item.expiry_date ? formatExpiry(item.expiry_date) : "-", // Expiry
          `${item.quantity}`, // Quantity
          item.mrp.toFixed(2), // MRP
          item.totalMrp.toFixed(2), // Total
        ];
      }
    );

    doc.autoTable({
      startY: startY + 45,
      head: [
        [
          "Sn.",
          "Product Name",
          "Mfg.",
          "Batch",
          "Hsn",
          "Exp",
          "Qty.",
          "MRP",
          "Total",
        ],
      ],
      body: tableBody,
      theme: "plain",
      headStyles: {
        fillColor: [180, 180, 180],
        textColor: 0,
        fontSize: 7,
        font: "helvetica",
        fontStyle: "bold",
        cellPadding: 0.3,
        halign: "center",
        lineHeight: 1,
      },
      styles: {
        cellPadding: 0.3,
        fontSize: 6.5,
        font: "helvetica",
        fontStyle: "normal",
        lineWidth: 0,
        overflow: "linebreak",
        halign: "center",
        lineHeight: 1,
      },
      columnStyles: {
        0: { cellWidth: 12 },
        1: { cellWidth: 45, overflow: "linebreak" },
        2: { cellWidth: 15 },
        3: { cellWidth: 25 },
        4: { cellWidth: 16 },
        5: { cellWidth: 18 },
        6: { cellWidth: 14 },
        7: { cellWidth: 20 },
        8: { cellWidth: 25 },
      },
      margin: { left: 10, right: 10 },
      pageBreak: "auto",
      drawCell: (data) => {
        const { cell, doc } = data;
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.1);
        doc.line(cell.x, cell.y, cell.x, cell.y + cell.height);
        doc.line(
          cell.x + cell.width,
          cell.y,
          cell.x + cell.width,
          cell.y + cell.height
        );
        if (data.section === "head") {
          doc.line(
            cell.x,
            cell.y + cell.height,
            cell.x + cell.width,
            cell.y + cell.height
          );
        }
      },
      didDrawPage: (data) => {
        if (data.cursor.y > HALF_PAGE_HEIGHT) {
          currentPage++;
          doc.addPage();
          startY = 5;
          addPageDecorations(currentPage, startY);
          addHeaderDetails(startY);
          doc.setTextColor(0, 0, 0);
          data.cursor.y = startY + 45;
        }
      },
    });

    let finalY = doc?.lastAutoTable?.finalY || startY + 45;
    const gstSummary = invoiceData?.invoice_data?.tax_details.map((tax) => {
      const gstPercent = (tax.cgst + tax.sgst).toFixed(2); // Total GST%
      const total = tax.taxableAmount.toFixed(2);
      const schedule = "0.00"; // assuming static or if you have it in data
      const discount = "0.00"; // update if discount per GST rate is tracked
      const sgst = tax.sgstAmount.toFixed(2);
      const cgst = tax.cgstAmount.toFixed(2);
      const totalGst = tax.TotalTaxAmount.toFixed(2);

      return [gstPercent, total, schedule, discount, sgst, cgst, totalGst];
    });

    // Add total row
    const totalTaxable = invoiceData?.invoice_data?.tax_details
      .reduce((sum, t) => sum + t.taxableAmount, 0)
      .toFixed(2);
    const totalSGST = invoiceData?.invoice_data?.tax_details
      .reduce((sum, t) => sum + t.sgstAmount, 0)
      .toFixed(2);
    const totalCGST = invoiceData?.invoice_data?.tax_details
      .reduce((sum, t) => sum + t.cgstAmount, 0)
      .toFixed(2);
    const totalGST = invoiceData?.invoice_data?.tax_details
      .reduce((sum, t) => sum + t.TotalTaxAmount, 0)
      .toFixed(2);

    gstSummary.push([
      "TOTAL",
      totalTaxable,
      "0.00",
      "0.00",
      totalSGST,
      totalCGST,
      totalGST,
    ]);

    const estimatedGstTableHeight = 5 * 5 + 10;
    if (finalY + estimatedGstTableHeight > HALF_PAGE_HEIGHT) {
      currentPage++;
      doc.addPage();
      startY = 5;
      addPageDecorations(currentPage, startY);
      addHeaderDetails(startY);
      doc.setTextColor(0, 0, 0);
      finalY = startY + 45;
    }

    doc.autoTable({
      startY: finalY + 5,
      head: [["GST %", "Total", "Sch.", "Disc.", "SGST", "CGST", "Total GST"]],
      body: gstSummary,
      theme: "plain",
      headStyles: {
        fillColor: [180, 180, 180],
        textColor: 0,
        fontSize: 7,
        font: "helvetica",
        fontStyle: "bold",
        cellPadding: 0.3,
        halign: "center",
        lineHeight: 1,
      },
      styles: {
        cellPadding: 0.3,
        fontSize: 6.5,
        font: "helvetica",
        fontStyle: "normal",
        lineWidth: 0,
        halign: "center",
        lineHeight: 1,
      },
      columnStyles: {
        0: { cellWidth: 14 },
        1: { cellWidth: 14 },
        2: { cellWidth: 14 },
        3: { cellWidth: 14 },
        4: { cellWidth: 14 },
        5: { cellWidth: 14 },
        6: { cellWidth: 14 },
      },
      margin: { left: 10, right: 10 },
      pageBreak: "auto",
      drawCell: (data) => {
        const { cell, doc } = data;
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.1);
        doc.line(cell.x, cell.y, cell.x, cell.y + cell.height);
        doc.line(
          cell.x + cell.width,
          cell.y,
          cell.x + cell.width,
          cell.y + cell.height
        );
        if (data.section === "head") {
          doc.line(
            cell.x,
            cell.y + cell.height,
            cell.x + cell.width,
            cell.y + cell.height
          );
        }
      },
      didDrawCell: (data) => {
        if (data.section === "body" && data.row.index === 0) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(7);
          doc.text("SUB TOTAL", 130, data.cell.y + 3);
          doc.text(
            `${invoiceData?.invoice_data?.subtotal || 0.0}`,
            160,
            data.cell.y + 3
          );
          doc.text("DISCOUNT", 130, data.cell.y + 6);
          doc.text(
            `${invoiceData?.invoice_data?.discount || "00.00"}`,
            160,
            data.cell.y + 6
          );
          doc.text("TOTAL PAYABLE", 130, data.cell.y + 9);
          doc.text(
            `${invoiceData?.invoice_data?.total_bill_amount || 0.0}`,
            160,
            data.cell.y + 9
          );
        }
        if (data.section === "body" && data.row.index === 4) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(7);
          doc.text("CGST", 130, data.cell.y + 3);
          doc.text("45.47", 160, data.cell.y + 3);
          doc.text("SGST", 130, data.cell.y + 6);
          doc.text("45.47", 160, data.cell.y + 6);
        }
      },
      didDrawPage: (data) => {
        if (data.cursor.y > HALF_PAGE_HEIGHT) {
          currentPage++;
          doc.addPage();
          startY = 5;
          addPageDecorations(currentPage, startY);
          addHeaderDetails(startY);
          doc.setTextColor(0, 0, 0);
          data.cursor.y = startY + 45;
        }
      },
    });

    finalY = doc?.lastAutoTable?.finalY || finalY + 5;
    const footerHeight = 20;
    if (finalY + footerHeight > HALF_PAGE_HEIGHT) {
      currentPage++;
      doc.addPage();
      startY = 5;
      addPageDecorations(currentPage, startY);
      addHeaderDetails(startY);
      doc.setTextColor(0, 0, 0);
      finalY = startY + 45;
    }

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    const amountInWords = numberToWords(
      invoiceData?.invoice_data?.total_bill_amount
    );
    doc.text(`Amount in Words: ${amountInWords}`, 10, finalY + 5);
    doc.text("Terms & Conditions:", 10, finalY + 9);
    // doc.text(
    //   "1. Goods once sold will not be taken back or exchanged.",
    //   10,
    //   finalY + 13
    // );
    // doc.text(
    //   "2. Bills not paid by due date will attract 24% interest.",
    //   10,
    //   finalY + 17
    // );
    //     invoiceData?.invoice_data?.terms_and_conditions.forEach((term, index) => {
    //   doc.text(term, 10, finalY + 13 + (index * 4));
    // });
    // Add Terms & Conditions
    const termsAndConditions = invoiceData?.terms_and_conditions || [];
    if (termsAndConditions.length > 0) {
      doc.text("Terms & Conditions:", 10, finalY + 9);
      termsAndConditions.forEach((term, index) => {
        doc.text(term, 10, finalY + 13 + index * 4);
      });
      finalY += 13 + termsAndConditions.length * 4; // Update finalY for further content
    }
    doc.text("Receiver's Signature:", 140, finalY + 9);
    doc.text(
      `For: ${invoiceData?.business_details?.business_name || "N/A"}`,
      140,
      finalY + 13
    );
    doc.text("Authorized Signatory", 140, finalY + 17);

    const watermarkY = finalY + 17 + 5;
    if (watermarkY + 10 <= HALF_PAGE_HEIGHT) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(230, 230, 230);
      // doc.text("CREDIT", 10, watermarkY, { angle: 0 });
    }

    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl); // Open PDF in new tab
    return { blob: pdfBlob, url: pdfUrl };
  };

  const handleHoldOrder = () => {
    setHoldModalOpen(true);
  };

  const handleConfirmHold = async () => {
    try {
      // Add your hold order logic here
      setHoldModalOpen(false);
      toast.success("Order placed on hold successfully");
      dispatch(clearCart());
    } catch (error) {
      toast.error("Failed to hold order");
    }
  };

  const handleCouponSubmit = (creditNoteData) => {
    setSelectedCreditNote({
      cnNumber: creditNoteData.cnNumber,
      amount: creditNoteData.amount,
    });
    setPaymentDetails((prev) => ({
      ...prev,
      coupon: -creditNoteData.amount,
    }));
    setCouponModalOpen(false);
  };

  const handleOpenExchangePopup = () => {
    setMobilePopupOpen(true);
  };

  const handleScanClick = () => {
    setIsScanning(true);
    barcodeInputRef.current?.focus();
  };

  const handleBarcodeScan = (barcode) => {
    // Add your barcode scanning logic here
    console.log("Scanned barcode:", barcode);
  };

  // Payment methods
  const paymentMethods = [
    {
      id: "Cash",
      label: "Cash",
      icon: <PaidOutlined sx={{ fontSize: 16 }} />,
      color: "btn-success",
    },
    {
      id: "Card",
      label: "Card",
      icon: <CreditCard sx={{ fontSize: 16 }} />,
      color: "btn-primary",
    },
    {
      id: "Credit",
      label: "Pay Later",
      icon: <AccountBalanceWallet sx={{ fontSize: 16 }} />,
      color: "btn-info",
    },
    {
      id: "Partial",
      label: "Split Bill",
      icon: <CallSplit sx={{ fontSize: 16 }} />,
      color: "btn-warning",
    },
  ];

  // Effects
  useEffect(() => {
    calculateTaxDetails();
  }, [calculateTaxDetails]);

  useEffect(() => {
    // Initialize component
    const salesMan = JSON.parse(localStorage.getItem("user"));
    setSelectedSalesman(salesMan?.id);
  }, []);

  // next orderId
  const getNextOrder = async () => {
    try {
      const response = await getNextOrderId();
      setOrderId(response?.next_order_id);
    } catch (error) {
      console.log(error);
    }
  };
  // hold order
  const holdOrders = async () => {
    try {
      const user = localStorage.getItem("userId");
      // Prepare order items data
      const orderItems = cartItems.map((item) => ({
        product_id: item.id,
        name: item?.name,
        quantity: item.quantity,
        mrp: item.mrp,
        selling_price: item.selling_price || item.mrp, // fallback to mrp if selling_price not available
        batch_number: item.batch_no || "",
        expiry_date: item.exp_date || "",
        discount: item.discount || 0,
        mfg: item?.mfg || "",
        cgst: item.cgst || 0,
        sgst: item.sgst || 0,
        igst: item.igst || 0,
        type: item.type || "non-medical",
        stock_id: item.stock_id,
        sale_type: item.sale_type,
        totalMrp: item?.total_price || 0,
        hsn: item?.hsn || 0,
        conversion_id: item.conversion_id,
      }));

      // Prepare payment data
      const paymentData = {
        payment_method: selectedPayment,
        amount: parseFloat(getTotalWithRoundOff()),
        ...(selectedPayment === "Card" && {
          card_last_digits: cardDetails.lastDigits,
        }),
        ...(selectedPayment === "Partial" && {
          partial_payment_data: splitPayments.map((payment) => ({
            method: payment.method,
            amount: parseFloat(payment.amount) || 0,
          })),
        }),
      };

      // Prepare the complete order payload
      const orderPayload = {
        emp_id: JSON.parse(user),
        order_id: orderId,
        customer_id: customerDetails.customer_id,
        contact_number: customerDetails.contact_number,
        customer_name: customerDetails.customer_name,
        email: customerDetails.email,
        gstin: customerDetails.gstin,
        customer_type: customerDetails.customerType,
        customer_category: customerDetails.customer_category,
        abha_id: customerDetails.abha_number,
        doctor_name: customerDetails.doctor_name,
        product_details: orderItems,
        payment: paymentData,
        payment_mode: selectedPayment,
        ...(selectedPayment === "Card" && {
          card_last_digits: cardDetails.lastDigits,
        }),
        ...(selectedPayment === "Partial" && {
          partial_payment_data: splitPayments.map((payment) => ({
            method: payment.method,
            amount: parseFloat(payment.amount) || 0,
          })),
        }),
        subtotal: calculateSubTotal().toFixed(2),
        total_bill_amount: parseFloat(getTotalWithRoundOff()),
        discounts: {
          medical: Math.abs(paymentDetails.medicalDiscount),
          non_medical: Math.abs(paymentDetails.nonMedicalDiscount),
          // coupon: Math.abs(paymentDetails.coupon),
          // credit_note: selectedCreditNote.amount > 0 ? {
          //   cn_number: selectedCreditNote.cnNumber,
          //   amount: selectedCreditNote.amount
          // } : null
        },
        total_discount:
          Math.abs(paymentDetails.medicalDiscount) +
            Math.abs(paymentDetails.nonMedicalDiscount) || 0,
        total_items: orderItems.length,
        charges: {
          shipping: paymentDetails.shipping,
          tax: paymentDetails.tax,
        },
        total_tax: taxDetails?.grandTotalTax.toFixed(2),
        tax_details: taxDetails.details,
        round_off: isRoundOff ? parseFloat(calculateRoundOff()) : 0,
        salesman_id: selectedSalesman || null,
        order_reference_no: orderReference || null,
      };
      const response = await holdOrder(orderPayload);
      if (response) {
        setHoldModalOpen(false);
        fetchProducts();
        handleNextOrder();
        setOrderReference("");
        fetchHoldData();
        toast.success("Order placed on hold successfully");
        Swal.fire({
          title: "Order placed on hold successfully",
          icon: "success",
          showConfirmButton: false,
          timer: 1000,
        });
      } else {
        throw new Error("Failed to place order on hold");
      }
    } catch (error) {
      // console.error("Hold order error:", error);
      setHoldModalOpen(false);
      toast.error(
        error.response.data?.error || "Failed to place order on hold"
      );
      Swal.fire({
        title:
          error.response?.data?.error?.contact_number?.[0] ||
          "Failed to place order on hold",
        icon: "error",
        showConfirmButton: false,
        timer: 1000,
      });
    }
  };
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    console.log(file);

    if (file) {
      setPrescription(file);
    }
  };

  const handleGlobalKeyDown = useCallback(
    (e) => {
      // Focus barcode input when '/' is pressed
      if (e.key === "/" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        barcodeInputRef.current?.focus();
        return;
      }

      // Quick payment method selection (1-4)
      if (e.ctrlKey && e.key >= "1" && e.key <= "4") {
        e.preventDefault();
        const index = parseInt(e.key) - 1;
        if (index < paymentMethods.length) {
          handlePaymentSelect(paymentMethods[index].id);
        }
        return;
      }

      // Quantity adjustment shortcuts (Shift + Up/Down)
      if (e.shiftKey && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
        e.preventDefault();
        if (cartItems.length > 0) {
          const lastItem = cartItems[cartItems.length - 1];
          if (e.key === "ArrowUp") {
            handleIncrease(lastItem.id, lastItem.discount);
          } else {
            handleDecrease(lastItem.id, lastItem.discount);
          }
        }
        return;
      }

      // Hold order shortcut (Ctrl+H)
      if (e.ctrlKey && e.key.toLowerCase() === "h") {
        e.preventDefault();
        handleHoldOrder();
        return;
      }

      // Next order shortcut (Ctrl+N)
      if (e.ctrlKey && e.key.toLowerCase() === "n") {
        e.preventDefault();
        handleNextOrder();
        return;
      }

      // Roundoff toggle shortcut (Ctrl+R)
      if (e.ctrlKey && e.key.toLowerCase() === "f") {
        e.preventDefault();
        setIsRoundOff(!isRoundOff);
        return;
      }

      // Focus mobile number field (Ctrl+M)
      if (e.ctrlKey && e.key.toLowerCase() === "m") {
        e.preventDefault();
        document.querySelector('input[name="contact_number"]')?.focus();
        return;
      }

      // Focus name field (Ctrl+Shift+N)
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "n") {
        e.preventDefault();
        document.querySelector('input[name="customer_name"]')?.focus();
        return;
      }
    },
    [cartItems, paymentMethods, isRoundOff]
  );

  // Quick search handler
  const handleQuickSearch = (e) => {
    setQuickSearch(e.target.value);
    // Here you would implement your product search logic
    // For example, you could filter products and add the first match
    // when Enter is pressed
  };

  // Add keyboard navigation to payment methods
  const handlePaymentKeyDown = (e, methodId) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handlePaymentSelect(methodId);
    }
  };

  // Focus management for keyboard navigation
  useEffect(() => {
    // Add global keydown listener
    window.addEventListener("keydown", handleGlobalKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [handleGlobalKeyDown]);

  // Auto-focus barcode input when scanning starts
  useEffect(() => {
    if (isScanning && barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
  }, [isScanning]);

  return (
    <>
      <div className="bg-white border rounded p-3 mb-0">
        {/* Header Section */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h6 fw-semibold mb-0">Customer Details</h2>
          <button
            title="Retrieve hold"
            className="btn btn-link text-primary p-0"
            onClick={() => setOpenHoldRetriveModal(true)}
          >
            <Handshake size={16} />
          </button>
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-primary-subtle text-primary">
              #{orderId}
            </span>
            <button
              className="btn btn-link text-danger p-0"
              onClick={() => getNextOrderId()}
            >
              <Refresh size={16} />
            </button>
          </div>
        </div>

        {/* Quick Search */}
        <div
          className="mb-2"
          style={{ display: quickSearch ? "block" : "none" }}
        >
          <input
            ref={quickSearchRef}
            type="text"
            placeholder="Quick search (type product name or code)"
            value={quickSearch}
            onChange={handleQuickSearch}
            className="form-control form-control-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter" && quickSearch) {
              }
              if (e.key === "Escape") {
                setQuickSearch("");
              }
            }}
          />
        </div>

        {/* Order Items Section */}
        <div className="flex-grow-1">
          {/* <div className="p-1 border-bottom">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <div className="d-flex align-items-center gap-1">
                <span className="fw-medium" style={{ fontSize: "0.85rem" }}>
                  Order Details
                </span>
                <span
                  className="badge bg-secondary"
                  style={{ fontSize: "0.75rem" }}
                >
                  {cartItems.length} items
                </span>
              </div>
              {cartItems.length > 0 && (
                <button
                  className="btn btn-sm btn-outline-danger py-0 px-1"
                  onClick={() => dispatch(clearCart())}
                >
                  Clear All
                </button>
              )}
            </div>

            <div
              className="row fw-medium text-muted"
              style={{ fontSize: "0.8rem", marginBottom: "0.25rem" }}
            >
              <div className="col-6">Item</div>
              <div className="col-3 text-center">Qty</div>
              <div className="col-3 text-end">Amount</div>
            </div>

            {cartItems.map((item) => (
              <div
                key={`${item.id}-${item.batch_no}-${item.sale_type}`}
                className="row align-items-center py-0.5"
                style={{ fontSize: "0.85rem" }}
              >
                <div className="col-6 d-flex align-items-center gap-1">
                  <button
                    className="btn btn-link text-muted p-0"
                    onClick={() =>
                      handleRemove(item.id, item.batch_no, item.sale_type)
                    }
                  >
                    <Delete sx={{ fontSize: 12 }} />
                  </button>
                  <span className="text-truncate">{item.name}</span>
                </div>
                <div className="col-3 d-flex align-items-center justify-content-center gap-1">
                  <span className="w-25 text-center">{item.quantity}</span>
                </div>
                <div className="col-3 text-end fw-medium">
                  ₹{item.total_price.toFixed(2)}
                </div>
              </div>
            ))}
          </div> */}

          {/* Payment Summary Section */}
          <div className="p-3 border-top">
            <h3 className="fw-medium mb-3">Payment Summary</h3>

            <div className="row">
              {/* Left side - Payment Summary details */}
              <div className="col-md-8">
                {/* Medical Items Summary */}
                {medicalItems.length > 0 && (
                  <>
                    <div className="d-flex justify-content-between fw-medium mt-2">
                      <span>Medical Total</span>
                      <span>₹{calculateMedicalTotal().toLocaleString()}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-2">
                      <div className="d-flex align-items-center gap-2">
                        <span>Medical Discount</span>
                        <button
                          className="btn btn-link text-muted p-0"
                          onClick={() =>
                            handleEditClick(
                              "Medical Discount",
                              (calculateMedicalDiscount() /
                                calculateMedicalTotal()) *
                                100 || 0
                            )
                          }
                        >
                          <Edit sx={{ fontSize: 16 }} />
                        </button>
                      </div>
                      <span className="text-danger">
                        {paymentDetails.medicalDiscount < 0 ? "-" : ""}
                        -₹
                        {parseFloat(paymentDetails.medicalDiscount).toFixed(2)}
                      </span>
                    </div>
                  </>
                )}

                {/* Non-Medical Items Summary */}
                {nonMedicalItems.length > 0 && (
                  <>
                    <div className="d-flex justify-content-between fw-medium mt-2">
                      <span>Non-Medical Total</span>
                      <span>
                        ₹{calculateNonMedicalTotal().toLocaleString()}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-2">
                      <div className="d-flex align-items-center gap-2">
                        <span>Non-Medical Discount</span>
                        <button
                          className="btn btn-link text-muted p-0"
                          onClick={() =>
                            handleEditClick(
                              "Non Medical Discount",
                              (Math.abs(paymentDetails.nonMedicalDiscount) /
                                calculateNonMedicalTotal()) *
                                100 || 0
                            )
                          }
                        >
                          <Edit sx={{ fontSize: 16 }} />
                        </button>
                      </div>
                      <span
                        className={
                          paymentDetails.nonMedicalDiscount < 0
                            ? "text-danger"
                            : ""
                        }
                      >
                        {paymentDetails.nonMedicalDiscount < 0 ? "-" : ""}₹
                        {Math.abs(paymentDetails.nonMedicalDiscount).toFixed(2)}
                      </span>
                    </div>
                  </>
                )}

                {/* Tax Details */}
                <div className="mb-3 border-bottom pb-2">
                  <div className="fw-medium mb-2">Tax Details:</div>
                  {taxDetails.details.map((tax, index) => (
                    <div
                      key={index}
                      className="d-flex justify-content-between small text-muted"
                    >
                      <span>GST {tax.cgst + tax.sgst}%</span>
                      <span>₹{tax.TotalTaxAmount.toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="d-flex justify-content-between fw-medium mt-2">
                    <span>Total Tax</span>
                    <span>₹{taxDetails.grandTotalTax.toFixed(2)}</span>
                  </div>
                </div>

                {/* Discounts and Coupons */}
                <div className="mb-3">
                  {[{ label: "Coupon", value: paymentDetails.coupon }].map(
                    (item) => (
                      <div
                        key={item.label}
                        className="d-flex justify-content-between align-items-center mb-2"
                      >
                        <div className="d-flex align-items-center gap-2">
                          <span>{item.label}</span>
                          {item.label === "Coupon" &&
                          paymentDetails.coupon !== -0 ? (
                            <button
                              className="btn btn-link text-danger p-0"
                              onClick={handleClearCoupon}
                            >
                              <Close sx={{ fontSize: 16 }} />
                            </button>
                          ) : (
                            <button
                              className="btn btn-link text-muted p-0"
                              onClick={() =>
                                handleEditClick(
                                  item.label,
                                  item.label === "Discount"
                                    ? (Math.abs(item.value) /
                                        calculateSubTotal()) *
                                        100
                                    : item.value
                                )
                              }
                            >
                              <Edit sx={{ fontSize: 16 }} />
                            </button>
                          )}
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          {item.displayValue && (
                            <small className="text-muted">
                              {item.displayValue}
                            </small>
                          )}
                          <span className={item.value < 0 ? "text-danger" : ""}>
                            {item.value < 0 ? "-" : ""}₹
                            {Math.abs(item.value).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    )
                  )}
                </div>

                <div className="d-flex justify-content-between text-muted border-top pt-2">
                  <span>Sub Total:</span>
                  <span>₹{calculateSubTotal().toLocaleString()}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center py-2">
                  <div className="d-flex align-items-center gap-3">
                    <span>Roundoff (Ctrl+F)</span>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={isRoundOff}
                        onChange={() => setIsRoundOff(!isRoundOff)}
                      />
                    </div>
                  </div>
                  <span
                    className={
                      parseFloat(calculateRoundOff()) < 0
                        ? "text-danger"
                        : "text-success"
                    }
                  >
                    ₹{calculateRoundOff()}
                  </span>
                </div>
              </div>

              {/* Right side - Total Payable */}
              <div className="col-md-4 d-flex flex-column justify-content-center border-start ps-3">
                <div className="d-flex flex-column align-items-center justify-content-center bg-light rounded p-3">
                  <div className="fw-bold fs-5 mb-2">Total Payable</div>
                  <div className="fw-bold fs-4 text-primary">
                    ₹{getTotalWithRoundOff()}
                  </div>
                  <div className="text-success small mt-2">
                    Total Savings: ₹{calculateTotalSavings()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Options Section */}
          <div className="border-top p-2">
            <h3 className="fw-medium mb-2 small">Select Payment</h3>
            <div className="row row-cols-4 g-1 mb-2">
              {paymentMethods.map((method, index) => (
                <div key={method.id} className="col">
                  <button
                    onClick={() => handlePaymentSelect(method.id)}
                    onKeyDown={(e) => handlePaymentKeyDown(e, method.id)}
                    className={`btn btn-sm ${
                      method.color
                    } w-100 d-flex flex-column align-items-center p-1 ${
                      method.id === selectedPayment
                        ? "border-primary border-2"
                        : ""
                    }`}
                    aria-label={`${method.label} (${index + 1})`}
                    tabIndex="0"
                  >
                    {React.cloneElement(method.icon, { size: 16 })}
                    <span className="mt-0 small">
                      {method.label} (Ctrl+{index + 1})
                    </span>
                  </button>
                </div>
              ))}
            </div>

            {/* Additional payment action buttons */}
            <div className="row row-cols-3 g-1 mb-2">
              <div className="col">
                <button
                  onClick={handleHoldOrder}
                  onKeyDown={(e) => e.key === "Enter" && handleHoldOrder()}
                  className="btn btn-sm btn-outline-warning w-100 d-flex flex-column align-items-center p-1"
                  aria-label="Hold order (Ctrl+H)"
                  tabIndex="0"
                >
                  <PauseCircle sx={{ fontSize: 16 }} />
                  <span className="mt-0 small">Hold (Ctrl+H)</span>
                </button>
              </div>
              <div className="col">
                <button
                  onClick={() => dispatch(clearCart())}
                  onKeyDown={(e) => e.key === "Enter" && dispatch(clearCart())}
                  className="btn btn-sm btn-outline-danger w-100 d-flex flex-column align-items-center p-1"
                  aria-label="Clear cart"
                  tabIndex="0"
                >
                  <RestartAlt sx={{ fontSize: 16 }} />
                  <span className="mt-0 small">Clear</span>
                </button>
              </div>
              <div className="col">
                <button
                  className="btn btn-sm btn-outline-primary w-100 d-flex flex-column align-items-center p-1"
                  onClick={handleOpenExchangePopup}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleOpenExchangePopup()
                  }
                  aria-label="Exchange"
                  tabIndex="0"
                >
                  <CurrencyExchange sx={{ fontSize: 16 }} />
                  <span className="mt-0 small">Exchange</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 1,
              width: "90%",
              maxWidth: 400,
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="fs-5 fw-bold">
                Edit{" "}
                {editingField.label.charAt(0).toUpperCase() +
                  editingField.label.slice(1)}
              </h2>
              <button
                onClick={() => setEditModalOpen(false)}
                className="btn btn-link text-muted p-0"
              >
                <Close />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="mb-3">
              <div className="mb-3">
                <label className="form-label">
                  {editingField.label.charAt(0).toUpperCase() +
                    editingField.label.slice(1)}
                  {editingField.label.toLowerCase().includes("discount")
                    ? " Percentage"
                    : " Amount"}
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editingField.value}
                  onChange={(e) =>
                    setEditingField((prev) => ({
                      ...prev,
                      value: parseFloat(e.target.value) || 0,
                    }))
                  }
                  className="form-control"
                  required
                />
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="btn btn-outline-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
              </div>
            </form>
          </Box>
        </Modal>

        <Modal open={paymentModalOpen} onClose={handleClosePaymentModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 1,
              width: "90%",
              maxWidth: 400,
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="fs-5 fw-bold">
                Finalize {selectedPayment === "Cash" ? "Cash" : "Card"} Payment
              </h2>
              <button
                onClick={handleClosePaymentModal}
                className="btn btn-link text-muted p-0"
              >
                <Close />
              </button>
            </div>
            <CustomerDetailsForm
              customerDetails={customerDetails}
              handleCustomerMobileChange={handleCustomerMobileChange}
              handleCustomerChange={handleCustomerChange}
              showAllDetails={showAllDetails}
              setShowAllDetails={setShowAllDetails}
              customerTypes={customerTypes}
              handleFileUpload={handleFileUpload}
              barcode={barcode}
              handleBarcodeScan={handleBarcodeScan}
              isScanning={isScanning}
              handleScanClick={handleScanClick}
              barcodeInputRef={barcodeInputRef}
              mobileInputRef={mobileInputRef}
              nameInputRef={nameInputRef}
            />
            <form onSubmit={handlePaymentSubmit} className="mb-3">
              {selectedPayment === "Card" && (
                <CardPaymentForm
                  cardDetails={cardDetails}
                  isCardNumberSubmitted={isCardNumberSubmitted}
                  onCardNumberChange={handleCardNumberChange}
                  onResetCardNumber={handleResetCardNumber}
                />
              )}
              <div className="mb-3">
                <label className="form-label">Grand Total</label>
                <input
                  type="text"
                  value={`₹${getTotalWithRoundOff()}`}
                  className="form-control bg-light"
                  disabled
                />
              </div>
              {selectedPayment === "Cash" && (
                <>
                  <div className="mb-3">
                    <label className="form-label">Received Amount</label>
                    <input
                      type="number"
                      step="0.01"
                      value={receivedAmount}
                      onChange={(e) => setReceivedAmount(e.target.value)}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Return Amount</label>
                    <input
                      type="text"
                      value={`₹${calculateReturnAmount()}`}
                      className={`form-control bg-light ${
                        parseFloat(calculateReturnAmount()) < 0
                          ? "text-danger"
                          : ""
                      }`}
                      disabled
                    />
                  </div>
                </>
              )}
              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  onClick={handleClosePaymentModal}
                  className="btn btn-outline-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Place Order
                </button>
              </div>
            </form>
          </Box>
        </Modal>

        {/* Split Payment Modal */}
        <Modal open={splitModalOpen} onClose={() => setSplitModalOpen(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 1,
              width: "90%",
              maxWidth: 500, // Increased to accommodate customer details
            }}
          >
            <SplitPaymentModal
              open={splitModalOpen}
              onClose={() => setSplitModalOpen(false)}
              totalAmount={getTotalWithRoundOff()}
              splitPayments={splitPayments}
              onSplitPaymentChange={handleSplitPaymentChange}
              onRemoveSplitPayment={removeSplitPayment}
              onAddSplitPayment={addSplitPayment}
              onSubmit={handleSplitPaymentSubmit}
              calculateSplitRemaining={calculateSplitRemaining}
              customerDetails={customerDetails}
              handleCustomerMobileChange={handleCustomerMobileChange}
              handleCustomerChange={handleCustomerChange}
              showAllDetails={showAllDetails}
              setShowAllDetails={setShowAllDetails}
              customerTypes={customerTypes}
              handleFileUpload={handleFileUpload}
              barcode={barcode}
              handleBarcodeScan={handleBarcodeScan}
              isScanning={isScanning}
              handleScanClick={handleScanClick}
              barcodeInputRef={barcodeInputRef}
              mobileInputRef={mobileInputRef}
              nameInputRef={nameInputRef}
            />
          </Box>
        </Modal>

        {/* Order Completed Modal */}
        <Modal
          open={orderCompletedModal}
          onClose={() => setOrderCompletedModal(false)}
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
              width: "90%",
              maxWidth: 400,
            }}
          >
            <div className="text-center">
              <div
                className="d-flex align-items-center justify-content-center bg-success-subtle rounded-circle mx-auto mb-3"
                style={{ width: "64px", height: "64px" }}
              >
                <CheckCircle className="text-success fs-3" />
              </div>
              <h2 className="fs-4 fw-bold mb-2">Order Completed!</h2>

              <p className="text-muted mb-4">
                Do you want to print the receipt for the completed order?
              </p>
              <div className="d-flex gap-3">
                <button
                  onClick={handlePrintReceipt}
                  className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                >
                  <Receipt sx={{ fontSize: 16 }} />
                  Print Receipt
                </button>
                <button
                  onClick={handleNextOrder}
                  className="btn btn-success w-100 d-flex align-items-center justify-content-center gap-2"
                >
                  <Add sx={{ fontSize: 16 }} />
                  Next Order
                </button>
              </div>
            </div>
          </Box>
        </Modal>

        {/* Hold Order Modal */}
        <Modal open={holdModalOpen} onClose={() => setHoldModalOpen(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 1,
              width: "90%",
              maxWidth: 400,
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="fs-5 fw-bold">Hold Order</h2>
              <button
                onClick={() => setHoldModalOpen(false)}
                className="btn btn-link text-muted p-0"
              >
                <Close />
              </button>
            </div>
            <CustomerDetailsForm
              customerDetails={customerDetails}
              handleCustomerMobileChange={handleCustomerMobileChange}
              handleCustomerChange={handleCustomerChange}
              showAllDetails={showAllDetails}
              setShowAllDetails={setShowAllDetails}
              customerTypes={customerTypes}
              handleFileUpload={handleFileUpload}
              barcode={barcode}
              handleBarcodeScan={handleBarcodeScan}
              isScanning={isScanning}
              handleScanClick={handleScanClick}
              barcodeInputRef={barcodeInputRef}
              mobileInputRef={mobileInputRef}
              nameInputRef={nameInputRef}
            />
            <HoldOrderModal
              open={holdModalOpen}
              onClose={() => setHoldModalOpen(false)}
              totalAmount={getTotalWithRoundOff()}
              orderReference={orderReference}
              onOrderReferenceChange={setOrderReference}
              onConfirmHold={holdOrders}
              customerDetails={customerDetails}
              handleCustomerMobileChange={handleCustomerMobileChange}
              handleCustomerChange={handleCustomerChange}
              showAllDetails={showAllDetails}
              setShowAllDetails={setShowAllDetails}
              customerTypes={customerTypes}
              handleFileUpload={handleFileUpload}
              barcode={barcode}
              handleBarcodeScan={handleBarcodeScan}
              isScanning={isScanning}
              handleScanClick={handleScanClick}
              barcodeInputRef={barcodeInputRef}
              mobileInputRef={mobileInputRef}
              nameInputRef={nameInputRef}
            />
          </Box>
        </Modal>

        {/* Coupon Modal */}
        <CouponModal
          open={couponModalOpen}
          onClose={() => setCouponModalOpen(false)}
          onSubmit={handleCouponSubmit}
          subtotal={calculateSubTotal()}
        />

        {/* Hold Retrieve Modal */}
        <HoldRetriveModel
          show={openHoldRetriveModel}
          onHide={() => setOpenHoldRetriveModal(false)}
          orders={heldOrders}
          onRetrieve={handleRetrieve}
          onDelete={handleDelete}
        />

        {/* Mobile Exchange Popup */}
        <MobileModelPopup
          open={mobilePopupOpen}
          onClose={() => setMobilePopupOpen(false)}
        />
      </div>

      <Modal open={creditModalOpen} onClose={() => setCreditModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 1,
            width: "90%",
            maxWidth: 400,
          }}
        >
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="fs-5 fw-bold">Pay Later Details</h2>
            <button
              onClick={() => setCreditModalOpen(false)}
              className="btn btn-link text-muted p-0"
            >
              <Close />
            </button>
          </div>
          <CustomerDetailsForm
            customerDetails={customerDetails}
            handleCustomerMobileChange={handleCustomerMobileChange}
            handleCustomerChange={handleCustomerChange}
            showAllDetails={showAllDetails}
            setShowAllDetails={setShowAllDetails}
            customerTypes={customerTypes}
            handleFileUpload={handleFileUpload}
            barcode={barcode}
            handleBarcodeScan={handleBarcodeScan}
            isScanning={isScanning}
            handleScanClick={handleScanClick}
            barcodeInputRef={barcodeInputRef}
            mobileInputRef={mobileInputRef}
            nameInputRef={nameInputRef}
          />
          <div className="d-flex justify-content-end gap-2 mt-3">
            <button
              type="button"
              onClick={() => setCreditModalOpen(false)}
              className="btn btn-outline-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmCredit}
              className="btn btn-primary"
            >
              Confirm
            </button>
          </div>
        </Box>
      </Modal>
    </>
  );
}
