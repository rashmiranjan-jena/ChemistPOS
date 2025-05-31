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
import Swal from "sweetalert2";
import {
  getAboutUsData,
  updateAboutUsStatus,
  deleteAboutUs,
} from "../../../ApiService/AdminCms/AboutUs/AboutUs";

const AboutUsList = () => {
  const [aboutUsData, setAboutUsData] = useState([]);
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    const fetchAboutUsData = async () => {
      try {
        const data = await getAboutUsData();
        setAboutUsData(data);
      } catch (error) {
        console.error("There was an error fetching the data:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load About Us data. Please try again.",
        });
      }
    };

    fetchAboutUsData();
  }, []);

  const handleAddAbout = () => {
    navigate("/admincms/aboutus");
  };

  // const handleView = (id) => {
  //   alert(`View About Us Info with ID: ${id}`);
  // };

  const handleEdit = (id) => {
   navigate("/admincms/aboutus",{state:{id}})
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
        try {
          await deleteAboutUs(id);
          setAboutUsData(
            aboutUsData.filter((about) => about.about_us_id !== id)
          );
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "The About Us entry has been deleted.",
          });
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  const toggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const handleStatusChange = async (id, status) => {
    try {
      const updatedData = await updateAboutUsStatus(id, status);

      // Update state with the new status
      setAboutUsData(
        aboutUsData.map((about) =>
          about.about_us_id === id ? { ...about, status } : about
        )
      );

      Swal.fire({
        icon: "success",
        title: "Status Updated",
        text: `The status has been updated to ${
          status ? "Published" : "Unpublished"
        }.`,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update status. Please try again.",
      });
    }
  };

  return (
    <div className="page-content">
      {/* Breadcrumb */}
      <Breadcrumbs title="About Us Info" breadcrumbItem="All About Us Info" />

      <Card className="shadow">
        <CardBody>
          <div className="d-flex justify-content-between mb-4">
            <h4 className="text-primary">About Us Master</h4>
            <Button color="primary" onClick={handleAddAbout}>
              <FaPlus className="mr-2" /> Add About Us
            </Button>
          </div>

          <div className="table-responsive" style={{ maxHeight: "500px" }}>
            {aboutUsData.length === 0 ? (
              <p className="text-center">No Data Available</p>
            ) : (
              <Table bordered hover responsive className="custom-table">
                <thead className="table-light">
                  <tr>
                    <th>Sr. No.</th>
                    <th>Slogan</th>
                    <th>Company</th>
                    <th>Founder</th>
                    <th>Social Links</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {aboutUsData?.map((about, index) => (
                    <tr key={about.about_us_id}>
                      <td>{index + 1}</td>
                      <td>{about.about_slogan}</td>
                      <td>{about.about_company}</td>
                      <td>{about.founder_name}</td>
                      <td>
                        {about.social_links && about.social_links.length > 0 ? (
                          <>
                            {about.social_links.map((social, idx) =>
                              Object.keys(social).map((key) => (
                                <div key={idx}>
                                  <a
                                    href={social[key]}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {key}
                                  </a>
                                  <br />
                                </div>
                              ))
                            )}
                          </>
                        ) : (
                          <p>No social links available</p>
                        )}
                      </td>
                      <td>
                        {/* Status Dropdown */}
                        <Dropdown
                          isOpen={openDropdown === about.about_us_id}
                          toggle={() => toggleDropdown(about.about_us_id)}
                        >
                          <DropdownToggle
                            caret
                            color={about.status ? "success" : "danger"}
                            className="btn btn-white btn-sm btn-rounded"
                          >
                            <i
                              className={
                                about.status
                                  ? "far fa-dot-circle text-success"
                                  : "far fa-dot-circle text-danger"
                              }
                            />{" "}
                            {about.status ? "Published" : "Unpublished"}
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem
                              onClick={() =>
                                handleStatusChange(about.about_us_id, true)
                              }
                            >
                              Published
                            </DropdownItem>
                            <DropdownItem
                              onClick={() =>
                                handleStatusChange(about.about_us_id, false)
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
                          onClick={() => handleView(about.about_us_id)}
                          className="text-primary"
                        >
                          <FaEye size={20} />
                        </Button>{" "} */}
                        <Button
                          color="link"
                          onClick={() => handleEdit(about.about_us_id)}
                          className="text-warning"
                        >
                          <FaEdit size={20} />
                        </Button>{" "}
                        <Button
                          color="link"
                          onClick={() => handleDelete(about.about_us_id)}
                          className="text-danger"
                        >
                          <FaTrash size={20} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default AboutUsList;
