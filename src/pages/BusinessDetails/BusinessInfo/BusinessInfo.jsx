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
import Select from "react-select";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  submitBusinessInfo,
  getBusinessInfoById,
  updateBusinessInfo,
} from "../../../ApiService/BusinessInfo/BusinessInfo";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
const BusinessInfo = () => {
  document.title = "Business Registration";
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location.state || {};
  console.log(id);
  const [businessData, setBusinessData] = useState(null);
  const [loading, setLoading] = useState(false);
  const businessTypes = [
    { value: "fashion", label: "Fashion" },
    { value: "grocery", label: "Grocery" },
    { value: "electronics", label: "Electronics" },
    { value: "books", label: "Books" },
    { value: "stationary", label: "Stationary" },
    { value: "electrical", label: "Electrical" },
    { value: "hardware", label: "Hardware" },
    { value: "computers", label: "Computers" },
    { value: "jewellery", label: "Jewellery" },
    { value: "restaurants", label: "Restaurants" },
    { value: "fish_meat", label: "Fish & Meat" },
    { value: "garment", label: "Garment" },
    { value: "dairy", label: "Dairy" },
    { value: "bakery", label: "Bakery" },
    { value: "house_hold", label: "House Hold" },
    { value: "construction", label: "Construction" },
    { value: "spare_parts", label: "Spare Parts" },
    { value: "automobile", label: "Automobile" },
    { value: "parlours", label: "Parlours" },
    { value: "others", label: "Others" },
  ];

  useEffect(() => {
    if (id) {
      setLoading(true);
      getBusinessInfoById(id)
        .then((response) => {
          setBusinessData(response.data);
          formik.setValues({
            alias: response.data.alias || "",
            businessType: response.data.business_type || "",
            gstNo: response.data.gst_tax_number || "",
            registrationNumber: response.data.registration_number || "",
            tradeLicence: response.data.trade_licence || "",
            panNo: response.data.pan_number || "",
            cinNo: response.data.cin_no || "",
            natureOfBusiness: response.data.natureOfBusiness || "",
            address: response.data.address || "",
            city: response.data.city || "",
            state: response.data.state || "",
            country: response.data.country || "",
            pinCode: response.data.pinCode || "",
            contactNo1: response.data.contact_numbers.contactNo1 || "",
            contactNo2: response.data.contact_numbers.contactNo2 || "",
            tollFreeNo: response.data.toll_free_number || "",
            whatsappNo: response.data.contact_numbers.whatsappNo || "",
            website: response.data.website || "",
            aadharNo: response.data.adhara_no || "",
          });
        })
        .catch((error) => console.error("Error fetching business info:", error))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const formik = useFormik({
    initialValues: {
      alias: "",
      businessType: "",
      gstNo: "",
      registrationNumber: "",
      tradeLicence: "",
      panNo: "",
      cinNo: "",
      natureOfBusiness: "",
      address: "",
      city: "",
      state: "",
      country: "",
      pinCode: "",
      contactNo1: "",
      contactNo2: "",
      tollFreeNo: "",
      whatsappNo: "",
      website: "",
      aadharNo: "",
    },
    validationSchema: yup.object().shape({
      businessType: yup.string().required("Please select a Business Type"),
      address: yup.string().required("Address is required"),
      aadharNo: yup
        .string()
        .matches(/^[0-9]{12}$/, "Aadhar No. must be 12 digits")
        .required("Aadhar No. is required"),
      gstNo: yup.string().required("GST No. is required"),
      registrationNumber: yup
        .string()
        .required("Registration Number is required"),
      tradeLicence: yup.string().required("Trade Licence is required"),
      panNo: yup.string().required("PAN No. is required"),
      cinNo: yup.string().required("CIN No. is required"),
      natureOfBusiness: yup.string().required("Nature of Business is required"),
      city: yup.string().required("City is required"),
      state: yup.string().required("State is required"),
      country: yup.string().required("Country is required"),
      pinCode: yup.string().required("Pin Code is required"),
      contactNo1: yup.string().required("Contact No. 1 is required"),
      website: yup.string().url("Invalid website URL"),
    }),
    onSubmit: async (values) => {
      const payload = {
        alias: values.alias,
        business_type: values.businessType,
        gst_tax_number: values.gstNo,
        registration_number: values.registrationNumber,
        trade_licence: values.tradeLicence,
        pan_number: values.panNo,
        cin_no: values.cinNo,
        natureOfBusiness: values.natureOfBusiness,
        address: `${values.address}, ${values.city}, ${values.state}, ${values.country}, ${values.pinCode}`,
        contact_numbers: {
          contactNo1: values.contactNo1,
          contactNo2: values.contactNo2,
          whatsappNo: values.whatsappNo,
        },
        website: values.website,
        adhara_no: values.aadharNo,
        toll_free_number: values.tollFreeNo,
      };

      try {
        if (id) {
          // Update existing business
          const response = await updateBusinessInfo(id, payload);
          console.log("Business Updated Successfully", response);

          // Success alert
          Swal.fire({
            icon: "success",
            title: "Business Info Updated Successfully",
            text: "The business information has been updated.",
            confirmButtonText: "OK",
          });
        } else {
          // Submit new business info
          const response = await submitBusinessInfo(payload);
          console.log("Business Submitted Successfully", response);

          // Success alert
          Swal.fire({
            icon: "success",
            title: "Business Info Submitted Successfully",
            text: "The new business information has been added.",
            confirmButtonText: "OK",
          });
        }
        formik.resetForm();
        navigate("/businessinfolist");
      } catch (error) {
        console.error("Form submission failed", error);

        // Error alert
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "There was an error submitting the form. Please try again later.",
          confirmButtonText: "OK",
        });
      }
    },
  });

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
                  <CardTitle tag="h4">Business Information</CardTitle>
                  <Form onSubmit={formik.handleSubmit} autoComplete="off">
                    <Row>
                      <Col sm="6">
                        <div className="mb-3">
                          <Label htmlFor="businessType">Business Type</Label>
                          <Select
                            id="businessType"
                            name="businessType"
                            options={businessTypes}
                            value={businessTypes.find(
                              (type) =>
                                type.value === formik.values.businessType
                            )}
                            onChange={(option) =>
                              formik.setFieldValue("businessType", option.value)
                            }
                          />
                          {formik.touched.businessType &&
                            formik.errors.businessType && (
                              <FormFeedback>
                                {formik.errors.businessType}
                              </FormFeedback>
                            )}
                        </div>
                      </Col>
                      <Col sm="6">
                        <div className="mb-3">
                          <Label htmlFor="address">Address</Label>
                          <Input
                            id="address"
                            name="address"
                            type="text"
                            placeholder="Enter Address"
                            value={formik.values.address}
                            onChange={formik.handleChange}
                            invalid={
                              formik.touched.address && formik.errors.address
                                ? true
                                : false
                            }
                          />
                          <FormFeedback>{formik.errors.address}</FormFeedback>
                        </div>
                      </Col>
                      <Col sm="6">
                        <div className="mb-3">
                          <Label htmlFor="gstNo">GST No.</Label>
                          <Input
                            id="gstNo"
                            name="gstNo"
                            type="text"
                            placeholder="Enter GST No."
                            value={formik.values.gstNo}
                            onChange={formik.handleChange}
                            invalid={
                              formik.touched.gstNo && formik.errors.gstNo
                                ? true
                                : false
                            }
                          />
                          <FormFeedback>{formik.errors.gstNo}</FormFeedback>
                        </div>
                      </Col>
                      <Col sm="6">
                        <div className="mb-3">
                          <Label htmlFor="registrationNumber">
                            Registration Number
                          </Label>
                          <Input
                            id="registrationNumber"
                            name="registrationNumber"
                            type="text"
                            placeholder="Enter Registration Number"
                            value={formik.values.registrationNumber}
                            onChange={formik.handleChange}
                            invalid={
                              formik.touched.registrationNumber &&
                              formik.errors.registrationNumber
                                ? true
                                : false
                            }
                          />
                          <FormFeedback>
                            {formik.errors.registrationNumber}
                          </FormFeedback>
                        </div>
                      </Col>
                      <Col sm="6">
                        <div className="mb-3">
                          <Label htmlFor="tradeLicence">Trade Licence</Label>
                          <Input
                            id="tradeLicence"
                            name="tradeLicence"
                            type="text"
                            placeholder="Enter Trade Licence"
                            value={formik.values.tradeLicence}
                            onChange={formik.handleChange}
                            invalid={
                              formik.touched.tradeLicence &&
                              formik.errors.tradeLicence
                                ? true
                                : false
                            }
                          />
                          <FormFeedback>
                            {formik.errors.tradeLicence}
                          </FormFeedback>
                        </div>
                      </Col>
                      <Col sm="6">
                        <div className="mb-3">
                          <Label htmlFor="panNo">PAN No.</Label>
                          <Input
                            id="panNo"
                            name="panNo"
                            type="text"
                            placeholder="Enter PAN No."
                            value={formik.values.panNo}
                            onChange={formik.handleChange}
                            invalid={
                              formik.touched.panNo && formik.errors.panNo
                                ? true
                                : false
                            }
                          />
                          <FormFeedback>{formik.errors.panNo}</FormFeedback>
                        </div>
                      </Col>
                      <Col sm="6">
                        <div className="mb-3">
                          <Label htmlFor="cinNo">CIN No.</Label>
                          <Input
                            id="cinNo"
                            name="cinNo"
                            type="text"
                            placeholder="Enter CIN No."
                            value={formik.values.cinNo}
                            onChange={formik.handleChange}
                            invalid={
                              formik.touched.cinNo && formik.errors.cinNo
                                ? true
                                : false
                            }
                          />
                          <FormFeedback>{formik.errors.cinNo}</FormFeedback>
                        </div>
                      </Col>
                      <Col sm="6">
                        <div className="mb-3">
                          <Label htmlFor="natureOfBusiness">
                            Nature of Business
                          </Label>
                          <Input
                            id="natureOfBusiness"
                            name="natureOfBusiness"
                            type="text"
                            placeholder="Enter Nature of Business"
                            value={formik.values.natureOfBusiness}
                            onChange={formik.handleChange}
                            invalid={
                              formik.touched.natureOfBusiness &&
                              formik.errors.natureOfBusiness
                                ? true
                                : false
                            }
                          />
                          <FormFeedback>
                            {formik.errors.natureOfBusiness}
                          </FormFeedback>
                        </div>
                      </Col>
                      <Col sm="6">
                        <div className="mb-3">
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            name="city"
                            type="text"
                            placeholder="Enter City"
                            value={formik.values.city}
                            onChange={formik.handleChange}
                            invalid={
                              formik.touched.city && formik.errors.city
                                ? true
                                : false
                            }
                          />
                          <FormFeedback>{formik.errors.city}</FormFeedback>
                        </div>
                      </Col>
                      <Col sm="6">
                        <div className="mb-3">
                          <Label htmlFor="state">State</Label>
                          <Input
                            id="state"
                            name="state"
                            type="text"
                            placeholder="Enter State"
                            value={formik.values.state}
                            onChange={formik.handleChange}
                            invalid={
                              formik.touched.state && formik.errors.state
                                ? true
                                : false
                            }
                          />
                          <FormFeedback>{formik.errors.state}</FormFeedback>
                        </div>
                      </Col>
                      <Col sm="6">
                        <div className="mb-3">
                          <Label htmlFor="country">Country</Label>
                          <Input
                            id="country"
                            name="country"
                            type="text"
                            placeholder="Enter Country"
                            value={formik.values.country}
                            onChange={formik.handleChange}
                            invalid={
                              formik.touched.country && formik.errors.country
                                ? true
                                : false
                            }
                          />
                          <FormFeedback>{formik.errors.country}</FormFeedback>
                        </div>
                      </Col>
                      <Col sm="6">
                        <div className="mb-3">
                          <Label htmlFor="pinCode">Pin Code</Label>
                          <Input
                            id="pinCode"
                            name="pinCode"
                            type="text"
                            placeholder="Enter Pin Code"
                            value={formik.values.pinCode}
                            onChange={formik.handleChange}
                            invalid={
                              formik.touched.pinCode && formik.errors.pinCode
                                ? true
                                : false
                            }
                          />
                          <FormFeedback>{formik.errors.pinCode}</FormFeedback>
                        </div>
                      </Col>
                      <Col sm="6">
                        <div className="mb-3">
                          <Label htmlFor="alias">Alias</Label>
                          <Input
                            id="alias"
                            name="alias"
                            type="text"
                            placeholder="Enter Alias"
                            value={formik.values.alias}
                            onChange={formik.handleChange}
                            invalid={
                              formik.touched.alias && formik.errors.alias
                                ? true
                                : false
                            }
                          />
                          <FormFeedback>{formik.errors.alias}</FormFeedback>
                        </div>
                      </Col>
                      <Col sm="6">
                        <div className="mb-3">
                          <Label htmlFor="contactNo1">Contact No. 1</Label>
                          <Input
                            id="contactNo1"
                            name="contactNo1"
                            type="text"
                            placeholder="Enter Contact No. 1"
                            value={formik.values.contactNo1}
                            onChange={formik.handleChange}
                            invalid={
                              formik.touched.contactNo1 &&
                              formik.errors.contactNo1
                                ? true
                                : false
                            }
                          />
                          <FormFeedback>
                            {formik.errors.contactNo1}
                          </FormFeedback>
                        </div>
                      </Col>
                      <Col sm="6">
                        <div className="mb-3">
                          <Label htmlFor="contactNo2">Contact No. 2</Label>
                          <Input
                            id="contactNo2"
                            name="contactNo2"
                            type="text"
                            placeholder="Enter Contact No. 2"
                            value={formik.values.contactNo2}
                            onChange={formik.handleChange}
                            invalid={
                              formik.touched.contactNo2 &&
                              formik.errors.contactNo2
                                ? true
                                : false
                            }
                          />
                          <FormFeedback>
                            {formik.errors.contactNo2}
                          </FormFeedback>
                        </div>
                      </Col>
                      <Col sm="6">
                        <div className="mb-3">
                          <Label htmlFor="tollFreeNo">Toll-Free No.</Label>
                          <Input
                            id="tollFreeNo"
                            name="tollFreeNo"
                            type="text"
                            placeholder="Enter Toll-Free No."
                            value={formik.values.tollFreeNo}
                            onChange={formik.handleChange}
                            invalid={
                              formik.touched.tollFreeNo &&
                              formik.errors.tollFreeNo
                                ? true
                                : false
                            }
                          />
                          <FormFeedback>
                            {formik.errors.tollFreeNo}
                          </FormFeedback>
                        </div>
                      </Col>
                      <Col sm="6">
                        <div className="mb-3">
                          <Label htmlFor="whatsappNo">WhatsApp No.</Label>
                          <Input
                            id="whatsappNo"
                            name="whatsappNo"
                            type="text"
                            placeholder="Enter WhatsApp No."
                            value={formik.values.whatsappNo}
                            onChange={formik.handleChange}
                            invalid={
                              formik.touched.whatsappNo &&
                              formik.errors.whatsappNo
                                ? true
                                : false
                            }
                          />
                          <FormFeedback>
                            {formik.errors.whatsappNo}
                          </FormFeedback>
                        </div>
                      </Col>
                      <Col sm="6">
                        <div className="mb-3">
                          <Label htmlFor="website">Website</Label>
                          <Input
                            id="website"
                            name="website"
                            type="text"
                            placeholder="Enter Website URL"
                            value={formik.values.website}
                            onChange={formik.handleChange}
                            invalid={
                              formik.touched.website && formik.errors.website
                                ? true
                                : false
                            }
                          />
                          <FormFeedback>{formik.errors.website}</FormFeedback>
                        </div>
                      </Col>
                      <Col sm="6">
                        <div className="mb-3">
                          <Label htmlFor="aadharNo">Aadhar No.</Label>
                          <Input
                            id="aadharNo"
                            name="aadharNo"
                            type="text"
                            placeholder="Enter Aadhar No."
                            value={formik.values.aadharNo}
                            onChange={formik.handleChange}
                            invalid={
                              formik.touched.aadharNo && formik.errors.aadharNo
                                ? true
                                : false
                            }
                          />
                          <FormFeedback>{formik.errors.aadharNo}</FormFeedback>
                        </div>
                      </Col>
                    </Row>
                    <div className="d-flex gap-3">
                      <Button type="submit" color="primary">
                        {id ? "Update" : "Submit"}
                      </Button>
                      <Button
                        type="button"
                        color="danger"
                        onClick={formik.resetForm}
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

export default BusinessInfo;
