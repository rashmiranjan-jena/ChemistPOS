import React from "react";
import { Container } from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import DefaultOutlineButtons from "./DefaultOutlineButtons";
import SoftButtons from "./SoftButtons";
import RoundedWithIcon from "./RoundedWithIcon";
import SnipButtons from "./SnipButtons";
import ButtonSizesWidth from "./ButtonSizesWidth";
import TagToggleButton from "./TagToggleButton";
import BlockCheckboxButton from "./BlockCheckboxButton";
import ToolbarGroupButton from "./ToolbarGroupButton";
import VerticalVariationSize from "./VerticalVariationSize";
import BaseCustomClass from "./BaseCustomClass";
import RingVariables from "./RingVariables";
import SassUtilitiesAPI from "./SassUtilitiesAPI";

const UiButtons = () => {

  //meta title
  document.title = "Buttons | Skote - Vite React Admin & Dashboard Template";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="UI Elements" breadcrumbItem="Buttons" />

          <DefaultOutlineButtons />
          <SoftButtons />
          <RoundedWithIcon />
          <SnipButtons />
          <ButtonSizesWidth />
          <TagToggleButton />
          <BlockCheckboxButton />
          <ToolbarGroupButton />
          <VerticalVariationSize />
          <BaseCustomClass />
          <RingVariables />
          <SassUtilitiesAPI />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default UiButtons
