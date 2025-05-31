import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import AsyncSelect from "react-select/async";
import debounce from "lodash.debounce";
import { FaShoppingCart, FaPlus, FaMinus } from "react-icons/fa";
import { CheckCircle } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../../store/cart/cartSlice";

// Custom debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Table and loader CSS
const tableStyles = `
  .loader-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(255, 255, 255, 0.8);
    z-index: 1000;
  }

  .loader {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #0d6efd;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .product-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }

  .product-table th,
  .product-table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
    font-size: 15px;
  }

  .product-table th {
    background-color: #f2f2f2;
    font-weight: bold;
    color: black;
  }

  .product-table tr {
    transition: background-color 0.2s ease;
  }

  .product-table tr.selected,
  .product-table tr:focus-within {
    background-color: #e0f7fa;
    outline: 2px solid #007bff;
  }

  .product-table tr:hover {
    background-color: #e0f7fa;
  }
  .product-table tr.out-of-stock {
    background-color: #f8d7da;
    color: #721c24;
  }

  .product-table input,
  .product-table select {
    padding: 5px;
    font-size: 0.85rem;
    border-radius: 4px;
    border: 1px solid #ddd;
    width: 100%;
    max-width: 200px;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .product-table input:focus,
  .product-table select:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.25);
  }

  .product-table input[type="number"] {
    max-width: 70px;
  }

  .product-table select.pack-unit-select {
    max-width: 100px;
  }

  .stock-badge {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.8rem;
  }

  .about-to-expire {
    color: #ffc107;
    font-weight: bold;
  }

  .search-container {
    position: relative;
    width: 100%;
    max-width: 200px;
  }

  .clear-button {
    cursor: pointer;
    color: #dc3545;
    margin-left: 8px;
    font-size: 0.9rem;
    vertical-align: middle;
  }

  .check-circle {
    color: #0d6efd;
    background-color: #fff;
    border-radius: 50%;
    font-size: 1rem;
    padding: 2px;
    vertical-align: middle;
    margin-left: 5px;
  }

  .cart-section {
    margin-top: 20px;
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: #f9f9f9;
  }

  .cart-section h3 {
    font-size: 1.2rem;
    margin-bottom: 10px;
  }

  .cart-table {
    width: 100%;
    border-collapse: collapse;
  }

  .cart-table th,
  .cart-table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
    font-size: 0.9rem;
  }

  .cart-table th {
    background-color: #f2f2f2;
    font-weight: 600;
    color: #212529;
  }

  .cart-empty {
    font-size: 0.9rem;
    color: #6c757d;
    text-align: center;
    padding: 10px;
  }

  .action-buttons {
    display: flex;
    justify-content: center;
    gap: 10px;
  }

  .action-button {
    padding: 5px 10px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
  }

  .add-button {
    background-color: #28a745;
    color: white;
  }

  .add-button:hover {
    background-color: #218838;
  }

  .remove-button {
    background-color: #dc3545;
    color: white;
  }

  .remove-button:hover {
    background-color: #c82333;
  }
`;

const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    borderRadius: "6px",
    padding: "5px",
    fontSize: "12px",
    minWidth: "200px",
    boxShadow: state.isFocused
      ? "0 0 5px rgba(0, 123, 255, 0.5)"
      : "inset 0 1px 3px rgba(0, 0, 0, 0.1)",
    border: state.isFocused ? "1px solid #007bff" : "1px solid #ced4da",
    minHeight: "38px",
    "&:hover": {
      borderColor: state.isFocused ? "#007bff" : "#ced4da",
    },
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 9999,
    position: "absolute",
    top: "100%",
    marginTop: "2px",
    width: "auto",
    minWidth: "100%",
    maxWidth: "400px",
    borderRadius: "4px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  }),
  menuList: (provided) => ({
    ...provided,
    maxHeight: "200px",
    padding: "0",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#007bff"
      : state.isFocused
      ? "#f1f9ff"
      : "white",
    color: state.isSelected ? "white" : "black",
    padding: "10px",
    "&:hover": {
      backgroundColor: state.isSelected ? "#007bff" : "#f1f9ff",
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#6c757d",
    fontWeight: "bold",
  }),
  singleValue: (provided) => ({
    ...provided,
    fontWeight: "bold",
    color: "#000",
  }),
};

