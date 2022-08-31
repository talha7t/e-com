import React, { useEffect } from "react";
import { Box, Grid, Button, Typography, Container } from "@mui/material";
import { Formik, Form } from "formik";
import { useDispatch, useSelector } from "react-redux";
import FormikControl from "../commons/FormikControl";
import { reset, forgotPassword } from "../../features/auth/authSlice";
import { toast } from "react-toastify";
import * as Yup from "yup";

import authFormStyles from "../../styles/login-register.module.css";

function ForgotPassword() {
  const dispatch = useDispatch();

  const { message, isSuccess, isError, isLoading } = useSelector(
    (state) => state.auth
  );

  // formik props
  const initialValues = {
    email: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
  });

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess) {
      toast.success(message);
    }

    dispatch(reset());
  }, [dispatch, message, isSuccess, isError, isLoading]);

  const handleSubmit = (values) => {
    dispatch(forgotPassword(values));
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
                      Forgot PASSWORD
                    </Typography>
                  </Box>
                  <Box mt={2}>
                    <Typography
                      variant="subtitle2"
                      className={authFormStyles.register_content}
                    >
                      IF YOU'VE FORGOTTEN YOUR PASSWORD, ENTER YOUR E-MAIL
                      ADDRESS AND WE'LL SEND YOU AN E-MAIL TELLING YOU HOW TO
                      RECOVER IT
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

export default ForgotPassword;
