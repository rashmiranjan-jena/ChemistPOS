import React, { useState } from "react";
import { Row, Col, Card, CardBody, CardTitle, Button } from "reactstrap";
import { FaBox } from "react-icons/fa";

const Shipment = () => {
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  // Dummy data: Orders placed today
  const orders = [
    { id: 1, product: "Laptop", customer: "David Smith", date: today },
    { id: 2, product: "Smartphone", customer: "Emma Johnson", date: today },
    { id: 3, product: "Headphones", customer: "Chris Wilson", date: today },
    { id: 4, product: "Smartwatch", customer: "Sophia Brown", date: today },
    { id: 5, product: "Tablet", customer: "Michael Scott", date: today },
    { id: 6, product: "Gaming Console", customer: "John Doe", date: today },
  ];

  // State to manage visible orders
  const [visibleOrders, setVisibleOrders] = useState(3);

  // Show more orders
  const showMoreOrders = () => {
    setVisibleOrders((prev) => prev + 3);
  };

  // Show less orders (reset to initial count)
  const showLessOrders = () => {
    setVisibleOrders(3);
  };

  // Filter only today's orders
  const todaysOrders = orders.filter((order) => order.date === today);

  return (
    <Card>
      <CardBody>
        <CardTitle className="mb-4">Today's Orders</CardTitle>
        {todaysOrders.length > 0 ? (
          <>
            <Row>
              {todaysOrders.slice(0, visibleOrders).map((order) => (
                <Col md="6" sm="12" key={order.id} className="mb-3">
                  <Card className="shadow-sm p-3 text-center">
                    <FaBox size={30} className="text-warning mb-2" />
                    <h5 className="mb-1">{order.product}</h5>
                    <p className="text-muted mb-2">Customer: {order.customer}</p>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* View More / Show Less Buttons */}
            <div className="text-center mt-3">
              {visibleOrders < todaysOrders.length && (
                <Button color="secondary" onClick={showMoreOrders} className="me-2">
                  View More
                </Button>
              )}
              {visibleOrders > 3 && (
                <Button color="danger" onClick={showLessOrders}>
                  Show Less
                </Button>
              )}
            </div>
          </>
        ) : (
          <p className="text-center text-muted">No orders placed today.</p>
        )}
      </CardBody>
    </Card>
  );
};

export default Shipment;
