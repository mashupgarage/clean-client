import { Box, Container, Typography } from "@mui/material";

const WelcomeMessageStore = () => {
  return (
    <>
      <Container maxWidth="lg">
        <Box sx={{ pt: 6, pb: 6 }}>
          <Typography
            variant="h3"
            // noWrap
            component="h1"
            sx={{
              display: {
                sm: "block",
                fontWeight: 700,
                letterSpacing: "-2px",
                textTransform: "capitalize",
              },
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            Welcome to the Dashboard!
          </Typography>
        </Box>
        <Box>
          <Typography
            variant="h6"
            noWrap
            component="h2"
            color="textSecondary"
            sx={{
              display: {
                sm: "block",
                fontWeight: 700,
                letterSpacing: "-1px",
              },
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            Click a Vending Machine to get started!
          </Typography>
        </Box>
      </Container>
    </>
  );
};

export default WelcomeMessageStore;
