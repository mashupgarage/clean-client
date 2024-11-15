import {
  AppBar,
  Box,
  Link,
  Toolbar,
  Typography,
  Button,
  useMediaQuery,
  IconButton,
  useTheme,
} from "@mui/material";
// import { useTheme } from "@mui/material/styles";

import Brightness4Icon from "@mui/icons-material/Brightness4"; // For dark mode
import Brightness7Icon from "@mui/icons-material/Brightness7"; // For light mode
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"; // Import the AttachMoney icon
import LogoutIcon from "@mui/icons-material/Logout"; // Import the Logout icon
import DashboardIcon from "@mui/icons-material/Dashboard"; // Import the Dashboard icon

import { useThemeContext } from "../../contexts/ThemeContext";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext"; // Adjust the import path as necessary

const PrimaryAppBar = ({
  onShowTransactions,
}: {
  onShowTransactions: () => void;
}) => {
  const [sideMenu, setSideMenu] = useState(false);
  const theme = useTheme();
  // console.log(theme); // Debug: Check your theme structure

  const { toggleDarkMode } = useThemeContext(); // Use the context to access toggleDarkMode

  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));
  // Use the useMediaQuery hook to determine if the screen is small or not
  // const isSmallScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const navigate = useNavigate(); // Instantiate useNavigate
  const { logout } = useAuth(); // Destructure logout function from useAuth
  // Accessing custom property safely
  // const appBarHeight = theme.primaryAppBar?.height || 50; // Fallback to a default value if undefined

  // Close the side menu when the screen is small
  useEffect(() => {
    if (isSmallScreen && sideMenu) {
      setSideMenu(false);
    }
  }, [isSmallScreen, sideMenu]);

  // Logout function to be called on button click
  const handleLogout = () => {
    logout(); // Perform logout logic, like clearing tokens
    navigate("/login"); // Navigate to the login page
  };

  const handleTransactions = () => {
    onShowTransactions(); // Call the method to show transactions
  };

  return (
    <AppBar
      sx={{
        // place the app bar above the drawer
        zIndex: (theme) => theme.zIndex.drawer + 2,
        backgroundColor: theme.palette.background.default,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar
        variant="dense"
        sx={{
          height: theme.primaryAppBar.height,
          minHeight: theme.primaryAppBar.height,
          // Removed justifyContent since we're using flexGrow now
        }}
      >
        {/* Wrapping the title (and any other left-aligned elements) in a Box with flexGrow */}
        <Box sx={{ flexGrow: 1 }}>
          <Link href="/" underline="none" color="inherit">
            {isLargeScreen ? (
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ display: { fontWeight: 700, letterSpacing: "-0.5px" } }}
              >
                CLEAN COFFEE DASHBOARD
              </Typography>
            ) : (
              <IconButton color="inherit">
                <DashboardIcon />
              </IconButton>
            )}
          </Link>
        </Box>

        <IconButton color="inherit" onClick={toggleDarkMode}>
          {theme.palette.mode === "dark" ? (
            <Brightness7Icon />
          ) : (
            <Brightness4Icon />
          )}
        </IconButton>

        {isLargeScreen ? (
          <Button color="inherit" onClick={handleTransactions}>
            Transactions
          </Button>
        ) : (
          <IconButton color="inherit" onClick={handleTransactions}>
            <AttachMoneyIcon />
          </IconButton>
        )}

        {/* Logout Button - Now aligned to the right */}
        {isLargeScreen ? (
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        ) : (
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default PrimaryAppBar;
