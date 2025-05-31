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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { FaEye, FaEnvelope } from "react-icons/fa"; // Email Icon
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import axios from "axios";
import Swal from "sweetalert2"; // SweetAlert2 for success message

const RefundDetails = () => {
  const [orders, setOrders] = useState([
    {
      srNo: 1,
      orderId: "ORD001",
      customerId: "CUST001",
      cancelationId: "CAN001",
      reasonForRefund: "Damaged product",
      refundDate: "2024-12-01",
      qualityCheckStatus: "Failed",
      refundAmount: "$50",
      approvalStatus: "Pending",
      modeOfPayment: "Gateway",
    },
    {
      srNo: 2,
      orderId: "ORD002",
      customerId: "CUST002",
      cancelationId: "CAN002",
      reasonForRefund: "Wrong item delivered",
      refundDate: "2024-12-02",
      qualityCheckStatus: "Passed",
      refundAmount: "$30",
      approvalStatus: "Approved",
      modeOfPayment: "Manual",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [bankDetails, setBankDetails] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);

  const toggleDropdown = (orderId) => {
    setDropdownOpen((prevState) => ({
      ...prevState,
      [orderId]: !prevState[orderId],
    }));
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const fetchBankDetails = async (customerId) => {
    try {
      const response = await fetch(
        `https://example.com/api/get-bank-details?customerId=${customerId}`
      );
      const data = await response.json();
      setBankDetails(data);
    } catch (error) {
      console.error("Error fetching bank details:", error);
    }
  };

  const handleStatusChange = (orderId, field, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.orderId === orderId ? { ...order, [field]: newStatus } : order
      )
    );

    if (field === "modeOfPayment" && newStatus === "Manual") {
      const customerId = orders.find((order) => order.orderId === orderId)
        ?.customerId;
      setSelectedCustomerId(customerId);
      fetchBankDetails(customerId);
      toggleModal();
    }
  };

  const handleFileChange = (event) => {
    setUploadedImage(event.target.files[0]);
  };

  const handleModalSubmit = () => {
    console.log("Uploaded Image:", uploadedImage);
    console.log("Bank Details:", bankDetails);
    // Submit the data to the server
    toggleModal();
  };

  const handleSendEmail = async () => {
    if (!uploadedImage) {
      Swal.fire("Error", "Please upload an image before sending.", "error");
      return;
    }

    const formData = new FormData();
    formData.append("image", uploadedImage);
    formData.append("customerId", selectedCustomerId); // Add any additional data here

    try {
      const response = await axios.post(
        "https://example.com/api/send-email",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        Swal.fire("Success", "Email sent successfully!", "success");
      } else {
        Swal.fire("Error", "There was an issue sending the email.", "error");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      Swal.fire("Error", "There was an issue sending the email.", "error");
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.cancelationId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-content">
      <Breadcrumbs title="Refund Details" breadcrumbItem="All Refunds" />
      <Card className="shadow">
        <CardBody>
          <div className="d-flex justify-content-between mb-4">
            <h4 className="text-primary">Refund Master</h4>
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by order ID, customer ID, or cancelation ID"
              style={{ width: "300px" }}
            />
          </div>

          <div className="table-responsive" style={{ maxHeight: "500px" }}>
            <Table bordered hover responsive className="custom-table">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Order ID</th>
                  <th>Customer ID</th>
                  <th>Cancelation ID</th>
                  <th>Reason for Refund</th>
                  <th>Refund Date</th>
                  <th>Quality Check Status</th>
                  <th>Refund Amount</th>
                  <th>Approval Status</th>
                  <th>Mode of Payment</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.srNo}>
                    <td>{order.srNo}</td>
                    <td>{order.orderId}</td>
                    <td>{order.customerId}</td>
                    <td>{order.cancelationId}</td>
                    <td>{order.reasonForRefund}</td>
                    <td>{order.refundDate}</td>
                    <td>
                      <Dropdown
                        isOpen={dropdownOpen[order.orderId + "qc"] || false}
                        toggle={() => toggleDropdown(order.orderId + "qc")}
                      >
                        <DropdownToggle
                          caret
                          color="primary"
                          className="btn-sm btn-rounded"
                        >
                          {order.qualityCheckStatus}
                        </DropdownToggle>
                        <DropdownMenu>
                          {["Passed", "Failed"].map((status) => (
                            <DropdownItem
                              key={status}
                              onClick={() =>
                                handleStatusChange(
                                  order.orderId,
                                  "qualityCheckStatus",
                                  status
                                )
                              }
                            >
                              {status}
                            </DropdownItem>
                          ))}
                        </DropdownMenu>
                      </Dropdown>
                    </td>
                    <td>{order.refundAmount}</td>
                    <td>
                      <Dropdown
                        isOpen={dropdownOpen[order.orderId + "approval"] || false}
                        toggle={() => toggleDropdown(order.orderId + "approval")}
                      >
                        <DropdownToggle
                          caret
                          color="primary"
                          className="btn-sm btn-rounded"
                        >
                          {order.approvalStatus}
                        </DropdownToggle>
                        <DropdownMenu>
                          {["Pending", "Approved", "Rejected"].map((status) => (
                            <DropdownItem
                              key={status}
                              onClick={() =>
                                handleStatusChange(
                                  order.orderId,
                                  "approvalStatus",
                                  status
                                )
                              }
                            >
                              {status}
                            </DropdownItem>
                          ))}
                        </DropdownMenu>
                      </Dropdown>
                    </td>
                    <td>
                      <Dropdown
                        isOpen={dropdownOpen[order.orderId + "mode"] || false}
                        toggle={() => toggleDropdown(order.orderId + "mode")}
                      >
                        <DropdownToggle
                          caret
                          color="primary"
                          className="btn-sm btn-rounded"
                        >
                          {order.modeOfPayment}
                        </DropdownToggle>
                        <DropdownMenu>
                          {["Gateway", "Manual"].map((mode) => (
                            <DropdownItem
                              key={mode}
                              onClick={() =>
                                handleStatusChange(
                                  order.orderId,
                                  "modeOfPayment",
                                  mode
                                )
                              }
                            >
                              {mode}
                            </DropdownItem>
                          ))}
                        </DropdownMenu>
                      </Dropdown>
                    </td>
                    <td>
                      <Button
                        color="link"
                        className="text-primary"
                        onClick={() => alert(`View Order with ID: ${order.orderId}`)}
                      >
                        <FaEye size={20} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </CardBody>
      </Card>

      <Modal isOpen={modalOpen} toggle={toggleModal}>
  <ModalHeader toggle={toggleModal}>
    <div className="d-flex justify-content-between w-100">
      <span>Manual Payment Details</span>
    </div>
  </ModalHeader>
  <ModalBody>
    {bankDetails ? (
      <>
        <p>Bank Name: {bankDetails.bankName}</p>
        <p>Account Number: {bankDetails.accountNumber}</p>
        <p>IFSC Code: {bankDetails.ifsc}</p>
      </>
    ) : (
      <p>Loading bank details...</p>
    )}
    <Input type="file" onChange={handleFileChange} />
  </ModalBody>
  <ModalFooter>
    <div className="d-flex justify-content-between align-items-center w-100">
      <Button
        color="link"
        className="p-0"
        style={{ fontSize: "1.5rem", color: "blue" }}
        onClick={handleSendEmail}
      >
        <FaEnvelope />
      </Button>
      <span style={{ marginRight:"370px" }}>Send Mail</span> {/* Positioning the text */}
    </div>
    <Button color="primary" onClick={handleModalSubmit}>
      Submit
    </Button>
    <Button color="secondary" onClick={toggleModal}>
      Cancel
    </Button>
  </ModalFooter>
</Modal>

    </div>
  );
};

export default RefundDetails;
