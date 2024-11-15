import React from "react";

import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Input,
  Typography,
} from "@mui/material";

import normalizeUrl from "../../helpers/normalizeUrl";

const fontOptions = [
  // run: fc-list
  "Merriweather",
  "Roboto Mono",
  // "Georgia",
  // "Times New Roman",
  "DejaVu Sans",
  "DejaVu Serif",
  "FreeSans",
  "FreeSerif",
]; // Predefined list of fonts

const AppearanceForm = ({
  formData,
  handleChange,
  handleImageChange,
  handleSubmit,
  isSubmitting,
}) => {
  // Check if the current font is in the predefined list
  const currentFontNotListed =
    formData.font_name && !fontOptions.includes(formData.font_name);

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
      <Typography variant="h6">Appearance Settings</Typography>
      <FormControl fullWidth margin="normal">
        <InputLabel htmlFor="appearance-image" shrink>
          Background Image | Current: {normalizeUrl(formData.background_image)}
        </InputLabel>
        <Input
          id="appearance-image"
          name="appearanceImage"
          type="file"
          onChange={handleImageChange}
          inputProps={{ accept: "image/*" }}
        />
      </FormControl>
      {/* <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={isSubmitting}
        sx={{ mt: 3, mb: 2 }}
      >
        Update Appearance
      </Button> */}
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
          sx={{ width: "auto" }} // Set the width as auto or specify a width
          disabled={isSubmitting}
        >
          Update Appearance
        </Button>
      </Box>
    </Box>
  );
};

export default AppearanceForm;
