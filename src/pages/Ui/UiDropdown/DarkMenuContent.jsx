import React from "react";
import { Card, CardBody, CardTitle, Col, DropdownItem, DropdownMenu, DropdownToggle, Form, Input, Label, Row, UncontrolledDropdown } from "reactstrap";

const DarkMenuContent = () => {
    return (
        <React.Fragment>
            <Row>
                <Col xl={6}>
                    <Card>
                        <CardBody>
                            <CardTitle className="card-title">Menu Content</CardTitle>
                            <p className="card-title-desc">Example of dropdown menu Headers, Text, Forms content</p>

                            <div className="d-flex flex-wrap gap-2">
                                <UncontrolledDropdown
                                >
                                    <DropdownToggle color="primary" type="button">
                                        Header <i className="mdi mdi-chevron-down"></i>
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <div className="dropdown-header noti-title">
                                            <h5 className="font-size-13 text-muted text-truncate mn-0">Welcome Jessie!</h5>
                                        </div>
                                        <DropdownItem href="#">Action</DropdownItem>
                                        <DropdownItem href="#">Another action</DropdownItem>
                                        <DropdownItem href="#">Something else here</DropdownItem>
                                        <div className="dropdown-divider"></div>
                                        <DropdownItem href="#">Separated link</DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown>

                                <UncontrolledDropdown>
                                    <DropdownToggle type="button" className="btn btn-success">
                                        Text <i className="mdi mdi-chevron-down"></i>
                                    </DropdownToggle>
                                    <DropdownMenu className="dropdown-menu-md p-3">
                                        <p>
                                            Some example text that's free-flowing within the dropdown menu.
                                        </p>
                                        <p className="mb-0">
                                            And this is more example text.
                                        </p>
                                    </DropdownMenu>
                                </UncontrolledDropdown>

                                <UncontrolledDropdown>
                                    <DropdownToggle type="button" className="btn btn-light">
                                        Forms <i className="mdi mdi-chevron-down"></i>
                                    </DropdownToggle>
                                    <DropdownMenu className="dropdown-menu-md p-4">
                                        <Form>
                                            <div className="mb-2">
                                                <Label className="form-label" htmlFor="exampleDropdownFormEmail">Email address</Label>
                                                <Input type="email" className="form-control" id="exampleDropdownFormEmail" placeholder="email@example.com" />
                                            </div>
                                            <div className="mb-2">
                                                <Label className="form-label" htmlFor="exampleDropdownFormPassword">Password</Label>
                                                <Input type="password" className="form-control" id="exampleDropdownFormPassword" placeholder="Password" />
                                            </div>
                                            <div className="mb-2">
                                                <div className="form-check custom-checkbox">
                                                    <Input type="checkbox" className="form-check-input" id="rememberdropdownCheck" />
                                                    <Label className="form-check-label" htmlFor="rememberdropdownCheck">Remember me</Label>
                                                </div>
                                            </div>
                                            <button type="submit" className="btn btn-primary">Sign in</button>
                                        </Form>
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                            </div>
                        </CardBody>
                    </Card>
                </Col>

                <Col xl={6}>
                    <Card>
                        <CardBody>
                            <CardTitle>Dropdown Menu Dark</CardTitle>
                            <p className="card-title-desc">Opt into darker dropdowns to match a dark navbar or custom style by adding <code>.dropdown-menu-dark</code> onto an existing <code>.dropdown-menu</code>. No changes are required to the dropdown items.</p>

                            <UncontrolledDropdown>
                                <DropdownToggle type="button" className="btn btn-secondary">
                                    Menu is right-aligned <i className="mdi mdi-chevron-down"></i>
                                </DropdownToggle>
                                <DropdownMenu className="dropdown-menu-dark">
                                    <DropdownItem href="#">Action</DropdownItem>
                                    <DropdownItem href="#">Another action</DropdownItem>
                                    <DropdownItem href="#">Something else here</DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    );
}

export default DarkMenuContent;