import React, { useEffect, useState } from 'react';
import {
  Button,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from 'reactstrap';

export const CreateBrandModal = ({ open, onClose, onSubmit }) => {
  const [brandName, setBrandName] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (open) {
        if (e.key === 'Escape') {
          onClose();
        } else if (e.key === 'F2') {
          e.preventDefault();
          submitAndClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, brandName]);

  const submitAndClose = () => {
    if (brandName.trim()) {
      onSubmit({ brand_name: brandName });
      setBrandName('');
      onClose();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitAndClose();
  };

  return (
    <Modal isOpen={open} toggle={onClose}>
      <ModalHeader toggle={onClose}>Add New Brand</ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Brand Name *</Label>
            <Input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              required
              autoFocus
            />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter className="d-flex justify-content-between">
        <span className="text-muted">
          * Press <b>ESC</b> to cancel or <b>F2</b> to save
        </span>
        <div>
          <Button color="secondary" onClick={onClose}>Cancel</Button>{' '}
          <Button color="primary" onClick={handleSubmit}>Add Brand</Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};