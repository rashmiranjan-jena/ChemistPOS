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
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Input,
} from "reactstrap";
import { FaEye, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";
import {
  fetchGstDetails,
  deleteGstDetails,
  updateGstStatus,
} from "../../../ApiService/Gstmaster/Gstmaster";
import Swal from "sweetalert2";

const Gstlist = () => {
  const navigate = useNavigate();
  const [gstData, setGstData] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState({});

  const getGstData = async () => {
    try {
      const response = await fetchGstDetails();
      setGstData(response);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "An error occurred while fetching GST data. Please try again later.",
      });
      console.error("Failed to fetch GST details:", error);
    }
  };

  useEffect(() => {
    getGstData();
  }, []);

  const toggleDropdown = (id) => {
    setDropdownOpen((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleAddGst = () => {
    navigate("/gstmaster");
  };

  // const handleView = (id) => {
  //   alert(`View GST details with ID: ${id}`);
  // };

  const handleEdit = (id) => {
    navigate("/gstmaster", {state:{id}})
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete this GST data.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    });

    if (result.isConfirmed) {
      const doubleCheck = await Swal.fire({
        title: "Are you absolutely sure?",
        text: "This action cannot be undone!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, keep it",
      });

      if (doubleCheck.isConfirmed) {
        try {
          const response = await deleteGstDetails(id);
          if (response.status === 200) {
            await getGstData();
            Swal.fire("Deleted!", "GST data has been deleted.", "success");
          } else {
            Swal.fire("Failed!", "Failed to delete GST data.", "error");
          }
        } catch (error) {
          console.error("Error deleting GST data:", error);
          Swal.fire(
            "Error!",
            "An error occurred while deleting the GST data.",
            "error"
          );
        }
      } else {
        Swal.fire("Cancelled", "Your GST data is safe.", "info");
      }
    } else {
      Swal.fire("Cancelled", "Your GST data is safe.", "info");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const response = await updateGstStatus(id, status);
      if (response.status === 200) {
        const updatedData = gstData.map((gst) =>
          gst.gst_id === id ? { ...gst, status } : gst
        );
        setGstData(updatedData);

        Swal.fire({
          icon: "success",
          title: "Status Updated",
          text: `GST status has been updated to ${
            status ? "Published" : "Unpublished"
          }.`,
        });
      } else {
        throw new Error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to Update Status",
        text: "An error occurred while updating the status. Please try again.",
      });
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="GST Master" breadcrumbItem="GST List" />

          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
                  <CardTitle tag="h4">GST Details</CardTitle>
                  <p className="card-title-desc mb-4">
                    Manage GST details including subcategories and percentages.
                  </p>

                  <div className="d-flex justify-content-between mb-4">
                    <h4 className="text-primary">GST List</h4>
                    <Button color="primary" onClick={handleAddGst}>
                      <FaPlus className="mr-2" /> Add GST
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
                          <th>GST Name</th>
                          <th>HSN Number</th>
                          <th>GST Amount (%)</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gstData?.length > 0 ? (
                          gstData.map((gst, index) => (
                            <tr key={gst?.gst_id ?? index}>
                              <td>{index + 1}</td>
                              <td>{gst?.gst_name ?? "N/A"}</td>
                              <td>{gst?.hsn ?? "N/A"}</td>
                              <td>
                                {gst?.gst_amount ? `${gst.gst_amount}%` : "N/A"}
                              </td>
                              <td>
                                <Dropdown
                                  isOpen={dropdownOpen?.[gst?.gst_id] ?? false}
                                  toggle={() => toggleDropdown?.(gst?.gst_id)}
                                >
                                  <DropdownToggle
                                    caret
                                    color={gst?.status ? "success" : "danger"}
                                    className="btn btn-sm btn-rounded"
                                  >
                                    <i
                                      className={
                                        gst?.status
                                          ? "far fa-dot-circle text-success"
                                          : "far fa-dot-circle text-danger"
                                      }
                                    />{" "}
                                    {gst?.status ? "Published" : "Unpublished"}
                                  </DropdownToggle>
                                  <DropdownMenu>
                                    <DropdownItem
                                      onClick={() =>
                                        handleStatusChange?.(gst?.gst_id, true)
                                      }
                                    >
                                      Published
                                    </DropdownItem>
                                    <DropdownItem
                                      onClick={() =>
                                        handleStatusChange?.(gst?.gst_id, false)
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
                                  onClick={() => handleEdit?.(gst?.gst_id)}
                                  className="text-warning"
                                >
                                  <FaEdit size={20} />
                                </Button>{" "}
                                <Button
                                  color="link"
                                  onClick={() => handleDelete?.(gst?.gst_id)}
                                  className="text-danger"
                                >
                                  <FaTrash size={20} />
                                </Button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="text-center text-muted">
                              No GST data found
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

export default Gstlist;
