import React, { useState } from "react";

import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Container,
  Form,
} from "reactstrap";
import { Link } from "react-router-dom";
// import { Map, InfoWindow, GoogleApiWrapper } from "google-maps-react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

//Lightbox
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import ModalVideo from "react-modal-video";
import "react-modal-video/scss/modal-video.scss";

// import image
import img1 from "../../assets/images/small/img-1.jpg";
import img2 from "../../assets/images/small/img-2.jpg";
import img3 from "../../assets/images/small/img-3.jpg";
import img4 from "../../assets/images/small/img-4.jpg";
import img5 from "../../assets/images/small/img-5.jpg";
import img6 from "../../assets/images/small/img-6.jpg";
import img7 from "../../assets/images/small/img-7.jpg";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

const images = [img1, img2, img3, img4, img5, img6];
const images1 = [img3, img7];

const UiLightbox = () => {

  //meta title
  document.title = "Lightbox | Skote - Vite React Admin & Dashboard Template";


  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isEffects, setisEffects] = useState(false);

  const [photoIndex, setphotoIndex] = useState(0);
  const [isGallery, setisGallery] = useState(false);
  const [isFits, setisFits] = useState(0);
  const [isGalleryZoom, setisGalleryZoom] = useState(false);

  const [isOpen, setisOpen] = useState(false);
  const [isOpen1, setisOpen1] = useState(false);
  const [modal, setmodal] = useState(false);
  const [map, setMap] = useState(false);

  function tog_map() {
    setMap(!map);
  }


  const containerStyle = {
    width: '100%',
    height: '300px',
  };
  
  const center = {
    lat: 37.778519, lng: -122.40564
  };

  const selectedPlace = {};

  const [selected, setSelected] = useState(null);

  const onSelect = (marker) => {
    setSelected(marker);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="UI Elements" breadcrumbItem="Lightbox" />


          <Row>
            <Col xl={6}>
              <Card>
                <CardBody>
                  <CardTitle>Single image lightbox</CardTitle>
                  <p className="card-title-desc">
                    Three simple popups with different scaling settings.
                  </p>
                  <Row>
                    <Col className="col-6">
                      <div>
                        <h5 className="mt-0 font-size-14">Fits (Horz/Vert)</h5>
                        <img
                          className="img-fluid"
                          alt="Skote"
                          src={img2}
                          width="145"
                          onClick={() => {
                            setOpen(true);
                            setCurrentIndex(1);
                          }}
                          style={{ cursor: "pointer" }}
                        />

                        {open && (
                          <Lightbox
                            open={open}
                            close={() => setOpen(false)}
                            index={currentIndex}
                            slides={images.map((image) => ({ src: image }))}
                          />
                        )}
                      </div>
                    </Col>
                    <Col className="col-6">
                      <div>
                        <h5 className="mt-0 font-size-14">Effects</h5>
                        <img
                          onClick={() => {
                            setisEffects(true);
                            setCurrentIndex(2);
                          }}
                          className="img-fluid"
                          alt=""
                          src={img3}
                          width="75"
                        />

                        {isEffects && (
                          <Lightbox
                            open={isEffects}
                            close={() => setisEffects(false)}
                            index={currentIndex}
                            slides={images.map((image) => ({ src: image }))}
                          />
                        )}

                        <CardText className="mt-2 mb-0 text-muted">
                          No gaps, zoom animation, close icon in top-right
                          corner.
                        </CardText>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>

            <Col xl={6}>
              <Card>
                <CardBody>
                  <CardTitle className="h4">Lightbox gallery</CardTitle>
                  <p className="card-title-desc">
                    In this example lazy-loading of images is enabled for the
                    next image based on move direction.{" "}
                  </p>
                  <div className="popup-gallery d-flex flex-wrap">
                    <div className="img-fluid float-left">
                      <img
                        src={img1}
                        onClick={() => {
                          setisGallery(true);
                          setphotoIndex(0);
                        }}
                        alt=""
                        width="120"
                      />

                      {isGallery && (
                        <Lightbox
                          open={isGallery}
                          close={() => setisGallery(false)}
                          index={photoIndex}
                          slides={images.map((image) => ({ src: image }))}
                        />
                      )}
                    </div>
                    <div className="img-fluid float-left">
                      <img
                        src={img2}
                        onClick={() => {
                          setisGallery(true);
                          setphotoIndex(1);
                        }}
                        alt=""
                        width="120"
                      />
                    </div>
                    <div className="img-fluid float-left">
                      <img
                        src={img3}
                        onClick={() => {
                          setisGallery(true);
                          setphotoIndex(2);
                        }}
                        alt=""
                        width="120"
                      />
                    </div>
                    <div className="img-fluid float-left">
                      <img
                        src={img4}
                        onClick={() => {
                          setisGallery(true);
                          setphotoIndex(3);
                        }}
                        alt=""
                        width="120"
                      />
                    </div>
                    <div className="img-fluid float-left">
                      <img
                        src={img5}
                        onClick={() => {
                          setisGallery(true);
                          setphotoIndex(4);
                        }}
                        alt=""
                        width="120"
                      />
                    </div>
                    <div className="img-fluid float-left">
                      <img
                        src={img6}
                        onClick={() => {
                          setisGallery(true);
                          setphotoIndex(5);
                        }}
                        alt=""
                        width="120"
                      />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col xl={6}>
              <Card>
                <CardBody>
                  <CardTitle className="h4">Zoom Gallery</CardTitle>
                  <p className="card-title-desc">
                    Zoom effect works only with images.
                  </p>

                  <div className="zoom-gallery">
                    <img
                      src={img3}
                      className="float-left"
                      onClick={() => {
                        setisGalleryZoom(true);
                        setisFits(0);
                      }}
                      alt=""
                      width="275"
                    />
                    <img
                      src={img7}
                      className="float-left"
                      onClick={() => {
                        setisGalleryZoom(true);
                        setisFits(1);
                      }}
                      alt=""
                      width="275"
                    />

                    {isGalleryZoom && (
                      <Lightbox
                        open={isGalleryZoom}
                        close={() => setisGalleryZoom(false)}
                        index={isFits}
                        slides={images1.map((image) => ({ src: image }))}
                      />
                    )}
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col xl={6}>
              <Card>
                <CardBody>
                  <CardTitle className="h4">Popup with video or map</CardTitle>
                  <p className="card-title-desc">
                    In this example lazy-loading of images is enabled for the
                    next image based on move direction.{" "}
                  </p>

                  <Row>
                    <Col>
                      <Button
                        className="btn btn-secondary me-1"
                        onClick={() => {
                          setisOpen(!isOpen);
                        }}
                      >
                        Open Youtube Video
                      </Button>{" "}
                      <Button
                        className="btn btn-secondary me-1"
                        onClick={() => {
                          setisOpen1(!isOpen1);
                        }}
                      >
                        Open Vimeo Video
                      </Button>{" "}
                      <Button
                        onClick={() => {
                          tog_map();
                        }}
                        className="popup-gmaps btn btn-secondary mo-mb-2"
                      >
                        Open Google Map
                      </Button>
                      <ModalVideo
                        videoId="L61p2uyiMSo"
                        channel="youtube"
                        isOpen={isOpen}
                        onClose={() => {
                          setisOpen(!isOpen);
                        }}
                      />
                      <ModalVideo
                        videoId="L61p2uyiMSo"
                        channel="youtube"
                        isOpen={isOpen1}
                        onClose={() => {
                          setisOpen1(false);
                        }}
                      />
                      <Modal
                        centered
                        isOpen={map}
                        size="lg"
                        toggle={() => {
                          tog_map();
                        }}
                      >
                        <ModalHeader toggle={tog_map}>Google Map</ModalHeader>
                        <ModalBody>
                          <div
                            id="gmaps-markers"
                            className="gmaps"
                            style={{ position: "relative" }}
                          >
                            <LoadScript googleMapsApiKey="AIzaSyAbvyBxmMbFhrzP9Z8moyYr6dCr-pzjhBE">
                              <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={14}>
                                <Marker position={center} onClick={() => onSelect(center)} />
                                {selected && (
                                  <InfoWindow
                                    position={selected}
                                    onCloseClick={() => setSelected(null)}
                                  >
                                    <div>
                                      <h1>{selectedPlace.name}</h1>
                                    </div>
                                  </InfoWindow>
                                )}
                              </GoogleMap>
                            </LoadScript>
                          </div>
                        </ModalBody>
                      </Modal>
                    </Col>
                  </Row>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <CardTitle className="h4 mb-4">Popup with form</CardTitle>
                  <div>
                    <Link
                      onClick={() => {
                        setmodal(!modal);
                      }}
                      to="#"
                      className="popup-form btn btn-primary"
                    >
                      Popup form
                    </Link>
                  </div>

                  <Modal
                    size="xl"
                    isOpen={modal}
                    toggle={() => {
                      setmodal(!modal);
                    }}
                    centered
                  >
                    <ModalHeader tag="h4"
                      toggle={() => {
                        setmodal(!modal);
                      }} className="mb-4"
                    >Form
                    </ModalHeader>
                    <ModalBody>
                      <Form onSubmit={(event) => event.preventDefault()}>
                        <Row>
                          <Col lg={4}>
                            <div className="mb-3">
                              <label htmlFor="name">Name</label>
                              <input
                                type="text"
                                className="form-control"
                                id="name"
                                placeholder="Enter Name"
                              />
                            </div>
                          </Col>
                          <Col lg={4}>
                            <div className="mb-3">
                              <label htmlFor="email">Email</label>
                              <input
                                type="email"
                                className="form-control"
                                id="email"
                                placeholder="Enter Email"
                              />
                            </div>
                          </Col>
                          <Col lg={4}>
                            <div className="mb-3">
                              <label htmlFor="password">Password</label>
                              <input
                                type="password"
                                className="form-control"
                                id="password"
                                placeholder="Enter Password"
                              />
                            </div>
                          </Col>
                        </Row>
                        <Row>
                          <Col lg={12}>
                            <div className="mb-3">
                              <label htmlFor="subject">Subject</label>
                              <textarea
                                className="form-control"
                                id="subject"
                                rows="3"
                              />
                            </div>
                          </Col>
                        </Row>
                        <Row>
                          <Col lg={12}>
                            <div className="text-end">
                              <button type="submit" className="btn btn-primary">
                                Submit
                              </button>
                            </div>
                          </Col>
                        </Row>
                      </Form>
                    </ModalBody>
                  </Modal>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

// export default connect(
//   null,
//   {}
// )(
//   GoogleApiWrapper({
//     apiKey: "AIzaSyAbvyBxmMbFhrzP9Z8moyYr6dCr-pzjhBE",
//     LoadingContainer: LoadingContainer,
//     v: "3",
//   })(UiLightbox)
// );

export default UiLightbox