import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";

const SalesBillReport = () => {
  // Static data
  const staticCustomers = [
    { id: "1", name: "John Doe", phone: "1234567890", email: "john@example.com" },
    { id: "2", name: "Jane Smith", phone: "0987654321", email: "jane@example.com" },
  ];

  const staticProducts = [
    { id: "P001", name: "Paracetamol", price: 10, stock: 100 },
    { id: "P002", name: "Aspirin", price: 15, stock: 50 },
    { id: "P003", name: "Ibuprofen", price: 20, stock: 75 },
  ];

  // State management
  const [customers, setCustomers] = useState(staticCustomers);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [newCustomer, setNewCustomer] = useState({ phone: "", name: "", email: "" });
  const [products, setProducts] = useState([]);
  const [inventory, setInventory] = useState(staticProducts);
  const [productInput, setProductInput] = useState("");
  const [discount, setDiscount] = useState(0);
  const [gst, setGst] = useState(0);
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [totalAmount, setTotalAmount] = useState(0);
  const [coupon, setCoupon] = useState("");

  // Recalculate total when products, discount, or GST change
  useEffect(() => {
    calculateTotal();
  }, [products, discount, gst]);

  // Handle customer changes
  const handleNewCustomerChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const updateCustomer = () => {
    if (newCustomer.phone && newCustomer.name && newCustomer.email) {
      const updatedCustomer = { id: String(customers.length + 1), ...newCustomer };
      setCustomers([...customers, updatedCustomer]);
      setSelectedCustomer(updatedCustomer);
      setNewCustomer({ phone: "", name: "", email: "" });
    } else {
      alert("Please fill all customer details!");
    }
  };

  // Handle product selection
  const fetchProductDetails = (productCode) => {
    const product = inventory.find((p) => p.id === productCode);
    if (product && product.stock > 0) {
      setProducts([...products, { ...product, quantity: 1 }]);
      setProductInput("");
    } else {
      alert("Product not found or out of stock!");
    }
  };

  const handleProductInput = (e) => {
    if (e.key === "Enter" && productInput) {
      fetchProductDetails(productInput);
    } else {
      setProductInput(e.target.value);
    }
  };

  // Update product quantity
  const updateQuantity = (index, quantity) => {
    const updatedProducts = [...products];
    const maxQuantity = inventory.find((p) => p.id === updatedProducts[index].id).stock;
    updatedProducts[index].quantity = Math.min(Math.max(1, quantity), maxQuantity);
    setProducts(updatedProducts);
  };

  // Calculate total amount
  const calculateTotal = () => {
    let subtotal = products.reduce(
      (sum, product) => sum + product.price * product.quantity,
      0
    );
    const discountAmount = subtotal * (discount / 100);
    const gstAmount = subtotal * (gst / 100);
    const finalTotal = subtotal - discountAmount + gstAmount;
    setTotalAmount(finalTotal);
  };

  // Apply GST and discounts
  const applyGstAndDiscount = () => {
    setGst(18);
    calculateTotal();
  };

  // Apply coupon (simulated)
  const applyCoupon = () => {
    if (coupon === "DISCOUNT10") {
      setDiscount(10); // Example: 10% discount
      calculateTotal();
      setCoupon("");
      alert("Coupon applied successfully!");
    } else {
      alert("Invalid coupon code!");
    }
  };

  // Process payment and update inventory
  const processPayment = () => {
    if (!selectedCustomer) {
      alert("Please select or add a customer!");
      return;
    }
    if (products.length === 0) {
      alert("Please add at least one product!");
      return;
    }

    const updatedInventory = inventory.map((item) => {
      const soldProduct = products.find((p) => p.id === item.id);
      if (soldProduct) {
        return { ...item, stock: item.stock - soldProduct.quantity };
      }
      return item;
    });
    setInventory(updatedInventory);

    const billData = {
      customer: selectedCustomer,
      products,
      discount,
      gst,
      totalAmount,
      paymentMode,
      date: new Date().toLocaleString(),
    };
    console.log("Receipt Generated:", billData);
    alert(
      `Payment processed successfully!\nReceipt:\nCustomer: ${selectedCustomer.name}\nTotal: ₹${totalAmount.toFixed(2)}\nMode: ${paymentMode}`
    );

    resetForm();
  };

  // Reset form
  const resetForm = () => {
    setSelectedCustomer(null);
    setProducts([]);
    setDiscount(0);
    setGst(0);
    setPaymentMode("Cash");
    setTotalAmount(0);
    setCoupon("");
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Sales" breadcrumbItem="Generate Sales Bill" />
          <Row>
            <Col xs="12">
              <Card className="shadow-sm" style={{ borderRadius: "10px" }}>
                <CardBody className="p-3">
                  {/* Header */}
                  <Row className="align-items-center mb-3">
                    <Col md="6">
                      <h4 className="text-muted">Search or Scan</h4>
                      <Input
                        type="text"
                        value={productInput}
                        onChange={handleProductInput}
                        onKeyPress={handleProductInput}
                        placeholder="Search or Scan"
                        style={{ borderRadius: "5px", padding: "8px" }}
                      />
                    </Col>
                    <Col md="6" className="text-end">
                      <span className="badge bg-dark me-2">T1-0038</span>
                      <span className="text-muted">10/03/2025</span>
                    </Col>
                  </Row>

                  {/* Customer Section */}
                  <Card className="bg-light p-3 mb-3" style={{ borderRadius: "5px" }}>
                    <h5 className="text-muted mb-2">Add Customer</h5>
                    <Row>
                      <Col md="4">
                        <FormGroup>
                          <Label className="text-muted" style={{ fontSize: "12px" }}>
                            Mobile Number
                          </Label>
                          <Input
                            type="text"
                            name="phone"
                            value={newCustomer.phone}
                            onChange={handleNewCustomerChange}
                            placeholder="Mobile Number"
                            style={{ borderRadius: "5px" }}
                          />
                        </FormGroup>
                      </Col>
                      <Col md="4">
                        <FormGroup>
                          <Label className="text-muted" style={{ fontSize: "12px" }}>
                            Name
                          </Label>
                          <Input
                            type="text"
                            name="name"
                            value={newCustomer.name}
                            onChange={handleNewCustomerChange}
                            placeholder="Name"
                            style={{ borderRadius: "5px" }}
                          />
                        </FormGroup>
                      </Col>
                      <Col md="4">
                        <FormGroup>
                          <Label className="text-muted" style={{ fontSize: "12px" }}>
                            Email
                          </Label>
                          <Input
                            type="email"
                            name="email"
                            value={newCustomer.email}
                            onChange={handleNewCustomerChange}
                            placeholder="Email"
                            style={{ borderRadius: "5px" }}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col md="12" className="text-end">
                        <Button
                          color="info"
                          onClick={updateCustomer}
                          style={{ borderRadius: "5px", marginRight: "10px" }}
                        >
                          UPDATE CUSTOMER
                        </Button>
                        <Button
                          color="primary"
                          onClick={() => alert("Customer Summary clicked")}
                          style={{ borderRadius: "5px", marginRight: "10px" }}
                        >
                          CUSTOMER SUMMARY
                        </Button>
                        <Button
                          color="danger"
                          onClick={resetForm}
                          style={{ borderRadius: "5px" }}
                        >
                          CLEAR
                        </Button>
                      </Col>
                    </Row>
                  </Card>

                  {/* Product Table (Placeholder) */}
                  <Card className="bg-light p-3" style={{ borderRadius: "5px" }}>
                    <h5 className="text-muted mb-2">Products</h5>
                    {/* Add product table or list here if needed */}
                  </Card>

                  {/* Payment Summary */}
                  <Col md="3" className="float-end">
                    <Card className="p-3" style={{ borderRadius: "5px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
                      <h5 className="text-muted mb-3">Payment Summary</h5>
                      <div className="mb-2">
                        <span>Total Items:</span> <span>{products.length}</span>
                      </div>
                      <div className="mb-2">
                        <span>Total Quantity:</span>{" "}
                        <span>{products.reduce((sum, p) => sum + p.quantity, 0)}</span>
                      </div>
                      <div className="mb-2">
                        <span>Subtotal:</span> <span>₹{totalAmount.toFixed(2)}</span>
                      </div>
                      <div className="mb-2" style={{ color: "red" }}>
                        <span>Total Discount:</span> <span>-₹{(totalAmount * (discount / 100)).toFixed(2)}</span>
                      </div>
                      <div className="mb-2">
                        <span>Extra Tax:</span> <span>₹{(totalAmount * (gst / 100)).toFixed(2)}</span>
                      </div>
                      <div className="mb-3">
                        <strong>Total:</strong> <strong>₹{totalAmount.toFixed(2)}</strong>
                      </div>
                      <FormGroup>
                        <Label className="text-muted" style={{ fontSize: "12px" }}>
                          Apply Coupon
                        </Label>
                        <Input
                          type="text"
                          value={coupon}
                          onChange={(e) => setCoupon(e.target.value)}
                          placeholder="Enter coupon code"
                          style={{ borderRadius: "5px" }}
                        />
                        <Button
                          color="info"
                          onClick={applyCoupon}
                          style={{ borderRadius: "5px", marginTop: "5px", width: "100%" }}
                        >
                          APPLY
                        </Button>
                      </FormGroup>
                      <Button
                        color="info"
                        onClick={processPayment}
                        style={{ borderRadius: "5px", marginTop: "10px", width: "100%" }}
                      >
                        PAY NOW
                      </Button>
                    </Card>
                  </Col>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default SalesBillReport;