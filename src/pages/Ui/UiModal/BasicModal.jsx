import React from "react";
import { Button, Card, CardBody, CardTitle, Col, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";

const BasicModal = () => {
    return (
        <React.Fragment>
            <Row>
                <Col className="col-12">
                    <Card>
                        <CardBody>
                            <CardTitle className="h4">Modals Examples</CardTitle>
                            <p className="card-title-desc">
                                Modals are streamlined, but flexible dialog prompts
                                powered by JavaScript. They support a number of use cases
                                from user notification to completely custom content and
                                feature a handful of helpful subcomponents, sizes, and
                                more.
                            </p>

                            <div
                                className="modal bs-example-modal"

                                role="dialog"
                            >
                                <div className="modal-dialog" role="document">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title">Modal title</h5>
                                            <button
                                                type="button"
                                                className="btn-close"
                                                data-dismiss="modal"
                                                aria-label="Close"
                                            >
                                            </button>
                                        </div>
                                        <ModalBody>
                                            <p>One fine body&hellip;</p>
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button type="button" color="primary">
                                                Save changes
                                            </Button>
                                            <Button
                                                type="button"
                                                color="secondary"
                                                data-dismiss="modal"
                                            >
                                                Close
                                            </Button>
                                        </ModalFooter>
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    );
}

export default BasicModal;