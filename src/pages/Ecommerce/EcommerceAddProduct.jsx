import React, { useState } from "react"
import { Button, Card, CardBody, CardTitle, Col, Container, Form, Input, Label, Row, FormFeedback } from "reactstrap";
import Dropzone from "react-dropzone";
import * as yup from "yup";
import { useFormik } from "formik";
import Select from "react-select"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

const EcommerenceAddProduct = () => {

  //meta title
  document.title = "Add Product | Skote - Vite React Admin & Dashboard Template";

  const [selectedFiles, setselectedFiles] = useState([])

  const options = [
    { value: "AK", label: "Alaska" },
    { value: "HI", label: "Hawaii" },
    { value: "CA", label: "California" },
    { value: "NV", label: "Nevada" },
    { value: "OR", label: "Oregon" },
    { value: "WA", label: "Washington" },
  ]

  const CategoryOptions = [
    { value: 'FA', label: 'Fashion' },
    { value: 'EL', label: 'Electronic' },
  ]
  function handleAcceptedFiles(files) {
    files.map(file =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    )

    setselectedFiles(files)
  }

  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
  }

  const formik = useFormik({
    initialValues: {
      productname: '',
      manufacturername: '',
      manufacturerbrand: '',
      price: '',
      category: '',
      productdesc: '',
      features: [],
    },
    validationSchema: yup.object().shape({
      productname: yup.string().required('Please Enter Your Product Name'),
      manufacturername: yup.string().required('Please Enter Your Manufacturer Name'),
      manufacturerbrand: yup.string().required('Please Enter Your Manufacturer Brand'),
      price: yup.number().required('Please Enter Your Price'),
      category: yup.string().required('Please Enter Your Category'),
      features: yup.array().min(1, 'Please select at least one Features'),
      productdesc: yup.string().required('Please Enter Your Product Description'),
    }),
    onSubmit: (values) => {
      formik.resetForm();
    },
  });

  //Meta Data
  const metaData = useFormik({
    initialValues: {
      productname: '',
      manufacturername: '',
      metadescription: ''
    },
    validationSchema: yup.object().shape({
      productname: yup.string().required('Please Enter Your Product Name'),
      manufacturername: yup.string().required('Please Enter Your Manufacturer Name'),
      metadescription: yup.string().required('Please Enter Your Meta Description')
    }),
    onSubmit: (values) => {
      metaData.resetForm();
    },
  })

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs title="Ecommerce" breadcrumbItem="Add Product" />

          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
                  <CardTitle tag="h4">Basic Information</CardTitle>
                  <p className="card-title-desc mb-4">
                    Fill all information below
                  </p>

                  <Form onSubmit={formik.handleSubmit} autoComplete="off">
                    <Row>
                      <Col sm="6">
                        <div className="mb-3">
                          <Label htmlFor="productname">Product Name</Label>
                          <Input
                            id="productname"
                            name="productname"
                            type="text"
                            placeholder="Product Name"
                            value={formik.values.productname}
                            onChange={formik.handleChange}
                            invalid={
                              formik.touched.productname && formik.errors.productname ? true : false
                            }
                          />
                          {formik.errors.productname && formik.touched.productname ? (
                            <FormFeedback type="invalid">{formik.errors.productname}</FormFeedback>
                          ) : null}
                        </div>
                        <div className="mb-3">
                          <Label htmlFor="manufacturername"> Manufacturer Name </Label>
                          <Input
                            id="manufacturername"
                            name="manufacturername"
                            type="text"
                            placeholder="Manufacturer Name"
                            value={formik.values.manufacturername}
                            onChange={formik.handleChange}
                            invalid={
                              formik.touched.manufacturername && formik.errors.manufacturername ? true : false
                            }
                          />
                          {formik.errors.manufacturername && formik.touched.manufacturername ? (
                            <FormFeedback type="invalid">{formik.errors.manufacturername}</FormFeedback>
                          ) : null}
                        </div>
                        <div className="mb-3">
                          <Label htmlFor="manufacturerbrand"> Manufacturer Brand </Label>
                          <Input
                            id="manufacturerbrand"
                            name="manufacturerbrand"
                            type="text"
                            placeholder="Manufacturer Brand"
                            value={formik.values.manufacturerbrand}
                            onChange={formik.handleChange}
                            invalid={
                              formik.touched.manufacturerbrand && formik.errors.manufacturerbrand ? true : false
                            }
                          />
                          {formik.errors.manufacturerbrand && formik.touched.manufacturerbrand ? (
                            <FormFeedback type="invalid">{formik.errors.manufacturerbrand}</FormFeedback>
                          ) : null}
                        </div>
                        <div className="mb-3">
                          <Label htmlFor="price">Price</Label>
                          <Input
                            id="price"
                            name="price"
                            type="number"
                            placeholder="Price"
                            value={formik.values.price}
                            onChange={formik.handleChange}
                            invalid={
                              formik.touched.price && formik.errors.price ? true : false
                            }
                          />
                          {formik.errors.price && formik.touched.price ? (
                            <FormFeedback type="invalid">{formik.errors.price}</FormFeedback>
                          ) : null}
                        </div>
                      </Col>

                      <Col sm="6">
                        <div className="mb-3">
                          <div className="control-label" style={{ marginBottom: "0.5rem" }}>Category</div>

                          <Select name="category" options={CategoryOptions} className="select2"
                            value={CategoryOptions.find((option) => option.value === formik.values.category)}
                            onChange={(selectedOption) => formik.setFieldValue("category", selectedOption.value)} />
                          {formik.errors.category && formik.touched.category ? (
                            <span className="text-danger">{formik.errors.category}</span>
                          ) : null}
                        </div>
                        <div className="mb-3">
                          <div className="control-label" style={{ marginBottom: "0.5rem" }}>Features</div>
                          <Select classNamePrefix="select2-selection" name="features" placeholder="Choose..." options={options} isMulti
                            value={options.filter((option) =>
                              formik.values.features.includes(option.value)
                            )}
                            onChange={(selectedOptions) =>
                              formik.setFieldValue(
                                "features",
                                selectedOptions.map((option) => option.value)
                              )
                            } />
                          {formik.errors.features && formik.touched.features ? (
                            <span className="text-danger">{formik.errors.features}</span>
                          ) : null}
                        </div>
                        <div className="mb-3">
                          <Label htmlFor="productdesc"> Product Description</Label>
                          <Input
                            tag="textarea"
                            className="mb-3"
                            id="productdesc"
                            name="productdesc"
                            rows={5}
                            placeholder="Product Description"
                            value={formik.values.productdesc}
                            onChange={formik.handleChange}
                            invalid={
                              formik.touched.productdesc && formik.errors.productdesc ? true : false
                            }
                          />
                          {formik.errors.productdesc && formik.touched.productdesc ? (
                            <FormFeedback type="invalid">{formik.errors.productdesc}</FormFeedback>
                          ) : null}
                        </div>
                      </Col>
                    </Row>
                    <div className="d-flex flex-wrap gap-2">
                      <Button type="submit" color="primary"> Save Changes  </Button>
                      <Button type="button" color="secondary" onClick={() => formik.resetForm()}> Cancel</Button>
                    </div>
                  </Form>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <CardTitle className="mb-3">Product Images</CardTitle>
                  <Form>
                    <Dropzone
                      onDrop={(acceptedFiles) => {
                        handleAcceptedFiles(acceptedFiles)
                      }}
                    >
                      {({ getRootProps, getInputProps }) => (
                        <div className="dropzone">
                          <div
                            className="dz-message needsclick"
                            {...getRootProps()}
                          >
                            <input {...getInputProps()} />
                            <div className="dz-message needsclick">
                              <div className="mb-3">
                                <i className="display-4 text-muted bx bxs-cloud-upload" />
                              </div>
                              <h4>Drop files here or click to upload.</h4>
                            </div>
                          </div>
                        </div>
                      )}
                    </Dropzone>
                    <ul className="list-unstyled mb-0" id="file-previews">
                      {selectedFiles.map((file, index) => {
                        return (
                          <li className="mt-2 dz-image-preview" key=''>
                            <div className="border rounded">
                              <div className="d-flex flex-wrap gap-2 p-2">
                                <div className="flex-shrink-0 me-3">
                                  <div className="avatar-sm bg-light rounded p-2">
                                    <img data-dz-thumbnail="" className="img-fluid rounded d-block" src={file.preview} alt={file.name} />
                                  </div>
                                </div>
                                <div className="flex-grow-1">
                                  <div className="pt-1">
                                    <h5 className="fs-md mb-1" data-dz-name>{file.path}</h5>
                                    <strong className="error text-danger" data-dz-errormessage></strong>
                                  </div>
                                </div>
                                <div className="flex-shrink-0 ms-3">
                                  <Button color="danger" size="sm"
                                    onClick={() => {
                                      const newImages = [...selectedFiles];
                                      newImages.splice(index, 1);
                                      setselectedFiles(newImages);
                                    }}>
                                    Delete</Button>
                                </div>
                              </div>
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  </Form>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <CardTitle tag="h4">Meta Data</CardTitle>
                  <p className="card-title-desc mb-3">
                    Fill all information below
                  </p>

                  <Form onSubmit={metaData.handleSubmit} autoComplete="off">
                    <Row>
                      <Col sm={6}>
                        <div className="mb-3">
                          <Label htmlFor="metatitle">Meta title</Label>
                          <Input
                            id="metatitle"
                            name="productname"
                            type="text"
                            placeholder="Metatitle"
                            value={metaData.values.productname}
                            onChange={metaData.handleChange}
                            invalid={
                              metaData.touched.productname && metaData.errors.productname ? true : false
                            }
                          />
                          {metaData.errors.productname && metaData.touched.productname ? (
                            <FormFeedback type="invalid">{metaData.errors.productname}</FormFeedback>
                          ) : null}
                        </div>
                        <div className="mb-3">
                          <Label htmlFor="metakeywords">Meta Keywords</Label>
                          <Input
                            id="metakeywords"
                            name="manufacturername"
                            type="text"
                            placeholder="Meta Keywords"
                            value={metaData.values.manufacturername}
                            onChange={metaData.handleChange}
                            invalid={
                              metaData.touched.manufacturername && metaData.errors.manufacturername ? true : false
                            }
                          />
                          {metaData.errors.manufacturername && metaData.touched.manufacturername ? (
                            <FormFeedback type="invalid">{metaData.errors.manufacturername}</FormFeedback>
                          ) : null}
                        </div>
                      </Col>

                      <Col sm={6}>
                        <div className="mb-3">
                          <Label htmlFor="metadescription">Meta Description  </Label>
                          <Input
                            name="metadescription"
                            tag="textarea"
                            id="metadescription"
                            rows={5}
                            placeholder="Meta Description"
                            value={metaData.values.metadescription}
                            onChange={metaData.handleChange}
                            invalid={
                              metaData.touched.metadescription && metaData.errors.metadescription ? true : false
                            }
                          />
                          {metaData.errors.metadescription && metaData.touched.metadescription ? (
                            <FormFeedback type="invalid">{metaData.errors.metadescription}</FormFeedback>
                          ) : null}
                        </div>
                      </Col>
                    </Row>
                    <div className="d-flex flex-wrap gap-2">
                      <Button type="submit" className="waves-effect waves-light" color="primary">Save Changes  </Button>
                      <Button type="button" className="waves-effect waves-light" color="secondary" onClick={() => metaData.resetForm()}> Cancel</Button>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default EcommerenceAddProduct
