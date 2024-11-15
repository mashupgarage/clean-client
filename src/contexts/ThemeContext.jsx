// ThemeContext.jsx
import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import {
  createTheme,
  ThemeProvider as MUIThemeProvider,
} from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

const ThemeContext = createContext({
  toggleDarkMode: () => {}, // Placeholder function to toggle the theme
});

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  // const [mode, setMode] = useState("light");
  // Initialize mode from localStorage or default to 'light'
  const [mode, setMode] = useState(
    localStorage.getItem("themeMode") || "light"
  );

  useEffect(() => {
    // Save mode to localStorage whenever it changes
    localStorage.setItem("themeMode", mode);
  }, [mode]);

  const toggleDarkMode = () =>
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
        // Define any custom properties here as needed
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
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ toggleDarkMode }}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
};
