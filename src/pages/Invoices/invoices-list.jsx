import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Col, Container, Row } from "reactstrap";
import { Link } from "react-router-dom";
import withRouter from "../../components/Common/withRouter";

//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";

//Import Breadcrumb
import Breadcrumbs from "/src/components/Common/Breadcrumb";

//Import Card invoice
import CardInvoice from "./card-invoice";
import { getInvoices as onGetInvoices } from "/src/store/actions";

import Spinners from "../../components/Common/Spinner";

const InvoicesList = () => {
  //meta title
  document.title =
    "Invoice List | Skote - Vite React Admin & Dashboard Template";

  const dispatch = useDispatch();

  const InvoicesProperties = createSelector(
    (state) => state.invoices,
    (Invoices) => ({
      invoices: Invoices.invoices,
      loading: Invoices.loading
    })
  );

  const {
    invoices, loading
  } = useSelector(InvoicesProperties);
  const [isLoading, setLoading] = useState(loading)

  useEffect(() => {
    dispatch(onGetInvoices());
  }, [dispatch]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs title="Invoices" breadcrumbItem="Invoice List" />

          {
            isLoading ?
              <Spinners setLoading={setLoading} />
              :
              <>
                <Row>
                  {(invoices || [])?.map((invoice, key) => (
                    <CardInvoice data={invoice} key={"_invoice_" + key} />
                  ))}
                </Row>
                <Row>
                  <Col xs="12">
                    <div className="text-center my-3">
                      <Link to="#" className="text-success">
                        <i className="bx bx-loader bx-spin font-size-18 align-middle me-2" />
                        Load more
                      </Link>
                    </div>
                  </Col>
                </Row></>
          }
        </Container>
      </div>
    </React.Fragment>
  );
};

InvoicesList.propTypes = {
  invoices: PropTypes.array,
  onGetInvoices: PropTypes.func,
};

export default withRouter(InvoicesList);
