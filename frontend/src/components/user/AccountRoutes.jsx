import { Box, Typography } from "@mui/material";
import { NavLink, Outlet } from "react-router-dom";

function AccountRoutes(props) {
  return (
    <>
      <Box mb={5}>
        <NavLink className="account-tab" to="purchases">
          Purchases
        </NavLink>

        <NavLink className="account-tab" to="profile">
          Profile
        </NavLink>

        <NavLink className="account-tab" to="settings">
          settings
        </NavLink>
      </Box>
    </>
  );
}

export default AccountRoutes;
