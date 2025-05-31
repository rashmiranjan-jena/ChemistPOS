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
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import {
  fetchBusinessInfo,
  updateBusinessStatus,
  deleteBusiness,
} from "../../../ApiService/BusinessInfo/BusinessInfo";
import Swal from "sweetalert2";

const BusinessInfoList = () => {
  const navigate = useNavigate();
  const [businessData, setBusinessData] = useState([]);

  // Dropdown state
  const [dropdownOpen, setDropdownOpen] = useState({});

  const toggleDropdown = (id) => {
    setDropdownOpen((prevState) => ({
      ...prevState,
      [id]: !prevState[id], 
    }));
  };

  useEffect(() => {
    const getBusinessInfo = async () => {
      try {
        const data = await fetchBusinessInfo();
        setBusinessData(data);
      } catch (err) {
        console.log(err)
      }
    };

    getBusinessInfo();
  }, []);

  const handleAddBusiness = () => {
    navigate("/businessinfo");
  };

  // Action Handlers
  const handleView = (id) => {
    alert(`View Business with ID: ${id}`);
  };

  const handleEdit = (id) => {
    navigate("/businessinfo", {state:{id}});
  };

  const handleDelete = async (id) => {
    // Show first confirmation dialog
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action will delete the business permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    // If confirmed, show second confirmation
    if (result.isConfirmed) {
      const finalResult = await Swal.fire({
        title: "Are you really sure?",
        text: "Once deleted, you will not be able to recover this business.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it forever!",
      });

      // If the user confirms the second dialog
      if (finalResult.isConfirmed) {
        try {
          // Call API to delete business
          await deleteBusiness(id);

          // Success alert
          await Swal.fire({
            title: "Deleted!",
            text: "Business has been deleted successfully.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });

          // Remove business from the state (UI update)
          const updatedBusinessData = businessData.filter(
            (business) => business.business_info_id !== id
          );
          setBusinessData(updatedBusinessData);
        } catch (err) {
          // Error alert
          await Swal.fire({
            title: "Error!",
            text: "Failed to delete the business. Please try again later.",
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });
        }
      }
    }
  };

  const handleStatusChange = async (id, status) => {
    const action = status ? "Publish" : "Unpublish";

    const result = await Swal.fire({
      title: `Are you sure?`,
      text: `Do you want to ${action} this business?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${action} it!`,
    });

    if (result.isConfirmed) {
      try {
        await updateBusinessStatus(id, status);

        // Success alert
        await Swal.fire({
          title: "Success!",
          text: `Business has been ${action}ed successfully.`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        // Update state
        const updatedBusinessData = businessData.map((business) =>
          business.business_info_id === id ? { ...business, status } : business
        );
        setBusinessData(updatedBusinessData);
      } catch (err) {
        // Error alert
        await Swal.fire({
          title: "Error!",
          text: "Failed to update status. Please try again later.",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    }
  };

  

  return (
    <div className="page-content">
      <Breadcrumbs title="Business Info" breadcrumbItem="All Businesses" />

      <Card className="shadow">
        <CardBody>
          <div className="d-flex justify-content-between mb-4">
            <h4 className="text-primary">Business Master</h4>
            <Button color="primary" onClick={handleAddBusiness}>
              <FaPlus className="mr-2" /> Add Business
            </Button>
          </div>

          <div className="table-responsive" style={{ maxHeight: "500px" }}>
            <Table bordered hover responsive className="custom-table">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Business Name</th>
                  <th>Alias</th>
                  <th>Business Type</th>
                  <th>GST/TAX No</th>
                  <th>Address</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {businessData.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center">
                      <p>No Data Available</p>
                    </td>
                  </tr>
                ) : (
                  businessData.map((business, index) => (
                    <tr key={business.business_info_id}>
                      <td>{index + 1}</td>
                      <td>{business.buisness_name}</td>
                      <td>{business.alias}</td>
                      <td>{business.business_type}</td>
                      <td>{business.gst_tax_number}</td>
                      <td>{business.address}</td>
                      <td>
                        {/* Dropdown with status */}
                        <Dropdown
                          isOpen={
                            dropdownOpen[business.business_info_id] || false
                          }
                          toggle={() =>
                            toggleDropdown(business.business_info_id)
                          }
                        >
                          <DropdownToggle
                            caret
                            color={business.status ? "success" : "danger"}
                            className="btn btn-white btn-sm btn-rounded"
                            onClick={(e) => e.preventDefault()}
                          >
                            <i
                              className={
                                business.status
                                  ? "far fa-dot-circle text-success"
                                  : "far fa-dot-circle text-danger"
                              }
                            />
                            {business.status ? "Published" : "Unpublished"}
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem
                              onClick={() =>
                                handleStatusChange(
                                  business.business_info_id,
                                  true
                                )
                              }
                            >
                              Publish
                            </DropdownItem>
                            <DropdownItem
                              onClick={() =>
                                handleStatusChange(
                                  business.business_info_id,
                                  false
                                )
                              }
                            >
                              Unpublish
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </td>
                      <td>
                        <Button
                          color="link"
                          onClick={() => handleView(business.business_info_id)}
                          className="text-primary"
                        >
                          <FaEye size={20} />
                        </Button>{" "}
                        <Button
                          color="link"
                          onClick={() => handleEdit(business.business_info_id)}
                          className="text-warning"
                        >
                          <FaEdit size={20} />
                        </Button>{" "}
                        <Button
                          color="link"
                          onClick={() =>
                            handleDelete(business.business_info_id)
                          }
                          className="text-danger"
                        >
                          <FaTrash size={20} />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default BusinessInfoList;
