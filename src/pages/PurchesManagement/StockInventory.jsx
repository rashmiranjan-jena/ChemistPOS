import React, { useState, useEffect } from "react";
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
  FormFeedback,
} from "reactstrap";
import * as yup from "yup";
import { useFormik } from "formik";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getSupplierInventory,
  postStockInventoryData,
} from "../../ApiService/Stockinventory/Stockinventory";

const StockInventory = () => {
  const navigate = useNavigate();
  document.title = "StockInventory";
  const location = useLocation();
  const { suppliername, id } = location.state || {};
  const [date, setDate] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [searchValues, setSearchValues] = useState({
    productName: "",
    brand: "",
    category: "",
    subcategory: "",
    sku: "",
  });
  const [showTable, setShowTable] = useState(false);
  const [supplierData, setSupplierData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formDatas, setFormData] = useState([]);

  console.log("supplierData---->", supplierData);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSupplierInventory(id);
        setSupplierData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const formik = useFormik({
    initialValues: {
      supplierName: suppliername || "",
      invoiceNumber: "",
      totalAmount: "",
      date: "",
      uploadInvoice: null,
    },
    validationSchema: yup.object().shape({
      supplierName: yup.string().required("Please provide a supplier name"),
      invoiceNumber: yup.string().required("Invoice number is required"),
      totalAmount: yup
        .number()
        .typeError("Total amount must be a number")
        .required("Please provide a total amount"),
      uploadInvoice: yup.mixed().required("Please upload an invoice file"),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("supplier_id", id);
      formData.append("invoice_no", values.invoiceNumber);
      formData.append("invoice_date", values.date);
      formData.append("amount", values.totalAmount);
      formData.append("invoice_pdf", values.uploadInvoice);

      formData.append(
        "item_entries",
        JSON.stringify(
          formDatas.map((row, rowIndex) => {
            const matchedProduct = filteredProducts[rowIndex];
            return {
              code_id: matchedProduct.item_code_id,
              batch_no: row.batch_no,
              mrp: row.mrp,
              purchase_price: row.purchase_price,
              quantity: row.quantity,
              mfg_date: row.mfg_date,
              exp_date: row.exp_date,
            };
          })
        )
      );

      try {
        {
          console.log(formData);
        }
        const response = await postStockInventoryData(formData);
        console.log("Data posted successfully:", response);
        formik.resetForm();
        navigate("/bulkorderlist");
      } catch (error) {
        console.error("Error submitting data:", error);
      }
    },
  });

  const handleInputChange = (rowIndex, field, value) => {
    const updatedData = [...formDatas];
    updatedData[rowIndex] = {
      ...updatedData[rowIndex],
      [field]: value,
    };
    setFormData(updatedData);
  };

  const handleSearchChange = (field, value) => {
    setSearchValues((prevValues) => {
      const updatedValues = { ...prevValues, [field]: value };
      setShowTable(Object.values(updatedValues).some((val) => val !== ""));
      return updatedValues;
    });
  };

  const handleNavigation = () => {
    navigate("/productinventory");
  };

  const filteredProducts = supplierData?.products?.length
    ? supplierData.products.flatMap((product) => {
        return product.variants
          .filter((variant) => {
            return (
              (searchValues.productName === "" ||
                product.product_name === searchValues.productName) &&
              (searchValues.brand === "" ||
                variant.brand_name === searchValues.brand) &&
              (searchValues.category === "" ||
                product.category_name === searchValues.category) &&
              (searchValues.subcategory === "" ||
                product.subcategory_name === searchValues.subcategory) &&
              (searchValues.sku === "" ||
                variant.sku_code.includes(searchValues.sku))
            );
          })
          .map((variant) => ({
            ...variant,
            product_name: product.product_name,
            category_name: product.category_name,
            subcategory_name: product.subcategory_name,
          }));
      })
    : [];

  if (loading) {
    return <div>Loading...</div>;
  }

  const variantHeaders =
    filteredProducts.length > 0
      ? filteredProducts[0].codes.map((code) => code.name)
      : [];

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Stock Inventory" breadcrumbItem="Add Details" />

          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
                  <CardTitle
                    tag="h4"
                    className="d-flex justify-content-between"
                  >
                    <div>Invoice Information</div>
                    <Button color="success" onClick={handleNavigation}>
                      Go to Add Product
                    </Button>
                  </CardTitle>
                  <p className="card-title-desc mb-4">
                    Fill out the fields below to register invoice details.
                  </p>

                  <Form onSubmit={formik.handleSubmit} autoComplete="off">
                    <Row>
                      <Col sm="6">
                        <div className="mb-3">
                          <Label htmlFor="supplierName">Supplier Name</Label>
                          <Input
                            id="supplierName"
                            name="supplierName"
                            type="text"
                            value={formik.values.supplierName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            disabled
                          />
                          {formik.touched.supplierName &&
                            formik.errors.supplierName && (
                              <FormFeedback>
                                {formik.errors.supplierName}
                              </FormFeedback>
                            )}
                        </div>
                        <div className="mb-3">
                          <Label htmlFor="invoiceNumber">Invoice Number</Label>
                          <Input
                            id="invoiceNumber"
                            name="invoiceNumber"
                            type="text"
                            value={formik.values.invoiceNumber}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={
                              formik.touched.invoiceNumber &&
                              formik.errors.invoiceNumber
                            }
                          />
                          {formik.touched.invoiceNumber &&
                            formik.errors.invoiceNumber && (
                              <FormFeedback>
                                {formik.errors.invoiceNumber}
                              </FormFeedback>
                            )}
                        </div>
                        <div className="mb-3">
                          <Label htmlFor="date">Date</Label>
                          <Input
                            id="date"
                            name="date"
                            type="date"
                            value={formik.values.date}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={
                              formik.touched.date && !!formik.errors.date
                            }
                          />
                          {formik.touched.date && formik.errors.date && (
                            <FormFeedback>{formik.errors.date}</FormFeedback>
                          )}
                        </div>

                        <div className="mb-3">
                          <Label htmlFor="totalAmount">Total Amount</Label>
                          <Input
                            id="totalAmount"
                            name="totalAmount"
                            type="text"
                            value={formik.values.totalAmount}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={
                              formik.touched.totalAmount &&
                              !!formik.errors.totalAmount
                            }
                          />
                          {formik.touched.totalAmount &&
                            formik.errors.totalAmount && (
                              <FormFeedback>
                                {formik.errors.totalAmount}
                              </FormFeedback>
                            )}
                        </div>

                        <div className="mb-3">
                          <Label htmlFor="uploadInvoice">Upload Invoice</Label>
                          <Input
                            id="uploadInvoice"
                            name="uploadInvoice"
                            type="file"
                            onChange={(e) =>
                              formik.setFieldValue(
                                "uploadInvoice",
                                e.currentTarget.files[0]
                              )
                            }
                            onBlur={formik.handleBlur}
                            invalid={
                              formik.touched.uploadInvoice &&
                              formik.errors.uploadInvoice
                            }
                          />
                          {formik.touched.uploadInvoice &&
                            formik.errors.uploadInvoice && (
                              <FormFeedback>
                                {formik.errors.uploadInvoice}
                              </FormFeedback>
                            )}
                        </div>
                      </Col>
                    </Row>

                    {/* Item Details Section */}
                    <Card className="mt-4">
                      <CardBody>
                        <CardTitle tag="h4">Item Details</CardTitle>

                        <div className="mb-4">
                          <Row>
                            <Col sm="6" md="4" lg="3" className="mb-3">
                              <Label>Product Name</Label>
                              <Input
                                type="select"
                                value={searchValues.productName}
                                onChange={(e) =>
                                  handleSearchChange(
                                    "productName",
                                    e.target.value
                                  )
                                }
                              >
                                <option value="">Select Product Name</option>
                                {supplierData?.products.map((product, idx) => (
                                  <option
                                    key={idx}
                                    value={product.product_name}
                                  >
                                    {product.product_name}
                                  </option>
                                ))}
                              </Input>
                            </Col>
                            <Col sm="6" md="4" lg="3" className="mb-3">
                              <Label>Brand</Label>
                              <Input
                                type="select"
                                value={searchValues.brand}
                                onChange={(e) =>
                                  handleSearchChange("brand", e.target.value)
                                }
                              >
                                <option value="">Select Brand</option>
                                {supplierData?.supplier_brands.map(
                                  (brand, idx) => (
                                    <option key={idx} value={brand.brand_name}>
                                      {brand.brand_name}
                                    </option>
                                  )
                                )}
                              </Input>
                            </Col>
                            <Col sm="6" md="4" lg="3" className="mb-3">
                              <Label>Category</Label>
                              <Input
                                type="select"
                                value={searchValues.category}
                                onChange={(e) =>
                                  handleSearchChange("category", e.target.value)
                                }
                              >
                                <option value="">Select Category</option>
                                {supplierData?.products.map((product, idx) => (
                                  <option
                                    key={idx}
                                    value={product.category_name}
                                  >
                                    {product.category_name}
                                  </option>
                                ))}
                              </Input>
                            </Col>
                            <Col sm="6" md="4" lg="3" className="mb-3">
                              <Label>Subcategory</Label>
                              <Input
                                type="select"
                                value={searchValues.subcategory}
                                onChange={(e) =>
                                  handleSearchChange(
                                    "subcategory",
                                    e.target.value
                                  )
                                }
                              >
                                <option value="">Select Subcategory</option>
                                {supplierData?.products.map((product, idx) => (
                                  <option
                                    key={idx}
                                    value={product.subcategory_name}
                                  >
                                    {product.subcategory_name}
                                  </option>
                                ))}
                              </Input>
                            </Col>
                            <Col sm="6" md="4" lg="3" className="mb-3">
                              <Label>SKU</Label>
                              <Input
                                type="select"
                                value={searchValues.sku}
                                onChange={(e) =>
                                  handleSearchChange("sku", e.target.value)
                                }
                                placeholder="Select SKU"
                              >
                                <option value="">Select SKU</option>
                                {filteredProducts?.map((variant, idx) => (
                                  <option key={idx} value={variant.sku_code}>
                                    {variant.sku_code}
                                  </option>
                                ))}
                              </Input>
                            </Col>
                          </Row>
                        </div>
                        <div
                          className="table-responsive mt-4"
                          style={{ maxHeight: "300px", overflowY: "auto" }}
                        >
                          <table className="table table-bordered">
                            <thead>
                              <tr>
                                <th>Srno.</th>
                                <th>Item Code</th>
                                <th>SKU Code</th>
                                <th>Brand</th>
                                <th>Category</th>
                                <th>Subcategory</th>
                                {variantHeaders.map((header, index) => (
                                  <th key={index}>{header}</th>
                                ))}
                                <th>Batch No.</th>
                                <th>MRP</th>
                                <th>Purchase Price</th>
                                <th>Quantity</th>
                                <th>MFG Date</th>
                                <th>EXP Date</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredProducts?.map((product, rowIndex) => (
                                <tr key={product.variant_id}>
                                  <td>{rowIndex + 1}</td>
                                  <td>{product.item_code || "N/A"}</td>
                                  <td>{product.sku_code || "N/A"}</td>
                                  <td>{product.brand_name || "N/A"}</td>
                                  <td>{product.category_name || "N/A"}</td>
                                  <td>{product.subcategory_name || "N/A"}</td>
                                  {variantHeaders.map((_, index) => (
                                    <td key={index}>
                                      {product.codes?.[index]?.code || "N/A"}
                                    </td>
                                  ))}
                                  <td>
                                    <Input
                                      type="text"
                                      value={
                                        formDatas[rowIndex]?.batch_no || ""
                                      }
                                      style={{ width: "150px" }}
                                      onChange={(e) =>
                                        handleInputChange(
                                          rowIndex,
                                          "batch_no",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </td>
                                  <td>
                                    <Input
                                      type="number"
                                      value={formDatas[rowIndex]?.mrp || ""}
                                      style={{ width: "150px" }}
                                      onChange={(e) =>
                                        handleInputChange(
                                          rowIndex,
                                          "mrp",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </td>
                                  <td>
                                    <Input
                                      type="number"
                                      value={
                                        formDatas[rowIndex]?.purchase_price ||
                                        ""
                                      }
                                      style={{ width: "150px" }}
                                      onChange={(e) =>
                                        handleInputChange(
                                          rowIndex,
                                          "purchase_price",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </td>
                                  <td>
                                    <Input
                                      type="number"
                                      value={
                                        formDatas[rowIndex]?.quantity || ""
                                      }
                                      style={{ width: "150px" }}
                                      onChange={(e) =>
                                        handleInputChange(
                                          rowIndex,
                                          "quantity",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </td>
                                  <td>
                                    <Input
                                      type="date"
                                      value={
                                        formDatas[rowIndex]?.mfg_date || ""
                                      }
                                      style={{ width: "150px" }}
                                      onChange={(e) =>
                                        handleInputChange(
                                          rowIndex,
                                          "mfg_date",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </td>
                                  <td>
                                    <Input
                                      type="date"
                                      value={
                                        formDatas[rowIndex]?.exp_date || ""
                                      }
                                      style={{ width: "150px" }}
                                      onChange={(e) =>
                                        handleInputChange(
                                          rowIndex,
                                          "exp_date",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </CardBody>
                    </Card>

                    <div className="text-center mt-4">
                      <Button type="submit" color="primary">
                        Submit
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

export default StockInventory;
