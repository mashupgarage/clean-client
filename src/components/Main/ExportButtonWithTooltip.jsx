import React from "react";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import HelpIcon from "@mui/icons-material/Help";
import GetAppIcon from "@mui/icons-material/GetApp"; // Import the GetApp icon
import Box from "@mui/material/Box";

const ExportButtonWithTooltip = ({ onClick }) => {
  return (
    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
      <Tooltip title="Export to Excel">
        <IconButton onClick={onClick} color="primary">
          <GetAppIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="To choose a save location for the export file, enable 'Ask where to save each file before downloading' in your browser settings.">
        <HelpIcon sx={{ cursor: "pointer" }} />
      </Tooltip>
    </Box>
  );
};

export default ExportButtonWithTooltip;
