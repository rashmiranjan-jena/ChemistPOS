import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useNavigate, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import debounce from "lodash.debounce";
import Swal from "sweetalert2";
import { getDrug } from "../../ApiService/Drugs/Drug";
import {
  createThreshold,
  getThresholdById,
  updateThreshold,
} from "../../ApiService/Threshold/Threshold";

// Validation schema
const validationSchema = Yup.object({
  drug_id: Yup.number().required("Drug is required"),
  threshold_value: Yup.number()
    .required("Threshold is required")
    .min(0, "Threshold must be a positive number"),
});

const ThresholdForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditMode, setIsEditMode] = useState(false);
  const [thresholdId, setThresholdId] = useState(null);
  const [drugs, setDrugs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const fetchDrugs = async (
    query = "",
    page = 1,
    pageSize = 10,
    append = false
  ) => {
    try {
      setIsLoading(true);
      const response = await getDrug(page, pageSize, query);
      if (response.status !== "success") {
        throw new Error("API error");
      }

      const newDrugs = response.data
        .filter((drug) => drug.drug_id && drug.drug_name)
        .map((drug) => ({
          drug_id: drug.drug_id,
          drug_name: drug.drug_name,
          label: drug.drug_name,
        }));

      setDrugs((prev) => {
        const updated = append ? [...prev, ...newDrugs] : newDrugs;
        return updated.filter(
          (drug, index, self) =>
            index === self.findIndex((d) => d.drug_id === drug.drug_id)
        );
      });
      setHasMore(response.current_page < response.total_pages);
      return newDrugs;
    } catch (error) {
      console.error("Error fetching drugs:", error);
      Swal.fire({
        title: "Error!",
        text: error.message || "Failed to fetch drugs.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedFetchDrugs = useCallback(
    debounce((query, page, append = false) => {
      fetchDrugs(query, page, 10, append);
    }, 700),
    []
  );

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setCurrentPage(1);
    debouncedFetchDrugs(query, 1);
    setIsDropdownOpen(true);
  };

  const handleSelectDrug = (drug) => {
    formik.setFieldValue("drug_id", drug.drug_id);
    setSearchQuery(drug.drug_name);
    setIsDropdownOpen(false);
  };

  const loadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    debouncedFetchDrugs(searchQuery, nextPage, true);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    debouncedFetchDrugs("", 1);
  }, [debouncedFetchDrugs]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const id = location?.state?.id;
    console.log(id, "id");
    if (id) {
      setIsEditMode(true);
      setThresholdId(id);
      getThresholdById(id)
        .then((response) => {
          const thresholdData = response;
          formik.setValues({
            drug_id: thresholdData.drug_id || "",
            threshold_value: thresholdData.threshold || "",
          });

          if (thresholdData.drug_id) {
            getDrug(1, 10, thresholdData.drug_name || "")
              .then((drugResponse) => {
                const drug = drugResponse.data.find(
                  (d) => d.drug_id === thresholdData.drug_id
                );
                if (drug) {
                  setDrugs((prev) => {
                    const newDrug = {
                      drug_id: drug.drug_id,
                      drug_name: drug.drug_name,
                      label: drug.drug_name,
                    };
                    const updated = [...prev, newDrug].filter(
                      (d, index, self) =>
                        index === self.findIndex((x) => x.drug_id === d.drug_id)
                    );
                    return updated;
                  });
                  setSearchQuery(drug.drug_name);
                }
              })
              .catch((error) => {
                console.error("Error fetching drug for edit:", error);
                Swal.fire({
                  title: "Error!",
                  text: error.message || "Failed to load drug data.",
                  icon: "error",
                  confirmButtonText: "OK",
                });
              });
          }
        })
        .catch((error) => {
          console.error("Error fetching threshold:", error);
          Swal.fire({
            title: "Error!",
            text: error.message || "Failed to load threshold data.",
            icon: "error",
            confirmButtonText: "OK",
          });
        });
    }
  }, [location?.state]);

  const formik = useFormik({
    initialValues: {
      drug_id: "",
      threshold_value: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const payload = {
          drug_id: parseInt(values.drug_id),
          threshold: parseFloat(values.threshold_value),
        };

        if (isEditMode) {
          await updateThreshold(thresholdId, payload);
        } else {
          await createThreshold(payload);
        }

        Swal.fire({
          title: isEditMode ? "Threshold Updated!" : "Threshold Added!",
          text: isEditMode
            ? "The threshold has been successfully updated."
            : "The threshold has been successfully added.",
          icon: "success",
          confirmButtonText: "OK",
        });

        formik.resetForm();
        navigate("/threshold-list");
      } catch (error) {
        console.error("Error submitting form:", error);
        Swal.fire({
          title: "Error!",
          text: error.message || "Failed to submit the form. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    },
  });

  document.title = isEditMode ? "Edit Threshold" : "Add Threshold";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Threshold Management"
            breadcrumbItem={isEditMode ? "Edit Threshold" : "Add Threshold"}
          />
          <Row>
            <Col xs="12">
              <Card className="shadow-lg" style={{ borderRadius: "15px" }}>
                <CardBody className="p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
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
                      {isEditMode ? "Edit Threshold" : "Add Threshold"}
                    </h4>
                    <Button
                      color="secondary"
                      onClick={() => navigate(-1)}
                      style={{
                        height: "35px",
                        width: "35px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%",
                        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
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

                  <Form onSubmit={formik.handleSubmit}>
                    <Row className="g-4">
                      {/* Drug Name (Single Searchable Dropdown Field) */}
                      <Col md="6">
                        <FormGroup>
                          <Label for="drug_id" className="fw-bold text-dark">
                            Drug Name *
                          </Label>
                          <div
                            className={`drug-select-container form-control ${
                              formik.touched.drug_id && formik.errors.drug_id
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              position: "relative",
                              padding: "0",
                            }}
                            ref={dropdownRef}
                          >
                            <Input
                              type="text"
                              placeholder="Search or select a drug..."
                              value={searchQuery}
                              onChange={handleSearch}
                              onFocus={() => setIsDropdownOpen(true)}
                              disabled={isLoading}
                              style={{
                                border: "none",
                                borderRadius: "8px 8px 0 0",
                                boxShadow: "none",
                                padding: "10px",
                              }}
                            />
                            {isDropdownOpen && (
                              <div
                                className="dropdown-menu"
                                style={{
                                  display: "block",
                                  width: "100%",
                                  maxHeight: "150px",
                                  overflowY: "auto",
                                  border: "1px solid #ced4da",
                                  borderRadius: "0 0 8px 8px",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  background: "#fff",
                                  position: "absolute",
                                  top: "100%",
                                  left: 0,
                                  zIndex: 1000,
                                }}
                              >
                                {isLoading ? (
                                  <div
                                    className="text-muted"
                                    style={{ padding: "10px" }}
                                  >
                                    Loading drugs...
                                  </div>
                                ) : drugs.length === 0 ? (
                                  <div
                                    className="text-muted"
                                    style={{ padding: "10px" }}
                                  >
                                    No drugs available
                                  </div>
                                ) : (
                                  <>
                                    {drugs.map((drug) => (
                                      <div
                                        key={drug.drug_id}
                                        className="dropdown-item"
                                        onClick={() => handleSelectDrug(drug)}
                                        style={{
                                          padding: "8px 10px",
                                          cursor: "pointer",
                                          background:
                                            formik.values.drug_id ===
                                            drug.drug_id
                                              ? "#007bff"
                                              : "transparent",
                                          color:
                                            formik.values.drug_id ===
                                            drug.drug_id
                                              ? "#fff"
                                              : "#000",
                                        }}
                                        onMouseOver={(e) =>
                                          (e.currentTarget.style.background =
                                            formik.values.drug_id ===
                                            drug.drug_id
                                              ? "#007bff"
                                              : "#f8f9fa")
                                        }
                                        onMouseOut={(e) =>
                                          (e.currentTarget.style.background =
                                            formik.values.drug_id ===
                                            drug.drug_id
                                              ? "#007bff"
                                              : "transparent")
                                        }
                                      >
                                        {drug.label}
                                      </div>
                                    ))}
                                    {hasMore && !isLoading && (
                                      <Button
                                        color="link"
                                        onClick={loadMore}
                                        className="dropdown-item p-0"
                                        style={{
                                          padding: "8px 10px",
                                          textAlign: "center",
                                          fontSize: "14px",
                                        }}
                                      >
                                        Load More
                                      </Button>
                                    )}
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                          {formik.touched.drug_id && formik.errors.drug_id && (
                            <div className="invalid-feedback">
                              {formik.errors.drug_id}
                            </div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* Threshold Value */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="threshold_value"
                            className="fw-bold text-dark"
                          >
                            Threshold *
                          </Label>
                          <Input
                            type="number"
                            name="threshold_value"
                            id="threshold_value"
                            placeholder="Enter threshold value"
                            value={formik.values.threshold_value}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.threshold_value &&
                              formik.errors.threshold_value
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                            }}
                          />
                          {formik.touched.threshold_value &&
                            formik.errors.threshold_value && (
                              <div className="invalid-feedback">
                                {formik.errors.threshold_value}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      {/* Submit Button */}
                      <Col md="12" className="text-end">
                        <Button
                          type="submit"
                          color="primary"
                          disabled={formik.isSubmitting || isLoading}
                          style={{
                            padding: "10px 25px",
                            borderRadius: "8px",
                            boxShadow: "0 4px 10px rgba(0, 123, 255, 0.3)",
                          }}
                          className="hover-scale"
                        >
                          {formik.isSubmitting
                            ? "Submitting..."
                            : isEditMode
                            ? "Update"
                            : "Submit"}
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <style jsx>{`
        .hover-scale:hover {
          transform: scale(1.05) !important;
        }
        .form-control:focus {
          border-color: #007bff;
          box-shadow: 0 0 8px rgba(0, 123, 255, 0.3);
        }
        .invalid-feedback {
          font-size: 12px;
          color: #dc3545;
        }
        .drug-select-container {
          position: relative;
        }
        .drug-select-container .form-control {
          border: 1px solid #ced4da;
        }
        .drug-select-container .form-control.is-invalid {
          border-color: #dc3545;
        }
        .dropdown-menu {
          width: 100%;
          margin: 0;
          padding: 0;
          border-top: none;
        }
        .dropdown-item {
          padding: 8px 10px;
          cursor: pointer;
        }
        .dropdown-item:hover {
          background-color: #f8f9fa;
        }
      `}</style>
    </React.Fragment>
  );
};

export default ThresholdForm;
