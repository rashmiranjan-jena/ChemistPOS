import React from "react";
import { Button, Card, CardBody, CardTitle, Col, Row } from "reactstrap";

const SnipButtons = () => {
    return (
        <React.Fragment>
            <Row>
                <Col xl={12}>
                    <Card>
                        <CardBody>
                            <CardTitle>Snip Buttons</CardTitle>

                            <Row>
                                <Col xl={4}>
                                    <div className="mt-4">
                                        <h5 className="font-size-15 mb-3">Example 1</h5>

                                        <div>
                                            <div
                                                className="btn-group btn-group-example mb-3"
                                                role="group"
                                            >
                                                <Button type="button" color="outline-primary" className="w-sm">
                                                    Left
                                                </Button>
                                                <Button type="button" color="outline-primary" className="w-sm">
                                                    Middle
                                                </Button>
                                                <Button type="button" color="outline-primary" className="w-sm">
                                                    Right
                                                </Button>
                                            </div>

                                            <div>
                                                <div
                                                    className="btn-group btn-group-example mb-3"
                                                    role="group"
                                                >
                                                    <Button type="button" color="primary w" className="xs">
                                                        <i className="mdi mdi-thumb-up"></i>
                                                    </Button>
                                                    <Button type="button" color="danger w" className="xs">
                                                        <i className="mdi mdi-thumb-down"></i>
                                                    </Button>
                                                </div>
                                            </div>

                                            <div>
                                                <div
                                                    className="btn-group btn-group-example"
                                                    role="group"
                                                >
                                                    <Button type="button" color="outline-secondary" className="w-xs">
                                                        <i className="bx bx-menu-alt-right"></i>
                                                    </Button>
                                                    <Button type="button" color="outline-secondary" className="w-xs">
                                                        <i className="bx bx-menu"></i>
                                                    </Button>
                                                    <Button type="button" color="outline-secondary" className="w-xs">
                                                        <i className="bx bx-menu-alt-left"></i>
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>

                                <Col xl={4}>
                                    <div className="mt-4">
                                        <h5 className="font-size-15 mb-3">Example 2</h5>

                                        <div className="d-flex flex-wrap gap-2">
                                            <Button type="button" color="primary" className="btn-label"
                                            >
                                                <i className="bx bx-smile label-icon"></i> Primary
                                            </Button>
                                            <Button type="button" color="success" className="btn-label"
                                            >
                                                <i className="bx bx-check-double label-icon"></i>{" "}
                                                Success
                                            </Button>
                                            <Button type="button" color="warning" className="btn-label"
                                            >
                                                <i className="bx bx-error label-icon "></i> Warning
                                            </Button>
                                            <Button type="button" color="danger" className="btn-label"
                                            >
                                                <i className="bx bx-block label-icon "></i> Danger
                                            </Button>
                                            <Button type="button" color="dark" className="btn-label"
                                            >
                                                <i className="bx bx-loader label-icon "></i> Dark
                                            </Button>
                                            <Button type="button" color="light" className="btn-label"
                                            >
                                                <i className="bx bx-hourglass label-icon "></i>{" "}
                                                Light
                                            </Button>
                                        </div>
                                    </div>
                                </Col>

                                <Col xl={4}>
                                    <div className="mt-4">
                                        <h5 className="font-size-15 mb-3">Example 3</h5>

                                        <div className="d-flex flex-wrap gap-2">
                                            <Button type="button" color="primary" className="w-sm"
                                            >
                                                <i className="mdi mdi-download d-block font-size-16"></i>{" "}
                                                Download
                                            </Button>
                                            <Button type="button" color="light" className="w-sm"
                                            >
                                                <i className="mdi mdi-upload d-block font-size-16"></i>{" "}
                                                Upload
                                            </Button>
                                            <Button type="button" color="success" className="w-sm"
                                            >
                                                <i className="mdi mdi-pencil d-block font-size-16"></i>{" "}
                                                Edit
                                            </Button>
                                            <Button type="button" color="danger" className="w-sm"
                                            >
                                                <i className="mdi mdi-trash-can d-block font-size-16"></i>{" "}
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    );
}

export default SnipButtons;