import React, { useState } from 'react';
import { Card, CardBody, Col, Collapse, Row, Form, Label, Input } from 'reactstrap';
// flatpickr
import "flatpickr/dist/themes/material_blue.css";
import FlatPickr from "react-flatpickr";

import { experienceData, jobType } from '../../../common/data';

const JobFilter = ({ jobData, setJobGrid }) => {
    const [selectDate, setSelectDate] = useState();
    const dateChange = (date) => {
        setSelectDate(date)
    };
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);;

    const handleSearch = (ele) => {
        let search = ele.target.value;
        if (search) {
            setJobGrid(jobData?.filter((data) => data.title.toLowerCase()?.includes(search)))
        } else {
            setJobGrid(jobData)
        }
    }

    const handleSearchLocation = (ele) => {
        let search = ele.target.value;
        if (search) {
            setJobGrid(jobData?.filter((data) => data.location.toLowerCase()?.includes(search)))
        } else {
            setJobGrid(jobData)
        }
    }
    const handleSearchName = (ele) => {
        let search = ele.target.value;
        if (search) {
            setJobGrid(jobData?.filter((data) => data.companyName.toLowerCase()?.includes(search)))
        } else {
            setJobGrid(jobData)
        }
    }


    return (
        <React.Fragment>
            <Row>
                <Col lg={12}>
                    <Card className="job-filter">
                        <CardBody>
                            <Form>
                                <Row className="g-3">
                                    <Col xxl={4} lg={4}>
                                        <div className="position-relative">
                                            <Input type="text" className="form-control" id="searchJob" placeholder="Search your job" onChange={handleSearch} />
                                        </div>
                                    </Col>

                                    <Col xxl={2} lg={4}>
                                        <div className="position-relative">
                                            <Input type="text" className="form-control" id="locationInput" placeholder="San Francisco, LA" onChange={handleSearchLocation} />
                                        </div>
                                    </Col>

                                    <Col xxl={2} lg={4}>
                                        <div className="position-relative">
                                            <Input type="text" className="form-control" id="jobCategories" placeholder="Job Categories" onChange={handleSearchName} />
                                        </div>
                                    </Col>

                                    <Col xxl={2} lg={6}>
                                        <div className="position-relative">
                                            <div id="datepicker1">
                                                <FlatPickr
                                                    className="form-control"
                                                    placeholder="Select time"
                                                    options={{
                                                        dateFormat: "d M,Y"
                                                    }}
                                                    selected={selectDate}
                                                    onChange={dateChange}
                                                />
                                            </div>
                                        </div>
                                    </Col>

                                    <Col xxl={2} lg={6}>
                                        <div className="position-relative h-100 hstack gap-3">
                                            <button type="button" className="btn btn-primary h-100 w-100"><i className="bx bx-search-alt align-middle"></i> Find Jobs</button>
                                            <a href="#" onClick={toggle} className="btn btn-secondary h-100 w-100">
                                                <i className="bx bx-filter-alt align-middle"></i> Advance</a>
                                        </div>
                                    </Col>

                                    <Collapse isOpen={isOpen} id="collapseExample">
                                        <div>
                                            <Row className="g-3">
                                                <Col xxl={4} lg={6}>
                                                    <div>
                                                        <Label htmlFor="experience" className="form-label fw-semibold">Experience</Label>
                                                    </div>
                                                    {
                                                        (experienceData || []).map((item, index) => (
                                                            <div className="form-check form-check-inline" key={index}>
                                                                <Input className="form-check-input" type="checkbox" id={`inlineCheckbox${item.id}`} value={item.value} />
                                                                <Label className="form-check-label" htmlFor={`inlineCheckbox${item.id}`}>{item.label}</Label>
                                                            </div>
                                                        ))
                                                    }
                                                </Col>
                                                <Col xxl={4} lg={6}>
                                                    <div>
                                                        <Label htmlFor="jobType" className="form-label fw-semibold">Job Type</Label>
                                                    </div>
                                                    {
                                                        (jobType || []).map((item, index) => (
                                                            <div className="form-check form-check-inline" key={index}>
                                                                <Input type="checkbox" id={`inlineCheckbox${item.id}`} value={item.value} />
                                                                <Label className="form-check-label" htmlFor={`inlineCheckbox${item.id}`}>{item.label}</Label>
                                                            </div>
                                                        ))
                                                    }
                                                </Col>
                                                <Col xxl={4} lg={4}>
                                                    <div className="position-relative">
                                                        <Label htmlFor="qualificationInput" className="fw-semibold">Qualification</Label>
                                                        <Input type="text" id="qualificationInput" autoComplete="off" placeholder="Qualification" />
                                                        <i className="ri-government-line filter-icon"></i>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                    </Collapse>
                                </Row>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    );
}

export default JobFilter;