import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import { Collapse, Navbar as RSNavbar, NavbarToggler } from "reactstrap";
import { Link } from "react-router-dom";
import withRouter from "../Common/withRouter";
import classname from "classnames";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";

// Custom CSS for navbar styling
import "./Navbar.css";

// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";

const Navbar = (props) => {
  // State for dropdown toggle
  const [dashboard, setDashboard] = useState(false);

  // State for navbar toggle (responsive)
  const [isOpen, setIsOpen] = useState(false);

  // Toggle navbar for responsive view
  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    // Highlight active menu item based on current pathname
    const ul = document.getElementById("navigation");
    const items = ul.getElementsByTagName("a");
    removeActivation(items);
    let matchingMenuItem = null;
    for (let i = 0; i < items.length; ++i) {
      if (window.location.pathname === items[i].pathname) {
        matchingMenuItem = items[i];
        break;
      }
    }
    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem);
    }
  }, []);

  const removeActivation = (items) => {
    for (let i = 0; i < items.length; ++i) {
      const item = items[i];
      const parent = item.parentElement;
      if (item && item.classList.contains("active")) {
        item.classList.remove("active");
      }
      if (parent) {
        if (parent.classList.contains("active")) {
          parent.classList.remove("active");
        }
      }
    }
  };

  const activateParentDropdown = (item) => {
    item.classList.add("active");
    let parent = item.parentElement;
    while (parent) {
      parent.classList.add("active");
      parent = parent.parentElement;
      if (parent && parent.classList.contains("dropdown-menu")) {
        parent.classList.add("show");
      }
    }
    return false;
  };

  return (
    <React.Fragment>
      <div className="topnav">
        <div className="container-fluid">
          <RSNavbar
            className="navbar navbar-light navbar-expand-lg topnav-menu"
            id="navigation"
            expand="lg"
          >
            <NavbarToggler onClick={toggleNavbar}>
              <span className="navbar-toggler-icon"></span>
            </NavbarToggler>
            <Collapse isOpen={isOpen || props.leftMenu} navbar>
              <ul className="navbar-nav">
                {/* Dashboard Dropdown */}
                <li className="nav-item dropdown">
                  <Link
                    className="nav-link dropdown-toggle arrow-none"
                    onClick={(e) => {
                      e.preventDefault();
                      setDashboard(!dashboard);
                    }}
                    to="/dashboard"
                  >
                    {props.t("Dashboard")} <div className="arrow-down"></div>
                  </Link>
                  <div
                    className={classname("dropdown-menu", { show: dashboard })}
                  >
                    <Link to="/dashboard" className="dropdown-item">
                      {props.t("Dashboard")}
                    </Link>
                    <Link to="/system-admin-dashboard" className="dropdown-item">
                      {props.t("System Admin")}
                    </Link>
                    <Link to="/pos-dashboard" className="dropdown-item">
                      {props.t("POS")}
                    </Link>
                    <Link to="/medical-report-dashboard" className="dropdown-item">
                      {props.t("Medical Representative")}
                    </Link>
                    <Link to="/financial-year-management-dashboard" className="dropdown-item">
                      {props.t("Financial Year Management")}
                    </Link>
                    <Link to="/accounting-management-dashboard" className="dropdown-item">
                      {props.t("Accounting Management")}
                    </Link>
                    <Link to="/day-close-management-dashboard" className="dropdown-item">
                      {props.t("Day Close Management")}
                    </Link>
                    {/* Return and Refund Items */}
                    <div className="dropdown-divider"></div>
                    <Link to="/refunddetails" className="dropdown-item">
                      {props.t("Refund Details")}
                    </Link>
                    <Link to="/returnorexchange" className="dropdown-item">
                      {props.t("Return/Exchange Details")}
                    </Link>
                    <Link to="/cancelationdetails" className="dropdown-item">
                      {props.t("Cancelation Details")}
                    </Link>
                    <Link to="/pickupdetails" className="dropdown-item">
                      {props.t("Pickup Details")}
                    </Link>
                    {/* Deals and Discounts Items */}
                    <div className="dropdown-divider"></div>
                    <Link to="/dealslist" className="dropdown-item">
                      {props.t("Deals")}
                    </Link>
                    <Link to="/dealsapplicabilitieslist" className="dropdown-item">
                      {props.t("Deals Applicabilities")}
                    </Link>
                    <Link to="/discountcodeslist" className="dropdown-item">
                      {props.t("Discount Coupon")}
                    </Link>
                    <Link to="/discountapplicablelist" className="dropdown-item">
                      {props.t("Discount Coupon Applicable")}
                    </Link>
                    {/* Purchase Management Items */}
                    <div className="dropdown-divider"></div>
                    <Link to="/supplierdetailslist" className="dropdown-item">
                      {props.t("Supplier Details")}
                    </Link>
                    <Link to="/bulkorderlist" className="dropdown-item">
                      {props.t("Purchase")}
                    </Link>
                    <Link to="/inventory" className="dropdown-item">
                      {props.t("Inventory")}
                    </Link>
                    {/* Customer Details */}
                    <div className="dropdown-divider"></div>
                    <Link to="/customerdetails" className="dropdown-item">
                      {props.t("Customer Details")}
                    </Link>
                  </div>
                </li>

                {/* Associates */}
                <li className="nav-item">
                  <Link className="nav-link arrow-none" to="/associate">
                    {props.t("Associates")}
                  </Link>
                </li>

                {/* Admin */}
                <li className="nav-item">
                  <Link className="nav-link arrow-none" to="/admin">
                    {props.t("Admin")}
                  </Link>
                </li>

                {/* Drugs */}
                <li className="nav-item">
                  <Link className="nav-link arrow-none" to="/drugs">
                    {props.t("Drugs")}
                  </Link>
                </li>

                {/* Purchase */}
                <li className="nav-item">
                  <Link className="nav-link arrow-none" to="/purchase">
                    {props.t("Purchase")}
                  </Link>
                </li>

                {/* GST */}
                <li className="nav-item">
                  <Link className="nav-link arrow-none" to="/gst">
                    {props.t("GST")}
                  </Link>
                </li>

                {/* Inventory Management */}
                <li className="nav-item">
                  <Link className="nav-link arrow-none" to="/inventorymanagement">
                    {props.t("Inventory Management")}
                  </Link>
                </li>

                {/* Return */}
                <li className="nav-item">
                  <Link className="nav-link arrow-none" to="/expire-product-return">
                    {props.t("Return")}
                  </Link>
                </li>

                {/* All Transaction */}
                <li className="nav-item">
                  <Link className="nav-link arrow-none" to="/all-transaction">
                    {props.t("All Transaction")}
                  </Link>
                </li>

                {/* Order Management */}
                <li className="nav-item">
                  <Link className="nav-link arrow-none" to="/drugs-order-management">
                    {props.t("Order Management")}
                  </Link>
                </li>

                {/* Delivery Management */}
                <li className="nav-item dropdown">
                  <Link
                    className="nav-link dropdown-toggle arrow-none"
                    to="/#"
                    onClick={(e) => {
                      e.preventDefault();
                      setDeliveryManagement(!deliveryManagement);
                    }}
                  >
                    {props.t("Delivery Management")} <div className="arrow-down"></div>
                  </Link>
                  {/* <div
                    className={classname("dropdown-menu", { show: deliveryManagement })}
                  >
                    <Link to="/deliverydistributionlist" className="dropdown-item">
                      {props.t("Delivery Distribution")}
                    </Link>
                    <Link to="/agentlist" className="dropdown-item">
                      {props.t("Agent Management")}
                    </Link>
                    <Link to="/ordermanagement" className="dropdown-item">
                      {props.t("Order Assign")}
                    </Link>
                    <Link to="/agentwisework" className="dropdown-item">
                      {props.t("AgentWise Work")}
                    </Link>
                  </div> */}
                </li>
              </ul>
            </Collapse>
          </RSNavbar>
        </div>
      </div>
    </React.Fragment>
  );
};

Navbar.propTypes = {
  leftMenu: PropTypes.any,
  location: PropTypes.any,
  menuOpen: PropTypes.any,
  t: PropTypes.any,
};

const mapStateToProps = (state) => {
  const { leftMenu } = state.Layout;
  return { leftMenu };
};

export default withRouter(
  connect(mapStateToProps, {})(withTranslation()(Navbar))
);