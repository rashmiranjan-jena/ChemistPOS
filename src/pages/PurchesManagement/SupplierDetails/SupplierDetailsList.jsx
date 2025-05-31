import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Row,
  Table,
} from "reactstrap";
import { FaEye, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";
import {
  getSupplierDetails,
  deleteSupplier,
} from "../../../ApiService/Supplierdetails/Supplierdetails";

const SupplierDetailsList = () => {
  const navigate = useNavigate();
  const [supplierDetailsData, setSupplierDetailsData] = useState([]);

  useEffect(() => {
    fetchSupplierDetails();
  }, []);

  const fetchSupplierDetails = async () => {
    try {
      const data = await getSupplierDetails();
      setSupplierDetailsData(data);
    } catch (error) {
      console.error("Error fetching supplier details:", error);
    }
  };

  const handleSupplierDetails = () => {
    navigate("/supplierdetails");
  };

  const handleView = (id) => {
    alert(`View details for supplier ID: ${id}`);
  };

  const handleEdit = (id) => {
    navigate("/supplierdetails", { state: { id } });
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (firstResult) => {
      if (firstResult.isConfirmed) {
        // Show second confirmation
        Swal.fire({
          title: "Are you absolutely sure?",
          text: "This action is permanent!",
          icon: "error",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Yes, delete permanently!",
        }).then(async (secondResult) => {
          if (secondResult.isConfirmed) {
            try {
              await deleteSupplier(id);
              setSupplierDetailsData(
                supplierDetailsData.filter((item) => item.supplier_id !== id)
              );
              Swal.fire(
                "Deleted!",
                "The supplier has been permanently deleted.",
                "success"
              );
            } catch (error) {
              Swal.fire("Error!", "Failed to delete the supplier.", "error");
              console.error("Error deleting supplier:", error);
            }
          }
        });
      }
    });
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Supplier Master" breadcrumbItem="Supplier List" />

          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
                  <CardTitle tag="h4">Supplier Details</CardTitle>
                  <p className="card-title-desc mb-4">
                    Manage supplier details including business information,
                    invoices, and statuses.
                  </p>

                  <div className="d-flex justify-content-between mb-4">
                    <h4 className="text-primary">Supplier Details List</h4>
                    <Button color="primary" onClick={handleSupplierDetails}>
                      <FaPlus className="mr-2" /> Add Supplier Details
                    </Button>
                  </div>

                  <div
                    className="table-responsive"
                    style={{ maxHeight: "500px" }}
                  >
                    <Table bordered hover responsive className="custom-table">
                      <thead className="table-light">
                        <tr>
                          <th>#</th>
                          <th>Business Name</th>
                          <th>Address</th>
                          <th>Contact No</th>
                          <th>Email ID</th>
                          <th>GST No</th>
                          <th>Brand</th>
                          <th>Category</th>
                          <th>Subcategory</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {supplierDetailsData &&
                        supplierDetailsData.length > 0 ? (
                          supplierDetailsData.map((details, index) => (
                            <tr key={details.supplier_id}>
                              <td>{index + 1}</td>
                              <td>{details.supplier_business_name}</td>
                              <td>{details.address}</td>
                              <td>{details.contact_number}</td>
                              <td>{details.email_id}</td>
                              <td>{details.gst_no}</td>
                              <td>
                                <ul>
                                  {details.supplier_brands.map(
                                    (brand, index) => (
                                      <li key={index}>{brand.brand_name}</li>
                                    )
                                  )}
                                </ul>
                              </td>
                              <td>
                                <ul>
                                  {details.supplier_brands.map(
                                    (brand, index) => (
                                      <li key={index}>{brand.category_name}</li>
                                    )
                                  )}
                                </ul>
                              </td>
                              <td>
                                <ul>
                                  {details.supplier_brands.map(
                                    (brand, index) => (
                                      <li key={index}>
                                        {brand.subCategory_name}
                                      </li>
                                    )
                                  )}
                                </ul>
                              </td>

                              <td>
                                <Button
                                  color="link"
                                  onClick={() =>
                                    handleView(details.supplier_id)
                                  }
                                  className="text-primary"
                                >
                                  <FaEye size={20} />
                                </Button>{" "}
                                <Button
                                  color="link"
                                  onClick={() =>
                                    handleEdit(details.supplier_id)
                                  }
                                  className="text-warning"
                                >
                                  <FaEdit size={20} />
                                </Button>{" "}
                                <Button
                                  color="link"
                                  onClick={() =>
                                    handleDelete(details.supplier_id)
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
                            <td colSpan="10" className="text-center">
                              No supplier data found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default SupplierDetailsList;
