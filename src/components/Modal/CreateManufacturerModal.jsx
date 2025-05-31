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

export const CreateManufacturerModal = ({ open, onClose, onSubmit }) => {
  const [manufacturerName, setManufacturerName] = useState('');

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
  }, [open, manufacturerName]);

  const submitAndClose = () => {
    if (manufacturerName.trim()) {
      onSubmit({ manufacturer_name: manufacturerName });
      setManufacturerName('');
      onClose();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitAndClose();
  };

  return (
    <Modal isOpen={open} toggle={onClose}>
      <ModalHeader toggle={onClose}>Add New Manufacturer</ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Manufacturer Name *</Label>
            <Input
              type="text"
              value={manufacturerName}
              onChange={(e) => setManufacturerName(e.target.value)}
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
          <Button color="primary" onClick={handleSubmit}>Add Manufacturer</Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};
