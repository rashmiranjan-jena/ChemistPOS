import React from "react";
import { Link } from "react-router-dom";
import { Card, CardText, CardTitle } from "reactstrap";

const CardTitleTreatment = ({ text }) => {
    return (
        <React.Fragment>
            <Card className={"card-body " + text}>
                <CardTitle tag="h4" className="mt-0">Special title treatment</CardTitle>
                <CardText>
                    With supporting text below as a natural lead-in to additional
                    content.
                </CardText>
                <Link to="#" className="btn btn-primary">Go somewhere</Link>
            </Card>
        </React.Fragment>
    );
}

export default CardTitleTreatment;