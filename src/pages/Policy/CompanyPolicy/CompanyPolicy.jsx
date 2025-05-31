import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Form,
  Row,
} from "reactstrap";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { submitPolicyContent } from "../../../ApiService/Policy/CompanyPolicy/CompanyPolicy";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api/company-policies/`;

const CompanyPolicy = () => {
  document.title = "Company Policy";
  const navigate = useNavigate();
  const location = useLocation();
  const [policyContent, setPolicyContent] = useState("");
  const [policyId, setPolicyId] = useState(null);

  // Fetch policy data if editing
  useEffect(() => {
    const { policyId } = location.state || {};
    if (policyId) {
      setPolicyId(policyId);
      fetchPolicyData(policyId);
    }
  }, [location.state]);

  const fetchPolicyData = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}?company_policy_id=${id}`);
      setPolicyContent(response.data.company_policy_data.company_policy_data || "");
    } catch (error) {
      console.error("Error fetching policy data:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to load policy data. Please try again.",
      });
    }
  };

  const handleChange = (value) => {
    setPolicyContent(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      company_policy_data: {
        company_policy_data: policyContent, 
      },
    };

    try {
      let response;
      if (policyId) {
      
        response = await axios.put(`${API_BASE_URL}?company_policy_id=${policyId}`, payload);
      } else {
    
        response = await submitPolicyContent(payload);
      }

      console.log("Response:", response);
      if (response) {
        const successMessage =
          response?.data?.message ||
          policyId
            ? "Your company policy has been updated successfully!"
            : "Your company policy has been submitted successfully!";

        Swal.fire({
          icon: "success",
          title: "Success!",
          text: successMessage,
        });
        navigate("/companypolicylist"); 
      } else {
        throw new Error("Unexpected response status");
      }
    } catch (error) {
      console.error("Error submitting company policy:", error);
      const errorMessage =
        error?.response?.data?.message ||
        "There was an issue submitting the company policy. Please try again later.";

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: errorMessage,
      });
    }
  };

  const modules = {
    toolbar: [
      [
        { header: "1" },
        { header: "2" },
        { header: "3" },
        { header: "4" },
        { header: "5" },
        { header: "6" },
        { font: [] },
      ],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["bold", "italic", "underline", "strike", "code"],
      [{ color: [] }, { background: [] }],
      ["link"],
      ["blockquote", "code-block"],
      [{ direction: "rtl" }],
      [{ indent: "-1" }, { indent: "+1" }],
      ["image", "video"],
      ["clean"],
    ],
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
                  <CardTitle tag="h4">
                    {policyId ? "Edit Company Policy" : "Company Policy"}
                  </CardTitle>
                  <p className="card-title-desc mb-4">
                    {policyId
                      ? "Update the company policy details below."
                      : "Fill out the company policy details below."}
                  </p>

                  <Form onSubmit={handleSubmit} autoComplete="off">
                    {/* React Quill Text Editor */}
                    <div className="mb-3">
                      <ReactQuill
                        value={policyContent}
                        onChange={handleChange}
                        placeholder="Enter your company policy content here..."
                        modules={modules}
                        style={{ height: "400px", width: "100%" }}
                      />
                    </div>

                    <div className="d-flex flex-wrap mt-5">
                      <div className="d-flex flex-wrap gap-2 mt-5 w-full sm:w-auto justify-start sm:justify-center">
                        <Button
                          type="submit"
                          color="primary"
                          className="w-full sm:w-auto"
                        >
                          {policyId ? "Update" : "Submit"}
                        </Button>
                        <Button
                          type="button"
                          color="secondary"
                          onClick={() => setPolicyContent("")}
                          className="w-full sm:w-auto"
                        >
                          Clear
                        </Button>
                      </div>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default CompanyPolicy;