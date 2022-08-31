import { Box, Container } from "@mui/material";
import { Link, Outlet } from "react-router-dom";
import AccountRoutes from "./AccountRoutes";

function Account() {
  return (
    // <Box component="section" className="section-wrapper">
    <Container component="section" sx={{ display: "flex", flexGrow: 1 }}>
      <Box my={5}>
        <AccountRoutes />

        <Outlet />
      </Box>
    </Container>
    // </Box>
  );
}

export default Account;
