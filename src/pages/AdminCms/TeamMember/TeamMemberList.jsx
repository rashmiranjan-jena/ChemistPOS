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
  Modal,
  ModalBody,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import Swal from "sweetalert2";
import {
  fetchTeamMembers,
  updateMemberStatus,
  deleteTeamMember,
} from "../../../ApiService/AdminCms/TeamMember/TeamMember";

const TeamMemberList = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadTeamMembers = async () => {
      try {
        const data = await fetchTeamMembers();
        setTeamMembers(data);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to fetch team members. Please try again later.",
        });
      }
    };
    loadTeamMembers();
  }, []);

  const handleAddMember = () => {
    navigate("/admincms/teammember");
  };

  // const handleView = (id) => {
  //   alert(`View Member with ID: ${id}`);
  // };

  const handleEdit = (id) => {
    navigate("/admincms/teammember", { state: { id } });
  };

  const handleDelete = async (id) => {
    try {
      const firstConfirmation = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
      });

      if (firstConfirmation.isConfirmed) {
        const secondConfirmation = await Swal.fire({
          title: "Are you absolutely sure?",
          text: "This action cannot be undone. Are you sure you want to delete this member?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, delete permanently!",
          cancelButtonText: "No, go back!",
        });

        if (secondConfirmation.isConfirmed) {
          await deleteTeamMember(id);
          Swal.fire("Deleted!", "The team member has been deleted.", "success");
          setTeamMembers((prevMembers) =>
            prevMembers.filter((member) => member.member_id !== id)
          );
        }
      }
    } catch (error) {
      console.error("Error deleting team member:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to delete the team member. Please try again later.",
      });
    }
  };

  const handleStatusChange = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await updateMemberStatus(id, newStatus);
      setTeamMembers(
        teamMembers.map((member) =>
          member.member_id === id ? { ...member, status: newStatus } : member
        )
      );
    } catch (error) {
      console.error("Error updating member status:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to update member status. Please try again later.",
      });
    }
  };

  const toggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const toggleModal = (imageUrl) => {
    setModalImage(imageUrl);
    setModalOpen(!modalOpen);
  };

  return (
    <div className="page-content">
      <Breadcrumbs title="Team Members" breadcrumbItem="All Team Members" />

      <Card className="shadow">
        <CardBody>
          <div className="d-flex justify-content-between mb-4">
            <h4 className="text-primary">Team Members</h4>
            <Button color="primary" onClick={handleAddMember}>
              <FaPlus className="mr-2" /> Add Team Member
            </Button>
          </div>

          <div className="table-responsive" style={{ maxHeight: "500px" }}>
            <Table bordered hover responsive className="custom-table">
              <thead className="table-light">
                <tr>
                  <th>Sr. No.</th>
                  <th>Member Name</th>
                  <th>Designation</th>
                  <th>Member Image</th>
                  <th>Social Link</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {teamMembers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No data available
                    </td>
                  </tr>
                ) : (
                  teamMembers.map((member, index) => (
                    <tr key={member.member_id}>
                      <td>{index + 1}</td>
                      <td>{member.member_name || "N/A"}</td>
                      <td>{member.designation || "N/A"}</td>
                      <td>
                        <img
                          src={
                            member.member_image
                              ? `${import.meta.env.VITE_API_BASE_URL}${
                                  member.member_image
                                }`
                              : "N/A"
                          }
                          alt="Member"
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                            borderRadius: "20%",
                          }}
                          onClick={() =>
                            toggleModal(
                              `${import.meta.env.VITE_API_BASE_URL}${
                                member.member_image
                              }`
                            )
                          }
                        />
                      </td>
                      <td>
                        {member.social_links.length > 0
                          ? member.social_links.map((link, idx) => (
                              <a
                                key={idx}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="d-block text-primary"
                              >
                                {link.platform}
                              </a>
                            ))
                          : "N/A"}
                      </td>
                      <td>
                        <Dropdown
                          isOpen={openDropdown === member.member_id}
                          toggle={() => toggleDropdown(member.member_id)}
                        >
                          <DropdownToggle
                            caret
                            color={member.status ? "success" : "danger"}
                            className="btn btn-white btn-sm btn-rounded"
                          >
                            <i
                              className={
                                member.status
                                  ? "far fa-dot-circle text-success"
                                  : "far fa-dot-circle text-danger"
                              }
                            />{" "}
                            {member.status ? "Published" : "Unpublished"}
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem
                              onClick={() =>
                                handleStatusChange(
                                  member.member_id,
                                  member.status
                                )
                              }
                            >
                              {member.status ? "Unpublish" : "Publish"}
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </td>
                      <td>
                        <Button
                          color="link"
                          onClick={() => handleEdit(member.member_id)}
                          className="text-warning"
                        >
                          <FaEdit size={20} />
                        </Button>{" "}
                        <Button
                          color="link"
                          onClick={() => handleDelete(member.member_id)}
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

      {/* Modal to display the image */}
      <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)}>
        <ModalBody>
          <img
            src={modalImage}
            alt="Team Member"
            style={{ width: "100%", height: "auto", borderRadius: "10px" }}
          />
        </ModalBody>
      </Modal>
    </div>
  );
};

export default TeamMemberList;
