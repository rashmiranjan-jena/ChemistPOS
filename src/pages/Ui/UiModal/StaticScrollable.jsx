import React, { useState } from "react";
import { Button, Card, CardBody, CardTitle, Col, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

const StaticScrollable = ({ removeBodyCss }) => {

    const [modal_scroll, setModal_scroll] = useState(false);

    const tog_scroll = () => {
        setModal_scroll(!modal_scroll);
        removeBodyCss();
    }

    const [modal_backdrop, setModal_backdrop] = useState(false);

    const tog_backdrop = () => {
        setModal_backdrop(!modal_backdrop);
        removeBodyCss();
    }

    return (
        <React.Fragment>
            <Col lg={6}>
                <Card>
                    <CardBody>
                        <CardTitle className="h5">
                            Scrollable modal
                        </CardTitle>
                        <p className="card-title-desc">You can also create a scrollable modal that allows scroll the modal body by adding <code>.modal-dialog-scrollable</code> to <code>.modal-dialog</code>.</p>
                        <div>
                            <Button type="button" color="primary " onClick={() => { tog_scroll(); }} >Scrollable modal</Button>
                            <Modal isOpen={modal_scroll} toggle={() => { tog_scroll(); }} scrollable={true}>
                                <ModalHeader toggle={() => { tog_scroll(); }}>Scrollable modal</ModalHeader>
                                <ModalBody>
                                    <p>
                                        Cras mattis consectetur purus sit amet fermentum.
                                        Cras justo odio, dapibus ac facilisis in, egestas
                                        eget quam. Morbi leo risus, porta ac consectetur
                                        ac, vestibulum at eros.
                                    </p>
                                    <p>
                                        Praesent commodo cursus magna, vel scelerisque
                                        nisl consectetur et. Vivamus sagittis lacus vel
                                        augue laoreet rutrum faucibus dolor auctor.
                                    </p>
                                    <p>
                                        Aenean lacinia bibendum nulla sed consectetur.
                                        Praesent commodo cursus magna, vel scelerisque
                                        nisl consectetur et. Donec sed odio dui. Donec
                                        ullamcorper nulla non metus auctor fringilla.
                                    </p>
                                    <p>
                                        Cras mattis consectetur purus sit amet fermentum.
                                        Cras justo odio, dapibus ac facilisis in, egestas
                                        eget quam. Morbi leo risus, porta ac consectetur
                                        ac, vestibulum at eros.
                                    </p>
                                    <p>
                                        Praesent commodo cursus magna, vel scelerisque
                                        nisl consectetur et. Vivamus sagittis lacus vel
                                        augue laoreet rutrum faucibus dolor auctor.
                                    </p>
                                    <p>
                                        Aenean lacinia bibendum nulla sed consectetur.
                                        Praesent commodo cursus magna, vel scelerisque
                                        nisl consectetur et. Donec sed odio dui. Donec
                                        ullamcorper nulla non metus auctor fringilla.
                                    </p>
                                    <p>
                                        Cras mattis consectetur purus sit amet fermentum.
                                        Cras justo odio, dapibus ac facilisis in, egestas
                                        eget quam. Morbi leo risus, porta ac consectetur
                                        ac, vestibulum at eros.
                                    </p>
                                    <p>
                                        Praesent commodo cursus magna, vel scelerisque
                                        nisl consectetur et. Vivamus sagittis lacus vel
                                        augue laoreet rutrum faucibus dolor auctor.
                                    </p>
                                    <p>
                                        Aenean lacinia bibendum nulla sed consectetur.
                                        Praesent commodo cursus magna, vel scelerisque
                                        nisl consectetur et. Donec sed odio dui. Donec
                                        ullamcorper nulla non metus auctor fringilla.
                                    </p>
                                    <p>
                                        Cras mattis consectetur purus sit amet fermentum.
                                        Cras justo odio, dapibus ac facilisis in, egestas
                                        eget quam. Morbi leo risus, porta ac consectetur
                                        ac, vestibulum at eros.
                                    </p>
                                    <p>
                                        Praesent commodo cursus magna, vel scelerisque
                                        nisl consectetur et. Vivamus sagittis lacus vel
                                        augue laoreet rutrum faucibus dolor auctor.
                                    </p>
                                    <p>
                                        Aenean lacinia bibendum nulla sed consectetur.
                                        Praesent commodo cursus magna, vel scelerisque
                                        nisl consectetur et. Donec sed odio dui. Donec
                                        ullamcorper nulla non metus auctor fringilla.
                                    </p>
                                    <p>
                                        Cras mattis consectetur purus sit amet fermentum.
                                        Cras justo odio, dapibus ac facilisis in, egestas
                                        eget quam. Morbi leo risus, porta ac consectetur
                                        ac, vestibulum at eros.
                                    </p>
                                    <p>
                                        Praesent commodo cursus magna, vel scelerisque
                                        nisl consectetur et. Vivamus sagittis lacus vel
                                        augue laoreet rutrum faucibus dolor auctor.
                                    </p>
                                    <p>
                                        Aenean lacinia bibendum nulla sed consectetur.
                                        Praesent commodo cursus magna, vel scelerisque
                                        nisl consectetur et. Donec sed odio dui. Donec
                                        ullamcorper nulla non metus auctor fringilla.
                                    </p>
                                    <p>
                                        Cras mattis consectetur purus sit amet fermentum.
                                        Cras justo odio, dapibus ac facilisis in, egestas
                                        eget quam. Morbi leo risus, porta ac consectetur
                                        ac, vestibulum at eros.
                                    </p>
                                    <p>
                                        Praesent commodo cursus magna, vel scelerisque
                                        nisl consectetur et. Vivamus sagittis lacus vel
                                        augue laoreet rutrum faucibus dolor auctor.
                                    </p>
                                    <p>
                                        Aenean lacinia bibendum nulla sed consectetur.
                                        Praesent commodo cursus magna, vel scelerisque
                                        nisl consectetur et. Donec sed odio dui. Donec
                                        ullamcorper nulla non metus auctor fringilla.
                                    </p>
                                    <ModalFooter>
                                        <Button type="button" color="secondary" onClick={() => setmodal_scroll(false)}>
                                            Close
                                        </Button>
                                        <Button type="button" color="primary">
                                            Save changes
                                        </Button>
                                    </ModalFooter>
                                </ModalBody>
                            </Modal>
                        </div>
                    </CardBody>
                </Card>
            </Col>
            <Col lg={6}>
                <Card>
                    <CardBody>
                        <CardTitle>Static Backdrop</CardTitle>
                        <p className="card-title-desc">When backdrop is set to static, the modal will not close when clicking outside it. Click the button below to try it.</p>
                        <div>

                            <Button type="button" color="primary" onClick={() => { tog_backdrop(); }}>
                                Static backdrop modal
                            </Button>
                            <Modal isOpen={modal_backdrop} toggle={() => { tog_backdrop(); }} backdrop={'static'} id="staticBackdrop">
                                <ModalHeader toggle={() => { tog_backdrop(); }}>Modal title</ModalHeader>
                                <ModalBody>
                                    <p>I will not close if you click outside me. Don&apos;t even try to press escape key.</p>
                                </ModalBody>
                                <ModalFooter>
                                    <Button type="button" color="light" onClick={() => { setmodal_backdrop(false); }}>Close</Button>
                                    <Button type="button" color="primary">Understood</Button>
                                </ModalFooter>
                            </Modal>

                        </div>

                    </CardBody>
                </Card>
            </Col>
        </React.Fragment>
    );
}

export default StaticScrollable;