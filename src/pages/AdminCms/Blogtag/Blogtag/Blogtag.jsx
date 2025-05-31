import React from "react";
import { Button, Container, Input, Label, FormFeedback } from "reactstrap";
import { useFormik } from "formik";
import * as yup from "yup";

// Import Breadcrumb
import Breadcrumbs from "../../../../components/Common/Breadcrumb";

const Blogtag = () => {
  document.title = "Blog Tag";

  const formik = useFormik({
    initialValues: {
      blogTag: "",
    },
    validationSchema: yup.object().shape({
      blogTag: yup.string().required("Please enter a Blog Tag"),
    }),
    onSubmit: (values) => {
      console.log("Form Submitted", values);
      formik.resetForm();
    },
  });

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Breadcrumb */}
          <Breadcrumbs title="Blog Registration" breadcrumbItem="Add Tag" />

          <div className="mb-3">
            <Label htmlFor="blogTag">Blog Tag</Label>
            <Input
              id="blogTag"
              name="blogTag"
              type="text"
              value={formik.values.blogTag}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              invalid={formik.touched.blogTag && formik.errors.blogTag ? true : false}
            />
            {formik.touched.blogTag && formik.errors.blogTag && (
              <FormFeedback>{formik.errors.blogTag}</FormFeedback>
            )}
          </div>

          <div className="d-flex flex-wrap gap-2">
            <Button type="submit" color="primary" onClick={formik.handleSubmit}>
              Submit
            </Button>
            <Button
              type="button"
              color="secondary"
              onClick={() => formik.resetForm()}
            >
              Cancel
            </Button>
          </div>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Blogtag;
