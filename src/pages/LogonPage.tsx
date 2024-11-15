import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import useCrud from "../hooks/useCrud";
import axiosWithInterceptor from "../helpers/jwtinterceptor";
import { useAuth } from "../contexts/AuthContext";

interface Store {
  // TODO: Simplify this interface
  id: string;
  name: string;
  owner: string;
  address: string;
  description: string;
  managers: number[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  machines: any[];
  image: string;
  relative_image_path: string;
}

const LogonPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // const [storeId, setStoreId] = useState("");
  const [loginError, setLoginError] = useState(""); // state for handling login errors

  const [stores, setStores] = useState<Store[]>([]);
  const [store, setStore] = useState<Store>({} as Store);
  const navigate = useNavigate();
  const axiosInstance = axiosWithInterceptor();
  const { isAuthenticated, login, setStoreId, storeId } = useAuth();

  const { dataCRUD, fetchData } = useCrud<Store>([], "/store/select/");
  useEffect(() => {
    // Fetch stores from the backend and set them in state
    fetchData();
  }, []);

  useEffect(() => {
    if (dataCRUD && dataCRUD.length > 0) {
      console.log("Stores:", dataCRUD);
      setStores(dataCRUD);
    }
    // For testing purposes, automatically log in when dataCRUD changes
    // login(); // Set isAuthenticated to true using context
    // navigate("/");
  }, [dataCRUD]); // This effect depends on `dataCRUD` and runs whenever `dataCRUD` changes

  useEffect(() => {
    if (isAuthenticated) {
      // if (!isEmpty(store)) {
      //   const path = `/stores/${storeId}/${store.machines[0].id}`;
      //   // console.log("Path:", path);
      //   // navigate(path);
      // }
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    // console.log(username, password, storeId);

    setLoginError(""); // Reset login error message before each attempt

    try {
      const response = await axiosInstance.post("/account/login/", {
        username,
        password,
        store_id: storeId,
      });

      console.log("Login success:", response.data);
      // find store by id in stores array
      // find store by id in stores array
      const selectedStore = stores.find((store) => store.id === storeId);
      if (selectedStore) {
        setStore(selectedStore);
      }
      // console.log("Store:", store);
      setStoreId(storeId); // This sets the storeId in the context
      // Save storeId in local storage
      localStorage.setItem("store_id", storeId);

      // Save token in local storage
      localStorage.setItem("token", response.data.token); // Store the token
      login(); // Set isAuthenticated to true using context
      navigate("/"); // Navigate to home page or desired protected page
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Login error:", error);
      // Assume the backend provides an error message in the response
      setLoginError(
        error.response.data.message ||
          "Login failed. Please check your credentials and try again.",
      );
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleLogin}
      sx={{
        "& .MuiTextField-root": { m: 1, width: "25ch" },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Typography variant="h5">Login to Your Account</Typography>
      {stores.length > 0 && (
        <TextField
          required
          id="store-select"
          select
          label="Select Store"
          value={storeId}
          onChange={(e) => setStoreId(e.target.value)}
        >
          {stores.map((store) => (
            <MenuItem key={store.id} value={store.id}>
              {store.name}
            </MenuItem>
          ))}
        </TextField>
      )}
      {/* Never showup, just to prevent TS error */}
      {store && store.name && (
        <Typography variant="body1">
          Currently Selected Store: {store.name}
        </Typography>
      )}
      <TextField
        required
        id="username"
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        required
        id="password"
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {/* Conditionally render an error alert if there's a login error */}
      {loginError && <Alert severity="error">{loginError}</Alert>}
      <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
        Log In
      </Button>
    </Box>
  );
};

export default LogonPage;
