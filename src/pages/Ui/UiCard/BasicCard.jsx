import React from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, CardImg, CardSubtitle, CardText, CardTitle, Col, Row } from "reactstrap";

// IMage
import img1 from "../../../assets/images/small/img-1.jpg";
import img2 from "../../../assets/images/small/img-2.jpg";
import img3 from "../../../assets/images/small/img-3.jpg";
import img4 from "../../../assets/images/small/img-4.jpg";

const BasicCard = () => {
    return (
        <React.Fragment>

            <Row>
                <Col md={6} xl={3}>
                    <Card>
                        <CardImg top className="img-fluid" src={img1} alt="Skote" />
                        <CardBody>
                            <CardTitle className="mt-0">Card title</CardTitle>
                            <CardText>
                                Some quick example text to build on the card title and make
                                up the bulk of the card&apos;s content.
                            </CardText>
                            <Link
                                to="#"
                                className="btn btn-primary"
                            >
                                Button
                            </Link>
                        </CardBody>
                    </Card>
                </Col>
                <Col md={6} xl={3}>
                    <Card>
                        <CardImg top className="img-fluid" src={img2} alt="Skote" />
                        <CardBody>
                            <CardTitle className="mt-0">Card title</CardTitle>
                            <CardText>
                                Some quick example text to build on the card title and make
                                up the bulk of the card&apos;s content.
                            </CardText>
                        </CardBody>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item">Cras justo odio</li>
                            <li className="list-group-item">Dapibus ac facilisis in</li>
                        </ul>
                        <CardBody>
                            <Link to="#" className="card-link">
                                Card link
                            </Link>
                            <Link to="#" className="card-link">
                                Another link
                            </Link>
                        </CardBody>
                    </Card>
                </Col>

                <Col md={6} xl={3}>
                    <Card>
                        <CardImg top className="img-fluid" src={img3} alt="Skote" />
                        <CardBody>
                            <CardText>
                                Some quick example text to build on the card title and make
                                up the bulk of the card&apos;s content.
                            </CardText>
                        </CardBody>
                    </Card>
                </Col>
                <Col md={6} xl={3}>
                    <Card>
                        <CardBody>
                            <CardTitle>Card title</CardTitle>
                            <CardSubtitle className="font-14 text-muted">
                                Support card subtitle
                            </CardSubtitle>
                        </CardBody>
                        <CardImg className="img-fluid" src={img4} alt="Skote" />
                        <CardBody>
                            <CardText>
                                Some quick example text to build on the card title and make
                                up the bulk of the card&apos;s content.
                            </CardText>
                            <Link to="#" className="card-link">
                                Card link
                            </Link>
                            <Link to="#" className="card-link">
                                Another link
                            </Link>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    );
}

export default BasicCard;