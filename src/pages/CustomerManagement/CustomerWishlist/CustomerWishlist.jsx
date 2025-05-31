import React, { useState } from "react";
import {
  Button,
  Table,
  Card,
  CardBody,
  Input,
} from "reactstrap";

import Breadcrumbs from "../../../components/Common/Breadcrumb";

const CustomerWishlist = () => {
  // State for managing search query
  const [searchQuery, setSearchQuery] = useState("");

  const customers = [
    {
      id: 1,
      customerId: "C001",
      items: [
        { itemCode: "I001", itemName: "Item A" },
        { itemCode: "I002", itemName: "Item B" },
      ],
      customerEmail: "johndoe@example.com",
      customerWhatsappNo: "9876543210",
      mobNumber: "1234567890",
    },
    {
      id: 2,
      customerId: "C002",
      items: [
        { itemCode: "I003", itemName: "Item C" },
        { itemCode: "I004", itemName: "Item D" },
      ],
      customerEmail: "janesmith@example.com",
      customerWhatsappNo: "1122334455",
      mobNumber: "0987654321",
    },
    // Add more customers if needed
  ];

  // Filter customers based on the search query
  const filteredCustomers = customers.filter((customer) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      customer.customerId.toLowerCase().includes(searchLower) ||
      customer.customerEmail.toLowerCase().includes(searchLower) ||
      customer.items.some(
        (item) =>
          item.itemCode.toLowerCase().includes(searchLower) ||
          item.itemName.toLowerCase().includes(searchLower)
      )
    );
  });

  return (
    <div className="page-content">
      {/* Breadcrumb */}
      <Breadcrumbs title="Customer Wishlist" breadcrumbItem="All Customers" />

      <Card className="shadow">
        <CardBody>
          <div className="d-flex justify-content-between mb-4">
            <h4 className="text-primary">Customer Wishlist</h4>
            {/* Search Input */}
            <Input
              type="text"
              placeholder="Search by Customer ID, Item Code, Item Name, or Email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-50"
            />
          </div>

          <div className="table-responsive" style={{ maxHeight: "500px" }}>
            <Table bordered hover responsive className="custom-table">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>CustomerID</th>
                  <th>ItemCode</th>
                  <th>ItemName</th>
                  <th>CustomerEmail</th>
                  <th>CustomerWhatsappNo</th>
                  <th>MobNumber</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <tr key={customer.id}>
                      <td>{customer.id}</td>
                      <td>{customer.customerId}</td>
                      <td>
                        {customer.items.map((item, index) => (
                          <div key={index}>{item.itemCode}</div>
                        ))}
                      </td>
                      <td>
                        {customer.items.map((item, index) => (
                          <div key={index}>{item.itemName}</div>
                        ))}
                      </td>
                      <td>{customer.customerEmail}</td>
                      <td>{customer.customerWhatsappNo}</td>
                      <td>{customer.mobNumber}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No matching results found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default CustomerWishlist;
