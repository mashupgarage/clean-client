import {
  AppBar,
  Toolbar,
  Box,
  // ListItemAvatar,
  // Avatar,
  Typography,
  IconButton,
  Drawer,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Store } from "../../@types/store";
import { useParams } from "react-router-dom";
import VendingMachines from "../Drawer/VendingMachines";
import { useEffect, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";

interface StoreProps {
  data: Store[];
}

const MessageInterfaceMachines = (props: StoreProps) => {
  const { data } = props;
  const theme = useTheme();
  const { storeId, machineId } = useParams();
  // console.log(`storeId: ${storeId}, machineId: ${machineId}`);
  const [sideMenu, setSideMenu] = useState(false);

  // Get channel name from data fetched from API
  const storeName =
    data // data fetched from API
      ?.find((store) => store.id == Number(storeId))
      ?.machines?.find((machine) => machine.id === Number(machineId))?.name ||
    "HOME"; // set default value to "home" if store is not found

  //  if screen width is less than 600px then isSmallScreen is true
  const isSmallScreen = useMediaQuery(theme.breakpoints.up("sm"));

  useEffect(() => {
    // if screen width is less than 600px and sideMenu is true then set sideMenu to false
    if (isSmallScreen && sideMenu) {
      setSideMenu(false);
    }
  }, [isSmallScreen]);

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setSideMenu(open);
    };

  const list = () => (
    // display list of channels in drawer menu
    <Box
      sx={{ paddingTop: `${theme.primaryAppBar.height}px`, minWidth: 200 }}
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <VendingMachines data={data} />
    </Box>
  );

  return (
    <>
      <AppBar
        sx={{
          backgroundColor: theme.palette.background.default,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
        color="default"
        position="sticky"
        elevation={0}
      >
        <Toolbar
          variant="dense"
          sx={{
            minHeight: theme.primaryAppBar.height,
            height: theme.primaryAppBar.height,
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* This Box will push the Typography to the center */}
          <Box sx={{ flexGrow: 1 }}></Box>
          <Typography noWrap component="div" sx={{ textAlign: "center" }}>
            {storeName}
          </Typography>
          {/* This Box ensures the Typography stays centered */}
          <Box sx={{ flexGrow: 1 }}></Box>
          <Box sx={{ display: { xs: "block", sm: "none" } }}>
            <IconButton color="inherit" onClick={toggleDrawer(true)} edge="end">
              <MoreVertIcon />
            </IconButton>
          </Box>
          <Drawer anchor="left" open={sideMenu} onClose={toggleDrawer(false)}>
            {list()}
          </Drawer>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default MessageInterfaceMachines;
