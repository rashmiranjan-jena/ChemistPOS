import React, { useState } from "react";
import PropTypes from 'prop-types';
import ReactApexChart from "react-apexcharts";

const StackedColumnChart = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("Day");

  const dataColors = ["#FF5733", "#33FF57", "#3357FF"]; 
  const revenueData = {
    Day: [100, 150, 200, 250, 300],
    Week: [500, 600, 700, 800, 900, 1000, 1100],
    Month: Array.from({ length: 30 }, (_, i) => 1200 + i * 100),
    Year: [12000, 13000, 14000, 15000, 16000, 17000, 18000, 19000, 20000, 21000, 22000, 23000]
  };

  const periodCategories = {
    Day: ["00:00", "06:00", "12:00", "18:00", "24:00"],
    Week: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    Month: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
    Year: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  };

  const periodData = revenueData?.[selectedPeriod] || [];

  const options = {
    chart: {
      stacked: false, // Line chart does not require stacking
      toolbar: { show: false },
      zoom: { enabled: true }
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: periodCategories[selectedPeriod],
      labels: { show: true }
    },
    colors: dataColors,
    legend: { position: "bottom" },
    fill: {
      type: 'gradient', 
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.2,
        gradientToColors: ['#FF5733', '#33FF57', '#3357FF'],
        inverseColors: true,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100]
      }
    },
    stroke: {
      width: 2, 
      curve: 'smooth' 
    }
  };

  return (
    <React.Fragment>
      <div className="flex space-x-4 mb-4">
        {Object.keys(periodCategories).map((period) => (
          <button
            key={period}
            className={`px-4 py-2 border rounded ${selectedPeriod === period ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            onClick={() => setSelectedPeriod(period)}
          >
            {period}
          </button>
        ))}
      </div>
      <ReactApexChart
        options={options}
        series={[{ name: "Revenue", data: periodData }]}
        type="line" // Set chart type to "line"
        height="359"
        className="apex-charts"
      />
    </React.Fragment>
  );
};

StackedColumnChart.propTypes = {
  revenueData: PropTypes.object.isRequired
};

export default StackedColumnChart;
