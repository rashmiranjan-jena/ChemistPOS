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

export const CreateDrugFormModal = ({ open, onClose, onSubmit }) => {
  const [drugFormName, setDrugFormName] = useState('');

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
  }, [open, drugFormName]);

  const submitAndClose = () => {
    if (drugFormName.trim()) {
      onSubmit({ drug_form_name: drugFormName });
      setDrugFormName('');
      onClose();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitAndClose();
  };

  return (
    <Modal isOpen={open} toggle={onClose}>
      <ModalHeader toggle={onClose}>Add New Drug Form</ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Drug Form Name *</Label>
            <Input
              type="text"
              value={drugFormName}
              onChange={(e) => setDrugFormName(e.target.value)}
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
          <Button color="primary" onClick={handleSubmit}>Add Drug Form</Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};