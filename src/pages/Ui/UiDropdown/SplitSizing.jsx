import React, { useState } from "react";
import { Button, ButtonDropdown, Card, CardBody, CardSubtitle, CardTitle, Col, DropdownItem, DropdownMenu, DropdownToggle, Row } from "reactstrap";

const SplitSizing = () => {

    const [drp_primary1, setDrp_primary1] = useState(false)
    const [drp_secondary1, setDrp_secondary1] = useState(false)
    const [drp_success1, setDrp_success1] = useState(false)
    const [drp_info1, setDrp_info1] = useState(false)
    const [drp_warning1, setDrp_warning1] = useState(false)
    const [drp_danger1, setDrp_danger1] = useState(false)
    const [drp_secondary, setDrp_secondary] = useState(false)
    const [drp_secondary_lg, setDrp_secondary_lg] = useState(false)
    const [drp_secondary_sm, setDrp_secondary_sm] = useState(false)
    const [drp_secondary_sm1, setDrp_secondary_sm1] = useState(false)

    return (
        <React.Fragment>
            <Row>
                <Col xl={6}>
                    <Card>
                        <CardBody>
                            <CardTitle>Split button dropdowns</CardTitle>
                            <CardSubtitle className="mb-3">
                                The best part is you can do this with any button variant,
                                too:
                            </CardSubtitle>
                            <div className="d-flex gap-2 flex-wrap">
                                <div className="btn-group">
                                    <ButtonDropdown
                                        isOpen={drp_primary1}
                                        toggle={() => setDrp_primary1(!drp_primary1)}
                                    >
                                        <Button id="caret" color="primary">
                                            Primary
                                        </Button>
                                        <DropdownToggle caret color="primary">
                                            <i className="mdi mdi-chevron-down" />
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem>Action</DropdownItem>
                                            <DropdownItem>Another action</DropdownItem>
                                            <DropdownItem>Something else here</DropdownItem>
                                            <div className="dropdown-divider"></div>
                                            <DropdownItem href="#">Separated link</DropdownItem>
                                        </DropdownMenu>
                                    </ButtonDropdown>
                                </div>

                                <div className="btn-group">
                                    <ButtonDropdown
                                        isOpen={drp_secondary1}
                                        toggle={() => setDrp_secondary1(!drp_secondary1)}
                                    >
                                        <Button id="caret" color="secondary">
                                            Secondary
                                        </Button>
                                        <DropdownToggle caret color="secondary">
                                            <i className="mdi mdi-chevron-down" />
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem>Action</DropdownItem>
                                            <DropdownItem>Another action</DropdownItem>
                                            <DropdownItem>Something else here</DropdownItem>
                                            <div className="dropdown-divider"></div>
                                            <DropdownItem href="#">Separated link</DropdownItem>
                                        </DropdownMenu>
                                    </ButtonDropdown>
                                </div>

                                <div className="btn-group">
                                    <ButtonDropdown
                                        isOpen={drp_success1}
                                        toggle={() => setDrp_success1(!drp_success1)}
                                    >
                                        <Button id="caret" color="success">
                                            Success
                                        </Button>
                                        <DropdownToggle caret color="success">
                                            <i className="mdi mdi-chevron-down" />
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem>Action</DropdownItem>
                                            <DropdownItem>Another action</DropdownItem>
                                            <DropdownItem>Something else here</DropdownItem>
                                            <div className="dropdown-divider"></div>
                                            <DropdownItem href="#">Separated link</DropdownItem>
                                        </DropdownMenu>
                                    </ButtonDropdown>
                                </div>

                                <div className="btn-group">
                                    <ButtonDropdown
                                        isOpen={drp_info1}
                                        toggle={() => setDrp_info1(!drp_info1)}
                                    >
                                        <Button id="caret" color="info">
                                            Info
                                        </Button>
                                        <DropdownToggle caret color="info">
                                            <i className="mdi mdi-chevron-down" />
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem>Action</DropdownItem>
                                            <DropdownItem>Another action</DropdownItem>
                                            <DropdownItem>Something else here</DropdownItem>
                                            <div className="dropdown-divider"></div>
                                            <DropdownItem href="#">Separated link</DropdownItem>
                                        </DropdownMenu>
                                    </ButtonDropdown>
                                </div>


                                <div className="btn-group">
                                    <ButtonDropdown
                                        isOpen={drp_warning1}
                                        toggle={() => setDrp_warning1(!drp_warning1)}
                                    >
                                        <Button id="caret" color="warning">
                                            Warning
                                        </Button>
                                        <DropdownToggle caret color="warning">
                                            <i className="mdi mdi-chevron-down" />
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem>Action</DropdownItem>
                                            <DropdownItem>Another action</DropdownItem>
                                            <DropdownItem>Something else here</DropdownItem>
                                            <div className="dropdown-divider"></div>
                                            <DropdownItem href="#">Separated link</DropdownItem>
                                        </DropdownMenu>
                                    </ButtonDropdown>
                                </div>

                                <div className="btn-group">
                                    <ButtonDropdown
                                        isOpen={drp_danger1}
                                        toggle={() => setDrp_danger1(!drp_danger1)}
                                    >
                                        <Button id="caret" color="danger">
                                            Danger
                                        </Button>
                                        <DropdownToggle caret color="danger">
                                            <i className="mdi mdi-chevron-down" />
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem>Action</DropdownItem>
                                            <DropdownItem>Another action</DropdownItem>
                                            <DropdownItem>Something else here</DropdownItem>
                                            <div className="dropdown-divider"></div>
                                            <DropdownItem href="#">Separated link</DropdownItem>
                                        </DropdownMenu>
                                    </ButtonDropdown>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Col>

                <Col xl={6}>
                    <Card>
                        <CardBody>
                            <CardTitle>Sizing</CardTitle>
                            <CardSubtitle className="mb-3">
                                {" "}
                                Button dropdowns work with buttons of all sizes, including
                                default and split dropdown buttons.
                            </CardSubtitle>
                            <div className="btn-group mb-2">
                                <ButtonDropdown
                                    isOpen={drp_secondary}
                                    toggle={() => setDrp_secondary(!drp_secondary)}
                                >
                                    <DropdownToggle
                                        caret
                                        color="primary"
                                        className=" btn-lg"
                                    >
                                        Large button &nbsp;{" "}
                                        <i className="mdi mdi-chevron-down" />
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem>Action</DropdownItem>
                                        <DropdownItem>Another action</DropdownItem>
                                        <DropdownItem>Something else here</DropdownItem>
                                        <div className="dropdown-divider"></div>
                                        <DropdownItem href="#">Separated link</DropdownItem>
                                    </DropdownMenu>
                                </ButtonDropdown>
                            </div>{" "}
                            &nbsp;
                            <div className="btn-group mb-2">
                                <ButtonDropdown
                                    isOpen={drp_secondary_lg}
                                    toggle={() => setDrp_secondary_lg(!drp_secondary_lg)}
                                >
                                    <DropdownToggle
                                        caret
                                        color="secondary"
                                        className="btn btn-secondary btn-lg"
                                    >
                                        Large button &nbsp;
                                        <i className="mdi mdi-chevron-down" />
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem>Action</DropdownItem>
                                        <DropdownItem>Another action</DropdownItem>
                                        <DropdownItem>Something else here</DropdownItem>
                                        <div className="dropdown-divider"></div>
                                        <DropdownItem href="#">Separated link</DropdownItem>
                                    </DropdownMenu>
                                </ButtonDropdown>
                            </div>{" "}
                            &nbsp;
                            <div className="btn-group mb-2">
                                <ButtonDropdown
                                    isOpen={drp_secondary_sm}
                                    toggle={() => setDrp_secondary_sm(!drp_secondary_sm)}
                                >
                                    <DropdownToggle
                                        caret
                                        color="info"
                                        className="btn btn-info btn-sm"
                                    >
                                        Small button &nbsp;{" "}
                                        <i className="mdi mdi-chevron-down" />
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem>Action</DropdownItem>
                                        <DropdownItem>Another action</DropdownItem>
                                        <DropdownItem>Something else here</DropdownItem>
                                        <div className="dropdown-divider"></div>
                                        <DropdownItem href="#">Separated link</DropdownItem>
                                    </DropdownMenu>
                                </ButtonDropdown>
                            </div>{" "}
                            &nbsp;
                            <div className="btn-group mb-2">
                                <ButtonDropdown
                                    isOpen={drp_secondary_sm1}
                                    toggle={() => setDrp_secondary_sm1(!drp_secondary_sm1)}
                                >
                                    <Button className="btn btn-secondary btn-sm">
                                        {" "}
                                        Small button &nbsp;
                                    </Button>
                                    <DropdownToggle
                                        caret
                                        color="secondary"
                                        className="btn btn-secondary btn-sm"
                                    >
                                        <i className="mdi mdi-chevron-down" />
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem disabled>Action</DropdownItem>
                                        <DropdownItem>Another Action</DropdownItem>
                                        <DropdownItem divider />
                                        <DropdownItem>Another Action</DropdownItem>
                                    </DropdownMenu>
                                </ButtonDropdown>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    );
}

export default SplitSizing