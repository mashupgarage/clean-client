import { createTheme, responsiveFontSizes } from "@mui/material";

// Build your own theme:
declare module "@mui/material/styles" {
  // Extend the base theme with your customizations
  interface Theme {
    // define custom properties
    primaryAppBar: {
      height: number;
    };
    Drawer: {
      width: number;
    };
  }
  // Allow configuration using `createTheme`
  interface ThemeOptions {
    primaryAppBar: {
      height: number;
    };
    Drawer: {
      width: number;
      closed: number;
    };
  }
}

// Create a theme instance
export const createMuiTheme = (mode: "light" | "dark") => {
  let theme = createTheme({
    palette: {
      mode, // Add this to toggle between light and dark mode
    },
    // Override the default MuiTypography component
    typography: {
      fontFamily: ["IBM Plex Sans", "sans-serif"].join(","),
    },
    // Add custom properties
    primaryAppBar: {
      height: 50,
    },
    // Override the default MuiAppBar component
    Drawer: {
      width: 200,
      closed: 70,
    },
    components: {
      MuiAppBar: {
        defaultProps: {
          color: "default",
          elevation: 0,
        },
      },
    },
  });
  // Make the theme responsive
  theme = responsiveFontSizes(theme);
  return theme;
};

export default createMuiTheme;
