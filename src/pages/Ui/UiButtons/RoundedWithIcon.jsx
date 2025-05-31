import React from "react";
import { Button, Card, CardBody, CardTitle, Col, Row } from "reactstrap";

const RoundedWithIcon = () => {
    return (
        <React.Fragment>
            <Row>
                <Col xl={6}>
                    <Card>
                        <CardBody>
                            <CardTitle>Rounded buttons</CardTitle>
                            <p className="card-title-desc">
                                Use class <code>.btn-rounded</code> for button round border.
                            </p>
                            <div className="d-flex flex-wrap gap-2">
                                <Button
                                    color="primary"
                                    className="btn-rounded "
                                >
                                    Primary
                                </Button>
                                <Button
                                    color="secondary"
                                    className="btn-rounded "
                                >
                                    Secondary
                                </Button>
                                <Button
                                    color="success"
                                    className="btn-rounded "
                                >
                                    Success
                                </Button>
                                <Button
                                    color="info"
                                    className="btn-rounded "
                                >
                                    Info
                                </Button>
                                <Button
                                    color="warning"
                                    className="btn-rounded "
                                >
                                    Warning
                                </Button>
                                <Button
                                    color="danger"
                                    className="btn-rounded "
                                >
                                    Danger
                                </Button>
                                <Button
                                    color="dark"
                                    className="btn-rounded "
                                >
                                    Dark
                                </Button>
                                <Button color="link" className="btn-rounded">
                                    Link
                                </Button>
                                <Button color="light" className="btn-rounded">
                                    Light
                                </Button>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card>
                        <CardBody>
                            <CardTitle>Buttons with icon</CardTitle>
                            <p className="card-title-desc">Add icon in button.</p>

                            <div className="d-flex flex-wrap gap-2">
                                <Button type="button" color="primary ">
                                    <i className="bx bx-smile font-size-16 align-middle me-2"></i>{" "}
                                    Primary
                                </Button>
                                <Button type="button" color="success ">
                                    <i className="bx bx-check-double font-size-16 align-middle me-2"></i>{" "}
                                    Success
                                </Button>
                                <Button type="button" color="warning ">
                                    <i className="bx bx-error font-size-16 align-middle me-2"></i>{" "}
                                    Warning
                                </Button>
                                <Button type="button" color="danger ">
                                    <i className="bx bx-block font-size-16 align-middle me-2"></i>{" "}
                                    Danger
                                </Button>
                                <Button type="button" color="dark ">
                                    <i className="bx bx-loader bx-spin font-size-16 align-middle me-2"></i>{" "}
                                    Loading
                                </Button>
                                <Button type="button" color="light ">
                                    <i className="bx bx-hourglass bx-spin font-size-16 align-middle me-2"></i>{" "}
                                    Loading
                                </Button>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    );
}

export default RoundedWithIcon;