import React, { useState, useEffect } from "react";
import axios from "axios";
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
import Swal from "sweetalert2";
import { FaEye, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./CompanyPolicylist.css";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api/company-policies/`;

const CompanyPolicylist = () => {
  const navigate = useNavigate();
  const [policies, setPolicies] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      const normalizedPolicies = response.data.map((policy) => ({
        ...policy,
        company_policy_data:
          typeof policy.company_policy_data.company_policy_data === "object"
            ? policy.company_policy_data.company_policy_data.company_policy_data
            : policy.company_policy_data.company_policy_data,
      }));
      setPolicies(normalizedPolicies);
    } catch (err) {
      console.error("Failed to fetch policies:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load policies. Please try again later.",
      });
    }
  };

  const handleAddPolicy = () => {
    navigate("/companypolicy");
  };

  const handleStatusChange = async (policy, newStatus) => {
    if (policy.status === newStatus) return;

    const result = await Swal.fire({
      title: `Are you sure?`,
      text: `Do you want to ${newStatus ? "Publish" : "Unpublish"} this policy?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: newStatus ? "#28a745" : "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: `Yes, ${newStatus ? "Publish" : "Unpublish"} it!`,
    });

    if (result.isConfirmed) {
      try {
        await axios.put(`${API_BASE_URL}?company_policy_id=${policy.company_policy_id}`, {
          status: newStatus,
          company_policy_data: { company_policy_data: policy.company_policy_data },
        });
        await fetchPolicies();

        Swal.fire({
          title: "Updated!",
          text: `Policy has been ${newStatus ? "Published" : "Unpublished"}.`,
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("Error updating status:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to update status.",
          icon: "error",
        });
      }
    }
  };

  // const handleView = (policy) => {
  //   Swal.fire({
  //     title: "Policy Content",
  //     html: `<div class="policy-content">${policy.company_policy_data}</div>`,
  //     icon: "info",
  //     confirmButtonText: "Close",
  //   });
  // };

  const handleEdit = (policyId) => {
    navigate("/companypolicy", { state: { policyId } });
  };

  const handleDelete = async (policyId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_BASE_URL}?company_policy_id=${policyId}`);
        setPolicies((prevPolicies) =>
          prevPolicies.filter((p) => p.company_policy_id !== policyId)
        );
        Swal.fire({
          title: "Deleted!",
          text: "Policy has been deleted.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("Error deleting policy:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to delete policy.",
          icon: "error",
        });
      }
    }
  };

  const toggleDropdown = (id) => {
    setDropdownOpen((prev) => (prev === id ? null : id));
  };

  return (
    <div className="page-content">
      <Card className="shadow">
        <CardBody>
          <div className="d-flex justify-content-between mb-4">
            <h4 className="text-primary">Company Policies</h4>
            <Button color="primary" onClick={handleAddPolicy}>
              <FaPlus className="mr-2" /> Add Policy
            </Button>
          </div>
          <div
            className="table-responsive"
            style={{ maxHeight: "500px", overflowY: "auto" }}
          >
            <Table bordered hover responsive>
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Policy Data</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {policies.length > 0 ? (
                  policies.map((policy, index) => (
                    <tr key={policy.company_policy_id}>
                      <td>{index + 1}</td>
                      <td
                        className="policy-content"
                        dangerouslySetInnerHTML={{
                          __html: policy.company_policy_data || "N/A",
                        }}
                      />
                      <td>
                        <Dropdown
                          isOpen={dropdownOpen === policy.company_policy_id}
                          toggle={() => toggleDropdown(policy.company_policy_id)}
                        >
                          <DropdownToggle
                            caret
                            color={policy.status ? "success" : "danger"}
                            className="btn btn-sm btn-rounded"
                          >
                            <i
                              className={
                                policy.status
                                  ? "far fa-dot-circle text-success"
                                  : "far fa-dot-circle text-danger"
                              }
                            />{" "}
                            {policy.status ? "Published" : "Unpublished"}
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem
                              onClick={() => handleStatusChange(policy, true)}
                            >
                              Published
                            </DropdownItem>
                            <DropdownItem
                              onClick={() => handleStatusChange(policy, false)}
                            >
                              Unpublished
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </td>
                      <td>
                        {/* <Button
                          color="link"
                          className="text-primary"
                          onClick={() => handleView(policy)}
                        >
                          <FaEye size={20} />
                        </Button>{" "} */}
                        <Button
                          color="link"
                          className="text-warning"
                          onClick={() => handleEdit(policy.company_policy_id)}
                        >
                          <FaEdit size={20} />
                        </Button>{" "}
                        <Button
                          color="link"
                          className="text-danger"
                          onClick={() => handleDelete(policy.company_policy_id)}
                        >
                          <FaTrash size={20} />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No policies available.
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

export default CompanyPolicylist;