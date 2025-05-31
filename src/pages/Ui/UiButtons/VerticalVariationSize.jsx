import React, { useState } from "react";
import { Button, ButtonDropdown, Card, CardBody, CardTitle, Col, DropdownItem, DropdownMenu, DropdownToggle, Row } from "reactstrap";

const VerticalVariationSize = () => {

    const [drp_link, setDrp_link] = useState(false);
    return (
        <React.Fragment>
            <Row>
                <Col xl={6}>
                    <Card>
                        <CardBody>
                            <CardTitle>Sizing</CardTitle>
                            <p className="card-title-desc">
                                Instead of applying button sizing classes to every button in
                                a group, just add{" "}
                                <code className="highlighter-rouge">.btn-group-*</code> to
                                each <code className="highlighter-rouge">.btn-group</code>,
                                including each one when nesting multiple groups.
                            </p>
                            <div className="d-flex flex-wrap gap-3">
                                <div className="btn-group btn-group-lg">
                                    <Button type="button" color="primary">Left</Button>
                                    <Button type="button" color="primary">Middle</Button>
                                    <Button type="button" color="primary">Right</Button>
                                </div>

                                <div className="btn-group btn-group-lg">
                                    <Button type="button" color="outline-primary">Left</Button>
                                    <Button type="button" color="outline-primary">Middle</Button>
                                    <Button type="button" color="outline-primary">Right</Button>
                                </div>
                            </div>

                            <br />

                            <div className="d-flex flex-wrap gap-3">
                                <div className="btn-group">
                                    <Button type="button" color="secondary">Left</Button>
                                    <Button type="button" color="secondary">Middle</Button>
                                    <Button type="button" color="secondary">Right</Button>
                                </div>
                                <div className="btn-group">
                                    <Button type="button" color="outline-secondary">Left</Button>
                                    <Button type="button" color="outline-secondary">Middle</Button>
                                    <Button type="button" color="outline-secondary">Right</Button>
                                </div>
                            </div>

                            <br />

                            <div className="d-flex flex-wrap gap-3">
                                <div className="btn-group btn-group-sm" role="group" aria-label="Basic example">
                                    <Button type="button" color="danger">Left</Button>
                                    <Button type="button" color="danger">Middle</Button>
                                    <Button type="button" color="danger">Right</Button>
                                </div>

                                <div className="btn-group btn-group-sm" role="group" aria-label="Basic example">
                                    <Button type="button" color="outline-danger">Left</Button>
                                    <Button type="button" color="outline-danger">Middle</Button>
                                    <Button type="button" color="outline-danger">Right</Button>
                                </div>
                            </div>

                        </CardBody>
                    </Card>
                </Col>

                <Col xl={6}>
                    <Card>
                        <CardBody>
                            <CardTitle>Vertical variation</CardTitle>
                            <p className="card-title-desc">
                                Make a set of buttons appear vertically stacked rather than
                                horizontally.Split button dropdowns are not supported here.
                            </p>
                            <div className="d-flex flex-wrap gap-3 align-items-center">
                                <div
                                    className="btn-group-vertical"
                                    role="group"
                                    aria-label="Vertical button group"
                                >
                                    <Button type="button" color="secondary" className="btn btn-secondary">Button</Button>

                                    <ButtonDropdown
                                        isOpen={drp_link}
                                        toggle={() => {
                                            setDrp_link(!drp_link);
                                        }}
                                    >
                                        <DropdownToggle caret color="secondary">
                                            Dropdown <i className="mdi mdi-chevron-down"></i>
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem>Dropdown link</DropdownItem>
                                            <DropdownItem>Dropdown link</DropdownItem>
                                        </DropdownMenu>
                                    </ButtonDropdown>

                                    <Button
                                        color="secondary"
                                        type="button"
                                        className="btn btn-secondary"
                                    >
                                        Button
                                    </Button>
                                    <Button
                                        color="secondary"
                                        type="button"
                                        className="btn btn-secondary"
                                    >
                                        Button
                                    </Button>
                                </div>

                                <div className="btn-group-vertical">
                                    <input type="radio" className="btn-check" name="vbtn-radio" id="vbtn-radio1" autoComplete="off" defaultChecked />
                                    <label className="btn btn-outline-danger" htmlFor="vbtn-radio1">Radio 1</label>
                                    <input type="radio" className="btn-check" name="vbtn-radio" id="vbtn-radio2" autoComplete="off" />                                    <label className="btn btn-outline-danger" htmlFor="vbtn-radio2">Radio 2</label>
                                    <input type="radio" className="btn-check" name="vbtn-radio" id="vbtn-radio3" autoComplete="off" />
                                    <label className="btn btn-outline-danger" htmlFor="vbtn-radio3">Radio 3</label>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    );
}

export default VerticalVariationSize;