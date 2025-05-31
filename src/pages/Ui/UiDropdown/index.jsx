import React from "react";
import { Container } from "reactstrap"

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb"
import SingleVariant from "./SingleVariant";
import SplitSizing from "./SplitSizing";
import DarkMenuContent from "./DarkMenuContent";
import CloseMenuAlignment from "./CloseMenuAlignment";
import LeftDropUp from "./LeftDropUp";

const UiDropdown = () => {

  //meta title
  document.title = "Dropdowns | Skote - Vite React Admin & Dashboard Template";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="UI Elements" breadcrumbItem="Dropdowns" />

          <SingleVariant />
          <SplitSizing />
          <DarkMenuContent />
          <CloseMenuAlignment />
          <LeftDropUp />
        </Container>
      </div>
    </React.Fragment>
  )
}
export default UiDropdown