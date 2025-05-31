import React from "react";
import { Button, Card, CardBody, CardTitle, Col, Row } from "reactstrap";

const BlockCheckboxButton = () => {
    return (
        <React.Fragment>
            <Row>
                <Col xl={6}>
                    <Card>
                        <CardBody>
                            <CardTitle>Block Buttons</CardTitle>
                            <p className="card-title-desc">
                                Create block level buttons—those that span the full width of
                                a parent—by adding{" "}
                                <code className="highlighter-rouge">.btn-block</code>.
                            </p>

                            <div className="d-grid gap-2">
                                <Button color="primary" type="button" className="btn-lg">Block level button</Button>
                                <Button color="secondary" type="button" className="btn-sm">Block level button</Button>
                            </div>
                        </CardBody>
                    </Card>
                </Col>

                <Col xl={6}>
                    <Card>
                        <CardBody>
                            <CardTitle>Checkbox & Radio Buttons</CardTitle>
                            <p className="card-title-desc">
                                Bootstrap’s{" "}
                                <code className="highlighter-rouge">.button</code> styles
                                can be applied to other elements, such as{" "}
                                <code className="highlighter-rouge">&lt;label&gt;</code>s,
                                to provide checkbox or radio style button toggling. Add{" "}
                                <code className="highlighter-rouge">
                                    data-toggle=&quot;buttons&ldquo;
                                </code>{" "}
                                to a<code className="highlighter-rouge">.btn-group</code>{" "}
                                containing those modified buttons to enable toggling in
                                their respective styles.
                            </p>

                            <div className="d-flex flex-wrap gap-2">
                                <div>
                                    <div className="d-flex flex-wrap gap-3">
                                        <div className="btn-group" role="group">
                                            <input type="checkbox" className="btn-check" id="btncheck1" autoComplete="off" defaultChecked />
                                            <label className="btn btn-primary" htmlFor="btncheck1">Checkbox 1</label>

                                            <input type="checkbox" className="btn-check" id="btncheck2" autoComplete="off" />
                                            <label className="btn btn-primary" htmlFor="btncheck2">Checkbox 2</label>

                                            <input type="checkbox" className="btn-check" id="btncheck3" autoComplete="off" />
                                            <label className="btn btn-primary" htmlFor="btncheck3">Checkbox 3</label>
                                        </div>

                                        <div className="btn-group" role="group">
                                            <input type="checkbox" className="btn-check" id="btncheck4" autoComplete="off" defaultChecked />
                                            <label className="btn btn-outline-primary" htmlFor="btncheck4">Checkbox 4</label>

                                            <input type="checkbox" className="btn-check" id="btncheck5" autoComplete="off" />
                                            <label className="btn btn-outline-primary" htmlFor="btncheck5">Checkbox 5</label>

                                            <input type="checkbox" className="btn-check" id="btncheck6" autoComplete="off" />
                                            <label className="btn btn-outline-primary" htmlFor="btncheck6">Checkbox 6</label>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="d-flex flex-wrap gap-3">
                                        <div className="btn-group" role="group">
                                            <input type="radio" className="btn-check" name="btnradio" id="btnradio1" autoComplete="off" defaultChecked />
                                            <label className="btn btn-secondary" htmlFor="btnradio1">Radio 1</label>

                                            <input type="radio" className="btn-check" name="btnradio" id="btnradio2" autoComplete="off" />
                                            <label className="btn btn-secondary" htmlFor="btnradio2">Radio 2</label>

                                            <input type="radio" className="btn-check" name="btnradio" id="btnradio3" autoComplete="off" />
                                            <label className="btn btn-secondary" htmlFor="btnradio3">Radio 3</label>
                                        </div>

                                        <div className="btn-group" role="group">
                                            <input type="radio" className="btn-check" name="btnradio" id="btnradio4" autoComplete="off" defaultChecked />
                                            <label className="btn btn-outline-secondary" htmlFor="btnradio4">Radio 4</label>

                                            <input type="radio" className="btn-check" name="btnradio" id="btnradio5" autoComplete="off" />
                                            <label className="btn btn-outline-secondary" htmlFor="btnradio5">Radio 5</label>

                                            <input type="radio" className="btn-check" name="btnradio" id="btnradio6" autoComplete="off" />
                                            <label className="btn btn-outline-secondary" htmlFor="btnradio6">Radio 6</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    );
}

export default BlockCheckboxButton;