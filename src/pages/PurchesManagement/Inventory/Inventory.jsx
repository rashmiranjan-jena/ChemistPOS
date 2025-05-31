import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Table, Card, CardBody } from "reactstrap";
import { FaEye, FaEdit, FaTrash, FaDownload } from "react-icons/fa";
import Barcode from "react-barcode";
import jsPDF from "jspdf";
import JsBarcode from "jsbarcode";
import Breadcrumbs from "../../../components/Common/Breadcrumb";

const Inventory = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/stock-inventory/`
        );
        setInventoryData(response?.data);
      } catch (error) {
        console.error("Error fetching inventory data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleView = (id) => {
    alert(`View Inventory with ID: ${id}`);
  };

  const handleEdit = (id) => {
    alert(`Edit Inventory with ID: ${id}`);
  };

  const handleDelete = (id) => {
    alert(`Delete Inventory with ID: ${id}`);
  };

  const handleDownloadBarcode = (
  barcodeValue,
  mrp,
  itemCode,
  subCategory,
  productName,
  businessName
) => {
  console.log("Business Name:", businessName); // Debugging
  const canvas = document.createElement("canvas");

  JsBarcode(canvas, barcodeValue, {
    format: "CODE128",
    displayValue: false,
    width: 1.5,
    height: 40,
    margin: 5,
    scale: 2,
  });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF({
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.width;
  const margin = 10;
  const barcodeWidth = 60;
  const barcodeHeight = 30;
  const xOffset = margin;
  const yOffset = margin;
  const centerText = (text, yOffsetIncrease, fontSize = 10) => {
    if (!text) return;
    pdf.setFontSize(fontSize);
    const textWidth =
      (pdf.getStringUnitWidth(text) * pdf.internal.getFontSize()) /
      pdf.internal.scaleFactor;
    const xCentered = xOffset + (barcodeWidth - textWidth) / 2;
    pdf.text(text, xCentered, yOffset + barcodeHeight + yOffsetIncrease);
  };

  if (businessName) {
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    const businessTextWidth =
      (pdf.getStringUnitWidth(businessName) * pdf.internal.getFontSize()) /
      pdf.internal.scaleFactor;
    const businessX = xOffset + (barcodeWidth - businessTextWidth) / 2;
    pdf.text(businessName, businessX, yOffset - 3);
  }
  pdf.addImage(imgData, "PNG", xOffset, yOffset, barcodeWidth, barcodeHeight);
  centerText(barcodeValue, 3, 9);
  centerText(subCategory, 8, 10);
  centerText(productName, 10, 5); 
  centerText(itemCode, 12, 5); 
  centerText(`MRP ${mrp}`, 16, 8);

  pdf.save(`Barcode_${barcodeValue}.pdf`);
};
 

  const bulkDownloadBarcodes = () => {
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.width;
    const margin = 10;
    const barcodeWidth = (pageWidth - 3 * margin) / 2;
    const barcodeHeight = 20;
    let xOffset = margin;
    let yOffset = margin;

    for (const item of inventoryData) {
      for (const barcode of item.barcodes) {
        const canvas = document.createElement("canvas");

        JsBarcode(canvas, barcode.barcode, {
          format: "CODE128",
          displayValue: false,
          width: 2,
          height: 30,
          margin: 5,
          scale: 3,
        });

        const imgData = canvas.toDataURL("image/png");

        // Add Business Name on top
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(12);
        const businessTextWidth =
          (pdf.getStringUnitWidth(item.business_name) *
            pdf.internal.getFontSize()) /
          pdf.internal.scaleFactor;
        const businessX = xOffset + (barcodeWidth - businessTextWidth) / 2;
        pdf.text(item.business_name, businessX, yOffset - 3);

        // Add Barcode Image
        pdf.addImage(
          imgData,
          "PNG",
          xOffset,
          yOffset,
          barcodeWidth,
          barcodeHeight
        );

        // Center Text Function
        const centerText = (text, yOffsetIncrease, fontSize = 10) => {
          pdf.setFontSize(fontSize);
          const textWidth =
            (pdf.getStringUnitWidth(text) * pdf.internal.getFontSize()) /
            pdf.internal.scaleFactor;
          const xCentered = xOffset + (barcodeWidth - textWidth) / 2;
          pdf.text(text, xCentered, yOffset + barcodeHeight + yOffsetIncrease);
        };

        centerText(barcode.barcode, 3, 9);
        centerText(item.sub_category_name, 8, 10);
        centerText(item.product_name, 12, 8);
        centerText(item.item_code, 16, 8);
        centerText(`MRP ${item.mrp}`, 20, 10);
        if (xOffset === margin) {
          xOffset += barcodeWidth + margin;
        } else {
          xOffset = margin;
          yOffset += barcodeHeight + 40;
        }

        if (yOffset + barcodeHeight > 280) {
          pdf.addPage();
          xOffset = margin;
          yOffset = margin;
        }
      }
    }

    pdf.save("All_Barcodes_A4.pdf");
  };

  return (
    <div className="page-content">
      {/* Breadcrumb */}
      <Breadcrumbs title="Inventory" breadcrumbItem="All Inventory" />

      <Card className="shadow">
        <CardBody>
          <h5 className="card-title">Inventory Table</h5>

          {/* Bulk Download Button */}
          <div className="d-flex justify-content-end mb-3">
            <Button color="primary" onClick={bulkDownloadBarcodes}>
              Bulk Download Barcodes
            </Button>
          </div>

          <div className="table-responsive" style={{ maxHeight: "300px" }}>
            <Table bordered hover responsive className="custom-table">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Item Code</th>
                  <th>Category</th>
                  <th>Sub-Category</th>
                  <th>Brand</th>
                  <th>MRP</th>
                  <th>Barcodes</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center">
                      Loading data...
                    </td>
                  </tr>
                ) : inventoryData.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No Inventory available.
                    </td>
                  </tr>
                ) : (
                  inventoryData?.map((item, index) => (
                    <tr key={item.Stock_Inventory_id}>
                      <td>{index + 1}</td>
                      <td>{item.item_code}</td>
                      <td>{item.category_name}</td>
                      <td>{item.sub_category_name}</td>
                      <td>{item.brand_name}</td>
                      <td>Rs {item.mrp}</td>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "2px",
                          }}
                        >
                          {item.barcodes.map((barcode, barcodeIndex) => (
                            <div
                              key={barcodeIndex}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "2px",
                              }}
                            >
                              <div
                                id={`barcode-${barcode.barcode_number.replace(
                                  /[^a-zA-Z0-9-_]/g,
                                  "_"
                                )}`}
                                style={{ textAlign: "center" }}
                              >
                                {/* Display Business Name Above Barcode */}
                                <p
                                  style={{
                                    margin: 0,
                                    fontSize: "10px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {item.business_name}
                                </p>

                                {/* Barcode Component */}
                                <Barcode
                                  value={barcode.barcode}
                                  width={0.4}
                                  height={40}
                                  fontSize={6}
                                />

                                {/* Additional Details */}
                                <div
                                  style={{
                                    lineHeight: "1",
                                    fontSize: "10px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  <p
                                    style={{
                                      margin: 0,
                                      fontSize: "10px",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {item.sub_category_name}
                                  </p>
                                  <p style={{ margin: 0 }}>MRP {item.mrp}</p>
                                  <p
                                    style={{
                                      margin: 0,
                                      fontSize: "5px",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {item.item_code}
                                  </p>
                                </div>
                              </div>

                              <Button
                                color="link"
                                onClick={() =>
                                  handleDownloadBarcode(
                                    barcode.barcode,
                                    item.mrp,
                                    item.item_code,
                                    item.sub_category_name,
                                    item.product_name,
                                    item.business_name
                                  )
                                }
                                className="text-info"
                              >
                                <FaDownload size={16} />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </td>

                      <td>
                        <Button
                          color="link"
                          onClick={() => handleView(item.Stock_Inventory_id)}
                          className="text-primary"
                        >
                          <FaEye size={20} />
                        </Button>{" "}
                        <Button
                          color="link"
                          onClick={() => handleEdit(item.Stock_Inventory_id)}
                          className="text-warning"
                        >
                          <FaEdit size={20} />
                        </Button>{" "}
                        <Button
                          color="link"
                          onClick={() => handleDelete(item.Stock_Inventory_id)}
                          className="text-danger"
                        >
                          <FaTrash size={20} />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Inventory;
