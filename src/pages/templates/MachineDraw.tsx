import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

type SecondaryDrawProps = {
  children: React.ReactNode;
};

const MachineDraw = ({ children }: SecondaryDrawProps) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        // Set the minimum width using the secondaryDraw.width value from the theme
        minWidth: `${theme.Drawer.width}px`,
        // Set the height to be the full viewport height minus the height of the primaryAppBar
        height: `calc(100vh - ${theme.primaryAppBar.height}px )`,
        // Set the top margin to be the height of the primaryAppBar
        mt: `${theme.primaryAppBar.height}px`,
        // Add a border to the right of the box
        borderRight: `1px solid ${theme.palette.divider}`,
        // Hide on xs screens and show on sm and larger screens
        display: { xs: "none", sm: "block" },
        // Make the box scrollable if the content overflows
        overflow: "auto",
      }}
    >
      {children}
    </Box>
  );
};

export default MachineDraw;
