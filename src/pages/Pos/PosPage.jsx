import React, { useEffect, useState } from "react";
import Category from "../../components/Pos/Category";
import Products from "../../components/Pos/Products";
import Orderlist from "../../components/Pos/Orderlist";
import Header from "../../components/VerticalLayout/Header";
import PosHeader from "../../components/VerticalLayout/PosHeader";
import { getAllPosProducts, getAllProducts } from "../../ApiService/Drugs/Drug";
import DayClosePopup from "../../components/Pos/DayClosePopup";
import { getDayCloseData, submitDayClose } from "../../ApiService/Pos/Pos";
import Swal from "sweetalert2";

export default function PosPage() {
  const [fetchProduct, setFetchProduct] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDayClose, setShowDayClose] = useState(false);
  const [todayData, setTodayData] = useState({
    totalSales: 0,
    cashSales: 0,
    cardSales: 0,
    upiSales: 0,
    creditSales: 0,
    totalPurchases: 0,
    cashInHand: 0,
    totalTransactions: 0,
    totalReturns: 0,
  });

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, page, fetchProduct, search]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await getAllPosProducts(selectedCategory, page, search);
      if (response) {
        console.log(response);
        setProducts(response?.drugs || []);
      }
    } catch (error) {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    daycloseData();
  }, []);

  const daycloseData = async () => {
    try {
      const response = await getDayCloseData();
      if (response) {
        setTodayData({
          totalSales: response.total_sale_amount || 0,
          cashSales: response.cash_amount || 0,
          cardSales: response.card_amount || 0,
          upiSales: response.upi_amount || 0,
          creditSales: response.credit_amount || 0,
          totalTransactions: response.total_bills_count || 0,
          billedCount: response.billed_count || 0,
          unbilledCount: response.unbilled_count || 0,
          cashInHand: response.cash_amount || 0,
          marketDemandSummary: response.market_demand_summary || {},
          walkins: response.walkins || 0,
          status: response.day_close,
        });
      }
    } catch (error) {
      console.error("Error fetching day close data:", error);
    }
  };

  const handleDayCloseClick = async () => {
    setShowDayClose(true);
  };

  const handleDayCloseSubmit = async (data) => {
    console.log(data);
    try {
      const response = await submitDayClose(data);
      if (response) {
        setShowDayClose(false);
        Swal.fire({
          icon: "success",
          title: "Day closed successfully!",
        });
      }
    } catch (error) {
      console.error("Error submitting day close:", error);
    }
  };

  return (
    <React.Fragment>
      <PosHeader handleDayCloseClick={handleDayCloseClick} />
      <div className="container-fluid mt-1">
        {/* Products Section - now takes full width */}
        <div className="row">
          <div className="col-12 mb-0">
            {" "}
            {/* Changed mb-1 to mb-0 */}
            <Products
              fetchProduct={fetchProduct}
              selectedCategory={selectedCategory}
              products={products}
              page={page}
              setPage={setPage}
              setSearch={setSearch}
              search={search}
              loading={loading}
            />
          </div>

          {/* Orderlist Section - now appears below Products */}
          <div className="col-12 mt-0">
            {" "}
            {/* Added mt-0 to remove margin-top */}
            <Orderlist
              setFetchProduct={setFetchProduct}
              fetchProducts={fetchProducts}
              todayData={todayData}
            />
          </div>
        </div>
      </div>

      <DayClosePopup
        show={showDayClose}
        handleClose={() => setShowDayClose(false)}
        handleSubmit={handleDayCloseSubmit}
        todayData={todayData}
      />
    </React.Fragment>
  );
}
