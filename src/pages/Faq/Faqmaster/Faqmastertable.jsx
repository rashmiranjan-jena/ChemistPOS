import React, { useState, useEffect } from "react";
import { Button, Table, Card, CardBody, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { getFaqs,updateFaqStatus,deleteFaq } from "../../../ApiService/Faq/FaqMaster";
import Swal from "sweetalert2";


const Faqmastertable = () => {
  const navigate = useNavigate();
  const [faqs, setFaqs] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const toggleDropdown = (id) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };
  
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const data = await getFaqs();
        const transformedData = data.map((item) => ({
          id: item?.faq_id,
          question: item?.question,
          answer: item?.answer,
          status: item?.status ? "Published" : "Unpublished",
          categoryName: item?.faqCategory_name,
        }));
        setFaqs(transformedData);
      } catch (error) {
        console.error("Failed to fetch FAQs:", error);
      }
    };

    fetchFaqs();
  }, []);

  const handleAddFaq = () => {
    navigate("/faqmaster");
  };

  // const handleView = (id) => {
  //   alert(`View FAQ with ID: ${id}`);
  // };

  const handleEdit = (id) => {
   navigate("/faqmaster", {state:{id}});
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Second confirmation
        Swal.fire({
          title: "Are you really sure?",
          text: "This is your final chance to cancel the deletion.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, delete it!",
          cancelButtonText: "No, cancel!",
        }).then(async (finalResult) => {
          if (finalResult.isConfirmed) {
            try {
              await deleteFaq(id);
              setFaqs((prevFaqs) =>
                prevFaqs.filter((faq) => faq.id !== id)
              );
              Swal.fire("Deleted!", "The FAQ has been deleted.", "success");
            } catch (error) {
              console.error("Error deleting FAQ:", error);
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Failed to delete the FAQ. Please try again later.",
              });
            }
          } else {
            Swal.fire("Cancelled", "The FAQ was not deleted.", "info");
          }
        });
      } else {
        Swal.fire("Cancelled", "The FAQ was not deleted.", "info");
      }
    });
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const statusValue = newStatus === "Published" ? true : false;
      await updateFaqStatus(id, statusValue);
  
      setFaqs((prevFaqs) =>
        prevFaqs.map((faq) =>
          faq.id === id ? { ...faq, status: newStatus } : faq
        )
      );
  
      setDropdownOpen(null); 
  
      Swal.fire({
        icon: "success",
        title: "Status Updated",
        text: `FAQ status has been updated to ${newStatus}.`,
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Failed to update FAQ status:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update FAQ status.",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="page-content">
      <Breadcrumbs title="FAQ" breadcrumbItem="All FAQs" />
      <Card className="shadow">
        <CardBody>
          <div className="d-flex justify-content-between mb-4">
            <h4 className="text-primary">FAQ Master</h4>
            <Button color="primary" onClick={handleAddFaq}>
              <FaPlus className="mr-2" /> Add FAQ
            </Button>
          </div>

          <div className="table-responsive" style={{ maxHeight: "500px", overflowY: "auto" }}>
            {faqs.length === 0 ? (
              <p>No data available</p>
            ) : (
              <Table bordered hover responsive className="custom-table">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>FAQ Category Name</th>
                    <th>FAQ Question</th>
                    <th>FAQ Answer</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {faqs?.map((faq, index) => (
                    <tr key={faq.id}>
                      <td>{index + 1}</td>
                      <td>{faq.categoryName}</td>
                      <td>{faq.question}</td>
                      <td>{faq.answer}</td>
                      <td>
                        <Dropdown isOpen={dropdownOpen === faq.id} toggle={() => toggleDropdown(faq.id)}>
                          <DropdownToggle
                            caret
                            color={faq.status === "Published" ? "success" : "danger"}
                            className="btn btn-white btn-sm btn-rounded"
                          >
                            {faq.status}
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem onClick={() => handleStatusChange(faq.id, "Published")}>
                              Published
                            </DropdownItem>
                            <DropdownItem onClick={() => handleStatusChange(faq.id, "Unpublished")}>
                              Unpublished
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </td>
                      <td>
                        {/* <Button color="link" onClick={() => handleView(faq.id)} className="text-primary">
                          <FaEye size={20} />
                        </Button>{" "} */}
                        <Button color="link" onClick={() => handleEdit(faq.id)} className="text-warning">
                          <FaEdit size={20} />
                        </Button>{" "}
                        <Button color="link" onClick={() => handleDelete(faq.id)} className="text-danger">
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

export default Faqmastertable;
