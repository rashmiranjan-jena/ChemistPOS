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
  getDealApplicable,
  updateDealStatus,
  deleteDeal,
} from "../../../ApiService/DealAndDiscount/DealsApplicabilities/DealsApplicabilities";
import Swal from "sweetalert2";

const DealsApplicablitiesList = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const response = await getDealApplicable();
        const data = response.data;

        const dealsData = data?.map((deal) => ({
          id: deal.deal_id,
          dealName: deal.deal_name,
          applicableTo:
            deal.applicabilities.map((a) => a.applicable_to).join(", ") ||
            "N/A",
          conditions:
            (deal.conditions ?? [])
              .map((c) => `${c.condition_type}: ${c.condition_value}`)
              .join(", ") || "N/A",

          status: deal.applicabilities.some((a) => a.status)
            ? "Published"
            : "Unpublished",
        }));

        setDeals(dealsData);
      } catch (error) {
        console.error("Error fetching deals:", error);
      }
    };

    fetchDeals();
  }, []);

  const handleAddDeal = () => {
    navigate("/dealsapplicabilities");
  };

  const handleView = (id) => {
    alert(`View Deal with ID: ${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/editdealsapplicabilities/${id}`, {state:{id}});
  };

  const handleDelete = async (id) => {
    const firstResult = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete this deal. This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
      reverseButtons: true,
    });

    if (firstResult.isConfirmed) {
      const secondResult = await Swal.fire({
        title: "Are you absolutely sure?",
        text: "This is your last chance to cancel the deletion.",
        icon: "error",
        showCancelButton: true,
        confirmButtonText: "Yes, delete permanently!",
        cancelButtonText: "No, cancel",
        reverseButtons: true,
      });

      if (secondResult.isConfirmed) {
        try {
          await deleteDeal(id);
          const updatedDeals = deals.filter((deal) => deal.id !== id);
          setDeals(updatedDeals);

          Swal.fire("Deleted!", "The deal has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting deal:", error);
          const errorMessage =  error?.response?.data?.error ||  "There was an issue deleting the deal.";
          Swal.fire({
            title: "Error!",
            text: errorMessage,
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      } else {
        Swal.fire("Cancelled", "The deal was not deleted.", "info");
      }
    } else {
      Swal.fire("Cancelled", "The deal was not deleted.", "info");
    }
  };

  const toggleDropdown = (id) => {
    setDropdownOpen((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleStatusChange = async (id, status) => {
    // Display confirmation dialog
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to ${status ? "publish" : "unpublish"} this deal.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, change it!",
      cancelButtonText: "No, cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await updateDealStatus(id, status);
        const updatedDeals = deals.map((deal) =>
          deal.id === id
            ? { ...deal, status: status ? "Published" : "Unpublished" }
            : deal
        );
        setDeals(updatedDeals);

        Swal.fire("Updated!", "The deal status has been updated.", "success");
      } catch (error) {
        console.error("Error updating status:", error);
        const errorMessage =  error?.response?.data?.error ||  "There was an issue updating the status.";
        Swal.fire({
          title: "Error!",
          text: errorMessage,
          icon: "error",
          confirmButtonText: "OK",
        });
        
      }
    } else {
      Swal.fire("Cancelled", "The deal status was not changed.", "info");
    }
  };

  return (
    <div className="page-content">
      <Breadcrumbs title="Deals" breadcrumbItem="All Deals" />

      <Card className="shadow">
        <CardBody>
          <div className="d-flex justify-content-between mb-4">
            <h4 className="text-primary">Deals Master</h4>
            <Button color="primary" onClick={handleAddDeal}>
              <FaPlus className="mr-2" /> Add Deal
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
                  <th>Deal Name</th>
                  <th>Applicable To</th>
                  <th>Conditions</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {deals.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">
                      <p>No data is available</p>
                    </td>
                  </tr>
                ) : (
                  deals.map((deal, index) => (
                    <tr key={deal.id}>
                      <td>{index + 1}</td>
                      <td>{deal.dealName}</td>
                      <td>
                        <ul>
                          <li>{deal.applicableTo}</li>
                        </ul>
                      </td>
                      <td>
                        <ul>
                          <li>{deal.conditions}</li>
                        </ul>
                      </td>
                      <td>
                        <Dropdown
                          isOpen={dropdownOpen[deal.id]}
                          toggle={() => toggleDropdown(deal.id)}
                        >
                          <DropdownToggle
                            caret
                            color={
                              deal.status === "Published" ? "success" : "danger"
                            }
                          >
                            {deal.status}
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem
                              onClick={() => handleStatusChange(deal.id, true)}
                            >
                              Published
                            </DropdownItem>
                            <DropdownItem
                              onClick={() => handleStatusChange(deal.id, false)}
                            >
                              Unpublished
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </td>
                      <td>
                        <Button
                          color="link"
                          onClick={() => handleView(deal.id)}
                          className="text-primary"
                        >
                          <FaEye size={20} />
                        </Button>{" "}
                        <Button
                          color="link"
                          onClick={() => handleEdit(deal.id)}
                          className="text-warning"
                        >
                          <FaEdit size={20} />
                        </Button>{" "}
                        <Button
                          color="link"
                          onClick={() => handleDelete(deal.id)}
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

export default DealsApplicablitiesList;
