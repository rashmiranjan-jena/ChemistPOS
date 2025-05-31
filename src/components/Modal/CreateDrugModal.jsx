import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Row,
  Col
} from 'reactstrap';
import Select from 'react-select';
import { FaPlusCircle } from 'react-icons/fa';
import { getGST, getManufacturers, postDrug, postManufacturer } from '../../ApiService/Drugs/Drug';
import { getBrands, postBrand } from '../../ApiService/Drugs/BrandForm';
import { getSubCategories } from '../../ApiService/Drugs/Subcategory';
import { getProductTypes } from '../../ApiService/Drugs/ProductType';
import { getDrugs } from '../../ApiService/Drugs/DrugForm';
import { getDrugTypes } from '../../ApiService/Drugs/DrugType';
import { getCategories, postCategory } from '../../ApiService/Drugs/Category';
import { CreateManufacturerModal } from './CreateManufacturerModal';
import { CreateDrugFormModal } from './DrugformNameModel';
import { CreateProductTypeModal } from './ProductTypeModel';
import { CreateCategorySubcategoryModal } from './CategoryModel';
import { CreateBrandModal } from './CreateBrandModal';
import { CreateProductTypeHSNGSTModal } from './CreateProductTypeHSNGSTModal';



const CreateDrugModal = ({ open, onClose, onSubmit }) => {
  const [manufacturerOptions, setManufacturerOptions] = useState([]);
  const [brandOptions, setBrandOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  const [productTypeOptions, setProductTypeOptions] = useState([]);
  const [drugFormOptions, setDrugFormOptions] = useState([]);
  const [drugTypeOptions, setDrugTypeOptions] = useState([]);
  const [hsnOptions, setHsnOptions] = useState([]);
  const [focusedField, setFocusedField] = useState(null);
  const [isManufacturerModalOpen, setIsManufacturerModalOpen] = useState(false);
  const [isDrugFormModalOpen, setIsDrugFormModalOpen] = useState(false);
  const [isProductTypeModalOpen, setIsProductTypeModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isDrugTypeModalOpen, setIsDrugTypeModalOpen] = useState(false);
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
//   const [isCategorySubcategoryModalOpen, setIsCategorySubcategoryModalOpen] = useState(false);
  const [isProductTypeHSNGSTModalOpen, setIsProductTypeHSNGSTModalOpen] = useState(false);
  const [errors, setErrors] = useState({});

  const [drugData, setDrugData] = useState({
    drug_name: '',
    manufacturer_id: '',
    brand: '',
    category: '',
    sub_category: '',
    product_type: '',
    drug_form: '',
    hsn: '',
    drug_type: '',
    max_discount: '',
    returnable: 'yes',
    medi_type: 'medical',
    threshold: 0
  });

  const selectRefs = {
    manufacturer_id: useRef(null),
    brand: useRef(null),
    category: useRef(null),
    sub_category: useRef(null),
    product_type: useRef(null),
    drug_form: useRef(null),
    drug_type: useRef(null),
    hsn: useRef(null)
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (open) {
        if (e.key === 'Escape') {
          if (isManufacturerModalOpen) {
            setIsManufacturerModalOpen(false);
          } else if (isDrugFormModalOpen) {
            setIsDrugFormModalOpen(false);
          } else if (isProductTypeModalOpen) {
            setIsProductTypeModalOpen(false);
          } else if (isCategoryModalOpen) {
            setIsCategoryModalOpen(false);
          } else if (isDrugTypeModalOpen) {
            setIsDrugTypeModalOpen(false);
          } else if (isProductTypeHSNGSTModalOpen) {
            setIsProductTypeHSNGSTModalOpen(false);
          } else {
            onClose();
          }
        } else if (e.key === 'F2') {
          e.preventDefault();
          handleSubmit(new Event('submit'));
        } else if (e.key === 'Insert' && focusedField) {
          e.preventDefault();
          if (focusedField === 'manufacturer_id') {
            setIsManufacturerModalOpen(true);
          } else if (focusedField === 'drug_form') {
            setIsDrugFormModalOpen(true);
          } else if (focusedField === 'product_type') {
            setIsProductTypeModalOpen(true);
          } else if (focusedField === 'category' || focusedField === 'sub_category') {
            setIsCategoryModalOpen(true);
          } else if (focusedField === 'drug_type' || focusedField === 'hsn') {
            setIsProductTypeHSNGSTModalOpen(true);
          }  else if (focusedField === 'brand') {
            setIsBrandModalOpen(true);
          } 
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose, drugData, focusedField, isManufacturerModalOpen]);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [
          manufacturers,
          brands,
          categories,
          subcategories,
          productTypes,
          drugForms,
          drugTypes,
          gstData,
        ] = await Promise.all([
          getManufacturers(1, 100),
          getBrands(1, 100),
          getCategories(),
          getSubCategories(),
          getProductTypes(),
          getDrugs(),
          getDrugTypes(),
          getGST()
        ]);

        setManufacturerOptions(
          manufacturers?.data?.map(m => ({ label: m.manufacturer_name, value: m.manufacturer_id }))
        );
        setBrandOptions(
          brands?.data?.map(b => ({ label: b.brand_name, value: b.brand_id }))
        );
        setCategoryOptions(
          categories?.map(c => ({ label: c.category_name, value: c.category_id }))
        );
        setSubCategoryOptions(
          subcategories?.map(s => ({ label: s.sub_category_name, value: s.sub_category_id }))
        );
        setProductTypeOptions(
          productTypes?.map(p => ({ label: p.product_type_name, value: p.product_type_id }))
        );
        setDrugFormOptions(
          drugForms?.map(f => ({ label: f.drug_form_name, value: f.drug_form_id }))
        );
        setDrugTypeOptions(
          drugTypes?.map(d => ({ label: d.drug_type_name, value: d.drug_type_id }))
        );
        setHsnOptions(
          gstData?.map(h => ({ label: h.hsn, value: h.gst_id }))
        );
      } catch (error) {
        console.error('Failed to fetch dropdown data:', error);
      }
    };

    fetchDropdownData();
  }, []);

  const resetForm = () => {
    setDrugData({
      drug_name: '',
      manufacturer_id: '',
      brand: '',
      category: '',
      sub_category: '',
      product_type: '',
      drug_form: '',
      hsn: '',
      drug_type: '',
      max_discount: '',
      returnable: 'yes',
      medi_type: 'medical',
      threshold: 0
    });
    setErrors({});
  };

  const handleChange = (field, value) => {
    console.log(`Field changed: ${field}, Value: ${value}`);
    setDrugData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!drugData.brand) newErrors.brand = 'Brand is required';
    if (!drugData.sub_category) newErrors.sub_category = 'Subcategory is required';
    if (!drugData.drug_name) newErrors.drug_name = 'Drug name is required';
    if (!drugData.hsn) newErrors.hsn = 'HSN code is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('type', drugData.medi_type);
      formData.append('drug_name', drugData.drug_name ?? '');
      formData.append('manufacturer_id', drugData.manufacturer_id ?? '');
      formData.append('brand', drugData.brand ?? '');
      formData.append('category', drugData.category ?? '');
      formData.append('sub_category', drugData.sub_category ?? '');
      formData.append('product_type', drugData.product_type ?? '');
      formData.append('drug_form', drugData.drug_form ?? '');
      formData.append('hsn', drugData.hsn ?? '');
      formData.append('drug_type', drugData.drug_type ?? '');
      formData.append('max_discount', drugData.max_discount ?? '');
      formData.append('returnable', drugData.returnable === 'yes');
      formData.append('threshold', drugData.threshold ?? 0);

      const response = await postDrug(formData);
      if (response) {
        onSubmit(drugData);
        onClose();
        setIsManufacturerModalOpen(false);
        resetForm();
      } else {
        throw new Error('Failed to save drug');
      }
    } catch (error) {
      console.error('Failed to save drug:', error);
      if (error.response?.data) {
        setErrors(error.response.data);
      }
    }
  };

  const handleManufacturerSubmit = async (newManufacturer) => {
    try {
      const formData = new FormData();
      formData.append('manufacturer_name', newManufacturer.manufacturer_name);

      // Replace with actual postManufacturer API
      const response = await postManufacturer(formData); // TODO: Use postManufacturer
      if (!response) {
        throw new Error('Failed to save manufacturer');
      }

      const savedManufacturer = response;
      setManufacturerOptions(prev => [
        ...prev,
        { label: savedManufacturer.manufacturer_name, value: savedManufacturer.manufacturer_id }
      ]);
      setDrugData(prev => ({ ...prev, manufacturer_id: savedManufacturer.manufacturer_id }));
      setIsManufacturerModalOpen(false);
    } catch (error) {
      console.error('Failed to save manufacturer:', error);
    }
  };

  const handleDrugFormSubmit = async (newDrugForm) => {
    try {
      const formData = new FormData();
      formData.append('drug_form_name', newDrugForm.drug_form_name);

      const response = await postDrugForm(formData);
      if (!response) {
        throw new Error('Failed to save drug form');
      }

      const savedDrugForm = response;
      setDrugFormOptions(prev => [
        ...prev,
        { label: savedDrugForm.drug_form_name, value: savedDrugForm.drug_form_id }
      ]);
      setDrugData(prev => ({ ...prev, drug_form: savedDrugForm.drug_form_id }));
      setIsDrugFormModalOpen(false);
    } catch (error) {
      console.error('Failed to save drug form:', error);
    }
  };
   const handleBrandSubmit = async (newBrand) => {
    try {
      const formData = new FormData();
      formData.append('brand_name', newBrand.brand_name);

      const response = await postBrand(formData);
      if (!response) {
        throw new Error('Failed to save brand');
      }

      const savedBrand = response;
      setBrandOptions(prev => [
        ...prev,
        { label: savedBrand.brand_name, value: savedBrand.brand_id }
      ]);
      setDrugData(prev => ({ ...prev, brand: savedBrand.brand_id }));
      setIsBrandModalOpen(false);
    } catch (error) {
      console.error('Failed to save brand:', error);
    }
  };

  const handleProductTypeSubmit = async (newProductType) => {
    try {
      const formData = new FormData();
      formData.append('product_type_name', newProductType.product_type_name);

      const response = await postProductType(formData);
      if (!response) {
        throw new Error('Failed to save product type');
      }

      const savedProductType = response;
      setProductTypeOptions(prev => [
        ...prev,
        { label: savedProductType.product_type_name, value: savedProductType.product_type_id }
      ]);
      setDrugData(prev => ({ ...prev, product_type: savedProductType.product_type_id }));
      setIsProductTypeModalOpen(false);
    } catch (error) {
      console.error('Failed to save product type:', error);
    }
  };

  const handleCategorySubmit = async (newCategory) => {
    try {
      const formData = new FormData();
      formData.append('category_name', newCategory.category_name);
      formData.append('sub_category_name', newCategory.sub_category_name);

      const response = await postCategory(formData);
      if (!response) {
        throw new Error('Failed to save category');
      }

      const savedCategory = response;
      setCategoryOptions(prev => [
        ...prev,
        { label: savedCategory.category_name, value: savedCategory.category_id }
      ]);
      setDrugData(prev => ({ ...prev, category: savedCategory.category_id }));
      setIsCategoryModalOpen(false);
    } catch (error) {
      console.error('Failed to save category:', error);
    }
  };
  const handleProductTypeHSNGSTSubmit = async (newProductTypeHSNGST) => {
    try {
      const formData = new FormData();
      if (newProductTypeHSNGST.product_type_name) {
        formData.append('product_type_name', newProductTypeHSNGST.product_type_name);
      }
      if (newProductTypeHSNGST.hsn_code) {
        formData.append('hsn_code', newProductTypeHSNGST.hsn_code);
      }
      if (newProductTypeHSNGST.gst_rate) {
        formData.append('gst_rate', newProductTypeHSNGST.gst_rate);
      }

      const response = await postProductTypeHSNGST(formData);
      if (!response) {
        throw new Error('Failed to save product type/HSN/GST');
      }

      const savedData = response;
      if (savedData.product_type) {
        setProductTypeOptions(prev => [
          ...prev,
          { label: savedData.product_type.product_type_name, value: savedData.product_type.product_type_id }
        ]);
        setDrugData(prev => ({ ...prev, product_type: savedData.product_type.product_type_id }));
      }
      if (savedData.hsn) {
        setHsnOptions(prev => [
          ...prev,
          { label: savedData.hsn.hsn_code, value: savedData.hsn.gst_id }
        ]);
        setDrugData(prev => ({ ...prev, hsn: savedData.hsn.gst_id }));
      }
      setIsProductTypeHSNGSTModalOpen(false);
    } catch (error) {
      console.error('Failed to save product type/HSN/GST:', error);
    }
  };


  const renderSelect = (label, field, items) => (
    <FormGroup>
      <Label>{label} {['brand', 'sub_category', 'hsn'].includes(field) ? '*' : ''}</Label>
      <Select
        ref={selectRefs[field]}
        isSearchable
        options={items}
        value={items.find(item => item.value === drugData[field]) || null}
        onChange={(selected) => handleChange(field, selected ? selected.value : '')}
        onFocus={() => setFocusedField(field)}
        onBlur={() => setFocusedField(null)}
        placeholder={`Select ${label}`}
        isClearable
        noOptionsMessage={({ inputValue }) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FaPlusCircle color="green" />
            <span>No match. Add "<strong>{inputValue}</strong>"</span>
          </div>
        )}
        styles={{
          control: (base) => ({
            ...base,
            backgroundColor: 'white',
            borderColor: errors[field] ? 'red' : base.borderColor
          }),
          menu: (base) => ({
            ...base,
            backgroundColor: 'white'
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused ? '#f0f0f0' : 'white',
            color: 'black'
          })
        }}
      />
      {errors[field] && <div style={{ color: 'red', fontSize: '12px' }}>{errors[field]}</div>}
    </FormGroup>
  );

  return (
    <>
      <Modal isOpen={open} toggle={onClose} size="lg">
        <ModalHeader toggle={onClose}>Add New Drug</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label>Drug Name *</Label>
                  <Input
                    type="text"
                    value={drugData.drug_name}
                    onChange={(e) => handleChange('drug_name', e.target.value)}
                    required
                    invalid={!!errors.drug_name}
                  />
                  {errors.drug_name && <div style={{ color: 'red', fontSize: '12px' }}>{errors.drug_name}</div>}
                </FormGroup>
              </Col>
              <Col md={6}>{renderSelect('Manufacturer', 'manufacturer_id', manufacturerOptions)}</Col>
              <Col md={6}>{renderSelect('Brand', 'brand', brandOptions)}</Col>
              <Col md={6}>{renderSelect('Category', 'category', categoryOptions)}</Col>
              <Col md={6}>{renderSelect('Subcategory', 'sub_category', subCategoryOptions)}</Col>
              <Col md={6}>{renderSelect('Product Type', 'product_type', productTypeOptions)}</Col>
              <Col md={6}>{renderSelect('Drug Form', 'drug_form', drugFormOptions)}</Col>
              <Col md={6}>{renderSelect('Drug Type', 'drug_type', drugTypeOptions)}</Col>
              <Col md={6}>{renderSelect('HSN Code', 'hsn', hsnOptions)}</Col>
              <Col md={6}>
                <FormGroup>
                  <Label>Max Discount (%)</Label>
                  <Input
                    type="number"
                    value={drugData.max_discount}
                    onChange={(e) => handleChange('max_discount', e.target.value)}
                    invalid={!!errors.max_discount}
                  />
                  {errors.max_discount && <div style={{ color: 'red', fontSize: '12px' }}>{errors.max_discount}</div>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup tag="fieldset">
                  <Label>Returnable *</Label>
                  <FormGroup check>
                    <Label check>
                      <Input
                        type="radio"
                        name="returnable"
                        value="yes"
                        checked={drugData.returnable === 'yes'}
                        onChange={(e) => console.log(e.target.value) || handleChange('returnable', e.target.value)
                        }
                      />{' '}
                      Yes
                    </Label>
                  </FormGroup>
                  <FormGroup check>
                    <Label check>
                      <Input
                        type="radio"
                        name="returnable"
                        value="no"
                        checked={drugData.returnable === 'no'}
                        onChange={(e) => handleChange('returnable', e.target.value)}
                      />{' '}
                      No
                    </Label>
                  </FormGroup>
                  {errors.returnable && <div style={{ color: 'red', fontSize: '12px' }}>{errors.returnable}</div>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>Medi Type *</Label>
                  <Input
                    type="select"
                    value={drugData.medi_type}
                    onChange={(e) => handleChange('medi_type', e.target.value)}
                    invalid={!!errors.medi_type}
                  >
                    <option value="medical">Medical</option>
                    <option value="nonmedical">Non-Medical</option>
                  </Input>
                  {errors.medi_type && <div style={{ color: 'red', fontSize: '12px' }}>{errors.medi_type}</div>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>Threshold *</Label>
                  <Input
                    type="number"
                    value={drugData.threshold}
                    onChange={(e) => handleChange('threshold', e.target.value)}
                    min={0}
                    invalid={!!errors.threshold}
                  />
                  {errors.threshold && <div style={{ color: 'red', fontSize: '12px' }}>{errors.threshold}</div>}
                </FormGroup>
              </Col>
            </Row>
          </Form>
        </ModalBody>
        <ModalFooter className="d-flex justify-content-between">
          <span className="text-muted">
            * Press <b>ESC</b> to cancel, <b>F2</b> to save, or <b>Insert</b> to add new {focusedField || 'item'}
          </span>
          <div>
            <Button color="secondary" onClick={onClose}>Cancel</Button>{' '}
            <Button color="primary" onClick={handleSubmit}>Create Drug</Button>
          </div>
        </ModalFooter>
      </Modal>
      <CreateManufacturerModal
        open={isManufacturerModalOpen}
        onClose={() => setIsManufacturerModalOpen(false)}
        onSubmit={handleManufacturerSubmit}
      />
       <CreateDrugFormModal
        open={isDrugFormModalOpen}
        onClose={() => setIsDrugFormModalOpen(false)}
        onSubmit={handleDrugFormSubmit}
      />
      <CreateProductTypeModal
        open={isProductTypeModalOpen}
        onClose={() => setIsProductTypeModalOpen(false)}
        onSubmit={handleProductTypeSubmit}
      />
      <CreateCategorySubcategoryModal
        open={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSubmit={handleCategorySubmit}
      />
      <CreateBrandModal
        open={isBrandModalOpen}
        onClose={() => setIsBrandModalOpen(false)}
        onSubmit={handleBrandSubmit}
      />
      <CreateProductTypeHSNGSTModal
        open={isProductTypeHSNGSTModalOpen}
        onClose={() => setIsProductTypeHSNGSTModalOpen(false)}
        onSubmit={handleProductTypeHSNGSTSubmit}
      />
    </>
  );
};

export default CreateDrugModal;