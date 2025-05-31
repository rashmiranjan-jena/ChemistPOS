import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input } from 'reactstrap';

const DayClosePopup = ({ show, handleClose, handleSubmit, todayData }) => {
  const [walkInCustomers, setWalkInCustomers] = useState(todayData.walkins || '');

  const onSubmit = (e) => {
    e.preventDefault();
    const id = localStorage.getItem('userId');
    handleSubmit({
    //   ...todayData,
      count: parseInt(walkInCustomers) || 0,
      user_id: id,
    });
  };

  return (
    <Modal isOpen={show} toggle={handleClose} centered size="lg">
      <ModalHeader toggle={handleClose} className="bg-primary text-white">
        Day Close Summary - {new Date().toLocaleDateString()}
      </ModalHeader>
      <Form onSubmit={onSubmit}>
        <ModalBody>
          <div className="row">
            <div className="col-md-6">
              <div className="card mb-3">
                <div className="card-header bg-light">
                  <h5 className="mb-0">Sales Summary</h5>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-sm table-borderless">
                      <tbody>
                        <tr>
                          <td><strong>Total Sales:</strong></td>
                          <td className="text-end">₹{todayData.totalSales?.toFixed(2) || '0.00'}</td>
                        </tr>
                        <tr>
                          <td><strong>Cash Sales:</strong></td>
                          <td className="text-end">₹{todayData.cashSales?.toFixed(2) || '0.00'}</td>
                        </tr>
                        <tr>
                          <td><strong>Card Sales:</strong></td>
                          <td className="text-end">₹{todayData.cardSales?.toFixed(2) || '0.00'}</td>
                        </tr>
                        <tr>
                          <td><strong>UPI Sales:</strong></td>
                          <td className="text-end">₹{todayData.upiSales?.toFixed(2) || '0.00'}</td>
                        </tr>
                        <tr>
                          <td><strong>Credit Sales:</strong></td>
                          <td className="text-end">₹{todayData.creditSales?.toFixed(2) || '0.00'}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
            </div>
            
            <div className="col-md-6">
              <div className="card mb-3">
                <div className="card-header bg-light">
                  <h5 className="mb-0">Transaction Summary</h5>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-sm table-borderless">
                      <tbody>
                        <tr>
                          <td><strong>Total Bills:</strong></td>
                          <td className="text-end">{todayData.totalTransactions || 0}</td>
                        </tr>
                        <tr>
                          <td><strong>Billed Count:</strong></td>
                          <td className="text-end">{todayData.billedCount || 0}</td>
                        </tr>
                        <tr>
                          <td><strong>Unbilled Count:</strong></td>
                          <td className="text-end">{todayData.unbilledCount || 0}</td>
                        </tr>
                        <tr>
                          <td><strong>Cash in Hand:</strong></td>
                          <td className="text-end">₹{todayData.cashInHand?.toFixed(2) || '0.00'}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
              {/* Market Demand Summary Section */}
              {todayData.marketDemandSummary && (
  <div className="card mb-3 border-0 shadow-sm">
    <div className="card-header bg-light d-flex justify-content-between align-items-center">
      <h5 className="mb-0 text-primary">
        <i className="fas fa-chart-line me-2"></i>
        Market Demand Summary
      </h5>
      <span className="badge bg-info rounded-pill">
        <i className="fas fa-info-circle me-1"></i>
        Summary
      </span>
    </div>
    <div className="card-body p-0">
      <div className="table-responsive">
        <table className="table table-hover mb-0">
          <tbody>
            <tr className="border-bottom">
              <td className="ps-4 py-3">
                <div className="d-flex align-items-center">
                  <div className="bg-primary bg-opacity-10 p-2 rounded me-3">
                    <i className="fas fa-boxes text-primary"></i>
                  </div>
                  <div>
                    <strong>Total Quantity Demanded</strong>
                    <div className="text-muted small">All products requested</div>
                  </div>
                </div>
              </td>
              <td className="text-end pe-4 py-3 fw-bold fs-5">
                {todayData.marketDemandSummary?.total_quantity || 0}
              </td>
            </tr>
            <tr className="border-bottom">
              <td className="ps-4 py-3">
                <div className="d-flex align-items-center">
                  <div className="bg-success bg-opacity-10 p-2 rounded me-3">
                    <i className="fas fa-users text-success"></i>
                  </div>
                  <div>
                    <strong>Unique Customers</strong>
                    <div className="text-muted small">Different customers</div>
                  </div>
                </div>
              </td>
              <td className="text-end pe-4 py-3 fw-bold fs-5">
                {todayData.marketDemandSummary?.unique_customers || 0}
              </td>
            </tr>
            <tr>
              <td className="ps-4 py-3">
                <div className="d-flex align-items-center">
                  <div className="bg-warning bg-opacity-10 p-2 rounded me-3">
                    <i className="fas fa-barcode text-warning"></i>
                  </div>
                  <div>
                    <strong>Unique Products</strong>
                    <div className="text-muted small">Different products</div>
                  </div>
                </div>
              </td>
              <td className="text-end pe-4 py-3 fw-bold fs-5">
                {todayData.marketDemandSummary?.unique_products || 0}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div className="card-footer bg-light text-end small">
      <i className="fas fa-clock me-1"></i>
      Updated: {new Date().toLocaleTimeString()}
    </div>
  </div>
)}
          </div>

          <FormGroup>
            <Label for="walkInCustomers"><strong>Walk-in Customers Count</strong></Label>
            <Input
              type="number"
              id="walkInCustomers"
              min="0"
              value={walkInCustomers}
              onChange={(e) => setWalkInCustomers(e.target.value)}
              placeholder="Enter number of walk-in customers"
              required
              readOnly={todayData?.walkins > 0}
            />
          </FormGroup>

          <div className="alert alert-info">
            <i className="fas fa-info-circle me-2"></i>
            Please verify all the amounts before submitting the day close.
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="primary" type="submit" disabled={todayData.status ===true}>
            Submit Day Close
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default DayClosePopup;