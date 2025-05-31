import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Form,
  Input,
  Label,
  Row,
  Table,
  FormFeedback,
} from "reactstrap";
import { useFormik } from "formik";
import * as yup from "yup";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";
import {
  getCategories,
  getBrands,
  getProducts,
  getDeal,
  postDealApplicable,
  getDealApplicabilityById,
  editDealApplicabilityById,
} from "../../../ApiService/DealAndDiscount/DealsApplicabilities/DealsApplicabilities";

const EditDealsApplicablities = () => {
  document.title = "Deal Coupons";
  const location = useLocation();
  const { id } = location.state || {};
  console.log(id);
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState([]);
  const [optionsData, setOptionsData] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [conditions, setConditions] = useState([]);
  const [searchQueryCategory, setSearchQueryCategory] = useState("");
  const [searchQueryBrand, setSearchQueryBrand] = useState("");
  const [searchQueryProduct, setSearchQueryProduct] = useState("");
  const [initialData, setInitialData] = useState(null);
  useEffect(() => {
    const fetchDealName = async () => {
      try {
        const response = await getDeal();
        console.log("response----->", response);
        setCoupons(response || []);
      } catch (error) {
        console.error("Error fetching deal:", error);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to load deal.",
        });
      }
    };

    fetchDealName();
  }, []);

  const fetchOptionsData = async (option) => {
    try {
      let response;
      switch (option) {
        case "Category":
          response = await getCategories();
          setOptionsData(
            response?.map((item) => ({
              id: item.category_name_id,
              name: item.category_name,
            })) || []
          );
          break;
        case "Brand":
          response = await getBrands();
          setOptionsData(
            response?.map((item) => ({
              id: item.brand_details.brand_id,
              name: item.brand_details.brand_name,
            })) || []
          );
          break;
        case "Product":
          response = await getProducts();
          setOptionsData(
            response?.map((item) => ({
              id: item.product_id,
              name: item.product_name,
            })) || []
          );
          break;

        default:
          setOptionsData([]);
          break;
      }
    } catch (error) {
      console.error(`Error fetching ${option} data:`, error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: `Failed to load ${option} data. Please try again later.`,
      });
    }
  };

  const addCondition = () => {
    setConditions([...conditions, { conditionName: "", value: "" }]);
  };

  const removeCondition = (index) => {
    const updatedConditions = conditions.filter((_, i) => i !== index);
    setConditions(updatedConditions);
  };

  const handleConditionChange = (index, field, value) => {
    setConditions((prevConditions) =>
      prevConditions.map((condition, i) =>
        i === index ? { ...condition, [field]: value } : condition
      )
    );
  };

  const formik = useFormik({
    initialValues: {
      dealName: "",
      applicableTo: "",
      selectedItems: [],
    },
    validationSchema: yup.object().shape({
      dealName: yup.string().required("Please select a Coupon Name"),
      applicableTo: yup
        .string()
        .required("Please select an Applicable To option"),
    }),
    onSubmit: async (values) => {
      const applicabilities = values.selectedItems.map((item) => ({
        deal_id: values.dealName,
        applicable_to: values.applicableTo,
        applicable_id: item,
      }));
      console.log("conditions---->", conditions);
      const payload = {
        applicabilities,
        conditions: conditions.map((condition) => ({
          deal_id: values.dealName,
          condition_type: condition.conditionName,
          condition_value: condition.value,
        })),
      };
  
      try {
        let response;
        if (id) {
          response = await editDealApplicabilityById(id, payload);
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: response.data.message || "Deal updated successfully!",
          });
        } else {
          response = await postDealApplicable(payload);
          if (response.status == 201) {
            Swal.fire({
              icon: "success",
              title: "Success!",
              text:
                response.data.message || "Discount Applicable submitted successfully!",
            });
          }
        }
        
        formik.resetForm();
        setConditions([]);
        navigate("/dealsapplicabilitieslist");
  
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text:
            error.data.response?.data?.error ||
            "An error occurred while submitting the Discount Applicable.",
        });
      }
    },
  });
  

  const handleApplicableToChange = (e) => {
    const value = e.target.value;
    setSelectedOption(value);
    formik.setFieldValue("applicableTo", value);
    setOptionsData([]);
    setSearchQueryCategory("");
    setSearchQueryBrand("");
    setSearchQueryProduct("");

    if (value) fetchOptionsData(value);
  };

  const handleCheckboxChange = (e) => {
    const value = e.target.value;
    const isChecked = e.target.checked;

    if (isChecked) {
      formik.setFieldValue("selectedItems", [
        ...formik.values.selectedItems,
        value,
      ]);
    } else {
      formik.setFieldValue(
        "selectedItems",
        formik.values.selectedItems.filter((item) => item !== value)
      );
    }
  };

  // Filter options based on the search query
  const filteredOptions = (options, query) => {
    return options.filter(
      (item) =>
        item.name &&
        typeof item.name === "string" &&
        item.name.toLowerCase().includes(query.toLowerCase())
    );
  };

  useEffect(() => {
    const fetchDealData = async () => {
      try {
        const response = await getDealApplicabilityById(id);
        console.log(response);
        setInitialData(response);

        formik.setValues({
          dealName: response.deal_name,
          applicableTo:
            response.applicabilities.length > 0
              ? response.applicabilities[0].applicable_to
              : "",
          selectedItems: response.applicabilities.map(
            (item) => item.applicable_id
          ),
          conditions: response.conditions || [],
        });

        setConditions(response.conditions || []);
      } catch (error) {
        console.error("Error fetching deal data:", error);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to load deal data.",
        });
      }
    };

    if (id) {
      fetchDealData();
    }
  }, [id]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Discount Code Registration"
            breadcrumbItem="Add Details"
          />
          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
                  <CardTitle tag="h4">Discount Code Information</CardTitle>
                  <p className="card-title-desc mb-4">
                    Fill out the fields below to register your discount code.
                  </p>

                  <Form onSubmit={formik.handleSubmit} autoComplete="off">
                    <Row>
                      <Col sm="6">
                        <div className="mb-3">
                          <Label htmlFor="dealName">Deal Name</Label>
                          <Input
                            id="dealName"
                            name="dealName"
                            type="select"
                            value={formik.values.dealName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={
                              formik.touched.dealName && formik.errors.dealName
                            }
                          >
                            <option value="">Select Deal Name</option>
                            {coupons.map((coupon) => (
                              <option
                                key={coupon.deal_id}
                                value={coupon.deal_id}
                              >
                                {coupon.deal_name}
                              </option>
                            ))}
                          </Input>
                          {formik.touched.dealName &&
                            formik.errors.dealName && (
                              <FormFeedback>
                                {formik.errors.dealName}
                              </FormFeedback>
                            )}
                        </div>
                      </Col>

                      <Col sm="6">
                        <div className="mb-3">
                          <Label htmlFor="applicableTo">Applicable To</Label>
                          <Input
                            id="applicableTo"
                            name="applicableTo"
                            type="select"
                            value={formik.values.applicableTo}
                            onChange={handleApplicableToChange} // Ensure this function updates `selectedOption`
                            onBlur={formik.handleBlur}
                          >
                            <option value="">Select Applicable To</option>
                            <option value="Category">Category</option>
                            <option value="Brand">Brand</option>
                            <option value="Product">Product</option>
                          </Input>
                          {formik.touched.applicableTo &&
                            formik.errors.applicableTo && (
                              <FormFeedback>
                                {formik.errors.applicableTo}
                              </FormFeedback>
                            )}
                        </div>
                      </Col>
                    </Row>

                    <Row>
                      <Col sm="12">
                        <div className="mb-3">
                          <Label>Conditions:</Label>
                          {conditions.map((condition, index) => (
                            <Row
                              key={index}
                              className="mb-2 align-items-center"
                            >
                              <Col md="5">
                                <Input
                                  type="text"
                                  placeholder="Condition Name"
                                  value={condition.condition_type} // ✅ Correct key from API response
                                  onChange={(e) =>
                                    handleConditionChange(
                                      index,
                                      "condition_type",
                                      e.target.value
                                    )
                                  }
                                />
                              </Col>
                              <Col md="5">
                                <Input
                                  type="text"
                                  placeholder="Value"
                                  value={condition.condition_value} // ✅ Correct key from API response
                                  onChange={(e) =>
                                    handleConditionChange(
                                      index,
                                      "condition_value",
                                      e.target.value
                                    )
                                  }
                                />
                              </Col>
                              <Col md="2">
                                <Button
                                  color="danger"
                                  onClick={() => removeCondition(index)}
                                >
                                  Remove
                                </Button>
                              </Col>
                            </Row>
                          ))}
                          <Button
                            color="primary"
                            onClick={addCondition}
                            style={{ marginLeft: "10px" }}
                          >
                            Add Condition
                          </Button>
                        </div>
                      </Col>
                    </Row>

                    {/* Category Search */}
                    {selectedOption === "Category" && (
                      <Row>
                        <Col sm="12">
                          <div className="mb-3">
                            <Label>Search Category</Label>
                            <Input
                              type="text"
                              placeholder="Search by category name"
                              value={searchQueryCategory}
                              onChange={(e) =>
                                setSearchQueryCategory(e.target.value)
                              }
                            />
                          </div>
                          <Table bordered>
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Category Name</th>
                                <th>Select</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredOptions(
                                optionsData,
                                searchQueryCategory
                              ).map((category, index) => (
                                <tr key={category.id}>
                                  <td>{index + 1}</td>
                                  <td>{category.name}</td>
                                  <td>
                                    <Input
                                      type="checkbox"
                                      value={category.id}
                                      onChange={handleCheckboxChange}
                                    />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </Col>
                      </Row>
                    )}

                    {/* Brand Search */}
                    {selectedOption === "Brand" && (
                      <Row>
                        <Col sm="12">
                          <div className="mb-3">
                            <Label>Search Brand</Label>
                            <Input
                              type="text"
                              placeholder="Search by Brand name"
                              value={searchQueryBrand}
                              onChange={(e) =>
                                setSearchQueryBrand(e.target.value)
                              }
                            />
                          </div>
                          <Table bordered>
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Brand Name</th>
                                <th>Select</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredOptions(
                                optionsData,
                                searchQueryBrand
                              ).map((brand, index) => (
                                <tr key={brand.id}>
                                  <td>{index + 1}</td>
                                  <td>{brand.name}</td>
                                  <td>
                                    <Input
                                      type="checkbox"
                                      value={brand.id}
                                      onChange={handleCheckboxChange}
                                    />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </Col>
                      </Row>
                    )}

                    {/* Product Search */}
                    {selectedOption === "Product" && (
                      <Row>
                        <Col sm="12">
                          <div className="mb-3">
                            <Label>Search Product</Label>
                            <Input
                              type="text"
                              placeholder="Search by Product name"
                              value={searchQueryProduct}
                              onChange={(e) =>
                                setSearchQueryProduct(e.target.value)
                              }
                            />
                          </div>
                          <Table bordered>
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Product Name</th>
                                <th>Select</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredOptions(
                                optionsData,
                                searchQueryProduct
                              ).map((product, index) => (
                                <tr key={product.id}>
                                  <td>{index + 1}</td>
                                  <td>{product.name}</td>
                                  <td>
                                    <Input
                                      type="checkbox"
                                      value={product.id}
                                      onChange={handleCheckboxChange}
                                    />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </Col>
                      </Row>
                    )}

                    <div className="d-flex flex-wrap gap-2">
                      <Button type="submit" color="primary">
                        Submit
                      </Button>
                      <Button
                        type="button"
                        color="secondary"
                        onClick={() => formik.resetForm()}
                      >
                        Cancel
                      </Button>
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

export default EditDealsApplicablities;
