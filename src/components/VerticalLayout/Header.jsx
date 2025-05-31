import PropTypes from "prop-types";
import React, { useState } from "react";
import { connect } from "react-redux";
import { Row, Col } from "reactstrap";
import { Link } from "react-router-dom";
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

const Header = (props) => {
  const [search, setsearch] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const storeNameParts = [
    { text: "VICHAAR", color: "#318ABF" },
    { text: "MART", color: "#EB6B04" },
    { text: "PHARMA", color: "#318ABF" },
  ];

  const storeNameChars = storeNameParts.map((part, partIndex) =>
    part.text.split("").map((char, charIndex) => (
      <span
        key={`${partIndex}-${charIndex}`}
        className={`wave-char ${isHovered ? "animate" : ""}`}
        style={{
          color: part.color,
          animationDelay: `${
            storeNameParts
              .slice(0, partIndex)
              .reduce((acc, p) => acc + p.text.length, 0) * 0.1 +
            charIndex * 0.1
          }s`,
        }}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ))
  ).flat();

  function toggleFullscreen() {
    if (
      !document.fullscreenElement &&
      !document.mozFullScreenElement &&
      !document.webkitFullscreenElement
    ) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(
          Element.ALLOW_KEYBOARD_INPUT
        );
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    }
  }

  function tToggle() {
    var body = document.body;
    if (window.screen.width <= 998) {
      body.classList.toggle("sidebar-enable");
    } else {
      body.classList.toggle("vertical-collpsed");
      body.classList.toggle("sidebar-enable");
    }
  }

  return (
    <React.Fragment>
      <header id="page-topbar" className="custom-header">
        <div className="navbar-header">
          {/* Left Section: Hamburger Menu and Logo */}
          <div className="navbar-left">
            <button
              type="button"
              onClick={() => tToggle()}
              className="btn btn-sm px-3 font-size-16 header-item toggle-btn"
              id="vertical-menu-btn"
            >
              <i className="fa fa-fw fa-bars" />
            </button>

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
          </div>

          {/* Middle Section: Store Name */}
          <div
            className="store-name"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <h4
              className="mb-0 wave-text"
              style={{ fontWeight: "bold" }}
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

            <div className="dropdown d-none d-lg-inline-block ms-1">
              <button
                type="button"
                onClick={() => toggleFullscreen()}
                className="btn header-item noti-icon"
                data-toggle="fullscreen"
              >
                <i className="bx bx-fullscreen" />
              </button>
            </div>

            <NotificationDropdown />
            <ProfileMenu />
          </div>
        </div>
      </header>
    </React.Fragment>
  );
};

Header.propTypes = {
  changeSidebarType: PropTypes.func,
  leftMenu: PropTypes.any,
  leftSideBarType: PropTypes.any,
  showRightSidebar: PropTypes.any,
  showRightSidebarAction: PropTypes.func,
  t: PropTypes.any,
  toggleLeftmenu: PropTypes.func,
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
})(withTranslation()(Header));