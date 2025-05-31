import React from "react";
import { Card, CardBody, CardTitle, Col, DropdownItem, DropdownMenu, DropdownToggle, Row, UncontrolledDropdown } from "reactstrap";

const CloseMenuAlignment = () => {
    return (
        <React.Fragment>
            <Row>
                <Col xl={6}>
                    <Card>
                        <CardBody>
                            <CardTitle>Menu Alignment</CardTitle>
                            <p className="card-title-desc">
                                Add{" "}
                                <code className="highlighter-rouge">
                                    .dropdown-menu-end
                                </code>{" "}
                                to a{" "}
                                <code className="highlighter-rouge">.dropdown-menu</code> to
                                right align the dropdown menu.
                            </p>
                            <div className="d-flex flex-wrap gap-3">
                                <UncontrolledDropdown>
                                    <DropdownToggle type="button" className="btn btn-secondary">
                                        Right-aligned menu example  <i className="mdi mdi-chevron-down"></i>
                                    </DropdownToggle>
                                    <DropdownMenu className="dropdown-menu-end">
                                        <DropdownItem href="#">Action</DropdownItem>
                                        <DropdownItem href="#">Another action</DropdownItem>
                                        <DropdownItem href="#">Something else here</DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown>

                                <UncontrolledDropdown>
                                    <DropdownToggle type="button" className="btn btn-secondary">
                                        Left-aligned but right aligned when large screen <i className="mdi mdi-chevron-down"></i>
                                    </DropdownToggle>
                                    <DropdownMenu className="dropdown-menu-lg-end">
                                        <DropdownItem href="#">Action</DropdownItem>
                                        <DropdownItem href="#">Another action</DropdownItem>
                                        <DropdownItem href="#">Something else here</DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown>


                                <UncontrolledDropdown>
                                    <DropdownToggle type="button" className="btn btn-secondary">
                                        Right-aligned but left aligned when large screen <i className="mdi mdi-chevron-down"></i>
                                    </DropdownToggle>
                                    <DropdownMenu className="dropdown-menu-lg-start">
                                        <DropdownItem href="#">Action</DropdownItem>
                                        <DropdownItem href="#">Another action</DropdownItem>
                                        <DropdownItem href="#">Something else Header</DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                            </div>
                        </CardBody>
                    </Card>
                </Col>

                <Col xl={6}>
                    <Card>
                        <CardBody>

                            <CardTitle className="card-title">Auto Close Behavior</CardTitle>
                            <p className="card-title-desc">By default, the dropdown menu is closed when clicking inside or outside the dropdown menu. You can use the <code>autoClose</code> option to change this behavior of the dropdown.</p>

                            <div className="d-flex gap-2 flex-wrap">
                                <UncontrolledDropdown>
                                    <DropdownToggle className="btn btn-secondary" type="button" id="defaultDropdown">
                                        Default dropdown <i className="mdi mdi-chevron-down"></i>
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem href="#">Menu item</DropdownItem>
                                        <DropdownItem href="#">Menu item</DropdownItem>
                                        <DropdownItem href="#">Menu item</DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown>

                                <UncontrolledDropdown>
                                    <DropdownToggle className="btn btn-secondary" type="button" id="dropdownMenuClickableOutside">
                                        Clickable outside <i className="mdi mdi-chevron-down"></i>
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem href="#">Menu item</DropdownItem>
                                        <DropdownItem href="#">Menu item</DropdownItem>
                                        <DropdownItem href="#">Menu item</DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown>

                                <UncontrolledDropdown>
                                    <DropdownToggle className="btn btn-secondary" type="button" id="dropdownMenuClickableInside">
                                        Clickable inside <i className="mdi mdi-chevron-down"></i>
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem href="#">Menu item</DropdownItem>
                                        <DropdownItem href="#">Menu item</DropdownItem>
                                        <DropdownItem href="#">Menu item</DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown>

                                <UncontrolledDropdown>
                                    <DropdownToggle className="btn btn-secondary" type="button" id="dropdownMenuClickable" data-bs-toggle="dropdown" data-bs-auto-close="false" aria-expanded="false">
                                        Manual close <i className="mdi mdi-chevron-down"></i>
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem href="#">Menu item</DropdownItem>
                                        <DropdownItem href="#">Menu item</DropdownItem>
                                        <DropdownItem href="#">Menu item</DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                            </div>

                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    );
}

export default CloseMenuAlignment;