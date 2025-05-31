import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { isEmpty } from "lodash";
import "bootstrap/dist/css/bootstrap.min.css";
import TableContainer from "../../../components/Common/TableContainer";
import * as Yup from "yup";
import { useFormik } from "formik";

import Breadcrumbs from "../../../components/Common/Breadcrumb";
import DeleteModal from "../../../components/Common/DeleteModal";

import {
  getJobList as onGetJobList,
  addNewJobList as onAddNewJobList,
  updateJobList as onUpdateJobList,
  deleteJobList as onDeleteJobList,
} from "/src/store/actions";

//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";

import { Col, Row, UncontrolledTooltip, Modal, ModalHeader, ModalBody, Form, Input, FormFeedback, Label, Card, CardBody, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Badge } from "reactstrap";
import Spinners from "../../../components/Common/Spinner";
import { ToastContainer } from "react-toastify";

const JobList = () => {
  //meta title
  document.title = "Jobs List | Skote - Vite React Admin & Dashboard Template";

  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [job, setJob] = useState(null);

  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      jobId: (job && job.jobId) || "",
      jobTitle: (job && job.jobTitle) || "",
      companyName: (job && job.companyName) || "",
      location: (job && job.location) || "",
      experience: (job && job.experience) || "",
      position: (job && job.position) || "",
      type: (job && job.type) || "Full Time",
      status: (job && job.status) || "Active",
    },
    validationSchema: Yup.object({
      jobId: Yup.string()
        .required("Please Enter Valid Job Id")
        .required("Please Enter Your Job Id"),
      jobTitle: Yup.string().required("Please Enter Your Job Title"),
      companyName: Yup.string().required("Please Enter Your Company Name"),
      location: Yup.string().required("Please Enter Your Location"),
      experience: Yup.string().required("Please Enter Your Experience"),
      position: Yup.string().required("Please Enter Your Position"),
      type: Yup.string().required("Please Enter Your Type"),
      status: Yup.string().required("Please Enter Your Status"),
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updateJobList = {
          id: job ? job.id : 0,
          jobId: values.jobId,
          jobTitle: values.jobTitle,
          companyName: values.companyName,
          location: values.location,
          experience: values.experience,
          position: values.position,
          type: values.type,
          postedDate: "02 June 2021",
          lastDate: "25 June 2021",
          status: values.status,
        };
        // update Job
        dispatch(onUpdateJobList(updateJobList));
        validation.resetForm();
      } else {
        const newJobList = {
          id: Math.floor(Math.random() * (30 - 20)) + 20,
          jobId: values["jobId"],
          jobTitle: values["jobTitle"],
          companyName: values["companyName"],
          location: values["location"],
          experience: values["experience"],
          position: values["position"],
          type: values["type"],
          postedDate: "02 June 2021",
          lastDate: "25 June 2021",
          status: values["status"],
        };
        // save new Job
        dispatch(onAddNewJobList(newJobList));
        validation.resetForm();
      }
      toggle();
    },
  });

  const dispatch = useDispatch();

  const JobsJobsProperties = createSelector(
    (state) => state.JobReducer,
    (jobReducer) => ({
      jobs: jobReducer.jobs,
      loading: jobReducer.loading
    })
  );

  const { jobs, loading } = useSelector(JobsJobsProperties);
  const [isLoading, setLoading] = useState(loading)

  useEffect(() => {
    if (jobs && !jobs.length) {
      dispatch(onGetJobList());
    }
  }, [dispatch, jobs]);

  useEffect(() => {
    if (!isEmpty(jobs) && !!isEdit) {
      setIsEdit(false);
    }
  }, [jobs]);

  const toggle = () => {
    if (modal) {
      setModal(false);
      setJob(null);
    } else {
      setModal(true);
    }
  };

  const handleJobClick = (arg) => {
    const job = arg;
    setJob({
      id: job.id,
      jobId: job.jobId,
      jobTitle: job.jobTitle,
      companyName: job.companyName,
      location: job.location,
      experience: job.experience,
      position: job.position,
      type: job.type,
      status: job.status,
    });

    setIsEdit(true);

    toggle();
  };

  //delete Job
  const [deleteModal, setDeleteModal] = useState(false);

  const onClickDelete = (job) => {
    setJob(job);
    setDeleteModal(true);
  };

  const handleDeletejob = () => {
    if (job && job.id) {
      dispatch(onDeleteJobList(job.id));
      setDeleteModal(false);
      setJob("")
    }
  };

  const columns = useMemo(
    () => [
      {
        header: 'No',
        accessorKey: "id",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return <Link to="#" className="text-body fw-bold">{cellProps.row.original.id}</Link>
        }
      },
      {
        header: "Job Title",
        accessorKey: "jobTitle",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: 'Company Name',
        accessorKey: "companyName",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: 'Location',
        enableColumnFilter: false,
        enableSorting: true,
        accessorKey: "location"
      },
      {
        header: 'Experience',
        enableColumnFilter: false,
        enableSorting: true,
        accessorKey: "experience"
      },
      {
        header: 'Position',
        enableColumnFilter: false,
        enableSorting: true,
        accessorKey: "position"
      },
      {
        header: "Type",
        accessorKey: "type",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          switch (cellProps.row.original.type) {
            case "Full Time":
              return <span className="badge badge-soft-success">Full Time</span>;
            case "Part Time":
              return <span className="badge badge-soft-danger">Part Time</span>;
            case "Freelance":
              return <span className="badge badge-soft-info">Freelance</span>;
            default:
              return <span className="badge badge-soft-warning">Internship</span>;
          }
        },
      },
      {
        header: 'Posted Date',
        enableColumnFilter: false,
        enableSorting: true,
        accessorKey: "postedDate"
      },
      {
        header: 'Last Date',
        enableColumnFilter: false,
        enableSorting: true,
        accessorKey: "lastDate"
      },
      {
        header: 'Status',
        accessorKey: "status",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          switch (cellProps.row.original.status) {
            case "Active":
              return <Badge className="bg-success">Active</Badge>
            case "New":
              return <Badge className="bg-info">New</Badge>
            case "Close":
              return <Badge className="bg-danger">Close</Badge>
          }
        }
      },
      {
        header: 'Action',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <ul className="list-unstyled hstack gap-1 mb-0">
              <li data-bs-toggle="tooltip" data-bs-placement="top" title="View">
                <Link to="/job-details" className="btn btn-sm btn-soft-primary" id={`viewtooltip-${cellProps.row.original.id}`}>
                  <i className="mdi mdi-eye-outline" />
                </Link>
              </li>
              <UncontrolledTooltip placement="top" target={`viewtooltip-${cellProps.row.original.id}`}>
                View
              </UncontrolledTooltip>

              <li>
                <Link
                  to="#"
                  className="btn btn-sm btn-soft-info"
                  onClick={() => {
                    const jobData = cellProps.row.original;
                    handleJobClick(jobData);
                  }}
                  id={`edittooltip-${cellProps.row.original.id}`}
                >
                  <i className="mdi mdi-pencil-outline" />
                  <UncontrolledTooltip placement="top" target={`edittooltip-${cellProps.row.original.id}`} >
                    Edit
                  </UncontrolledTooltip>
                </Link>
              </li>

              <li>
                <Link
                  to="#"
                  className="btn btn-sm btn-soft-danger"
                  onClick={() => {
                    const jobData = cellProps.row.original;
                    onClickDelete(jobData);
                  }}
                  id={`deletetooltip-${cellProps.row.original.id}`}
                >
                  <i className="mdi mdi-delete-outline" />
                  <UncontrolledTooltip placement="top" target={`deletetooltip-${cellProps.row.original.id}`}>
                    Delete
                  </UncontrolledTooltip>
                </Link>
              </li>
            </ul>
          );
        }
      },
    ],
    []
  );

  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeletejob}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Jobs" breadcrumbItem="Jobs Lists" />
          {
            isLoading ? <Spinners setLoading={setLoading} />
              :

              <Row>
                <Col lg="12">
                  <Card>
                    <CardBody className="border-bottom">
                      <div className="d-flex align-items-center">
                        <h5 className="mb-0 card-title flex-grow-1">Jobs Lists</h5>
                        <div className="flex-shrink-0">
                          <Link
                            to="#!"
                            onClick={() => setModal(true)}
                            className="btn btn-primary me-1"
                          >
                            Add New Job
                          </Link>
                          <Link to="#!" className="btn btn-light me-1">
                            <i className="mdi mdi-refresh"></i>
                          </Link>
                          <UncontrolledDropdown className="dropdown d-inline-block me-1">
                            <DropdownToggle
                              type="menu"
                              className="btn btn-success"
                              id="dropdownMenuButton1"
                            >
                              <i className="mdi mdi-dots-vertical"></i>
                            </DropdownToggle>
                            <DropdownMenu>
                              <li>
                                <DropdownItem href="#">Action</DropdownItem>
                              </li>
                              <li>
                                <DropdownItem href="#">Another action</DropdownItem>
                              </li>
                              <li>
                                <DropdownItem href="#">
                                  Something else here
                                </DropdownItem>
                              </li>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </div>
                      </div>
                    </CardBody>
                    <CardBody>

                      <TableContainer
                        columns={columns}
                        data={jobs || []}
                        isCustomPageSize={true}
                        isGlobalFilter={true}
                        isJobListGlobalFilter={true}
                        isPagination={true}
                        SearchPlaceholder="Search for ..."
                        tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline mt-4 border-top"
                        pagination="pagination"
                        paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
                      />
                    </CardBody>
                  </Card>
                </Col>
              </Row>
          }
          <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle} tag="h4">
              {!!isEdit ? "Edit Job" : "Add Job"}
            </ModalHeader>
            <ModalBody>
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                  return false;
                }}
              >
                <Row>
                  <Col className="col-12">
                    <div className="mb-3">
                      <Label className="form-label"> Job Id</Label>
                      <Input
                        name="jobId"
                        type="text"
                        placeholder="Insert Job Id"
                        validate={{
                          required: { value: true },
                        }}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.jobId || ""}
                        invalid={
                          validation.touched.jobId && validation.errors.jobId
                            ? true
                            : false
                        }
                      />
                      {validation.touched.jobId && validation.errors.jobId ? (
                        <FormFeedback type="invalid">
                          {validation.errors.jobId}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="mb-3">
                      <Label className="form-label">Job Title</Label>
                      <Input
                        name="jobTitle"
                        type="text"
                        placeholder="Insert Job Title"
                        validate={{
                          required: { value: true },
                        }}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.jobTitle || ""}
                        invalid={
                          validation.touched.jobTitle &&
                            validation.errors.jobTitle
                            ? true
                            : false
                        }
                      />
                      {validation.touched.jobTitle &&
                        validation.errors.jobTitle ? (
                        <FormFeedback type="invalid">
                          {validation.errors.jobTitle}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="mb-3">
                      <Label className="form-label">Company Name</Label>
                      <Input
                        name="companyName"
                        type="text"
                        placeholder="Insert Company Name"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.companyName || ""}
                        invalid={
                          validation.touched.companyName &&
                            validation.errors.companyName
                            ? true
                            : false
                        }
                      />
                      {validation.touched.companyName &&
                        validation.errors.companyName ? (
                        <FormFeedback type="invalid">
                          {validation.errors.companyName}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="mb-3">
                      <Label className="form-label">Location</Label>
                      <Input
                        name="location"
                        type="text"
                        placeholder="Insert Location"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.location || ""}
                        invalid={
                          validation.touched.location &&
                            validation.errors.location
                            ? true
                            : false
                        }
                      />
                      {validation.touched.location &&
                        validation.errors.location ? (
                        <FormFeedback type="invalid">
                          {validation.errors.location}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="mb-3">
                      <Label className="form-label">Experience</Label>
                      <Input
                        name="experience"
                        type="text"
                        placeholder="Insert Experience"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.experience || ""}
                        invalid={
                          validation.touched.experience &&
                            validation.errors.experience
                            ? true
                            : false
                        }
                      />
                      {validation.touched.experience &&
                        validation.errors.experience ? (
                        <FormFeedback type="invalid">
                          {validation.errors.experience}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="mb-3">
                      <Label className="form-label">Position</Label>
                      <Input
                        name="position"
                        type="text"
                        placeholder="Insert Position"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.position || ""}
                        invalid={
                          validation.touched.position &&
                            validation.errors.position
                            ? true
                            : false
                        }
                      />
                      {validation.touched.position &&
                        validation.errors.position ? (
                        <FormFeedback type="invalid">
                          {validation.errors.position}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="mb-3">
                      <Label className="form-label">Type</Label>
                      <Input
                        name="type"
                        type="select"
                        className="form-select"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.type || ""}
                        invalid={
                          validation.touched.type && validation.errors.type
                            ? true
                            : false
                        }
                      >
                        <option>Full Time</option>
                        <option>Part Time</option>
                        <option>Freelance</option>
                        <option>Internship</option>
                      </Input>
                      {validation.touched.type && validation.errors.type ? (
                        <FormFeedback type="invalid">
                          {validation.errors.type}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="mb-3">
                      <Label className="form-label">Status</Label>
                      <Input
                        name="status"
                        type="select"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.status || ""}
                        invalid={
                          validation.touched.status && validation.errors.status
                            ? true
                            : false
                        }
                      >
                        <option>Active</option>
                        <option>New</option>
                        <option>Close</option>
                      </Input>
                      {validation.touched.status && validation.errors.status ? (
                        <FormFeedback status="invalid">
                          {validation.errors.status}
                        </FormFeedback>
                      ) : null}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="text-end">
                      <button
                        type="submit"
                        className="btn btn-success save-user"
                      >
                        Save
                      </button>
                    </div>
                  </Col>
                </Row>
              </Form>
            </ModalBody>
          </Modal>
        </div>
      </div>
      <ToastContainer />
    </React.Fragment>
  );
}

// export default JobList;
export default JobList
