import * as React from "react";
import { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Diversity1Icon from "@mui/icons-material/Diversity1";
import { useMediaQuery } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { fetchUserData } from "./../helper/userAPI";
import { styled } from "@mui/system";

const pages = ["About Dost", "Contact Us", "Chat"];
const settings = ["Profile", "Logout"];

const StyledButton = styled(Button)`
  position: relative;
  color: white;
  &:hover {
    color: white;
  }
  &:after {
    content: "";
    display: block;
    position: absolute;
    width: 0;
    height: 2px;
    background: white;
    transition: width 0.3s;
    bottom: -5px;
    left: 0;
  }
  &:hover:after {
    width: 100%;
  }
`;

function Navbar() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:470px)");

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const [image_url, setImageUrl] = useState("");

  const baseUrl = "https://dost-backend.onrender.com";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await fetchUserData();
        setImageUrl(userData.cloudinaryImageUrl);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, []);

  const isLoggedIn = false;

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/v1/users/logout`, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      navigate("/", { replace: true });
    } catch (error) {
      console.error(
        "Logout failed:",
        error.response ? error.response.data.message : error.message
      );
    }
  };

  const handlePageClick = (page) => {
    if (page === "About Dost") {
      navigate("/about");
    } else if (page === "Contact Us") {
      navigate("/contact");
    } else if (page === "Chat") {
      navigate("/chat");
    }
  };

  const handleSettingClick = (setting) => {
    if (setting === "Logout") {
      handleLogout();
    } else if (setting === "Profile") {
      navigate("/profile");
    }
  };

  return (
    <AppBar
      position="static"
      style={{
        backgroundColor: "black",
        color: "white",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          style={{ width: "100%", justifyContent: "center" }}
        >
          {isMobile && (
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
          )}
          <Diversity1Icon
            sx={{ color: "#ffffff", display: { md: "flex" }, mr: 1 }}
          />
          <Link to="/home" style={{ textDecoration: "none" }}>
            <Typography
              variant="h6"
              noWrap
              sx={{
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "#ffffff",
                textAlign: "center",
                margin: isMobile ? "auto" : "0", // Center text horizontally when isMobile is true
              }}
            >
              Dost
            </Typography>
          </Link>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography
                    textAlign="center"
                    onClick={() => handlePageClick(page)}
                    style={{ color: "grey" }}
                  >
                    {page}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          {!isMobile && (
            <Box
              sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}
            >
              {pages.map((page) => (
                <StyledButton key={page} onClick={() => handlePageClick(page)}>
                  {page}
                </StyledButton>
              ))}
            </Box>
          )}

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  alt="Profile"
                  src={image_url || "/images/default.png"}
                  sx={{ margin: "auto", border: "2px solid white" }}
                />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography
                    textAlign="center"
                    onClick={() => handleSettingClick(setting)}
                    style={{ color: "grey" }}
                  >
                    {setting}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
