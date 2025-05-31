import React from "react";
import { Card, CardBody, Row, Col, Button } from "reactstrap";
import PropTypes from "prop-types";
import {
  FaFileInvoice,
  FaPlus,
  FaIndustry,
  FaCheckCircle,
  FaShoppingCart,
  FaTruck,
  FaChartBar,
  FaCog,
  FaCapsules,
  FaExclamationTriangle,
  FaUser,
  FaStethoscope,
  FaHandshake,
} from "react-icons/fa";

const quickActions = [
  {
    icon: <FaFileInvoice size={20} />,
    text: "Create Invoice",
    path: "/purchase-report-cart",
  },
  {
    icon: <FaPlus size={20} />,
    text: "Add Medicine",
    path: "/add-drug-form",
  },
  {
    icon: <FaIndustry size={20} />,
    text: "Start Batch",
    path: "#",
  },
  {
    icon: <FaCheckCircle size={20} />,
    text: "Quality Check",
    path: "#",
  },
  {
    icon: <FaShoppingCart size={20} />,
    text: "Add Purchase",
    path: "/purchase-request-form",
  },
  {
    icon: <FaTruck size={20} />,
    text: "Add Supplier",
    path: "/supplier-management-reports",
  },
  {
    icon: <FaChartBar size={20} />,
    text: "View Reports",
    path: "/purchase-report-cart",
  },
  {
    icon: <FaCog size={20} />,
    text: "Settings",
    path: "#",
  },
  {
    icon: <FaCapsules size={20} />,
    text: "Top Medicines",
    path: "/top-selling-medicines",
  },
  {
    icon: <FaExclamationTriangle size={20} />,
    text: "Low Stock",
    path: "/low-stock-report",
  },
  {
    icon: <FaUser size={20} />,
    text: "Top Customers",
    path: "/top-customers",
  },
  {
    icon: <FaStethoscope size={20} />,
    text: "Top Doctors",
    path: "/top-doctors",
  },
  {
    icon: <FaHandshake size={20} />,
    text: "Top Suppliers",
    path: "/top-suppliers",
  },
];

const QuickActions = ({ navigate }) => (
  <Card className="glass-card mb-3 uniform-height">
    <CardBody className="compact-card">
      <h5 className="mb-3" style={{ color: "#2d3748" }}>
        Quick Actions
      </h5>
      <Row className="gx-2 gy-2">
        {quickActions.map((action, index) => (
          <Col md="3" key={index}>
            <Button
              className="w-100 d-flex flex-column align-items-center py-2 gradient-btn"
              onClick={() => navigate(action.path)}
              data-bs-toggle="tooltip"
              title={action.text}
            >
              {action.icon}
              <span className="mt-1" style={{ fontSize: "12px" }}>
                {action.text}
              </span>
            </Button>
          </Col>
        ))}
      </Row>
    </CardBody>
  </Card>
);

QuickActions.propTypes = {
  navigate: PropTypes.func.isRequired,
};

export default QuickActions;
