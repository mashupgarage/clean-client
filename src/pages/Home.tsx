import { useEffect, useState } from "react";
import { Box, CssBaseline } from "@mui/material";
import PrimaryAppBar from "./templates/PrimaryAppBar";
import MachineDraw from "./templates/MachineDraw";
import Main from "./templates/Main";
import TransactionForm from "../components/Main/TransactionForm";
import VendingMachines from "../components/Drawer/VendingMachines";
import WelcomeMessage from "../components/Main/WelcomeMessage";
import useCrud from "../hooks/useCrud";
import { useAuth } from "../contexts/AuthContext";
import { Store } from "../@types/store";

const Home = () => {
  const { storeId } = useAuth();

  // const { dataCRUD, error, isLoading, fetchData } = useCrud<Store>(
  const { dataCRUD, fetchData } = useCrud<Store>(
    [],
    `/store/select/?by_storeId=${storeId}`, // filter data by storeId
  );

  const [showTransactions, setShowTransactions] = useState(false);

  useEffect(() => {
    fetchData(); // fetch data from API
  }, []);

  const handleShowTransactions = () => {
    setShowTransactions(true);
  };

  const handleCloseTransactions = () => {
    setShowTransactions(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <PrimaryAppBar onShowTransactions={handleShowTransactions} />
      <MachineDraw>
        <VendingMachines data={dataCRUD} />
      </MachineDraw>
      <Main>
        {showTransactions ? (
          <Box sx={{ m: 2 }}>
            <TransactionForm
              onClose={handleCloseTransactions}
              storeId={Number(storeId)} // Convert storeId to number
            />
          </Box>
        ) : (
          <WelcomeMessage data={dataCRUD} />
        )}
      </Main>
    </Box>
  );
};

export default Home;
