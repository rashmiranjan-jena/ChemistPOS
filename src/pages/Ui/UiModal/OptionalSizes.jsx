import React from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";

const OptionalSizes = ({ size, isOpen, toggle, title, center }) => {
    return (
        <React.Fragment>
            <Modal size={size} isOpen={isOpen} toggle={toggle} centered={center}>
                <ModalHeader toggle={toggle}>{title}</ModalHeader>
                <ModalBody>
                    <p>Cras mattis consectetur purus sit amet fermentum.
                        Cras justo odio, dapibus ac facilisis in,
                        egestas eget quam. Morbi leo risus, porta ac
                        consectetur ac, vestibulum at eros.</p>
                    <p>Praesent commodo cursus magna, vel scelerisque
                        nisl consectetur et. Vivamus sagittis lacus vel
                        augue laoreet rutrum faucibus dolor auctor.</p>
                    <p className="mb-0">Aenean lacinia bibendum nulla sed consectetur.
                        Praesent commodo cursus magna, vel scelerisque
                        nisl consectetur et. Donec sed odio dui. Donec
                        ullamcorper nulla non metus auctor
                        fringilla.</p>
                </ModalBody>
            </Modal>
        </React.Fragment>
    );
}

export default OptionalSizes;