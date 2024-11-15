import { Box, Container, Typography } from "@mui/material";
import { Store } from "../../@types/store";
import MessageInterfaceMachines from "./MessageInterfaceMachines";

interface StoreProps {
  data: Store[];
}

const WelcomeMessage = (props: StoreProps) => {
  const { data } = props;
  // console.log("data:", data);

  return (
    <>
      <MessageInterfaceMachines data={data} />
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

export default WelcomeMessage;
