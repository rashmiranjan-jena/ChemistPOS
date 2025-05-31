import PropTypes from "prop-types";
import React, { useState } from "react";
import { connect } from "react-redux";
import { Row, Col, Button } from "reactstrap";
import { Link, useNavigate, useNavigation } from "react-router-dom";
import { Dropdown, DropdownToggle, DropdownMenu } from "reactstrap";
import LanguageDropdown from "../CommonForBoth/TopbarDropdown/LanguageDropdown";
import NotificationDropdown from "../CommonForBoth/TopbarDropdown/NotificationDropdown";
import ProfileMenu from "../CommonForBoth/TopbarDropdown/ProfileMenu";
import logo from "../../assets/images/logo.svg";
import logoLightSvg from "../../assets/images/VICHAARMART.png";
import { withTranslation } from "react-i18next";
import {
  showRightSidebarAction,
  toggleLeftmenu,
  changeSidebarType,
} from "/src/store/actions";
import "./Header.css";

const PosHeader = (props) => {
  const [search, setsearch] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const storeName = "VichaarMart Pharmacy";

  const storeNameChars = storeName.split("").map((char, index) => (
    <span
      key={index}
      className={`wave-char ${isHovered ? "animate" : ""}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {char === " " ? "\u00A0" : char}
    </span>
  ));

  return (
    <React.Fragment>
      <header id="page-topbar-header" className="custom-pos-header fixed-top bg-white">
        <div className="navbar-header">
          {/* Left Section: Hamburger Menu and Logo */}
          {/* <div className="navbar-left">

            <div className="navbar-brand-box d-lg-none d-md-block">
              <Link to="/" className="logo logo-dark">
                <span className="logo-sm">
                  <img src={logo} alt="" height="22" />
                </span>
              </Link>
              <Link to="/" className="logo logo-light">
                <span className="logo-sm">
                  <img src={logoLightSvg} alt="" height="22" />
                </span>
              </Link>
            </div>
          </div> */}

          {/* Middle Section: Store Name */}
          <div
            className="store-name"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <h4
              className="mb-0 wave-text"
              style={{ color: "#00c4b4", fontWeight: "bold" }}
            >
              {storeNameChars}
            </h4>
          </div>

          {/* Right Section: Icons */}
          <div className="navbar-right">
            <div className="dropdown d-inline-block d-lg-none ms-2">
              <button
                onClick={() => setsearch(!search)}
                type="button"
                className="btn header-item noti-icon"
                id="page-header-search-dropdown"
              >
                <i className="mdi mdi-magnify" />
              </button>
              <div
                className={
                  search
                    ? "dropdown-menu dropdown-menu-lg dropdown-menu-end p-0 show"
                    : "dropdown-menu dropdown-menu-lg dropdown-menu-end p-0"
                }
                aria-labelledby="page-header-search-dropdown"
              >
                <form className="p-3">
                  <div className="form-group m-0">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search ..."
                        aria-label="Recipient's username"
                      />
                      <div className="input-group-append">
                        <button className="btn btn-primary" type="submit">
                          <i className="mdi mdi-magnify" />
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <Button
  variant="success"
  style={{ backgroundColor: 'orange', borderColor: 'orange' }}
  className="d-flex align-items-center ms-2 mx-2"
  onClick={() => window.open("https://abha.abdm.gov.in/abha/v3/register/aadhaar", "_blank")}
>
  <i className="fas fa-id-card me-2"></i> Create ABHA Number
</Button>


            <Button 
            variant="danger" 
            onClick={props.handleDayCloseClick}
            className="d-flex align-items-center"
          >
            <i className="fas fa-lock me-2"></i> Day Close
          </Button>
            <button
              className="btn header-item noti-icon"
              id="page-header-search-dropdown"
              onClick={() => navigate("/market-demand-list")}
            >
              Market Demand
            </button>
            <button
              className="btn header-item noti-icon"
              id="page-header-search-dropdown"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </button>

            <NotificationDropdown />
            <ProfileMenu />
          </div>
        </div>
      </header>
    </React.Fragment>
  );
};



const mapStatetoProps = (state) => {
  const { layoutType, showRightSidebar, leftMenu, leftSideBarType } =
    state.Layout;
  return { layoutType, showRightSidebar, leftMenu, leftSideBarType };
};

export default connect(mapStatetoProps, {
  showRightSidebarAction,
  toggleLeftmenu,
  changeSidebarType,
})(withTranslation()(PosHeader));
