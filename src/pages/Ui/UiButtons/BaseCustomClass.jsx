import React from "react";
import { Button, Card, CardBody, Col, Row } from "reactstrap";

const BaseCustomClass = () => {
    return (
        <React.Fragment>
            <Row>
                <Col xl={6}>
                    <Card>
                        <CardBody>
                            <h4 className="card-title">Base class</h4>
                            <p className="card-title-desc">Bootstrap has a base <code>.btn</code> class that sets up basic styles such as padding and content alignment. By default, <code>.btn</code> controls have a transparent border and background color, and lack any explicit focus and hover styles.</p>

                            <button type="button" className="btn">Base class</button>

                        </CardBody>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card>
                        <CardBody>
                            <h4 className="card-title">Custom sizing with CSS variables</h4>
                            <p className="card-title-desc">You can even roll your own custom sizing with CSS variables:</p>
                            <div>
                                <Button type="button" color="primary"
                                //  style={{--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: ".75rem"}}
                                >
                                    Custom button
                                </Button>
                            </div>

                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    );
}

export default BaseCustomClass;