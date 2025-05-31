import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  Table,
  Input,
  Button,
} from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import {
  getAgentDetails,
  getAgent,
  updateOrderStatus,
} from "../../../ApiService/TransationManagement/AgentWiseWork";
import Swal from "sweetalert2";

const AgentWiseWork = () => {
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [agentDetails, setAgentDetails] = useState(null);
  const [orderStatus, setOrderStatus] = useState({});

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await getAgent();
        setAgents(response);
      } catch (error) {
        console.error("Error fetching agents:", error);
      }
    };

    fetchAgents();
  }, []);

  const toggleModal = async (agent) => {
    setSelectedAgent(agent);
    setModalOpen(!modalOpen);

    if (agent && agent.agent_id) {
      try {
        const detailsResponse = await getAgentDetails(agent.agent_id);
        setAgentDetails(detailsResponse);

        // Initialize order statuses
        const initialStatus = {};
        detailsResponse.assigned_orders.forEach((order) => {
          initialStatus[order.assignment_id] = order.status;
        });
        setOrderStatus(initialStatus);
      } catch (error) {
        console.error("Error fetching agent details:", error);
        setAgentDetails(null);
      }
    }
  };

  // Handle status change
  const handleStatusChange = (assignmentId, newStatus) => {
    setOrderStatus((prevStatus) => ({
      ...prevStatus,
      [assignmentId]: newStatus,
    }));
  };
  const handleBulkUpdate = async () => {
    const updates = Object.entries(orderStatus).map(
      ([assignmentId, newStatus]) => {
        const orderItem = agentDetails.assigned_orders.find(
          (order) => order.assignment_id === Number(assignmentId)
        );
        console.log(agentDetails);
        return {
          agent_id: agentDetails.agent_id,
          order_item_id: orderItem?.order_item_id,
          status: newStatus,
        };
      }
    );

    try {
      const response = await updateOrderStatus(updates);

      if (response) {
        Swal.fire({
          title: "Success!",
          text: "All order statuses updated successfully.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          setModalOpen(false);
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "Failed to update order statuses.",
          icon: "error",
          confirmButtonText: "Try Again",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: `Error updating order statuses: ${error.message}`,
        icon: "error",
        confirmButtonText: "Close",
      });
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Agent Wise Work"
            breadcrumbItem="Agent Wise Work"
          />

          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
                  <CardTitle tag="h4">Agent Wise Work Details</CardTitle>
                  <p className="card-title-desc mb-4">
                    Click on an agent's card to view assigned items and update
                    status.
                  </p>

                  <Row>
                    {agents.length > 0 ? (
                      agents.map((agent) => (
                        <Col md="4" key={agent.agent_id} className="mb-3">
                          <Card
                            onClick={() => toggleModal(agent)}
                            style={{
                              borderRadius: "10px",
                              padding: "20px",
                              transition:
                                "transform 0.3s ease, box-shadow 0.3s ease",
                              cursor: "pointer",
                              backgroundColor: "#eef2f7",
                              border: "1px solid #d1e3f0",
                            }}
                          >
                            <CardBody
                              style={{
                                padding: "15px",
                                backgroundColor: "#ffffff",
                                borderRadius: "8px",
                              }}
                            >
                              <h5
                                style={{
                                  fontWeight: "600",
                                  color: "#007bff",
                                  fontSize: "18px",
                                  marginTop: "10px",
                                }}
                              >
                                {agent.agent_name}
                              </h5>
                              <p style={{ color: "#6c757d", fontSize: "14px" }}>
                                {agent.address}
                              </p>
                            </CardBody>
                          </Card>
                        </Col>
                      ))
                    ) : (
                      <Col xs="12">
                        <p className="text-center text-muted">
                          No agent data available.
                        </p>
                      </Col>
                    )}
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Modal for agent details */}
      {selectedAgent && (
        <Modal
          isOpen={modalOpen}
          toggle={() => setModalOpen(!modalOpen)}
          size="xl"
        >
          <ModalHeader toggle={() => setModalOpen(!modalOpen)}>
            {selectedAgent.agent_name} - Details
          </ModalHeader>
          <ModalBody>
            {agentDetails && agentDetails.assigned_orders.length > 0 ? (
              <>
                <Table bordered responsive>
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Product</th>
                      <th>Status</th>
                      <th>Assigned At</th>
                      <th>Amount</th>
                      <th>Delivery Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {console.log(agentDetails.assigned_orders)}
                    {agentDetails.assigned_orders.map((order, index) => (
                      <tr key={order.assignment_id}>
                        <td>{index + 1}</td>
                        <td>{order.product_name}</td>
                        <td>
                          <Input
                            type="select"
                            value={orderStatus[order.assignment_id]}
                            onChange={(e) =>
                              handleStatusChange(
                                order.assignment_id,
                                e.target.value
                              )
                            }
                          >
                            <option value={order.status}>{order.status}</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </Input>
                        </td>
                        <td>{new Date(order.assigned_at).toLocaleString()}</td>
                        <td>₹{order.assigned_amount}</td>
                        <td>
                          <strong>{order.delivery_address.full_name}</strong>
                          <br />
                          {order.delivery_address.address1},{" "}
                          {order.delivery_address.address2}
                          <br />
                          {order.delivery_address.town},{" "}
                          {order.delivery_address.district},{" "}
                          {order.delivery_address.state}
                          <br />
                          <strong>Mobile:</strong>{" "}
                          {order.delivery_address.mobile_no}
                          <br />
                          <strong>Pincode:</strong>{" "}
                          {order.delivery_address.pincode}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <Button
                  color="primary"
                  onClick={handleBulkUpdate}
                  className="mt-3"
                >
                  Update All Statuses
                </Button>
              </>
            ) : (
              <p>No assigned orders found for this agent.</p>
            )}
          </ModalBody>
        </Modal>
      )}
    </React.Fragment>
  );
};

export default AgentWiseWork;
