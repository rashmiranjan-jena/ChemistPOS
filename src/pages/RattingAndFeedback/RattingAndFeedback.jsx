import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import {
  Button,
  Table,
  Card,
  CardBody,
  Input,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import {
  getRattingFeedback,
  updateFeedbackStatus,
} from "../../ApiService/RatingAndFeedback/RatingAndFeedback";

const RattingAndFeedback = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState({});
  const itemsPerPage = 5;

  useEffect(() => {
    fetchFeedbackData();
  }, []);

  const fetchFeedbackData = async () => {
    try {
      const response = await getRattingFeedback();
      const formattedData = response.data.map((feedback, index) => ({
        id: index + 1,
        username: `UserName${feedback.customer_id}`,
        userid: feedback.customer_id,
        item: feedback.item.product_name,
        itemcode: feedback.item.item_code,
        ratingvalue: feedback.rating_value,
        feedbackmessage: feedback.feedback_text,
        status: "Published",
      }));
      setFeedbackData(formattedData);
    } catch (error) {
      console.error("Error fetching feedback data:", error);
    }
  };

  const toggleDropdown = (id) => {
    setDropdownOpen((prevState) => ({ ...prevState, [id]: !prevState[id] }));
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await updateFeedbackStatus(id, newStatus);
  
      if (response.status === 200) {
        setFeedbackData((prevData) =>
          prevData.map((feedback) =>
            feedback.id === id ? { ...feedback, status: newStatus } : feedback
          )
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };
  const filteredData = feedbackData.filter(
    (feedback) =>
      feedback.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.itemcode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pageCount = Math.ceil(filteredData.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentPageData = filteredData.slice(offset, offset + itemsPerPage);

  return (
    <div className="page-content">
      <Breadcrumbs title="Feedback and Ratings" breadcrumbItem="All Feedback" />
      <Card className="shadow">
        <CardBody>
          <Input
            type="text"
            placeholder="Search by Username, Item Code, or Product Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-3"
            style={{ width: "350px" }}
          />
          <div className="table-responsive" style={{ maxHeight: "500px" }}>
            <Table bordered hover responsive>
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Username</th>
                  <th>User ID</th>
                  <th>Product Name</th>
                  <th>Item Code</th>
                  <th>Rating Value</th>
                  <th>Feedback Message</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentPageData.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center">
                      No feedback available.
                    </td>
                  </tr>
                ) : (
                  currentPageData.map((feedback) => (
                    <tr key={feedback.id}>
                      <td>{feedback.id}</td>
                      <td>{feedback.username}</td>
                      <td>{feedback.userid}</td>
                      <td>{feedback.item}</td>
                      <td>{feedback.itemcode}</td>
                      <td>{feedback.ratingvalue}</td>
                      <td>{feedback.feedbackmessage}</td>
                      <td>
                        <Dropdown
                          isOpen={dropdownOpen[feedback.id]}
                          toggle={() => toggleDropdown(feedback.id)}
                        >
                          <DropdownToggle caret>
                            {feedback.status}
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem
                              onClick={() =>
                                handleStatusChange(feedback.id, "Published")
                              }
                            >
                              Published
                            </DropdownItem>
                            <DropdownItem
                              onClick={() =>
                                handleStatusChange(feedback.id, "Unpublished")
                              }
                            >
                              Unpublished
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </td>
                      <td>
                        <Button color="link" className="text-primary">
                          <FaEye size={20} />
                        </Button>{" "}
                        {/* <Button color="link" className="text-warning">
                          <FaEdit size={20} />
                        </Button>{" "} */}
                        <Button color="link" className="text-danger">
                          <FaTrash size={20} />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            breakLabel={"..."}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={({ selected }) => setCurrentPage(selected)}
            containerClassName={"pagination justify-content-center mt-3"}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
            previousClassName={"page-item"}
            previousLinkClassName={"page-link"}
            nextClassName={"page-item"}
            nextLinkClassName={"page-link"}
            breakClassName={"page-item"}
            breakLinkClassName={"page-link"}
            activeClassName={"active"}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export default RattingAndFeedback;
