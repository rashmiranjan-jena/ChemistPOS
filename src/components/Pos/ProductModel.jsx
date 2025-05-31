import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { addToCart } from "../../store/cart/cartSlice";
import Swal from "sweetalert2";

export default function ProductModel({ selectedProduct, show, onClose }) {
  const [packOrUnit, setPackOrUnit] = useState("");
  const [selectedBatchIndex, setSelectedBatchIndex] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [discount, setDiscount] = useState("");
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart?.cartItems || []);

  if (!show || !selectedProduct) return null;

  const selectedBatch =
    selectedBatchIndex !== null
      ? selectedProduct.stocks[selectedBatchIndex]
      : null;
  const maxQuantity =
    packOrUnit === "pack"
      ? selectedBatch?.pack_quantity ?? 0
      : packOrUnit === "unit"
      ? selectedBatch?.unit_quantity ?? 0
      : 0;
  const calculateTotalPrice = () => {
    if (!selectedBatch) return 0;

    const mrpPrice =
      packOrUnit === "pack"
        ? selectedBatch.mrp_per_pack || 0
        : selectedBatch.mrp_per_unit || 0;
    const qty = parseInt(quantity) || 0;
    const discPercent = parseFloat(discount) || 0;

    const grossAmount = mrpPrice * qty;
    const discountAmount = (grossAmount * discPercent) / 100;
    const total = grossAmount - discountAmount;

    return total.toFixed(2);
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (value === "") {
      setQuantity("");
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

    setQuantity(parsedValue.toString());
  };

  const isQuantityInputEnabled = () => {
    if (!selectedBatch || !packOrUnit) return false;
    if (packOrUnit === "pack") {
      return (selectedBatch.pack_quantity ?? 0) >= 1;
    }
    return true;
  };

  const handleAddToCart = () => {
    if (!selectedBatch) {
      Swal.fire({
        icon: "error",
        title: "No Batch Selected",
        text: "Please select a batch.",
        confirmButtonText: "OK",
      });
      return;
    }

    const qty = parseInt(quantity) || 0;
    if (qty <= 0) {
      Swal.fire({
        icon: "error",
        title: "Invalid Quantity",
        text: "Please enter a valid quantity.",
        confirmButtonText: "OK",
      });
      return;
    }

    if (qty > maxQuantity) {
      Swal.fire({
        icon: "error",
        title: "Exceeds Stock",
        text: `Quantity cannot exceed available stock (${maxQuantity}).`,
        confirmButtonText: "OK",
      });
      return;
    }

    const itemExists = Object.values(cartItems).some(
      (item) =>
        item.id === selectedProduct.drug_id &&
        item.batch_no === selectedBatch.batch_no
    );

    if (itemExists) {
      Swal.fire({
        icon: "error",
        title: "Item Already in Cart",
        text: "This product with the same batch number is already in the cart.",
        confirmButtonText: "OK",
      });
      return;
    }

    const disc = parseFloat(discount) || 0;
    const mrpPrice =
      packOrUnit === "pack"
        ? selectedBatch.mrp_per_pack || 0
        : selectedBatch.mrp_per_unit || 0;
    const grossAmount = mrpPrice * qty;
    const discountAmount = (grossAmount * disc) / 100;
    const totalPrice = grossAmount - discountAmount;

    dispatch(
      addToCart({
        id: selectedProduct.drug_id,
        product_id: selectedProduct.drug_id,
        name: selectedProduct.drug_name,
        mrp: mrpPrice,
        exp_date: selectedBatch.expire_date,
        quantity: qty,
        total_price: totalPrice,
        image: selectedProduct.image,
        discount: disc,
        batch_no: selectedBatch.batch_no,
        stock_id: selectedBatch.id,
        sale_type: packOrUnit,
        type: selectedProduct.type,
        hsn: selectedProduct.hsn_code,
        mfg: selectedProduct?.manufacturer_name,
        conversion_id: selectedBatch.conversion_id,
        cgst: selectedProduct.cgst,
        sgst: selectedProduct.sgst,
      })
    );
    // Swal.fire({
    //   icon: "success",
    //   title: "Success",
    //   text: "Product added to cart!",
    //   confirmButtonText: "OK",
    // }).then(() => {
    //   onClose();
    // });
    onClose();
  };

  return (
    <div
      className="modal fade show d-flex mt-5"
      style={{ display: "block", zIndex: 1050 }}
      id="productModal"
      tabIndex="-1"
      aria-labelledby="productModalLabel"
      aria-hidden="false"
    >
      <div className="modal-backdrop fade show" style={{ zIndex: 1040 }}></div>

      <div className="modal-dialog modal-lg" style={{ zIndex: 1051 }}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="productModalLabel">
              {selectedProduct?.drug_name || "Product"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label htmlFor="packOrUnit" className="form-label">
                Select Pack or Unit
              </label>
              <select
                id="packOrUnit"
                className="form-select"
                value={packOrUnit}
                onChange={(e) => setPackOrUnit(e.target.value)}
              >
                <option value="">-- Select --</option>
                <option value="pack">Pack</option>
                <option value="unit">Unit</option>
              </select>
            </div>

            {packOrUnit && (
              <div className="table-responsive">
                <table className="table table-bordered align-middle text-center">
                  <thead className="table-light">
                    <tr>
                      <th>Batch No</th>
                      <th>Qty</th>
                      <th>Expiry</th>
                      <th>MRP</th>
                      <th>Add Qty</th>
                      <th>Discount %</th>
                      <th>Total ₹</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <select
                          id="batchSelect"
                          className="form-select"
                          value={selectedBatchIndex ?? ""}
                          onChange={(e) =>
                            setSelectedBatchIndex(e.target.value)
                          }
                        >
                          <option value="">--Select--</option>
                          {selectedProduct?.stocks?.map((stock, index) => (
                            <option key={index} value={index}>
                              {stock.batch_no || "N/A"}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className={`${selectedBatch?.about_to_expire === true? " text-warning" : ""}`}>
                        {packOrUnit === "pack"
                          ? selectedBatch?.pack_quantity ?? 0
                          : packOrUnit === "unit"
                          ? selectedBatch?.unit_quantity ?? 0
                          : 0}
                      </td>
                      <td className={`${selectedBatch?.about_to_expire === true? " text-warning" : ""}`}>{selectedBatch?.expire_date || "N/A"}</td>
                      {/* Updated MRP column */}
                      <td>
                        ₹
                        {packOrUnit === "pack"
                          ? selectedBatch?.mrp_per_pack?.toFixed(2) || "0.00"
                          : packOrUnit === "unit"
                          ? selectedBatch?.mrp_per_unit?.toFixed(2) || "0.00"
                          : "0.00"}
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Qty"
                          value={quantity}
                          onChange={handleQuantityChange}
                          min="1"
                          max={maxQuantity}
                          disabled={!isQuantityInputEnabled()}
                          step="1"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Discount"
                          value={discount}
                          onChange={(e) => setDiscount(e.target.value)}
                          min="0"
                          step="0.01"
                        />
                      </td>
                      <td>₹{calculateTotalPrice()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleAddToCart}
              disabled={!selectedBatch}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
