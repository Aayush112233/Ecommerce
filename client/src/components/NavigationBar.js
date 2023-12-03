import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import LogoutIcon from "@mui/icons-material/Logout";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CartModal from "./CartModal";
import axios from "axios";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export default function NavigationBar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const [userData, setUserData] = React.useState(null);
  const [openStatus, setOpenStatus] = React.useState(false);
  const [badge, setBadge] = React.useState(0);

  React.useEffect(() => {
    // Fetch user data from local storage when the component mounts
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      // Parse the JSON string back to an object
      const parsedUserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);
    }
  }, []);

  React.useEffect(() => {
    let intervalId;

    const fetchOrderCount = () => {
      if (userData) {
        axios
          .get(`http://localhost:9000/user-order-count/${userData.id}`)
          .then((res) => {
            setBadge(res.data.userOrderCount);
          })
          .catch((error) => {
            // Handle errors if the request fails
            console.error("Error fetching order count:", error);
          });
      }
    };

    // Fetch data initially
    fetchOrderCount();

    // Set interval to fetch data every three seconds
    intervalId = setInterval(fetchOrderCount, 6000);

    // Clear interval on unmount to prevent memory leaks
    return () => {
      clearInterval(intervalId);
    };
  }, [userData, setBadge]); 

  const navigate = useNavigate();

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleLogOut = () => {
    localStorage.removeItem("userData");
    navigate("/login");
  };
  const handleSignIn = () => {
    navigate("/login");
  };

  const handleOpenCart = () => {
    setOpenStatus(!openStatus);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem sx={{ display: "flex", gap: 0.5 }} onClick={handleOpenCart}>
        <IconButton
          size="large"
          aria-label="show 4 new mails"
          color="#2C2C2C"
          onClick={handleOpenCart}
        >
          <Badge badgeContent={badge} color="error">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
        Cart
      </MenuItem>
      <MenuItem onClick={handleLogOut}>
        <Button size="small" startIcon={<LogoutIcon />} onClick={handleLogOut}>
          Logout
        </Button>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "white",
          marginBottom: 2,
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: "none", sm: "block" } }}
            color={"#2c2c2c"}
          >
            E-Commerce
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          {userData ? (
            <Box sx={{ display: { xs: "none", md: "flex", gap: 10 } }}>
              <Typography
                sx={{
                  mt: 1.5,
                  mr: 3,
                  color: "black",
                }}
              >
                Welcome {userData?.firstName} !
              </Typography>
              <IconButton
                size="large"
                aria-label="show 4 new mails"
                color="#2C2C2C"
                onClick={handleOpenCart}
              >
                <Badge badgeContent={badge} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
              <Button
                size="small"
                startIcon={<LogoutIcon />}
                onClick={handleLogOut}
              >
                Logout
              </Button>
            </Box>
          ) : (
            <Button size="small" onClick={handleSignIn}>
              Sign In / Sign Up
            </Button>
          )}

          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="#2C2C2C"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
      <CartModal openStatus={openStatus} setOpenStatus={setOpenStatus} />
    </Box>
  );
}
