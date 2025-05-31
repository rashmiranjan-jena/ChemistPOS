import React from "react";
import { Modal, Box } from "@mui/material";
import { Close } from "@mui/icons-material";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap CSS is included
import CustomerDetailsForm from "./CustomerDetailsForm"; // Import the CustomerDetailsForm component

export default function HoldOrderModal({
  open,
  onClose,
  totalAmount,
  orderReference,
  onOrderReferenceChange,
  onConfirmHold,
  customerDetails, // Add customerDetails prop
  handleCustomerMobileChange, // Add handler for mobile change
  handleCustomerChange, // Add handler for other customer field changes
  showAllDetails, // Add showAllDetails prop
  setShowAllDetails, // Add setter for showAllDetails
  customerTypes, // Add customerTypes prop for dropdown
  handleFileUpload, // Add handler for file upload
  barcode, // Add barcode prop
  handleBarcodeScan, // Add handler for barcode scanning
  isScanning, // Add isScanning prop
  handleScanClick, // Add handler for scan click
  barcodeInputRef, // Add ref for barcode input
  mobileInputRef, // Add ref for mobile input
  nameInputRef, // Add ref for name input
}) {
  return (
    <Modal open={open} onClose={onClose}>
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
          maxWidth: 500, // Increased width to accommodate customer details
        }}
      >
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="h5 fw-bold text-dark">Hold Order</h2>
            <button
              onClick={onClose}
              className="btn-close"
              aria-label="Close"
            ></button>
          </div>

          {/* Customer Details Form */}
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

          {/* Grand Total */}
          <div className="card bg-light p-3 mb-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted">Grand Total:</span>
              <span className="fs-4 fw-bold text-dark">₹{totalAmount}</span>
            </div>
          </div>

          {/* Order Reference */}
          <div className="mb-4">
            <label className="form-label fw-medium text-dark">
              Order Reference
            </label>
            <input
              type="text"
              value={orderReference}
              onChange={(e) => onOrderReferenceChange(e.target.value)}
              placeholder="Enter a reference for this order"
              className="form-control"
            />
          </div>

          {/* Alert Message */}
          <div className="alert alert-warning" role="alert">
            <p className="mb-0 small">
              The current order will be set on hold. You can retrieve this order
              from the pending order button. Providing a reference to it might
              help you to identify the order more quickly.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="d-flex justify-content-end gap-2 pt-2">
            <button onClick={onClose} className="btn btn-outline-secondary">
              Cancel
            </button>
            <button onClick={onConfirmHold} className="btn btn-primary">
              Confirm Hold
            </button>
          </div>
        </div>
      </Box>
    </Modal>
  );
}
