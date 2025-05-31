import React, { useEffect, useState } from "react";
import { Button, Table, Card, CardBody } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import Swal from "sweetalert2";
import {
  getProductCategories,
  deleteProductCategory,
} from "../../../ApiService/ProductMaster/ProductMaster";

const ProductMasterlist = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProductCategories();
        console.log(response);
        setProducts(response);
      } catch (error) {
        console.error("Error fetching products:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to fetch products. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };

    fetchProducts();
  }, []);

  const handleAddDeal = () => {
    navigate("/productmaster");
  };

  // const handleView = (id) => {
  //   alert(`View Product with ID: ${id}`);
  // };

  const handleEdit = (id) => {
    navigate("/productmaster",  { state: { id }})
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete this product.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    });

    if (result.isConfirmed) {
      const doubleCheck = await Swal.fire({
        title: "Are you absolutely sure?",
        text: "This action cannot be undone!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, keep it",
      });

      if (doubleCheck.isConfirmed) {
        try {
          const response = await deleteProductCategory(id);
          if (response.status === 204) {
            setProducts(
              products.filter((product) => product.productCategory_id !== id)
            );
            Swal.fire("Deleted!", `Product has been deleted.`, "success");
          } else {
            Swal.fire("Failed!", "Failed to delete product.", "error");
          }
        } catch (error) {
          console.error("Error deleting product:", error);
          Swal.fire(
            "Error!",
            "An error occurred while deleting the product.",
            "error"
          );
        }
      } else {
        Swal.fire("Cancelled", "Your product is safe.", "info");
      }
    } else {
      Swal.fire("Cancelled", "Your product is safe.", "info");
    }
  };

  return (
    <div className="page-content">
      <Breadcrumbs title="Product Categories" breadcrumbItem="All Categories" />

      <Card className="shadow">
        <CardBody>
          <div className="d-flex justify-content-between mb-4">
            <h4 className="text-primary">Product Master</h4>
            <Button color="primary" onClick={handleAddDeal}>
              <FaPlus className="mr-2" /> Add Product
            </Button>
          </div>

          <div
            className="table-responsive"
            style={{ maxHeight: "500px", overflowY: "auto" }}
          >
            <Table bordered hover responsive className="custom-table">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Category</th>
                  <th>Variants</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {products && products.length > 0 ? (
                  products.map((product, index) => (
                    <tr key={product.productCategory_id}>
                      <td>{index + 1}</td>
                      <td>{product.category_name}</td>
                      <td>
                        {product.varient_data.map((variant) => (
                          <div key={variant.varientid}>
                            {variant.varientname}
                          </div>
                        ))}
                      </td>
                      <td>
                        <Button
                          color="link"
                          onClick={() => handleEdit(product.productCategory_id)}
                          className="text-warning"
                        >
                          <FaEdit size={20} />
                        </Button>{" "}
                        <Button
                          color="link"
                          onClick={() =>
                            handleDelete(product.productCategory_id)
                          }
                          className="text-danger"
                        >
                          <FaTrash size={20} />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center text-muted">
                      No product data found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default ProductMasterlist;
