import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Grid, Typography, Button, Box } from "@mui/material";
import { Formik, Form } from "formik";
import FormikControl from "../commons/FormikControl";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { reset, changePassword } from "../../features/auth/authSlice";

import authFormStyles from "../../styles/login-register.module.css";
import profileStyles from "../../styles/profile.module.css";

function ChangeEmail() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  // formik props
  const initialValues = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    currentPassword: Yup.string().required("Please provide current password"),
    newPassword: Yup.string()
      .required("Please provide new password")
      .matches(/^(?=.{8,})/, "password must have atleast 8 characters")
      .matches(/^(?=.*[0-9])/, "password must contain a digit")
      .matches(/^(?=.*[a-z])/, "password must contain a lower case alphabet")
      .matches(/^(?=.*[A-Z])/, "Password must contain an uppercase alphabet")
      .matches(
        /^(?=.*[!@#$%^&";'_*])/,
        "Password must contain a special character"
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), ""], "Passwords do not match")
      .required("Please confirm your password"),
  });

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess) {
      toast.success(message);
      navigate("/user/profile/access-data");
    }

    dispatch(reset());
  }, [dispatch, user, navigate, isError, isSuccess, message]);

  const handleSubmit = (values) => {
    console.log(user.email);
    values.email = user.email;
    dispatch(changePassword(values));
  };

  return (
    <Container sx={{ display: "flex", flexGrow: 1 }}>
      <Grid container className={authFormStyles.form_wrapper} spacing={2}>
        {/* LOGIN FORM */}
        <Grid item xs={12} sm={6} md={6} sx={{ paddingLeft: "0 !important" }}>
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            {(formik) => {
              return (
                <Form>
                  <Box my={5}>
                    <Typography
                      variant="subtitle2"
                      className={profileStyles.main_heading}
                    >
                      Change Password
                    </Typography>
                  </Box>

                  {/* email field */}

                  <Box my={3}>
                    <FormikControl
                      className={authFormStyles.login_input_field}
                      control="input"
                      type="password"
                      placeholder="CURRENT PASSWORD"
                      name="currentPassword"
                    />
                  </Box>

                  {/* email field */}

                  <Box my={3}>
                    <FormikControl
                      className={authFormStyles.login_input_field}
                      control="input"
                      type="password"
                      placeholder="NEW PASSWORD"
                      name="newPassword"
                    />
                  </Box>

                  {/* confirm email field */}

                  <Box my={3}>
                    <FormikControl
                      className={authFormStyles.login_input_field}
                      control="input"
                      type="password"
                      placeholder="CONFIRM PASSWORD"
                      name="confirmPassword"
                    />
                  </Box>

                  {/* Submit Button */}
                  <Box>
                    <Button
                      className={authFormStyles.submit_btn}
                      type="submit"
                      disabled={!formik.isValid}
                    >
                      UPDATE EMAIL
                    </Button>
                  </Box>
                </Form>
              );
            }}
          </Formik>
        </Grid>
      </Grid>
    </Container>
  );
}
export default ChangeEmail;
