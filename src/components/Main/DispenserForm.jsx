import React from "react";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Typography,
  Divider,
  Switch,
} from "@mui/material";

const DispenserForm = ({
  formData,
  handleSwitchChange,
  selectedDispenser,
  handleCleanModeChange,
  cleaningInProgress,
  activeCleanMode, // To track active cleaning mode
  handleLockedSwitchChange, // Handler for locked switch change
  handleHeaterToggle, // Handler for heater toggle
  handleTempRegulationToggle, // Handler for temperature regulation toggle
  handleNotificationsToggle, // Handler for notifications toggle
}) => {
  const getStatusColor = (status) => {
    return status === "ERROR" ? "red" : "green";
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: `calc(80vh)`, // Adjust height to fill the viewport
        overflow: "hidden", // Prevent the overall container from scrolling
      }}
    >
      <Box
        sx={{
          overflowY: "auto", // Only this part will scroll
          flexGrow: 1, // Allows this box to grow and fill the space
          padding: 2,
        }}
      >
        <Typography variant="h6">Machine</Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={4}>
            <Typography variant="subtitle1" color="textSecondary">
              Status:
            </Typography>
          </Grid>
          <Grid item xs={8} style={{ paddingLeft: "5px" }}>
            <Typography
              variant="body1"
              sx={{
                fontWeight: "bold",
                textAlign: "left",
                color: getStatusColor(formData.machineStatus.toUpperCase()),
              }}
            >
              {formData.machineStatus.toUpperCase()}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={4}>
            <Typography variant="subtitle1" color="textSecondary">
              Notifications:
            </Typography>
          </Grid>
          <Grid item xs={8} style={{ paddingLeft: "5px" }}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.postNotifications}
                  onChange={handleNotificationsToggle}
                  color="primary"
                />
              }
              label={formData.postNotifications ? "On" : "Off"}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={4}>
            <Typography variant="subtitle1" color="textSecondary">
              Locked:
            </Typography>
          </Grid>
          <Grid item xs={8} style={{ paddingLeft: "5px" }}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isLocked}
                  onChange={handleLockedSwitchChange}
                  color="primary"
                />
              }
              label={formData.isLocked ? "Locked" : "Unlocked"}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="h6">Tap</Typography>
          <Box sx={{ marginBottom: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={
                    selectedDispenser?.name === formData.dispensers[1]?.name
                  }
                  onChange={handleSwitchChange}
                  disabled={cleaningInProgress} // Disable switch while cleaning is in progress
                />
              }
              label="Toggle Tap"
            />
          </Box>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={4}>
              <Typography variant="subtitle1" color="textSecondary">
                Name:
              </Typography>
            </Grid>
            <Grid item xs={8} style={{ paddingLeft: "5px" }}>
              <Typography
                variant="body1"
                sx={{ fontWeight: "bold", textAlign: "left" }}
              >
                {selectedDispenser?.name}
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={4}>
              <Typography variant="subtitle1" color="textSecondary">
                Temperature:
              </Typography>
            </Grid>
            <Grid item xs={8} style={{ paddingLeft: "5px" }}>
              <Typography
                variant="body1"
                sx={{ fontWeight: "bold", textAlign: "left" }}
              >
                {selectedDispenser?.temperature} °C
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={4}>
              <Typography variant="subtitle1" color="textSecondary">
                Inventory:
              </Typography>
            </Grid>
            <Grid item xs={8} style={{ paddingLeft: "5px" }}>
              <Typography
                variant="body1"
                sx={{ fontWeight: "bold", textAlign: "left" }}
              >
                {selectedDispenser?.thermos_weight} g
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Small cups:{" "}
                {Math.floor(
                  selectedDispenser?.thermos_weight /
                    selectedDispenser?.weight_small
                )}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Large cups:{" "}
                {Math.floor(
                  selectedDispenser?.thermos_weight /
                    selectedDispenser?.weight_large
                )}
              </Typography>
            </Grid>
          </Grid>
          {/* Heater On/Off Switch */}
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={4}>
              <Typography variant="subtitle1" color="textSecondary">
                Heater:
              </Typography>
            </Grid>
            <Grid item xs={8} style={{ paddingLeft: "5px" }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.heater_status}
                    onChange={handleHeaterToggle}
                    color="primary"
                  />
                }
                label={formData.heater_status ? "On" : "Off"}
              />
            </Grid>
          </Grid>
          {/* Temperature Regulation Enable/Disable Switch */}
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={4}>
              <Typography variant="subtitle1" color="textSecondary">
                Temp Regulation:
              </Typography>
            </Grid>
            <Grid item xs={8} style={{ paddingLeft: "5px" }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.temperature_regulation}
                    onChange={handleTempRegulationToggle}
                    color="primary"
                  />
                }
                label={formData.temperature_regulation ? "Enabled" : "Disabled"}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>

      <Box
        sx={{
          padding: 2,
          borderTop: "1px solid grey",
          bgcolor: "background.paper", // Ensure it matches the theme
          position: "sticky", // This makes the bottom section sticky
          bottom: 0, // Stick to the bottom of the closest scrolling ancestor
          zIndex: 1100, // Ensure it is above other content if needed
        }}
      >
        <FormControl component="fieldset">
          <FormLabel
            component="legend"
            sx={{
              fontWeight: "bold",
              fontSize: "1.2rem", // Adjust the size as needed
            }}
          >
            Cleaning
          </FormLabel>
          <Box sx={{ display: "flex", justifyContent: "space-around" }}>
            <Button
              variant={activeCleanMode === 1 ? "contained" : "outlined"} // Changed to reflect active cleaning mode
              onClick={() => handleCleanModeChange(1)}
              disabled={cleaningInProgress && activeCleanMode !== 1}
            >
              Mode 1
            </Button>
            <Button
              variant={activeCleanMode === 2 ? "contained" : "outlined"} // Changed to reflect active cleaning mode
              onClick={() => handleCleanModeChange(2)}
              disabled={cleaningInProgress && activeCleanMode !== 2}
            >
              Mode 2
            </Button>
            <Button
              variant={activeCleanMode === 3 ? "contained" : "outlined"} // Changed to reflect active cleaning mode
              onClick={() => handleCleanModeChange(3)}
              disabled={cleaningInProgress && activeCleanMode !== 3}
            >
              Mode 3
            </Button>
            <Button
              // variant={cleaningInProgress ? "contained" : "outlined"} // Highlighted when any cleaning is in progress
              variant={"outlined"}
              onClick={() => handleCleanModeChange(0)}
              disabled={!cleaningInProgress}
            >
              OFF
            </Button>
          </Box>
        </FormControl>
      </Box>
    </Box>
  );
};

export default DispenserForm
