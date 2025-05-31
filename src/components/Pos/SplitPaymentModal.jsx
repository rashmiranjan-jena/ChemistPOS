import React from "react";
import { Modal, Box } from "@mui/material";
import { Close, Add, QrCodeScanner } from "@mui/icons-material";
import "bootstrap/dist/css/bootstrap.min.css";

export default function SplitPaymentModal({
  open,
  onClose,
  totalAmount,
  splitPayments,
  onSplitPaymentChange,
  onRemoveSplitPayment,
  onAddSplitPayment,
  onSubmit,
  calculateSplitRemaining,
  customerDetails, // Added prop
  handleCustomerMobileChange, // Added prop
  handleCustomerChange, // Added prop
  showAllDetails, // Added prop
  setShowAllDetails, // Added prop
  customerTypes, // Added prop
  handleFileUpload, // Added prop
  barcode, // Added prop
  handleBarcodeScan, // Added prop
  isScanning, // Added prop
  handleScanClick, // Added prop
  barcodeInputRef, // Added prop
  mobileInputRef, // Added prop
  nameInputRef, // Added prop
}) {
  return (
    <Modal open={open} onClose={onClose} keepMounted>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
          borderRadius: 2,
          width: "90%",
          maxWidth: 500,
          maxHeight: "90vh",
          overflow: "auto",
        }}
      >
        <div className="sticky-top bg-white p-4 border-bottom">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="h5 fw-bold text-dark">Split Payment</h2>
            <button
              onClick={onClose}
              className="btn-close"
              aria-label="Close"
            ></button>
          </div>
        </div>

        <div className="p-4">
          {/* Customer Details Form */}
          <div className="mb-4">
            <h3 className="h6 fw-medium text-dark mb-3">
              Customer Information
            </h3>
            <div className="mb-3">
              <label className="form-label">Mobile Number (Ctrl+M)</label>
              <input
                ref={mobileInputRef}
                type="text"
                name="contact_number"
                value={customerDetails.contact_number}
                onChange={handleCustomerMobileChange}
                className="form-control form-control-sm"
                placeholder="Enter mobile number"
                maxLength="10"
              />
            </div>
            {showAllDetails && (
              <>
                <div className="mb-3">
                  <label className="form-label">
                    Customer Name (Ctrl+Shift+N)
                  </label>
                  <input
                    ref={nameInputRef}
                    type="text"
                    name="customer_name"
                    value={customerDetails.customer_name}
                    onChange={handleCustomerChange}
                    className="form-control form-control-sm"
                    placeholder="Enter customer name"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Customer Type</label>
                  <select
                    name="customerType"
                    value={customerDetails.customerType}
                    onChange={handleCustomerChange}
                    className="form-select form-select-sm"
                  >
                    <option value="">Select Customer Type</option>
                    {customerTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Prescription Upload</label>
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="form-control form-control-sm"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                </div>
              </>
            )}
            <div className="mb-3">
              <label className="form-label">Barcode</label>
              <input
                ref={barcodeInputRef}
                type="text"
                value={barcode}
                onChange={(e) => handleBarcodeScan(e.target.value)}
                className="form-control form-control-sm"
                placeholder="Scan barcode"
                disabled={!isScanning}
              />
              <button
                onClick={handleScanClick}
                className="btn btn-sm btn-outline-primary mt-2"
              >
                <QrCodeScanner sx={{ fontSize: 16 }} /> Scan
              </button>
            </div>
            <button
              type="button"
              onClick={() => setShowAllDetails(!showAllDetails)}
              className="btn btn-link p-0 text-primary"
            >
              {showAllDetails ? "Hide Details" : "Show More Details"}
            </button>
          </div>

          {/* Split Payment Fields */}
          <div className="card bg-primary text-white mb-4 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-light">Total Amount</span>
                <span className="fs-4 fw-bold">₹{totalAmount}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center small">
                <span className="text-light">
                  {calculateSplitRemaining() < 0 ? "Excess" : "Remaining"}
                </span>
                <span
                  className={`fw-medium fs-4 ${
                    calculateSplitRemaining() < 0 ? "text-danger" : "text-white"
                  }`}
                >
                  ₹{Math.abs(calculateSplitRemaining()).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-4">
            {splitPayments.map((payment, index) => (
              <div key={index} className="card mb-3 shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center gap-2">
                      <div
                        className="rounded-circle bg-light text-primary fw-medium d-flex align-items-center justify-content-center"
                        style={{ width: "32px", height: "32px" }}
                      >
                        <span>{index + 1}</span>
                      </div>
                      <h3 className="h6 fw-medium text-dark mb-0">
                        Payment Method
                      </h3>
                    </div>
                    {index > 0 && (
                      <button
                        onClick={() => onRemoveSplitPayment(index)}
                        className="btn-close"
                        aria-label="Close"
                      ></button>
                    )}
                  </div>
                  <div className="row g-3">
                    <div className="col">
                      <select
                        value={payment.method}
                        onChange={(e) =>
                          onSplitPaymentChange(index, "method", e.target.value)
                        }
                        className="form-select"
                      >
                        <option value="Cash">💵 Cash</option>
                        <option value="Card">💳 Card</option>
                        <option value="upi">📱 UPI</option>
                      </select>
                    </div>
                    <div className="col">
                      <input
                        type="number"
                        inputMode="decimal"
                        value={payment.amount}
                        onChange={(e) =>
                          onSplitPaymentChange(index, "amount", e.target.value)
                        }
                        onBlur={(e) => {
                          const value = e.target.value;
                          if (value) {
                            onSplitPaymentChange(
                              index,
                              "amount",
                              parseFloat(value).toFixed(2)
                            );
                          }
                        }}
                        placeholder="Enter amount"
                        className="form-control"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={onAddSplitPayment}
            className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-2"
          >
            <Add /> Add Another Payment Method
          </button>
        </div>

        <div className="sticky-bottom bg-white p-4 border-top">
          <div className="d-flex justify-content-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSubmit}
              className="btn btn-primary"
              disabled={calculateSplitRemaining() !== "0.00"}
            >
              Place Order
            </button>
          </div>
        </div>
      </Box>
    </Modal>
  );
}
