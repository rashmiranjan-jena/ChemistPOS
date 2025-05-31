import React from "react";
import { Card, CardBody, CardHeader, Col } from "reactstrap";

const QuoteCard = () => {
    return (
        <React.Fragment>
            <Col lg={4}>
                <Card>
                    <CardHeader className="bg-transparent border-bottom">Quote</CardHeader>
                    <CardBody>
                        <blockquote className="card-blockquote mb-0">
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                Integer posuere erat a ante.
                            </p>
                            <footer className="blockquote-footer mt-0 font-size-12"> Someone famous in
                                <cite title="Source Title"> Source Title</cite>
                            </footer>
                        </blockquote>
                    </CardBody>
                </Card>
            </Col>
        </React.Fragment>
    );
}

export default QuoteCard;