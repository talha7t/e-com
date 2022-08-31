import React from "react";
import { Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import ProfileCTA from "./ProfileCTA";

import profileStyles from "../../styles/profile.module.css";

function Profile() {
  const { user } = useSelector((state) => state.auth);

  return (
    <>
      <Box my={5}>
        <Typography variant="subtitle2" className={profileStyles.main_heading}>
          {user && user.firstName + " " + user.lastName}
        </Typography>
        <p className={profileStyles.sub_heading}>{user && user.email}</p>
      </Box>

      <ProfileCTA
        path="access-data"
        mainText="Account"
        subText="Email, Password"
      />
      <ProfileCTA
        path="/"
        mainText="Address"
        subText="Shipping and Billing Address"
      />
    </>
  );
}

export default Profile;
