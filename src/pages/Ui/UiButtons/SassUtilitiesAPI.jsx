import React from "react";
import { Card, CardBody, Col, Row } from "reactstrap";

const SassUtilitiesAPI = () => {
    return (
        <React.Fragment>
            <Row>
                <Col xl={12}>
                    <Card>
                        <CardBody>
                            <h4 className="card-title">Sass utilities API</h4>
                            <p className="card-title-desc">In addition to <code>.focus-ring</code>, we have several <code>.focus-ring-*</code> utilities to modify the helper class defaults. Modify the color with any of our <a href="https://getbootstrap.com/docs/5.3/customize/color/#theme-colors">theme colors</a>. Note that the light and dark variants may not be visible on all background colors given current color mode support.</p>
                            <Row>
                                <Col xl={6}>
                                    <p><a href="#!" className="d-inline-flex focus-ring focus-ring-primary py-1 px-2 text-decoration-none border rounded-2">Primary focus</a></p>
                                    <p><a href="#!" className="d-inline-flex focus-ring focus-ring-secondary py-1 px-2 text-decoration-none border rounded-2">Secondary focus</a></p>
                                    <p><a href="#!" className="d-inline-flex focus-ring focus-ring-success py-1 px-2 text-decoration-none border rounded-2">Success focus</a></p>
                                    <p><a href="#!" className="d-inline-flex focus-ring focus-ring-danger py-1 px-2 text-decoration-none border rounded-2">Danger focus</a></p>
                                </Col>
                                <Col xl={6}>
                                    <p><a href="#!" className="d-inline-flex focus-ring focus-ring-warning py-1 px-2 text-decoration-none border rounded-2">Warning focus</a></p>
                                    <p><a href="#!" className="d-inline-flex focus-ring focus-ring-info py-1 px-2 text-decoration-none border rounded-2">Info focus</a></p>
                                    <p><a href="#!" className="d-inline-flex focus-ring focus-ring-light py-1 px-2 text-decoration-none border rounded-2">Light focus</a></p>
                                    <p><a href="#!" className="d-inline-flex focus-ring focus-ring-dark py-1 px-2 text-decoration-none border rounded-2">Dark focus</a></p>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    );
}

export default SassUtilitiesAPI;