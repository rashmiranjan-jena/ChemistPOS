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
import Swal from "sweetalert2";
import {
  getDeliveryData,
  putDeliveryStatus,
  deleteAgent,
} from "../../../ApiService/TransationManagement/DeliveryDistribution";

const DeliveryDistributionList = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    const fetchDeliveryData = async () => {
      try {
        const response = await getDeliveryData();
        const processedData = response.map((item) => ({
          ...item,
          brand_name: item.brands.map((brand) => brand.brand_name).join(", "),
        }));
        setAgents(processedData);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchDeliveryData();
  }, []);

  const handleAddAgent = () => {
    navigate("/deliverydistribution");
  };

  const handleEdit = (pincode) => {
    console.log(pincode)
    navigate("/deliverydistribution", { state: { pincode } });
  };

  const handleDelete = (pincode) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete this agent. This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, proceed",
      cancelButtonText: "No, cancel",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const secondConfirm = await Swal.fire({
          title: "Final Confirmation",
          text: "Are you absolutely sure you want to delete this agent?",
          icon: "error",
          showCancelButton: true,
          confirmButtonText: "Yes, delete it!",
          cancelButtonText: "No, keep it",
          reverseButtons: true,
        });

        if (secondConfirm.isConfirmed) {
          try {
            await deleteAgent(pincode);
            Swal.fire({
              title: "Deleted!",
              text: `Agent with Pincode: ${pincode} has been deleted successfully.`,
              icon: "success",
              confirmButtonText: "OK",
            });

            setAgents((prevAgents) =>
              prevAgents.filter((agent) => agent.pincode !== pincode)
            );
          } catch (error) {
            Swal.fire({
              title: "Error!",
              text: "Failed to delete the agent. Please try again.",
              icon: "error",
              confirmButtonText: "OK",
            });
          }
        }
      }
    });
  };

  const handleStatusChange = async (pincode, status) => {
    console.log("clicked");
    const newStatus = status === "Published";

    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to change the status to ${status}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, change it!",
      cancelButtonText: "No, cancel",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await putDeliveryStatus(pincode, newStatus);

          Swal.fire({
            title: "Success",
            text: `Agent status changed to ${status}`,
            icon: "success",
            confirmButtonText: "Ok",
          });

          // Update the local state
          setAgents((prevAgents) =>
            prevAgents.map((agent) =>
              agent.pincode === pincode
                ? { ...agent, is_available: newStatus }
                : agent
            )
          );
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: "Failed to update status. Please try again.",
            icon: "error",
            confirmButtonText: "Ok",
          });
        }
      }
    });
  };

  const toggleDropdown = (id) => {
    setDropdownOpen((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  return (
    <div className="page-content">
      <Breadcrumbs title="Agents" breadcrumbItem="All Distribution" />

      <Card className="shadow">
        <CardBody>
          <div className="d-flex justify-content-between mb-4">
            <h4 className="text-primary">Distribution Master</h4>
            <Button color="primary" onClick={handleAddAgent}>
              <FaPlus className="mr-2" /> Add Distribution
            </Button>
          </div>

          <div
            className="table-responsive"
            style={{ maxHeight: "500px", overflowY: "auto" }}
          >
            <Table bordered hover responsive className="custom-table">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Pincode</th>
                  <th>Brand Name</th>
                  <th>Category Name</th>
                  <th>Expected Delivery Days</th>
                  <th>Delivery Charges</th>
                  <th>Is Avilable</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {agents.length > 0 ? (
                  agents.map((agent, index) => (
                    <tr key={agent.pincode}>
                      <td>{index + 1}</td>
                      <td>{agent.pincode}</td>
                      <td>{agent.brand_name}</td>
                      <td>{agent.category_name}</td>
                      <td>{agent.delivery_time} days</td>
                      <td>Rs {agent.delivery_charges}</td>
                      <td>
                        <Dropdown
                          isOpen={dropdownOpen[agent.pincode]}
                          toggle={() => toggleDropdown(agent.pincode)}
                        >
                          <DropdownToggle caret color="secondary">
                            {agent.is_available ? "Published" : "Unpublished"}
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem
                              onClick={() =>
                                handleStatusChange(agent.pincode, "Published")
                              }
                            >
                              Published
                            </DropdownItem>
                            <DropdownItem
                              onClick={() =>
                                handleStatusChange(agent.pincode, "Unpublished")
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
                          onClick={() => handleEdit(agent.pincode)}
                          className="text-warning"
                        >
                          <FaEdit size={20} />
                        </Button>{" "}
                        <Button
                          color="link"
                          onClick={() => handleDelete(agent.pincode)}
                          className="text-danger"
                        >
                          <FaTrash size={20} />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center text-muted">
                      No data found
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

export default DeliveryDistributionList;
