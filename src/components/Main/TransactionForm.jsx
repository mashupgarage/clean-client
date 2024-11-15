import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  IconButton,
  CircularProgress,
  Pagination,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RefreshIcon from "@mui/icons-material/Refresh";
import ExportButtonWithTooltip from "./ExportButtonWithTooltip";
import { useTransactionForm } from "../../hooks/useTransactionForm";
import { formatInTimeZone } from "date-fns-tz";

const TransactionForm = ({ onClose, storeId }) => {
  const [page, setPage] = useState(1);
  const { transactions, loading, error, handleExport, refetch, totalPages } =
    useTransactionForm(storeId, page);

  const handlePageChange = (event, value) => {
    setPage(value);
    refetch(value);
  };

  if (loading) {
    return (
      <Box
        sx={{ width: "100%", display: "flex", justifyContent: "center", mt: 2 }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{ width: "100%", display: "flex", justifyContent: "center", mt: 2 }}
      >
        <Typography color="error">Error loading transactions</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
          alignItems: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            mt: 1,
            textAlign: "center",
            flexGrow: 1,
            fontSize: { xs: "1.5rem", md: "2.125rem" }, // Adjust font size based on screen size
          }}
        >
          Transaction Records
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ExportButtonWithTooltip onClick={handleExport} />
          <IconButton color="inherit" onClick={() => refetch(page)}>
            <RefreshIcon />
          </IconButton>
          <IconButton color="inherit" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>
      <TableContainer
          component={Paper}
          sx={{ overflowX: "auto", maxHeight: { xs: "60vh", md: 600 } }}
        >
          <Table stickyHeader aria-label="transaction table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: "10%" }}>Order Number</TableCell>
                <TableCell sx={{ minWidth: 160, maxWidth: 160 }}>
                  Order Date & Time
                </TableCell>
                <TableCell sx={{ width: "10%" }}>Amount ($)</TableCell>
                <TableCell sx={{ minWidth: 100, maxWidth: 200 }}>
                  Status
                </TableCell>
                <TableCell>Refund</TableCell>
                <TableCell>Payment Method</TableCell>
                <TableCell>Retail Store Address</TableCell>
                <TableCell sx={{ minWidth: 120, maxWidth: 300 }}>
                  Product Name
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap", width: "10%" }}>
                  Price X Quantity
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.order_number}>
                  <TableCell>{transaction.order_number}</TableCell>
                  <TableCell>
                    {formatInTimeZone(
                      new Date(transaction.order_date_time),
                      "UTC",
                      "yyyy-MM-dd HH:mm:ss"
                    )}
                  </TableCell>
                  <TableCell>{transaction.amount}</TableCell>
                  <TableCell>{transaction.status}</TableCell>
                  <TableCell>{transaction.refund ? "Yes" : "No"}</TableCell>
                  <TableCell>{transaction.payment_method}</TableCell>
                  <TableCell>{transaction.retail_store_address}</TableCell>
                  <TableCell>{transaction.product_name}</TableCell>
                  <TableCell>{`${transaction.price} X ${transaction.quantity}`}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
};

TransactionForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  storeId: PropTypes.number.isRequired,
};

export default TransactionForm;
