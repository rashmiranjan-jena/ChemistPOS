import React from "react"
import { Link } from "react-router-dom"
import {
  Card,
  CardBody,
  Col,
  DropdownMenu,
  DropdownToggle,
  Table,
  UncontrolledDropdown,
} from "reactstrap"
import { blogPost } from "../../common/data"

const PopularPost = () => {

  return (
    <React.Fragment>
      <Col xl={8}>
        <Card>
          <CardBody>
            <div className="d-flex align-items-start">
              <div className="me-2">
                <h5 className="card-title mb-4">Popular post</h5>
              </div>
              <UncontrolledDropdown className="ms-auto">
                <DropdownToggle className="text-muted font-size-16" tag="a" color="white">
                  <i className="mdi mdi-dots-horizontal"></i>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-end">
                  <Link className="dropdown-item" to="#">Action</Link>
                  <Link className="dropdown-item" to="#">Another action</Link>
                  <Link className="dropdown-item" to="#">Something else</Link>
                  <div className="dropdown-divider"></div>
                  <Link className="dropdown-item" to="#">Separated link</Link>
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>

            <div className="table-responsive">
              <Table className="align-middle table-nowrap mb-0">
                <thead>
                  <tr>
                    <th scope="col" colSpan={2}>Post </th>
                    <th scope="col">Likes</th>
                    <th scope="col">Comments</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {(blogPost || [])?.map((popularPost, key) => (
                    <tr key={key}>
                      <td style={{ width: "100px" }}>
                        <img src={popularPost.img} alt="" className="avatar-md h-auto d-block rounded" />
                      </td>
                      <td>
                        <h5 className="font-size-13 text-truncate mb-1">
                          <Link to="#" className="text-dark">{popularPost.title}</Link>
                        </h5>
                        <p className="text-muted mb-0">{popularPost.date}</p>
                      </td>
                      <td>
                        <i className="bx bx-like align-middle me-1"></i>{" "}{popularPost.like}</td>
                      <td>
                        <i className="bx bx-comment-dots align-middle me-1"></i>{" "}{popularPost.comment}</td>
                      <td>
                        <UncontrolledDropdown className="dropdown">
                          <DropdownToggle className="text-muted font-size-16" tag="a" color="white">
                            <i className="mdi mdi-dots-horizontal"></i>
                          </DropdownToggle>
                          <DropdownMenu className="dropdown-menu-end">
                            <Link className="dropdown-item" to="#">Action</Link>
                            <Link className="dropdown-item" to="#">Another action</Link>
                            <Link className="dropdown-item" to="#">Something else</Link>
                            <div className="dropdown-divider"></div>
                            <Link className="dropdown-item" to="#">Separated link</Link>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </CardBody>
        </Card>
      </Col>
    </React.Fragment>
  )
}

export default PopularPost
