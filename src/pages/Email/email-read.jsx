import React, { useEffect } from "react";
import { Container, Row, Col, Card, CardBody } from "reactstrap";

//Import Image
import avatar2 from "../../assets/images/users/avatar-2.jpg";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

//Import Email Sidebar
import EmailSideBar from "./email-sidebar";
import withRouter from "../../components/Common/withRouter";
import { useDispatch, useSelector } from "react-redux";
import { getMailsListsId as onGetMailsListsId } from "/src/store/mails/actions";
import { createSelector } from "reselect";

const EmailRead = (props) => {

  const id = props.router.params.id;

  const dispatch = useDispatch();

  const selectProperties = createSelector(
    (state) => state.mails,
    (Mails) => ({
      mailsListsId: Mails.mailsListsId
    })
  );

  const { mailsListsId } = useSelector(selectProperties);

  useEffect(() => {
    if (id) {
      dispatch(onGetMailsListsId(id));
    } else {
      dispatch(onGetMailsListsId("1"));
    }
  }, [dispatch, id]);

  //meta title
  document.title = "Read Email | Skote - Vite React Admin & Dashboard Template";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs title="Email" breadcrumbItem="Read Email" />

          <Row>
            <Col xs="12">
              {/* Render Email SideBar */}
              <EmailSideBar />

              <div className="email-rightbar mb-3">
                <Card>
                  <CardBody className="list-message">
                    <div className="d-flex mb-4">
                      <img
                        className="d-flex me-3 rounded-circle avatar-sm"
                        src={avatar2}
                        alt="skote"
                      />
                      <div className="flex-grow-1">
                        <h5 className="font-size-14 mt-1">
                          {mailsListsId.name}
                        </h5>
                        <small className="text-muted">support@domain.com</small>
                      </div>
                    </div>

                    <h4 className="mt-0 font-size-16">
                      This Week&apos;s Top Stories
                    </h4>

                    <p>Dear Lorem Ipsum,</p>
                    <div className="col-mail col-mail-2">
                      {mailsListsId.description && <div
                        dangerouslySetInnerHTML={{
                          __html: mailsListsId.description,
                        }}
                      ></div>}
                    </div>
                    <p>
                      Praesent dui ex, dapibus eget mauris ut, finibus
                      vestibulum enim. Quisque arcu leo, facilisis in fringilla
                      id, luctus in tortor. Nunc vestibulum est quis orci varius
                      viverra. Curabitur dictum volutpat massa vulputate
                      molestie. In at felis ac velit maximus convallis.
                    </p>
                    <p>
                      Sed elementum turpis eu lorem interdum, sed porttitor eros
                      commodo. Nam eu venenatis tortor, id lacinia diam. Sed
                      aliquam in dui et porta. Sed bibendum orci non tincidunt
                      ultrices. Vivamus fringilla, mi lacinia dapibus
                      condimentum, ipsum urna lacinia lacus, vel tincidunt mi
                      nibh sit amet lorem.
                    </p>
                    <p>Sincerly,</p>
                  </CardBody>
                </Card>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

// export default withRouter(EmailRead)
export default withRouter(EmailRead)
