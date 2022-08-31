import React from "react";
import ProfileCTA from "./ProfileCTA";
import { Box, Typography, Container } from "@mui/material";

import profileStyles from "../../styles/profile.module.css";
function AccessData() {
  return (
    <>
      <Container
        component="section"
        sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}
      >
        <Box sx={{ marginTop: "20vh" }}>
          <Typography
            variant="subtitle2"
            className={profileStyles.main_heading}
          >
            Account
          </Typography>
        </Box>

        <ProfileCTA path="change-email" mainText="Change Email" />
        <ProfileCTA path="/" mainText="Change Password" />
      </Container>
    </>
  );
}

export default AccessData;
