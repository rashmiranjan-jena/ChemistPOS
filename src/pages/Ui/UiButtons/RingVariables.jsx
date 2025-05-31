import React from "react";
import { Card, CardBody, Col, Row } from "reactstrap";

const RingVariables = () => {
    return (
        <React.Fragment>
            <Row>
                <Col xl={6}>
                    <Card>
                        <CardBody>
                            <h4 className="card-title">Focus ring</h4>
                            <p className="card-title-desc">Click directly on the link below to see the focus ring in action, or into the example below and then press <kbd>Tab</kbd>.</p>
                            <div>
                                <a href="#!" className="d-inline-flex focus-ring py-1 px-2 text-decoration-none border rounded-2">
                                    Custom focus ring
                                </a>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card>
                        <CardBody>
                            <h4 className="card-title">CSS variables</h4>
                            <p className="card-title-desc">Modify the <code>--bs-focus-ring-*</code> CSS variables as needed to change the default appearance.</p>
                            <div>
                                <a href="#!" className="d-inline-flex focus-ring py-1 px-2 text-decoration-none border rounded-2"
                                //  style="--bs-focus-ring-color: rgba(var(--bs-success-rgb), .25)"
                                >
                                    Green focus ring
                                </a>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    );
}

export default RingVariables;