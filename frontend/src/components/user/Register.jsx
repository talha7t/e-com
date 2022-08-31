import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Grid, Typography, Button, Box } from "@mui/material";
import { Formik, Form } from "formik";
import FormikControl from "../commons/FormikControl";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { register, reset } from "../../features/auth/authSlice";

import authFormStyles from "../../styles/login-register.module.css";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  // formik props
  const initialValues = {
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    zipCode: "",
    country: "",
    phoneNumber: "",
  };

  const phoneRegex = /^(?:(?:00|\+)\d{2}|0)[1-9](?:\d{9})$/;
  // /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
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
    firstName: Yup.string()
      .required("Please provide your first name")
      .min(2, "First name must have at least 2 characters")
      .max(20, "First name can not exceed 20 characters")
      .matches(/\D+$/, "First name must contain alphabets"),
    lastName: Yup.string()
      .required("Please provide your first name")
      .min(2, "Last name must have at least 2 characters")
      .max(20, "Last name can not exceed 20 characters")
      .matches(/\D+$/, "First name must contain alphabets"),
    address: Yup.string()
      .required("Please provide your address")
      .min(5, "Address field must have at least 5 characters")
      .max(100, "Address field can not exceed 100 characters")
      .matches(/\D+$/, "Invalid Address"),
    city: Yup.string()
      .required("Please provide your city")
      .min(2, "City name must have at least 2 characters")
      .max(30, "City name can not exceed 30 characters")
      .matches(/\D+$/, "Invalid Address"),
    country: Yup.string()
      .required("Please provide your city")
      .min(4, "Country name must have at least 4 characters")
      .max(60, "Country name can not exceed 60 characters")
      .matches(/\D+$/, "Invalid Address"),
    zipCode: Yup.string()
      .required("Please provide your city")
      .min(5, "Zip code must have at least 5 characters")
      .max(9, "Zip code can not exceed 9 characters"),
    phoneNumber: Yup.string()
      .required("please provide a phone number")
      .matches(phoneRegex, "Invalid phone number"),
  });

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (user) {
      navigate("/");
    }

    if (isSuccess) {
      toast.success(message);
      navigate("/login");
    }

    dispatch(reset());
    // check if user is still needed in dependencies array
  }, [dispatch, user, navigate, isError, isSuccess, message]);

  const handleSubmit = (values) => {
    dispatch(register(values));
  };

  return (
    <Container sx={{ display: "flex", flexGrow: 1 }}>
      <Grid container className={authFormStyles.form_wrapper}>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {(formik) => {
            return (
              <Form>
                {/* heading */}
                <Box mb={5}>
                  <Typography variant="h5" className={authFormStyles.heading}>
                    PERSONAL DETAILS
                  </Typography>
                </Box>

                {/* nested grid for email and phone number*/}
                <Grid container columnSpacing={2}>
                  <Grid item xs={12} sm={4} my={1}>
                    <Box>
                      <FormikControl
                        className={authFormStyles.register_input_field}
                        control="input"
                        type="email"
                        placeholder="E-MAIL"
                        name="email"
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={4} my={1}>
                    <Box>
                      <FormikControl
                        className={authFormStyles.register_input_field}
                        control="input"
                        type="text"
                        placeholder="PHONE"
                        name="phoneNumber"
                      />
                    </Box>
                  </Grid>
                </Grid>

                {/* nested grid for password and confirm password */}
                <Grid container columnSpacing={2}>
                  <Grid item xs={12} sm={4} my={1}>
                    <Box>
                      <FormikControl
                        className={authFormStyles.register_input_field}
                        control="input"
                        type="password"
                        placeholder="PASSWORD"
                        name="password"
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={4} my={1}>
                    <Box>
                      <FormikControl
                        className={authFormStyles.register_input_field}
                        control="input"
                        type="password"
                        placeholder="CONFIRM PASSWORD"
                        name="confirmPassword"
                      />
                    </Box>
                  </Grid>
                </Grid>

                {/* nested grid for first and last name */}
                <Grid container columnSpacing={2}>
                  <Grid item xs={12} sm={4} my={1}>
                    <Box>
                      <FormikControl
                        className={authFormStyles.register_input_field}
                        control="input"
                        type="text"
                        placeholder="FIRST NAME"
                        name="firstName"
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={4} my={1}>
                    <Box>
                      <FormikControl
                        className={authFormStyles.register_input_field}
                        control="input"
                        type="text"
                        placeholder="LAST NAME"
                        name="lastName"
                      />
                    </Box>
                  </Grid>
                </Grid>

                {/* nested grid for address and city name */}
                <Grid container columnSpacing={2}>
                  <Grid item xs={12} sm={4} my={1}>
                    <Box>
                      <FormikControl
                        className={authFormStyles.register_input_field}
                        control="input"
                        type="text"
                        placeholder="ADDRESS"
                        name="address"
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={4} my={1}>
                    <Box>
                      <FormikControl
                        className={authFormStyles.register_input_field}
                        control="input"
                        type="text"
                        placeholder="CITY"
                        name="city"
                      />
                    </Box>
                  </Grid>
                </Grid>

                {/* nested grid for country and zip code */}
                <Grid container columnSpacing={2}>
                  <Grid item xs={12} sm={4} my={1}>
                    <Box>
                      <FormikControl
                        className={authFormStyles.register_input_field}
                        control="input"
                        type="text"
                        placeholder="COUNTRY"
                        name="country"
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={4} my={1}>
                    <Box>
                      <FormikControl
                        className={authFormStyles.register_input_field}
                        control="input"
                        type="text"
                        placeholder="ZIP CODE"
                        name="zipCode"
                      />
                    </Box>
                  </Grid>
                </Grid>

                {/* LOGIN */}
                <Box mt={5} mb={1}>
                  <Typography
                    className={authFormStyles.link_text}
                    variant="paragraph"
                  >
                    <Link to="/login">ALREADY HAVE AN ACCOUNT? LOGIN</Link>
                  </Typography>
                </Box>

                {/* Submit Button */}
                <Box>
                  <Button
                    className={authFormStyles.submit_btn}
                    type="submit"
                    disabled={!formik.isValid}
                  >
                    CREATE ACCOUNT
                  </Button>
                </Box>
              </Form>
            );
          }}
        </Formik>
      </Grid>
    </Container>
  );
}

export default Register;
