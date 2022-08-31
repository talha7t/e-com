import React, { useEffect } from "react";
import { Box, Grid, Button, Typography, Container } from "@mui/material";
import { Formik, Form } from "formik";
import { useDispatch, useSelector } from "react-redux";
import FormikControl from "../commons/FormikControl";
import { reset, resetPassword } from "../../features/auth/authSlice";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import * as Yup from "yup";

import authFormStyles from "../../styles/login-register.module.css";

function ResetPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token } = useParams();

  const { message, isSuccess, isError, isLoading } = useSelector(
    (state) => state.auth
  );

  // formik props
  const initialValues = {
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    password: Yup.string()
      .required("Please provide a password")
      .matches(/^(?=.{8,})/, "password must have atleast 8 characters")
      .matches(/^(?=.*[0-9])/, "password must contain a digit")
      .matches(/^(?=.*[a-z])/, "password must contain a lower case alphabet")
      .matches(/^(?=.*[A-Z])/, "Password must contain an uppercase alphabet")
      .matches(
        /^(?=.*[!@#$%^&";'_*])/,
        "Password must contain a special character"
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), ""], "Passwords must match")
      .required("Please confirm your password"),
  });

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess) {
      toast.success(message);
      navigate("/login");
    }

    dispatch(reset());
  }, [dispatch, navigate, message, isSuccess, isError, isLoading]);

  const handleSubmit = (values) => {
    values.token = token;
    console.log(values);
    dispatch(resetPassword(values));
  };

  return (
    <Container sx={{ display: "flex", flexGrow: 1 }}>
      <Grid container className={authFormStyles.form_wrapper} spacing={2}>
        {/* LOGIN FORM */}
        <Grid item xs={12} sx={{ paddingLeft: "0 !important" }}>
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            {(formik) => {
              return (
                <Form>
                  <Box>
                    <Typography variant="h5" className={authFormStyles.heading}>
                      RESET PASSWORD
                    </Typography>
                  </Box>

                  {/* New Password field */}
                  <Box my={3}>
                    <FormikControl
                      className={authFormStyles.login_input_field}
                      control="input"
                      type="password"
                      placeholder="New Password"
                      name="password"
                    />
                  </Box>

                  {/* Confirm Password field */}
                  <Box my={3}>
                    <FormikControl
                      className={authFormStyles.login_input_field}
                      control="input"
                      type="password"
                      placeholder="New Password"
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
                      CONTINUE
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

export default ResetPassword;
