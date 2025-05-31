import PropTypes from "prop-types";
import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Spinner,
} from "reactstrap";
import { withTranslation } from "react-i18next";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { FaSyncAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import SupplierStatus from "./SupplierStatus";
import LowStock from "./LowStock";
import ExpiringSoon from "./ExpiringSoon";
import TopSellingMedicines from "./TopSellingMedicines";
import RecentActivity from "./RecentActivity";
import QuickStats from "./AbhaDetails";
import InventoryStatus from "./InventoryStatus";
import ProfileCard from "./ProfileCard";
import QuickActions from "./QuickActions";
import MedicineDistribution from "./MedicineDistribution";
import SalesOverview from "./SalesOverview";
import SummaryCards from "./SummaryCards";

// Custom CSS
const customStyles = `
  .glass-card {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    height: 100%;
    cursor: pointer;
  }
  .glass-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }
  .gradient-btn {
    background: linear-gradient(135deg, #6b46c1 0%, #4299e1 100%);
    border: none;
    transition: all 0.3s ease;
  }
  .gradient-btn:hover {
    background: linear-gradient(135deg, #5a3da3 0%, #3182ce 100%);
    transform: scale(1.05);
  }
  .scrollable-container::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }
  .scrollable-container::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 10px;
  }
  .scrollable-container::-webkit-scrollbar-thumb {
    background: #6b46c1;
    border-radius: 10px;
  }
  .scrollable-container::-webkit-scrollbar-thumb:hover {
    background: #5a3da3;
  }
  .card[style*="backgroundColor: rgba(254, 252, 191, 0.3)"] .scrollable-container::-webkit-scrollbar-thumb {
    background: #ed8936;
  }
  .card[style*="backgroundColor: rgba(254, 252, 191, 0.3)"] .scrollable-container::-webkit-scrollbar-thumb:hover {
    background: #dd6b20;
  }
  .card[style*="backgroundColor: rgba(254, 215, 215, 0.3)"] .scrollable-container::-webkit-scrollbar-thumb {
    background: #e53e3e;
  }
  .card[style*="backgroundColor: rgba(254, 215, 215, 0.3)"] .scrollable-container::-webkit-scrollbar-thumb:hover {
    background: #c53030;
  }
  .animated-progress {
    transition: width 1s ease-in-out;
  }
  .compact-card {
    padding: 0.75rem;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .uniform-height {
    height: 320px;
  }
  .bottom-card-height {
    height: 300px;
  }
  .summary-card {
    min-height: 120px;
  }
`;

// Append custom styles to document head
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = customStyles;
document.head.appendChild(styleSheet);

const Dashboard = (props) => {
  const navigate = useNavigate();

  const [modal, setModal] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [cardLoading, setCardLoading] = useState({});

  const toggleModal = () => setModal(!modal);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setFormData({ ...formData, photo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = () => {
    setIsLoading(true);
    setTimeout(() => {
      setAdminDetails({ ...formData });
      setIsLoading(false);
      toggleModal();
    }, 1000);
  };

  const handleRefreshData = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleCardClick = (path, index) => {
    setCardLoading((prev) => ({ ...prev, [index]: true }));
    setTimeout(() => {
      navigate(path);
      setCardLoading((prev) => ({ ...prev, [index]: false }));
    }, 1000);
  };

  document.title = "Chemist Dashboard";

  return (
    <React.Fragment>
      <div
        className="page-content"
        style={{
          background: "linear-gradient(135deg, #f0f4ff 0%, #e6efff 100%)",
          minHeight: "100vh",
          paddingBottom: "40px",
        }}
      >
        <Container fluid>
          <Breadcrumbs
            title={props.t("Dashboards")}
            breadcrumbItem={props.t("Dashboard")}
          />
          <Row className="mb-3 justify-content-between align-items-center gx-3">
            <Col md="6">
              <h4 className="mb-0" style={{ color: "#2d3748" }}>
                Vichhar Chemist Dashboard
              </h4>
            </Col>
            <Col md="6" className="text-end">
              <Button
                className="gradient-btn"
                onClick={handleRefreshData}
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title="Refresh Dashboard Data"
              >
                <FaSyncAlt className="me-2" /> Refresh Data
              </Button>
            </Col>
          </Row>

          <SummaryCards
            cardLoading={cardLoading}
            handleCardClick={handleCardClick}
          />

          <Row className="gx-3">
            <Col lg="8">
              <SalesOverview refreshKey={refreshKey} />
              <MedicineDistribution refreshKey={refreshKey} />
              <QuickActions navigate={navigate} />
            </Col>
            <Col lg="4">
              <div className="mb-3">
                <ProfileCard />
              </div>
              <div className="mb-3">
                <InventoryStatus refreshKey={refreshKey} />
              </div>
              <div>
                <QuickStats />
              </div>
            </Col>
          </Row>

          <Row className="gx-3">
            <Col md="6">
              <RecentActivity />
            </Col>
            <Col md="6">
              <TopSellingMedicines />
            </Col>
          </Row>

          <Row className="gx-3">
            <Col md="4">
              <ExpiringSoon />
            </Col>
            <Col md="4">
              <LowStock />
            </Col>
            <Col md="4">
              <SupplierStatus />
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

Dashboard.propTypes = { t: PropTypes.any };
export default withTranslation()(Dashboard);
