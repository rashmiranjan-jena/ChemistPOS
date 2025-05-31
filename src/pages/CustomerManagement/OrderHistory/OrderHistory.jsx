import React, { useState, useEffect } from "react";
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
} from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import {
  getOrderHistory,
  updateOrderStatus,
} from "../../../ApiService/CustomerManagement/OrderHistory";
import Swal from "sweetalert2";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrderHis = async () => {
      try {
        const res = await getOrderHistory();
        setOrders(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOrderHis();
  }, []);

  // Handle status dropdown toggle
  const toggleDropdown = (orderId) => {
    setDropdownOpen((prevState) => (prevState === orderId ? null : orderId));
  };

  // Handle status update
  const handleStatusChange = async (orderId, itemCodeId, newStatus) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: `Do you want to change the order status to "${newStatus}"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, update it!",
      });

      if (result.isConfirmed) {
        const response = await updateOrderStatus(
          orderId,
          itemCodeId,
          newStatus
        );

        const message =
          response?.message || "Order status updated successfully!";

        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.order_id === orderId
              ? {
                  ...order,
                  status_history: [
                    ...order.status_history,
                    { status: newStatus, item_code_id: itemCodeId },
                  ],
                }
              : order
          )
        );

        setDropdownOpen(null);

        Swal.fire("Updated!", message, "success");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      Swal.fire(
        "Error!",
        "There was an issue updating the status. Please try again.",
        "error"
      );
    }
  };

  // Filter orders based on search query
  const filteredOrders = orders.filter((order) => {
    const lowerSearchQuery = searchQuery.toLowerCase();

    return (
      order.order_id.toLowerCase().includes(lowerSearchQuery) ||
      (order.invoice_no &&
        order.invoice_no.toLowerCase().includes(lowerSearchQuery)) ||
      new Date(order.order_date)
        .toLocaleDateString()
        .includes(lowerSearchQuery) ||
      new Date(order.expected_delivery_date)
        .toLocaleDateString()
        .includes(lowerSearchQuery) ||
      order.total_amount.toString().includes(lowerSearchQuery) ||
      (order.payment_status &&
        order.payment_status.toString().includes(lowerSearchQuery)) ||
      (order.customer &&
        `${order.customer.first_name} ${order.customer.last_name}`
          .toLowerCase()
          .includes(lowerSearchQuery)) ||
      (order.shipping_address &&
        `${order.shipping_address.address1}, ${order.shipping_address.town}, ${order.shipping_address.state} (${order.shipping_address.pincode})`
          .toLowerCase()
          .includes(lowerSearchQuery))
    );
  });

  // Handle opening the modal
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  return (
    <div className="page-content">
      <Breadcrumbs title="Order History" breadcrumbItem="All Orders" />

      <Card className="shadow">
        <CardBody>
          <div className="d-flex justify-content-between mb-4">
            <h4 className="text-primary">Order History</h4>

            {/* Search Input */}
            <Input
              type="text"
              placeholder="Search by Order ID...."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-50"
            />
          </div>

          <div className="table-responsive" style={{ maxHeight: "400px" }}>
            <Table bordered hover responsive className="custom-table">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Order ID</th>
                  <th>Invoice No</th>
                  <th>Order Date</th>
                  <th>Expected Delivery Date</th>
                  <th>Total Amount</th>
                  <th>Payment Status</th>
                  <th>Customer Name</th>
                  <th>Shipping Address</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders?.length > 0 ? (
                  filteredOrders?.map((order, index) => (
                    <tr key={order.order_id}>
                      <td>{index + 1}</td>
                      <td>{order.order_id || "N/A"}</td>
                      <td>{order.invoice_no || "N/A"}</td>
                      <td>
                        {new Date(order.order_date).toLocaleDateString() ||
                          "N/A"}
                      </td>
                      <td>
                        {new Date(
                          order.expected_delivery_date
                        ).toLocaleDateString() || "N/A"}
                      </td>
                      <td>{order.total_amount || "N/A"}</td>
                      <td>
                        {order.payment_status == true ||
                        order.payment_status == "true" ? (
                          <FaCheckCircle color="green" size={20} />
                        ) : (
                          <FaTimesCircle color="red" size={20} />
                        )}
                      </td>

                      <td>
                        {order.customer
                          ? `${order.customer.first_name} ${order.customer.last_name}`
                          : "N/A"}
                      </td>
                      <td>
                        {`${order.shipping_address.address1}, ${order.shipping_address.town}, ${order.shipping_address.state} (${order.shipping_address.pincode})`}
                      </td>
                      <td>
                        <Dropdown
                          isOpen={dropdownOpen === order.order_id}
                          toggle={() => toggleDropdown(order.order_id)}
                        >
                          <DropdownToggle
                            caret
                            className="btn btn-white btn-sm btn-rounded"
                          >
                            {order.status_history[
                              order.status_history.length - 1
                            ]?.status || "Pending"}
                          </DropdownToggle>
                          <DropdownMenu>
                            {[
                              "Ready for Shipment",
                              "Shipped",
                              "In-Transit",
                              "Out for Delivery",
                              "Delivered",
                            ].map((status) => (
                              <DropdownItem
                                key={status}
                                onClick={() =>
                                  handleStatusChange(
                                    order.order_id,
                                    order.items[0]?.item_code_id,
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
                        <Button
                          color="primary"
                          size="sm"
                          onClick={() => handleViewDetails(order)}
                        >
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="text-center">
                      No Orders Found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </CardBody>
      </Card>

      {/* Modal to show product details */}
      <Modal isOpen={isModalOpen} toggle={handleCloseModal} size="lg">
        <ModalHeader toggle={handleCloseModal}>
          Order Id # - {selectedOrder?.order_id}
        </ModalHeader>
        <ModalBody>
          {selectedOrder?.items?.length > 0 ? (
            selectedOrder.items.map((item, index) => (
              <div key={index} className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="text-primary">{item.product_name}</h5>
                  <p className="text-success font-weight-bold">
                    Rs {item.selling_price}
                  </p>
                </div>

                <p className="font-weight-semibold mb-2">Variants:</p>
                <ul className="pl-4 mb-3">
                  {item.variants?.map((variant, idx) => (
                    <li key={idx} className="mb-1">
                      <strong>{variant.variant_name}:</strong> {variant.code}
                    </li>
                  ))}
                </ul>

                <div className="d-flex justify-content-between">
                  <p className="text-muted">Quantity: {item.order_quantity}</p>
                  <p className="text-muted">SKU: {item.sku_code}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No items found in this order.</p>
          )}
        </ModalBody>
      </Modal>
    </div>
  );
};

export default OrderHistory;
