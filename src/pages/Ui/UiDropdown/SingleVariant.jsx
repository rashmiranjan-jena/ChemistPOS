import React, { useState } from "react";
import { Card, CardBody, CardSubtitle, CardTitle, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row } from "reactstrap";

const SingleVariant = () => {
    const [singleBtn, setSingleBtn] = useState(false)
    const [singleBtn1, setSingleBtn1] = useState(false)
    const [btnPrimary1, setBtnPrimary1] = useState(false)
    const [btnSecondary1, setBtnSecondary1] = useState(false)
    const [btnSuccess1, setBtnSuccess1] = useState(false)
    const [btnInfo1, setBtnInfo1] = useState(false)
    const [btnWarning1, setBtnWarning1] = useState(false)
    const [btnDanger1, setBtnDanger1] = useState(false)

    return (
        <React.Fragment>
            <Row>
                <Col xl={6}>
                    <Card>
                        <CardBody>
                            <CardTitle>Single button dropdowns</CardTitle>
                            <p className="card-title-desc">
                                Any single <code className="highlighter-rouge">.btn</code>{" "}
                                can be turned into a dropdown toggle with some markup
                                changes. Here’s how you can put them to work with either{" "}
                                <code className="highlighter-rouge">&lt;button&gt;</code>{" "}
                                elements:
                            </p>
                            <Row>
                                <Col sm={6}>
                                    <Dropdown
                                        isOpen={singleBtn}
                                        toggle={() => setSingleBtn(!singleBtn)}
                                    >
                                        <DropdownToggle className="btn btn-secondary" caret>
                                            Dropdown button{" "}
                                            <i className="mdi mdi-chevron-down" />
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem>Action</DropdownItem>
                                            <DropdownItem>Another action</DropdownItem>
                                            <DropdownItem>Something else here</DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                </Col>
                                <Col sm={6}>
                                    <Dropdown
                                        isOpen={singleBtn1}
                                        toggle={() => setSingleBtn1(!singleBtn1)}
                                        className="mt-4 mt-sm-0"
                                    >
                                        <DropdownToggle className="btn btn-secondary" caret>
                                            Dropdown Link <i className="mdi mdi-chevron-down" />
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem>Action</DropdownItem>
                                            <DropdownItem>Another action</DropdownItem>
                                            <DropdownItem>Something else here</DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>

                <Col xl={6}>
                    <Card>
                        <CardBody>
                            <CardTitle>Variant</CardTitle>
                            <CardSubtitle className="mb-4">
                                The best part is you can do this with any button variant,
                                too:
                            </CardSubtitle>

                            <div className="d-flex gap-2 flex-wrap">
                                <Dropdown
                                    isOpen={btnPrimary1}
                                    toggle={() => setBtnPrimary1(!btnPrimary1)}
                                >
                                    <DropdownToggle tag="button" className="btn btn-primary">
                                        Primary <i className="mdi mdi-chevron-down" />
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem>Action</DropdownItem>
                                        <DropdownItem>Another action</DropdownItem>
                                        <DropdownItem>Something else here</DropdownItem>
                                        <div className="dropdown-divider"></div>
                                        <DropdownItem href="#">Separated link</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>

                                <Dropdown
                                    isOpen={btnSecondary1}
                                    toggle={() => setBtnSecondary1(!btnSecondary1)}
                                >
                                    <DropdownToggle tag="button" className="btn btn-secondary">
                                        Secondary <i className="mdi mdi-chevron-down" />
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem>Action</DropdownItem>
                                        <DropdownItem>Another action</DropdownItem>
                                        <DropdownItem>Something else here</DropdownItem>
                                        <div className="dropdown-divider"></div>
                                        <DropdownItem href="#">Separated link</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>

                                <Dropdown
                                    isOpen={btnSuccess1}
                                    toggle={() => setBtnSuccess1(!btnSuccess1)}
                                >
                                    <DropdownToggle tag="button" className="btn btn-success">
                                        Success <i className="mdi mdi-chevron-down" />
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem>Action</DropdownItem>
                                        <DropdownItem>Another action</DropdownItem>
                                        <DropdownItem>Something else here</DropdownItem>
                                        <div className="dropdown-divider"></div>
                                        <DropdownItem href="#">Separated link</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>

                                <Dropdown
                                    isOpen={btnInfo1}
                                    toggle={() => setBtnInfo1(!btnInfo1)}
                                >
                                    <DropdownToggle tag="button" className="btn btn-info">
                                        Info <i className="mdi mdi-chevron-down" />
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem>Action</DropdownItem>
                                        <DropdownItem>Another action</DropdownItem>
                                        <DropdownItem>Something else here</DropdownItem>
                                        <div className="dropdown-divider"></div>
                                        <DropdownItem href="#">Separated link</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>

                                <Dropdown
                                    isOpen={btnWarning1}
                                    toggle={() => setBtnWarning1(!btnWarning1)}
                                >
                                    <DropdownToggle tag="button" className="btn btn-warning">
                                        Warning <i className="mdi mdi-chevron-down" />
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem>Action</DropdownItem>
                                        <DropdownItem>Another action</DropdownItem>
                                        <DropdownItem>Something else here</DropdownItem>
                                        <div className="dropdown-divider"></div>
                                        <DropdownItem href="#">Separated link</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>

                                <Dropdown
                                    isOpen={btnDanger1}
                                    toggle={() => setBtnDanger1(!btnDanger1)}
                                >
                                    <DropdownToggle tag="button" className="btn btn-danger">
                                        Danger <i className="mdi mdi-chevron-down" />
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem>Action</DropdownItem>
                                        <DropdownItem>Another action</DropdownItem>
                                        <DropdownItem>Something else here</DropdownItem>
                                        <div className="dropdown-divider"></div>
                                        <DropdownItem href="#">Separated link</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    );
}

export default SingleVariant;