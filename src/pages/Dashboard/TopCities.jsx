import React, { useState } from "react";
import { Card, CardBody, CardTitle, Progress } from "reactstrap";
import { Link } from "react-router-dom";

const topSellingProducts = [
  { name: "iPhone 13 Pro", sales: 3456, progress: { value: 80, color: "primary" } },
  { name: "Samsung Galaxy S21", sales: 2900, progress: { value: 70, color: "success" } },
  { name: "MacBook Pro 16", sales: 2500, progress: { value: 60, color: "info" } },
  { name: "Sony PlayStation 5", sales: 2000, progress: { value: 50, color: "warning" } },
  { name: "Nike Air Jordan", sales: 1500, progress: { value: 40, color: "danger" } },
  { name: "Dell XPS 13", sales: 1400, progress: { value: 35, color: "secondary" } },
  { name: "Adidas UltraBoost", sales: 1200, progress: { value: 30, color: "dark" } },
  { name: "Bose QuietComfort", sales: 1000, progress: { value: 25, color: "primary" } },
];

const TopCities = () => {
  const [showAll, setShowAll] = useState(false);
  const visibleProducts = showAll ? topSellingProducts : topSellingProducts.slice(0, 3);

  return (
    <Card>
      <CardBody>
        <CardTitle className="mb-4">Top Selling Products</CardTitle>
        <div className="text-center">
          <div className="mb-4">
            <i className="bx bx-cart text-primary display-4" />
          </div>
          <h3>{topSellingProducts[0].sales}</h3>
          <p>{topSellingProducts[0].name}</p>
        </div>

        {/* Scrollable List */}
        <div
          className="table-responsive mt-4"
          style={{
            maxHeight: "300px",
            overflowY: showAll ? "auto" : "hidden",
            transition: "max-height 0.3s ease",
          }}
        >
          <table className="table align-middle table-nowrap">
            <tbody>
              {visibleProducts.map((item, index) => (
                <tr key={index}>
                  <td style={{ width: "30%" }}>
                    <p className="mb-0">{item.name}</p>
                  </td>
                  <td style={{ width: "25%" }}>
                    <h5 className="mb-0">{item.sales}</h5>
                  </td>
                  <td>
                    <Progress
                      value={item.progress.value}
                      color={item.progress.color}
                      className="bg-transparent progress-sm"
                      size="sm"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* View More Link */}
        <div className="text-center mt-3">
          <Link
            to=""
            className="btn btn-primary btn-sm"
            onClick={(e) => {
              e.preventDefault();
              setShowAll(!showAll);
            }}
          >
            {showAll ? "Show Less" : "View More"} <i className="mdi mdi-arrow-right ms-1" />
          </Link>
        </div>
      </CardBody>
    </Card>
  );
};

export default TopCities;
