import React, { useState } from 'react';
import { Modal, Box } from '@mui/material';
import { Close, Phone } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
// import { getExchangeCustomer } from '../../api/apiExchange';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css'; // Add this import if not already included in your project

export default function MobileModelPopup({ open, onClose }) {
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setMobile(value);
      setError(value.length === 10 ? '' : 'Mobile number must be 10 digits');
    }
  };

  const handleVerify = async () => {
    if (mobile.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    // Navigate to receipt details with mobile number
    try {
      const response = await getExchangeCustomer(mobile);
      if (response.status === 200) {
        toast.success("Customer Mobile Number Match", {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          closeButton: false,
          theme: 'light',
        });
        navigate('/customers', { state: mobile });
        onClose();
      }
    } catch (error) {
      toast.error(error.response.data.error || "Customer not found", {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        closeButton: false,
        theme: 'light',
      });
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
        width: '90%',
        maxWidth: 400,
      }}>
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="h5 fw-bold text-dark">Exchange Items</h2>
            <button 
              onClick={onClose}
              className="btn-close"
              aria-label="Close"
            ></button>
          </div>

          <div className="alert alert-info p-3 mb-4">
            <p className="mb-0 small">
              Please enter the mobile number associated with the original purchase to proceed with the exchange.
            </p>
          </div>

          <div className="mb-4">
            <label className="form-label fw-medium text-dark">
              Mobile Number
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <Phone />
              </span>
              <input
                type="tel"
                maxLength="10"
                value={mobile}
                onChange={handleMobileChange}
                className={`form-control ${error ? 'is-invalid' : ''}`}
                placeholder="Enter 10 digit mobile number"
              />
              {error && (
                <div className="invalid-feedback">{error}</div>
              )}
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2 pt-2">
            <button
              onClick={onClose}
              className="btn btn-outline-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleVerify}
              className="btn btn-primary"
              disabled={mobile.length !== 10}
            >
              Verify & Continue
            </button>
          </div>
        </div>
      </Box>
    </Modal>
  );
}