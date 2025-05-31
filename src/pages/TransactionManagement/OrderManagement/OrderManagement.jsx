import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  Card,
  CardBody,
  Input,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { FaEye } from "react-icons/fa";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import {
  getAgent,
  getOrder,
  postOrder,
} from "../../../ApiService/TransationManagement/OrderManagement";
import Swal from "sweetalert2";

const OrderManagement = () => {
  document.title = "Order Management";

  const [orders, setOrders] = useState([]);
  const [agents, setAgents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const [assignedAgent, setAssignedAgent] = useState(null);
  const [agentDropdownOpen, setAgentDropdownOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
    fetchAgents();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await getOrder();
      const mappedOrders = response.map((order, index) => ({
        srNo: index + 1,
        orderId: order.order_id,
        customerId: order.customer_id,
        customerName: `${order.customer.first_name} ${order.customer.last_name}`,
        customerContactNo: order.customer.mobile_no || "N/A",
        orderDate: new Date(order.order_date).toLocaleDateString(),
        shippingAddress: {
          street: order.shipping_address.address1,
          city: order.shipping_address.town,
          state: order.shipping_address.state,
          zip: order.shipping_address.pincode,
          country: order.shipping_address.country,
        },
        itemDetails: order.items.map((item) => ({
          ProductName: item.product_name,
          item: item.item_code,
          itemCode: item.item_code_id,
          status: getLatestStatus(item.item_code_id, order.status_history),
        })),
      }));
      setOrders(mappedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchAgents = async () => {
    try {
      const response = await getAgent();
      setAgents(response);
    } catch (error) {
      console.error("Error fetching agents:", error);
    }
  };

  // const handleView = (orderId) => {
  //   alert(`View Order with ID: ${orderId}`);
  // };

  const handlePostData = async () => {
    if (!assignedAgent) {
      Swal.fire({
        title: "Error!",
        text: "Please Assign a agent",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    const selectedOrderItems = selectedItems.map((key) => {
      const [orderId, itemCode] = key.split("-");
      return { orderId, itemCode };
    });

    const payload = {
      agent_Id: assignedAgent,
      order_item_ids: selectedOrderItems.map((item) => item.itemCode),
    };

    try {
      const response = await postOrder(payload);
      console.log("Data posted successfully:", response);
      Swal.fire({
        title: "Success!",
        text: "Task Asign To Agent added successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });

      window.location.href = "/agentwisework";
    } catch (error) {
      console.error("Error posting data:", error);
      Swal.fire({
        title: "Error!",
        text: "Something went wrong while posting data.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      const allItems = orders.flatMap((order) =>
        order.itemDetails.map((item) => `${order.orderId}-${item.itemCode}`)
      );
      setSelectedItems(allItems);
    }
    setSelectAll(!selectAll);
  };

  const getLatestStatus = (itemCodeId, statusHistory) => {
    const itemStatusHistory = statusHistory.filter(
      (history) => history.item_code_id === itemCodeId
    );
    const latestStatus = itemStatusHistory.sort(
      (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
    )[0];

    return latestStatus ? latestStatus.status : "N/A";
  };

  const handleCheckboxChange = (orderId, itemCode) => {
    const key = `${orderId}-${itemCode}`;
    setSelectedItems((prevSelectedItems) => {
      let newSelectedItems;
      if (prevSelectedItems.includes(key)) {
        newSelectedItems = prevSelectedItems.filter((id) => id !== key);
      } else {
        newSelectedItems = [...prevSelectedItems, key];
      }
      setSelectAll(
        newSelectedItems.length ===
          orders.flatMap((order) => order.itemDetails).length
      );
      return newSelectedItems;
    });
  };

  const handleDropdownToggle = (orderId, itemCode) => {
    const key = `${orderId}-${itemCode}`;
    setDropdownOpen((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const handleAgentSelect = (orderId, itemCode, agentId) => {
    setAssignedAgent((prevState) => ({
      ...prevState,
      [`${orderId}-${itemCode}`]: agentId,
    }));
  };

  const filteredOrders = orders.filter((order) =>
    order.shippingAddress.zip.toString().includes(searchTerm)
  );

  return (
    <div className="page-content">
      <Breadcrumbs title="Order Details" breadcrumbItem="All Orders" />
      <Card className="shadow">
        <CardBody>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="text-primary">Order Master</h4>
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Pincode"
              style={{ width: "300px" }}
            />
            <Dropdown
              isOpen={agentDropdownOpen}
              toggle={() => setAgentDropdownOpen(!agentDropdownOpen)}
            >
              <DropdownToggle caret>
                {assignedAgent
                  ? agents.find((agent) => agent.agent_id === assignedAgent)
                      ?.agent_name || "Select Agent"
                  : "Select Agent"}
              </DropdownToggle>
              <DropdownMenu>
                {agents.map((agent) => (
                  <DropdownItem
                    key={agent.id}
                    onClick={() => {
                      setAssignedAgent(agent.agent_id);
                      setAgentDropdownOpen(false);
                    }}
                  >
                    {agent.agent_name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

            <Button color="primary" onClick={handlePostData}>
              Post Selected Orders
            </Button>
          </div>
          <div className="table-responsive" style={{ maxHeight: "500px" }}>
            <Table bordered hover responsive className="custom-table">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>
                    <Input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />
                    Select All
                  </th>
                  <th>Order ID</th>
                  <th>Customer ID</th>
                  <th>Product Name</th>
                  <th>Item Code</th>
                  <th>Customer Name</th>
                  <th>Customer Contact No</th>
                  <th>Order Date</th>
                  <th>Shipping Address</th>
                  <th>Task Status</th>
                  {/* <th>Action</th> */}
                </tr>
              </thead>

              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) =>
                    order.itemDetails.map((item, index) => (
                      <tr key={`${order.orderId}-${index}`}>
                        <td>{index === 0 ? order.srNo : ""}</td>
                        <td>
                          <Input
                            type="checkbox"
                            checked={selectedItems.includes(
                              `${order.orderId}-${item.itemCode}`
                            )}
                            onChange={() =>
                              handleCheckboxChange(order.orderId, item.itemCode)
                            }
                          />
                        </td>
                        <td>{index === 0 ? order.orderId : ""}</td>
                        <td>{index === 0 ? order.customerId : ""}</td>
                        <td>{item.ProductName}</td>
                        <td>{item.item}</td>
                        <td>{index === 0 ? order.customerName : ""}</td>
                        <td>{index === 0 ? order.customerContactNo : ""}</td>

                        {index === 0 && (
                          <td rowSpan={order.itemDetails.length}>
                            {order.orderDate}
                          </td>
                        )}

                        {index === 0 && (
                          <td rowSpan={order.itemDetails.length}>
                            <div>
                              <strong>Street:</strong>{" "}
                              {order.shippingAddress.street}
                            </div>
                            <div>
                              <strong>City:</strong>{" "}
                              {order.shippingAddress.city}
                            </div>
                            <div>
                              <strong>State:</strong>{" "}
                              {order.shippingAddress.state}
                            </div>
                            <div>
                              <strong>Pin:</strong> {order.shippingAddress.zip}
                            </div>
                            <div>
                              <strong>Country:</strong>{" "}
                              {order.shippingAddress.country}
                            </div>
                          </td>
                        )}

                        <td>{item.status || "N/A"}</td>

                        {/* <td>
                          {index === 0 && (
                            <Button
                              color="link"
                              onClick={() => handleView(order.orderId)}
                              className="text-primary"
                            >
                              <FaEye size={20} />
                            </Button>
                          )}
                        </td> */}
                      </tr>
                    ))
                  )
                ) : (
                  <tr>
                    <td
                      colSpan="12"
                      className="text-center"
                    >
                      No order data available.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default OrderManagement;
