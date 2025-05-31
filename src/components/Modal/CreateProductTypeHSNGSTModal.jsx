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

export const CreateProductTypeHSNGSTModal = ({ open, onClose, onSubmit }) => {
  const [productTypeName, setProductTypeName] = useState('');
  const [hsnCode, setHsnCode] = useState('');
  const [gstRate, setGstRate] = useState('');

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
  }, [open, productTypeName, hsnCode, gstRate]);

  const submitAndClose = () => {
    if (productTypeName.trim() || hsnCode.trim() || gstRate.trim()) {
      onSubmit({
        product_type_name: productTypeName,
        hsn_code: hsnCode,
        gst_rate: gstRate
      });
      setProductTypeName('');
      setHsnCode('');
      setGstRate('');
      onClose();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitAndClose();
  };

  return (
    <Modal isOpen={open} toggle={onClose}>
      <ModalHeader toggle={onClose}>Add New Product Type/HSN/GST</ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Product Type Name</Label>
            <Input
              type="text"
              value={productTypeName}
              onChange={(e) => setProductTypeName(e.target.value)}
              autoFocus
            />
          </FormGroup>
          <FormGroup>
            <Label>HSN Code</Label>
            <Input
              type="text"
              value={hsnCode}
              onChange={(e) => setHsnCode(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label>GST Rate (%)</Label>
            <Input
              type="number"
              value={gstRate}
              onChange={(e) => setGstRate(e.target.value)}
              min={0}
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
          <Button color="primary" onClick={handleSubmit}>Add Product Type/HSN/GST</Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};