import React, { useState, useEffect } from "react";
import { FaEye, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { Button, Table, Card, CardBody, Input, Label } from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchStockData } from "../../../ApiService/Stockinventory/Stockinventory";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import axios from "axios";

const SupplierProductDetails = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [file, setFile] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { suppliername, id } = location.state || {};

  console.log("suppliername for stock--->", suppliername);
  console.log("id for stock--->", id);
  useEffect(() => {
    const fetchOrders = async () => {
      if (!id) return;
      try {
        const response = await fetchStockData(id);
        setOrders(response.data);
        setFilteredOrders(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Error Fetching Orders",
          text: "There was an error while fetching the data. Please try again later.",
        });
      }
    };

    fetchOrders();
  }, [id]);

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = orders.filter((order) =>
      Object.values(order).join(" ").toLowerCase().includes(value)
    );
    setFilteredOrders(filtered);
  };

  const handleNavigation = (suppliername, id) => {
    navigate("/stockinventory", { state: { suppliername, id } });
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(10);
    doc.text("Supplier Product Details", 14, 10);

    doc.autoTable({
      head: [
        [
          "#",
          "Invoice No",
          "Date",
          "Amount",
          "Mrp",
          "Brand",
          "Category",
          "Subcategory",
          "Product",
          "Item Code",
          "Quantity",
        ],
      ],
      body: filteredOrders.map((order, idx) => [
        idx + 1,
        order.invoice_no,
        order.invoice_date,
        order.amount,
        order.mrp,
        order.brand_name,
        order.category_name,
        order.sub_category_name,
        order.product_name,
        order.item_code,
        order.quantity,
      ]),
      styles: { fontSize: 4 },
      headStyles: { fontSize: 6 },
    });
    doc.save("Supplier_Product_Details.pdf");
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredOrders.map((order, idx) => ({
        "#": idx + 1,
        "Invoice No": order.invoice_no,
        Date: order.invoice_date,
        Amount: order.amount,
        Mrp: order.mrp,
        Brand: order.brand_name,
        Category: order.category_name,
        Subcategory: order.sub_category_name,
        Product: order.product_name,
        "Item Code": order.item_code,
        Quantity: order.quantity,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SupplierProductDetails");
    XLSX.writeFile(workbook, "Supplier_Product_Details.xlsx");
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFile(file);
    const reader = new FileReader();

    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      console.log("Parsed Excel Data:", jsonData);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios.post(
          "https://your-backend-api.com/upload",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        Swal.fire({
          icon: "success",
          title: "Upload Successful",
          text: "Excel file has been uploaded successfully!",
        });

        console.log("Upload Response:", response.data);
      } catch (error) {
        console.error("Upload Error:", error);
        Swal.fire({
          icon: "error",
          title: "Upload Failed",
          text: "There was an issue uploading the file. Please try again.",
        });
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleEdit=(id)=>{
   alert(id)
  }
  const handleDelete = (id) =>{
    alert(id)
  }

  return (
    <div className="page-content">
      <Breadcrumbs
        title="Supplier Product Details List"
        breadcrumbItem="Supplier Product Details List"
      />

      <Card className="shadow">
        <CardBody>
          <div className="d-flex justify-content-between mb-4">
            <div>
              <Button color="primary" onClick={downloadPDF} className="me-2">
                Download PDF
              </Button>
              <Button color="secondary" onClick={downloadExcel}>
                Download Excel
              </Button>
            </div>
            <Button
              color="success"
              onClick={() => handleNavigation(suppliername, id)}
            >
              Go to Stock Inventory
            </Button>
          </div>

          <Input
            type="text"
            placeholder="Search The Items......."
            value={searchTerm}
            onChange={handleSearch}
            className="mb-3"
            style={{ width: "350px" }}
          />

          {/* Upload Excel File */}
          <div className="mb-3" style={{ width: "300px" }}>
            <Label for="fileUpload">Import Excel File:</Label>
            <Input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
            />
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div
              className="table-responsive"
              style={{ maxHeight: "500px", overflowY: "auto" }}
            >
              <Table bordered hover responsive className="custom-table">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Invoice No</th>
                    <th>Date</th>
                    <th>Total Amount</th>
                    <th>MRP</th>
                    <th>Brand Name</th>
                    <th>Category Name</th>
                    <th>Subcategory Name</th>
                    <th>Product Name</th>
                    <th>Item Code</th>
                    <th>Purchase Price</th>
                    <th>Manufacturing Date</th>
                    <th>Expiry Date</th>
                    <th>Batch No</th>
                    <th>Quantity</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order, idx) => (
                      <tr key={order.Stock_Inventory_id}>
                        <td>{idx + 1}</td>
                        <td>{order.invoice_no || "N/A"}</td>
                        <td>{order.invoice_date || "N/A"}</td>
                        <td>{order.amount || "N/A"}</td>
                        <td>{order.mrp || "N/A"}</td>
                        <td>{order.brand_name || "N/A"}</td>
                        <td>{order.category_name || "N/A"}</td>
                        <td>{order.sub_category_name || "N/A"}</td>
                        <td>{order.product_name || "N/A"}</td>
                        <td>{order.item_code || "N/A"}</td>
                        <td>{order.purchase_price || "N/A"}</td>
                        <td>{order.mfg_date || "N/A"}</td>
                        <td>{order.exp_date || "N/A"}</td>
                        <td>{order.batch_no || "N/A"}</td>
                        <td>{order.quantity || "N/A"}</td>
                        <td>
                          <Button
                            color="link"
                            onClick={() => handleEdit(order.Stock_Inventory_id)}
                            className="text-warning"
                          >
                            <FaEdit size={20} />
                          </Button>{" "}
                          <Button
                            color="link"
                            onClick={() =>
                              handleDelete(order.Stock_Inventory_id)
                            }
                            className="text-danger"
                          >
                            <FaTrash size={20} />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="16" className="text-center">
                        No data found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default SupplierProductDetails;
