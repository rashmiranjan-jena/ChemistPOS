import React from 'react';
import { CreditCard } from '@mui/icons-material';
import 'bootstrap/dist/css/bootstrap.min.css'; // Add this import if not already included in your project

export default function CardPaymentForm({ 
  cardDetails, 
  isCardNumberSubmitted, 
  onCardNumberChange, 
  onResetCardNumber 
}) {
  return (
    <>
      <div className="card bg-primary text-white mb-4 shadow">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start mb-4">
            <div>
              <p className="small mb-4">Card Payment</p>
              <p className="fw-medium">
                **** **** **** {cardDetails.lastDigits || '____'}
              </p>
            </div>
            <CreditCard />
          </div>
        </div>
      </div>
      <div className="mb-4">
        <label className="form-label fw-medium text-dark">
          Last 4 Digits
        </label>
        <div className="position-relative">
          <input
            type="text"
            maxLength="4"
            pattern="\d{4}"
            value={cardDetails.lastDigits}
            onChange={onCardNumberChange}
            className={`form-control ${isCardNumberSubmitted ? 'bg-light' : ''}`}
            placeholder="Enter last 4 digits"
            required
            disabled={isCardNumberSubmitted}
          />
          {isCardNumberSubmitted && (
            <button
              type="button"
              onClick={onResetCardNumber}
              className="btn btn-link position-absolute end-0 top-50 translate-middle-y text-primary text-decoration-none"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </>
  );
}