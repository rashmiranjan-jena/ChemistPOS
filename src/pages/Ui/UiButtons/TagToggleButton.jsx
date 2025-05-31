import React from "react";
import { Link } from "react-router-dom";
import { Button, Card, CardBody, CardTitle, Col, Row } from "reactstrap";

const TagToggleButton = () => {
    return (
        <React.Fragment>
            <Row>
                <Col xl={6}>
                    <Card>
                        <CardBody>
                            <CardTitle>Button tags</CardTitle>
                            <p className="card-title-desc">
                                The <code className="highlighter-rouge">.btn</code>
                                classes are designed to be used with the{" "}
                                <code className="highlighter-rouge">
                                    &lt;button&gt;
                                </code>{" "}
                                element. However, you can also use these classes on{" "}
                                <code className="highlighter-rouge">&lt;Link&gt;</code> or{" "}
                                <code className="highlighter-rouge">&lt;input&gt;</code>{" "}
                                elements (though some browsers may apply a slightly
                                different rendering).
                            </p>

                            <div className="d-flex flex-wrap gap-2">
                                <Link
                                    className="btn btn-primary "
                                    to="#"
                                    role="button"
                                >
                                    Link
                                </Link>
                                <Button
                                    color="success"
                                    className="btn btn-success "
                                    type="submit"
                                >
                                    Button
                                </Button>
                                <input
                                    className="btn btn-info"
                                    type="button"
                                    value="Input"
                                />
                                <input
                                    className="btn btn-danger"
                                    type="submit"
                                    value="Submit"
                                />
                                <input
                                    className="btn btn-warning"
                                    type="reset"
                                    value="Reset"
                                />
                            </div>
                        </CardBody>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card>
                        <CardBody>
                            <CardTitle>Toggle states</CardTitle>
                            <p className="card-title-desc">
                                Add{" "}
                                <code className="highlighter-rouge">
                                    data-toggle=&quot;button&ldquo;
                                </code>
                                to toggle a button’s{" "}
                                <code className="highlighter-rouge">active</code>
                                state. If you’re pre-toggling a button, you must manually
                                add the <code className="highlighter-rouge">
                                    .active
                                </code>{" "}
                                class
                                <strong>and</strong>{" "}
                                <code className="highlighter-rouge">
                                    aria-pressed=&quot;true&ldquo;
                                </code>{" "}
                                to the
                                <code className="highlighter-rouge">&lt;button&gt;</code>.
                            </p>

                            <div className="d-flex flex-wrap gap-2">
                                <Button
                                    color="primary"
                                    className="btn btn-primary "
                                    data-toggle="button"
                                    aria-pressed="false"
                                >
                                    Single toggle
                                </Button>
                                <Button type="button" color="primary" className="active">Active toggle button</Button>
                                <Button type="button" color="primary" disabled>Disabled toggle button</Button>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

        </React.Fragment>
    );
}

export default TagToggleButton;