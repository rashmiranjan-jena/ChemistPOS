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
import { useNavigate, useParams } from "react-router-dom";
import {
  getCoupons,
  getCategories,
  getBrands,
  getProducts,
  getUsers,
  postDiscountApplicable,
  getDiscountApplicableById,
  updateDiscountApplicable,
} from "../../../ApiService/DealAndDiscount/DiscountApplicable/DiscountApplicable";

const EditDiscountApplicable = () => {
  document.title = "Discount Coupons";
  const { id } = useParams();
  const navigate = useNavigate();

  // State variables
  const [coupons, setCoupons] = useState([]);
  const [optionsData, setOptionsData] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [conditions, setConditions] = useState([]);
  const [searchQueryCategory, setSearchQueryCategory] = useState("");
  const [searchQueryBrand, setSearchQueryBrand] = useState("");
  const [searchQueryProduct, setSearchQueryProduct] = useState("");
  const [searchQueryUser, setSearchQueryUser] = useState("");
  const [searchQueryOrderValue, setSearchQueryOrderValue] = useState("");

  // Fetch coupons and discount applicable data
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
  
    if (id) {
      const fetchDiscountApplicable = async () => {
        try {
          const response = await getDiscountApplicableById(id);
          const data = response.data;
  
          // Extracting applicabilities data
          const applicabilities = data[0]?.applicabilities.map(app => ({
            applicabilityId: app.applicability_id,
            applicableTo: app.applicable_to,
            applicableId: app.applicable_id,
            applicableName: app.applicable_name,
            conditions: app.conditions,
            status: app.status
          }));
  
          // Set form values
          formik.setValues({
            couponName: data[0]?.coupon_details.coupon_name || '',
            applicableTo: applicabilities?.[0]?.applicableTo || '',
            selectedItems: applicabilities?.map(app => app.applicableId) || [],
          });
  
          // Set conditions
          const allConditions = applicabilities?.flatMap(app => app.conditions) || [];
          setConditions(allConditions);
  
          // Set selected option
          setSelectedOption(applicabilities?.[0]?.applicableTo || '');
  
          // Fetch options data based on the selected option
          fetchOptionsData(applicabilities?.[0]?.applicableTo || '');
        } catch (error) {
          console.error("Error fetching discount applicable data:", error);
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Failed to load discount applicable data.",
          });
        }
      };
  
      fetchDiscountApplicable();
    }
  }, [id]);
  
  

  // Fetch options data based on the selected option
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

  // Add a new condition
  const addCondition = () => {
    setConditions([...conditions, { conditionName: "", value: "" }]);
  };

  // Remove a condition
  const removeCondition = (index) => {
    const updatedConditions = conditions.filter((_, i) => i !== index);
    setConditions(updatedConditions);
  };

  // Handle condition field changes
  const handleConditionChange = (index, field, value) => {
    const updatedConditions = [...conditions];
    updatedConditions[index][field] = value;
    setConditions(updatedConditions);
  };

  // Formik configuration
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
        let response;
        if (id) {
          response = await updateDiscountApplicable(id, payload);
        } else {
          response = await postDiscountApplicable(payload);
        }

        if (response.status === 201 || response.status === 200) {
          await Swal.fire({
            icon: "success",
            title: "Success!",
            text:
              response.data.message ||
              `Discount Applicable ${id ? "updated" : "submitted"} successfully!`,
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
            error.response?.data?.error ||
            `An error occurred while ${
              id ? "updating" : "submitting"
            } the Discount Applicable.`,
        });
      }
    },
  });

  // Handle applicableTo change
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

  // Handle checkbox changes
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

  // Filter options based on search query
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
            breadcrumbItem={id ? "Edit Details" : "Add Details"}
          />
          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
                  <CardTitle tag="h4">Discount Code Information</CardTitle>
                  <p className="card-title-desc mb-4">
                    Fill out the fields below to{" "}
                    {id ? "edit" : "register"} your discount code.
                  </p>

                  <Form onSubmit={formik.handleSubmit} autoComplete="off">
                    {/* Coupon Name */}
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

                      {/* Applicable To */}
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

                    {/* Conditions */}
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
                                      checked={formik.values.selectedItems.includes(
                                        category.id
                                      )}
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
                                      checked={formik.values.selectedItems.includes(
                                        brand.id
                                      )}
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
                                      checked={formik.values.selectedItems.includes(
                                        product.id
                                      )}
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
                                      checked={formik.values.selectedItems.includes(
                                        user.id
                                      )}
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
                       {id ? "Update" : "Submit"}
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

export default EditDiscountApplicable;
