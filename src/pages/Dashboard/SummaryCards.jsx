import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Card, CardBody, Col, Spinner } from "reactstrap";
import {
  FaUsers,
  FaBoxOpen,
  FaExclamationTriangle,
  FaHandshake,
  FaUser,
  FaStethoscope,
  FaUserMd,
  FaBuilding,
  FaUserTie,
  FaDollarSign,
  FaMoneyBillWave,
  FaShoppingCart,
  FaChartLine,
  FaCreditCard,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getSummaryCart } from "../../ApiService/ChemistDashboard/SummaeryCart";

// Base summaryCards structure with static paths, icons, colors, and unique background colors
const summaryCardsTemplate = [
  {
    title: "Stores",
    key: "store_count",
    icon: <FaUsers size={18} />,
    color: "#6b46c1",
    bgColor: "rgba(235, 229, 245, 0.9)",
    path: "/create-store-cart",
  },
  {
    title: "Inventory (Live)",
    key: "inventory_live",
    icon: <FaBoxOpen size={18} />,
    color: "#4299e1",
    bgColor: "rgba(219, 234, 254, 0.9)",
    path: "/total-inventory",
  },
  {
    title: "Inventory (Expired)",
    key: "inventory_expired",
    icon: <FaExclamationTriangle size={18} />,
    color: "#e53e3e",
    bgColor: "rgba(254, 226, 226, 0.9)",
    path: "/expired-drugs-inventory",
  },
  {
    title: "Suppliers",
    key: "supplier_count",
    icon: <FaHandshake size={18} />,
    color: "#ed8936",
    bgColor: "rgba(254, 235, 213, 0.9)",
    path: "/supplier-management-list",
  },
  {
    title: "Customers",
    key: "customer_count",
    icon: <FaUser size={18} />,
    color: "#38b2ac",
    bgColor: "rgba(204, 251, 241, 0.9)",
    path: "/customerdetails",
  },
  {
    title: "Doctors",
    key: "doctor_count",
    icon: <FaStethoscope size={18} />,
    color: "#805ad5",
    bgColor: "rgba(233, 227, 245, 0.9)",
    path: "/add-new-doctor-list",
  },
  // {
  //   title: "Medical Reps",
  //   key: "medicine_representative_count",
  //   icon: <FaUserMd size={18} />,
  //   color: "#2b6cb0",
  //   bgColor: "rgba(207, 231, 250, 0.9)",
  //   path: "/medical-report-dashboard",
  // },
  {
    title: "Brands",
    key: "brand_count",
    icon: <FaBuilding size={18} />,
    color: "#319795",
    bgColor: "rgba(204, 242, 239, 0.9)",
    path: "/brand-list",
  },
  {
    title: "Employees",
    key: "employee_count",
    icon: <FaUserTie size={18} />,
    color: "#4c51bf",
    bgColor: "rgba(221, 224, 255, 0.9)",
    path: "/add-new-employee-list",
  },
  {
    title: "Total Sales",
    key: "total_sales_amount",
    icon: <FaDollarSign size={18} />,
    color: "#2f855a",
    bgColor: "rgba(209, 250, 229, 0.9)",
    path: "/drugs-order-management",
  },
  {
    title: "Sales Return",
    key: "sales_return",
    icon: <FaMoneyBillWave size={18} />,
    color: "#c53030",
    bgColor: "rgba(254, 215, 215, 0.9)",
    path: "/sales-return",
  },
  {
    title: "Total Purchases",
    key: "total_purchase_amount",
    icon: <FaShoppingCart size={18} />,
    color: "#4a5568",
    bgColor: "rgba(226, 232, 240, 0.9)",
    path: "/purchase-entry-list",
  },
  {
    title: "Purchase Return",
    key: "purchase_return",
    icon: <FaMoneyBillWave size={18} />,
    color: "#975a16",
    bgColor: "rgba(251, 231, 213, 0.9)",
    path: "/product-return",
  },
  {
    title: "Total Profit",
    key: "total_profit",
    icon: <FaChartLine size={18} />,
    color: "#276749",
    bgColor: "rgba(208, 242, 223, 0.9)",
    path: "/profit-loss-report",
  },
  {
    title: "Credit Khata",
    key: "credit_amount",
    icon: <FaCreditCard size={18} />,
    color: "#702459",
    bgColor: "rgba(245, 225, 235, 0.9)",
    path: "/receivables-list",
  },
  {
    title: "Supplier Payment",
    key: "supplier_payment_amount",
    icon: <FaHandshake size={18} />,
    color: "#b83280",
    bgColor: "rgba(251, 219, 234, 0.9)",
    path: "/payables-list",
  },
];

const SummaryDashboard = () => {
  const navigate = useNavigate();
  const [summaryCards, setSummaryCards] = useState(
    summaryCardsTemplate.map((card) => ({
      ...card,
      value: 0,
    }))
  );
  const [cardLoading, setCardLoading] = useState({});
  const [navigatingCard, setNavigatingCard] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        const loadingState = summaryCardsTemplate.reduce((acc, _, index) => {
          acc[index] = true;
          return acc;
        }, {});
        setCardLoading(loadingState);

        const response = await getSummaryCart();

        const updatedCards = summaryCardsTemplate.map((card) => ({
          ...card,
          value: response?.data?.[card.key] ?? 0,
        }));

        setSummaryCards(updatedCards);
        setError(null);
      } catch (err) {
        setError("Failed to fetch summary data");
        console.error(err);
      } finally {
        setCardLoading({});
      }
    };

    fetchSummaryData();
  }, []);

  const handleCardClick = (path, index) => {
    setNavigatingCard(index);
    setTimeout(() => {
      navigate(path);
      setNavigatingCard(null);
    }, 500);
  };

  return (
    <div className="row gx-1">
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      {summaryCards.map((card, index) => (
        <Col
          key={index}
          xs="12"
          sm="6"
          md="4"
          lg="2"
          className="mb-1 custom-col"
        >
          {" "}
          {/* Added custom-col class */}
          <Card
            className="glass-card summary-card"
            onClick={() => handleCardClick(card.path, index)}
            style={{
              borderLeft: `3px solid ${card.color}`,
              backgroundColor: card.bgColor,
              borderRadius: "6px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              transition: "transform 0.2s ease-in-out",
              cursor: "pointer",
              width: "100%",
              minHeight: "80px",
              maxHeight: "90px",
            }}
          >
            <CardBody className="compact-card" style={{ padding: "0.8rem" }}>
              <div className="d-flex align-items-center mb-1">
                <div style={{ color: card.color, marginRight: "6px" }}>
                  {card.icon}
                </div>
                <h5
                  className="mb-0"
                  style={{
                    color: "#1f2937",
                    fontSize: "0.9rem",
                    fontWeight: "600",
                  }}
                >
                  {card.title}
                </h5>
              </div>
              <h3
                className="mb-0"
                style={{
                  color: "#111827",
                  fontWeight: "700",
                  fontSize: "1.2rem",
                }}
              >
                {cardLoading[index] || navigatingCard === index ? (
                  <Spinner size="sm" style={{ color: card.color }} />
                ) : (
                  card.value
                )}
              </h3>
            </CardBody>
          </Card>
        </Col>
      ))}
      <style>
        {`
          @media (min-width: 992px) {
            .custom-col {
              flex: 0 0 20%;
              max-width: 20%;
            }
          }
        `}
      </style>
    </div>
  );
};

export default SummaryDashboard;
