import React, { useState } from "react";
import { Button, Table, Card, CardBody, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { FaEye, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Breadcrumbs from "../../../components/Common/Breadcrumb";

const CancelationDetails = () => {
  const [agentDropdownOpen, setAgentDropdownOpen] = useState({});

  const cancelationDetails = [
    {
      id: 1,
      orderId: "ORD001",
      customerId: "CUST001",
      item: "Samsung Galaxy S24 Ultra",
      reason: "Size issue",
      pickupDate: "2024-06-10",
      status: "PreDispatch",
      cancelationCharges: "$20",
      agentName: "John Doe", // Initial agent name
    },
    {
      id: 2,
      orderId: "ORD002",
      customerId: "CUST002",
      item: "Earphone",
      reason: "Defective item",
      pickupDate: "2024-07-15",
      status: "PostDispatch",
      cancelationCharges: "$15",
      agentName: "Jane Smith", // Initial agent name
    },
  ];

  const toggleAgentDropdown = (id) => {
    setAgentDropdownOpen((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleAgentChange = (id, agentName) => {
    alert(`Order ID: ${id} assigned to agent ${agentName}`);
  };

  return (
    <div className="page-content">
      <Breadcrumbs title="Cancelation Details" breadcrumbItem="All Cancelations" />

      <Card className="shadow">
        <CardBody>
          <div className="d-flex justify-content-between mb-4">
            <h4 className="text-primary">Cancelation Details</h4>
          </div>

          <div className="table-responsive" style={{ maxHeight: "500px", overflowY: "auto" }}>
            <Table bordered hover responsive className="custom-table">
              <thead className="table-light">
                <tr>
                  <th>Sr. No.</th>
                  <th>Order ID</th>
                  <th>Customer ID</th>
                  <th>Item</th>
                  <th>Reason for Cancel</th>
                  <th>Pickup Date</th>
                  <th>Agent Name</th> {/* Agent Name column with dropdown */}
                  <th>Status</th>
                  <th>Cancelation Charges</th>
                </tr>
              </thead>
              <tbody>
                {cancelationDetails.map((detail, index) => (
                  <tr key={detail.id}>
                    <td>{index + 1}</td>
                    <td>{detail.orderId}</td>
                    <td>{detail.customerId}</td>
                    <td>{detail.item}</td>
                    <td>{detail.reason}</td>
                    <td>{detail.pickupDate}</td>
                    <td>
                      <Dropdown
                        isOpen={agentDropdownOpen[detail.id]}
                        toggle={() => toggleAgentDropdown(detail.id)}
                      >
                        <DropdownToggle caret color="secondary">
                          {detail.agentName}
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem onClick={() => handleAgentChange(detail.id, "John Doe")}>
                            John Doe
                          </DropdownItem>
                          <DropdownItem onClick={() => handleAgentChange(detail.id, "Jane Smith")}>
                            Jane Smith
                          </DropdownItem>
                          <DropdownItem onClick={() => handleAgentChange(detail.id, "James Brown")}>
                            James Brown
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </td>
                    <td>{detail.status}</td>
                    <td>{detail.cancelationCharges}</td>
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

export default CancelationDetails;
