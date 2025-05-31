import PropTypes from 'prop-types'
import React, { useState } from "react"
// import { Map, InfoWindow, Marker, GoogleApiWrapper } from "google-maps-react"
import LightData from "./LightData"
import { Row, Col, Card, CardBody, CardTitle, CardSubtitle } from "reactstrap"
//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"

import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '300px',
};

const center = {
  lat: 37.778519, lng: -122.40564
};

const second = {
  lat: 40.854885,
  lng: -88.081807,
}

const MapsGoogle = () => {

  //meta title
  document.title = "Google Maps | Skote - Vite React Admin & Dashboard Template";

  const selectedPlace = {};

  const [selected, setSelected] = useState(null);

  const onSelect = (marker) => {
    setSelected(marker);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Maps" breadcrumbItem="Google Maps" />

          <Row>
            <Col lg={6}>
              <Card>
                <CardBody>
                  <CardTitle>Markers</CardTitle>
                  <CardSubtitle className="mb-3">
                    Example of google maps.
                  </CardSubtitle>
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
                </CardBody>
              </Card>
            </Col>

            <Col lg={6}>
              <Card>
                <CardBody>
                  <CardTitle>Overlays</CardTitle>
                  <CardSubtitle className="mb-3">
                    Example of google maps.
                  </CardSubtitle>
                  <div
                    id="gmaps-overlay"
                    className="gmaps"
                    style={{ position: "relative" }}
                  >
                     <LoadScript googleMapsApiKey="AIzaSyAbvyBxmMbFhrzP9Z8moyYr6dCr-pzjhBE">
                      <GoogleMap mapContainerStyle={containerStyle} center={second} zoom={14}>
                        <Marker position={second} onClick={() => onSelect(second)} />
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
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col lg={6}>
              <Card>
                <CardBody>
                  <CardTitle>Basic</CardTitle>
                  <CardSubtitle className="mb-3">
                    Example of google maps.
                  </CardSubtitle>
                  <div
                    id="gmaps-markers"
                    className="gmaps"
                    style={{ position: "relative" }}
                  >
                    <LoadScript googleMapsApiKey="AIzaSyAbvyBxmMbFhrzP9Z8moyYr6dCr-pzjhBE">
                      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={20}>
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
                </CardBody>
              </Card>
            </Col>

            <Col lg={6}>
              <Card>
                <CardBody>
                  <CardTitle>Ultra Light</CardTitle>
                  <CardSubtitle className="mb-3">
                    Example of google maps.
                  </CardSubtitle>
                  <div
                    id="gmaps-overlay"
                    className="gmaps"
                    style={{ position: "relative" }}
                  >
                     <LoadScript googleMapsApiKey="AIzaSyAbvyBxmMbFhrzP9Z8moyYr6dCr-pzjhBE">
                      <GoogleMap mapContainerStyle={containerStyle} center={LightData.Data} zoom={14}>
                        <Marker position={LightData.Data} onClick={() => onSelect(LightData.Data)} />
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
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  )
}
export default MapsGoogle
MapsGoogle.propTypes = {
  google: PropTypes.object
}

// export default connect(
//   null,
//   {}
// )(
//   GoogleApiWrapper({
//     apiKey: "AIzaSyAbvyBxmMbFhrzP9Z8moyYr6dCr-pzjhBE",
//     LoadingContainer: LoadingContainer,
//     v: "3",
//   })(MapsGoogle)
// )
