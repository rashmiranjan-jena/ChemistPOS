import React from "react";
import { QrCodeScanner } from "@mui/icons-material";

const CustomerDetailsForm = ({
  customerDetails,
  handleCustomerMobileChange,
  handleCustomerChange,
  showAllDetails,
  setShowAllDetails,
  customerTypes,
  handleFileUpload,
  barcode,
  handleBarcodeScan,
  isScanning,
  handleScanClick,
  barcodeInputRef,
  mobileInputRef,
  nameInputRef,
}) => {
  return (
    <div className="compact-form mb-3">
      <div className="row g-2 mb-2 align-items-center">
        <div className="col-md-4">
          <input
            type="tel"
            placeholder="Mobile (Ctrl+M)"
            name="contact_number"
            maxLength={10}
            value={customerDetails.contact_number}
            onChange={handleCustomerMobileChange}
            className="form-control form-control-sm"
            ref={mobileInputRef}
          />
        </div>
        <div className="col-md-4">
          <input
            type="text"
            placeholder="Name"
            name="customer_name"
            value={customerDetails.customer_name}
            onChange={handleCustomerChange}
            className="form-control form-control-sm"
            ref={nameInputRef}
          />
        </div>
        <div className="col-md-4 text-center">
          <button
            className="btn btn-link btn-sm"
            onClick={() => setShowAllDetails(!showAllDetails)}
          >
            {showAllDetails
              ? "Click here to hide all details"
              : "Click here to show all details"}
          </button>
        </div>
      </div>

      {showAllDetails && (
        <>
          <div className="row g-2 mb-2">
            <div className="col-md-4">
              <select
                name="customerType"
                value={customerDetails?.customerType || ""}
                onChange={handleCustomerChange}
                className="form-select form-select-sm"
              >
                {customerTypes.map((type) => (
                  <option value={`${type.id}`} key={type.id}>
                    {type.customer_type}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="row g-2 mb-2">
            <div className="col-md-4">
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={customerDetails.email}
                onChange={handleCustomerChange}
                className="form-control form-control-sm"
              />
            </div>
            <div className="col-md-4">
              <input
                type="text"
                placeholder="GST Number"
                name="gstin"
                value={customerDetails.gstin}
                onChange={handleCustomerChange}
                className="form-control form-control-sm"
              />
            </div>
            <div className="col-md-4">
              <input
                type="text"
                placeholder="ABHA Number"
                name="abha_number"
                value={customerDetails.abha_number}
                onChange={handleCustomerChange}
                className="form-control form-control-sm"
              />
            </div>
          </div>

          <div className="row g-2 mb-2">
            <div className="col-md-6">
              <input
                type="text"
                placeholder="Doctor Name"
                name="doctor_name"
                value={customerDetails.doctor_name}
                onChange={handleCustomerChange}
                className="form-control form-control-sm"
              />
            </div>
            <div className="col-md-6">
              <div className="d-flex align-items-center">
                <input
                  type="file"
                  name="prescription"
                  accept=".pdf, image/*"
                  onChange={handleFileUpload}
                  className="form-control form-control-sm"
                />
              </div>
            </div>
          </div>

          {/* Customer Category Radio Buttons */}
          <div className="d-flex flex-wrap gap-2 mt-2">
            {["B2C", "B2B", "Corporate"].map((category) => (
              <label
                key={category}
                className="d-inline-flex align-items-center px-2 py-1 border rounded bg-light shadow-sm"
                style={{ fontSize: "0.875rem", cursor: "pointer" }}
              >
                <input
                  type="radio"
                  name="customer_category"
                  value={category}
                  checked={customerDetails.customer_category === category}
                  onChange={handleCustomerChange}
                  className="form-check-input me-1"
                  style={{ width: "16px", height: "16px" }}
                />
                {category}
              </label>
            ))}
          </div>
          {/* Barcode Scanner */}
          <div className="input-group input-group-sm mt-2">
            <input
              ref={barcodeInputRef}
              type="text"
              placeholder="Scan Barcode"
              value={barcode}
              onChange={(e) => handleBarcodeScan(e.target.value)}
              className="form-control"
            />
            <button
              className={`btn btn-sm ${
                isScanning ? "btn-success text-white" : "btn-outline-success"
              }`}
              onClick={handleScanClick}
            >
              <QrCodeScanner size={16} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CustomerDetailsForm;
