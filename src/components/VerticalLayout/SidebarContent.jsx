import PropTypes from "prop-types";
import React, { useEffect, useRef, useCallback } from "react";
import SimpleBar from "simplebar-react";
import MetisMenu from "metismenujs";
import { Link, useLocation } from "react-router-dom";
import withRouter from "../Common/withRouter";
import { withTranslation } from "react-i18next";
import "./SidebarContent.css";

const SidebarContent = (props) => {
  const ref = useRef();
  const path = useLocation();

  const activateParentDropdown = useCallback((item) => {
    item.classList.add("active");
    const parent = item.parentElement;
    const parent2El = parent.childNodes[1];
    if (parent2El && parent2El.id !== "side-menu") {
      parent2El.classList.add("mm-show");
    }

    if (parent) {
      parent.classList.add("mm-active");
      const parent2 = parent.parentElement;

      if (parent2) {
        parent2.classList.add("mm-show"); // ul tag

        const parent3 = parent2.parentElement; // li tag

        if (parent3) {
          parent3.classList.add("mm-active"); // li
          parent3.childNodes[0].classList.add("mm-active"); //a
          const parent4 = parent3.parentElement; // ul
          if (parent4) {
            parent4.classList.add("mm-show"); // ul
            const parent5 = parent4.parentElement;
            if (parent5) {
              parent5.classList.add("mm-show"); // li
              parent5.childNodes[0].classList.add("mm-active"); // a tag
            }
          }
        }
      }
      scrollElement(item);
      return false;
    }
    scrollElement(item);
    return false;
  }, []);

  const removeActivation = (items) => {
    for (var i = 0; i < items.length; ++i) {
      var item = items[i];
      const parent = items[i].parentElement;

      if (item && item.classList.contains("active")) {
        item.classList.remove("active");
      }
      if (parent) {
        const parent2El =
          parent.childNodes && parent.childNodes.length && parent.childNodes[1]
            ? parent.childNodes[1]
            : null;
        if (parent2El && parent2El.id !== "side-menu") {
          parent2El.classList.remove("mm-show");
        }

        parent.classList.remove("mm-active");
        const parent2 = parent.parentElement;

        if (parent2) {
          parent2.classList.remove("mm-show");

          const parent3 = parent2.parentElement;
          if (parent3) {
            parent3.classList.remove("mm-active"); // li
            parent3.childNodes[0].classList.remove("mm-active");

            const parent4 = parent3.parentElement; // ul
            if (parent4) {
              parent4.classList.remove("mm-show"); // ul
              const parent5 = parent4.parentElement;
              if (parent5) {
                parent5.classList.remove("mm-show"); // li
                parent5.childNodes[0].classList.remove("mm-active"); // a tag
              }
            }
          }
        }
      }
    }
  };

  const activeMenu = useCallback(() => {
    const pathName = path.pathname;
    let matchingMenuItem = null;
    const ul = document.getElementById("side-menu");
    const items = ul.getElementsByTagName("a");
    removeActivation(items);

    for (let i = 0; i < items.length; ++i) {
      if (pathName === items[i].pathname) {
        matchingMenuItem = items[i];
        break;
      }
    }
    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem);
    }
    // Recalculate SimpleBar after menu activation
    if (ref.current) {
      ref.current.recalculate();
    }
  }, [path.pathname, activateParentDropdown]);

  useEffect(() => {
    if (ref.current) {
      ref.current.recalculate();
    }
  }, []);

  useEffect(() => {
    const metisMenu = new MetisMenu("#side-menu", {
      toggle: true,
      // Recalculate SimpleBar when sub-menus are toggled
      onTransitionEnd: () => {
        if (ref.current) {
          ref.current.recalculate();
        }
      },
    });
    activeMenu();

    return () => {
      metisMenu.dispose();
    };
  }, [activeMenu]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    activeMenu();
  }, [activeMenu]);

  function scrollElement(item) {
    if (item) {
      const currentPosition = item.offsetTop;
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300;
      }
    }
  }

  return (
    <React.Fragment>
      <SimpleBar className="h-100 custom-sidebar" ref={ref}>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            <li className="menu-title">
              <span>{props.t("Menu")}</span>
            </li>
            <li>
              <Link to="/dashboard">
                <i className="bx bx-home-circle"></i>
                <span>{props.t("Dashboard")}</span>
              </Link>
            </li>

            <li>
              <Link to="/pos-screen">
                <i className="fas fa-boxes"></i>
                <span>{props.t("POS")}</span>
              </Link>
            </li>

            {/* <li>
              <Link to="/pos-reports">
                <i className="fas fa-file-invoice"></i>
                <span>{props.t("POS Report")}</span>
              </Link>
            </li> */}

            {/* System Admin */}
            <li>
              <Link to="/system-admin-dashboard">
                <i className="bx bx-shield"></i>
                <span>{props.t("System Admin")}</span>
              </Link>
            </li>

            {/* Associates */}
            <li>
              <Link to="/associate">
                <i className="bx bx-user"></i>
                <span>{props.t("Associates")}</span>
              </Link>
            </li>

            {/* Admin Module */}
            <li>
              <Link to="/admin">
                <i className="bx bx-shield-alt"></i>
                <span>{props.t("Admin")}</span>
              </Link>
            </li>

            <li>
              <Link to="/drugs">
                <i className="fas fa-pills"></i>
                <span>{props.t("Drugs/Products")}</span>
              </Link>
            </li>

            <li>
              <Link to="/threshold-list">
                <i className="fas fa-sliders-h"></i>
                <span>{props.t("Threshold")}</span>
              </Link>
            </li>

            <li>
              <Link to="/storage-list">
                <i className="fas fa-database"></i>

                <span>{props.t("Storage")}</span>
              </Link>
            </li>

            <li>
              <Link to="/purchase">
                <i className="bx bx-shopping-bag"></i>
                <span>{props.t("Purchase")}</span>
              </Link>
            </li>

            <li>
              <Link to="/gst">
                <i className="fas fa-file-invoice-dollar"></i>
                <span>{props.t("GST")}</span>
              </Link>
            </li>

            <li>
              <Link to="/inventorymanagement">
                <i className="fas fa-boxes"></i>
                <span>{props.t("Inventory Management")}</span>
              </Link>
            </li>

            {/* <li>
              <Link to="/unitandmeasurementdashboard">
                <i className="fas fa-balance-scale"></i>
                <span>{props.t("Unit Measurement")}</span>
              </Link>
            </li> */}

            {/* Return */}
            <li>
              <Link to="/return">
                <i className="bx bx-undo"></i>
                <span>{props.t("Return")}</span>
              </Link>
            </li>

            {/* <li>
              <Link to="/return-item">
                <i className="bx bx-undo"></i>
                <span>{props.t("Return Products")}</span>
              </Link>
            </li> */}

            {/* All Transaction */}
            <li>
              <Link to="/all-transaction">
                <i className="bx bx-transfer"></i>
                <span>{props.t("All Transaction")}</span>
              </Link>
            </li>

            {/* Order Management */}
            <li>
              <Link to="/drugs-order-management">
                <i className="bx bx-shopping-bag"></i>
                <span>{props.t("Order Management")}</span>
              </Link>
            </li>

            {/* Transaction Management */}
            {/* <li>
              <Link to="/#" className="has-arrow">
                <i className="bx bx-package"></i>
                <span>{props.t("Delivery Management")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to="/deliverydistributionlist">
                    {props.t("Delivery Distribution")}
                  </Link>
                </li>
                <li>
                  <Link to="/agentlist">{props.t("Agent Management")}</Link>
                </li>
                <li>
                  <Link to="/ordermanagement">{props.t("Order Assign")}</Link>
                </li>
                <li>
                  <Link to="/agentwisework">{props.t("AgentWise Work")}</Link>
                </li>
              </ul>
            </li> */}

            {/* Return and Refund */}
            {/* <li>
              <Link to="/#" className="has-arrow">
                <i className="bx bx-undo"></i>
                <span>{props.t("Return and Refund")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to="/refunddetails">{props.t("Refund Details")}</Link>
                </li>
                <li>
                  <Link to="/returnorexchange">
                    {props.t("Return/Exchange Details")}
                  </Link>
                </li>
                <li>
                  <Link to="/cancelationdetails">
                    {props.t("Cancelation Details")}
                  </Link>
                </li>
                <li>
                  <Link to="/pickupdetails">{props.t("Pickup Details")}</Link>
                </li>
              </ul>
            </li> */}

            {/* Deals and Discounts */}
            {/* <li>
              <Link to="/#" className="has-arrow">
                <i className="bx bx-purchase-tag"></i>
                <span>{props.t("Deals and Discounts")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to="/dealslist">{props.t("Deals")}</Link>
                </li>
                <li>
                  <Link to="/dealsapplicabilitieslist">
                    {props.t("Deals Applicabilities")}
                  </Link>
                </li>
                <li>
                  <Link to="/discountcodeslist">
                    {props.t("Discount Coupon")}
                  </Link>
                </li>
                <li>
                  <Link to="/discountapplicablelist">
                    {props.t("Discount Coupon Applicable")}
                  </Link>
                </li>
              </ul>
            </li> */}

            {/* Purchase Management */}
            {/* <li>
              <Link to="/#" className="has-arrow">
                <i className="bx bx-cart-alt"></i>
                <span>{props.t("Purchase Management")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to="/supplierdetailslist">
                    {props.t("Supplier Details")}
                  </Link>
                </li>
                <li>
                  <Link to="/bulkorderlist">{props.t("Purchase")}</Link>
                </li>
                <li>
                  <Link to="/inventory">{props.t("Inventory")}</Link>
                </li>
              </ul>
            </li> */}

            {/* Customer Management */}
            <li>
              <Link to="/customerdetails">
                <i className="bx bx-user-circle"></i>
                <span>{props.t("Customer Details")}</span>
              </Link>
            </li>

            {/* <li>
              <Link to="/feedback">
                <i className="bx bx-star"></i>
                <span>{props.t("Feedback and Rating")}</span>
              </Link>
            </li> */}

            {/* MR */}
            <li>
              <Link to="/medical-report-dashboard">
                <i className="bx bx-shopping-bag"></i>
                <span>{props.t("Medical Representative")}</span>
              </Link>
            </li>

            {/* Financial Year Management */}
            <li>
              <Link to="/financial-year-management-dashboard">
                <i className="bx bx-line-chart"></i>
                <span>{props.t("Financial Year Management")}</span>
              </Link>
            </li>

            <li>
              <Link to="/accounting-management-dashboard">
                <i className="bx bx-spreadsheet"></i>
                <span>{props.t("Accounting Management")}</span>
              </Link>
            </li>

            <li>
              <Link to="/day-close-management-dashboard">
                <i className="bx bx-time-five"></i>
                <span>{props.t("Day Close Management")}</span>
              </Link>
            </li>
          </ul>
        </div>
      </SimpleBar>
    </React.Fragment>
  );
};

SidebarContent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};

export default withRouter(withTranslation()(SidebarContent));
