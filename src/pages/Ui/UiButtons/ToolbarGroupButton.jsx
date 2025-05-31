import React from "react";
import { Link } from "react-router-dom";
import { Button, Card, CardBody, CardTitle, Col, Row } from "reactstrap";

const ToolbarGroupButton = () => {
    return (
        <React.Fragment>
            <Row>
                <Col xl={6}>
                    <Card>
                        <CardBody>
                            <CardTitle>Button group</CardTitle>
                            <p className="card-title-desc">
                                Wrap a series of buttons with{" "}
                                <code className="highlighter-rouge">.btn</code> in{" "}
                                <code className="highlighter-rouge">.btn-group</code>.
                            </p>

                            <Row>
                                <Col md={6}>
                                    <div className="d-flex flex-wrap gap-2">
                                        <div
                                            className="btn-group"
                                            role="group"
                                            aria-label="Basic example"
                                        >
                                            <Button color="primary">Left</Button>
                                            <Button color="primary">Middle</Button>
                                            <Button color="primary">Right</Button>
                                        </div>

                                        <div className="btn-group">
                                            <Link to="#" className="btn btn-outline-primary active">Left</Link>
                                            <Link to="#" className="btn btn-outline-primary">Middle</Link>
                                            <Link to="#" className="btn btn-outline-primary">Right</Link>
                                        </div>
                                    </div>
                                </Col>

                                <Col md={6}>
                                    <div className="d-flex flex-wrap gap-3 mt-4 mt-md-0">
                                        <div className="btn-group">
                                            <Button color="secondary" type="button"><i className="bx bx-menu-alt-right"></i></Button>
                                            <Button color="secondary" type="button"><i className="bx bx-menu"></i></Button>
                                            <Button color="secondary" type="button"><i className="bx bx-menu-alt-left"></i></Button>
                                        </div>

                                        <div className="btn-group">
                                            <Button type="button" color="outline-secondary"><i className="bx bx-menu-alt-right"></i></Button>
                                            <Button type="button" color="outline-secondary"><i className="bx bx-menu"></i></Button>
                                            <Button type="button" color="outline-secondary"><i className="bx bx-menu-alt-left"></i></Button>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card>
                        <CardBody>
                            <CardTitle>Button toolbar</CardTitle>
                            <p className="card-title-desc">
                                Combine sets of button groups into button toolbars for more
                                complex components.Use utility className as needed to
                                space out groups, buttons, and more.
                            </p>
                            <div className="d-flex flex-wrap gap-4">
                                <div
                                    className="btn-toolbar"
                                    role="toolbar"
                                    aria-label="Toolbar with button groups"
                                >
                                    <div
                                        className="btn-group me-2"
                                        role="group"
                                        aria-label="First group"
                                    >
                                        <Button color="secondary" className="btn btn-secondary">1</Button>
                                        <Button color="secondary" className="btn btn-secondary">2</Button>
                                        <Button color="secondary" className="btn btn-secondary">3</Button>
                                        <Button color="secondary" className="btn btn-secondary">4</Button>
                                    </div>
                                    <div
                                        className="btn-group me-2"
                                        role="group"
                                        aria-label="Second group"
                                    >
                                        <Button color="secondary" className="btn btn-secondary">5</Button>
                                        <Button color="secondary" className="btn btn-secondary">6</Button>
                                        <Button color="secondary" className="btn btn-secondary">7</Button>
                                    </div>
                                    <div
                                        className="btn-group"
                                        role="group"
                                        aria-label="Third group"
                                    >
                                        <Button color="secondary" className="btn btn-secondary">8</Button>
                                    </div>
                                </div>

                                <div className="btn-toolbar">
                                    <div className="btn-group me-2">
                                        <Button type="button" color="btn btn-outline-secondary">1</Button>
                                        <Button type="button" color="btn btn-outline-secondary">2</Button>
                                        <Button type="button" color="btn btn-outline-secondary">3</Button>
                                        <Button type="button" color="btn btn-outline-secondary">4</Button>
                                    </div>
                                    <div className="btn-group me-2">
                                        <Button type="button" color="btn btn-outline-secondary">5</Button>
                                        <Button type="button" color="btn btn-outline-secondary">6</Button>
                                        <Button type="button" color="btn btn-outline-secondary">7</Button>
                                    </div>
                                    <div className="btn-group">
                                        <Button type="button" color="btn btn-outline-secondary">8</Button>
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    );
}

export default ToolbarGroupButton;