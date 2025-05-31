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
  getAgentData,
  updateAgentStatus,
  deleteAgent,
} from "../../../ApiService/TransationManagement/AgentMaster";
import Swal from "sweetalert2";

const AgentMasterList = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await getAgentData();
        console.log(response);
        setAgents(response);
      } catch (error) {
        console.error("Error fetching agents data:", error);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to fetch agents data",
        });
      }
    };

    fetchAgents();
  }, []);

  const handleAddAgent = () => {
    navigate("/agentmaster");
  };

  // const handleView = (id) => {
  //   alert(`View Agent with ID: ${id}`);
  // };

  const handleEdit = (id) => {
   navigate("/agentmaster", {state:{id}});
  };

  const handleDelete = async (id) => {
    const firstConfirm = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete this agent. This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, proceed",
      cancelButtonText: "No, cancel",
      reverseButtons: true,
    });

    if (firstConfirm.isConfirmed) {
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
          const response = await deleteAgent(id);

          if (response) {
            Swal.fire({
              title: "Deleted!",
              text: `Agent ID: ${id} has been deleted successfully.`,
              icon: "success",
              confirmButtonText: "OK",
            });

            // Update the UI after deletion
            setAgents((prevAgents) =>
              prevAgents.filter((agent) => agent.agent_id !== id)
            );
          } else {
            throw new Error("Failed to delete agent");
          }
        } catch (error) {
          console.error("Error deleting agent:", error);
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Failed to delete agent",
          });
        }
      }
    }
  };

  const toggleDropdown = (id) => {
    setDropdownOpen((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleStatusChange = async (id, status) => {
    const newStatus = status === "Published";
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to change the status to ${status}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, change it!",
      cancelButtonText: "No, cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        const response = await updateAgentStatus(id, newStatus);

        if (response) {
          Swal.fire({
            title: "Success",
            text: `Agent status changed to ${status}`,
            icon: "success",
            confirmButtonText: "Ok",
          });

          setAgents((prevAgents) =>
            prevAgents.map((agent) =>
              agent.agent_id === id ? { ...agent, status: newStatus } : agent
            )
          );
        } else {
          throw new Error("Failed to update status");
        }
      } catch (error) {
        console.error("Error updating agent status:", error);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to update agent status",
        });
      }
    }
  };

  return (
    <div className="page-content">
      <Breadcrumbs title="Agents" breadcrumbItem="All Agents" />

      <Card className="shadow">
        <CardBody>
          <div className="d-flex justify-content-between mb-4">
            <h4 className="text-primary">Agent Master</h4>
            <Button color="primary" onClick={handleAddAgent}>
              <FaPlus className="mr-2" /> Add Agent
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
                  <th>Agent Name</th>
                  <th>Agent DOB</th>
                  <th>Joining Date</th>
                  <th>Mobile Number</th>
                  <th>Aadhar Number</th>
                  <th>Address</th>
                  <th>Agent Route</th>
                  <th>Agent Photo</th>
                  <th>Aadhar Photo</th>
                  <th>Driving License Photo</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {agents?.length > 0 ? (
                  agents.map((agent, index) => (
                    <tr key={agent?.agent_id ?? index}>
                      <td>{index + 1}</td>
                      <td>{agent?.agent_name ?? "N/A"}</td>
                      <td>
                        {agent?.dob
                          ? new Date(agent.dob).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td>
                        {agent?.doj
                          ? new Date(agent.doj).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td>{agent?.mob_no ?? "N/A"}</td>
                      <td>{agent?.adhar_no ?? "N/A"}</td>
                      <td>{agent?.address ?? "N/A"}</td>
                       <td>{agent.pincode}</td>
                      <td>
                        {agent?.agent_photo ? (
                          <img
                            src={`${import.meta.env.VITE_API_BASE_URL}${
                              agent.agent_photo
                            }`}
                            alt="Agent"
                            style={{
                              width: "50px",
                              height: "50px",
                              borderRadius: "20%",
                            }}
                          />
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td>
                        {agent?.adhar_photo ? (
                          <img
                            src={`${import.meta.env.VITE_API_BASE_URL}${
                              agent.adhar_photo
                            }`}
                            alt="Aadhar"
                            style={{ width: "50px", height: "50px" }}
                          />
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td>
                        {agent?.dl_photo ? (
                          <img
                            src={`${import.meta.env.VITE_API_BASE_URL}${
                              agent.dl_photo
                            }`}
                            alt="Driving License"
                            style={{ width: "50px", height: "50px" }}
                          />
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td>
                        <Dropdown
                          isOpen={dropdownOpen?.[agent?.agent_id] ?? false}
                          toggle={() => toggleDropdown?.(agent?.agent_id)}
                        >
                          <DropdownToggle caret color="secondary">
                            {agent?.status ? "Published" : "Unpublished"}
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem
                              onClick={() =>
                                handleStatusChange?.(
                                  agent?.agent_id,
                                  "Published"
                                )
                              }
                            >
                              Published
                            </DropdownItem>
                            <DropdownItem
                              onClick={() =>
                                handleStatusChange?.(
                                  agent?.agent_id,
                                  "Unpublished"
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
                          onClick={() => handleEdit?.(agent?.agent_id)}
                          className="text-warning"
                        >
                          <FaEdit size={20} />
                        </Button>{" "}
                        <Button
                          color="link"
                          onClick={() => handleDelete?.(agent?.agent_id)}
                          className="text-danger"
                        >
                          <FaTrash size={20} />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="12" className="text-center text-muted">
                      No agent data found
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

export default AgentMasterList;
