import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Table,
  Badge,
  Button,
  Form,
  FormGroup,
  Input,
  Label,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Alert,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import Breadcrumbs from "/src/components/Common/Breadcrumb";
import {
  FaFilter,
  FaSyncAlt,
  FaChartLine,
  FaMoneyBillWave,
  FaReceipt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { format, subDays } from "date-fns";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Bar, Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

import {
  fetchTransactions,
  fetchPayables,
  fetchReceivables,
} from "../../../ApiService/AccountingManagement/FinancialTransation";

Chart.register(...registerables);

const FinancialTransactionsList = () => {
  // State for data, filters, and pagination
  const [transactions, setTransactions] = useState([]);
  const [receivables, setReceivables] = useState([]);
  const [payables, setPayables] = useState([]);
  const [filterType, setFilterType] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [activeTab, setActiveTab] = useState("1");
  const [timeRange, setTimeRange] = useState("7days");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [supplierPaymentModalOpen, setSupplierPaymentModalOpen] =
    useState(false);
  const [loading, setLoading] = useState({
    transactions: false,
    receivables: false,
    payables: false,
  });
  const [error, setError] = useState({
    transactions: null,
    receivables: null,
    payables: null,
  });
  const [pagination, setPagination] = useState({
    transactions: { currentPage: 1, pageSize: 10, totalCount: 0 },
    receivables: { currentPage: 1, pageSize: 10, totalCount: 0 },
    payables: { currentPage: 1, pageSize: 10, totalCount: 0 },
  });

  const navigate = useNavigate();

  // Toggle modals
  const toggleFilterModal = () => setFilterModalOpen(!filterModalOpen);
  const toggleSupplierPaymentModal = () =>
    setSupplierPaymentModalOpen(!supplierPaymentModalOpen);

  // Toggle tabs and fetch data
  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
      if (tab === "1" && transactions.length === 0) {
        fetchTransactionsData(1);
      } else if (tab === "2" && receivables.length === 0) {
        fetchReceivablesData(1);
      } else if (tab === "3" && payables.length === 0) {
        fetchPayablesData(1);
      }
    }
  };

  // Fetch transactions data with pagination
  const fetchTransactionsData = async (page = 1) => {
    setLoading((prev) => ({ ...prev, transactions: true }));
    setError((prev) => ({ ...prev, transactions: null }));
    try {
      const response = await fetchTransactions(
        page,
        pagination.transactions.pageSize
      );
      const { current_page, page_size, total_count, results } = response;

      // Transform API response to match component's transaction structure
      const transformedTransactions = (results || [])
        .map((txn) => {
          if (txn.slip_no) {
            // Supplier bills (Expenses)
            return {
              id: txn.slip_no,
              date: txn.payment_date,
              type: "Expense",
              invoiceNumber: txn.invoice_number,
              party: txn.supplier_name,
              category: "Supplier Payment",
              amount: txn.amount_paid,
              taxAmount: 0, // No tax data in API
              description: `Payment to ${txn.supplier_name}`,
              paymentMethod: txn.payment_mode,
            };
          } else if (
            txn.order_id &&
            txn.customer_name &&
            txn.paid_amount !== undefined
          ) {
            // Customer collections (Income)
            return {
              id: txn.order_id,
              date: txn.payment_date,
              type: "Income",
              invoiceNumber: txn.order_id,
              party: txn.customer_name,
              category: "Customer Payment",
              amount: txn.paid_amount,
              taxAmount: 0,
              description: `Payment from ${txn.customer_name}`,
              paymentMethod: txn.payment_mode,
            };
          } else if (txn.order_id && txn.total_bill_amount !== undefined) {
            // Sales orders (Income)
            return {
              id: txn.order_id,
              date: txn.payment_date,
              type: "Income",
              invoiceNumber: txn.order_id,
              party: txn.customer_name,
              category: "Sales",
              amount: txn.total_bill_amount,
              taxAmount: 0,
              description: `Sales order for ${txn.customer_name}`,
              paymentMethod: txn.payment_mode,
            };
          }
          return null;
        })
        .filter((txn) => txn !== null);

      setTransactions(transformedTransactions);
      setPagination((prev) => ({
        ...prev,
        transactions: {
          currentPage: current_page,
          pageSize: page_size,
          totalCount: total_count,
        },
      }));
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError((prev) => ({
        ...prev,
        transactions: "Failed to load transactions",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, transactions: false }));
    }
  };

  // Fetch receivables data
  const fetchReceivablesData = async (page = 1) => {
    setLoading((prev) => ({ ...prev, receivables: true }));
    setError((prev) => ({ ...prev, receivables: null }));
    try {
      const response = await fetchReceivables(
        page,
        pagination.receivables.pageSize
      );
      const receivablesData = response.results || [];

      // Filter for pending or partial payments
      const filteredReceivables = receivablesData.filter(
        (rec) =>
          rec.credit_status === "Pending" || rec.credit_status === "Partial"
      );

      // Transform API response
      const transformedReceivables = filteredReceivables.map((rec) => ({
        id: rec.order_id,
        customer: rec.customer_name,
        amount: rec.total_bill_amount,
        dueDate: rec.created_at,
        invoiceNumber: rec.order_id,
      }));

      setReceivables(transformedReceivables);
      setPagination((prev) => ({
        ...prev,
        receivables: {
          currentPage: response.current_page,
          pageSize: response.page_size,
          totalCount: response.total_count,
        },
      }));
    } catch (err) {
      console.error("Error fetching receivables:", err);
      setError((prev) => ({
        ...prev,
        receivables: "Failed to load receivables",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, receivables: false }));
    }
  };

  // Fetch payables data
  const fetchPayablesData = async (page = 1) => {
    setLoading((prev) => ({ ...prev, payables: true }));
    setError((prev) => ({ ...prev, payables: null }));
    try {
      const response = await fetchPayables(page, pagination.payables.pageSize);
      const supplierBills = response.results?.supplier_bills || [];

      // Transform API response
      const transformedPayables = supplierBills.map((bill) => ({
        id: bill.slip_no,
        supplier: bill.supplier_name,
        amount: bill.amount_paid,
        dueDate: bill.payment_date,
        invoiceNumber: bill.invoice_number,
      }));

      setPayables(transformedPayables);
      setPagination((prev) => ({
        ...prev,
        payables: {
          currentPage: response.current_page,
          pageSize: response.page_size,
          totalCount: response.total_count,
        },
      }));
    } catch (err) {
      console.error("Error fetching payables:", err);
      setError((prev) => ({ ...prev, payables: "Failed to load payables" }));
    } finally {
      setLoading((prev) => ({ ...prev, payables: false }));
    }
  };

  // Fetch transactions on component mount for the default tab
  useEffect(() => {
    if (activeTab === "1") {
      fetchTransactionsData(1);
    }
  }, []);

  // Handle pagination
  const handlePageChange = (tab, page) => {
    if (tab === "1") {
      fetchTransactionsData(page);
    } else if (tab === "2") {
      fetchReceivablesData(page);
    } else if (tab === "3") {
      fetchPayablesData(page);
    }
  };

  // Get unique categories for filter
  const categories = [
    "All",
    ...new Set(transactions.map((txn) => txn.category)),
  ];

  // Apply time range filter
  useEffect(() => {
    if (timeRange === "7days") {
      const sevenDaysAgo = subDays(new Date(), 7);
      setStartDate(format(sevenDaysAgo, "yyyy-MM-dd"));
      setEndDate(format(new Date(), "yyyy-MM-dd"));
    } else if (timeRange === "30days") {
      const thirtyDaysAgo = subDays(new Date(), 30);
      setStartDate(format(thirtyDaysAgo, "yyyy-MM-dd"));
      setEndDate(format(new Date(), "yyyy-MM-dd"));
    } else if (timeRange === "all") {
      setStartDate("");
      setEndDate("");
    }
  }, [timeRange]);

  // Filter transactions
  const filteredTransactions = transactions.filter((txn) => {
    const txnDate = new Date(txn.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    const matchesSearch =
      searchTerm === "" ||
      txn.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (txn.category &&
        txn.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (txn.paymentMethod &&
        txn.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (txn.party &&
        txn.party.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (txn.invoiceNumber &&
        txn.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
      (filterType === "All" || txn.type === filterType) &&
      (filterCategory === "All" || txn.category === filterCategory) &&
      (!start || txnDate >= start) &&
      (!end || txnDate <= end) &&
      matchesSearch
    );
  });

  // Calculate financial summary
  const calculateSummary = () => {
    const income = transactions
      .filter((txn) => txn.type === "Income")
      .reduce((sum, txn) => sum + txn.amount, 0);
    const expenses = transactions
      .filter((txn) => txn.type === "Expense")
      .reduce((sum, txn) => sum + txn.amount, 0);
    const taxes = transactions.reduce((sum, txn) => sum + txn.taxAmount, 0);
    const incomeByCategory = {};
    const expenseByCategory = {};

    transactions.forEach((txn) => {
      if (txn.type === "Income") {
        incomeByCategory[txn.category] =
          (incomeByCategory[txn.category] || 0) + txn.amount;
      } else {
        expenseByCategory[txn.category] =
          (expenseByCategory[txn.category] || 0) + txn.amount;
      }
    });

    return {
      income,
      expenses,
      taxes,
      incomeByCategory,
      expenseByCategory,
      netCashFlow: income - expenses,
    };
  };

  const summary = calculateSummary();

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "dd MMM yyyy HH:mm");
    } catch {
      return "Invalid Date";
    }
  };

  // Prepare chart data
  const prepareChartData = () => {
    const incomeExpenseData = {
      labels: ["Income", "Expenses", "Taxes"],
      datasets: [
        {
          label: "Amount (₹)",
          data: [summary.income, summary.expenses, summary.taxes],
          backgroundColor: [
            "rgba(75, 192, 192, 0.6)",
            "rgba(255, 99, 132, 0.6)",
            "rgba(255, 206, 86, 0.6)",
          ],
          borderColor: [
            "rgba(75, 192, 192, 1)",
            "rgba(255, 99, 132, 1)",
            "rgba(255, 206, 86, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };

    const incomeCategoryData = {
      labels: Object.keys(summary.incomeByCategory),
      datasets: [
        {
          label: "Income by Category",
          data: Object.values(summary.incomeByCategory),
          backgroundColor: [
            "rgba(75, 192, 192, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(153, 102, 255, 0.6)",
            "rgba(255, 159, 64, 0.6)",
          ],
          borderColor: [
            "rgba(75, 192, 192, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };

    const expenseCategoryData = {
      labels: Object.keys(summary.expenseByCategory),
      datasets: [
        {
          label: "Expenses by Category",
          data: Object.values(summary.expenseByCategory),
          backgroundColor: [
            "rgba(255, 99, 132, 0.6)",
            "rgba(255, 206, 86, 0.6)",
            "rgba(255, 159, 64, 0.6)",
            "rgba(153, 102, 255, 0.6)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(255, 159, 64, 1)",
            "rgba(153, 102, 255, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };

    return { incomeExpenseData, incomeCategoryData, expenseCategoryData };
  };

  const chartData = prepareChartData();

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Financial Transactions Report", 14, 20);
    doc.setFontSize(12);
    doc.text(
      `Period: ${startDate ? formatDate(startDate) : "All time"} to ${
        endDate ? formatDate(endDate) : "Present"
      }`,
      14,
      30
    );
    doc.text(`Total Income: ₹${summary.income.toFixed(2)}`, 14, 40);
    doc.text(`Total Expenses: ₹${summary.expenses.toFixed(2)}`, 14, 50);
    doc.text(`Total Taxes: ₹${summary.taxes.toFixed(2)}`, 14, 60);
    doc.autoTable({
      startY: 70,
      head: [
        [
          "ID",
          "Type",
          "Date",
          "Inv-No",
          "Party",
          "Category",
          "Amount",
          "Tax",
          "Payment Method",
        ],
      ],
      body: filteredTransactions.map((txn) => [
        txn.id,
        txn.type,
        formatDate(txn.date),
        txn.invoiceNumber,
        txn.party,
        txn.category,
        `₹${txn.amount.toFixed(2)}`,
        `₹${txn.taxAmount.toFixed(2)}`,
        txn.paymentMethod || "N/A",
      ]),
      theme: "striped",
      headStyles: { fillColor: [0, 123, 255], textColor: 255 },
      styles: { cellPadding: 3, fontSize: 10 },
    });
    doc.save("financial_transactions.pdf");
  };

  // Reset filters
  const resetFilters = () => {
    setFilterType("All");
    setFilterCategory("All");
    setStartDate("");
    setEndDate("");
    setSearchTerm("");
    setTimeRange("7days");
    setFilterModalOpen(false);
  };

  // Apply filters
  const applyFilters = () => {
    setFilterModalOpen(false);
  };

  // Handle back navigation
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Row className="mb-3 align-items-center">
          <Col md="12">
            <Breadcrumbs
              title="Pharmacy Accounting"
              breadcrumbItem="Financial Dashboard"
            />
          </Col>
          <Col md="12">
            <div className="d-flex flex-wrap gap-2 justify-content-end">
              <Button
                color="info"
                onClick={toggleFilterModal}
                style={{
                  height: "35px",
                  padding: "3px 10px",
                  borderRadius: "10px",
                  fontSize: "14px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                  transition: "transform 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
                className="hover-scale"
              >
                <FaFilter style={{ fontSize: "18px" }} />
                Filter
              </Button>
              <Button
                color="secondary"
                onClick={handleBack}
                style={{
                  height: "35px",
                  width: "35px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                  transition: "transform 0.3s ease",
                }}
                className="hover-scale"
                title="Back"
              >
                <i className="bx bx-undo" style={{ fontSize: "18px" }}></i>
              </Button>
            </div>
          </Col>
        </Row>

        {/* Financial Summary */}
        <Row className="mb-4">
          <Col md="4">
            <Card className="shadow-lg stylish-card income-card">
              <CardBody>
                <div className="d-flex align-items-center">
                  <div className="me-3">
                    <FaMoneyBillWave size={30} className="text-white" />
                  </div>
                  <div>
                    <h6 className="text-light mb-1">Total Income</h6>
                    <h4 className="text-white mb-0">
                      ₹{summary.income.toFixed(2)}
                    </h4>
                    <small className="text-light">
                      {
                        filteredTransactions.filter((t) => t.type === "Income")
                          .length
                      }{" "}
                      transactions
                    </small>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col md="4">
            <Card className="shadow-lg stylish-card expense-card">
              <CardBody>
                <div className="d-flex align-items-center">
                  <div className="me-3">
                    <FaReceipt size={30} className="text-white" />
                  </div>
                  <div>
                    <h6 className="text-light mb-1">Total Expenses</h6>
                    <h4 className="text-white mb-0">
                      ₹{summary.expenses.toFixed(2)}
                    </h4>
                    <small className="text-light">
                      {
                        filteredTransactions.filter((t) => t.type === "Expense")
                          .length
                      }{" "}
                      transactions
                    </small>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col md="4">
            <Card className="shadow-lg stylish-card tax-card">
              <CardBody>
                <div className="d-flex align-items-center">
                  <div className="me-3">
                    <FaChartLine size={30} className="text-white" />
                  </div>
                  <div>
                    <h6 className="text-light mb-1">Total Taxes</h6>
                    <h4 className="text-white mb-0">
                      ₹{summary.taxes.toFixed(2)}
                    </h4>
                    <small className="text-light">
                      {summary.taxes > 0
                        ? "Includes GST/VAT"
                        : "No taxes recorded"}
                    </small>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Charts Row */}
        <Row className="mb-4">
          <Col md="4">
            <Card className="shadow-lg stylish-card">
              <CardBody>
                <CardTitle className="gradient-text">
                  Income vs Expenses
                </CardTitle>
                <div style={{ height: "250px" }}>
                  <Bar
                    data={chartData.incomeExpenseData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: { y: { beginAtZero: true } },
                    }}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col md="4">
            <Card className="shadow-lg stylish-card">
              <CardBody>
                <CardTitle className="gradient-text">
                  Income by Category
                </CardTitle>
                <div style={{ height: "250px" }}>
                  <Pie
                    data={chartData.incomeCategoryData}
                    options={{ responsive: true, maintainAspectRatio: false }}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col md="4">
            <Card className="shadow-lg stylish-card">
              <CardBody>
                <CardTitle className="gradient-text">
                  Expenses by Category
                </CardTitle>
                <div style={{ height: "250px" }}>
                  <Pie
                    data={chartData.expenseCategoryData}
                    options={{ responsive: true, maintainAspectRatio: false }}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Navigation Tabs */}
        <Row className="mb-4">
          <Col md="12">
            <Nav tabs className="nav-tabs-custom">
              <NavItem>
                <NavLink
                  className={activeTab === "1" ? "active" : ""}
                  onClick={() => toggleTab("1")}
                >
                  Transactions
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={activeTab === "2" ? "active" : ""}
                  onClick={() => toggleTab("2")}
                >
                  Receivables
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={activeTab === "3" ? "active" : ""}
                  onClick={() => toggleTab("3")}
                >
                  Payables
                </NavLink>
              </NavItem>
            </Nav>
          </Col>
        </Row>

        {/* Tab Content */}
        <TabContent activeTab={activeTab}>
          <TabPane tabId="1">
            <Row>
              <Col md="12">
                <Card className="shadow-lg stylish-card">
                  <CardBody className="p-4 scrollable-card">
                    <CardTitle className="mb-4 gradient-text">
                      Financial Transactions
                    </CardTitle>
                    {loading.transactions && (
                      <Alert color="info">Loading transactions...</Alert>
                    )}
                    {error.transactions && (
                      <Alert color="danger">{error.transactions}</Alert>
                    )}
                    {!loading.transactions && !error.transactions && (
                      <>
                        <Table className="table table-striped table-hover align-middle stylish-table">
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Type</th>
                              <th>Date and Time</th>
                              <th>Inv-No</th>
                              <th>Party</th>
                              <th>Category</th>
                              <th>Amount</th>
                              <th>Tax (GST/TCS/TDS)</th>
                              <th>Payment Method</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredTransactions.length === 0 ? (
                              <tr>
                                <td colSpan="9" className="text-center">
                                  No transactions found
                                </td>
                              </tr>
                            ) : (
                              filteredTransactions.map((txn) => (
                                <tr key={txn.id} className="table-row-hover">
                                  <td>{txn.id}</td>
                                  <td>
                                    <Badge
                                      color={
                                        txn.type === "Income"
                                          ? "success"
                                          : "danger"
                                      }
                                      className="stylish-badge"
                                    >
                                      {txn.type}
                                    </Badge>
                                  </td>
                                  <td>{formatDate(txn.date)}</td>
                                  <td>{txn.invoiceNumber}</td>
                                  <td>{txn.party}</td>
                                  <td>{txn.category}</td>
                                  <td>₹{txn.amount.toFixed(2)}</td>
                                  <td>₹{txn.taxAmount.toFixed(2)}</td>
                                  <td>{txn.paymentMethod || "N/A"}</td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </Table>
                        <div className="d-flex justify-content-between mt-3">
                          <Button
                            color="primary"
                            disabled={pagination.transactions.currentPage === 1}
                            onClick={() =>
                              handlePageChange(
                                "1",
                                pagination.transactions.currentPage - 1
                              )
                            }
                          >
                            Previous
                          </Button>
                          <span>
                            Page {pagination.transactions.currentPage} of{" "}
                            {Math.ceil(
                              pagination.transactions.totalCount /
                                pagination.transactions.pageSize
                            )}
                          </span>
                          <Button
                            color="primary"
                            disabled={
                              pagination.transactions.currentPage >=
                              Math.ceil(
                                pagination.transactions.totalCount /
                                  pagination.transactions.pageSize
                              )
                            }
                            onClick={() =>
                              handlePageChange(
                                "1",
                                pagination.transactions.currentPage + 1
                              )
                            }
                          >
                            Next
                          </Button>
                        </div>
                      </>
                    )}
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tabId="2">
            <Row>
              <Col md="12">
                <Card className="shadow-lg stylish-card">
                  <CardBody className="p-4 scrollable-card">
                    <CardTitle className="mb-4 gradient-text">
                      Receivables (Pending Payments)
                    </CardTitle>
                    {loading.receivables && (
                      <Alert color="info">Loading receivables...</Alert>
                    )}
                    {error.receivables && (
                      <Alert color="danger">{error.receivables}</Alert>
                    )}
                    {!loading.receivables && !error.receivables && (
                      <>
                        <div className="mb-3">
                          <Alert color="info">
                            Total Outstanding: ₹
                            {receivables
                              .reduce((sum, rec) => sum + rec.amount, 0)
                              .toFixed(2)}
                          </Alert>
                        </div>
                        <Table className="table table-striped table-hover align-middle stylish-table">
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Customer</th>
                              <th>Invoice #</th>
                              <th>Amount</th>
                              <th>Due Date</th>
                              <th>Days Left</th>
                            </tr>
                          </thead>
                          <tbody>
                            {receivables.length === 0 ? (
                              <tr>
                                <td colSpan="7" className="text-center">
                                  No receivables found
                                </td>
                              </tr>
                            ) : (
                              receivables.map((rec) => {
                                const dueDate = new Date(rec.dueDate);
                                const today = new Date();
                                const daysLeft = Math.ceil(
                                  (dueDate - today) / (1000 * 60 * 60 * 24)
                                );

                                return (
                                  <tr key={rec.id} className="table-row-hover">
                                    <td>{rec.id}</td>
                                    <td>{rec.customer}</td>
                                    <td>{rec.invoiceNumber}</td>
                                    <td>₹{rec.amount.toFixed(2)}</td>
                                    <td>{formatDate(rec.dueDate)}</td>
                                    <td>
                                      <Badge
                                        color={
                                          daysLeft < 0
                                            ? "danger"
                                            : daysLeft <= 3
                                            ? "warning"
                                            : "success"
                                        }
                                        className="stylish-badge"
                                      >
                                        {daysLeft < 0
                                          ? `${Math.abs(daysLeft)} days overdue`
                                          : `${daysLeft} days`}
                                      </Badge>
                                    </td>
                                  </tr>
                                );
                              })
                            )}
                          </tbody>
                        </Table>
                        <div className="d-flex justify-content-between mt-3">
                          <Button
                            color="primary"
                            disabled={pagination.receivables.currentPage === 1}
                            onClick={() =>
                              handlePageChange(
                                "2",
                                pagination.receivables.currentPage - 1
                              )
                            }
                          >
                            Previous
                          </Button>
                          <span>
                            Page {pagination.receivables.currentPage} of{" "}
                            {Math.ceil(
                              pagination.receivables.totalCount /
                                pagination.receivables.pageSize
                            )}
                          </span>
                          <Button
                            color="primary"
                            disabled={
                              pagination.receivables.currentPage >=
                              Math.ceil(
                                pagination.receivables.totalCount /
                                  pagination.receivables.pageSize
                              )
                            }
                            onClick={() =>
                              handlePageChange(
                                "2",
                                pagination.receivables.currentPage + 1
                              )
                            }
                          >
                            Next
                          </Button>
                        </div>
                      </>
                    )}
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tabId="3">
            <Row>
              <Col md="12">
                <Card className="shadow-lg stylish-card">
                  <CardBody className="p-4 scrollable-card">
                    <CardTitle className="mb-4 gradient-text">
                      Payables (Pending Payments)
                    </CardTitle>
                    {loading.payables && (
                      <Alert color="info">Loading payables...</Alert>
                    )}
                    {error.payables && (
                      <Alert color="danger">{error.payables}</Alert>
                    )}
                    {!loading.payables && !error.payables && (
                      <>
                        <div className="mb-3">
                          <Alert color="info">
                            Total Payables: ₹
                            {payables
                              .reduce((sum, pay) => sum + pay.amount, 0)
                              .toFixed(2)}
                          </Alert>
                        </div>
                        <Table className="table table-striped table-hover align-middle stylish-table">
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Supplier</th>
                              <th>Invoice #</th>
                              <th>Amount</th>
                              <th>Due Date</th>
                              <th>Days Left</th>
                            </tr>
                          </thead>
                          <tbody>
                            {payables.length === 0 ? (
                              <tr>
                                <td colSpan="7" className="text-center">
                                  No payables found
                                </td>
                              </tr>
                            ) : (
                              payables.map((pay) => {
                                const dueDate = new Date(pay.dueDate);
                                const today = new Date();
                                const daysLeft = Math.ceil(
                                  (dueDate - today) / (1000 * 60 * 60 * 24)
                                );

                                return (
                                  <tr key={pay.id} className="table-row-hover">
                                    <td>{pay.id}</td>
                                    <td>{pay.supplier}</td>
                                    <td>{pay.invoiceNumber}</td>
                                    <td>₹{pay.amount.toFixed(2)}</td>
                                    <td>{formatDate(pay.dueDate)}</td>
                                    <td>
                                      <Badge
                                        color={
                                          daysLeft < 0
                                            ? "danger"
                                            : daysLeft <= 3
                                            ? "warning"
                                            : "success"
                                        }
                                        className="stylish-badge"
                                      >
                                        {daysLeft < 0
                                          ? `${Math.abs(daysLeft)} days overdue`
                                          : `${daysLeft} days`}
                                      </Badge>
                                    </td>
                                  </tr>
                                );
                              })
                            )}
                          </tbody>
                        </Table>
                        <div className="d-flex justify-content-between mt-3">
                          <Button
                            color="primary"
                            disabled={pagination.payables.currentPage === 1}
                            onClick={() =>
                              handlePageChange(
                                "3",
                                pagination.payables.currentPage - 1
                              )
                            }
                          >
                            Previous
                          </Button>
                          <span>
                            Page {pagination.payables.currentPage} of{" "}
                            {Math.ceil(
                              pagination.payables.totalCount /
                                pagination.payables.pageSize
                            )}
                          </span>
                          <Button
                            color="primary"
                            disabled={
                              pagination.payables.currentPage >=
                              Math.ceil(
                                pagination.payables.totalCount /
                                  pagination.payables.pageSize
                              )
                            }
                            onClick={() =>
                              handlePageChange(
                                "3",
                                pagination.payables.currentPage + 1
                              )
                            }
                          >
                            Next
                          </Button>
                        </div>
                      </>
                    )}
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </TabPane>
        </TabContent>

        {/* Filter Modal */}
        <Modal isOpen={filterModalOpen} toggle={toggleFilterModal}>
          <ModalHeader toggle={toggleFilterModal}>
            Filter Transactions
          </ModalHeader>
          <ModalBody>
            <Form>
              <Row className="g-3">
                <Col md="12">
                  <FormGroup>
                    <Label>Search</Label>
                    <Input
                      type="text"
                      placeholder="ID, Description, Category, Party, Invoice..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="input-3d"
                    />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label>Type</Label>
                    <Input
                      type="select"
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="input-3d"
                    >
                      <option value="All">All</option>
                      <option value="Income">Income</option>
                      <option value="Expense">Expense</option>
                    </Input>
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label>Category</Label>
                    <Input
                      type="select"
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="input-3d"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </Input>
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label>Time Range</Label>
                    <Input
                      type="select"
                      value={timeRange}
                      onChange={(e) => setTimeRange(e.target.value)}
                      className="input-3d"
                    >
                      <option value="7days">Last 7 Days</option>
                      <option value="30days">Last 30 Days</option>
                      <option value="all">All Time</option>
                    </Input>
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="input-3d"
                    />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label>End Date</Label>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="input-3d"
                    />
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={applyFilters} className="btn-3d">
              Apply Filters
            </Button>
            <Button color="warning" onClick={resetFilters} className="btn-3d">
              <FaSyncAlt className="me-1" /> Reset
            </Button>
            <Button
              color="secondary"
              onClick={toggleFilterModal}
              className="btn-3d"
            >
              Cancel
            </Button>
          </ModalFooter>
        </Modal>

        {/* Supplier Payment Modal */}
        <Modal
          isOpen={supplierPaymentModalOpen}
          toggle={toggleSupplierPaymentModal}
        >
          <ModalHeader toggle={toggleSupplierPaymentModal}>
            Supplier Wise Payment
          </ModalHeader>
          <ModalBody>
            <p>Supplier payment functionality to be implemented.</p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="secondary"
              onClick={toggleSupplierPaymentModal}
              className="btn-3d"
            >
              Close
            </Button>
          </ModalFooter>
        </Modal>
      </Container>

      <style jsx>{`
        .stylish-card {
          border: none;
          border-radius: 15px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          overflow: hidden;
        }
        .income-card {
          background: linear-gradient(135deg, #4bc0c0, #36a2eb);
        }
        .expense-card {
          background: linear-gradient(135deg, #ff6384, #ff9966);
        }
        .tax-card {
          background: linear-gradient(135deg, #ffcd56, #ff9f40);
        }
        .stylish-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        }
        .gradient-text {
          background: linear-gradient(90deg, #007bff, #00c4cc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 600;
        }
        .stylish-badge {
          font-size: 12px;
          padding: 6px 12px;
          border-radius: 12px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s ease;
        }
        .stylish-badge:hover {
          transform: scale(1.1);
        }
        .stylish-table {
          background: transparent;
          border-collapse: separate;
          border-spacing: 0 10px;
        }
        .stylish-table thead th {
          background: rgba(0, 123, 255, 0.8);
          color: #fff;
          padding: 12px;
          border: none;
        }
        .stylish-table tbody td {
          background: rgba(255, 255, 255, 0.9);
          border-radius: 8px;
          padding: 12px;
          border: none;
        }
        .table-row-hover:hover {
          background: rgba(0, 123, 255, 0.1) !important;
          transition: background 0.2s ease;
        }
        .scrollable-card {
          max-height: 500px;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: #007bff #e9ecef;
        }
        .scrollable-card::-webkit-scrollbar {
          width: 8px;
        }
        .scrollable-card::-webkit-scrollbar-track {
          background: #e9ecef;
          border-radius: 10px;
        }
        .scrollable-card::-webkit-scrollbar-thumb {
          background: #007bff;
          border-radius: 10px;
        }
        .input-3d {
          border: none;
          border-radius: 8px;
          padding: 10px;
          background: #fff;
          box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.1),
            inset -2px -2px 5px rgba(255, 255, 255, 0.7);
          transition: all 0.3s ease;
        }
        .input-3d:focus {
          box-shadow: inset 1px 1px 3px rgba(0, 0, 0, 0.2),
            inset -1px -1px 3px rgba(255, 255, 255, 0.9);
          outline: none;
        }
        .btn-3d {
          border: none;
          border-radius: 8px;
          padding: 8px 20px;
          box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.2),
            -3px -3px 6px rgba(255, 255, 255, 0.7);
          transition: all 0.2s ease;
        }
        .btn-3d:hover {
          box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25),
            -2px -2px 4px rgba(255, 255, 255, 0.8);
          transform: translateY(1px);
        }
        .nav-tabs-custom .nav-link {
          border: none;
          color: #495057;
          font-weight: 500;
          padding: 12px 20px;
          border-radius: 8px 8px 0 0;
          margin-right: 5px;
          background: rgba(0, 123, 255, 0.1);
        }
        .nav-tabs-custom .nav-link.active {
          color: #fff;
          background: #007bff;
          box-shadow: 0 -3px 10px rgba(0, 123, 255, 0.3);
        }
        .hover-scale:hover {
          transform: scale(1.05) !important;
        }
        @media (max-width: 768px) {
          .stylish-card {
            margin-bottom: 20px;
          }
          .form-group {
            width: 100%;
          }
          .gradient-text {
            font-size: 1.2rem;
          }
          .nav-tabs-custom .nav-link {
            padding: 8px 12px;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
};

export default FinancialTransactionsList;
