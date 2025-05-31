import React from "react";
import { Button, Card, CardBody, CardTitle, Col, Row } from "reactstrap";

const ButtonSizesWidth = () => {
    return (
        <React.Fragment>
            <Row>
                <Col xl={6}>
                    <Card>
                        <CardBody>
                            <CardTitle>Buttons Sizes</CardTitle>
                            <p className="card-title-desc">
                                Add <code>.btn-lg</code> or <code>.btn-sm</code> for
                                additional sizes.
                            </p>

                            <div className="d-flex flex-wrap gap-2 align-items-center">
                                <Button color="primary" className="btn btn-lg ">Large button</Button>
                                <Button color="secondary" className="btn btn-lg ">Large button</Button>
                                <Button color="primary" className="btn-sm">Small button</Button>
                                <Button color="secondary" className=" btn-sm ">Small button</Button>
                            </div>
                        </CardBody>
                    </Card>
                </Col>

                <Col xl={6}>
                    <Card>
                        <CardBody>
                            <CardTitle>Buttons width</CardTitle>
                            <p className="card-title-desc">
                                Add <code>.w-xs</code>, <code>.w-sm</code>,{" "}
                                <code>.w-md</code> and <code> .w-lg</code> className for
                                additional buttons width.
                            </p>

                            <div className="d-flex flex-wrap gap-2">
                                <Button type="button" color="primary" className="w-xs ">Xs</Button>
                                <Button type="button" color="danger" className="w-sm ">Small</Button>
                                <Button type="button" color="warning" className="w-md ">Medium</Button>
                                <Button type="button" color="success" className="w-lg ">Large</Button>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    );
}

export default ButtonSizesWidth;