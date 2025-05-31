import React from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button
} from "reactstrap";
import { ArrowCircleLeft, Delete } from "@mui/icons-material";

export default function HoldRetriveModel({ show, onHide, orders = [], onRetrieve, onDelete }) {
  return (
    <Modal isOpen={show} toggle={onHide} size="lg" centered>
      <ModalHeader toggle={onHide}>Retrieve Held Orders</ModalHeader>
      <ModalBody>
        {orders.length === 0 ? (
          <p className="text-center text-muted">No held orders available.</p>
        ) : (
          <div className="list-group">
            {orders.map((order, index) => (
              <div
                key={index}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <h6 className="mb-1">{order.customer_name}</h6>
                  <small className="text-muted">
                    Contact: {order.contact_number}
                  </small>
                  <br />
                  <small className="text-muted">
                    Items: {order.total_items} | Total: ₹{order.subtotal}
                  </small>
                </div>
                <div className="d-flex gap-2">
                  <Button
                    color="success"
                    size="sm"
                    onClick={() => onRetrieve(order)}
                    title="Retrieve Order"
                  >
                    <ArrowCircleLeft fontSize="small" />
                  </Button>
                  <Button
                    color="danger"
                    size="sm"
                    onClick={() => onDelete(order.hold_id)}
                    title="Delete Order"
                  >
                    <Delete fontSize="small" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={onHide}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
}
