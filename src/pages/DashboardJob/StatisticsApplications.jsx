import React, { useState, useEffect } from 'react';
import { Card, CardBody, Col, Nav, NavItem, NavLink } from 'reactstrap';
import { StatisticsApplicationsChart } from './JobCharts';

import { getStatisticData } from '../../store/actions';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from "reselect";

const StatisticsApplications = () => {
    const [active, setActive] = useState(1);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getStatisticData(1))
    }, [dispatch])

    const DashboardjobProperties = createSelector(
        (state) => state.DashboardJob,
        (dashboardJob) => ({
            statistic_data: dashboardJob.statistic_data
        })
    );


    const { statistic_data } = useSelector(DashboardjobProperties);
    const statisticsData = statistic_data[0]?.data;

    const handleChangeChart = (chartType) => {
        setActive(chartType)
        dispatch(getStatisticData(chartType))
    }

    return (
        <React.Fragment>
            <Col lg={8}>
                <Card>
                    <CardBody>
                        <div className="d-sm-flex flex-wrap">
                            <h4 className="card-title mb-4">Statistics Applications</h4>
                            <div className="ms-auto">
                                <Nav pills>
                                    <NavItem>
                                        <NavLink href="#" className={active === 3 ? "active" : ''} onClick={() => handleChangeChart(3)}>Week</NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink href="#" className={active === 2 ? "active" : ''} onClick={() => handleChangeChart(2)}>Month</NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink className={active === 1 ? "active" : ''} href="#" onClick={() => handleChangeChart(1)}>Year</NavLink>
                                    </NavItem>
                                </Nav>
                            </div>
                        </div>
                        <StatisticsApplicationsChart seriesData={statisticsData} dataColors='["--bs-primary", "--bs-success", "--bs-warning", "--bs-info"]' dir="ltr" />
                    </CardBody>
                </Card>
            </Col>
        </React.Fragment>
    );
};

export default StatisticsApplications;