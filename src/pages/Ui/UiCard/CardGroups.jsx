import React from "react";
import { Card, CardBody, CardText, CardTitle, Col, Row } from "reactstrap";
// img
import img4 from "../../../assets/images/small/img-4.jpg";
import img5 from "../../../assets/images/small/img-5.jpg";
import img6 from "../../../assets/images/small/img-6.jpg";

const CardGroups = () => {
    return (
        <React.Fragment>
            <Row>
                <Col xs={12}>
                    <h4 className="my-3">Card groups</h4>
                    <div className="card-deck-wrapper">
                        <div className="card-group">
                            <Card className="mb-4">
                                <img className="card-img-top img-fluid" src={img4} alt="Skote" />
                                <CardBody>
                                    <CardTitle tag="h4" className="mt-0">Card title</CardTitle>
                                    <CardText>
                                        This is a longer card with supporting text below as a
                                        natural lead-in to additional content. This content is a
                                        little bit longer.
                                    </CardText>
                                    <CardText>
                                        <small className="text-muted">Last updated 3 mins ago</small>
                                    </CardText>
                                </CardBody>
                            </Card>
                            <Card className="mb-4">
                                <img className="card-img-top img-fluid" src={img5} alt="Skote" />
                                <CardBody>
                                    <CardTitle tag="h4" className="mt-0">Card title</CardTitle>
                                    <CardText>
                                        This card has supporting text below as a natural lead-in
                                        to additional content.
                                    </CardText>
                                    <CardText>
                                        <small className="text-muted">
                                            Last updated 3 mins ago
                                        </small>
                                    </CardText>
                                </CardBody>
                            </Card>
                            <Card className="mb-4">
                                <img className="card-img-top img-fluid" src={img6} alt="Skote" />
                                <CardBody>
                                    <CardTitle tag="h4" className="mt-0">Card title</CardTitle>
                                    <CardText>
                                        This is a wider card with supporting text below as a
                                        natural lead-in to additional content. This card has even
                                        longer content than the first to show that equal height
                                        action.
                                    </CardText>
                                    <CardText>
                                        <small className="text-muted">
                                            Last updated 3 mins ago
                                        </small>
                                    </CardText>
                                </CardBody>
                            </Card>
                        </div>
                    </div>
                </Col>
            </Row>
        </React.Fragment>
    );
}

export default CardGroups;