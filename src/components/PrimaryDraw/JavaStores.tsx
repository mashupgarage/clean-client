import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
} from "@mui/material";
import useCrud from "../../hooks/useCrud";
import { useEffect } from "react";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { MEDIA_URL } from "../../config";
import { Link } from "react-router-dom";

interface Store {
  id: number;
  name: string;
  image: string;
  relative_image_path: string;
}

type Props = {
  open: boolean;
};

const JavaStores: React.FC<Props> = ({ open }) => {
  // const { dataCRUD, error, isLoading, fetchData } = useCrud<Store>(
  const { dataCRUD, fetchData } = useCrud<Store>([], "/store/select/");

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Box
        sx={{
          height: 50,
          p: 2,
          display: "flex",
          alignItems: "center",
          // The flex item can grow and shrink at the same rate as other items with a flex-grow and flex-shrink value of 1.
          // Its initial size is set to occupy 100% of the available space in the flex container.
          flex: "1 1 100%",
          // backgroundColor: "primary.main",
        }}
      >
        <Typography sx={{ display: open ? "block" : "none" }}>
          <i>Stores</i>
        </Typography>
      </Box>
      <List>
        {dataCRUD.map((item) => (
          <ListItem
            key={item.id}
            disablePadding
            sx={{ display: "block" }}
            dense={true}
          >
            <Link
              to={`/stores/${item.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItemButton sx={{ minHeight: 0 }}>
                <ListItemIcon sx={{ minWidth: 0, justifyContent: "center" }}>
                  <ListItemAvatar sx={{ minWidth: "50px" }}>
                    <Avatar
                      alt="Store Icon"
                      // src={`${item.image}`}
                      src={`${MEDIA_URL}${item.relative_image_path}`}
                    />
                  </ListItemAvatar>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        lineHeight: 1.2,
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.name}
                    </Typography>
                  }
                  sx={{ opacity: open ? 1 : 0 }}
                  primaryTypographyProps={{
                    sx: {
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whitespace: "nowrap",
                    },
                  }}
                />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
    </>
  );
};
export default JavaStores;
