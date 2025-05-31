import React from "react";
import { CardBody, CardText, CardTitle, Card, Col, Row } from "reactstrap";
import img5 from "../../../assets/images/small/img-5.jpg";
import img6 from "../../../assets/images/small/img-6.jpg";
import img7 from "../../../assets/images/small/img-7.jpg";

const CardTitles = () => {
    return (
        <React.Fragment>
            <Row>
                <Col lg={4}>
                    <Card>
                        <img className="card-img img-fluid" src={img5} alt="Skote" />
                        <CardBody>
                            <CardTitle tag="h4" className="mt-0">Card title</CardTitle>
                            <CardText>
                                This is a wider card with supporting text below as a natural
                                lead-in to additional content. This content is a little bit
                                longer.
                            </CardText>
                            <CardText>
                                <small className="text-muted">
                                    Last updated 3 mins ago
                                </small>
                            </CardText>
                        </CardBody>
                    </Card>
                </Col>

                <Col lg={4}>
                    <Card>
                        <CardBody>
                            <CardTitle tag="h4" className="mt-0">Card title</CardTitle>
                            <CardText>
                                This is a wider card with supporting text below as a natural
                                lead-in to additional content. This content is a little bit
                                longer.
                            </CardText>
                            <CardText>
                                <small className="text-muted">
                                    Last updated 3 mins ago
                                </small>
                            </CardText>
                        </CardBody>
                        <img className="card-img img-fluid" src={img7} alt="Skote" />
                    </Card>
                </Col>

                <Col lg={4}>
                    <Card>
                        <img className="card-img img-fluid" src={img6} alt="Skote" />
                        <div className="card-img-overlay">
                            <CardTitle tag="h4" className="text-white mt-0">Card title</CardTitle>
                            <CardText className="text-light">
                                This is a wider card with supporting text below as a natural
                                lead-in to additional content. This content is a little bit
                                longer.
                            </CardText>
                            <CardText>
                                <small className="text-white">
                                    Last updated 3 mins ago
                                </small>
                            </CardText>
                        </div>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    );
}

export default CardTitles;