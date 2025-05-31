import React, { useState } from "react";
import { Table, Card, CardBody, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";

const ReturnOrExchange = () => {
  const [qualityCheckDropdownOpen, setQualityCheckDropdownOpen] = useState({});
  const [returnStatusDropdownOpen, setReturnStatusDropdownOpen] = useState({});
  const [returnsOrExchanges, setReturnsOrExchanges] = useState([
    {
      id: 1,
      orderId: "ORD001",
      customerId: "CUST001",
      item: "Samsung Galaxy S24 Ultra",
      reason: "Size issue",
      pickupDate: "2024-06-10",
      qualityCheck: "Pass",
      returnStatus: "Scheduled",
    },
    {
      id: 2,
      orderId: "ORD002",
      customerId: "CUST002",
      item: "Earphone",
      reason: "Defective item",
      pickupDate: "2024-07-15",
      qualityCheck: "Fail",
      returnStatus: "InProgress",
    },
  ]);

  const toggleQualityCheckDropdown = (id) => {
    setQualityCheckDropdownOpen((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const toggleReturnStatusDropdown = (id) => {
    setReturnStatusDropdownOpen((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleStatusChange = (id, type, status) => {
    alert(`Deal ID: ${id} ${type} changed to ${status}`);
  };

  const handlePickupDateChange = (id, newDate) => {
    setReturnsOrExchanges((prevReturns) =>
      prevReturns.map((exchange) =>
        exchange.id === id ? { ...exchange, pickupDate: newDate } : exchange
      )
    );
  };

  return (
    <div className="page-content">
      <Breadcrumbs title="Returns & Exchanges" breadcrumbItem="All Returns & Exchanges" />

      <Card className="shadow">
        <CardBody>
          <div className="d-flex justify-content-between mb-4">
            <h4 className="text-primary">Returns and Exchanges</h4>
          </div>

          <div className="table-responsive" style={{ maxHeight: "500px", overflowY: "auto" }}>
            <Table bordered hover responsive className="custom-table">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Order ID</th>
                  <th>Customer ID</th>
                  <th>Item</th>
                  <th>Reason for Exchange or Return</th>
                  <th>Pickup Date</th>
                  <th>Quality Check</th>
                  <th>Return Status</th>
                </tr>
              </thead>
              <tbody>
                {returnsOrExchanges.map((exchange, index) => (
                  <tr key={exchange.id}>
                    <td>{index + 1}</td>
                    <td>{exchange.orderId}</td>
                    <td>{exchange.customerId}</td>
                    <td>{exchange.item}</td>
                    <td>{exchange.reason}</td>
                    <td>
                      <input
                        type="date"
                        className="form-control"
                        value={exchange.pickupDate}
                        onChange={(e) => handlePickupDateChange(exchange.id, e.target.value)}
                      />
                    </td>
                    <td>
                      <Dropdown
                        isOpen={qualityCheckDropdownOpen[exchange.id]}
                        toggle={() => toggleQualityCheckDropdown(exchange.id)}
                      >
                        <DropdownToggle caret color="secondary">
                          {exchange.qualityCheck}
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem onClick={() => handleStatusChange(exchange.id, "QualityCheck", "Pass")}>
                            Pass
                          </DropdownItem>
                          <DropdownItem onClick={() => handleStatusChange(exchange.id, "QualityCheck", "Fail")}>
                            Fail
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </td>
                    <td>
                      <Dropdown
                        isOpen={returnStatusDropdownOpen[exchange.id]}
                        toggle={() => toggleReturnStatusDropdown(exchange.id)}
                      >
                        <DropdownToggle caret color="secondary">
                          {exchange.returnStatus}
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem onClick={() => handleStatusChange(exchange.id, "ReturnStatus", "Scheduled")}>
                            Scheduled
                          </DropdownItem>
                          <DropdownItem onClick={() => handleStatusChange(exchange.id, "ReturnStatus", "InProgress")}>
                            InProgress
                          </DropdownItem>
                          <DropdownItem onClick={() => handleStatusChange(exchange.id, "ReturnStatus", "Completed")}>
                            Completed
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default ReturnOrExchange;
