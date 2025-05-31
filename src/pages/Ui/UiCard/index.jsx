import React from "react";

import {
  Col,
  Row,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardImg,
  CardText,
  CardHeader,
  CardImgOverlay,
  CardFooter,
  CardDeck,
  Container,
} from "reactstrap";

// import images

import img2 from "../../../assets/images/small/img-2.jpg";
import img3 from "../../../assets/images/small/img-3.jpg";
import img4 from "../../../assets/images/small/img-4.jpg";
import img5 from "../../../assets/images/small/img-5.jpg";
import img6 from "../../../assets/images/small/img-6.jpg";
import img7 from "../../../assets/images/small/img-7.jpg";
import { Link } from "react-router-dom";

import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import BasicCard from "./BasicCard";
import CardTitleTreatment from "./CardTitleTreatment";
import CardFeatured from "./CardFeatured";
import QuoteCard from "./QuoteCard";
import CardTitleImg from "./CardTitleImg";
import CardTitles from "./CardTitle";
import { CardColor, CardColorOutline } from "./CardColor";
import CardGroups from "./CardGroups";
import CardsMasonry from "./CardsMasonry";

const UiCards = () => {

  //meta title
  document.title = "Cards | Skote - Vite React Admin & Dashboard Template";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="UI Elements" breadcrumbItem="Cards" />
          <BasicCard />
          <Row>
            <Col md={6}><CardTitleTreatment text="" /></Col>
            <Col md={6}><CardTitleTreatment text="" /> </Col>
          </Row>
          <Row>
            <Col lg={4}><CardTitleTreatment text="" /></Col>
            <Col lg={4}><CardTitleTreatment text="text-center" /></Col>
            <Col lg={4}><CardTitleTreatment text="text-end" /></Col>
          </Row>

          <Row>
            <CardFeatured isFooter={false} tag="h4" />
            <QuoteCard />
            <CardFeatured isFooter={true} />
          </Row>
          <CardTitles />
          <CardTitleImg />

          <Row>
            <CardColor color="Primary" className="text-white-50" />
            <CardColor color="Success" className="text-white-50" />
            <CardColor color="Info" className="text-white-50" />
          </Row>
          <Row>
            <CardColor color="Warning" className="text-white-50" />
            <CardColor color="Danger" className="text-white-50" />
            <CardColor color="Dark" className="text-light" />
          </Row>

          <Row>
            <CardColorOutline border="primary" />
            <CardColorOutline border="danger" />
            <CardColorOutline border="success" />
          </Row>

          <CardGroups />
          <CardsMasonry />
        </Container>
      </div>
    </React.Fragment>
  );
};
export default UiCards
