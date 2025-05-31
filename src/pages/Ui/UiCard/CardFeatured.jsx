import React from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, CardText, CardTitle, Col } from "reactstrap";

const CardFeatured = ({ isFooter, tag }) => {
    return (
        <React.Fragment>
            <Col lg={4}>
                <Card>
                    {
                        tag ?
                            <h5 className="card-header bg-transparent border-bottom text-uppercase">Featured</h5>
                            :
                            <div className="card-header bg-transparent border-bottom text-uppercase">Featured</div>
                    }
                    <CardBody>
                        <CardTitle tag="h4" className="mt-0">
                            Special title treatment
                        </CardTitle>
                        <CardText>
                            With supporting text below as a natural lead-in to
                            additional content.
                        </CardText>
                        <Link to="#!" className="btn btn-primary">
                            Go somewhere
                        </Link>
                    </CardBody>
                    {isFooter && <div className="card-footer bg-transparent border-top text-muted">2 days ago</div>}
                </Card>
            </Col>
        </React.Fragment>
    );
}

export default CardFeatured;