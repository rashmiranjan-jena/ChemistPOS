import React, { useEffect, useState } from 'react';
import { getCategories } from '../../ApiService/Drugs/Category';

const staticCategories = [
  { category_id: '1', category_name: 'Beverages', image: '' },
  { category_id: '2', category_name: 'Snacks', image: '' },
  { category_id: '3', category_name: 'Dairy', image: '' },
  { category_id: '4', category_name: 'Fruits', image: '' },
];

const getRandomColor = () => {
  const colors = [
    'bg-primary', 'bg-success', 'bg-warning',
    'bg-info', 'bg-danger', 'bg-secondary',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const LetterAvatar = ({ name }) => {
  const [bgColor] = useState(getRandomColor());
  return (
    <div className={`d-flex align-items-center justify-content-center rounded w-100`} style={{ height: '64px', backgroundColor: '#ccc' }}>
      <span className="fs-4 fw-bold text-white">{name.charAt(0).toUpperCase()}</span>
    </div>
  );
};

export default function Category({selectedCategory, setSelectedCategory}) {
  // const [selectedCategory, setSelectedCategory] = useState('');
  const [categories,setCategories] = useState([]);

  useEffect(() => {
    fetchCategories(); // Fetch categories when component mounts
  }, []);

// fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await getCategories(); // Replace with your API endpoint
      if(response) {
      setCategories(response);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]); // Handle error case
    }
  }
  const handleCategoryClick = (categoryId) => {
    console.log("Selected Category ID:", categoryId,selectedCategory);
    
    setSelectedCategory(categoryId === selectedCategory ? selectedCategory : categoryId);
  };

  return (
    // <div
    //   className="position-fixed bg-white border-end overflow-auto"
    //   style={{
    //     // width: "130px",
    //     height: "calc(100vh - 38px)",
    //     marginTop: "20px",
    //   }}
    // >
    <div className="bg-white border-end overflow-auto" 
    style={{
        height: "calc(100vh - 38px)",
        marginTop: "20px",
      }}>
      <div className="d-flex flex-column gap-2 p-2">
        {/* All Categories Button */}
        <button
          className={`btn p-1 rounded text-center ${
            selectedCategory === ""
              ? "border border-primary bg-light shadow-sm"
              : "border"
          }`}
          onClick={() => handleCategoryClick("")}
        >
          <div
            className="rounded bg-light d-flex align-items-center justify-content-center mb-1"
            style={{ width: "100%", height: "64px" }}
          >
            <span style={{ fontSize: "1.5rem" }}>🏪</span>
          </div>
          <span
            className={`small fw-medium ${
              selectedCategory === "" ? "text-primary" : "text-muted"
            }`}
          >
            All
          </span>
        </button>

        {/* Static Category Buttons */}
        {categories.map((category) => (
          <button
            key={category.category_id}
            onClick={() => handleCategoryClick(category.category_id)}
            className={`btn p-1 rounded text-center ${
              selectedCategory === category.category_id
                ? "border border-primary bg-light shadow-sm"
                : "border"
            }`}
          >
            <div className="mb-1">
              {category.category_image ? (
                <img
                  src={`${import.meta.env.VITE_API_BASE_URL}${
                    category.category_image
                  }`}
                  alt={category.category_name}
                  className="img-fluid rounded"
                  style={{
                    width: "100%",
                    height: "64px",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <LetterAvatar name={category.category_name} />
              )}
            </div>
            <span
              className={`small fw-medium ${
                selectedCategory === category.category_id
                  ? "text-primary"
                  : "text-muted"
              }`}
            >
              {category.category_name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
