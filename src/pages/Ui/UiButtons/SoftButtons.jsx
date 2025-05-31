import React from "react";
import { Button, Card, CardBody, CardTitle, Col, Row } from "reactstrap";

const SoftButtons = () => {
    return (
        <React.Fragment>
            <Row>
                <Col xl={12}>
                    <Card>
                        <CardBody>
                            <CardTitle className="card-title">Soft Buttons</CardTitle>
                            <p className="card-title-desc">Use class <code>.btn-soft*</code> for soft buttons.</p>
                            <div className="d-flex flex-wrap gap-2">
                                <Button type="button" className="btn btn-soft-primary waves-effect waves-light">Primary</Button>
                                <Button type="button" className="btn btn-soft-secondary waves-effect waves-light">Secondary</Button>
                                <Button type="button" className="btn btn-soft-success waves-effect waves-light">Success</Button>
                                <Button type="button" className="btn btn-soft-info waves-effect waves-light">Info</Button>
                                <Button type="button" className="btn btn-soft-warning waves-effect waves-light">Warning</Button>
                                <Button type="button" className="btn btn-soft-danger waves-effect waves-light">Danger</Button>
                                <Button type="button" className="btn btn-soft-dark waves-effect waves-light">Dark</Button>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    );
}

export default SoftButtons;