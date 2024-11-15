// src\components\Drawer\VendingMachines.tsx
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  useTheme,
  ListItemIcon,
  Typography,
} from "@mui/material";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import { Link } from "react-router-dom";
import { Store } from "../../@types/store";
import { useAuth } from "../../contexts/AuthContext";

interface StoreProps {
  data: Store[];
}

const VendingMachines = (props: StoreProps) => {
  const { data } = props;
  const theme = useTheme();
  const { storeId } = useAuth();

  const server_name = data?.[0]?.name ?? "Store";
  // console.log(data);

  return (
    <>
      <Box
        sx={{
          height: "50px",
          display: "flex",
          alignItems: "center",
          px: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
          position: "sticky",
          top: 1,
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Typography
          variant="body1"
          style={{
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
            fontStyle: "italic", // This makes the text italic
          }}
        >
          {server_name}
        </Typography>
      </Box>
      <List sx={{ py: 0 }}>
        {data.flatMap((obj) =>
          obj.machines.map((item) => (
            <ListItem
              disablePadding
              key={item.id}
              sx={{ display: "block", maxHeight: "40px" }}
              dense={true}
            >
              <Link
                to={`/stores/${storeId}/${item.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ListItemButton sx={{ minHeight: 48 }}>
                  <ListItemIcon sx={{ minWidth: 0, justifyContent: "center" }}>
                    <ListItemAvatar sx={{ minWidth: "0px" }}>
                      <img
                        alt="vending machine Icon"
                        src="/vendingmachine.png"
                        style={{
                          width: "25px",
                          height: "25px",
                          display: "block",
                          margin: "auto",
                        }}
                      />
                    </ListItemAvatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body1"
                        textAlign="start"
                        paddingLeft={1}
                      >
                        {item.name}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </Link>
            </ListItem>
          )),
        )}
      </List>
    </>
  );
};

export default VendingMachines;
