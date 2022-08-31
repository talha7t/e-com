import React, { useEffect } from "react";
import { Box, Grid, Button, Typography, Container } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form } from "formik";
import FormikControl from "../commons/FormikControl";
import { login, reset } from "../../features/auth/authSlice";
import { toast } from "react-toastify";
import * as Yup from "yup";

import authFormStyles from "../../styles/login-register.module.css";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  // formik props
  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess && user) {
      toast.success(message);
      navigate("/");
    }

    if (user) {
      navigate("/");
    }

    dispatch(reset());
  }, [user, message, isError, isSuccess, dispatch, navigate]);

  const handleSubmit = (values) => {
    dispatch(login(values));
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
                  <Box>
                    <Typography variant="h5" className={authFormStyles.heading}>
                      LOG IN
                    </Typography>
                  </Box>

                  {/* email field */}

                  <Box my={3}>
                    <FormikControl
                      className={authFormStyles.login_input_field}
                      control="input"
                      type="email"
                      placeholder="E-MAIL"
                      name="email"
                    />
                  </Box>

                  {/* password field */}
                  <Box my={3}>
                    <FormikControl
                      className={authFormStyles.login_input_field}
                      control="input"
                      type="password"
                      placeholder="PASSWORD"
                      name="password"
                    />
                  </Box>

                  {/* Forgot password */}
                  <Box mt={5} mb={1}>
                    <Typography
                      className={authFormStyles.link_text}
                      variant="paragraph"
                    >
                      <Link to="/password/forgot">
                        Have you forgotten your password?
                      </Link>
                    </Typography>
                  </Box>

                  {/* Resend verification link */}
                  <Box mt={1} mb={1}>
                    <Typography
                      className={authFormStyles.link_text}
                      variant="paragraph"
                    >
                      <Link to="/account/verify">Resend verification link</Link>
                    </Typography>
                  </Box>

                  {/* Submit Button */}
                  <Box>
                    <Button
                      className={authFormStyles.submit_btn}
                      type="submit"
                      disabled={!formik.isValid}
                    >
                      LOGIN
                    </Button>
                  </Box>
                </Form>
              );
            }}
          </Formik>
        </Grid>

        {/* REGISTER CONTENT */}
        <Grid
          item
          xs={12}
          sm={6}
          md={6}
          mt={{ xs: 5, sm: 0 }}
          sx={{ paddingLeft: "0 !important" }}
        >
          <Box>
            <Typography variant="h5" className={authFormStyles.heading}>
              REGISTER
            </Typography>
          </Box>

          {/* text */}

          <Box my={3}>
            <Typography
              my={2}
              variant="subtitle2"
              className={authFormStyles.register_content}
            >
              IF YOU STILL DON'T HAVE A{" "}
              <span className={authFormStyles.bold}> SHOP IT</span> ACCOUNT, USE
              THIS OPTION TO ACCESS THE REGISTRATION FORM.
            </Typography>

            <Typography
              variant="subtitle2"
              className={authFormStyles.register_content}
            >
              BY GIVING US YOUR DETAILS, PURCHASING IN{" "}
              <span className={authFormStyles.bold}>SHOP IT</span> WILL BE
              FASTER AND AN ENJOYABLE EXPERIENCE
            </Typography>
          </Box>

          {/* Submit Button */}
          <Box>
            <Button className={authFormStyles.submit_btn}>
              <Link to="/register" className="rrd-link">
                CREATE ACCOUNT
              </Link>
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Login;
