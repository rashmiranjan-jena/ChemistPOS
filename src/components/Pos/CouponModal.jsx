import React, { useState } from 'react';
import { Modal, Box } from '@mui/material';
import { Close } from '@mui/icons-material';
// import { getCNDetails } from '../../api/apiPos';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css'; // Add this import if not already included in your project

export default function CouponModal({ 
  open, 
  onClose,
  onSubmit,
  subtotal 
}) {
  const [mobile, setMobile] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [creditNotes, setCreditNotes] = useState([]);
  const [selectedCN, setSelectedCN] = useState('');
  const [cnAmount, setCnAmount] = useState(0);

  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setMobile(value);
      setMobileError(value.length === 10 ? '' : 'Mobile number must be 10 digits');
    }
  };

  const handleSubmit = async () => {
    if (mobile.length !== 10) {
      setMobileError('Mobile number must be 10 digits');
      return;
    }

    try {
      const response = await getCNDetails({
        mobile_number: mobile
      });

      if (response.status === 200) {
        const unusedCNs = response.data.filter(cn => !cn.is_used);
        if (unusedCNs.length === 0) {
          toast.info('No available credit notes found');
          return;
        }
        setCreditNotes(unusedCNs);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid mobile number');
    }
  };

  const handleCNSelect = (e) => {
    const cnNumber = e.target.value;
    setSelectedCN(cnNumber);
    const selectedNote = creditNotes.find(cn => cn.cn_number === cnNumber);
    if (selectedNote) {
      const adjustedAmount = Math.min(selectedNote.total_cn_bal, subtotal);
      setCnAmount(adjustedAmount);
      if (selectedNote.total_cn_bal > subtotal) {
        toast.info(`Credit note amount (₹${selectedNote.total_cn_bal}) exceeds bill amount. Adjusted to ₹${adjustedAmount}`);
      }
    }
  };
  
  const handleApplyCN = () => {
    if (!selectedCN || cnAmount <= 0) {
      toast.error('Please select a valid credit note');
      return;
    }
    if (cnAmount > subtotal) {
      toast.error('Credit note amount cannot exceed subtotal');
      return;
    }
    onSubmit({
      amount: cnAmount,
      cnNumber: selectedCN
    });
    onClose();
    setMobile('');
    setCreditNotes([]);
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
            <h2 className="h5 fw-bold text-dark">Get Credit Note</h2>
            <button onClick={onClose} className="btn-close" aria-label="Close"></button>
          </div>

          <div>
            <div className="mb-4">
              <label className="form-label fw-medium text-dark">
                Mobile Number
              </label>
              <div className="d-flex gap-2">
                <input
                  type="tel"
                  maxLength="10"
                  value={mobile}
                  onChange={handleMobileChange}
                  placeholder="Enter 10 digit mobile number"
                  className={`form-control flex-grow-1 ${mobileError ? 'is-invalid' : ''}`}
                />
                <button
                  onClick={handleSubmit}
                  className="btn btn-primary"
                  disabled={!mobile || mobile.length !== 10}
                >
                  Search
                </button>
              </div>
              {mobileError && (
                <div className="invalid-feedback d-block mt-1">{mobileError}</div>
              )}
            </div>

            {creditNotes.length > 0 && (
              <div className="mb-4">
                <label className="form-label fw-medium text-dark">
                  Select Credit Note
                </label>
                <select
                  value={selectedCN}
                  onChange={handleCNSelect}
                  className="form-select"
                >
                  <option value="">Select a credit note</option>
                  {creditNotes.map((cn) => (
                    <option key={cn.cn_number} value={cn.cn_number}>
                      {cn.cn_number} - ₹{cn.total_cn_bal}
                    </option>
                  ))}
                </select>
                {selectedCN && (
                  <p className="mt-2 text-muted small">
                    Amount to be applied: ₹{cnAmount}
                  </p>
                )}
              </div>
            )}

            <div className="d-flex justify-content-end gap-2 pt-2">
              <button
                onClick={onClose}
                className="btn btn-outline-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyCN}
                className="btn btn-primary"
                disabled={!selectedCN || creditNotes.length === 0}
              >
                Apply Credit Note
              </button>
            </div>
          </div>
        </div>
      </Box>
    </Modal>
  );
}