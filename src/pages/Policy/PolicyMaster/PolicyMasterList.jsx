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
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import axios from "axios";

const PolicyMasterList = () => {
  const navigate = useNavigate();
  const [policyGroups, setPolicyGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(null); // Track which dropdown is open

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}api/policy-master/`)
      .then((response) => {
        console.log("API Response:", response.data);
        // Add a default status field if missing
        const updatedGroups = response.data.map((group) => ({
          ...group,
          status: group.status !== undefined ? group.status : false, // Default to false if no status
        }));
        setPolicyGroups(updatedGroups);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching policies:", error);
        setLoading(false);
      });
  }, []);

  const handleAddPolicy = () => {
    navigate("/policymaster");
  };

  const handleEdit = (policyId) => {
    navigate("/policymaster", { state: { policyId } });
  };

  const handleDelete = (policyId) => {
    alert(`Delete Policy Group - Policy ID: ${policyId}`);
  };

  const handleStatusChange = (policyId, newStatus) => {
    setPolicyGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.policy_id === policyId ? { ...group, status: newStatus } : group
      )
    );
  };

  const toggleDropdown = (id) => {
    setDropdownOpen((prev) => (prev === id ? null : id));
  };

  // Helper function to generate a unique key for each group
  const getGroupKey = (group) => `${group.policy_id}`;

  return (
    <div className="page-content">
      <Breadcrumbs title="Name Policies" breadcrumbItem="All Name Policies" />

      <Card className="shadow">
        <CardBody>
          <div className="d-flex justify-content-between mb-4">
            <h4 className="text-primary">Policy Master</h4>
            <Button color="primary" onClick={handleAddPolicy}>
              <FaPlus className="mr-2" /> Add PolicyName
            </Button>
          </div>

          <div className="table-responsive" style={{ maxHeight: "500px", overflowY: "auto" }}>
            {loading ? (
              <p>Loading...</p>
            ) : policyGroups.length === 0 ? (
              <p className="text-center">No Data Available</p>
            ) : (
              <Table bordered hover responsive className="custom-table">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Policy ID</th>
                    <th>Brand Name</th>
                    <th>Category Name</th>
                    <th>Subcategory Name</th>
                    <th>Policy Names</th>
                    <th>Clauses</th>
                    <th>Penalties</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {policyGroups.map((group, index) => {
                    const groupKey = getGroupKey(group);

                    return (
                      <tr key={groupKey}>
                        <td>{index + 1}</td>
                        <td>{group.policy_id}</td>
                        <td>{group.brand_name}</td>
                        <td>{group.category_name}</td>
                        <td>{group.subcategory_name}</td>
                        <td>{group.policies.map((p) => p.policy_name).join(", ")}</td>
                        <td>
                          {group.policies
                            .flatMap((p) => p.clauses.map((c) => c.clause_name))
                            .join(", ")}
                        </td>
                        <td>
                          {group.policies
                            .flatMap((p) => p.clauses.map((c) => c.penalty))
                            .join(", ")}
                        </td>
                        <td>
                          <Dropdown
                            isOpen={dropdownOpen === groupKey}
                            toggle={() => toggleDropdown(groupKey)}
                          >
                            <DropdownToggle
                              caret
                              color={group.status ? "success" : "danger"}
                              className="btn btn-sm btn-rounded"
                            >
                              <i
                                className={
                                  group.status
                                    ? "far fa-dot-circle text-success"
                                    : "far fa-dot-circle text-danger"
                                }
                              />{" "}
                              {group.status ? "Published" : "Unpublished"}
                            </DropdownToggle>
                            <DropdownMenu>
                              <DropdownItem
                                onClick={() =>
                                  handleStatusChange(group.policy_id, true)
                                }
                              >
                                Published
                              </DropdownItem>
                              <DropdownItem
                                onClick={() =>
                                  handleStatusChange(group.policy_id, false)
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
                            onClick={() => handleEdit(group.policy_id)}
                            className="text-warning"
                          >
                            <FaEdit size={20} />
                          </Button>{" "}
                          <Button
                            color="link"
                            onClick={() => handleDelete(group.policy_id)}
                            className="text-danger"
                          >
                            <FaTrash size={20} />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default PolicyMasterList;