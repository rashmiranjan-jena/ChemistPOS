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
import { useNavigate } from "react-router-dom";
import {
  getCoupons,
  getCategories,
  getBrands,
  getProducts,
  getUsers,
  // getOrderValues,
  postDiscountApplicable,
} from "../../../ApiService/DealAndDiscount/DiscountApplicable/DiscountApplicable";

const DiscountApplicable = () => {
  document.title = "Discount Coupons";

  const navigate = useNavigate();
  const [coupons, setCoupons] = useState([]);
  const [optionsData, setOptionsData] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [conditions, setConditions] = useState([]);
  const [searchQueryCategory, setSearchQueryCategory] = useState("");
  const [searchQueryBrand, setSearchQueryBrand] = useState("");
  const [searchQueryProduct, setSearchQueryProduct] = useState("");
  const [searchQueryUser, setSearchQueryUser] = useState("");
  const [searchQueryOrderValue, setSearchQueryOrderValue] = useState("");
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await getCoupons();
        setCoupons(response.coupons || []);
      } catch (error) {
        console.error("Error fetching coupons:", error);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to load coupons.",
        });
      }
    };

    fetchCoupons();
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
        case "User":
          response = await getUsers();
          console.log("response--->",response)
          setOptionsData(
            response?.map((user) => ({
              id: user.customer_id,
              name: user.customer_details.first_name,
            })) || []
          );
          break;
        case "OrderValue":
          response = await getOrderValues();
          setOptionsData(response?.data || []);
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

  console.log("optionsData---->",optionsData)

  const addCondition = () => {
    setConditions([...conditions, { conditionName: "", value: "" }]);
  };

  const removeCondition = (index) => {
    const updatedConditions = conditions.filter((_, i) => i !== index);
    setConditions(updatedConditions);
  };

  const handleConditionChange = (index, field, value) => {
    const updatedConditions = [...conditions];
    updatedConditions[index][field] = value;
    setConditions(updatedConditions);
  };

  const formik = useFormik({
    initialValues: {
      couponName: "",
      applicableTo: "",
      selectedItems: [],
    },
    validationSchema: yup.object().shape({
      couponName: yup.string().required("Please select a Coupon Name"),
      applicableTo: yup
        .string()
        .required("Please select an Applicable To option"),
    }),
    onSubmit: async (values) => {
      const payload = {
        coupon_id: values.couponName,
        applicable_to: values.applicableTo,
        applicable_id: values.selectedItems,
        conditions: conditions,
      };

      try {
        const response = await postDiscountApplicable(payload);
        if (response.status==201) {
          await Swal.fire({
            icon: "success",
            title: "Success!",
            text:
              response.data.message || "Discount Applicable submitted successfully!",
          });
          formik.resetForm();
          setConditions([]);
          navigate("/discountapplicablelist");
        }
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
    setSearchQueryUser("");
    setSearchQueryOrderValue("");
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
                          <Label htmlFor="couponName">Coupon Name</Label>
                          <Input
                            id="couponName"
                            name="couponName"
                            type="select"
                            value={formik.values.couponName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={
                              formik.touched.couponName &&
                              formik.errors.couponName
                            }
                          >
                            <option value="">Select Coupon Name</option>
                            {coupons.map((coupon) => (
                              <option
                                key={coupon.coupon_id}
                                value={coupon.coupon_id}
                              >
                                {coupon.coupon_code}
                              </option>
                            ))}
                          </Input>
                          {formik.touched.couponName &&
                            formik.errors.couponName && (
                              <FormFeedback>
                                {formik.errors.couponName}
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
                            onChange={handleApplicableToChange}
                            onBlur={formik.handleBlur}
                            invalid={
                              formik.touched.applicableTo &&
                              formik.errors.applicableTo
                            }
                          >
                            <option value="">Select Applicable To</option>
                            <option value="Category">Category</option>
                            <option value="Brand">Brand</option>
                            <option value="Product">Product</option>
                            <option value="User">User</option>
                            <option value="OrderValue">Order Value</option>
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
                          <Label>Conditions</Label>
                          {conditions.map((condition, index) => (
                            <Row
                              key={index}
                              className="mb-2 align-items-center"
                            >
                              <Col md="5">
                                <Input
                                  type="text"
                                  placeholder="Condition Name"
                                  value={condition.conditionName}
                                  onChange={(e) =>
                                    handleConditionChange(
                                      index,
                                      "conditionName",
                                      e.target.value
                                    )
                                  }
                                />
                              </Col>
                              <Col md="5">
                                <Input
                                  type="text"
                                  placeholder="Value"
                                  value={condition.value}
                                  onChange={(e) =>
                                    handleConditionChange(
                                      index,
                                      "value",
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
                          <Button color="primary" onClick={addCondition} style={{marginLeft:"10px"}}>
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

                    {/* User Search */}
                    {selectedOption === "User" && (
                      <Row>
                        <Col sm="12">
                          <div className="mb-3">
                            <Label>Search User</Label>
                            <Input
                              type="text"
                              placeholder="Search by User name"
                              value={searchQueryUser}
                              onChange={(e) =>
                                setSearchQueryUser(e.target.value)
                              }
                            />
                          </div>
                          <Table bordered>
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>User Name</th>
                                <th>Select</th>
                              </tr>
                            </thead>
                            <tbody>
                            
                              {filteredOptions(
                                optionsData,
                                searchQueryUser
                              ).map((user, index) => (
                                <tr key={user.id}>
                                  <td>{index + 1}</td>
                                  <td>{user.name}</td>
                                  <td>
                                    <Input
                                      type="checkbox"
                                      value={user.id}
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

                    {/* OrderValue Search */}
                    {selectedOption === "OrderValue" && (
                      <Row>
                        <Col sm="12">
                          <div className="mb-3">
                            <Label>Search OrderValue</Label>
                            <Input
                              type="text"
                              placeholder="Search by OrderValue name"
                              value={searchQueryOrderValue}
                              onChange={(e) =>
                                setSearchQueryOrderValue(e.target.value)
                              }
                            />
                          </div>
                          <Table bordered>
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>OrderValue Name</th>
                                <th>Select</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredOptions(
                                optionsData,
                                searchQueryOrderValue
                              ).map((ordervalue, index) => (
                                <tr key={ordervalue.id}>
                                  <td>{index + 1}</td>
                                  <td>{ordervalue.name}</td>
                                  <td>
                                    <Input
                                      type="checkbox"
                                      value={ordervalue.id}
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

export default DiscountApplicable;
