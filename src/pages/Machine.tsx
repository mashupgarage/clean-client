import { Box, CssBaseline } from "@mui/material";
import PrimaryAppBar from "./templates/PrimaryAppBar";
import MachineDraw from "./templates/MachineDraw";
import Main from "./templates/Main";
import MessageInterface from "../components/Main/MessageInterface";
import TransactionForm from "../components/Main/TransactionForm";
import VendingMachines from "../components/Drawer/VendingMachines";
import { useParams, useNavigate } from "react-router-dom";
import { Store } from "../@types/store";
import useCrud from "../hooks/useCrud";
import { useEffect, useState } from "react";

const Machine = () => {
  const navigate = useNavigate();
  const { storeId } = useParams();
  // console.log(`storeId: ${storeId}, machineId: ${machineId}`);
  const { dataCRUD, error, fetchData } = useCrud<Store>(
    [],
    `/store/select/?by_storeId=${storeId}`, // filter data by storeId
  );

  const [showTransactions, setShowTransactions] = useState(false);

  useEffect(() => {
    if (error !== null && error.message === "400") {
      // if there's' error and error.message is 400 (Bad Request), then redirect to home page
      navigate("/");
    }
  }, [error, navigate]); // Dependency array includes error and navigate

  useEffect(() => {
    fetchData(); // fetch data from API
  }, []); // Empty dependency array ensures this runs only once after the component mounts

  const handleShowTransactions = () => {
    setShowTransactions(true);
  };

  const handleCloseTransactions = () => {
    setShowTransactions(false);
  };

  // The conditional return null; statement is moved below all hook calls, ensuring that hook calls remain consistent across all renders.
  if (error !== null && error.message === "400") {
    return null;
  }

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
          <MessageInterface data={dataCRUD} />
        )}
      </Main>
    </Box>
  );
};

export default Machine;
