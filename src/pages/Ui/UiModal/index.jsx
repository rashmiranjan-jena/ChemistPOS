import React, { useState } from "react";

import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Container,
  Button,
} from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import BasicModal from "./BasicModal";
import DefaultFullscreen from "./DefaultFullscreen";
import OptionalSizes from "./OptionalSizes";
import StaticScrollable from "./StaticScrollable";
import ToggleContent from "./ToggleContent";

const UiModal = () => {

  //meta title
  document.title = "Models | Skote - Vite React Admin & Dashboard Template";


  const [modal_large, setModal_large] = useState(false);
  const [modal_xLarge, setModal_xLarge] = useState(false);
  const [modal_small, setModal_small] = useState(false);
  const [modal_center, setModal_center] = useState(false);

  const removeBodyCss = () => {
    document.body.classList.add("no_padding");
  }

  const tog_large = () => {
    setModal_large(!modal_large);
    removeBodyCss();
  }

  const tog_xLarge = () => {
    setModal_xLarge(!modal_xLarge);
    removeBodyCss();
  }

  const tog_small = () => {
    setModal_small(!modal_small);
    removeBodyCss();
  }

  const tog_center = () => {
    setModal_center(!modal_center);
    removeBodyCss();
  }



  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="UI Elements" breadcrumbItem="Modals" />

          <BasicModal />
          <DefaultFullscreen removeBodyCss={removeBodyCss} />

          <Row>
            <Col lg={6}>
              <Card>
                <CardBody>
                  <CardTitle className="h4">
                    Optional Sizes
                  </CardTitle>
                  <p className="card-title-desc">Modals have three optional sizes, available via modifier classes to be placed on a <code>.modal-dialog</code>.</p>
                  <div className="d-flex flex-wrap gap-2">
                    <Button type="button" onClick={() => { tog_xLarge(); }} color="primary">
                      Extra large modal
                    </Button>
                    <Button type="button" onClick={() => { tog_large(); }} color="light">
                      Large modal
                    </Button>
                    <Button type="button" onClick={() => { tog_small(); }} color="success">
                      Small modal
                    </Button>
                  </div>

                  <div>
                    <OptionalSizes title="Extra large modal" size="xl" isOpen={modal_xLarge} toggle={tog_xLarge} />
                    <OptionalSizes title="Large Modal" size="lg" isOpen={modal_large} toggle={tog_large} />
                    <OptionalSizes title="Small Modal" size="sm" isOpen={modal_small} toggle={tog_small} />
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col lg={6}>
              <Card>
                <CardBody>
                  <CardTitle className="h5">
                    Vertically Centered
                  </CardTitle>
                  <p className="card-title-desc">Add <code>.modal-dialog-centered</code> to <code>.modal-dialog</code> to vertically center the modal.</p>
                  <div>
                    <Button type="button" color="primary " onClick={() => { tog_center(); }}>
                      Center modal
                    </Button>
                    <OptionalSizes center={true} title="Center Modal" size="md" isOpen={modal_center} toggle={tog_center} />
                  </div>
                </CardBody>
              </Card>
            </Col>

            <StaticScrollable removeBodyCss={removeBodyCss} />

          </Row>

          <ToggleContent removeBodyCss={removeBodyCss} />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default UiModal;
