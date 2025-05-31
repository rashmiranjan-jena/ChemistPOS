import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import withRouter from "../../components/Common/withRouter";

import { Badge, Button, Card, CardBody } from "reactstrap";
import EcommerceOrdersModal from "../Ecommerce/EcommerceOrders/EcommerceOrdersModal";

import TableContainer from "../../components/Common/TableContainer";
import { Link } from "react-router-dom";

// Static order data
const orderData = [
  {
    id: 1,
    orderId: "#12345",
    billingName: "John Doe",
    orderDate: "2024-02-10",
    total: "$250.00",
    paymentStatus: "Paid",
    paymentMethod: "Visa",
  },
  {
    id: 2,
    orderId: "#12346",
    billingName: "Jane Smith",
    orderDate: "2024-02-09",
    total: "$150.00",
    paymentStatus: "Refund",
    paymentMethod: "Paypal",
  },
  {
    id: 3,
    orderId: "#12347",
    billingName: "Alice Johnson",
    orderDate: "2024-02-08",
    total: "$320.00",
    paymentStatus: "Pending",
    paymentMethod: "Mastercard",
  },
  {
    id: 4,
    orderId: "#12348",
    billingName: "Robert Brown",
    orderDate: "2024-02-07",
    total: "$400.00",
    paymentStatus: "Paid",
    paymentMethod: "COD",
  },
  {
    id: 5,
    orderId: "#12349",
    billingName: "Emily Davis",
    orderDate: "2024-02-06",
    total: "$220.00",
    paymentStatus: "Paid",
    paymentMethod: "Visa",
  },
  {
    id: 6,
    orderId: "#12350",
    billingName: "Michael Wilson",
    orderDate: "2024-02-05",
    total: "$180.00",
    paymentStatus: "Pending",
    paymentMethod: "Paypal",
  },
  {
    id: 7,
    orderId: "#12351",
    billingName: "Sarah Miller",
    orderDate: "2024-02-04",
    total: "$290.00",
    paymentStatus: "Paid",
    paymentMethod: "Mastercard",
  },
];

const LatestTransaction = () => {
  const [modal1, setModal1] = useState(false);
  const toggleViewModal = () => setModal1(!modal1);

  const [transaction, setTransaction] = useState("");
  const [showAllOrders, setShowAllOrders] = useState(false);

  const columns = useMemo(
    () => [
      {
        header: "Order ID",
        accessorKey: "orderId",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => (
          <Link to="#" className="text-body fw-bold">
            {cellProps.row.original.orderId}
          </Link>
        ),
      },
      {
        header: "Billing Name",
        accessorKey: "billingName",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: "Date",
        accessorKey: "orderDate",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: "Total",
        accessorKey: "total",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: "Payment Status",
        accessorKey: "paymentStatus",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          const status = cellProps.row.original.paymentStatus;
          const badgeColor =
            status === "Paid" ? "success" : status === "Refund" ? "warning" : "danger";

          return <Badge className={`font-size-11 badge-soft-${badgeColor}`}>{status}</Badge>;
        },
      },
      {
        header: "Payment Method",
        accessorKey: "paymentMethod",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          const method = cellProps.row.original.paymentMethod;
          const icons = {
            Paypal: "fab fa-cc-paypal me-1",
            COD: "fas fa-money-bill-alt me-1",
            Mastercard: "fab fa-cc-mastercard me-1",
            Visa: "fab fa-cc-visa me-1",
          };

          return (
            <span>
              <i className={icons[method] || ""} /> {method}
            </span>
          );
        },
      },
      {
        header: "View Details",
        accessorKey: "view",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => (
          <Button
            type="button"
            color="primary"
            className="btn-sm btn-rounded"
            onClick={() => {
              toggleViewModal();
              setTransaction(cellProps.row.original);
            }}
          >
            View Details
          </Button>
        ),
      },
    ],
    []
  );

  return (
    <React.Fragment>
      <EcommerceOrdersModal isOpen={modal1} toggle={toggleViewModal} transaction={transaction} />
      <Card>
        <CardBody>
          <div className="mb-4 h4 card-title">All Orders</div>

          {/* Scrollable Table Container */}
          <div style={{ maxHeight: showAllOrders ? "400px" : "200px", overflowY: "auto" }}>
            <TableContainer
              columns={columns}
              data={orderData} // Using static order data
              isGlobalFilter={false}
              tableClass="align-middle table-nowrap mb-0"
              theadClass="table-light"
            />
          </div>

          {/* Show All Orders Button */}
          <div className="text-center mt-3">
            <Button
              color="primary"
              onClick={() => setShowAllOrders(!showAllOrders)}
            >
              {showAllOrders ? "Show Less" : "Show All Orders"}
            </Button>
          </div>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

LatestTransaction.propTypes = {
  latestTransaction: PropTypes.array,
};

export default withRouter(LatestTransaction);
