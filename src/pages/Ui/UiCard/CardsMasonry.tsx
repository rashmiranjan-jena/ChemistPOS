import React from "react";
import { Card, CardBody, Col, Row } from "reactstrap";
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

// img
import img3 from "../../../assets/images/small/img-3.jpg";
import img5 from "../../../assets/images/small/img-5.jpg";
import img7 from "../../../assets/images/small/img-7.jpg";

const CardsMasonry = () => {
    return (
        <React.Fragment>
            <Row>
                <Col sm={12}>
                    <h4 className="my-3">Cards Masonry</h4>
                    <Row data-masonry='{"percentPosition": true }'>
                        <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }} >
                            <Masonry columnsCount={3} gutter="24px">
                                <Card>
                                    <img src={img3} className="card-img-top" alt="..." />
                                    <CardBody>
                                        <h5 className="card-title">Card title that wraps to a new line</h5>
                                        <p className="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                                    </CardBody>
                                </Card>
                                <Card>
                                    <img src={img5} className="card-img-top" alt="..." />
                                    <CardBody>
                                        <h5 className="card-title">Card title</h5>
                                        <p className="card-text">This card has supporting text below as a natural lead-in to additional content.</p>
                                        <p className="card-text"><small className="text-muted">Last updated 3 mins ago</small></p>
                                    </CardBody>
                                </Card>
                                <Card>
                                    <img src={img7} className="card-img-top" alt="..." />
                                </Card>
                                <Card>
                                    <CardBody>
                                        <blockquote className="blockquote font-size-14 mb-0">
                                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
                                            <footer className="blockquote-footer mt-0 font-size-12">
                                                Someone famous in <cite title="Source Title">Source Title</cite>
                                            </footer>
                                        </blockquote>
                                    </CardBody>
                                </Card>
                                <div className="card bg-primary text-white text-center p-3">
                                    <blockquote className="card-blockquote font-size-14 mb-0">
                                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat.</p>
                                        <footer className="blockquote-footer mt-0 text-white font-size-12 mb-0">
                                            Someone famous in <cite title="Source Title">Source Title</cite>
                                        </footer>
                                    </blockquote>
                                </div>
                                <div className="card p-3 text-end">
                                    <blockquote className="blockquote blockquote-reverse  mb-0">
                                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
                                        <footer className="blockquote-footer mt-0">
                                            <small className="text-muted">
                                                Someone famous in <cite title="Source Title">Source Title</cite>
                                            </small>
                                        </footer>
                                    </blockquote>
                                </div>
                                <Card>
                                    <CardBody>
                                        <h5 className="card-title">Card title</h5>
                                        <p className="card-text">This is another card with title and supporting text below. This card has some additional content to make it slightly taller overall.</p>
                                        <p className="card-text"><small className="text-muted">Last updated 3 mins ago</small></p>
                                    </CardBody>
                                </Card>
                                <Card>
                                    <CardBody>
                                        <h5 className="card-title">Card title</h5>
                                        <p className="card-text">This card has a regular title and short paragraphy of text below it.</p>
                                        <p className="card-text"><small className="text-muted">Last updated 3 mins ago</small></p>
                                    </CardBody>
                                </Card>
                            </Masonry>
                        </ResponsiveMasonry>
                    </Row>
                </Col>
            </Row>
        </React.Fragment>
    );
}

export default CardsMasonry;