import React, { useEffect, useState } from "react";
import { Button, Card, CardBody, Col, Container, Row, Table } from "reactstrap";
import { FaEye, FaEdit, FaTrash, FaFileExcel } from "react-icons/fa"; 
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { deleteBusinessRegistrationDetails, fetchBusinessRegistrationList } from "../../ApiService/BusinessOverview/BusinessRegistrationList";

const BusinessRegistrationList = () => {
  const navigate = useNavigate();

  // const businessRegistrations = [
  //   {
  //     id: 1,
  //     businessType: "Proprietorship",
  //     gstNo: "27AABCU9603R1ZM",
  //     fssaiLicenceNo: "11518011001234",
  //     shopActRegNo: "MH123456789",
  //   },
  //   {
  //     id: 2,
  //     businessType: "Partnership",
  //     gstNo: "29AAGCB1234P1ZN",
  //     fssaiLicenceNo: "11519012004567",
  //     shopActRegNo: "KA987654321",
  //   },
  //   {
  //     id: 3,
  //     businessType: "Pvt Ltd",
  //     gstNo: "33AAHCD5678M1ZQ",
  //     fssaiLicenceNo: "11520013007890",
  //     shopActRegNo: "TN456789123",
  //   },
  //   {
  //     id: 4,
  //     businessType: "LLP",
  //     gstNo: "07AAECP9012K1ZR",
  //     fssaiLicenceNo: "11521014009876",
  //     shopActRegNo: "DL789123456",
  //   },
  // ];
  // get Business Registration List
  const [businessRegistrations, setBusinessRegistrations] = useState([]);
  useEffect(() => {
    getBusinessRegistrations();
  },[]);
  const getBusinessRegistrations = async () => {
    try {
      const response = await fetchBusinessRegistrationList();
      if(response.status === 200){
        setBusinessRegistrations(response.data);
      }
    } catch (error) {
      console.error("Error fetching business-info", error);

      const errorMessage = error.response?.data?.message || 'There was an error fetching the business information.';
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: errorMessage,
      });
      
    }
  }

  const handleBack = () => {
    navigate(-1);
  };

  const handleView = (id) => {
    navigate(`/business-registration-details/${id}`);
  };

  const handleEdit = (registration) => {
    navigate(`/business-registration-form`, { state: { registration } });
  };

  const handleDelete = async(id) => {
    console.log(`Delete business registration with ID: ${id}`);
    // Implement delete logic here (e.g., API call)
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async(result) => {
      if (result.isConfirmed) {
        // Implement delete logic here (e.g., API call)
        try {
          const response = await deleteBusinessRegistrationDetails(id);
          if(response.status === 204){
            Swal.fire("Deleted!", "The business registration has been deleted.", "success");
            getBusinessRegistrations();
          }
        } catch (error) {
          console.log(error);
                
                Swal.fire({
                  title: "Error!",
                  text: error.response.data.detail || "There was an error deleting the business registration.",
                  icon: "error",
                  confirmButtonText: "OK",
                });
          
        }
      }
    })
  };

  const handleExcelUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Excel file selected:", file.name);
      // Implement your Excel upload logic here (e.g., API call)
    }
  };

  const handleExcelDownload = () => {
    // Basic CSV generation (you can use a library like 'xlsx' for proper Excel files)
    const headers = [
      "Sr.No",
      "ID",
      "Type of Business",
      "GST No.",
      "FSSAI Licence No.",
      "Shop Act Registration No.",
    ];
    const rows = businessRegistrations.map((registration, index) => [
      index + 1,
      registration.id,
      registration.businessType,
      registration.gstNo,
      registration.fssaiLicenceNo,
      registration.shopActRegNo,
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "business_registrations.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Business" breadcrumbItem="Business Registration List" />

          <Row>
            <Col xs="12">
              <Card
                className="shadow-lg"
                style={{
                  borderRadius: "20px",
                  overflow: "hidden",
                  background: "#f8f9fa",
                }}
              >
                <CardBody className="p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
                    <h4
                      className="text-primary"
                      style={{
                        fontWeight: "700",
                        letterSpacing: "1px",
                        background: "linear-gradient(90deg, #007bff, #00c4cc)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      Business Registration List
                    </h4>
                    <div className="d-flex flex-wrap gap-2">
                      <Button
                        color="primary"
                        onClick={() => navigate("/business-registration-form")}
                        style={{
                          height: "35px",
                          padding: "3px 10px 3px 10px",
                          borderRadius: "10px",
                          fontSize: "14px",
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                          transition: "transform 0.3s ease",
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                        className="hover-scale"
                      >
                        <i
                          className="bx bx-plus"
                          style={{ fontSize: "18px" }}
                        ></i>{" "}
                        Add Business Registration
                      </Button>
                      <label
                        htmlFor="excel-upload"
                        style={{
                          height: "35px",
                          padding: "3px 10px",
                          borderRadius: "10px",
                          fontSize: "14px",
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                          transition: "transform 0.3s ease",
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          backgroundColor: "#28a745",
                          color: "#fff",
                          cursor: "pointer",
                        }}
                        className="hover-scale m-0"
                      >
                        <FaFileExcel style={{ fontSize: "18px" }} />
                        Upload Excel
                      </label>
                      <input
                        id="excel-upload"
                        type="file"
                        accept=".xlsx, .xls"
                        style={{ display: "none" }}
                        onChange={handleExcelUpload}
                      />
                      <Button
                        color="success"
                        onClick={handleExcelDownload}
                        style={{
                          height: "35px",
                          padding: "3px 10px",
                          borderRadius: "10px",
                          fontSize: "14px",
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                          transition: "transform 0.3s ease",
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                        className="hover-scale"
                      >
                        <FaFileExcel style={{ fontSize: "18px" }} />
                        Download Excel
                      </Button>
                      <Button
                        color="secondary"
                        onClick={handleBack}
                        style={{
                          height: "35px",
                          width: "35px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "50%",
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                          transition: "transform 0.3s ease",
                        }}
                        className="hover-scale"
                        title="Back"
                      >
                        <i
                          className="bx bx-undo"
                          style={{ fontSize: "18px" }}
                        ></i>
                      </Button>
                    </div>
                  </div>

                  <div className="table-container">
                    <Table
                      className="table table-striped table-hover align-middle"
                      responsive
                    >
                      <thead
                        style={{
                          background:
                            "linear-gradient(90deg, #007bff, #00c4cc)",
                          color: "#fff",
                        }}
                      >
                        <tr>
                          <th>Sr.No</th>
                          <th>ID</th>
                          <th>Type of Business</th>
                          <th>GST No.</th>
                          <th>FSSAI Licence No.</th>
                          <th>Shop Act Registration No.</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {businessRegistrations.map((registration, index) => (
                          <tr key={registration.id}>
                            <td>{index + 1}</td>
                            <td>{registration.business_info_id}</td>
                            <td>{registration.type_of_business}</td>
                            <td>{registration.gst_tax_number}</td>
                            <td>{registration.fssai_licence_no}</td>
                            <td>{registration.shop_act_registration_no}</td>
                            <td>
                              <div className="d-flex gap-2 justify-content-center">
                                {/* <FaEye
                                  style={{
                                    fontSize: "18px",
                                    color: "#007bff",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => handleView(registration.id)}
                                  title="View"
                                /> */}
                                <FaEdit
                                  style={{
                                    fontSize: "18px",
                                    color: "#4caf50",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => handleEdit(registration)}
                                  title="Edit"
                                />
                                <FaTrash
                                  style={{
                                    fontSize: "18px",
                                    color: "#f44336",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => handleDelete(registration.business_info_id)}
                                  title="Delete"
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <style jsx>{`
        .hover-scale:hover {
          transform: scale(1.1) !important;
        }
        .table-container {
          max-height: 400px; /* Adjust this value based on your needs */
          overflow-y: auto; /* Vertical scrolling */
          overflow-x: auto; /* Horizontal scrolling */
          border-radius: 10px;
          background: #fff;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        .table {
          margin-bottom: 0;
          min-width: 800px; /* Ensures horizontal scroll on smaller screens */
        }
        .table-striped tbody tr:nth-of-type(odd) {
          background-color: rgba(0, 0, 0, 0.03);
        }
        .table-hover tbody tr:hover {
          background-color: rgba(0, 123, 255, 0.1);
        }
        @media (max-width: 768px) {
          .d-flex.justify-content-between {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }
          .d-flex.gap-2 {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}</style>
    </React.Fragment>
  );
};

export default BusinessRegistrationList;