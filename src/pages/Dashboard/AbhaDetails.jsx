import React, { useState, useEffect } from "react";
import { Card, CardBody, Spinner, Button } from "reactstrap";
import PropTypes from "prop-types";
import {
  getAbha,
  downloadBill,
  downloadAbha,
} from "../../ApiService/ChemistDashboard/AbhaDetails";

const AbhaDetails = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [downloadError, setDownloadError] = useState(null);

  useEffect(() => {
    const fetchAbhaDetails = async () => {
      try {
        setLoading(true);
        const responseData = await getAbha(startDate, endDate);
        const fetchedData = responseData ?? null;
        setData(fetchedData);
        setLoading(false);
      } catch (err) {
        setError(err?.message ?? "Failed to fetch Abha details");
        setLoading(false);
      }
    };

    fetchAbhaDetails();
  }, [startDate, endDate]);

  const handleDownload = async (downloadFunc, fileName) => {
    try {
      setDownloadError(null);
      const blob = await downloadFunc(startDate, endDate);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setDownloadError(err?.message ?? `Failed to download ${fileName}`);
    }
  };

  return (
    <Card
      className="glass-card mb-3 uniform-height"
      style={{ overflow: "hidden" }}
    >
      <CardBody className="compact-card" style={{ padding: "1rem" }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0" style={{ color: "#2d3748" }}>
            ABHA Details
          </h5>
          <div className="d-flex gap-1">
            <Button
              color="primary"
              size="sm"
              className="rounded"
              style={{ backgroundColor: "#6b46c1", border: "none" }}
              onClick={() => handleDownload(downloadBill, "bill_report.xlsx")}
              disabled={loading}
            >
             Bill List
            </Button>
            <Button
              color="primary"
              size="sm"
              className="rounded"
              style={{ backgroundColor: "#6b46c1", border: "none" }}
              onClick={() => handleDownload(downloadAbha, "abha_report.xlsx")}
              disabled={loading}
            >
            ABHA List
            </Button>
          </div>
        </div>
        {downloadError && (
          <div
            className="text-center mb-3"
            style={{ color: "#9b2c2c", fontSize: "14px" }}
          >
            {downloadError}
          </div>
        )}
        <div className="mb-3 d-flex gap-2">
          <div>
            <label
              htmlFor="startDate"
              style={{ color: "#4a5568", fontSize: "14px" }}
            >
              Start Date:
            </label>
            <input
              type="date"
              id="startDate"
              className="p-2 rounded"
              style={{
                backgroundColor: "rgba(108, 70, 193, 0.05)",
                color: "#4a5568",
                border: "none",
                width: "100%",
              }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="endDate"
              style={{ color: "#4a5568", fontSize: "14px" }}
            >
              End Date:
            </label>
            <input
              type="date"
              id="endDate"
              className="p-2 rounded"
              style={{
                backgroundColor: "rgba(108, 70, 193, 0.05)",
                color: "#4a5568",
                border: "none",
                width: "100%",
              }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
        <div
          className="scrollable-container"
          style={{
            maxHeight: "200px",
            overflowY: "auto",
            scrollbarWidth: "thin",
            scrollbarColor: "#6b46c1 rgba(108, 70, 193, 0.05)",
          }}
        >
          {loading ? (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ minHeight: "150px" }}
            >
              <Spinner
                color="primary"
                style={{ width: "3rem", height: "3rem" }}
              />
            </div>
          ) : error ? (
            <div
              className="text-center"
              style={{
                color: "#4a5568",
                fontSize: "14px",
                minHeight: "150px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {error}
            </div>
          ) : data ? (
            <div className="d-flex flex-column gap-2">
              <div
                className="d-flex align-items-center p-2 rounded"
                style={{ backgroundColor: "rgba(108, 70, 193, 0.05)" }}
              >
                <div
                  className="p-2 rounded me-3"
                  style={{ backgroundColor: "rgba(108, 70, 193, 0.33)" }}
                >
                  <span style={{ color: "#6b46c1" }}>📊</span>
                </div>
                <div>
                  <h6
                    className="mb-1"
                    style={{ color: "#4a5568", fontSize: "14px" }}
                  >
                    Abha Count
                  </h6>
                  <h5
                    className="mb-0"
                    style={{ color: "#2d3748", fontSize: "16px" }}
                  >
                    {data?.abha_count ?? "N/A"}
                  </h5>
                </div>
              </div>
              <div
                className="d-flex align-items-center p-2 rounded"
                style={{ backgroundColor: "rgba(108, 70, 193, 0.05)" }}
              >
                <div
                  className="p-2 rounded me-3"
                  style={{ backgroundColor: "rgba(108, 70, 193, 0.33)" }}
                >
                  <span style={{ color: "#6b46c1" }}>📋</span>
                </div>
                <div>
                  <h6
                    className="mb-1"
                    style={{ color: "#4a5568", fontSize: "14px" }}
                  >
                    Bill Count
                  </h6>
                  <h5
                    className="mb-0"
                    style={{ color: "#2d3748", fontSize: "16px" }}
                  >
                    {data?.bill_count ?? "N/A"}
                  </h5>
                </div>
              </div>
              <div
                className="d-flex align-items-center p-2 rounded"
                style={{ backgroundColor: "rgba(108, 70, 193, 0.05)" }}
              >
                <div
                  className="p-2 rounded me-3"
                  style={{ backgroundColor: "rgba(108, 70, 193, 0.33)" }}
                >
                  <span style={{ color: "#6b46c1" }}>₹</span>
                </div>
                <div>
                  <h6
                    className="mb-1"
                    style={{ color: "#4a5568", fontSize: "14px" }}
                  >
                    Amount
                  </h6>
                  <h5
                    className="mb-0"
                    style={{ color: "#2d3748", fontSize: "16px" }}
                  >
                    ₹{data?.amount?.toFixed(2) ?? "N/A"}
                  </h5>
                </div>
              </div>
            </div>
          ) : (
            <div
              className="text-center"
              style={{
                color: "#4a5568",
                fontSize: "14px",
                minHeight: "150px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              No data available for the selected date range
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

AbhaDetails.propTypes = {};

export default AbhaDetails;
