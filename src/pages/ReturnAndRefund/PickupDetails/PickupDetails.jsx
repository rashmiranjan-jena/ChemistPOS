import React, { useState } from "react";
import {
  Button,
  Table,
  Card,
  CardBody,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Input,
} from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";

const PickupDetails = () => {
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [pickupDates, setPickupDates] = useState({});
  const [agentSelection, setAgentSelection] = useState({});

  const toggleDropdown = (id) => {
    setDropdownOpen((prevState) => ({ ...prevState, [id]: !prevState[id] }));
  };

  const orders = [
    {
      id: 1,
      orderId: "ORD12345",
      returnId: "RET54321",
      customerId: "CUST001",
      item: "Laptop",
      agentName: "Agent A",
      returnDate: "2025-01-01",
      status: "Pending",
    },
    {
      id: 2,
      orderId: "ORD67890",
      returnId: "RET09876",
      customerId: "CUST002",
      item: "Phone",
      agentName: "Agent B",
      returnDate: "2025-01-02",
      status: "Completed",
    },
  ];

  const agents = ["Agent A", "Agent B", "Agent C", "Agent D"];

  const handlePickupDateChange = (id, date) => {
    setPickupDates((prevDates) => ({ ...prevDates, [id]: date }));
  };

  const handleAgentChange = (id, agentName) => {
    setAgentSelection((prevSelection) => ({ ...prevSelection, [id]: agentName }));
  };

  const handleStatusChange = (id, status) => {
    alert(`Updated Status of Order ${id} to ${status}`);
  };

  return (
    <div className="page-content">
      <Breadcrumbs title="Orders" breadcrumbItem="Pickup Details" />

      <Card className="shadow">
        <CardBody>
          <div className="d-flex justify-content-between mb-4">
            <h4 className="text-primary">Pickup Details</h4>
          </div>

          <div
            className="table-responsive"
            style={{ maxHeight: "500px", overflowY: "auto" }}
          >
            <Table bordered hover responsive className="custom-table">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Order ID</th>
                  <th>Return ID</th>
                  <th>Customer ID</th>
                  <th>Item</th>
                  <th>Agent Name</th>
                  <th>Return Date</th>
                  <th>Pickup Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, idx) => (
                  <tr key={order.id}>
                    <td>{idx + 1}</td>
                    <td>{order.orderId}</td>
                    <td>{order.returnId}</td>
                    <td>{order.customerId}</td>
                    <td>{order.item}</td>
                    <td>
                      <Dropdown
                        isOpen={dropdownOpen[`agent_${order.id}`] || false}
                        toggle={() => toggleDropdown(`agent_${order.id}`)}
                      >
                        <DropdownToggle caret className="btn btn-sm btn-rounded">
                          {agentSelection[order.id] || order.agentName}
                        </DropdownToggle>
                        <DropdownMenu>
                          {agents.map((agent, index) => (
                            <DropdownItem
                              key={index}
                              onClick={() => handleAgentChange(order.id, agent)}
                            >
                              {agent}
                            </DropdownItem>
                          ))}
                        </DropdownMenu>
                      </Dropdown>
                    </td>
                    <td>{order.returnDate}</td>
                    <td>
                      <Input
                        type="date"
                        value={pickupDates[order.id] || ""}
                        onChange={(e) =>
                          handlePickupDateChange(order.id, e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <Dropdown
                        isOpen={dropdownOpen[`status_${order.id}`] || false}
                        toggle={() => toggleDropdown(`status_${order.id}`)}
                      >
                        <DropdownToggle caret className="btn btn-sm btn-rounded">
                          {order.status}
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem
                            onClick={() =>
                              handleStatusChange(order.id, "Pending")
                            }
                          >
                            Pending
                          </DropdownItem>
                          <DropdownItem
                            onClick={() =>
                              handleStatusChange(order.id, "Completed")
                            }
                          >
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

export default PickupDetails;
