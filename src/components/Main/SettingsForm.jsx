import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  TextField,
  Typography,
  Input,
  Divider,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";

const fontOptions = [
  "Merriweather",
  "Roboto Mono",
  "DejaVu Sans",
  "DejaVu Serif",
  "FreeSans",
  "FreeSerif",
];

const SettingsForm = ({
  baseUrl,
  machineFormData,
  dispenserFormData,
  handleMachineChange,
  handleDispenserChange,
  handleMachineImageChange,
  handleDispenserImageChange,
  handleMachineSubmit,
  handleDispenserSubmit,
  isSubmitting,
  handleSwitchChange,
  selectedDispenserIndex,
  error,
  resetError, // Add resetError prop
}) => {
  const [size, setSize] = useState("small");
  const [tapStatus, setTapStatus] = useState(false);
  const [initialWeight, setInitialWeight] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (error) {
      setErrorMessage(error);
      const timer = setTimeout(() => {
        setErrorMessage(null);
        resetError(); // Reset error after timeout
      }, 3000); // Clear error message after 5 seconds

      return () => clearTimeout(timer); // Cleanup the timeout on component unmount
    }
  }, [error, resetError]);

  const currentFontNotListed =
    machineFormData.font_name &&
    !fontOptions.includes(machineFormData.font_name);

  const handleSizeToggle = (event, newSize) => {
    if (newSize !== null) {
      setSize(newSize);
    }
  };

  const handleTapToggle = async () => {
    const dispenserName = dispenserFormData.name;

    console.log("dispenserName: ", dispenserName);

    let data = null;
    if (!tapStatus) {
      try {
        const response = await axios.post(
          `http://${baseUrl}/dispenser/turn-on-tap/`,
          {
            dispenser_name: dispenserName,
          }
        );
        data = response.data; // Use response.data to get the correct data
        setInitialWeight(data.initialWeight);
        setStartTime(new Date().getTime());
      } catch (error) {
        console.error("Failed to turn on the tap:", error);
        return; // Exit if there is an error
      }
    } else {
      // Turn OFF tap
      try {
        const response = await axios.post(
          `http://${baseUrl}/dispenser/turn-off-tap/`,
          {
            dispenser_name: dispenserName,
          }
        );
        data = response.data; // Use response.data to get the correct data
        const endTime = new Date().getTime();
        const dispenseTime = ((endTime - startTime) / 1000).toFixed(1); // Convert to seconds and format to one decimal place
        const finalWeight = data.finalWeight;

        const weightDiff = initialWeight - finalWeight;

        // Fill the corresponding fields
        if (size === "small") {
          handleDispenserChange({
            target: { name: "dispense_time_small", value: dispenseTime },
          });
          handleDispenserChange({
            target: { name: "weight_small", value: weightDiff },
          });
        } else {
          handleDispenserChange({
            target: { name: "dispense_time_large", value: dispenseTime },
          });
          handleDispenserChange({
            target: { name: "weight_large", value: weightDiff },
          });
        }
      } catch (error) {
        console.error("Failed to turn off the tap:", error);
        return; // Exit if there is an error
      }
    }
    setTapStatus(!tapStatus);
  };

  const handleMachineSubmitWithErrorHandling = async (event) => {
    event.preventDefault();

    try {
      await handleMachineSubmit(event);
    } catch (error) {
      setErrorMessage("Failed to submit form");
      setTimeout(() => {
        setErrorMessage(null);
        resetError(); // Reset error after timeout
      }, 3000); // Clear error message after 3 seconds
    }
  };

  const handleDispenserSubmitWithErrorHandling = async (event) => {
    event.preventDefault();

    try {
      await handleDispenserSubmit(event);
    } catch (error) {
      setErrorMessage("Failed to submit form");
      setTimeout(() => {
        setErrorMessage(null);
        resetError(); // Reset error after timeout
      }, 3000); // Clear error message after 3 seconds
    }
  };

  return (
    <Box
      sx={{
        height: "calc(75vh)",
        overflowY: "auto",
        padding: 2,
      }}
    >
      {errorMessage && (
        <Typography color="error" variant="body1">
          {errorMessage}
        </Typography>
      )}
      <form onSubmit={handleMachineSubmitWithErrorHandling} noValidate>
        <Typography variant="h6">Machine Settings</Typography>
        <FormControl fullWidth margin="normal">
          <InputLabel id="font-name-label">Font Name</InputLabel>
          <Select
            labelId="font-name-label"
            id="font_name"
            name="font_name"
            value={machineFormData.font_name || ""}
            label="Font Name"
            onChange={handleMachineChange}
          >
            {currentFontNotListed && (
              <MenuItem value={machineFormData.font_name}>
                {machineFormData.font_name}
              </MenuItem>
            )}
            {fontOptions.map((font) => (
              <MenuItem key={font} value={font}>
                {font}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel htmlFor="appearance-image" shrink>
            Background Image
          </InputLabel>
          <Input
            id="appearance-image"
            name="appearanceImage"
            type="file"
            onChange={handleMachineImageChange}
            inputProps={{ accept: "image/*" }}
          />
        </FormControl>
        <TextField
          margin="normal"
          fullWidth
          label="Pin Code"
          name="pin_code"
          value={machineFormData.pin_code || ""}
          onChange={handleMachineChange}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 3,
            mb: 2,
          }}
        >
          <Button
            type="submit"
            variant="contained"
            sx={{ width: "auto" }}
            disabled={isSubmitting}
          >
            Update Machine
          </Button>
        </Box>
      </form>

      <Divider sx={{ my: 2 }} />
      <form onSubmit={handleDispenserSubmitWithErrorHandling} noValidate>
        <Typography variant="h6">Tap Settings</Typography>
        <FormControlLabel
          control={
            <Switch
              checked={selectedDispenserIndex === 1}
              onChange={handleSwitchChange}
            />
          }
          label="Toggle Tap"
        />
        <Box sx={{ marginBottom: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={4}>
              <Typography variant="subtitle1" color="textSecondary">
                Name:
              </Typography>
            </Grid>
            <Grid item xs={8} style={{ paddingLeft: "5px" }}>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: "bold",
                  textAlign: "left",
                }}
              >
                {dispenserFormData.name || ""}
              </Typography>
            </Grid>
          </Grid>
        </Box>
        <TextField
          margin="normal"
          fullWidth
          label="Target Temperature (°C)"
          name="target_temperature"
          value={dispenserFormData.target_temperature || ""}
          onChange={handleDispenserChange}
          type="number"
        />
        <TextField
          margin="normal"
          fullWidth
          label="Temperature Tolerance (°C)"
          name="temperature_tolerance"
          value={dispenserFormData.temperature_tolerance || ""}
          onChange={handleDispenserChange}
          type="number"
        />
        <TextField
          margin="normal"
          fullWidth
          label="Minimum Thermos Weight (g)"
          name="minimum_thermos_weight"
          value={dispenserFormData.minimum_thermos_weight || ""}
          onChange={handleDispenserChange}
          type="number"
        />
        {/* <TextField
          margin="normal"
          fullWidth
          label="Empty Thermos Weight (g)"
          name="empty_thermos_weight"
          value={dispenserFormData.empty_thermos_weight || ""}
          onChange={handleDispenserChange}
          type="number"
        /> */}
        <TextField
          margin="normal"
          fullWidth
          label="Drink Name (English)"
          name="drink_name"
          value={dispenserFormData.drink_name || ""}
          onChange={handleDispenserChange}
          type="text"
        />
        <TextField
          margin="normal"
          fullWidth
          label="Drink Name (Chinese)"
          name="drink_name2"
          value={dispenserFormData.drink_name2 || ""}
          onChange={handleDispenserChange}
          type="text"
        />
        <TextField
          margin="normal"
          fullWidth
          label="Price (Small)"
          name="price_small"
          value={dispenserFormData.price_small || ""}
          onChange={handleDispenserChange}
          type="number"
        />
        <TextField
          margin="normal"
          fullWidth
          label="Price (Large)"
          name="price_large"
          value={dispenserFormData.price_large || ""}
          onChange={handleDispenserChange}
          type="number"
        />
        <TextField
          margin="normal"
          fullWidth
          label="Dispense Time (Small) (seconds)"
          name="dispense_time_small"
          value={dispenserFormData.dispense_time_small || ""}
          onChange={handleDispenserChange}
          type="number"
        />
        <TextField
          margin="normal"
          fullWidth
          label="Dispense Time (Large) (seconds)"
          name="dispense_time_large"
          value={dispenserFormData.dispense_time_large || ""}
          onChange={handleDispenserChange}
          type="number"
        />
        <TextField
          margin="normal"
          fullWidth
          label="Weight (Small) (g)"
          name="weight_small"
          value={dispenserFormData.weight_small || ""}
          onChange={handleDispenserChange}
          type="number"
        />
        <TextField
          margin="normal"
          fullWidth
          label="Weight (Large) (g)"
          name="weight_large"
          value={dispenserFormData.weight_large || ""}
          onChange={handleDispenserChange}
          type="number"
        />

        {/* Add the toggle buttons below the "Weight (Large)" text field */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <ToggleButtonGroup
            value={size}
            exclusive
            onChange={handleSizeToggle}
            aria-label="size toggle"
          >
            <ToggleButton value="small" aria-label="small">
              Small
            </ToggleButton>
            <ToggleButton value="large" aria-label="large">
              Large
            </ToggleButton>
          </ToggleButtonGroup>

          <ToggleButton
            value="check"
            selected={tapStatus}
            onChange={handleTapToggle}
            aria-label="tap toggle"
          >
            {tapStatus ? "Tap OFF" : "Tap ON"}
          </ToggleButton>
        </Box>

        <TextField
          margin="normal"
          fullWidth
          label="SKU"
          name="SKU"
          value={dispenserFormData.SKU || ""}
          onChange={handleDispenserChange}
          type="text"
        />
        <FormControl fullWidth margin="normal" variant="outlined">
          <InputLabel htmlFor="drink-image" shrink>
            {/* Drink Image | Current: {dispenserFormData.drink_image} */}
            Drink Image
          </InputLabel>
          <Input
            id="drink-image"
            type="file"
            onChange={handleDispenserImageChange}
            inputProps={{ accept: "image/*" }}
          />
        </FormControl>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 3,
            mb: 2,
          }}
        >
          <Button
            type="submit"
            variant="contained"
            sx={{ width: "auto" }}
            disabled={isSubmitting}
          >
            Update Tap
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default SettingsForm
