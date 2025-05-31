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
import { FaEye, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import {
  getCoupons,
  updateCouponStatus,
  deleteCoupon
} from "../../../ApiService/DealAndDiscount/DiscountCode/DiscountCode";
import Swal from "sweetalert2";

const DiscountCodelist = () => {
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState({});

  // Fetch coupons on component mount
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const data = await getCoupons();
        setCoupons(data.coupons);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Failed to fetch coupons",
          text: error?.response?.data?.message || "Error fetching coupons.",
        });
      }
    };
    fetchCoupons();
  }, []);

  // Toggle dropdown for coupon status
  const toggleDropdown = (id) => {
    setDropdownOpen((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  // Add new discount code
  const handleAddDeal = () => {
    navigate("/discountcodes");
  };

  // Handle Status Change
  const handleStatusChange = async (couponId, newStatus) => {
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
        await updateCouponStatus(couponId, newStatus);
        Swal.fire({
          icon: "success",
          title: "Status Updated",
          text: `Coupon status has been updated to: ${
            newStatus ? "Published" : "Unpublished"
          }`,
        });
        setCoupons((prevCoupons) =>
          prevCoupons.map((coupon) =>
            coupon.coupon_id === couponId
              ? { ...coupon, status: newStatus }
              : coupon
          )
        );
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error updating coupon status",
          text:
            error?.response?.data?.message || "Error updating the coupon status.",
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
          const response = await deleteCoupon(couponId);
          
            setCoupons((prevCoupons) =>
              prevCoupons.filter((coupon) => coupon.coupon_id !== couponId)
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

  const handleEdit = (id) =>{
    navigate("/discountcodes", {state:{id}})
  }

  // Format time to HH:mm
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    return `${hours < 10 ? "0" : ""}${hours}:${
      minutes < 10 ? "0" : ""
    }${minutes}`;
  };

  return (
    <div className="page-content">
      <Breadcrumbs title="Discount Codes" breadcrumbItem="All Discount Codes" />

      <Card className="shadow">
        <CardBody>
          <div className="d-flex justify-content-between mb-4">
            <h4 className="text-primary">Discount Codes</h4>
            <Button color="primary" onClick={handleAddDeal}>
              <FaPlus className="mr-2" /> Add Discount Code
            </Button>
          </div>

          <div
            className="table-responsive"
            style={{ maxHeight: "300px", overflowY: "auto" }}
          >
            <Table bordered hover responsive className="custom-table">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Coupon Code</th>
                  <th>Discount Type</th>
                  <th>Discount Value</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Min Order Value</th>
                  <th>Max Discount Value</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {coupons.length > 0 ? (
                  coupons?.map((coupon, index) => (
                    <tr key={coupon.coupon_id}>
                      <td>{index + 1}</td>
                      <td>{coupon.coupon_code || "N/A"}</td>
                      <td>{coupon.discount_type || "N/A"}</td>
                      <td>{coupon.discount_value || "N/A"}</td>
                      <td>{coupon.start_date.split("T")[0] || "N/A"}</td>
                      <td>{coupon.end_date.split("T")[0] || "N/A"}</td>
                      <td>{formatTime(coupon.start_date) || "N/A"}</td>
                      <td>{formatTime(coupon.end_date) || "N/A"}</td>
                      <td>
                        {coupon.min_order_value
                          ? `$${coupon.min_order_value}`
                          : "N/A"}
                      </td>
                      <td>
                        {coupon.max_discount_value
                          ? `$${coupon.max_discount_value}`
                          : "N/A"}
                      </td>
                      <td>
                        <Dropdown
                          isOpen={dropdownOpen[coupon.coupon_id]}
                          toggle={() => toggleDropdown(coupon.coupon_id)}
                        >
                          <DropdownToggle
                            caret
                            color={coupon.status ? "success" : "danger"}
                            className="btn btn-white btn-sm btn-rounded"
                            onClick={(e) => e.preventDefault()}
                          >
                            <i
                              className={
                                coupon.status
                                  ? "far fa-dot-circle text-success"
                                  : "far fa-dot-circle text-danger"
                              }
                            />{" "}
                            {coupon.status ? "Published" : "Unpublished"}
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem
                              onClick={() =>
                                handleStatusChange(coupon.coupon_id, true)
                              }
                            >
                              Publish
                            </DropdownItem>
                            <DropdownItem
                              onClick={() =>
                                handleStatusChange(coupon.coupon_id, false)
                              }
                            >
                              Unpublish
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </td>
                      <td>
                        {/* <Button
                          color="link"
                          className="text-primary"
                          onClick={() =>
                            alert(`View coupon: ${coupon.coupon_id}`)
                          }
                        >
                          <FaEye size={20} />
                        </Button>{" "} */}
                        <Button
                          color="link"
                          className="text-warning"
                          onClick={() =>
                            handleEdit(coupon.coupon_id)
                          }
                        >
                          <FaEdit size={20} />
                        </Button>{" "}
                        <Button
                          color="link"
                          className="text-danger"
                          onClick={() =>
                            handleDelete(coupon.coupon_id)
                          }
                        >
                          <FaTrash size={20} />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="12" className="text-center text-muted">
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

export default DiscountCodelist;
