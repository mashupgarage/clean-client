import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const Main: React.FC<Props> = ({ children }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        flexGrow: 1, // Grow to fill the remaining space
        mt: `${theme.primaryAppBar.height}px`,
        height: `calc(100vh - ${theme.primaryAppBar.height}px )`,
        overflow: "hidden",
      }}
    >
      {children}
    </Box>
  );
};

export default Main;
