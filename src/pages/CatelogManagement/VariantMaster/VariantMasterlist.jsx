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
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import {
  fetchVariants,
  deleteVariant,
  updateVariantStatus,
} from "../../../ApiService/VarientMaster/VarientMaster";
import Swal from "sweetalert2";

const VariantMasterlist = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [variants, setVariants] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const toggleDropdown = (id) => {
    setDropdownOpen((prevState) => ({ ...prevState, [id]: !prevState[id] }));
  };

  useEffect(() => {
    const loadVariants = async () => {
      try {
        const data = await fetchVariants();
        setVariants(data);
      } catch (error) {
        console.error("Error fetching variants:", error);
      }
    };

    loadVariants();
  }, []);

  // const handleAddVariant = () => navigate("/variantmaster");
  const handleEdit = (id) => alert(`Edit Variant with ID: ${id}`);

  // const handleStatusChange = async (id, status) => {
  //   try {
  //     const result = await Swal.fire({
  //       title: 'Are you sure?',
  //       text: `Are you sure you want to ${status ? 'publish' : 'unpublish'} this variant?`,
  //       icon: 'warning',
  //       showCancelButton: true,
  //       confirmButtonColor: '#3085d6',
  //       cancelButtonColor: '#d33',
  //       confirmButtonText: `Yes, ${status ? 'Publish' : 'Unpublish'} it!`
  //     });

  //     if (result.isConfirmed) {
  //       const response = await updateVariantStatus(id, status);

  //       // Log the full response for debugging
  //       console.log(response);

  //       // Custom messages for success and error
  //       const successMessage = response?.message || "Variant status updated successfully!";
  //       const errorMessage = response?.error || "Failed to update the variant status. Please try again.";

  //       if (response) {
  //         Swal.fire('Success!', successMessage, 'success');
  //         setVariants((prevVariants) =>
  //           prevVariants.map((variant) =>
  //             variant.varient_id === id ? { ...variant, status: status } : variant
  //           )
  //         );
  //       } else {
  //         Swal.fire('Failed!', errorMessage, 'error');
  //       }
  //     }
  //   } catch (error) {
  //     const errorMessage = error.message || 'An error occurred while updating the status.';
  //     Swal.fire('Error!', errorMessage, 'error');
  //   }
  // };

  // const toggleModal = (variant) => {
  //   setSelectedVariant(variant);
  //   setModalOpen(!modalOpen);
  // };

  // const handleDelete = async (id) => {
  //   const firstResult = await Swal.fire({
  //     title: 'Are you sure?',
  //     text: "You won't be able to revert this!",
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Yes, delete it!'
  //   });

  //   if (firstResult.isConfirmed) {
  //     const secondResult = await Swal.fire({
  //       title: 'Are you absolutely sure?',
  //       text: "This action is irreversible. Please confirm again.",
  //       icon: 'warning',
  //       showCancelButton: true,
  //       confirmButtonColor: '#3085d6',
  //       cancelButtonColor: '#d33',
  //       confirmButtonText: 'Yes, delete it!'
  //     });

  //     if (secondResult.isConfirmed) {
  //       try {
  //         const response = await deleteVariant(id);

  //         if (response && response.message) {
  //           Swal.fire('Deleted!', response.message, 'success');
  //           setVariants((prevVariants) => prevVariants.filter(variant => variant.varient_id !== id));
  //         } else {
  //           Swal.fire('Failed!', response.error || 'Failed to delete the variant.', 'error');
  //         }
  //       } catch (error) {
  //         Swal.fire('Error!', error.message || 'An error occurred while deleting the variant.', 'error');
  //       }
  //     } else {
  //       Swal.fire('Cancelled', 'The variant was not deleted.', 'info');
  //     }
  //   } else {
  //     Swal.fire('Cancelled', 'The variant was not deleted.', 'info');
  //   }
  // };

  return (
    <div className="page-content">
      <Breadcrumbs title="Variants" breadcrumbItem="All Variants" />

      <Card className="shadow">
        <CardBody>
          <div className="d-flex justify-content-between mb-4">
            <h4 className="text-primary">Variant Master</h4>
            {/* <Button color="primary" onClick={handleAddVariant}>
              <FaPlus className="mr-2" /> Add Variant
            </Button> */}
          </div>

          <div
            className="table-responsive"
            style={{ maxHeight: "500px", overflowY: "auto" }}
          >
            <Table bordered hover responsive className="custom-table">
              <thead className="table-light">
                <tr>
                  <th>Sr. No.</th>
                  <th>Variant Name</th>
                  <th>Order</th>
                   {/* <th>Status</th> */}
                  {/* <th>Action</th> */}

                </tr>
              </thead>
              <tbody>
                {variants && variants.length > 0 ? (
                  variants.map((variant, idx) => (
                    <tr key={variant.varient_id}>
                      <td>{idx + 1}</td>
                      <td>{variant.varient_name}</td>
                      <td>{variant.order}</td>
                       {/* <td>
                      <Button color="link" onClick={() => toggleModal(variant)} className="text-primary">
                        Click here to Show Details
                      </Button>
                    </td> */}
                    {/* <td>
                      <Dropdown
                        isOpen={dropdownOpen[variant.varient_id] || false}
                        toggle={() => toggleDropdown(variant.varient_id)}
                      >
                        <DropdownToggle
                          caret
                          color={variant.status ? "success" : "danger"} 
                          className="btn btn-sm btn-rounded"
                          aria-label={`Toggle status for ${variant.varient_name}`}
                        >
                          <i
                            className={variant.status ? "far fa-dot-circle text-success" : "far fa-dot-circle text-danger"}
                          />{" "}
                          {variant.status ? "Published" : "Unpublished"}
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem onClick={() => handleStatusChange(variant.varient_id, true)}>
                            Published
                          </DropdownItem>
                          <DropdownItem onClick={() => handleStatusChange(variant.varient_id, false)}>
                            Unpublished
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </td> */}
                    {/* <td>
                      <Button color="link" onClick={() => handleEdit(variant.varient_id)} className="text-warning">
                        <FaEdit size={20} aria-label={`Edit ${variant.varient_name}`} />
                      </Button>{" "}
                      <Button color="link" onClick={() => handleDelete(variant.varient_id)} className="text-danger">
                        <FaTrash size={20} aria-label={`Delete ${variant.varient_name}`} />
                      </Button>
                    </td> */}

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center text-muted">
                      No variant master data available
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </CardBody>
      </Card>

      {/* <Modal isOpen={modalOpen} toggle={() => toggleModal(null)} size="lg" centered>
        <ModalHeader toggle={() => toggleModal(null)}>
          {selectedVariant ? selectedVariant.varient_name : "Variant Details"}
        </ModalHeader>
        <ModalBody style={{ maxHeight: "400px", overflowY: "auto" }}>
          {selectedVariant ? (
            <div>
              <p><strong>Variant Name:</strong> {selectedVariant.varient_name}</p>
              <p><strong>Variant Details:</strong> {selectedVariant.varient_details}</p>
              <p><strong>Status:</strong> {selectedVariant.status ? "Published" : "Unpublished"}</p>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => toggleModal(null)}>
            Close
          </Button>
        </ModalFooter>
      </Modal> */}
    </div>
  );
};

export default VariantMasterlist;
