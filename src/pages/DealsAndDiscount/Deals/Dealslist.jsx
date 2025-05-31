import React, { useState, useEffect } from "react";
import { Button, Table, Card, CardBody, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Input } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { fetchDeals, updateDealStatus, deleteDeal } from "../../../ApiService/DealAndDiscount/Deals/Deals";
import Swal from "sweetalert2";

const Dealslist = () => {
  const navigate = useNavigate();
  const [deals, setDeals] = useState([]);
  const [filteredDeals, setFilteredDeals] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const getDeals = async () => {
      try {
        const data = await fetchDeals();
        setDeals(data);
        setFilteredDeals(data);
      } catch (error) {
        console.error("Error fetching deals data:", error);
      }
    };

    getDeals();
  }, []);

  useEffect(() => {
    const filtered = deals?.filter(deal => {
     
      const dealName = deal.deal_name.toLowerCase().includes(searchTerm.toLowerCase());
      const dealType = deal.deal_type.toLowerCase().includes(searchTerm.toLowerCase());
      const discountValue = deal?.discount_value?.toString().includes(searchTerm);
      const startDate = new Date(deal.start_date).toLocaleDateString().includes(searchTerm);
      const endDate = new Date(deal.end_date).toLocaleDateString().includes(searchTerm);
      return dealName || dealType || discountValue || startDate || endDate;
    });
    
    setFilteredDeals(filtered);
  }, [searchTerm, deals]);

  const handleAddDeal = () => {
    navigate("/deals");
  };

  // const handleView = (id) => {
  //   alert(`View Deal with ID: ${id}`);
  // };

  const handleEdit = (id) => {
   navigate(`/editdeals/${id}`);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete the deal`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    });

    if (result.isConfirmed) {
      const doubleCheck = await Swal.fire({
        title: 'Are you absolutely sure?',
        text: 'This action cannot be undone!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it'
      });

      if (doubleCheck.isConfirmed) {
        try {
          await deleteDeal(id);
          setDeals(deals.filter(deal => deal.deal_id !== id));
          setFilteredDeals(filteredDeals.filter(deal => deal.deal_id !== id));
          Swal.fire('Deleted!', `Deal has been deleted.`, 'success');
        } catch (error) {
          console.error("Error deleting deal:", error);
          Swal.fire('Error!', 'Error deleting deal. Please try again.', 'error');
        }
      } else {
        Swal.fire('Cancelled', 'Your deal is safe', 'info');
      }
    } else {
      Swal.fire('Cancelled', 'Your deal is safe', 'info');
    }
  };

  const toggleDropdown = (id) => {
    setDropdownOpen((prevState) => ({
      ...prevState,
      [id]: !prevState[id], 
    }));
  };

  const handleStatusChange = async (id, status) => {
    try {
      const newStatus = status === "Published";
      const updatedDeal = await updateDealStatus(id, newStatus);
      setDeals((prevDeals) =>
        prevDeals.map((deal) =>
          deal.deal_id === id ? { ...deal, status: newStatus } : deal
        )
      );
      Swal.fire({
        title: 'Status Updated',
        text: `Deal  status changed to ${status}`,
        icon: 'success',
        confirmButtonText: 'OK'
      });
    } catch (error) {
      console.error("Error updating deal status:", error);
      Swal.fire({
        title: 'Error',
        text: 'Error updating deal status. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
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

          <div className="d-flex justify-content-end mb-4">
            <Input
              type="text"
              placeholder="Search Deals....."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ maxWidth: "300px" }}
            />
          </div>

          <div className="table-responsive" style={{ maxHeight: "400px", overflowY: "auto" }}>
            <Table bordered hover responsive className="custom-table">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Deal Name</th>
                  <th>Deal Type</th>
                  <th>Discount Value</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeals.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center">
                      No deals available.
                    </td>
                  </tr>
                ) : (
                  filteredDeals?.map((deal, index) => (
                    <tr key={deal.deal_id}>
                      <td>{index + 1}</td>
                      <td>{deal.deal_name || 0}</td>
                      <td>{deal.deal_type || 0}</td>
                      <td>{deal.discount_value || 0}</td>
                      <td>{new Date(deal.start_date).toLocaleString()}</td>
                      <td>{new Date(deal.end_date).toLocaleString()}</td>
                      <td>{deal.description || "N/A"}</td>
                      <td>
                        <Dropdown
                          isOpen={dropdownOpen[deal.deal_id]}
                          toggle={() => toggleDropdown(deal.deal_id)}
                        >
                          <DropdownToggle caret color={deal.status ? "success" : "danger"}>
                            {deal.status ? "Published" : "Unpublished"}
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem onClick={() => handleStatusChange(deal.deal_id, "Published")}>
                              Published
                            </DropdownItem>
                            <DropdownItem onClick={() => handleStatusChange(deal.deal_id, "Unpublished")}>
                              Unpublished
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </td>
                      <td>
                        {/* <Button color="link" onClick={() => handleView(deal.deal_id)} className="text-primary">
                          <FaEye size={20} />
                        </Button>{" "} */}
                        <Button color="link" onClick={() => handleEdit(deal.deal_id)} className="text-warning">
                          <FaEdit size={20} />
                        </Button>{" "}
                        <Button color="link" onClick={() => handleDelete(deal.deal_id)} className="text-danger">
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

export default Dealslist;