export default function Products({
  fetchProduct,
  selectedCategory,
  products,
  page,
  setPage,
  setSearch,
  search,
  loading,
}) {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart?.cartItems || []);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [rows, setRows] = useState([
    {
      drugId: null,
      selectedBatchIndex: "",
      packOrUnit: "",
      quantity: "",
      discount: "",
    },
  ]);
  const [selectOptions, setSelectOptions] = useState([]); // Store AsyncSelect options
  const tableRef = useRef(null);
  const searchRefs = useRef([]); // Array to store refs for each AsyncSelect
  const debouncedSearch = useDebounce(search, 300);

  // Debug: Log products to check if it's populated
  useEffect(() => {
    if (!products || products.length === 0) {
      console.warn("Products array is empty or undefined");
    }
  }, [products]);

  // Initialize refs for each row
  useEffect(() => {
    // Initialize or update refs array to match rows
    searchRefs.current = rows.map(
      (_, i) => searchRefs.current[i] || React.createRef()
    );
  }, [rows]);

  // Focus first AsyncSelect on mount and handle global keyboard shortcuts
  useEffect(() => {
    if (searchRefs.current[0]?.current) {
      searchRefs.current[0].current.focus();
      console.log("Focused first AsyncSelect on mount");
    }
    const handleGlobalKeyDown = (event) => {
      if (event.key === "/") {
        event.preventDefault();
        if (searchRefs.current[0]?.current) {
          searchRefs.current[0].current.focus();
          console.log("Focused first AsyncSelect on / key");
        }
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  // Update filtered products when debounced search changes
  useEffect(() => {
    setSearch(debouncedSearch);
  }, [debouncedSearch, setSearch]);

  // Load product options for AsyncSelect
  const loadProductOptions = debounce((inputValue, callback) => {
    const filtered = products.filter((product) =>
      product.drug_name?.toLowerCase().includes(inputValue?.toLowerCase())
    );
    const options = filtered.map((product) => ({
      value: product.drug_id,
      label: product.drug_name,
    }));
    setSelectOptions(options); // Store options for Enter key handling
    callback(options);
  }, 300);

  // Handle product selection from AsyncSelect
  const handleProductSelect = (selectedOption, rowIndex) => {
    const drugId = selectedOption?.value || null;
    if (drugId) {
      const product = products.find((p) => p.drug_id === parseInt(drugId));
      if (product && product.stocks.length > 0) {
        // Check if the product with the same batch and pack/unit exists in another row
        const defaultBatchIndex = "0";
        const defaultPackOrUnit = "unit";
        const defaultBatch = product.stocks[defaultBatchIndex];
        const isInTable = rows.some(
          (row, index) =>
            index !== rowIndex &&
            row.drugId === drugId &&
            row.selectedBatchIndex === defaultBatchIndex &&
            row.packOrUnit === defaultPackOrUnit
        );
        if (isInTable) {
          Swal.fire({
            icon: "warning",
            title: "Item Already in Table",
            text: `${product.drug_name} (Batch: ${defaultBatch.batch_no}, ${defaultPackOrUnit}) is already added in the table.`,
            confirmButtonText: "OK",
          });
          setSearch("");
          setSelectOptions([]);
          return;
        }
      }
    }
    handleDrugSelection(rowIndex, drugId);
  };

  // Clear selected drug and remove the row
  const handleClearDrug = (rowIndex) => {
    updateRow(rowIndex, {
      drugId: null,
      selectedBatchIndex: "",
      packOrUnit: "",
      quantity: "",
      discount: "",
    });

    setSearch("");
    setSelectOptions([]); // Reset options

    // Focus the AsyncSelect of the current row
    setTimeout(() => {
      if (searchRefs.current[rowIndex]?.current) {
        searchRefs.current[rowIndex].current.focus();
        console.log(`Focused AsyncSelect at index ${rowIndex} after clear`);
      }
    }, 100);
  };

  // Handle adding a new row
  const handleAddRow = (rowIndex) => {
    setRows((prev) => {
      const newRows = [
        ...prev,
        {
          drugId: null,
          selectedBatchIndex: "",
          packOrUnit: "",
          quantity: "",
          discount: "",
        },
      ];
      // Update selectedIndex to the new row
      setSelectedIndex(newRows.length - 1);

      // Ensure searchRefs.current is updated for the new row
      searchRefs.current = newRows.map(
        (_, i) => searchRefs.current[i] || React.createRef()
      );

      // Focus the AsyncSelect of the new row
      setTimeout(() => {
        if (searchRefs.current[newRows.length - 1]?.current) {
          searchRefs.current[newRows.length - 1].current.focus();
          console.log(
            `Focused AsyncSelect for new row at index ${newRows.length - 1}`
          );
        } else {
          console.warn("Failed to focus AsyncSelect: ref not found");
        }
      }, 100);

      return newRows;
    });
  };

  // Handle Enter key for AsyncSelect
  const handleSearchKeyDown = (event, rowIndex) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (selectOptions.length > 0) {
        const drugId = selectOptions[0].value;
        const product = products.find((p) => p.drug_id === parseInt(drugId));
        if (product && product.stocks.length > 0) {
          // Check if the product with the default batch and pack/unit exists in another row
          const defaultBatchIndex = "0";
          const defaultPackOrUnit = "unit";
          const defaultBatch = product.stocks[defaultBatchIndex];
          const isInTable = rows.some(
            (row, index) =>
              index !== rowIndex &&
              row.drugId === drugId &&
              row.selectedBatchIndex === defaultBatchIndex &&
              row.packOrUnit === defaultPackOrUnit
          );
          if (isInTable) {
            Swal.fire({
              icon: "warning",
              title: "Item Already in Table",
              text: `${product.drug_name} (Batch: ${defaultBatch.batch_no}, ${defaultPackOrUnit}) is already added in the table.`,
              confirmButtonText: "OK",
            });
            setSearch("");
            setSelectOptions([]);
            return;
          }
        }

        let targetRowIndex = rowIndex;
        let newRows = [...rows];

        // If current row has a product, add a new empty row
        if (rows[rowIndex].drugId !== null) {
          newRows = [
            ...rows,
            {
              drugId: null,
              selectedBatchIndex: "",
              packOrUnit: "",
              quantity: "",
              discount: "",
            },
          ];
          setRows(newRows);
          targetRowIndex = newRows.length - 1;
          setSelectedIndex(targetRowIndex);
        }

        // Handle the product selection
        handleDrugSelection(rowIndex, drugId);
        setSearch("");
        setSelectOptions([]);

        // Focus the next row's AsyncSelect after state updates
        setTimeout(() => {
          if (searchRefs.current[targetRowIndex]?.current) {
            searchRefs.current[targetRowIndex].current.focus();
          }
        }, 0);
      } else {
        Swal.fire({
          icon: "info",
          title: "No Results",
          text: "No drugs found for the search term.",
          confirmButtonText: "OK",
        });
      }
    }
  };

  // Keyboard navigation and cart addition
  const handleKeyDown = (event, rowIndex, product) => {
    // Skip navigation if the target is a select element
    if (event.target.tagName.toLowerCase() === "select") {
      return;
    }

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setSelectedIndex((prev) => (prev < rows.length - 1 ? prev + 1 : prev));
        break;
      case "ArrowUp":
        event.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case "Enter":
      case "Ctrl+Enter":
        event.preventDefault();
        if (product && calculateTotalQuantity(product?.stocks) > 0) {
          handleAddToCart(product, rowIndex);
        }
        break;
      default:
        break;
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const calculateTotalQuantity = (stocks) => {
    return stocks?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
  };

  const calculateTotalPrice = (product, row) => {
    const selectedBatchIndex = row.selectedBatchIndex; // Fixed syntax error
    const packOrUnit = row.packOrUnit;
    const selectedBatch =
      selectedBatchIndex !== "" && product?.stocks[selectedBatchIndex]
        ? product.stocks[selectedBatchIndex]
        : null;
    if (!selectedBatch || !packOrUnit) return 0;

    const mrpPrice =
      packOrUnit === "pack"
        ? selectedBatch.mrp_per_pack || 0
        : selectedBatch.mrp_per_unit || 0;
    const qty = parseInt(row.quantity) || 0;
    const discPercent = parseFloat(row.discount) || 0;

    const grossAmount = mrpPrice * qty;
    const discountAmount = (grossAmount * discPercent) / 100;
    const total = grossAmount - discountAmount;

    return total.toFixed(2);
  };

  const isQuantityInputEnabled = (product, row) => {
    const selectedBatchIndex = row.selectedBatchIndex;
    const packOrUnit = row.packOrUnit;
    const selectedBatch =
      selectedBatchIndex !== "" && product?.stocks[selectedBatchIndex]
        ? product.stocks[selectedBatchIndex]
        : null;
    if (!selectedBatch || !packOrUnit) return false;

    return calculateAvailableQuantity(selectedBatch, packOrUnit) >= 1;
  };

  const handleQuantityChange = (rowIndex, value, maxQuantity) => {
    if (value === "") {
      updateRow(rowIndex, { quantity: "" });
      return;
    }

    const parsedValue = parseFloat(value);
    if (!Number.isInteger(parsedValue)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Quantity",
        text: "Please enter a whole number (e.g., 1, 2, 3).",
        confirmButtonText: "OK",
      });
      return;
    }

    if (parsedValue <= 0) {
      Swal.fire({
        icon: "error",
        title: "Invalid Quantity",
        text: "Quantity must be a positive number.",
        confirmButtonText: "OK",
      });
      return;
    }

    if (parsedValue > maxQuantity) {
      Swal.fire({
        icon: "error",
        title: "Exceeds Stock",
        text: `Quantity cannot exceed available stock (${maxQuantity}).`,
        confirmButtonText: "OK",
      });
      return;
    }

    updateRow(rowIndex, { quantity: parsedValue.toString() });
  };

  const updateRow = (rowIndex, updates) => {
    setRows((prevRows) =>
      prevRows.map((row, index) =>
        index === rowIndex ? { ...row, ...updates } : row
      )
    );
  };

  const handleDrugSelection = (rowIndex, drugId) => {
    const product = products.find((p) => p.drug_id === parseInt(drugId));
    if (product && product.stocks.length > 0) {
      updateRow(rowIndex, {
        drugId: drugId,
        selectedBatchIndex: "0",
        packOrUnit: "unit",
        quantity: "",
        discount: "",
      });

      // After setting the drug, focus the batch select
      setTimeout(() => {
        const batchSelect = document.querySelector(
          `select[aria-label="Select batch for ${product.drug_name}"]`
        );
        if (batchSelect) {
          batchSelect.focus();
        }
      }, 0);
    } else {
      updateRow(rowIndex, {
        drugId,
        selectedBatchIndex: "",
        packOrUnit: "",
        quantity: "",
        discount: "",
      });
    }
  };

  const handleRemoveFromCart = (product, rowIndex) => {
    const row = rows[rowIndex];
    const selectedBatchIndex = row.selectedBatchIndex;
    const selectedBatch =
      selectedBatchIndex !== "" && product.stocks[selectedBatchIndex]
        ? product.stocks[selectedBatchIndex]
        : null;

    if (!selectedBatch) return;

    dispatch(
      removeFromCart({
        id: product.drug_id,
        batch_no: selectedBatch.batch_no,
        sale_type: row.packOrUnit,
      })
    );

    // Remove the row at rowIndex
    setRows((prevRows) => {
      const updatedRows = prevRows.filter((_, index) => index !== rowIndex);
      // Ensure at least one empty row remains
      if (updatedRows.length === 0) {
        return [
          {
            drugId: null,
            selectedBatchIndex: "",
            packOrUnit: "",
            quantity: "",
            discount: "",
          },
        ];
      }
      return updatedRows;
    });

    // Adjust selectedIndex if necessary
    setSelectedIndex((prev) => {
      if (prev > rowIndex) {
        return prev - 1; // Shift index down if a higher row was removed
      }
      if (prev === rowIndex && prev >= rows.length - 1) {
        return rows.length - 2; // Move to the last row if the selected row was removed
      }
      return prev;
    });

    // Focus the first AsyncSelect
    setTimeout(() => {
      if (searchRefs.current[0]?.current) {
        searchRefs.current[0].current.focus();
        console.log("Focused first AsyncSelect after remove from cart");
      }
    }, 100);
  };

  const handleAddToCart = (product, rowIndex) => {
    const row = rows[rowIndex];
    const selectedBatchIndex = row.selectedBatchIndex;
    const packOrUnit = row.packOrUnit;
    const selectedBatch =
      selectedBatchIndex !== "" && product.stocks[selectedBatchIndex]
        ? product.stocks[selectedBatchIndex]
        : null;

    if (!selectedBatch) {
      Swal.fire({
        icon: "error",
        title: "No Batch Selected",
        text: "Please select a batch.",
        confirmButtonText: "OK",
      });
      return;
    }

    if (!packOrUnit) {
      Swal.fire({
        icon: "error",
        title: "No Pack/Unit Selected",
        text: "Please select pack or unit.",
        confirmButtonText: "OK",
      });
      return;
    }

    const qty = parseInt(row.quantity) || 0;
    if (qty <= 0) {
      Swal.fire({
        icon: "error",
        title: "Invalid Quantity",
        text: "Please enter a valid quantity.",
        confirmButtonText: "OK",
      });
      return;
    }

    const maxQuantity = selectedBatch
      ? calculateAvailableQuantity(selectedBatch, packOrUnit)
      : 0;

    if (qty > maxQuantity) {
      Swal.fire({
        icon: "error",
        title: "Exceeds Stock",
        text: `Quantity cannot exceed available stock (${maxQuantity}).`,
        confirmButtonText: "OK",
      });
      return;
    }

    const mrpPrice =
      packOrUnit === "pack"
        ? selectedBatch.mrp_per_pack || 0
        : selectedBatch.mrp_per_unit || 0;
    const disc = parseFloat(row.discount) || 0;
    const grossAmount = mrpPrice * qty;
    const discountAmount = (grossAmount * disc) / 100;
    const totalPrice = grossAmount - discountAmount;

    // Check if the item already exists in the cart
    const itemExists = cartItems.some(
      (item) =>
        item.id === product.drug_id &&
        item.batch_no === selectedBatch.batch_no &&
        item.sale_type === packOrUnit
    );

    dispatch(
      addToCart({
        id: product.drug_id,
        product_id: product.drug_id,
        name: product.drug_name,
        mrp: mrpPrice,
        exp_date: selectedBatch.expire_date,
        quantity: qty,
        total_price: totalPrice,
        image: product.image,
        discount: disc,
        batch_no: selectedBatch.batch_no,
        stock_id: selectedBatch.id,
        sale_type: packOrUnit,
        type: product.type,
        hsn: product.hsn_code,
        mfg: product.manufacturer_name,
        conversion_id: selectedBatch?.conversion_id,
        cgst: product.cgst,
        sgst: product.sgst,
      })
    );

    // Only add a new row if the item is NOT already in the cart
    if (!itemExists) {
      setRows((prev) => {
        const newRows = [
          ...prev,
          {
            drugId: null,
            selectedBatchIndex: "",
            packOrUnit: "",
            quantity: "",
            discount: "",
          },
        ];
        // Update selectedIndex to the new row
        setSelectedIndex(newRows.length - 1);

        // Ensure searchRefs.current is updated for the new row
        searchRefs.current = newRows.map(
          (_, i) => searchRefs.current[i] || React.createRef()
        );

        // Focus the AsyncSelect of the new row
        setTimeout(() => {
          if (searchRefs.current[newRows.length - 1]?.current) {
            searchRefs.current[newRows.length - 1].current.focus();
            console.log(
              `Focused AsyncSelect for new row at index ${newRows.length - 1}`
            );
          } else {
            console.warn("Failed to focus AsyncSelect: ref not found");
          }
        }, 100);

        return newRows;
      });
    } else {
      // Keep the row's data intact and focus the quantity input for further modifications
      setTimeout(() => {
        const quantityInput = document.querySelector(
          `input[aria-label="Quantity for ${product.drug_name}"]`
        );
        if (quantityInput) {
          quantityInput.focus();
          console.log(`Focused quantity input for row at index ${rowIndex}`);
        } else {
          console.warn("Failed to focus quantity input: input not found");
        }
      }, 100);
    }
  };

  const calculateAvailableQuantity = (stock, packOrUnit) => {
    if (!stock) return 0;
    return packOrUnit === "pack"
      ? stock.pack_quantity || 0
      : stock.unit_quantity || 0;
  };

  return (
    <div
      className="p-4 col-md-12"
      style={{
        width: "100%",
        marginLeft: "0px",
        top: "50px",
        height: "auto",
        overflowY: "auto",
        marginTop: "10px",
        paddingBottom: "10px",
      }}
    >
      <style>{tableStyles}</style>

      {/* Header Section */}
      <div className="mb-4">
        <h2 className="h4">{getGreeting()}</h2>
        <p className="text-muted">
          Welcome back to your store 
        </p>
      </div>

      {/* Product Table */}
      {loading ? (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      ) : (
        <>
          <table
            className="product-table"
            ref={tableRef}
            tabIndex={0}
            role="grid"
            aria-label="Product Table"
          >
            <thead>
              <tr>
                <th scope="col">Product Name</th>
                <th>Price</th>
                <th scope="col">Stock</th>
                <th scope="col">Batch</th>
                <th scope="col">Pack/Unit</th>
                <th scope="col">Quantity</th>
                <th>Discount %</th>
                <th scope="col">Total ₹</th>
                {/* <th scope="col">Actions</th> */}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => {
                const product = row.drugId
                  ? products.find((p) => p.drug_id === row.drugId)
                  : null;
                const selectedBatchIndex = row.selectedBatchIndex;
                const packOrUnit = row.packOrUnit;
                const selectedBatch =
                  selectedBatchIndex !== "" &&
                  product?.stocks[selectedBatchIndex]
                    ? product.stocks[selectedBatchIndex]
                    : null;
                const maxQuantity =
                  packOrUnit === "pack"
                    ? selectedBatch?.pack_quantity || 0
                    : packOrUnit === "unit"
                    ? selectedBatch?.unit_quantity || 0
                    : 0;

                return (
                  <tr
                    key={rowIndex}
                    className={`${
                      selectedIndex === rowIndex ? "selected" : ""
                    } ${
                      product && calculateTotalQuantity(product.stocks) === 0
                        ? "out-of-stock"
                        : ""
                    }`}
                    onClick={() => setSelectedIndex(rowIndex)}
                    role="row"
                    aria-selected={selectedIndex === rowIndex}
                    onKeyDown={(e) => handleKeyDown(e, rowIndex, product)}
                  >
                    <td style={{ position: "relative" }}>
                      {!row.drugId ? (
                        <div className="search-container">
                          <AsyncSelect
                            ref={searchRefs.current[rowIndex]}
                            autoFocus={rowIndex === 0}
                            cacheOptions
                            defaultOptions={products.map((product) => ({
                              value: product.drug_id,
                              label: product.drug_name,
                            }))}
                            loadOptions={loadProductOptions}
                            value={null}
                            onChange={(option) =>
                              handleProductSelect(option, rowIndex)
                            }
                            onKeyDown={(e) => handleSearchKeyDown(e, rowIndex)}
                            placeholder="Search products..."
                            isClearable
                            styles={customSelectStyles}
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            aria-label="Search products"
                          />
                        </div>
                      ) : product ? (
                        <div>
                          {product.drug_name}
                          {Object.values(cartItems).some(
                            (item) => item.id === product.drug_id
                          ) && <CheckCircle className="check-circle" />}
                          <span
                            className="clear-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (
                                product &&
                                cartItems.some(
                                  (item) => item.id === product.drug_id
                                )
                              ) {
                                handleRemoveFromCart(product, rowIndex);
                              } else {
                                handleClearDrug(rowIndex); // Changed from handleClearDrug to just clear the product
                              }
                            }}
                            title="Clear selection"
                          >
                            ✕
                          </span>
                        </div>
                      ) : (
                        <div>
                          Invalid product (ID: {row.drugId})
                          <span
                            className="clear-button"
                            onClick={() => handleClearDrug(rowIndex)}
                            title="Clear selection"
                          >
                            ✕
                          </span>
                        </div>
                      )}
                    </td>

                    <td>
                      ₹
                      {product && packOrUnit === "pack"
                        ? selectedBatch?.mrp_per_pack?.toFixed(2) || "0.00"
                        : product && packOrUnit === "unit"
                        ? selectedBatch?.mrp_per_unit?.toFixed(2) || "0.00"
                        : "0.00"}
                    </td>
                    <td>
                      <span className="stock-badge">
                        <FaShoppingCart style={{ fontSize: "0.8rem" }} />
                        {product && packOrUnit && selectedBatch
                          ? calculateAvailableQuantity(
                              selectedBatch,
                              packOrUnit
                            )
                          : product
                          ? calculateTotalQuantity(product.stocks)
                          : "N/A"}
                      </span>
                    </td>
                    <td>
                      <select
                        value={selectedBatchIndex ?? ""}
                        onChange={(e) =>
                          updateRow(rowIndex, {
                            selectedBatchIndex: e.target.value,
                          })
                        }
                        disabled={
                          !product ||
                          calculateTotalQuantity(product?.stocks) === 0
                        }
                        aria-label={`Select batch for ${
                          product?.drug_name || "product"
                        }`}
                        className={
                          selectedBatch?.about_to_expire
                            ? "about-to-expire"
                            : ""
                        }
                      >
                        <option value="">--Select</option>
                        {product?.stocks?.map((stock, index) => (
                          <option key={index} value={index}>
                            {stock.batch_no} (Exp: {stock.expire_date})
                          </option>
                        ))}
                      </select>
                    </td>

                    <td>
                      <select
                        className="pack-unit-select"
                        value={packOrUnit || ""}
                        onChange={(e) =>
                          updateRow(rowIndex, { packOrUnit: e.target.value })
                        }
                        disabled={
                          !product ||
                          calculateTotalQuantity(product?.stocks) === 0
                        }
                        aria-label={`Select pack or unit for ${
                          product?.drug_name || "product"
                        }`}
                      >
                        <option value="">--Select</option>
                        <option value="pack">Pack</option>
                        <option value="unit">Unit</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        max={maxQuantity}
                        value={row.quantity || ""}
                        onChange={(e) =>
                          handleQuantityChange(
                            rowIndex,
                            e.target.value,
                            maxQuantity
                          )
                        }
                        disabled={
                          !isQuantityInputEnabled(product, row) ||
                          calculateTotalQuantity(product?.stocks) === 0
                        }
                        aria-label={`Quantity for ${
                          product?.drug_name || "product"
                        }`}
                        step="1"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={row.discount || ""}
                        onChange={(e) =>
                          updateRow(rowIndex, { discount: e.target.value })
                        }
                        disabled={
                          !product ||
                          calculateTotalQuantity(product?.stocks) === 0
                        }
                        aria-label={`Discount for ${
                          product?.drug_name || "product"
                        }`}
                      />
                    </td>
                    <td>
                      ₹{product ? calculateTotalPrice(product, row) : "0.00"}
                    </td>
                    {/* <td>
                      <div className="action-buttons">
                        <button
                          className="action-button add-button"
                          onClick={() => handleAddRow(rowIndex)}
                          title="Add new row"
                          aria-label="Add new row"
                        >
                          <FaPlus />
                        </button>
                        <button
                          className="action-button remove-button"
                          onClick={() => {
                            if (
                              product &&
                              cartItems.some(
                                (item) => item.id === product.drug_id
                              )
                            ) {
                              handleRemoveFromCart(product, rowIndex);
                            } else {
                              // This will still remove the entire row
                              setRows((prevRows) => {
                                const updatedRows = prevRows.filter(
                                  (_, index) => index !== rowIndex
                                );
                                if (updatedRows.length === 0) {
                                  return [
                                    {
                                      drugId: null,
                                      selectedBatchIndex: "",
                                      packOrUnit: "",
                                      quantity: "",
                                      discount: "",
                                    },
                                  ];
                                }
                                return updatedRows;
                              });
                            }
                          }}
                          title="Remove row"
                          aria-label="Remove row"
                        >
                          <FaMinus />
                        </button>
                      </div>
                    </td> */}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
