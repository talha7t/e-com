import React from "react";
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import profileStyles from "../../styles/profile.module.css";

function ProfileCTA(props) {
  return (
    <Link
      to={props.path}
      className={profileStyles.cta_container + " no-underline"}
    >
      <Box>
        <Typography variant="subtitle2" className={profileStyles.main_heading}>
          {props.mainText}
        </Typography>
        <p className={profileStyles.sub_heading}>{props.subText}</p>
      </Box>
      <Box>
        <ArrowForwardIosIcon className={profileStyles.arrow_forward} />
      </Box>
    </Link>
  );
}

export default ProfileCTA;
