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
  fetchCareerListings,
  updateCareerStatus,
  deleteJob,
} from "../../../ApiService/Career/Career";
import Swal from "sweetalert2";

const CareerList = () => {
  const navigate = useNavigate();
  const [careerListings, setCareerListings] = useState([]);

  useEffect(() => {
    getCareerListings();
  }, []);

  const getCareerListings = async () => {
    try {
      const data = await fetchCareerListings();
      const careersWithDropdownState = data.map((career) => ({
        ...career,
        statusDropdownOpen: false,
      }));
      setCareerListings(careersWithDropdownState);
    } catch (error) {
      console.error("Error fetching career listings:", error.message);
      Swal.fire({
        title: "Error",
        text: `Failed to update status. ${error.message}`,
        icon: "error",
        confirmButtonText: "Retry",
      });
    }
  };

  const handelEdit = (id) =>{
  navigate("/career", {state: {id}})
  }

  const handleAddCareerListing = () => {
    navigate("/career");
  };

  const toggleStatusDropdown = (id) => {
    setCareerListings((prev) =>
      prev.map((career) =>
        career.carrer_id === id
          ? { ...career, statusDropdownOpen: !career.statusDropdownOpen }
          : career
      )
    );
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateCareerStatus(id, status);

      setCareerListings((prev) =>
        prev.map((career) =>
          career.carrer_id === id ? { ...career, status } : career
        )
      );

      Swal.fire({
        title: "Status Updated",
        text: `The status has been updated to ${
          status ? "Published" : "Unpublished"
        }.`,
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Failed to update status:", error.message);

      Swal.fire({
        title: "Error",
        text: `Failed to update status. ${error.message}`,
        icon: "error",
        confirmButtonText: "Retry",
      });
    }
  };

  const handleDeleteCareer = async (id) => {
    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this career listing? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete it!",
      cancelButtonText: "No, Cancel",
    });

    if (confirmResult.isConfirmed) {
      const secondConfirmResult = await Swal.fire({
        title: "Are you absolutely sure?",
        text: "This is your final chance to cancel the deletion.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Delete it!",
        cancelButtonText: "No, Cancel",
      });

      if (secondConfirmResult.isConfirmed) {
        try {
          await deleteJob(id);

          setCareerListings((prev) =>
            prev.filter((career) => career.carrer_id !== id)
          );

          Swal.fire({
            title: "Deleted!",
            text: "The career listing has been deleted.",
            icon: "success",
            confirmButtonText: "OK",
          });
        } catch (error) {
          console.error("Failed to delete career listing:", error.message);

          Swal.fire({
            title: "Error",
            text: `Failed to delete the career listing. ${error.message}`,
            icon: "error",
            confirmButtonText: "Retry",
          });
        }
      } else {
        Swal.fire({
          title: "Cancelled",
          text: "The career listing was not deleted.",
          icon: "info",
          confirmButtonText: "OK",
        });
      }
    }
  };

  return (
    <div className="page-content">
      <Breadcrumbs
        title="Career Listings"
        breadcrumbItem="All Career Listings"
      />

      <Card className="shadow">
        <CardBody>
          <div className="d-flex justify-content-between mb-4">
            <h4 className="text-primary">Career Listings</h4>
            <Button color="primary" onClick={handleAddCareerListing}>
              <FaPlus className="mr-2" /> Add Career
            </Button>
          </div>

          <div className="table-responsive" style={{ maxHeight: "500px" }}>
            {careerListings.length > 0 ? (
              <Table bordered hover responsive className="custom-table">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Job Role</th>
                    <th>Total Openings</th>
                    <th>Job Description</th>
                    <th>Starting Date</th>
                    <th>Ending Date</th>
                    <th>Experience</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {careerListings.map((career, index) => (
                    <tr key={career.carrer_id}>
                      <td>{index + 1}</td>
                      <td>{career.job_title}</td>
                      <td>{career.total_opening}</td>
                      <td>{career.job_description}</td>
                      <td>{career.start_date}</td>
                      <td>{career.end_date}</td>
                      <td>{career.experience}</td>
                      <td>{career.location}</td>
                      <td>
                        <Dropdown
                          isOpen={career.statusDropdownOpen}
                          toggle={() => toggleStatusDropdown(career.carrer_id)}
                        >
                          <DropdownToggle
                            caret
                            color={career.status ? "success" : "danger"}
                            className="btn btn-white btn-sm btn-rounded"
                          >
                            {career.status ? "Published" : "Unpublished"}
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem
                              active={career.status === true}
                              onClick={() =>
                                handleStatusChange(career.carrer_id, true)
                              }
                            >
                              Published
                            </DropdownItem>
                            <DropdownItem
                              active={career.status === false}
                              onClick={() =>
                                handleStatusChange(career.carrer_id, false)
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
                          onClick={() => handelEdit(career.carrer_id)}
                          className="text-warning"
                        >
                          <FaEdit size={20} />
                        </Button>{" "}
                        <Button
                          color="link"
                          onClick={() => handleDeleteCareer(career.carrer_id)}
                          className="text-danger"
                        >
                          <FaTrash size={20} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <p className="text-center text-muted">No Data Available</p>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default CareerList;
