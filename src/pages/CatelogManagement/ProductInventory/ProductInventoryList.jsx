import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  Card,
  CardBody,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from "reactstrap";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaUpload,
  FaFileExport,
} from "react-icons/fa";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import {
  getProductData,
  updateProductStatus,
  deleteProduct,
  uploadExcelFile,
} from "../../../ApiService/ProductInventory/ProductInventory";
import Swal from "sweetalert2";

const ProductInventoryList = () => {
   document.title="ProductInventoryList"
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productDetails, setProductDetails] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const fetchData = async (page) => {
    setLoading(true);
    try {
      const response = await getProductData(page);
      setProductDetails(response?.data?.results || []);
      setFilteredProducts(response?.data?.results || []);
      setTotalPages(response?.data?.total_pages || 1);
    } catch (error) {
      console.error("Error fetching product data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const toggleDropdown = (id) => {
    setDropdownOpen((prevState) => (prevState === id ? null : id));
  };

  const toggleModal = (product) => {
    setSelectedProduct(product);
    setModalOpen(!modalOpen);
  };

  const handleAddProduct = () => navigate("/productinventory");
  const handleEdit = (id) => navigate(`/editproductinventory/${id}`, {state:{id}});

  const handleDelete = async (id) => {
    try {
      const firstConfirmation = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to delete this product? This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
      });
  
      if (firstConfirmation.isConfirmed) {
        const secondConfirmation = await Swal.fire({
          title: "Are you absolutely sure?",
          text: "This product will be permanently deleted. Are you sure you want to proceed?",
          icon: "error",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Yes, delete it!",
          cancelButtonText: "Cancel",
        });
  
        if (secondConfirmation.isConfirmed) {
          await deleteProduct(id);
  
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "The product has been deleted successfully.",
          });
  
          fetchData(currentPage);
        }
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete product. Please try again later.",
      });
    }
  };
  
  const handleStatusChange = async (id, status) => {
    const action = status ? "Publish" : "Unpublish";

    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to ${action.toLowerCase()} this product.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${action.toLowerCase()} it!`,
      cancelButtonText: "No, keep it",
    });

    if (result.isConfirmed) {
      try {
        await updateProductStatus(id, status);

        setProductDetails((prev) =>
          prev.map((product) =>
            product.product_id === id ? { ...product, status } : product
          )
        );
        setFilteredProducts((prev) =>
          prev.map((product) =>
            product.product_id === id ? { ...product, status } : product
          )
        );

        // Success alert
        Swal.fire({
          title: "Success!",
          text: `Product has been ${action.toLowerCase()}ed successfully.`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("Error updating status:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to update product status. Please try again later.",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } else {
      Swal.fire("Cancelled", "Your product status is unchanged.", "info");
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = productDetails.filter((product) => {
      return (
        product.product_name.toLowerCase().includes(value) ||
        product.category_name.toLowerCase().includes(value) ||
        product.sub_category_name.toLowerCase().includes(value) ||
        product.brand_name.toLowerCase().includes(value) ||
        product.variants.some((variant) =>
          variant.variant_name.toLowerCase().includes(value)
        )
      );
    });

    setFilteredProducts(filtered);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        console.log("Uploaded Excel Data:", jsonData);

        try {
          const response = await uploadExcelFile(file);
          Swal.fire("Success", "Excel file uploaded successfully!", "success");
          console.log("Backend Response:", response);
        } catch (error) {
          const errorMessage =
            error?.response?.data?.error ||
            "File upload failed. Please try again.";
          Swal.fire("Error", errorMessage, "error");
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleExportToExcel = () => {
    // Extract unique variant names (e.g., Colour, Size, Fabric)
    const variantHeaders = [
      ...new Set(
        filteredProducts.flatMap((product) =>
          product.variants?.map((variant) => variant.variant_name)
        )
      ),
    ];

    // Prepare data for export
    const exportData = filteredProducts.map((product) => {
      let rowData = {
        "Product Name": product.product_name,
        "product Type":product.product_type,
        Category: product.category_name,
        Subcategory: product.sub_category_name,
        Brand: product.brand_name,
      };

      // Add variant details as separate columns
      variantHeaders.forEach((variantName) => {
        const variant = product.variants?.find(
          (v) => v.variant_name === variantName
        );
        rowData[variantName] = variant
          ? variant.details.map((detail) => detail.code).join(", ")
          : "-"; // Show "-" if the variant is missing
      });

      return rowData;
    });

    // Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

    // Export to Excel file
    XLSX.writeFile(workbook, "ProductInventory.xlsx");
  };

  return (
    <div className="page-content">
      <Breadcrumbs title="Products" breadcrumbItem="All Products" />

      <Card className="shadow">
        <CardBody>
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="text-primary">Product Master</h4>
            <div className="d-flex">
              <Button
                color="success"
                className="me-3"
                onClick={handleExportToExcel}
              >
                <FaFileExport className="me-2" /> Export to Excel
              </Button>
              <label className="btn btn-secondary me-3">
                <FaUpload className="me-2" />
                Upload Excel
                <Input
                  type="file"
                  accept=".xls,.xlsx"
                  style={{ display: "none" }}
                  onChange={handleFileUpload}
                />
              </label>
              <Button
                color="primary"
                onClick={() => navigate("/productinventory")}
              >
                <FaPlus className="me-2" /> Add Product
              </Button>
            </div>
          </div>

          <Input
            type="text"
            placeholder="Search by Products....."
            value={searchTerm}
            style={{ width: "250px" }}
            onChange={handleSearch}
            className="mb-3"
          />

          {loading ? (
            <p>Loading products...</p>
          ) : filteredProducts?.length === 0 ? (
            <p>No data available</p>
          ) : (
            <div
              className="table-responsive"
              style={{ maxHeight: "300px", overflowY: "auto" }}
            >
              <Table bordered hover responsive className="custom-table">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Product Name</th>
                    <th>Product Type</th>
                    <th>Category</th>
                    <th>Subcategory</th>
                    <th>Brand</th>

                    {/* Dynamically generate variant headers */}
                    {[
                      ...new Set(
                        filteredProducts.flatMap((product) =>
                          product.variants?.map(
                            (variant) => variant.variant_name
                          )
                        )
                      ),
                    ].map((variantName, index) => (
                      <th key={index}>{variantName}</th>
                    ))}

                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts?.map((product, idx) => (
                    <tr key={product.id}>
                      {/* <td>{idx + 1}</td> */}
                      <td>{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                      <td>{product.product_name || "N/A"}</td>
                      <td>{product.product_type || "N/A"}</td>
                      <td>{product.category_name || "N/A"}</td>
                      <td>{product.sub_category_name || "N/A"}</td>
                      <td>{product.brand_name || "N/A"}</td>
                      {[
                        ...new Set(
                          filteredProducts.flatMap((product) =>
                            product.variants?.map(
                              (variant) => variant.variant_name
                            )
                          )
                        ),
                      ].map((variantName, vIndex) => {
                        const variant = product.variants.find(
                          (v) => v.variant_name === variantName
                        );
                        return (
                          <td key={vIndex}>
                            {variant
                              ? variant.details.map((detail, dIndex) => (
                                  <div key={dIndex}>
                                    {variantName === "Colour" ? (
                                      <div
                                        style={{
                                          display: "inline-block",
                                          width: "20px",
                                          height: "20px",
                                          backgroundColor: detail.code,
                                          border: "1px solid #000",
                                          marginRight: "5px",
                                        }}
                                      />
                                    ) : (
                                      <span>{detail.code}</span>
                                    )}
                                  </div>
                                ))
                              : "-"}
                          </td>
                        );
                      })}

                      <td>
                        <Dropdown
                          isOpen={dropdownOpen === product.product_id}
                          toggle={() => toggleDropdown(product.product_id)}
                        >
                          <DropdownToggle
                            caret
                            color={product.status ? "success" : "danger"}
                            className="btn btn-sm btn-rounded"
                          >
                            <i
                              className={
                                product.status
                                  ? "far fa-dot-circle text-success"
                                  : "far fa-dot-circle text-danger"
                              }
                            />{" "}
                            {product.status ? "Published" : "Unpublished"}
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem
                              onClick={() =>
                                handleStatusChange(product.product_id, true)
                              }
                            >
                              Published
                            </DropdownItem>
                            <DropdownItem
                              onClick={() =>
                                handleStatusChange(product.product_id, false)
                              }
                            >
                              Unpublished
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </td>
                      <td>
                        <Button
                          color="link"
                          onClick={() => handleEdit(product.product_id)}
                          className="text-warning"
                        >
                          <FaEdit size={20} />
                        </Button>{" "}
                        <Button
                          color="link"
                          onClick={() => handleDelete(product.product_id)}
                          className="text-danger"
                        >
                          <FaTrash size={20} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </CardBody>
      </Card>
      <div className="d-flex justify-content-center mt-3">
        <Button
          color="primary"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </Button>
        <span className="mx-3">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          color="primary"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ProductInventoryList;
