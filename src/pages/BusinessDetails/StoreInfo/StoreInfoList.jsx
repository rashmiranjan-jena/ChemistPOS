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
import Swal from "sweetalert2";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import {
  fetchStore,
  updateStoreStatus,
  deleteStore, // Add deleteStore function in your API service
} from "../../../ApiService/StoreInfo/StoreInfo";

const StoreInfoList = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState({});

  useEffect(() => {
    const getStores = async () => {
      try {
        const data = await fetchStore();
        setStores(data);
      } catch (error) {
        console.error("Error fetching store data:", error);
      }
    };

    getStores();
  }, []);

  const handleAddStore = () => {
    navigate("/storeinfo");
  };

  // Action Handlers
  // const handleView = (id) => {
  //   alert(`View Store with ID: ${id}`);
  // };

  const handleEdit = (id) => {
    navigate("/storeinfo", {state:{id}})
  };

  const handleDelete = async (id) => {
    const storeName = stores.find(
      (store) => store.business_store_id === id
    )?.store_name;

    const firstConfirmation = await Swal.fire({
      title: "Are you sure?",
      text: `Do you really want to delete the store "${storeName}"? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, proceed!",
    });

    if (firstConfirmation.isConfirmed) {
      const secondConfirmation = await Swal.fire({
        title: "Final Confirmation",
        text: `This is your last chance to cancel. Do you really want to delete "${storeName}"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      });

      if (secondConfirmation.isConfirmed) {
        try {
          await deleteStore(id);
          setStores((prevStores) =>
            prevStores.filter((store) => store.business_store_id !== id)
          );
          await Swal.fire("Deleted!", "The store has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting store:", error);
          Swal.fire("Error!", "Failed to delete the store.", "error");
        }
      }
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateStoreStatus(id, status);
      setStores((prevStores) =>
        prevStores.map((store) =>
          store.business_store_id === id ? { ...store, status } : store
        )
      );
    } catch (error) {
      console.error("Error updating store status:", error);
    }
  };

  const toggleDropdown = (id) => {
    setDropdownOpen((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  return (
    <div className="page-content">
      {/* Breadcrumb */}
      <Breadcrumbs title="Stores" breadcrumbItem="All Stores" />

      <Card className="shadow">
        <CardBody>
          <div className="d-flex justify-content-between mb-4">
            <h4 className="text-primary">Store Master</h4>
            <Button color="primary" onClick={handleAddStore}>
              <FaPlus className="mr-2" /> Add Store
            </Button>
          </div>

          <div className="table-responsive" style={{ maxHeight: "500px" }}>
            <Table bordered hover responsive className="custom-table">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Store Name</th>
                  <th>Business Name</th>
                  <th>Zip/Pincode</th>
                  <th>City</th>
                  <th>State</th>
                  <th>Country</th>
                  <th>Address Line 1</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {stores.length > 0 ? (
                  stores.map((store, index) => (
                    <tr key={store.business_store_id}>
                      <td>{index + 1}</td>
                      <td>{store.store_name}</td>
                      <td>{store.buisness_name}</td>
                      <td>{store.address_details.pin}</td>
                      <td>{store.address_details.city}</td>
                      <td>{store.address_details.state}</td>
                      <td>{store.address_details.country}</td>
                      <td>{store.address_details.address1}</td>
                      <td>
                        {/* Status Dropdown */}
                        <Dropdown
                          isOpen={dropdownOpen[store.business_store_id]}
                          toggle={() => toggleDropdown(store.business_store_id)}
                        >
                          <DropdownToggle
                            caret
                            color={store.status ? "success" : "danger"}
                            className="btn btn-white btn-sm btn-rounded"
                          >
                            <i
                              className={
                                store.status
                                  ? "far fa-dot-circle text-success"
                                  : "far fa-dot-circle text-danger"
                              }
                            />{" "}
                            {store.status ? "Published" : "Unpublished"}
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem
                              onClick={() =>
                                handleStatusChange(
                                  store.business_store_id,
                                  true
                                )
                              }
                            >
                              Publish
                            </DropdownItem>
                            <DropdownItem
                              onClick={() =>
                                handleStatusChange(
                                  store.business_store_id,
                                  false
                                )
                              }
                            >
                              Unpublish
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </td>
                      <td>
                        {/* Action Icons */}
                        {/* <Button
                          color="link"
                          onClick={() => handleView(store.business_store_id)}
                          className="text-primary"
                        >
                          <FaEye size={20} />
                        </Button>{" "} */}
                        <Button
                          color="link"
                          onClick={() => handleEdit(store.business_store_id)}
                          className="text-warning"
                        >
                          <FaEdit size={20} />
                        </Button>{" "}
                        <Button
                          color="link"
                          onClick={() => handleDelete(store.business_store_id)}
                          className="text-danger"
                        >
                          <FaTrash size={20} />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center">
                      Data not available
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

export default StoreInfoList;
