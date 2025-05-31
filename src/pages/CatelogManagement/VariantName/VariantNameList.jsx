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
import { FaEye, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import {
  fetchVariantsData,
  deleteVariant,
  updateVariantStatus,
} from "../../../ApiService/VarientName/VarientName";
import Swal from "sweetalert2";

const VariantNameList = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [variants, setVariants] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const toggleDropdown = (id) => {
    setDropdownOpen((prevState) => ({ ...prevState, [id]: !prevState[id] }));
  };

  const fetchVariants = async () => {
    try {
      const variantData = await fetchVariantsData();
      setVariants(variantData);
    } catch (error) {
      console.error("Error fetching variant data:", error);
    }
  };

  useEffect(() => {
    fetchVariants();
  }, []);

  // const handleAddVariant = () => navigate("/variantname");
  // const handleEdit = (id) => alert(`Edit Variant with ID: ${id}`);

  const handleDelete = async (id) => {
    // First confirmation prompt
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      // Second confirmation to make sure
      const secondResult = await Swal.fire({
        title: "Are you really sure?",
        text: "This action cannot be undone.",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (secondResult.isConfirmed) {
        try {
          const response = await deleteVariant(id);

          if (response.status === 200) {
            setVariants((prevVariants) =>
              prevVariants.filter((variant) => variant.varient_name_id !== id)
            );
            Swal.fire("Deleted!", "Variant has been deleted.", "success");
          } else {
            Swal.fire("Failed!", "Failed to delete the variant.", "error");
          }
        } catch (error) {
          Swal.fire(
            "Error!",
            "An error occurred while deleting the variant.",
            "error"
          );
        }
      }
    }
  };

  const handleStatusChange = async (id, status) => {
    // First confirmation prompt before changing status
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to ${status ? "publish" : "unpublish"} this variant?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, change it!",
    });

    if (result.isConfirmed) {
      try {
        // Proceed with status change only after confirmation
        const response = await updateVariantStatus(id, status);
        if (response.status === 200) {
          setVariants((prevVariants) =>
            prevVariants.map((variant) =>
              variant.varient_name_id === id ? { ...variant, status } : variant
            )
          );
          Swal.fire(
            "Updated!",
            `Variant status has been updated to ${
              status ? "Published" : "Unpublished"
            }`,
            "success"
          );
        } else {
          Swal.fire("Failed!", "Failed to update the variant status.", "error");
        }
      } catch (error) {
        Swal.fire(
          "Error!",
          "An error occurred while updating the variant status.",
          "error"
        );
      }
    } else {
      Swal.fire("Cancelled", "The variant status was not changed", "info");
    }
  };

  const handleView = (variant) => {
    setSelectedVariant(variant);
    setModalOpen(true); // Open the modal when the "View" button is clicked
  };

  const toggleModal = () => setModalOpen(!modalOpen); // Toggle modal visibility

  return (
    <div className="page-content">
      <Breadcrumbs title="VariantsName" breadcrumbItem="All VariantsName" />

      <Card className="shadow">
        <CardBody>
          <div className="d-flex justify-content-between mb-4">
            <h4 className="text-primary">Variant Name Master</h4>
            {/* <Button color="primary" onClick={handleAddVariant}>
              <FaPlus className="mr-2" /> Add VariantName
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
                  <th>Unit Name</th>
                  <th>Display Name</th>
                  {/* <th>Status</th>
                  <th>Action</th> */}

                </tr>
              </thead>
              <tbody>
                {variants && variants.length > 0 ? (
                  variants.map((variant, idx) => (
                    <tr key={variant.varient_name_id}>
                      <td>{idx + 1}</td>
                      <td>{variant.unit_name}</td>
                      <td>{variant.display_name}</td>
                      {/* <td>
                      <Dropdown isOpen={dropdownOpen[variant.varient_name_id] || false} toggle={() => toggleDropdown(variant.varient_name_id)}>
                        <DropdownToggle caret color={variant.status ? "success" : "danger"} className="btn btn-sm btn-rounded">
                          <i className={variant.status ? "far fa-dot-circle text-success" : "far fa-dot-circle text-danger"} />{" "}
                          {variant.status ? "Published" : "Unpublished"}
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem onClick={() => handleStatusChange(variant.varient_name_id, true)}>
                            Published
                          </DropdownItem>
                          <DropdownItem onClick={() => handleStatusChange(variant.varient_name_id, false)}>
                            Unpublished
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </td> */}
                    {/* <td>
                      <Button color="link" onClick={() => handleView(variant)} className="text-primary">
                        <FaEye size={20} aria-label={`View ${variant.unit_name}`} />
                      </Button>{" "}
                      <Button color="link" onClick={() => handleEdit(variant.varient_name_id)} className="text-warning">
                        <FaEdit size={20} aria-label={`Edit ${variant.unit_name}`} />
                      </Button>{" "}
                      <Button color="link" onClick={() => handleDelete(variant.varient_name_id)} className="text-danger">
                        <FaTrash size={20} aria-label={`Delete ${variant.unit_name}`} />
                      </Button>
                    </td> */}

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center text-muted">
                      No variant name data available
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </CardBody>
      </Card>

      {/* Modal for viewing variant details */}
      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Variant Details</ModalHeader>
        <ModalBody>
          {selectedVariant ? (
            <div>
              <p>
                <strong>Unit Name:</strong> {selectedVariant.unit_name}
              </p>
              <p>
                <strong>Display Name:</strong> {selectedVariant.display_name}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {selectedVariant.status ? "Published" : "Unpublished"}
              </p>
              {/* You can add more fields here if necessary */}
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default VariantNameList;
