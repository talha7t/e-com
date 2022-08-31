import { AppBar, Toolbar, Stack, Typography, Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { reset, logout } from "../../features/auth/authSlice";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          SHOP IT
        </Typography>
        <Stack direction="row" spacing={2}>
          {user ? (
            <>
              <Button>
                <NavLink className="rrd-link" to="/user" color="inherit">
                  {user.firstName}
                </NavLink>
              </Button>
              <Button onClick={handleLogout} color="warning">
                Logout
              </Button>
            </>
          ) : (
            <Button>
              <NavLink className="rrd-link" to="/login" color="inherit">
                Login
              </NavLink>
            </Button>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
export default Header;
