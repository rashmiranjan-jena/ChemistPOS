import React from "react";
import { Card, CardBody, CardHeader, CardText, CardTitle, Col } from "reactstrap";

const CardColor = ({ color, className }) => {
    return (
        <React.Fragment>
            <Col lg={4}>
                <Card color={color?.toLowerCase()} className={className}>
                    <CardBody>
                        <h5 className={`mb-4 ${color === "Dark" ? "text-light" : "text-white"}`}>
                            <i className="mdi mdi-bullseye-arrow me-3" /> {color} Card
                        </h5>
                        <CardText>
                            Some quick example text to build on the card title and make
                            up the bulk of the card&apos;s content.
                        </CardText>
                    </CardBody>
                </Card>
            </Col>

        </React.Fragment>
    );
}

const CardColorOutline = ({ border }) => {
    return (
        <React.Fragment>
            <Col lg={4}>
                <Card color={border?.toLowerCase()} outline className="border">
                    <CardHeader className="bg-transparent">
                        <h5 className={"my-0 text-" + border}>
                            <i className="mdi mdi-bullseye-arrow me-3" />{border}  outline Card
                        </h5>
                    </CardHeader>
                    <CardBody>
                        <CardTitle tag="h5">card title</CardTitle>
                        <CardText>
                            Some quick example text to build on the card title and make
                            up the bulk of the card&apos;s content.
                        </CardText>
                    </CardBody>
                </Card>
            </Col>

        </React.Fragment>
    );
}


export { CardColor, CardColorOutline };

