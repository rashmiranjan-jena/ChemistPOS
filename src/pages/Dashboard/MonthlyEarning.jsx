import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import { FaUserTie, FaPhoneAlt } from "react-icons/fa";

const MonthlyEarning = () => {
  const allAgents = [
    {
      id: 1,
      name: "John Doe",
      phone: "+1 123-456-7890",
      email: "john.doe@example.com",
      location: "New York, USA",
    },
    {
      id: 2,
      name: "Alice Smith",
      phone: "+1 987-654-3210",
      email: "alice.smith@example.com",
      location: "Los Angeles, USA",
    },
    {
      id: 3,
      name: "Robert Johnson",
      phone: "+1 555-666-7777",
      email: "robert.j@example.com",
      location: "Chicago, USA",
    },
    {
      id: 4,
      name: "Emily Davis",
      phone: "+1 444-555-6666",
      email: "emily.d@example.com",
      location: "Houston, USA",
    },
    {
      id: 5,
      name: "Michael Brown",
      phone: "+1 222-333-4444",
      email: "michael.b@example.com",
      location: "San Francisco, USA",
    },
    {
      id: 6,
      name: "Sophia Wilson",
      phone: "+1 777-888-9999",
      email: "sophia.w@example.com",
      location: "Seattle, USA",
    },
  ];

  const [visibleAgents, setVisibleAgents] = useState(3);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Show all agents when clicking "View More"
  const showMoreAgents = () => setVisibleAgents(allAgents.length);

  // Reset to 3 agents when clicking "Show Less"
  const showLessAgents = () => setVisibleAgents(3);

  // Open modal with agent details
  const viewDetails = (agent) => {
    setSelectedAgent(agent);
    setModalOpen(true);
  };

  return (
    <Card className="shadow">
      <CardBody>
        <CardTitle className="mb-4 text-center">Delivery Agents</CardTitle>
        <Row className="justify-content-center">
          {allAgents.slice(0, visibleAgents).map((agent) => (
            <Col md={6} lg={4} key={agent.id} className="mb-3">
              <Card className="shadow-sm p-3 d-flex flex-column align-items-center text-center">
                <FaUserTie size={40} className="text-primary mb-2" />
                <h5 className="mb-1">{agent.name}</h5>
                <p className="text-muted mb-2 d-flex align-items-center">
                  <FaPhoneAlt className="me-2 text-success" />
                  {agent.phone}
                </p>
                <Button
                  color="primary"
                  size="sm"
                  onClick={() => viewDetails(agent)}
                >
                  View Details
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
        <div className="text-center mt-3">
          {visibleAgents < allAgents.length ? (
            <Button color="secondary" onClick={showMoreAgents} className="me-2">
              View More
            </Button>
          ) : (
            <Button color="danger" onClick={showLessAgents}>
              Show Less
            </Button>
          )}
        </div>
      </CardBody>
      <Modal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)}>
        <ModalHeader toggle={() => setModalOpen(!modalOpen)}>
          Agent Details
        </ModalHeader>
        <ModalBody>
          {selectedAgent && (
            <div>
              <h5>{selectedAgent.name}</h5>
              <p>
                <strong>Phone:</strong> {selectedAgent.phone}
              </p>
              <p>
                <strong>Email:</strong> {selectedAgent.email}
              </p>
              <p>
                <strong>Location:</strong> {selectedAgent.location}
              </p>
            </div>
          )}
        </ModalBody>
      </Modal>
    </Card>
  );
};

export default MonthlyEarning;
