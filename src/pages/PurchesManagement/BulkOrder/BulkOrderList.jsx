import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Row
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { getSuppliers } from "../../../ApiService/Bulkorder/Bulkorder";

const BulkOrderList = () => {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]); 

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const data = await getSuppliers(); 
        console.log("data---->", data);
        setSuppliers(data); 
      } catch (error) {
        console.error("Failed to fetch suppliers:", error);
      }
    };

    fetchSuppliers();
  }, []); 

  const handleNavigate = (supplierName, supplier_id) => {
    console.log("supplierName---->", supplierName);
    navigate("/supplierproductdetailslist", { state: { suppliername: supplierName, id: supplier_id } });
  };
  
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="GST Master" breadcrumbItem="Bulk Order List" />

          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
                  <CardTitle tag="h4">Bulk Order Details</CardTitle>
                  <p className="card-title-desc mb-4">
                    Click on a supplier card to view more details about their bulk orders.
                  </p>

                  <Row>
                    {suppliers.length > 0 ? (
                      suppliers.map((order) => (
                        <Col md="4" key={order.supplier_id} className="mb-3">
                          <Card
                            onClick={() => handleNavigate(order.supplier_business_name, order.supplier_id)}  
                            style={{
                              borderRadius: "10px",
                              padding: "20px",
                              transition: "transform 0.3s ease, box-shadow 0.3s ease",
                              cursor: "pointer",
                              backgroundColor: "#eef2f7",
                              border: "1px solid #d1e3f0",
                            }}
                          >
                            <CardBody
                              style={{
                                padding: "15px",
                                backgroundColor: "#ffffff",
                                borderRadius: "8px",
                              }}
                            >
                              <h5
                                style={{
                                  fontWeight: "600",
                                  color: "#007bff",
                                  fontSize: "18px",
                                }}
                              >
                                {order.supplier_business_name}
                              </h5>
                              <p
                                style={{
                                  color: "#6c757d",
                                  fontSize: "14px",
                                }}
                              >
                                {order.address}
                              </p>
                            </CardBody>
                          </Card>
                        </Col>
                      ))
                    ) : (
                      <Col xs="12" className="text-center">
                        <p>No data available</p>
                      </Col>
                    )}
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default BulkOrderList;
