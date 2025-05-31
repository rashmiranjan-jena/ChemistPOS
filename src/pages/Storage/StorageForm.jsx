import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  createStorage,
  updateStorage,
  getStorageById,
} from "../../ApiService/Storage/Storage";

// Validation schema
const validationSchema = Yup.object({
  racknumber: Yup.string()
    .required("Rack Number is required")
    .matches(
      /^[A-Za-z0-9]+$/,
      "Rack Number can only contain letters and numbers"
    ),
  shelfnumber: Yup.string()
    .required("Shelf Number is required")
    .matches(
      /^[A-Za-z0-9]+$/,
      "Shelf Number can only contain letters and numbers"
    ),
  boxnumber: Yup.string()
    .required("Box Number is required")
    .matches(
      /^[A-Za-z0-9]+$/,
      "Box Number can only contain letters and numbers"
    ),
  drugs: Yup.array()
    .of(
      Yup.object().shape({
        drug_id: Yup.number().required("Drug ID is required"),
        drug_name: Yup.string().required("Drug name is required"),
        generic_description_name: Yup.string().required(
          "Generic name is required"
        ),
        strength_name: Yup.string().required("Strength is required"),
      })
    )
    .min(1, "At least one drug must be selected")
    .required("Drugs are required"),
});

const StorageForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditMode, setIsEditMode] = useState(false);
  const [storageId, setStorageId] = useState(null);
  const [drugs, setDrugs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

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
        .filter(
          (drug) =>
            drug.drug_id &&
            drug.drug_name &&
            drug.generic_description_name &&
            drug.strength_name
        )
        .map((drug) => ({
          drug_id: drug.drug_id,
          drug_name: drug.drug_name,
          generic_description_name: drug.generic_description_name,
          strength_name: drug.strength_name,
          label: `${drug.drug_name} (${drug.generic_description_name} ${drug.strength_name})`,
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
        text: error.message,
        icon: "error",
        confirmButtonText: "OK",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDrugsByIds = async (drugIds) => {
    try {
      setIsLoading(true);
      const response = await getDrug(1, 100, "");
      if (response.status !== "success") {
        throw new Error("API error");
      }

      return response.data
        .filter((drug) => drugIds.includes(drug.drug_id))
        .map((drug) => ({
          drug_id: drug.drug_id,
          drug_name: drug.drug_name,
          generic_description_name: drug.generic_description_name,
          strength_name: drug.strength_name,
          label: `${drug.drug_name} (${drug.generic_description_name} ${drug.strength_name})`,
        }));
    } catch (error) {
      console.error("Error fetching drugs by IDs:", error);
      Swal.fire({
        title: "Error!",
        text: error.message,
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
    }, 300),
    []
  );

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setCurrentPage(1);
    debouncedFetchDrugs(query, 1);
  };

  const loadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    debouncedFetchDrugs(searchQuery, nextPage, true);
  };

  const formik = useFormik({
    initialValues: {
      racknumber: "",
      shelfnumber: "",
      boxnumber: "",
      drugs: [],
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const payload = {
          rack_no: values.racknumber,
          self_no: values.shelfnumber,
          box_no: values.boxnumber,
          drug_ids: values.drugs.map((drug) => drug.drug_id),
        };
        console.log("Submitting storage data:", payload);

        if (isEditMode) {
          await updateStorage(storageId, payload);
        } else {
          await createStorage(payload);
        }

        Swal.fire({
          title: isEditMode ? "Storage Updated!" : "Storage Added!",
          text: isEditMode
            ? "The storage record has been successfully updated."
            : "The storage record has been successfully added.",
          icon: "success",
          confirmButtonText: "OK",
        });

        formik.resetForm();
        navigate("/storage-list");
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

  const availableDrugs = useMemo(() => {
    return drugs.filter(
      (drug) => !formik.values.drugs.some((d) => d.drug_id === drug.drug_id)
    );
  }, [drugs, formik.values.drugs]);

  const selectedDrugs = useMemo(() => {
    return drugs.filter((drug) =>
      formik.values.drugs.some((d) => d.drug_id === drug.drug_id)
    );
  }, [drugs, formik.values.drugs]);

  const moveToSelected = () => {
    const selectedOptions = Array.from(
      document.querySelector("#availableDrugs").selectedOptions
    ).map((option) => parseInt(option.value));
    console.log("Moving to Selected:", selectedOptions);
    if (selectedOptions.length > 0) {
      const drugsToAdd = drugs
        .filter((drug) => selectedOptions.includes(drug.drug_id))
        .map(
          ({
            drug_id,
            drug_name,
            generic_description_name,
            strength_name,
          }) => ({
            drug_id,
            drug_name,
            generic_description_name,
            strength_name,
          })
        );
      formik.setFieldValue(
        "drugs",
        [...formik.values.drugs, ...drugsToAdd].filter(
          (drug, index, self) =>
            index === self.findIndex((d) => d.drug_id === drug.drug_id)
        )
      );
    }
  };

  const removeFromSelected = () => {
    const selectedOptions = Array.from(
      document.querySelector("#selectedDrugs").selectedOptions
    ).map((option) => parseInt(option.value));
    console.log("Removing from Selected:", selectedOptions);
    if (selectedOptions.length > 0) {
      formik.setFieldValue(
        "drugs",
        formik.values.drugs.filter(
          (drug) => !selectedOptions.includes(drug.drug_id)
        )
      );
    }
  };

  useEffect(() => {
    debouncedFetchDrugs("", 1);
  }, [debouncedFetchDrugs]);

  useEffect(() => {
    const id = location?.state?.id;
    if (id) {
      setIsEditMode(true);
      setStorageId(id);
      getStorageById(id)
        .then((response) => {
          const storageData = response;
          const editDrugs = storageData.drugs.map((drug) => ({
            drug_id: drug.drug_id,
            drug_name: drug.drug_name,
            generic_description_name: drug.generic_description_name,
            strength_name: drug.strength_name,
            label: `${drug.drug_name} (${drug.generic_description_name} ${drug.strength_name})`,
          }));

          setDrugs((prev) => {
            const updated = [...prev, ...editDrugs].filter(
              (drug, index, self) =>
                index === self.findIndex((d) => d.drug_id === drug.drug_id)
            );
            return updated;
          });

          formik.setValues({
            racknumber: storageData.rack_no,
            shelfnumber: storageData.self_no,
            boxnumber: storageData.box_no,
            drugs: editDrugs,
          });
        })
        .catch((error) => {
          console.error("Error fetching storage:", error);
          Swal.fire({
            title: "Error!",
            text: error.message || "Failed to load storage data.",
            icon: "error",
            confirmButtonText: "OK",
          });
        });
    }
  }, [location?.state]);

  document.title = isEditMode ? "Edit Storage" : "Add Storage";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Storage Management"
            breadcrumbItem={
              isEditMode ? "Edit Storage Details" : "Add Storage Details"
            }
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
                      {isEditMode
                        ? "Edit Storage Details"
                        : "Add Storage Details"}
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
                      {/* Rack Number */}
                      <Col md="6">
                        <FormGroup>
                          <Label for="racknumber" className="fw-bold text-dark">
                            Rack Number *
                          </Label>
                          <Input
                            type="text"
                            name="racknumber"
                            id="racknumber"
                            placeholder="Enter rack number (e.g., R1)"
                            value={formik.values.racknumber}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.racknumber &&
                              formik.errors.racknumber
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                            }}
                          />
                          {formik.touched.racknumber &&
                            formik.errors.racknumber && (
                              <div className="invalid-feedback">
                                {formik.errors.racknumber}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      {/* Shelf Number */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="shelfnumber"
                            className="fw-bold text-dark"
                          >
                            Shelf Number *
                          </Label>
                          <Input
                            type="text"
                            name="shelfnumber"
                            id="shelfnumber"
                            placeholder="Enter shelf number (e.g., S1)"
                            value={formik.values.shelfnumber}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.shelfnumber &&
                              formik.errors.shelfnumber
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                            }}
                          />
                          {formik.touched.shelfnumber &&
                            formik.errors.shelfnumber && (
                              <div className="invalid-feedback">
                                {formik.errors.shelfnumber}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      {/* Box Number */}
                      <Col md="6">
                        <FormGroup>
                          <Label for="boxnumber" className="fw-bold text-dark">
                            Box Number *
                          </Label>
                          <Input
                            type="text"
                            name="boxnumber"
                            id="boxnumber"
                            placeholder="Enter box number (e.g., B1)"
                            value={formik.values.boxnumber}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.boxnumber &&
                              formik.errors.boxnumber
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                            }}
                          />
                          {formik.touched.boxnumber &&
                            formik.errors.boxnumber && (
                              <div className="invalid-feedback">
                                {formik.errors.boxnumber}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      {/* Drugs Dual-Box */}
                      <Col md="6">
                        <FormGroup>
                          <Label for="drugs" className="fw-bold text-dark">
                            Drugs *
                          </Label>
                          <Row>
                            {/* Available Drugs */}
                            <Col md="5">
                              <Card className="drug-box">
                                <CardBody>
                                  <Input
                                    type="text"
                                    placeholder="Search drugs..."
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    className="mb-3"
                                    disabled={isLoading}
                                    style={{
                                      borderRadius: "8px",
                                      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                    }}
                                  />
                                  {isLoading ? (
                                    <div>Loading drugs...</div>
                                  ) : drugs.length === 0 ? (
                                    <div>No drugs available</div>
                                  ) : (
                                    <Input
                                      type="select"
                                      id="availableDrugs"
                                      multiple
                                      style={{ height: "200px", width: "100%" }}
                                    >
                                      {availableDrugs.map((drug) => (
                                        <option
                                          key={drug.drug_id}
                                          value={drug.drug_id}
                                        >
                                          {drug.label}
                                        </option>
                                      ))}
                                    </Input>
                                  )}
                                  {hasMore && !isLoading && (
                                    <Button
                                      color="link"
                                      onClick={loadMore}
                                      className="mt-2"
                                    >
                                      Load More
                                    </Button>
                                  )}
                                </CardBody>
                              </Card>
                            </Col>

                            {/* Transfer Buttons */}
                            <Col
                              md="2"
                              className="d-flex flex-column justify-content-center align-items-center"
                            >
                              <Button
                                color="primary"
                                onClick={moveToSelected}
                                disabled={isLoading}
                                className="mb-2 hover-scale"
                                style={{ width: "50px" }}
                              >
                                &gt;
                              </Button>
                              <Button
                                color="primary"
                                onClick={removeFromSelected}
                                disabled={isLoading}
                                className="hover-scale"
                                style={{ width: "50px" }}
                              >
                                &lt;
                              </Button>
                            </Col>

                            {/* Selected Drugs */}
                            <Col md="5">
                              <Card className="drug-box">
                                <CardBody>
                                  {selectedDrugs.length === 0 ? (
                                    <div>No drugs selected</div>
                                  ) : (
                                    <Input
                                      type="select"
                                      id="selectedDrugs"
                                      multiple
                                      style={{ height: "200px", width: "100%" }}
                                    >
                                      {selectedDrugs.map((drug) => (
                                        <option
                                          key={drug.drug_id}
                                          value={drug.drug_id}
                                        >
                                          {drug.label}
                                        </option>
                                      ))}
                                    </Input>
                                  )}
                                </CardBody>
                              </Card>
                            </Col>
                          </Row>
                          {formik.touched.drugs && formik.errors.drugs && (
                            <div
                              className="invalid-feedback"
                              style={{ display: "block" }}
                            >
                              {formik.errors.drugs}
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
        .drug-box {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          max-height: 300px;
        }
        select[multiple] {
          padding: 5px;
          border-radius: 4px;
          border: 1px solid #ced4da;
        }
        select[multiple] option {
          padding: 5px;
        }
        select[multiple] option:checked {
          background-color: #007bff;
          color: white;
        }
      `}</style>
    </React.Fragment>
  );
};

export default StorageForm;
