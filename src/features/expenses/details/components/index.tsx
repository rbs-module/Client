"use client";
import { useGetExpensesQuery } from "@/services/expenses";
import { useAppSelector } from "@/store/hook";
import { TransactionFormatted } from "@/types/Transaction";
import { Box } from "@mui/material";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import VoucherView from "./voucher-view";

function ExpenseDetails() {
  const { id } = useParams();
  const query = useAppSelector((state) => state.expenses.query);
  const { data } = useGetExpensesQuery(query);
  const [transaction, setTransaction] = useState<TransactionFormatted>();
  useEffect(() => {
    if (data?.transactions && id) {
      const find = data.transactions.find((item) => item._id == id);
      setTransaction(find);
    }
  }, [data?.transactions, id]);

  return (
    <Box>
      {transaction?.type == "expense" ||
      transaction?.type == "purchase" ||
      transaction?.type == "salary_advance" ? (
        <VoucherView transaction={transaction} />
      ) : (
        <pre>
          <code>{JSON.stringify(transaction, null, 2)}</code>
        </pre>
      )}
    </Box>
  );
}

export default ExpenseDetails;
