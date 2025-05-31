import React, { useEffect, useState } from "react";
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
import Swal from "sweetalert2";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import {
  getDiscountApplicabilities,
  updateApplicabilityStatus,
  deleteApplicability,
} from "../../../ApiService/DealAndDiscount/DiscountApplicable/DiscountApplicable";

import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

const DiscountApplicableList = () => {
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState({});

  // Helper function to handle empty values
  const handleEmptyValue = (value) => {
    return value ? value : "N/A";
  };

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const data = await getDiscountApplicabilities();
        setCoupons(data);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Failed to fetch coupons",
          text: error?.response?.data?.message || "An error occurred.",
        });
      }
    };

    fetchCoupons();
  }, []);

  const toggleDropdown = (id) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleStatusChange = async (couponId, currentStatus) => {
    const newStatus = !currentStatus;
    const action = newStatus ? "Publish" : "Unpublish";

    const confirmChange = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to ${action.toLowerCase()} this coupon.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${action.toLowerCase()} it!`,
      cancelButtonText: "No, keep it",
    });

    if (confirmChange.isConfirmed) {
      try {
        await updateApplicabilityStatus(couponId, newStatus);

        Swal.fire({
          icon: "success",
          title: "Status Updated",
          text: `The status has been ${newStatus ? "Published" : "Unpublished"}`,
        });

        setCoupons((prev) =>
          prev.map((coupon) =>
            coupon.coupon_id === couponId
              ? {
                  ...coupon,
                  coupon_details: {
                    ...coupon.coupon_details,
                    status: newStatus,
                  },
                }
              : coupon
          )
        );
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Failed to update status",
          text: error?.response?.data?.message || "An error occurred.",
        });
      }
    } else {
      Swal.fire("Cancelled", "The status remains unchanged.", "info");
    }
  };

  const handleDelete = async (couponId) => {
    const firstConfirm = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (firstConfirm.isConfirmed) {
      const secondConfirm = await Swal.fire({
        title: "Are you absolutely sure?",
        text: "This action cannot be undone!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (secondConfirm.isConfirmed) {
        try {
          await deleteApplicability(couponId);

          setCoupons((prev) =>
            prev.filter((coupon) => coupon.coupon_id !== couponId)
          );
          Swal.fire("Deleted!", "The coupon has been deleted.", "success");
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Failed to delete",
            text: error?.response?.data?.message || "An error occurred.",
          });
        }
      } else {
        Swal.fire("Cancelled", "Your coupon data is safe.", "info");
      }
    } else {
      Swal.fire("Cancelled", "Your coupon data is safe.", "info");
    }
  };

  const handleEdit = (id) => {
    console.log("couponId--->",id)
    navigate(`/editdiscountapplicable/${id}`, {state:{id}});
  };

  const handleView = (couponId) => {
    navigate(`/view-coupon/${couponId}`);
  };

  return (
    <div className="page-content">
      <Breadcrumbs
        title="Discount Applicabilities"
        breadcrumbItem="All Coupons"
      />

      <Card className="shadow">
        <CardBody>
          <div className="d-flex justify-content-between mb-4">
            <h4 className="text-primary">Discount Coupons</h4>
            <Button
              color="primary"
              onClick={() => navigate("/discountapplicable")}
            >
              Add Discount Coupon
            </Button>
          </div>

          <div
            className="table-responsive"
            style={{ maxHeight: "500px", overflowY: "auto" }}
          >
            <div
              style={{
                overflowX: "auto",
                overflowY: "auto",
                maxHeight: "70vh",
              }}
            >
              <Table bordered hover responsive className="custom-table">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Coupon Code</th>
                    <th>Coupon Name</th>
                    <th>Description</th>
                    <th>Discount Type</th>
                    <th>Discount Value</th>
                    <th>Applicabilities</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.length > 0 ? (
                    coupons.map((coupon, index) => (
                      <tr key={coupon.coupon_id}>
                        <td>{index + 1}</td>
                        <td>{handleEmptyValue(coupon.coupon_details.coupon_code)}</td>
                        <td>{handleEmptyValue(coupon.coupon_details.coupon_name)}</td>
                        <td>{handleEmptyValue(coupon.coupon_details.description)}</td>
                        <td>{handleEmptyValue(coupon.coupon_details.discount_type)}</td>
                        <td>{handleEmptyValue(coupon.coupon_details.discount_value)}</td>
                        <td>
                          <ul>
                            {coupon.applicabilities.map((applicability, idx) => (
                              <li key={idx}>
                                <strong>Applicable To:</strong>{" "}
                                {handleEmptyValue(applicability.applicable_to)},{" "}
                                <strong>Name:</strong>{" "}
                                {handleEmptyValue(applicability.applicable_name)},{" "}
                                <strong>Conditions:</strong>{" "}
                                {applicability.conditions.map((condition, i) => (
                                  <span key={i}>
                                    {condition.conditionName}: {condition.value}
                                    {i < applicability.conditions.length - 1 ? ", " : ""}
                                  </span>
                                ))}
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td>
                          <Dropdown
                            isOpen={dropdownOpen[coupon.coupon_id]}
                            toggle={() => toggleDropdown(coupon.coupon_id)}
                          >
                            <DropdownToggle
                              caret
                              color={coupon.coupon_details.status ? "success" : "danger"}
                              className="btn btn-white btn-sm btn-rounded"
                              onClick={(e) => e.preventDefault()}
                            >
                              <i
                                className={
                                  coupon.coupon_details.status
                                    ? "far fa-dot-circle text-success"
                                    : "far fa-dot-circle text-danger"
                                }
                              />{" "}
                              {coupon.coupon_details.status ? "Published" : "Unpublished"}
                            </DropdownToggle>
                            <DropdownMenu>
                              <DropdownItem
                                onClick={() =>
                                  handleStatusChange(
                                    coupon.coupon_id,
                                    coupon.coupon_details.status
                                  )
                                }
                              >
                                {coupon.coupon_details.status ? "Unpublish" : "Publish"}
                              </DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                        </td>
                        <td>
                          <Button
                            color="link"
                            className="text-primary"
                            onClick={() => handleView(coupon.coupon_id)}
                          >
                            <FaEye size={20} />
                          </Button>{" "}
                          <Button
                            color="link"
                            className="text-warning"
                            onClick={() => handleEdit(coupon.coupon_id)}
                          >
                            <FaEdit size={20} />
                          </Button>{" "}
                          <Button
                            color="link"
                            className="text-danger"
                            onClick={() => handleDelete(coupon.coupon_id)}
                          >
                            <FaTrash size={20} />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center">
                        No records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default DiscountApplicableList;