import React, { useState, useEffect, useRef } from "react";
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
  Input,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEdit, FaTrash, FaPlus, FaFileExcel } from "react-icons/fa";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import axios from "axios";
import Swal from "sweetalert2";
import { getBrand } from "../../../ApiService/Catalogmanagement/BrandMaster";
import * as XLSX from "xlsx";

const BrandMasterTable = () => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [logoModalOpen, setLogoModalOpen] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    fetchBrandData(currentPage);
  }, [currentPage]);

  const fetchBrandData = async (page) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/brand-master/?limit=${itemsPerPage}&page=${page}`
      );
      const { results, count, total_pages } = response.data;
      setBrands(results);
      setTotalItems(count);
      setTotalPages(total_pages);
    } catch (error) {
      console.error("Error fetching brand data:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to load brands.",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleDropdown = (id) => {
    setDropdownOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddBrand = () => {
    navigate("/brandmaster");
  };

  const handleEdit = (id) => {
    navigate(`/editbrand/${id}`);
  };

  const handleDelete = async (id) => {
    const firstResult = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (firstResult.isConfirmed) {
      const secondResult = await Swal.fire({
        title: "Are you really sure?",
        text: "This action cannot be undone!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (secondResult.isConfirmed) {
        try {
          setLoading(true);
          await axios.delete(
            `${
              import.meta.env.VITE_API_BASE_URL
            }/api/brand-master/?brand_id=${id}`
          );
          fetchBrandData(currentPage);
          Swal.fire("Deleted!", "Your brand has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting brand:", error);
          Swal.fire("Error!", "Failed to delete brand.", "error");
        } finally {
          setLoading(false);
        }
      }
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const confirmation = await Swal.fire({
        title: "Are you sure?",
        text: `You are about to ${
          status ? "publish" : "unpublish"
        } this brand.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, proceed!",
      });

      if (confirmation.isConfirmed) {
        setLoading(true);
        const response = await axios.put(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/brand-master/?brand_id=${id}`,
          {
            status: status,
          }
        );

        if (response.status === 200) {
          fetchBrandData(currentPage);
          Swal.fire({
            icon: "success",
            title: "Success",
            text: `Brand status updated to ${
              status ? "Published" : "Unpublished"
            }.`,
          });
        } else {
          throw new Error("Failed to update status");
        }
      }
    } catch (error) {
      console.error("Error updating status:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update brand status.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExcelUpload = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      Swal.fire({
        icon: "error",
        title: "Invalid File",
        text: "Please upload an Excel file (.xlsx or .xls)",
        confirmButtonColor: "#d33",
      });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/upload-excel/model`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      fetchBrandData(currentPage);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Excel file uploaded successfully!",
        confirmButtonColor: "#3085d6",
      });
    } catch (error) {
      console.error("Error uploading Excel file:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.error || "Failed to upload Excel file.",
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading(false);
      event.target.value = null;
    }
  };

  const handleExcelDownload = () => {
    const excelData = brands.map((brand, index) => ({
      "#": (currentPage - 1) * itemsPerPage + index + 1,
      "Brand Name": brand.brand_details?.brand_name || "N/A",
      "Brand Code": brand.brand_details?.brand_code || "N/A",
      "About Brand": brand.brand_details?.about_brand || "N/A",
      "Brand Logo": brand.brand_details?.brand_logo || "N/A",
      Status: brand.brand_details?.status ? "Published" : "Unpublished",
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Brands");
    XLSX.writeFile(wb, "Brand_Master.xlsx");
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const handleLogoClick = (logoUrl) => {
    setSelectedLogo(logoUrl);
    setLogoModalOpen(true);
  };

  const toggleLogoModal = () => {
    setLogoModalOpen(!logoModalOpen);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="page-content">
      <Breadcrumbs title="Brand Master" breadcrumbItem="All Brands" />
      <Card className="shadow">
        <CardBody>
          <div className="d-flex justify-content-between mb-4">
            <h4 className="text-primary">Brand Master</h4>
            <div className="d-flex gap-2">
              <Button
                color="success"
                onClick={handleExcelUpload}
                disabled={loading}
              >
                <FaFileExcel className="mr-2" /> Upload Excel
              </Button>
              <Button
                color="success"
                onClick={handleExcelDownload}
                disabled={loading || brands.length === 0}
              >
                <FaFileExcel className="mr-2" /> Download Excel
              </Button>
              <Button
                color="primary"
                onClick={handleAddBrand}
                disabled={loading}
              >
                <FaPlus className="mr-2" /> Add Brand
              </Button>
              <Input
                type="file"
                innerRef={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
                accept=".xlsx,.xls"
              />
            </div>
          </div>

          <div className="table-responsive" style={{ maxHeight: "500px" }}>
            <Table bordered hover responsive className="custom-table">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Brand Id</th>
                  <th>Brand Name</th>
                  <th>About Brand</th>
                  <th>Brand Logo</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center">
                      Loading...
                    </td>
                  </tr>
                ) : brands.length > 0 ? (
                  brands.map((brand, index) => (
                    <tr key={brand.brand_details?.brand_id || index}>
                      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td>{brand.brand_details?.brand_id || "N/A"}</td>
                      <td>{brand.brand_details?.brand_name || "N/A"}</td>
                      <td>{brand.brand_details?.about_brand || "N/A"}</td>
                      <td>
                        {brand.brand_details?.brand_logo ? (
                          <img
                            src={`${import.meta.env.VITE_API_BASE_URL}${
                              brand.brand_details?.brand_logo
                            }`}
                            alt="Brand"
                            style={{
                              width: 100,
                              height: 50,
                              borderRadius: "20%",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              handleLogoClick(
                                `${import.meta.env.VITE_API_BASE_URL}${
                                  brand.brand_details?.brand_logo
                                }`
                              )
                            }
                          />
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td>
                        <Dropdown
                          isOpen={
                            dropdownOpen[brand.brand_details?.brand_id] || false
                          }
                          toggle={() =>
                            toggleDropdown(brand.brand_details?.brand_id)
                          }
                          disabled={loading}
                        >
                          <DropdownToggle
                            caret
                            color={
                              brand.brand_details?.status ? "success" : "danger"
                            }
                            className="btn btn-white btn-sm btn-rounded"
                          >
                            {brand.brand_details?.status
                              ? "Published"
                              : "Unpublished"}
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem
                              onClick={() =>
                                handleStatusChange(
                                  brand.brand_details?.brand_id,
                                  true
                                )
                              }
                            >
                              Published
                            </DropdownItem>
                            <DropdownItem
                              onClick={() =>
                                handleStatusChange(
                                  brand.brand_details?.brand_id,
                                  false
                                )
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
                          onClick={() =>
                            handleEdit(brand.brand_details?.brand_id)
                          }
                          className="text-warning"
                          disabled={loading}
                        >
                          <FaEdit size={20} />
                        </Button>{" "}
                        <Button
                          color="link"
                          onClick={() =>
                            handleDelete(brand.brand_details?.brand_id)
                          }
                          className="text-danger"
                          disabled={loading}
                        >
                          <FaTrash size={20} />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center text-muted">
                      No brands available
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {totalPages > 1 && (
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
          )}
        </CardBody>
      </Card>

      <Modal isOpen={logoModalOpen} toggle={toggleLogoModal} centered>
        <ModalHeader toggle={toggleLogoModal}>Brand Logo</ModalHeader>
        <ModalBody className="d-flex justify-content-center">
          <img
            src={selectedLogo}
            alt="Brand Logo"
            style={{ width: "100%", maxWidth: "400px", borderRadius: "10px" }}
          />
        </ModalBody>
      </Modal>
    </div>
  );
};

export default BrandMasterTable;
