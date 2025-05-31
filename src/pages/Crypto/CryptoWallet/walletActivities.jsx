import React, { useEffect, useState } from "react";
import { useMemo } from "react";
import PropTypes from "prop-types";
import { Card, CardBody, NavItem, NavLink } from "reactstrap";
import classnames from "classnames";

import TableContainer from "../../../components/Common/TableContainer";

import Spinners from "../../../components/Common/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { getCryptoProducts as onGetCryptoProducts } from "../../../store/actions";
import { Link } from "react-router-dom";
import { createSelector } from "reselect";

const WalletActivities = ({ isLoading, setLoading }) => {

  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("all");

  const CryptoProperties = createSelector(
    (state) => state.crypto,
    (Crypto) => ({
      products: Crypto.products,
    })
  );

  const { products } = useSelector(CryptoProperties);
  const [productData, setSetProductData] = useState([products]);

  const toggleTab = tab => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  useEffect(() => {
    dispatch(onGetCryptoProducts());
  }, [dispatch]);


  useEffect(() => {
    setSetProductData(products)
  }, [products])


  const columns = useMemo(
    () => [
      {
        header: "Id No",
        accessorKey: "idno",
        enableColumnFilter: false,
        enableSorting: true,
        cell: cellProps => {
          return <Link to="#" className="text-body fw-bold">{cellProps.getValue()}</Link>
        },
      },
      {
        header: "Date",
        accessorKey: "pdate",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: "Type",
        accessorKey: "type",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: "Currency",
        accessorKey: "coin",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: "Amount",
        accessorKey: "amount",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: "Amount in USD",
        accessorKey: "valueInUsd",
        enableColumnFilter: false,
        enableSorting: true,
      },
    ],
    []
  );

  return (
    <Card>
      <CardBody>
        <h4 className="card-title mb-4">Activities</h4>

        {
          isLoading ? <Spinners setLoading={setLoading} />
            :
            <>
              <ul className="nav nav-tabs nav-tabs-custom">
                <NavItem>
                  <NavLink className={classnames({ active: activeTab === "all", })} onClick={() => { toggleTab("all"); setSetProductData(products) }}>
                    All
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink className={classnames({ active: activeTab === "Buy", })} onClick={() => { toggleTab("Buy"); setSetProductData(products?.filter((data) => data.type === 'Buy')) }}>
                    Buy
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink className={classnames({ active: activeTab === "Sell", })} onClick={() => { toggleTab("Sell"); setSetProductData(products?.filter((data) => data.type === 'Sell')) }}>
                    Sell
                  </NavLink>
                </NavItem>
              </ul>
              <div className="mt-4">
                <TableContainer
                  columns={columns}
                  data={productData || []}
                  isGlobalFilter={true}
                  isCustomPageSize={true}
                  isPagination={true}
                  SearchPlaceholder="search..."
                  tableClass="table-hover table-nowrap dt-responsive nowrap dataTable no-footer dtr-inline"
                  pagination="pagination pagination-rounded"
                />
              </div>
            </>
        }
      </CardBody>
    </Card>
  );
};

WalletActivities.propTypes = {
  walletHistory: PropTypes.array,
  activeTab: PropTypes.string,
  toggleTab: PropTypes.func,
};

export default WalletActivities;
