import React, { useState } from "react";
import { Button, Card, CardBody, CardTitle, Col, Form, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";

const ToggleContent = ({ removeBodyCss }) => {

    const [togModal, setTogModal] = useState(false);
    const [togModal1, setTogModal1] = useState(false);
    const [varyingModal, setVaryingModal] = useState(false);
    const [modal_1, setModal_1] = useState("varying");

    const tog_toggleModal = () => {
        setTogModal(!togModal);
        setTogModal1(false)
        removeBodyCss();
    }

    const tog_toggleModal1 = () => {
        setTogModal1(!togModal1);
        setTogModal(false)
        removeBodyCss();
    }

    const tog_varyingModal = () => {
        setVaryingModal(!varyingModal);
    }

    return (
        <React.Fragment>
            <Row>
                <Col lg={6}>
                    <Card>
                        <CardBody>
                            <CardTitle className="h4">Toggle Between Modals</CardTitle>
                            <p className="card-title-desc">Toggle between multiple modals with some clever placement of the <code>data-bs-target</code> and <code>data-bs-toggle</code> attributes.</p>

                            <div>
                                <Button type="button" color="primary" onClick={() => { tog_toggleModal(); }} className=" waves-effect waves-light">
                                    Open First Modal</Button>
                                <Modal isOpen={togModal} toggle={() => { tog_toggleModal(); }} centered>
                                    <ModalHeader toggle={() => { tog_toggleModal(); }}>Modal 1</ModalHeader>
                                    <ModalBody>
                                        <p>Show a second modal and hide this one with the button below.</p>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="primary" onClick={() => { tog_toggleModal1(); }}>
                                            Open Second Modal</Button>
                                    </ModalFooter>
                                </Modal>

                            </div>

                            <Modal isOpen={togModal1} toggle={() => { tog_toggleModal1(); }} centered>
                                <ModalHeader toggle={() => { tog_toggleModal1(); }}>Modal 2</ModalHeader>
                                <ModalBody>
                                    <p>Hide this modal and show the first with the button below.</p>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="primary" onClick={() => { tog_toggleModal(); }}
                                    >Back to First</Button>
                                </ModalFooter>
                            </Modal>

                        </CardBody>
                    </Card>
                </Col>


                <Col lg={6}>
                    <Card>
                        <CardBody>
                            <CardTitle className="h4">Varying Modal Content</CardTitle>
                            <p className="card-title-desc">Modal of buttons that all trigger the same modal with slightly different contents. Use <code>event.relatedTarget</code> and HTML <code>data-bs-target</code> attributes to vary the contents of the modal depending on which button was clicked.</p>

                            <div>
                                <div className="d-flex flex-wrap gap-3">
                                    <Button type="button" color="primary" onClick={() => { tog_varyingModal(); setModal_1("@mdo") }}>
                                        Open modal for @mdo
                                    </Button>
                                    <Button type="button" color="primary" onClick={() => { tog_varyingModal(); setModal_1("@fat") }}>
                                        Open modal for @fat
                                    </Button>
                                    <Button type="button" color="primary" onClick={() => { tog_varyingModal(); setModal_1("@getbootstrap") }}>
                                        Open modal for @getbootstrap
                                    </Button>
                                </div>

                                <Modal isOpen={varyingModal} toggle={() => { tog_varyingModal() }}>
                                    <ModalHeader toggle={() => { tog_varyingModal() }}>New message {modal_1}</ModalHeader>
                                    <ModalBody>
                                        <Form>
                                            <div className="mb-3">
                                                <label htmlFor="recipient-name" className="col-form-label">Recipient:</label>
                                                <input type="text" className="form-control" id="recipient-name" defaultValue={modal_1} />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="message-text" className="col-form-label">Message:</label>
                                                <textarea className="form-control" id="message-text"></textarea>
                                            </div>
                                        </Form>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button type="button" color="secondary">Close</Button>
                                        <Button type="button" color="primary">Send message</Button>
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

export default ToggleContent;