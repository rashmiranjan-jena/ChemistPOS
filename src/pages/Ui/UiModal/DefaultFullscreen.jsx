import React, { useState } from "react";
import { ModalContent } from "./ModalContent";
import { Button, Card, CardBody, CardTitle, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";

const DefaultFullscreen = ({ removeBodyCss }) => {

    const [modal_standard, setModal_standard] = useState(false);
    const [modal_fullscreen, setModal_fullscreen] = useState(false);

    const tog_standard = () => {
        setModal_standard(!modal_standard);
        removeBodyCss();
    }

    const tog_fullscreen = () => {
        setModal_fullscreen(!modal_fullscreen);
        removeBodyCss();
    }

    return (
        <React.Fragment>
            <Row>
                <Col lg={6}>
                    <Card>
                        <CardBody>
                            <CardTitle className="h4">
                                Default Modal
                            </CardTitle>
                            <p className="card-title-desc">Toggle a working modal demo by clicking the button below. It will slide down and fade in from the top of the page.</p>
                            <div>
                                <Button type="button" onClick={() => { tog_standard(); }} color="primary ">
                                    Standard Modal
                                </Button>

                                <Modal isOpen={modal_standard} toggle={() => { tog_standard(); }}>
                                    <ModalHeader toggle={() => { tog_standard(); }}>
                                        Default Modal Heading
                                    </ModalHeader>
                                    <ModalBody>
                                        <ModalContent />
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button type="button" onClick={() => { tog_standard(); }} color="secondary ">
                                            Close
                                        </Button>
                                        <Button type="button" color="primary ">
                                            Save changes
                                        </Button>
                                    </ModalFooter>
                                </Modal>
                            </div>
                        </CardBody>
                    </Card>
                </Col>

                <Col lg={6}>
                    <Card>
                        <CardBody>
                            <CardTitle className="h4">
                                Fullscreen Modal
                            </CardTitle>
                            <p className="card-title-desc">Another override is the option to pop up a modal that covers the user viewport, available via modifier classes that are placed on a <code>.modal-fullscreen</code>.</p>
                            <div>
                                <Button type="button" onClick={() => { tog_fullscreen(); }} color="primary ">
                                    Fullscreen Modal
                                </Button>
                                <Modal size="xl" isOpen={modal_fullscreen} toggle={() => { tog_fullscreen(); }} className="modal-fullscreen">
                                    <ModalHeader toggle={() => { tog_fullscreen(); }}>
                                        Fullscreen Modal
                                    </ModalHeader>
                                    <ModalBody>
                                        <ModalContent />
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button type="button" onClick={() => { tog_fullscreen(); }} color="secondary ">
                                            Close
                                        </Button>
                                        <Button type="button" color="primary ">
                                            Save changes
                                        </Button>
                                    </ModalFooter>
                                </Modal>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

        </React.Fragment>
    );
}

export default DefaultFullscreen;