import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { Dropdown, DropdownToggle, DropdownMenu, Row, Col } from "reactstrap"
import SimpleBar from "simplebar-react"
// const socket = io("YOUR_BACKEND_WEBSOCKET_URL");

const NotificationDropdown = (props) => {
  const [menu, setMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // useEffect(() => {
  //   socket.on("new_notification", (data) => {
  //     setNotifications((prev) => [data, ...prev]);
  //   });

  //   return () => {
  //     socket.off("new_notification");
  //   };
  // }, []);

  return (
    <Dropdown
      isOpen={menu}
      toggle={() => setMenu(!menu)}
      className="dropdown d-inline-block"
      tag="li"
    >
      <DropdownToggle
        className="btn header-item noti-icon position-relative"
        tag="button"
      >
        <i className="bx bx-bell bx-tada" />
        {notifications.length > 0 && (
          <span className="badge bg-danger rounded-pill">{notifications.length}</span>
        )}
      </DropdownToggle>

      <DropdownMenu className="dropdown-menu dropdown-menu-lg p-0 dropdown-menu-end">
        <SimpleBar style={{ height: "230px" }}>
          {notifications.length === 0 ? (
            <p className="text-center p-3">No new notifications</p>
          ) : (
            notifications.map((notification, index) => (
              <div key={index} className="notification-item">
                <p>{notification.message}</p>
                <small>{notification.time}</small>
              </div>
            ))
          )}
        </SimpleBar>
      </DropdownMenu>
    </Dropdown>
  );
};

export default NotificationDropdown;
