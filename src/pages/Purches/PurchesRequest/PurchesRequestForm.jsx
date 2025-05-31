import React, { useState, useEffect } from "react";
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
  Alert,
  Spinner,
} from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useNavigate, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import * as XLSX from "xlsx";
import { FaCheckCircle, FaCircle } from "react-icons/fa";
import Swal from "sweetalert2";
import {
  fetchPurchaseRequestNumber,
  fetchEmployees,
  fetchSuppliers,
  fetchDrugsBySupplier,
  postPurchaseRequest,
  fetchPurchaseRequestById,
  updatePurchaseRequest,
} from "../../../ApiService/Purchase/PurchaseRequest";

const validationSchema = Yup.object({
  requestedBy: Yup.string().required("Please select an employee"),
  supplier: Yup.string().required("Please select a supplier"),
  selectedDrugs: Yup.array()
    .min(1, "Select at least one Drug")
    .of(
      Yup.object().shape({
        orderQuantity: Yup.number()
          .required("Order Quantity is required")
          .min(1, "Order Quantity must be at least 1"),
      })
    ),
});

const formatRailwayTime = (date) => {
  const hours = String(date?.getHours())?.padStart(2, "0") || "00";
  const minutes = String(date?.getMinutes())?.padStart(2, "0") || "00";
  const seconds = String(date?.getSeconds())?.padStart(2, "0") || "00";
  return `${hours}:${minutes}:${seconds}`;
};

const PurchaseRequestForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location.state || {};
  const isEditMode = !!id;
  const currentDate = new Date()?.toISOString()?.split("T")?.[0] || "";
  const currentTime = new Date()?.toLocaleTimeString() || "";

  const [selectedDrugsSelections, setSelectedDrugsSelections] = useState([]);
  const [lowStockDrugsSelections, setLowStockDrugsSelections] = useState([]);
  const [prNumber, setPrNumber] = useState("");
  const [employees, setEmployees] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [drugs, setDrugs] = useState([]);
  const [brands, setBrands] = useState([]);
  const [lowStockDrugs, setLowStockDrugs] = useState([]);
  const [isExcelUploaded, setIsExcelUploaded] = useState(false);
  const [isDrugsLoading, setIsDrugsLoading] = useState(false);

  const initialValues = {
    purchaseRequestNo: prNumber,
    date: currentDate,
    time: currentTime,
    requestedBy: "",
    supplier: "",
    selectedDrugs: [],
    lowStockDrugs: [],
    selectedLowStockDrugs: [],
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("pr_no", values?.purchaseRequestNo || "");
        formData.append("date", values?.date || "");
        formData.append("time", formatRailwayTime(new Date()));
        formData.append("employee_id", values?.requestedBy || "");
        formData.append("supplier_id", values?.supplier || "");

        const selectedDrugsToSubmit =
          values?.selectedDrugs
            ?.filter((_, index) => selectedDrugsSelections?.[index])
            ?.map((drug) => ({
              drug_id: drug?.drug_id,
              orderQuantity: drug?.orderQuantity || 0,
              orderUnitQuantity: drug?.orderUnitQuantity || 0,
              pack_type: drug?.selectedPackType?.measurement_name || "",
              conversion_id: drug?.selectedPackType?.id || "",
            })) || [];
        formData.append("drug_details", JSON.stringify(selectedDrugsToSubmit));

        const selectedLowStockDrugsToSubmit =
          values?.selectedLowStockDrugs
            ?.filter((_, index) => lowStockDrugsSelections?.[index])
            ?.map((drug) => ({
              drug_id: drug?.drug_id,
              orderQuantity: drug?.orderQuantity || 0,
              orderUnitQuantity: drug?.orderUnitQuantity || 0,
              pack_type: drug?.selectedPackType?.pack_type || "",
            })) || [];
        formData.append(
          "selectedLowStockDrugs",
          JSON.stringify(selectedLowStockDrugsToSubmit)
        );

        let response;
        if (isEditMode) {
          response = await updatePurchaseRequest(id, formData);
        } else {
          response = await postPurchaseRequest(formData);
        }

        if (response) {
          Swal.fire({
            title: isEditMode
              ? "Purchase Request Updated!"
              : "Purchase Request Saved!",
            text: isEditMode
              ? "The purchase request has been successfully updated."
              : "The purchase request has been successfully saved.",
            icon: "success",
            confirmButtonText: "OK",
          });
          navigate("/purchase-request-list");
        }
      } catch (error) {
        console.error(
          `Error ${isEditMode ? "updating" : "submitting"} purchase request:`,
          error
        );
        Swal.fire({
          title: "Error!",
          text:
            error?.message ||
            `Failed to ${isEditMode ? "update" : "save"} the purchase request.`,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    },
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchPurchaseRequest = async () => {
        try {
          const data = await fetchPurchaseRequestById(id);
          if (data) {
            formik.setValues({
              purchaseRequestNo: data?.pr_no || "",
              date: data?.date || currentDate,
              time: data?.time || currentTime,
              requestedBy: data?.employee_id || "",
              supplier: data?.supplier_id || "",
              selectedDrugs: [],
              lowStockDrugs: [],
              selectedLowStockDrugs: [],
            });

            if (data?.supplier_id) {
              setIsDrugsLoading(true);
              const drugData = await fetchDrugsBySupplier(data.supplier_id);
              setIsDrugsLoading(false);
              const drugsArray = drugData?.results?.drugs || [];
              setDrugs(
                drugsArray.map((drug) => ({
                  value: drug?.drug_id,
                  label: drug?.drug_name,
                }))
              );
              setBrands(
                drugsArray.map((drug) => ({
                  ...drug,
                  selectedPackType: drug?.conversions?.[0] || null,
                  orderQuantity: "",
                  orderUnitQuantity: 0,
                }))
              );

              const mergedDrugs =
                data?.drug_details?.map((drug) => {
                  const supplierDrug = drugsArray.find(
                    (d) => d.drug_id === drug.drug_id
                  );
                  return {
                    drug_id: drug?.drug_id,
                    drug_name: drug?.drug_name,
                    brand_name: drug?.brand_name,
                    manufacturer_name: drug?.manufacturer_name,
                    group_disease_name: drug?.group_disease,
                    disease_name: drug?.disease_name,
                    drug_form_name: drug?.drug_form,
                    strength_name: drug?.drug_powers,
                    stock: drug?.stock || 0,
                    conversions: supplierDrug?.conversions || [],
                    selectedPackType: supplierDrug?.conversions?.[0] || null,
                    orderQuantity: drug?.orderQuantity || "",
                    orderUnitQuantity: drug?.orderUnitQuantity || "",
                  };
                }) || [];

              formik.setFieldValue("selectedDrugs", mergedDrugs);
              setSelectedDrugsSelections(
                new Array(mergedDrugs.length).fill(true)
              );
            }

            setLowStockDrugsSelections(
              new Array(data?.selectedLowStockDrugs?.length || 0).fill(true)
            );
          }
        } catch (error) {
          console.error("Error fetching purchase request:", error);
          setIsDrugsLoading(false);
          Swal.fire({
            title: "Error!",
            text: error?.message || "Failed to fetch purchase request data.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      };
      fetchPurchaseRequest();
    }
  }, [id, isEditMode]);

  useEffect(() => {
    const getPurchaseRequestNumber = async () => {
      if (!isEditMode) {
        try {
          const response = await fetchPurchaseRequestNumber();
          const newPrNumber = response?.pr_no || 0;
          setPrNumber(newPrNumber);
          formik.setFieldValue("purchaseRequestNo", newPrNumber);
        } catch (error) {
          console.error("Error fetching Purchase Request Number:", error);
          Swal.fire({
            title: "Error!",
            text: error?.message || "Failed to fetch PR number.",
            icon: "error",
            confirmButtonText: "OK",
          });
          const fallbackPrNumber = 0;
          setPrNumber(fallbackPrNumber);
          formik.setFieldValue("purchaseRequestNo", fallbackPrNumber);
        }
      }
    };
    getPurchaseRequestNumber();
  }, [isEditMode]);

  useEffect(() => {
    const getEmployees = async () => {
      try {
        const employeeData = await fetchEmployees();
        setEmployees(employeeData || []);
      } catch (error) {
        console.error("Error fetching employees:", error);
        Swal.fire({
          title: "Error!",
          text: error?.message || "Failed to fetch employees.",
          icon: "error",
          confirmButtonText: "OK",
        });
        setEmployees([]);
      }
    };
    getEmployees();
  }, []);

  useEffect(() => {
    const getSuppliers = async () => {
      try {
        const supplierData = await fetchSuppliers();
        setSuppliers(supplierData || []);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
        Swal.fire({
          title: "Error!",
          text: error?.message || "Failed to fetch suppliers.",
          icon: "error",
          confirmButtonText: "OK",
        });
        setSuppliers([]);
      }
    };
    getSuppliers();
  }, []);

  const handleFetchDrugsBySupplier = async (supplier_id) => {
    try {
      setIsDrugsLoading(true);
      const drugData = await fetchDrugsBySupplier(supplier_id);
      const drugsArray = drugData?.results?.drugs || [];
      const drugOptions =
        drugsArray?.map((drug) => ({
          value: drug?.drug_id,
          label: drug?.drug_name,
        })) || [];
      setDrugs(drugOptions);
      setBrands(
        drugsArray.map((drug) => ({
          ...drug,
          selectedPackType: drug?.conversions?.[0] || null,
          orderQuantity: "",
          orderUnitQuantity: 0,
        }))
      );
    } catch (error) {
      console.error("Error fetching drugs:", error);
      Swal.fire({
        title: "Error!",
        text: error?.message || "Failed to fetch drugs.",
        icon: "error",
        confirmButtonText: "OK",
      });
      setDrugs([]);
      setBrands([]);
      setLowStockDrugs([]);
    } finally {
      setIsDrugsLoading(false);
    }
  };

  const handleSupplierChange = (e) => {
    const supplierId = e?.target?.value || "";
    formik.handleChange(e);
    if (supplierId) {
      handleFetchDrugsBySupplier(supplierId);
    } else {
      setDrugs([]);
      setBrands([]);
      setLowStockDrugs([]);
      formik.setFieldValue("selectedDrugs", []);
      setSelectedDrugsSelections([]);
      setIsDrugsLoading(false);
    }
  };

  const handleExcelUpload = (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      setIsExcelUploaded(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event?.target?.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook?.SheetNames?.[0];
        const worksheet = workbook?.Sheets?.[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const mappedData =
          jsonData
            ?.map((row) => {
              const brand = brands?.find(
                (b) => b?.drug_name?.toLowerCase() === row?.Drug?.toLowerCase()
              );
              if (brand) {
                const orderQuantity = parseInt(row["Order Quantity"]) || 0;
                const orderUnitQuantity = brand?.conversions?.[0]?.quantity
                  ? orderQuantity * brand.conversions[0].quantity
                  : 0;
                return {
                  ...brand,
                  orderQuantity,
                  orderUnitQuantity,
                  selectedPackType: brand?.conversions?.[0] || null,
                };
              }
              return null;
            })
            ?.filter(Boolean) || [];
        formik.setFieldValue("selectedDrugs", mappedData);
        setSelectedDrugsSelections(new Array(mappedData?.length).fill(false));
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const toggleAllSelections = (
    tableField,
    values,
    setSelections,
    currentSelections,
    isSelected
  ) => {
    const newSelections = new Array(values?.[tableField]?.length || 0).fill(
      isSelected
    );
    setSelections(newSelections);
  };

  const toggleSelection = (index, setSelections, currentSelections) => {
    const newSelections = [...(currentSelections || [])];
    newSelections[index] = !newSelections[index];
    setSelections(newSelections);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handlePackTypeChange = (index, selectedOption, fieldName) => {
    const updatedDrugs = [...(formik.values[fieldName] || [])];
    const orderQuantity = updatedDrugs[index]?.orderQuantity || 0;
    updatedDrugs[index] = {
      ...updatedDrugs[index],
      selectedPackType: selectedOption,
      orderUnitQuantity: selectedOption
        ? orderQuantity * (selectedOption?.quantity || 0)
        : 0,
    };
    formik.setFieldValue(fieldName, updatedDrugs);
  };

  const handleOrderQuantityChange = (e, index, fieldName) => {
    const value = parseInt(e?.target?.value) || 0;
    const updatedDrugs = [...(formik.values[fieldName] || [])];
    const selectedPackType = updatedDrugs[index]?.selectedPackType;
    updatedDrugs[index] = {
      ...updatedDrugs[index],
      orderQuantity: value,
      orderUnitQuantity: selectedPackType
        ? value * (selectedPackType?.quantity || 0)
        : 0,
    };
    formik.setFieldValue(fieldName, updatedDrugs);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Purchase Management"
            breadcrumbItem={
              isEditMode ? "Edit Purchase Request" : "Add Purchase Request"
            }
          />
          <Row>
            <Col xs="12">
              <Card
                className="shadow-lg"
                style={{ borderRadius: "20px", overflow: "hidden" }}
              >
                <CardBody
                  className="p-4"
                  style={{
                    background:
                      "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4
                      className="text-primary"
                      style={{ fontWeight: "bold", letterSpacing: "1px" }}
                    >
                      {isEditMode
                        ? "Edit Purchase Request"
                        : "Add Purchase Request"}
                    </h4>
                    <Button
                      color="secondary"
                      onClick={handleBack}
                      style={{
                        height: "40px",
                        width: "40px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                        transition: "all 0.3s ease",
                      }}
                      className="btn-hover"
                    >
                      <i
                        className="bx bx-undo"
                        style={{ fontSize: "20px" }}
                      ></i>
                    </Button>
                  </div>

                  <Form onSubmit={formik.handleSubmit}>
                    <Row className="g-4">
                      <Col md="6">
                        <FormGroup>
                          <Label className="form-label">
                            Purchase Request No.
                          </Label>
                          <Input
                            type="text"
                            name="purchaseRequestNo"
                            value={
                              formik?.values?.purchaseRequestNo || "Loading..."
                            }
                            disabled
                            className="form-control stylish-input"
                          />
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label className="form-label">Date</Label>
                          <Input
                            type="date"
                            name="date"
                            value={formik?.values?.date || ""}
                            disabled
                            className="form-control stylish-input"
                          />
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label className="form-label">Time</Label>
                          <Input
                            type="text"
                            name="time"
                            value={formik?.values?.time || ""}
                            disabled
                            className="form-control stylish-input"
                          />
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label className="form-label">Requested By</Label>
                          <Input
                            type="select"
                            name="requestedBy"
                            value={formik?.values?.requestedBy || ""}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control stylish-input ${
                              formik?.touched?.requestedBy &&
                              formik?.errors?.requestedBy
                                ? "is-invalid"
                                : ""
                            }`}
                          >
                            <option value="">Select Employee</option>
                            {employees?.map((employee) => (
                              <option
                                key={employee?.emp_id}
                                value={employee?.emp_id}
                              >
                                {employee?.full_name}
                              </option>
                            ))}
                          </Input>
                          {formik?.touched?.requestedBy &&
                            formik?.errors?.requestedBy && (
                              <div className="invalid-feedback">
                                {formik?.errors?.requestedBy}
                              </div>
                            )}
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label className="form-label">Supplier</Label>
                          <Input
                            type="select"
                            name="supplier"
                            value={formik?.values?.supplier || ""}
                            onChange={handleSupplierChange}
                            onBlur={formik.handleBlur}
                            className={`form-control stylish-input ${
                              formik?.touched?.supplier &&
                              formik?.errors?.supplier
                                ? "is-invalid"
                                : ""
                            }`}
                          >
                            <option value="">Select Supplier</option>
                            {suppliers?.map((supplier) => (
                              <option
                                key={supplier?.supplier_id}
                                value={supplier?.supplier_id}
                              >
                                {supplier?.supplier_name}
                              </option>
                            ))}
                          </Input>
                          {formik?.touched?.supplier &&
                            formik?.errors?.supplier && (
                              <div className="invalid-feedback">
                                {formik?.errors?.supplier}
                              </div>
                            )}
                        </FormGroup>
                      </Col>
                      <Col md="12">
                        <FormGroup>
                          <Label className="form-label">
                            Drugs / Excel Upload
                          </Label>
                          {isDrugsLoading ? (
                            <div className="d-flex align-items-center">
                              <Spinner
                                size="sm"
                                color="primary"
                                className="me-2"
                              />
                              Loading drugs...
                            </div>
                          ) : (
                            <Row className="g-2">
                              <Col md="6">
                                <Input
                                  type="file"
                                  name="excelUpload"
                                  accept=".xlsx, .xls"
                                  onChange={handleExcelUpload}
                                  className="form-control stylish-input"
                                  disabled={!formik.values.supplier}
                                />
                              </Col>
                              <Col md="6">
                                <Select
                                  isMulti
                                  name="manualDrugs"
                                  options={drugs}
                                  className="basic-multi-select"
                                  classNamePrefix="select"
                                  placeholder="Or select drugs manually"
                                  isDisabled={
                                    isExcelUploaded || !formik.values.supplier
                                  }
                                  onChange={(selectedOptions) => {
                                    const selectedDrugValues =
                                      selectedOptions?.map(
                                        (option) => option?.value
                                      ) || [];
                                    const filteredBrands =
                                      brands
                                        ?.filter((brand) =>
                                          selectedDrugValues.includes(
                                            brand?.drug_id
                                          )
                                        )
                                        ?.map((brand) => ({
                                          ...brand,
                                          orderQuantity: "",
                                          orderUnitQuantity: "",
                                          selectedPackType:
                                            brand?.conversions?.[0] || null,
                                        })) || [];
                                    formik.setFieldValue(
                                      "selectedDrugs",
                                      filteredBrands
                                    );
                                    setSelectedDrugsSelections(
                                      new Array(filteredBrands?.length).fill(
                                        false
                                      )
                                    );
                                  }}
                                  menuPortalTarget={document.body}
                                  styles={{
                                    menuPortal: (base) => ({
                                      ...base,
                                      zIndex: 9999,
                                    }),
                                    menu: (base) => ({
                                      ...base,
                                      zIndex: 9999,
                                      minWidth: "200px",
                                    }),
                                    control: (base) => ({
                                      ...base,
                                      minWidth: "100%",
                                    }),
                                  }}
                                />
                              </Col>
                            </Row>
                          )}
                          {formik?.touched?.selectedDrugs &&
                            formik?.errors?.selectedDrugs &&
                            typeof formik?.errors?.selectedDrugs ===
                              "string" && (
                              <div className="invalid-feedback d-block">
                                {formik?.errors?.selectedDrugs}
                              </div>
                            )}
                        </FormGroup>
                      </Col>
                      <Col md="12">
                        <h5
                          className="mb-3"
                          style={{ color: "#007bff", fontWeight: "600" }}
                        >
                          Selected Drugs Details
                        </h5>
                        {formik?.values?.selectedDrugs?.length === 0 ? (
                          <Alert color="warning">
                            Select at least one Drug
                          </Alert>
                        ) : (
                          <div className="table-wrapper">
                            <table className="table table-hover table-striped align-middle stylish-table">
                              <thead>
                                <tr>
                                  <th style={{ backgroundColor: "blue" }}>
                                    <span
                                      onClick={() =>
                                        toggleAllSelections(
                                          "selectedDrugs",
                                          formik?.values,
                                          setSelectedDrugsSelections,
                                          selectedDrugsSelections,
                                          !selectedDrugsSelections?.every(
                                            (s) => s
                                          )
                                        )
                                      }
                                      style={{ cursor: "pointer" }}
                                    >
                                      {selectedDrugsSelections?.every(
                                        (s) => s
                                      ) ? (
                                        <FaCheckCircle size={20} color="#fff" />
                                      ) : (
                                        <FaCircle size={20} color="#fff" />
                                      )}
                                    </span>
                                  </th>
                                  <th>Drug Name</th>
                                  <th>Brand</th>
                                  <th>Manufacturer</th>
                                  <th>Group Disease</th>
                                  <th>Disease</th>
                                  <th>Drug Form</th>
                                  <th>Power</th>
                                  <th>Stock Level</th>
                                  <th>Pack Type</th>
                                  <th>Units Per Pack</th>
                                  <th>Order Packs</th>
                                  <th>Unit Type</th>
                                  <th>Total Units</th>
                                </tr>
                              </thead>
                              <tbody>
                                {formik?.values?.selectedDrugs?.map(
                                  (drug, index) => {
                                    const packTypeOptions =
                                      drug?.conversions?.map((conv) => ({
                                        value: conv?.id,
                                        label: conv?.measurement_name,
                                        ...conv,
                                      })) || [];
                                    return (
                                      <tr key={index}>
                                        <td>
                                          <span
                                            onClick={() =>
                                              toggleSelection(
                                                index,
                                                setSelectedDrugsSelections,
                                                selectedDrugsSelections
                                              )
                                            }
                                            style={{ cursor: "pointer" }}
                                          >
                                            {selectedDrugsSelections?.[
                                              index
                                            ] ? (
                                              <FaCheckCircle
                                                size={20}
                                                color="#28a745"
                                              />
                                            ) : (
                                              <FaCircle
                                                size={20}
                                                color="#6c757d"
                                              />
                                            )}
                                          </span>
                                        </td>
                                        <td>{drug?.drug_name || "N/A"}</td>
                                        <td>{drug?.brand_name || "N/A"}</td>
                                        <td>
                                          {drug?.manufacturer_name || "N/A"}
                                        </td>
                                        <td>
                                          {drug?.group_disease_name || "N/A"}
                                        </td>
                                        <td>{drug?.disease_name || "N/A"}</td>
                                        <td>{drug?.drug_form_name || "N/A"}</td>
                                        <td>{drug?.strength_name || "N/A"}</td>
                                        <td>{drug?.stock || 0}</td>
                                        <td style={{ minWidth: "180px" }}>
                                          <Select
                                            options={packTypeOptions}
                                            value={packTypeOptions?.find(
                                              (opt) =>
                                                opt?.value ===
                                                drug?.selectedPackType?.id
                                            )}
                                            onChange={(option) =>
                                              handlePackTypeChange(
                                                index,
                                                option,
                                                "selectedDrugs"
                                              )
                                            }
                                            placeholder="Select Pack Type"
                                            className="basic-single-select"
                                            classNamePrefix="select"
                                            menuPortalTarget={document.body}
                                            styles={{
                                              menuPortal: (base) => ({
                                                ...base,
                                                zIndex: 9999,
                                              }),
                                              menu: (base) => ({
                                                ...base,
                                                zIndex: 9999,
                                                minWidth: "200px",
                                              }),
                                              control: (base) => ({
                                                ...base,
                                                minWidth: "100%",
                                              }),
                                            }}
                                          />
                                        </td>
                                        <td>
                                          {drug?.selectedPackType?.quantity ||
                                            "N/A"}
                                        </td>
                                        <td style={{ minWidth: "180px" }}>
                                          <Input
                                            type="number"
                                            name={`selectedDrugs[${index}].orderQuantity`}
                                            placeholder="Enter Quantity"
                                            value={drug?.orderQuantity || ""}
                                            onChange={(e) =>
                                              handleOrderQuantityChange(
                                                e,
                                                index,
                                                "selectedDrugs"
                                              )
                                            }
                                            onBlur={formik.handleBlur}
                                            className={`form-control stylish-input ${
                                              formik?.touched?.selectedDrugs?.[
                                                index
                                              ]?.orderQuantity &&
                                              formik?.errors?.selectedDrugs?.[
                                                index
                                              ]?.orderQuantity
                                                ? "is-invalid"
                                                : ""
                                            }`}
                                          />
                                          {formik?.touched?.selectedDrugs?.[
                                            index
                                          ]?.orderQuantity &&
                                            formik?.errors?.selectedDrugs?.[
                                              index
                                            ]?.orderQuantity && (
                                              <div className="invalid-feedback">
                                                {
                                                  formik?.errors
                                                    ?.selectedDrugs?.[index]
                                                    ?.orderQuantity
                                                }
                                              </div>
                                            )}
                                        </td>
                                        <td>
                                          {drug?.selectedPackType
                                            ?.unit_type_name || "N/A"}
                                        </td>
                                        <td>{drug?.orderUnitQuantity || 0}</td>
                                      </tr>
                                    );
                                  }
                                )}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </Col>
                      <Col md="12">
                        <FormGroup>
                          <Label className="form-label" for="lowStockDrugs">
                            Low Stock Drugs
                          </Label>
                          <Select
                            isMulti
                            name="lowStockDrugs"
                            options={lowStockDrugs}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={(selectedOptions) => {
                              const selectedLowStockValues =
                                selectedOptions?.map(
                                  (option) => option?.value
                                ) || [];
                              formik.setFieldValue(
                                "lowStockDrugs",
                                selectedLowStockValues
                              );
                              const filteredLowStockBrands =
                                brands
                                  ?.filter((brand) =>
                                    selectedLowStockValues.includes(
                                      brand?.drug_id
                                    )
                                  )
                                  ?.map((brand) => ({
                                    ...brand,
                                    orderQuantity: "",
                                    orderUnitQuantity: "",
                                    selectedPackType:
                                      brand?.conversions?.[0] || null,
                                  })) || [];
                              formik.setFieldValue(
                                "selectedLowStockDrugs",
                                filteredLowStockBrands
                              );
                              setLowStockDrugsSelections(
                                new Array(filteredLowStockBrands?.length).fill(
                                  false
                                )
                              );
                            }}
                            value={lowStockDrugs?.filter((drug) =>
                              formik?.values?.lowStockDrugs?.includes(
                                drug?.value
                              )
                            )}
                          />
                        </FormGroup>
                      </Col>
                      {formik?.values?.selectedLowStockDrugs?.length > 0 && (
                        <Col md="12">
                          <h5
                            className="mb-3"
                            style={{ color: "#dc3545", fontWeight: "600" }}
                          >
                            Low Stock Drugs Details
                          </h5>
                          <div className="table-wrapper">
                            <table className="table table-hover table-striped align-middle stylish-table">
                              <thead>
                                <tr>
                                  <th style={{ backgroundColor: "red" }}>
                                    <span
                                      onClick={() =>
                                        toggleAllSelections(
                                          "selectedLowStockDrugs",
                                          formik?.values,
                                          setLowStockDrugsSelections,
                                          lowStockDrugsSelections,
                                          !lowStockDrugsSelections?.every(
                                            (s) => s
                                          )
                                        )
                                      }
                                      style={{ cursor: "pointer" }}
                                    >
                                      {lowStockDrugsSelections?.every(
                                        (s) => s
                                      ) ? (
                                        <FaCheckCircle size={20} color="#fff" />
                                      ) : (
                                        <FaCircle size={20} color="#fff" />
                                      )}
                                    </span>
                                  </th>
                                  <th>Drug Name</th>
                                  <th>Pack Type</th>
                                  <th>Pack Quantity</th>
                                  <th>Order Quantity</th>
                                  <th>Unit Type</th>
                                  <th>Order Unit Quantity</th>
                                </tr>
                              </thead>
                              <tbody>
                                {formik?.values?.selectedLowStockDrugs?.map(
                                  (drug, index) => {
                                    const packTypeOptions =
                                      drug?.conversions?.map((conv) => ({
                                        value: conv?.id,
                                        label: conv?.pack_type,
                                        ...conv,
                                      })) || [];
                                    return (
                                      <tr key={index}>
                                        <td>
                                          <span
                                            onClick={() =>
                                              toggleSelection(
                                                index,
                                                setLowStockDrugsSelections,
                                                lowStockDrugsSelections
                                              )
                                            }
                                            style={{ cursor: "pointer" }}
                                          >
                                            {lowStockDrugsSelections?.[
                                              index
                                            ] ? (
                                              <FaCheckCircle
                                                size={20}
                                                color="#28a745"
                                              />
                                            ) : (
                                              <FaCircle
                                                size={20}
                                                color="#6c757d"
                                              />
                                            )}
                                          </span>
                                        </td>
                                        <td>{drug?.drug_name || "N/A"}</td>
                                        <td>
                                          <Select
                                            options={packTypeOptions}
                                            value={packTypeOptions?.find(
                                              (opt) =>
                                                opt?.value ===
                                                drug?.selectedPackType?.id
                                            )}
                                            onChange={(option) =>
                                              handlePackTypeChange(
                                                index,
                                                option,
                                                "selectedLowStockDrugs"
                                              )
                                            }
                                            placeholder="Select Pack Type"
                                            className="basic-single-select"
                                            classNamePrefix="select"
                                          />
                                        </td>
                                        <td>
                                          {drug?.selectedPackType?.quantity ||
                                            "N/A"}
                                        </td>
                                        <td>
                                          <Input
                                            type="number"
                                            name={`selectedLowStockDrugs[${index}].orderQuantity`}
                                            placeholder="Enter Quantity"
                                            value={drug?.orderQuantity || ""}
                                            onChange={(e) =>
                                              handleOrderQuantityChange(
                                                e,
                                                index,
                                                "selectedLowStockDrugs"
                                              )
                                            }
                                            onBlur={formik.handleBlur}
                                            className="form-control stylish-input"
                                          />
                                        </td>
                                        <td>
                                          {drug?.selectedPackType?.unit_type ||
                                            "N/A"}
                                        </td>
                                        <td>{drug?.orderUnitQuantity || 0}</td>
                                      </tr>
                                    );
                                  }
                                )}
                              </tbody>
                            </table>
                          </div>
                        </Col>
                      )}
                      <Col md="12" className="text-end">
                        <Button
                          type="submit"
                          color="primary"
                          disabled={formik?.isSubmitting}
                          style={{
                            padding: "10px 30px",
                            borderRadius: "25px",
                            fontWeight: "bold",
                            boxShadow: "0 4px 15px rgba(0, 123, 255, 0.3)",
                            transition: "all 0.3s ease",
                          }}
                          className="btn-hover"
                        >
                          {formik?.isSubmitting
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
        .form-label {
          font-weight: 600;
          color: #343a40;
          margin-bottom: 8px;
          letterspacing: 0.5px;
        }
        .stylish-input {
          border-radius: 10px;
          border: 1px solid #ced4da;
          padding: 10px 15px;
          transition: all 0.3s ease;
          background: #fff;
          box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.05);
        }
        .stylish-input:focus {
          border-color: #007bff;
          box-shadow: 0 0 10px rgba(0, 123, 255, 0.2);
          outline: none;
        }
        .stylish-input:disabled {
          background: #e9ecef;
          color: #6c757d;
        }
        .table-wrapper {
          max-height: 350px;
          overflow-y: auto;
          overflow-x: auto;
          border-radius: 15px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
          background: #fff;
        }
        .stylish-table {
          margin-bottom: 0;
          border-collapse: separate;
          border-spacing: 0;
          width: 100%;
          min-width: 1000px;
        }
        .stylish-table thead {
          background: linear-gradient(90deg, #007bff, #0056b3);
          color: white;
          font-weight: 600;
          position: sticky;
          top: 0;
          z-index: 1;
        }
        .stylish-table th {
          padding: 15px;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-size: 14px;
        }
        .stylish-table td {
          padding: 12px;
          vertical-align: middle;
          border-bottom: 1px solid #e9ecef;
          font-size: 14px;
          color: #495057;
        }
        .stylish-table tr:hover {
          background: #f1f3f5;
          transition: background 0.2s ease;
        }
        .btn-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 123, 255, 0.4);
        }
        .invalid-feedback {
          font-size: 12px;
          color: #dc3545;
          margin-top: 5px;
        }
      `}</style>
    </React.Fragment>
  );
};

export default PurchaseRequestForm;
