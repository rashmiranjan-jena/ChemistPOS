import React, { useState } from "react";
import { Card, CardBody, CardTitle } from "reactstrap";
import { Link } from "react-router-dom";

// Static data for user registrations
const userRegistrationData = [
  { date: "2024-02-10", user: "Rashmi Ranjan Jena", active: true },
  { date: "2024-02-09", user: "Jyoti Ranjan Pradhan", active: false },
  { date: "2024-02-08", user: "Manas Kumar Behera", active: false },
  { date: "2024-02-07", user: "Kanhu Sahu", active: false },
  { date: "2024-02-06", user: "Pradip Sutar", active: false },
  { date: "2024-02-05", user: "Dinabandhu  Agasti", active: false },
  { date: "2024-02-04", user: "Sagar Samantary", active: false },
  { date: "2024-02-03", user: "Biswajit Acharay", active: false },
];

const ActivityComp = () => {
  const [showAll, setShowAll] = useState(false);
  const displayedUsers = showAll ? userRegistrationData : userRegistrationData.slice(0, 3);

  return (
    <React.Fragment>
      <Card>
        <CardBody>
          <CardTitle className="mb-4">User Registrations</CardTitle>
          <div style={{ maxHeight: showAll ? "300px" : "auto", overflowY: showAll ? "auto" : "hidden" }}>
            <ul className="verti-timeline list-unstyled">
              {displayedUsers.map((item, index) => (
                <li className={`event-list ${item.active ? "active" : ""}`} key={index}>
                  <div className="event-timeline-dot">
                    <i className={`bx bx-user-circle font-size-18 ${item.active ? "bx-fade-right" : ""}`} />
                  </div>
                  <div className="d-flex">
                    <div className="flex-shrink-0 me-3">
                      <h5 className="font-size-14">
                        {item.date}
                        <i className="bx bx-right-arrow-alt font-size-16 text-primary align-middle ms-2" />
                      </h5>
                    </div>
                    <div className="flex-grow-1">
                      <div>{item.user} registered</div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="text-center mt-3">
            <Link
              to=""
              className="btn btn-primary btn-sm"
              onClick={(e) => {
                e.preventDefault();
                setShowAll(!showAll);
              }}
            >
              {showAll ? "Show Less" : "View More"} <i className="mdi mdi-arrow-right ms-1" />
            </Link>
          </div>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default ActivityComp;
