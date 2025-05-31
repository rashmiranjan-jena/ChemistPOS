import React from "react";
import { Button, Card, CardBody, CardTitle, Col, Row } from "reactstrap";

const DefaultOutlineButtons = () => {
    return (
        <React.Fragment>
            <Row>
                <Col xl={6}>
                    <Card>
                        <CardBody>
                            <CardTitle>Default buttons</CardTitle>
                            <p className="card-title-desc">
                                Bootstrap includes six predefined button styles, each
                                serving its own semantic purpose.
                            </p>
                            <div className="d-flex flex-wrap gap-2">
                                <Button
                                    color="primary"
                                    className="btn btn-primary waves-effect waves-light"
                                >
                                    Primary
                                </Button>
                                <Button
                                    color="secondary"
                                    className="btn btn-secondary waves-effect waves-light"
                                >
                                    Secondary
                                </Button>
                                <Button
                                    color="success"
                                    className="btn btn-success waves-effect waves-light"
                                >
                                    Success
                                </Button>
                                <Button
                                    color="info"
                                    className="btn btn-info waves-effect waves-light"
                                >
                                    Info
                                </Button>
                                <Button
                                    color="warning"
                                    className="btn btn-warning waves-effect waves-light"
                                >
                                    Warning
                                </Button>
                                <Button
                                    color="danger"
                                    className="btn btn-danger waves-effect waves-light"
                                >
                                    Danger
                                </Button>
                                <Button
                                    color="dark"
                                    className="btn btn-dark waves-effect waves-light"
                                >
                                    Dark
                                </Button>
                                <Button color="link" className="btn btn-link waves-effect">
                                    Link
                                </Button>
                                <Button
                                    color="light"
                                    className="btn btn-light waves-effect"
                                >
                                    Light
                                </Button>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card>
                        <CardBody>
                            <CardTitle>Outline buttons</CardTitle>
                            <p className="card-title-desc">
                                Replace the default modifier classes with the{" "}
                                <code className="highlighter-rouge">.btn-outline-*</code>{" "}
                                ones to remove all background images and colors on any
                                button.
                            </p>
                            <div className="d-flex flex-wrap gap-2">
                                <Button
                                    color="primary"
                                    outline

                                >
                                    Primary
                                </Button>
                                <Button color="secondary" outline>
                                    Secondary
                                </Button>
                                <Button
                                    color="success"
                                    outline

                                >
                                    Success
                                </Button>
                                <Button
                                    color="info"
                                    outline

                                >
                                    Info
                                </Button>
                                <Button
                                    color="warning"
                                    outline

                                >
                                    Warning
                                </Button>
                                <Button
                                    color="danger"
                                    outline

                                >
                                    Danger
                                </Button>
                                <Button
                                    color="dark"
                                    outline

                                >
                                    Dark
                                </Button>
                                <Button color="light" outline >
                                    Light
                                </Button>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    );
}

export default DefaultOutlineButtons;