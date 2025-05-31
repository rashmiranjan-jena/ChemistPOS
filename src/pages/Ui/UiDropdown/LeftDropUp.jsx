import React, { useState } from "react";
import { Button, ButtonDropdown, Card, CardBody, CardSubtitle, CardTitle, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row, UncontrolledDropdown } from "reactstrap";

const LeftDropUp = () => {

    const [drop_up1, setDropUp1] = useState(false)
    const [drp_up11, setDrp_up11] = useState(false)
    const [info_dropUp1, setInfo_dropUp1] = useState(false)
    const [inoDrp_up11, setInfoDrp_up11] = useState(false)
    const [info_dropUp111, setInfo_dropUp111] = useState(false)

    return (
        <React.Fragment>
            <Row>
                <Col xl={6}>
                    <Card>
                        <CardBody>
                            <CardTitle>Dropup variation</CardTitle>
                            <CardSubtitle className="mb-3">
                                Trigger dropdown menus above elements by adding{" "}
                                <code className="highlighter-rouge">.dropup</code> to the
                                parent element.
                            </CardSubtitle>
                            <div className="d-flex gap-2 flex-wrap">
                                <Dropdown
                                    className="dropup"
                                    isOpen={drop_up1}
                                    direction="up"
                                    toggle={() => setDropUp1(!drop_up1)}
                                >
                                    <DropdownToggle className="btn btn-info">
                                        Dropup <i className="mdi mdi-chevron-up" />
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem>Action</DropdownItem>
                                        <DropdownItem>Another action</DropdownItem>
                                        <DropdownItem>Something else here</DropdownItem>
                                        <DropdownItem divider />
                                        <DropdownItem href="#">Separated link</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                                &nbsp;
                                <ButtonDropdown
                                    direction="up"
                                    isOpen={drp_up11}
                                    toggle={() => setDrp_up11(!drp_up11)}
                                >
                                    <Button id="caret" color="info">
                                        Split dropup
                                    </Button>
                                    <DropdownToggle caret color="info">
                                        <i className="mdi mdi-chevron-up" />
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem>Action</DropdownItem>
                                        <DropdownItem>Action action</DropdownItem>
                                        <DropdownItem>Something else here</DropdownItem>
                                        <DropdownItem divider />
                                        <DropdownItem>Separated link</DropdownItem>
                                    </DropdownMenu>
                                </ButtonDropdown>
                            </div>
                        </CardBody>
                    </Card>
                </Col>

                <Col xl={6}>
                    <Card>
                        <CardBody>
                            <CardTitle>Dropleft variation</CardTitle>
                            <CardSubtitle className="mb-3">
                                Trigger dropdown menus at the right of the elements by
                                adding <code>.dropleft</code> to the parent element.
                            </CardSubtitle>

                            <div className="d-flex gap-2 flex-wrap">
                                <Dropdown
                                    isOpen={info_dropUp111}
                                    direction="left"
                                    className="btn-group dropstart"
                                    toggle={() => setInfo_dropUp111(!info_dropUp111)}
                                >
                                    <DropdownToggle className="btn btn-info">
                                        <i className="mdi mdi-chevron-left" /> Dropleft
                                    </DropdownToggle>
                                    <DropdownMenu data-popper-placement="left-start">
                                        <DropdownItem header>Header</DropdownItem>
                                        <DropdownItem disabled>Action</DropdownItem>
                                        <DropdownItem>Another Action</DropdownItem>
                                        <DropdownItem divider />
                                        <DropdownItem>Another Action</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                                <UncontrolledDropdown className="btn-group">
                                    <div className="btn-group dropstart">
                                        <DropdownToggle type="button" className="btn btn-info waves-effect waves-light dropdown-toggle-split">
                                            <i className="mdi mdi-chevron-left"></i>
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem href="#">Action</DropdownItem>
                                            <DropdownItem href="#">Another action</DropdownItem>
                                            <DropdownItem href="#">Something else here</DropdownItem>
                                        </DropdownMenu>
                                    </div>

                                    <button type="button" className="btn btn-info waves-effect waves-light">
                                        Split dropstart
                                    </button>
                                </UncontrolledDropdown>
                            </div>
                        </CardBody>
                    </Card>
                </Col>

                <Col xl={6}>
                    <Card>
                        <CardBody>
                            <CardTitle>Dropright variation</CardTitle>
                            <CardSubtitle className="mb-3">
                                Trigger dropdown menus at the right of the elements by
                                adding <code>.dropright</code> to the parent element.
                            </CardSubtitle>

                            <div className="d-flex gap-2 flex-wrap">
                                <Dropdown
                                    isOpen={info_dropUp1}
                                    direction="right"
                                    className="btn-group dropend"
                                    toggle={() => setInfo_dropUp1(!info_dropUp1)}
                                >
                                    <DropdownToggle className="btn btn-info" caret>
                                        Dropright <i className="mdi mdi-chevron-right" />
                                    </DropdownToggle>
                                    <DropdownMenu data-popper-placement="right-start">
                                        <DropdownItem>Action</DropdownItem>
                                        <DropdownItem>Another action</DropdownItem>
                                        <DropdownItem>Something else here</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                                <ButtonDropdown
                                    direction="right"
                                    isOpen={inoDrp_up11}
                                    className="btn-group dropend"
                                    toggle={() => setInfoDrp_up11(!inoDrp_up11)}
                                >
                                    <Button id="caret" color="info">
                                        Split dropright
                                    </Button>
                                    <DropdownToggle caret color="info" className="dropdown-toggle-split">
                                        <i className="mdi mdi-chevron-right" />
                                    </DropdownToggle>
                                    <DropdownMenu data-popper-placement="right-start">
                                        <DropdownItem>Action</DropdownItem>
                                        <DropdownItem>Another action</DropdownItem>
                                        <DropdownItem>Something else here</DropdownItem>
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

export default LeftDropUp;