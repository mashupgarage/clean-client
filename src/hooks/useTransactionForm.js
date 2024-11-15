import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

import { BASE_URL } from "../config";

export const useTransactionForm = (storeId, page) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1); // totalPages state

  const fetchTransactions = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        // http://127.0.0.1:8080/api/transactions/by-store/?store_id=1
        const response = await axios.get(`${BASE_URL}/transactions/by-store/`, {
          params: {
            store_id: storeId,
            page: page, // Add page parameter
          },
        });
        setTransactions(response.data.results); // Assuming the paginated data is in the 'results' field
        setTotalPages(Math.ceil(response.data.count / 10)); // Assuming the page size is 10
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    [storeId]
  );

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions, page]);

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(transactions);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transactions");
    // Instead of directly writing the file, build a Blob
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
    const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });

    // Create a URL for the blob
    const url = URL.createObjectURL(blob);

    // Create a temporary anchor element and trigger the download
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "transactions.xlsx"; // Default name, user can change it in the save dialog
    document.body.appendChild(anchor); // Append anchor to body
    anchor.click(); // Simulate click on the anchor to trigger the download
    document.body.removeChild(anchor); // Remove anchor from body

    // Cleanup the URL object
    URL.revokeObjectURL(url);
  };

  // Utility function to convert a binary string to an array buffer,
  // as required for Blob from binary string data
  function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) {
      view[i] = s.charCodeAt(i) & 0xff;
    }
    return buf;
  }

  return {
    transactions,
    loading,
    error,
    handleExport,
    refetch: fetchTransactions,
    totalPages,
  };
};
