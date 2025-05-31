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

export const CreateProductTypeModal = ({ open, onClose, onSubmit }) => {
  const [productTypeName, setProductTypeName] = useState('');

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
  }, [open, productTypeName]);

  const submitAndClose = () => {
    if (productTypeName.trim()) {
      onSubmit({ product_type_name: productTypeName });
      setProductTypeName('');
      onClose();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitAndClose();
  };

  return (
    <Modal isOpen={open} toggle={onClose}>
      <ModalHeader toggle={onClose}>Add New Product Type</ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Product Type Name *</Label>
            <Input
              type="text"
              value={productTypeName}
              onChange={(e) => setProductTypeName(e.target.value)}
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
          <Button color="primary" onClick={handleSubmit}>Add Product Type</Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};