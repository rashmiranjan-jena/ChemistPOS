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
  getTestimonials,
  updateTestimonialStatus,
  deleteTestimonial,
} from "../../../ApiService/AdminCms/Testimonials/Testimonials";

const TestimonialsList = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await getTestimonials();
        setTestimonials(data);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load testimonials",
        });
      }
    };

    fetchTestimonials();
  }, []);

  const handleAddAbout = () => {
    navigate("/admincms/testimonial");
  };

  // const handleView = (id) => {
  //   alert(`View Testimonial with ID: ${id}`);
  // };

  const handleEdit = (id) => {
    navigate("/admincms/testimonial", { state: { id } });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Are you absolutely sure?",
          text: "This action cannot be undone.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Yes, delete it!",
        }).then(async (finalResult) => {
          if (finalResult.isConfirmed) {
            try {
              const data = await deleteTestimonial(id);

              setTestimonials((prevTestimonials) =>
                prevTestimonials.filter(
                  (testimonial) => testimonial.testimoni_id !== id
                )
              );
              Swal.fire({
                title: "Deleted!",
                text: "The contact info has been deleted.",
                icon: "success",
                confirmButtonText: "OK",
              });
            } catch (error) {
              Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to delete the testimonial.",
              });
            }
          }
        });
      }
    });
  };

  const toggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const handleStatusChange = async (id, status) => {
    try {
      const data = await updateTestimonialStatus(id, status);
      if (data) {
        Swal.fire({
          icon: "success",
          title: "Status Updated",
          text: `The status has been updated to ${
            status ? "Published" : "Unpublished"
          }.`,
        });
        setTestimonials((prevTestimonials) =>
          prevTestimonials.map((testimonial) =>
            testimonial.testimoni_id === id
              ? { ...testimonial, status }
              : testimonial
          )
        );
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update status",
      });
    }
  };

  const toggleModal = (imageUrl) => {
    setModalImage(imageUrl);
    setModalOpen(!modalOpen);
  };

  return (
    <div className="page-content">
      {/* Breadcrumb */}
      <Breadcrumbs title="Testimonials" breadcrumbItem="All Testimonials" />

      <Card className="shadow">
        <CardBody>
          <div className="d-flex justify-content-between mb-4">
            <h4 className="text-primary">Testimonials Master</h4>
            <Button color="primary" onClick={handleAddAbout}>
              <FaPlus className="mr-2" /> Add Testimonial
            </Button>
          </div>

          <div className="table-responsive" style={{ maxHeight: "500px" }}>
            <Table bordered hover responsive className="custom-table">
              <thead className="table-light">
                <tr>
                  <th>Sr. No.</th>
                  <th>Date</th>
                  <th>Testimonial Name</th>
                  <th>Testimonial</th>
                  <th>Designation</th>
                  <th>Testimonial Image</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {testimonials.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center">
                      No data available
                    </td>
                  </tr>
                ) : (
                  testimonials.map((testimonial, index) => (
                    <tr key={testimonial.testimoni_id}>
                      <td>{index + 1}</td>
                      <td>{testimonial.date ? testimonial.date : "N/A"}</td>
                      <td>
                        {testimonial.testimoni_name
                          ? testimonial.testimoni_name
                          : "N/A"}
                      </td>
                      <td>
                        {testimonial.testimonial
                          ? testimonial.testimonial
                          : "N/A"}
                      </td>
                      <td>
                        {testimonial.designation
                          ? testimonial.designation
                          : "N/A"}
                      </td>
                      <td>
                        <img
                          src={
                            testimonial.testimoni_image
                              ? `${import.meta.env.VITE_API_BASE_URL}${
                                  testimonial.testimoni_image
                                }`
                              : "N/A"
                          }
                          alt="Testimonial"
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                            borderRadius: "20%",
                          }}
                          onClick={() =>
                            toggleModal(
                              `${import.meta.env.VITE_API_BASE_URL}${
                                testimonial.testimoni_image
                              }`
                            )
                          } // On click, open modal
                        />
                      </td>
                      <td>
                        <Dropdown
                          isOpen={openDropdown === testimonial.testimoni_id}
                          toggle={() =>
                            toggleDropdown(testimonial.testimoni_id)
                          }
                        >
                          <DropdownToggle
                            caret
                            color={testimonial.status ? "success" : "danger"}
                            className="btn btn-white btn-sm btn-rounded"
                          >
                            <i
                              className={
                                testimonial.status
                                  ? "far fa-dot-circle text-success"
                                  : "far fa-dot-circle text-danger"
                              }
                            />{" "}
                            {testimonial.status ? "Published" : "Unpublished"}
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem
                              onClick={() =>
                                handleStatusChange(
                                  testimonial.testimoni_id,
                                  true
                                )
                              }
                            >
                              Published
                            </DropdownItem>
                            <DropdownItem
                              onClick={() =>
                                handleStatusChange(
                                  testimonial.testimoni_id,
                                  false
                                )
                              }
                            >
                              Unpublished
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </td>
                      <td>
                        {/* <Button
                          color="link"
                          onClick={() => handleView(testimonial.testimoni_id)}
                          className="text-primary"
                        >
                          <FaEye size={20} />
                        </Button>{" "} */}
                        <Button
                          color="link"
                          onClick={() => handleEdit(testimonial.testimoni_id)}
                          className="text-warning"
                        >
                          <FaEdit size={20} />
                        </Button>{" "}
                        <Button
                          color="link"
                          onClick={() => handleDelete(testimonial.testimoni_id)}
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
            alt="Testimonial"
            style={{ width: "100%", height: "auto", borderRadius: "10px" }}
          />
        </ModalBody>
      </Modal>
    </div>
  );
};

export default TestimonialsList;
