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
  getPolicy,
  updatePolicyStatus,
  deletePolicy,
} from "../../../ApiService/Policy/ProductPolicy/ProductPolicy";
import Swal from "sweetalert2";

const PolicyNameList = () => {
  const navigate = useNavigate();
  const [policies, setPolicies] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const response = await getPolicy();
        const fetchedPolicies = response.data.map((policy, index) => ({
          id: policy.policyName_id,
          policyName: policy.policyName,
          penalty: policy.clauses
            .map((clause) => `$${clause.penalty_amount}`)
            .join(", "),
          policies: policy.clauses
            .map((clause) => clause.clause_name)
            .join(", "),
          numberofdays: policy.clauses
            .map((clause) => clause.number_of_days)
            .join(", "),
          status: policy.status ? "Published" : "Unpublished",
        }));
        setPolicies(fetchedPolicies);
      } catch (error) {
        console.error("Error fetching policies:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong while fetching policies!",
        });
      }
    };

    fetchPolicies();
  }, []);

  const handleAddPolicy = () => {
    navigate("/policyname");
  };

  const handleEdit = (id) => {
    navigate("/policyname", { state: { id } });
  };

  const handleDelete = async (id) => {
    // First confirmation
    const firstConfirmation = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete this policy!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, proceed",
    });

    if (firstConfirmation.isConfirmed) {
      // Second confirmation
      const secondConfirmation = await Swal.fire({
        title: "Final Confirmation",
        text: "This action cannot be undone. Are you absolutely sure?",
        icon: "error",
        showCancelButton: true,
        confirmButtonColor: "#dc3545",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Yes, delete it!",
      });

      if (secondConfirmation.isConfirmed) {
        try {
          await deletePolicy(id);

          setPolicies((prevPolicies) =>
            prevPolicies.filter((policy) => policy.id !== id)
          );

          Swal.fire({
            title: "Deleted!",
            text: "The policy has been successfully deleted.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
        } catch (error) {
          console.error("Error deleting policy:", error);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong while deleting the policy!",
          });
        }
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    const updatedStatus = newStatus === "Published" ? true : false;

    try {
      await updatePolicyStatus(id, updatedStatus);
      setPolicies((prevPolicies) =>
        prevPolicies.map((policy) =>
          policy.id === id ? { ...policy, status: newStatus } : policy
        )
      );
    } catch (error) {
      console.error("Error updating policy status:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong while updating the policy status!",
      });
    }
  };

  const toggleDropdown = (id) => {
    setDropdownOpen((prevState) => (prevState === id ? null : id));
  };

  return (
    <div className="page-content">
      <Breadcrumbs title="Name Policies" breadcrumbItem="All Name Policies" />

      <Card className="shadow">
        <CardBody>
          <div className="d-flex justify-content-between mb-4">
            <h4 className="text-primary">Policy Name Master</h4>
            <Button color="primary" onClick={handleAddPolicy}>
              <FaPlus className="mr-2" /> Add PolicyName
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
                  <th>Policy Name</th>
                  <th>Penalty</th>
                  <th>Number Of Days</th>
                  <th>Policies</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {policies.length > 0 ? (
                  policies.map((policy, index) => (
                    <tr key={policy.id}>
                      <td>{index + 1}</td>
                      <td>{policy.policyName || "Data Not Available"}</td>
                      <td>{policy.penalty || "Data Not Available"}</td>
                      <td>{policy.numberofdays || "Data Not Available"}</td>
                      <td>{policy.policies || "Data Not Available"}</td>
                      <td>
                        <Dropdown
                          isOpen={dropdownOpen === policy.id}
                          toggle={() => toggleDropdown(policy.id)}
                        >
                          <DropdownToggle
                            caret
                            color={
                              policy.status === "Published"
                                ? "success"
                                : "danger"
                            }
                            className="btn btn-white btn-sm btn-rounded"
                          >
                            <i
                              className={
                                policy.status === "Unpublished"
                                  ? "far fa-dot-circle text-danger"
                                  : policy.status === "Published"
                                  ? "far fa-dot-circle text-success"
                                  : "far fa-dot-circle text-info"
                              }
                            />{" "}
                            {policy.status}
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem
                              onClick={() =>
                                handleStatusChange(policy.id, "Published")
                              }
                            >
                              Published
                            </DropdownItem>
                            <DropdownItem
                              onClick={() =>
                                handleStatusChange(policy.id, "Unpublished")
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
                          onClick={() => handleEdit(policy.id)}
                          className="text-warning"
                        >
                          <FaEdit size={20} />
                        </Button>{" "}
                        <Button
                          color="link"
                          onClick={() => handleDelete(policy.id)}
                          className="text-danger"
                        >
                          <FaTrash size={20} />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center text-muted">
                      No Data Available
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

export default PolicyNameList;
